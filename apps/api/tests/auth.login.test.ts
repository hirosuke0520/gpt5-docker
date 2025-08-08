import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { serve } from '@hono/node-server';

let server: any;
let url = 'http://localhost:9001';

beforeAll(async () => {
  const app = createApp();
  server = serve({ fetch: app.fetch, port: 9001 });
});

afterAll(async () => {
  server?.close?.();
});

describe('POST /auth/login', () => {
  it('fails with invalid credentials', async () => {
    const res = await request(url)
      .post('/auth/login')
      .send({ email: 'no@example.com', password: 'password123' });
    expect(res.status).toBe(401);
    expect(res.body?.error?.code).toBeDefined();
  });
});
