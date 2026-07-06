'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthContext'

export function AuthRedirect() {
  const { isSignedIn, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isSignedIn) {
      router.replace('/dashboard')
    }
  }, [isLoading, isSignedIn, router])

  return null
}
