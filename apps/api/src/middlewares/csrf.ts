import type { Context, Next } from 'hono';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export function originCheck(allowedOrigin?: string) {
  return async (c: Context, next: Next) => {
    if (SAFE_METHODS.has(c.req.method)) {
      return next();
    }
    const origin = c.req.header('origin');
    const expected = allowedOrigin || process.env.CSRF_ALLOWED_ORIGIN || `http://localhost:3000`;
    if (!origin || origin !== expected) {
      return c.json({ error: { code: 'CSRF_ORIGIN_FORBIDDEN', message: 'Origin not allowed' } }, 403);
    }
    return next();
  };
}
