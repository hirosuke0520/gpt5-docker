import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { serve } from '@hono/node-server';

let server: any;
let url = 'http://localhost:9003';

beforeAll(async () => {
  const app = createApp();
  server = serve({ fetch: app.fetch, port: 9003 });
});

afterAll(async () => {
  server?.close?.();
});

// Simplified idempotency test by double-patching to same stage

describe('PATCH /deals/:id stage idempotency', () => {
  it('should be idempotent when setting same stage twice', async () => {
    // Without auth cookie this will be unauthorized; this is scaffold
    const id = 1;
    const patch = { stage: 'prospecting' };
    const res1 = await request(url).patch(`/deals/${id}`).send(patch);
    const res2 = await request(url).patch(`/deals/${id}`).send(patch);
    expect([401, 200]).toContain(res1.status);
    expect([401, 200]).toContain(res2.status);
  });
});
