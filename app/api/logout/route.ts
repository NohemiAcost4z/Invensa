import { NextResponse } from 'next/server';
import { connection } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST() {
  const token = (await cookies()).get('sesion')?.value;

  if (token) {
    await connection.execute(
      'UPDATE usuario SET Session_Token = NULL WHERE Session_Token = ?',
      [token]
    );
  }

  const res = NextResponse.json({ success: true });

  res.cookies.set('sesion', '', {
    maxAge: 0,
    path: '/',
  });

  return res;
}
