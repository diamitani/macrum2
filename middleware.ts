
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if user is authenticated
  const authCookie = request.cookies.get('macrum_auth')
  const isAuthenticated = authCookie?.value === 'true'
  
  // Get the pathname
  const { pathname } = request.nextUrl

  // Define protected routes (dashboard routes)
  const protectedRoutes = [
    '/',
    '/businesses',
    '/projects', 
    '/tasks',
    '/clients',
    '/calendar',
    '/files',
    '/notebook'
  ]

  // Define auth routes
  const authRoutes = ['/auth/signin', '/auth/signup']

  // If user is not authenticated and trying to access protected route
  if (!isAuthenticated && protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/marketing', request.url))
  }

  // If user is authenticated and trying to access auth routes
  if (isAuthenticated && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If accessing root and not authenticated, redirect to marketing
  if (pathname === '/' && !isAuthenticated) {
    return NextResponse.redirect(new URL('/marketing', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|marketing).*)',
  ],
}
