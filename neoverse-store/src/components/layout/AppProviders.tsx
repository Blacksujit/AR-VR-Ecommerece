'use client'

import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/components/auth/AuthContext'
import { CartSidebar } from '@/components/cart/CartSidebar'
import { QueryProvider } from './QueryProvider'
import type { ReactNode } from 'react'

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
        <CartSidebar />
      </AuthProvider>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#111827',
            color: '#f8fafc',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      />
    </QueryProvider>
  )
}
