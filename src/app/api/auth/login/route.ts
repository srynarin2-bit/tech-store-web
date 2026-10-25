import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const mockUser = {
      id: 'usr_demo',
      name: email.split('@')[0],
      email: email,
      role: 'customer',
    };

    const response = NextResponse.json({ success: true, user: mockUser });
    response.cookies.set('session_token', mockUser.id, {
      httpOnly: true,
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}