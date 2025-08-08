export async function apiFetch(path: string, init?: RequestInit) {
  const base = process.env.API_BASE_URL || 'http://localhost:8787';
  const res = await fetch(base + path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {})
    },
    credentials: 'include'
  });
  if (!res.ok) {
    let err: any = {}
    try { err = await res.json(); } catch {}
    throw new Error(err?.error?.message || `API error: ${res.status}`);
  }
  return res;
}
