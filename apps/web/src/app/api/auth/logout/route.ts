import { NextResponse } from 'next/server';

export async function POST() {
  const apiBase = process.env.API_BASE_URL || 'http://localhost:8787';
  const res = await fetch(`${apiBase}/auth/logout`, { method: 'POST', credentials: 'include' });
  const headers = new Headers();
  res.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'set-cookie') {
      headers.append('set-cookie', value);
    }
  });
  return new NextResponse(null, { status: 204, headers });
}
