import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  const { pathname } = request.nextUrl

  if (pathname.startsWith('/api') && !pathname.startsWith('/api/auth')) {
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const requestHeaders = new Headers(request.headers)

    requestHeaders.set('x-user-id', String(session.user.id))
    requestHeaders.set('x-user-email', session.user.email)
    requestHeaders.set('x-user-name', session.user.name)

    return NextResponse.next({
      request: {
        headers: requestHeaders
      }
    })
  }

  const isPublicRoute = pathname === '/sign-in' || pathname.startsWith('/api/auth')

  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/api/:path*']
}
