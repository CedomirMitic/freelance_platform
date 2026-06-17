import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    // Read token from cookies becaues server doesnt see local storage
    const token = request.cookies.get('AUTH_TOKEN')?.value;
    const { pathname } = request.nextUrl;

    // Protected Routes 
    const protectedRoutes = [
        /^\/projects(\/.*)?$/,
        /^\/profile(\/.*)?$/,
        /^\/applications(\/.*)?$/
    ];

    const isProtected = protectedRoutes.some(route => {
        if (route instanceof RegExp) {
            return route.test(pathname); // If its regex check path
        }
        return pathname.startsWith(route); // If its string ,check starts with
    });

    // If its protected route redirect to login
    if (isProtected && !token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/projects/:path*', '/profile/:path*', '/applications/:path*'],
};