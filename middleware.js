import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Routes that require login
const PROTECTED = ['/dashboard', '/profile', '/saved'];

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED.some(route => pathname.startsWith(route));
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get('voyara_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/', req.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/saved/:path*'],
};