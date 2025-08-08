import type { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import { verifyJwt } from '../lib/jwt.js';

declare module 'hono' {
  interface ContextVariableMap {
    user?: { id: string; role: 'admin' | 'member' };
  }
}

export function authRequired() {
  return async (c: Context, next: Next) => {
    const token = getCookie(c, 'crm_jwt');
    const secret = process.env.JWT_SECRET || 'dev-secret';
    if (!token) {
      return c.json({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }, 401);
    }
    const payload = verifyJwt<{ sub: string; role: 'admin' | 'member' }>(token, secret);
    if (!payload) {
      return c.json({ error: { code: 'UNAUTHORIZED', message: 'Invalid token' } }, 401);
    }
    c.set('user', { id: payload.sub, role: payload.role });
    await next();
  };
}
