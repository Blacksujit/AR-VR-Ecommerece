import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isProtectedPath } from '@/lib/route-policy'


export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isProtected = isProtectedPath(pathname)
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
    '/((?!_next|_vercel|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|json)).*)',
  ],
}
