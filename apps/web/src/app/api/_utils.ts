import { NextRequest, NextResponse } from 'next/server';

export function forwardCookiesFromApi(res: Response) {
  const headers = new Headers();
  res.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'set-cookie') {
      headers.append('set-cookie', value);
    }
  });
  return headers;
}

export async function proxy(req: NextRequest, path: string) {
  const apiBase = process.env.API_BASE_URL || 'http://localhost:8787';
  const url = new URL(req.url);
  const target = `${apiBase}${path}${url.search}`;
  const res = await fetch(target, {
    method: req.method,
    headers: {
      'content-type': req.headers.get('content-type') || undefined,
      origin: `${url.protocol}//${url.host}`
    },
    body: req.method === 'GET' || req.method === 'HEAD' ? undefined : await req.text(),
    credentials: 'include'
  });
  const headers = forwardCookiesFromApi(res);
  const text = await res.text();
  return new NextResponse(text, { status: res.status, headers });
}
