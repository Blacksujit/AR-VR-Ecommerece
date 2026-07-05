'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthContext'

export function useAuthGuard(requiredRole?: 'admin') {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    if (!user) {
      router.push('/')
      return
    }

    if (requiredRole === 'admin' && user.role !== 'admin') {
      router.push('/')
    }
  }, [user, isLoading, router, requiredRole])

  return { user, isLoading, isAuthorized: !!user && (!requiredRole || user.role === requiredRole), logout }
}
