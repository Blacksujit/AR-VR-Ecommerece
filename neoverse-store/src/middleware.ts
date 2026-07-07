import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_API_URL) return NextResponse.next()
  fetch(process.env.NEXT_PUBLIC_API_URL).catch(() => {})
  return NextResponse.next()
}

export const config = {
  matcher: ['/products/:path*', '/categories/:path*'],
}
