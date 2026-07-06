'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  getIdToken,
  type User as FirebaseUser,
} from 'firebase/auth'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { auth } from '@/lib/firebase'
import { api, type ApiResponse } from '@/lib/api'
import type { User, CartItem } from '@/types'

interface AuthState {
  user: User | null
  firebaseUser: FirebaseUser | null
  isLoading: boolean
  isSignedIn: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

function buildFallbackUser(firebaseUser: FirebaseUser | null): User | null {
  if (!firebaseUser) return null
  return {
    _id: firebaseUser.uid,
    name: firebaseUser.displayName || firebaseUser.email || 'User',
    email: firebaseUser.email || '',
    avatar: firebaseUser.photoURL || '',
    role: 'user',
    wishlist: [],
    addresses: [],
    createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [authInitialized, setAuthInitialized] = useState(false)
  const queryClient = useQueryClient()

  function setSessionCookie(token: string | null) {
    if (typeof document === 'undefined') return
    if (token) {
      document.cookie = `__session=${token};path=/;max-age=3600;samesite=lax`
    } else {
      document.cookie = '__session=;path=/;max-age=0'
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user)
      if (user) {
        const token = await getIdToken(user)
        api.setAuthToken(token)
        setSessionCookie(token)
      } else {
        api.setAuthToken(null)
        setSessionCookie(null)
      }
      if (!authInitialized) setAuthInitialized(true)
    })
    return unsubscribe
  }, [authInitialized])

  useEffect(() => {
    api.setFreshTokenFn(async () => {
      const user = auth.currentUser
      if (!user) return null
      const token = await getIdToken(user)
      setSessionCookie(token)
      return token
    })
  }, [])

  useEffect(() => {
    const interval = setInterval(async () => {
      const user = auth.currentUser
      if (!user) return
      const token = await getIdToken(user, true)
      setSessionCookie(token)
    }, 50 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!firebaseUser) return
    const localCart = localStorage.getItem('neoverse-cart')
    if (!localCart) return
    try {
      const parsed = JSON.parse(localCart)
      const items: CartItem[] = parsed?.state?.items || []
      if (items.length > 0) {
        api.post('/cart/merge', {
          items: items.map((item) => ({
            productId: item.product._id,
            quantity: item.quantity,
          })),
        }).catch(() => {})
      }
    } catch {}
  }, [firebaseUser])

  const hasSession = !!firebaseUser

  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => api.get<ApiResponse<User>>('/users/profile'),
    enabled: !!hasSession,
    retry: 2,
    staleTime: 30_000,
  })

  const user = profileData?.data ?? (profileLoading ? null : buildFallbackUser(firebaseUser))
  const isLoading = !authInitialized || (hasSession && profileLoading && !profileData)

  const logout = useCallback(async () => {
    await firebaseSignOut(auth)
    api.setAuthToken(null)
    setSessionCookie(null)
    queryClient.removeQueries({ queryKey: ['current-user'] })
  }, [queryClient])

  return (
    <AuthContext.Provider value={{ user, firebaseUser, isLoading, isSignedIn: !!hasSession, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
