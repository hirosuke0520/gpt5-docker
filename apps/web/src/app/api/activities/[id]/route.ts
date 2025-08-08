import { NextRequest } from 'next/server';
import { proxy } from '../../_utils';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return proxy(req, `/activities/${params.id}`);
}
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  return proxy(req, `/activities/${params.id}`);
}
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return proxy(req, `/activities/${params.id}`);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  // Method override for forms (PATCH via POST)
  const contentType = req.headers.get('content-type') || '';
  if (contentType.includes('application/x-www-form-urlencoded')) {
    const text = await req.text();
    const form = new URLSearchParams(text);
    const method = (form.get('_method') || 'POST').toUpperCase();
    form.delete('_method');
    const body = Object.fromEntries(form.entries());
    const apiBase = process.env.API_BASE_URL || 'http://localhost:8787';
    const res = await fetch(`${apiBase}/activities/${params.id}`, {
      method,
      headers: { 'Content-Type': 'application/json', origin: `${new URL(req.url).origin}` },
      body: JSON.stringify(body),
      credentials: 'include'
    });
    const headers = new Headers();
    res.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') headers.append('set-cookie', value);
    });
    return new Response(await res.text(), { status: res.status, headers });
  }
  return proxy(req, `/activities/${params.id}`);
}
