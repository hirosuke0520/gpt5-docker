import type { Context, Next } from 'hono';

export async function errorHandler(c: Context, next: Next) {
  try {
    await next();
  } catch (err: any) {
    console.error(err);
    const code = err?.code || 'INTERNAL_ERROR';
    const message = err?.message || 'Internal Server Error';
    return c.json({ error: { code, message } }, 500);
  }
}
