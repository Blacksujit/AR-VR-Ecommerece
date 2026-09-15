'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'

const queryClientOptions = {
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 2,
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 10000),
    },
  },
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient(queryClientOptions))

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
