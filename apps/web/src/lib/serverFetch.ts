import { headers, cookies } from 'next/headers';

export function makeInternalUrl(pathWithQuery: string): string {
  const hdrs = headers();
  const host = hdrs.get('host') || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const path = pathWithQuery.startsWith('/') ? pathWithQuery : `/${pathWithQuery}`;
  return `${protocol}://${host}${path}`;
}

export function getCookieHeader(): string {
  try {
    const all = cookies().getAll();
    return all.map((c) => `${c.name}=${encodeURIComponent(c.value)}`).join('; ');
  } catch {
    return '';
  }
}
