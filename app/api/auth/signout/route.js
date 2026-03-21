import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json(
    { success: true, message: 'Signed out successfully.' },
    { status: 200 }
  );

  // Clear the cookie
  response.cookies.set('voyara_token', '', {
    httpOnly: true,
    expires:  new Date(0),
    path:     '/',
  });

  return response;
}