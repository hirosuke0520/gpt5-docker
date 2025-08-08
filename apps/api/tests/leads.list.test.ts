import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { serve } from '@hono/node-server';

let server: any;
let url = 'http://localhost:9002';

beforeAll(async () => {
  const app = createApp();
  server = serve({ fetch: app.fetch, port: 9002 });
});

afterAll(async () => {
  server?.close?.();
});

describe('GET /leads', () => {
  it('requires auth', async () => {
    const res = await request(url).get('/leads');
    expect(res.status).toBe(401);
  });
});
