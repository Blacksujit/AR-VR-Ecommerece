import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedPaths = ['/dashboard', '/admin', '/wishlist', '/checkout']

const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (apiUrl) {
    fetch(apiUrl.replace('/api', '/api/health')).catch(() => {})
  }

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p))
  if (isProtected) {
    const authToken = req.cookies.get('__session')?.value
    if (!authToken) {
      const signInUrl = new URL('/sign-in', req.url)
      signInUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(signInUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next|_vercel|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|json)).*)',
  ],
}