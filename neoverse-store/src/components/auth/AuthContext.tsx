'use client'

import { createContext, useContext, useEffect, useRef, useCallback, type ReactNode } from 'react'
import { useUser, useAuth as useClerkAuth } from '@clerk/nextjs'
import { useQuery } from '@tanstack/react-query'
import { api, type ApiResponse } from '@/lib/api'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  isLoading: boolean
  isSignedIn: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

const TOKEN_REFRESH_MS = 10 * 60 * 1000

function buildFallbackUser(clerkUser: NonNullable<ReturnType<typeof useUser>['user']> | null | undefined): User | null {
  if (!clerkUser) return null
  return {
    _id: clerkUser.id,
    name: clerkUser.fullName || clerkUser.primaryEmailAddress?.emailAddress || 'User',
    email: clerkUser.primaryEmailAddress?.emailAddress || '',
    avatar: clerkUser.imageUrl || '',
    role: 'user',
    wishlist: [],
    addresses: [],
    createdAt: clerkUser.createdAt?.toISOString?.() || new Date().toISOString(),
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser()
  const { getToken, signOut } = useClerkAuth()
  const getTokenRef = useRef(getToken)
  getTokenRef.current = getToken

  const hasSession = !!clerkUser

  useEffect(() => {
    let cancelled = false
    const refresh = async () => {
      try {
        const token = await getTokenRef.current()
        if (!cancelled) api.setAuthToken(token)
      } catch {
        if (!cancelled) api.setAuthToken(null)
      }
    }
    refresh()
    api.setFreshTokenFn(() => getTokenRef.current())
    const interval = setInterval(refresh, TOKEN_REFRESH_MS)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [hasSession])

  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => api.get<ApiResponse<User>>('/users/profile'),
    enabled: !!hasSession,
    retry: 2,
    staleTime: 30_000,
  })

  const user = profileData?.data ?? (profileLoading ? null : buildFallbackUser(clerkUser))
  const isLoading = !clerkLoaded || (hasSession && profileLoading && !profileData)

  const logout = useCallback(async () => {
    await signOut()
    api.setAuthToken(null)
  }, [signOut])

  return (
    <AuthContext.Provider value={{ user, isLoading, isSignedIn: !!hasSession, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
