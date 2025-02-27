import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    try {
        const token = await getToken({ req: request })
        const url = request.nextUrl;

        // If token is present and user want to access the login or signup page
        if (token && (
            url.pathname.startsWith('/login') ||
            url.pathname.startsWith('/signup')
        )) {
            if (token?.needsUsernameUpdate) {
                return NextResponse.redirect(new URL('/select-username', request.url))
            } else {
                return NextResponse.redirect(new URL('/', request.url))
            }
        }

        // If username is needs to be updated, and user want to access the secure pages
        if (token && token?.needsUsernameUpdate && (
            url.pathname.endsWith('/') ||
            url.pathname.startsWith('/profile') ||
            url.pathname.startsWith('/explore') ||
            url.pathname.startsWith('/search') ||
            url.pathname.startsWith('/post-tweet')
        )) {
            return NextResponse.redirect(new URL('/select-username', request.url))
        }

        // if the token is not present and user want to access the home page
        if (!token && (
            url.pathname.endsWith('/') ||
            url.pathname.startsWith('/select-username') ||
            url.pathname.startsWith('/profile') ||
            url.pathname.startsWith('/explore') ||
            url.pathname.startsWith('/search') ||
            url.pathname.startsWith('/post-tweet')
        )) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

    } catch (error) {
        console.error('Error in middleware:', error)
        return NextResponse.error()
    }
}

export const config = {
    matcher: [
        '/login',
        '/signup',
        '/',
        '/select-username',
        '/profile/:path*',
        '/explore',
        '/search',
        "/post-tweet"
    ]
}