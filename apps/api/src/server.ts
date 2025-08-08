import { serve } from '@hono/node-server';
import { createApp } from './app.js';

const app = createApp();

const port = Number(process.env.PORT || 8787);
console.log(`API server starting on :${port}`);
serve({ fetch: app.fetch, port });
