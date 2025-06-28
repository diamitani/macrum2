
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // For client-side auth, we can't check localStorage in middleware
  // Instead, we'll handle auth checks in the components
  const { pathname } = request.nextUrl
  
  // Only redirect from root to marketing for initial load
  if (pathname === '/') {
    // Let the component handle auth check
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|marketing).*)',
  ],
}
