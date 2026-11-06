import { NextResponse, type NextRequest } from 'next/server'

/**
 * Demo MVP middleware — passthrough only.
 * Supabase Auth integration is deferred; this ensures the demo runs without
 * requiring Supabase credentials. Static assets and API routes are excluded
 * by the matcher below.
 */
export function middleware(request: NextRequest) {
  return NextResponse.next({ request })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
