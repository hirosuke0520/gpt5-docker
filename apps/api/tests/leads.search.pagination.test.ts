import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { serve } from '@hono/node-server';

let server: any;
const baseURL = 'http://localhost:9011';
let cookie: string = '';

beforeAll(async () => {
  const app = createApp();
  server = serve({ fetch: app.fetch, port: 9011 });
  const login = await request(baseURL)
    .post('/auth/login')
    .set('Origin', 'http://localhost:3000')
    .send({ email: 'admin@example.com', password: 'password123' });
  cookie = login.headers['set-cookie']?.[0];
});

afterAll(async () => {
  server?.close?.();
});

describe('leads search and pagination', () => {
  it('paginates with page and pageSize', async () => {
    const res = await request(baseURL).get('/leads?page=1&pageSize=10').set('Cookie', cookie);
    expect(res.status).toBe(200);
    expect(res.body.page).toBe(1);
    expect(res.body.pageSize).toBe(10);
    expect(res.body.items.length).toBeLessThanOrEqual(10);
  });

  it('filters by status', async () => {
    const res = await request(baseURL).get('/leads?status=new').set('Cookie', cookie);
    expect(res.status).toBe(200);
    expect(res.body.items.every((l: any) => l.status === 'new' || l.status === 'qualified' || l.status === 'lost')).toBe(true);
  });
});
