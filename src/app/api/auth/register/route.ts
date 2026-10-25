import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const mockUser = {
      id: 'usr_' + Date.now(),
      name,
      email,
      role: 'customer',
    };

    const response = NextResponse.json({ success: true, user: mockUser });
    response.cookies.set('session_token', mockUser.id, {
      httpOnly: true,
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}