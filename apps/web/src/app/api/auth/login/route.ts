import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const apiBase = process.env.API_BASE_URL || 'http://localhost:8787';
  const res = await fetch(`${apiBase}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    credentials: 'include'
  });

  const headers = new Headers();
  res.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'set-cookie') {
      headers.append('set-cookie', value);
    }
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    return new NextResponse(JSON.stringify(data), { status: res.status, headers });
  }
  const data = await res.json();
  return new NextResponse(JSON.stringify(data), { status: 200, headers });
}
