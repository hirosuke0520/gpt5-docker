import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { serve } from '@hono/node-server';

let server: any;
const baseURL = 'http://localhost:9010';

beforeAll(async () => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'please-change-me';
  process.env.CSRF_ALLOWED_ORIGIN = process.env.CSRF_ALLOWED_ORIGIN || 'http://localhost:3000';
  const app = createApp();
  server = serve({ fetch: app.fetch, port: 9010 });
});

afterAll(async () => {
  server?.close?.();
});

describe('auth login success and access protected resource', () => {
  it('logs in and fetches leads', async () => {
    const login = await request(baseURL)
      .post('/auth/login')
      .set('Origin', 'http://localhost:3000')
      .send({ email: 'admin@example.com', password: 'password123' });
    expect(login.status).toBe(200);
    const cookie = login.headers['set-cookie']?.[0];
    expect(cookie).toBeTruthy();

    const leads = await request(baseURL).get('/leads').set('Cookie', cookie);
    expect(leads.status).toBe(200);
    expect(leads.body).toHaveProperty('items');
  });
});
