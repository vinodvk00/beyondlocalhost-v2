import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // server-side route protection logic can go here
    // e.g., checking cookies, headers, etc.
    // However, since authentication state is often managed client-side,
    // full protection might require client-side checks as well.
    // For now, let client-side handle it
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
