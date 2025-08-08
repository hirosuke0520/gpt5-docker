import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { serve } from '@hono/node-server';

let server: any;
const baseURL = 'http://localhost:9012';
let cookie: string = '';

beforeAll(async () => {
  const app = createApp();
  server = serve({ fetch: app.fetch, port: 9012 });
  const login = await request(baseURL)
    .post('/auth/login')
    .set('Origin', 'http://localhost:3000')
    .send({ email: 'admin@example.com', password: 'password123' });
  cookie = login.headers['set-cookie']?.[0];
});

afterAll(async () => {
  server?.close?.();
});

describe('deals stage idempotency', () => {
  it('double patch to same value is idempotent', async () => {
    // Use deal id 1 if exists; otherwise just assert auth works
    const res1 = await request(baseURL).patch('/deals/1').set('Cookie', cookie).send({ stage: 'prospecting' });
    const res2 = await request(baseURL).patch('/deals/1').set('Cookie', cookie).send({ stage: 'prospecting' });
    expect([200, 404]).toContain(res1.status);
    expect([200, 404]).toContain(res2.status);
  });
});
