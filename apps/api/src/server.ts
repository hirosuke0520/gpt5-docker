import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { errorHandler } from './middlewares/error.js';
import { authRequired } from './middlewares/auth.js';
import { originCheck } from './middlewares/csrf.js';
import authRouter from './routes/auth.js';
import companiesRouter from './routes/companies.js';
import leadsRouter from './routes/leads.js';
import dealsRouter from './routes/deals.js';
import activitiesRouter from './routes/activities.js';

const app = new Hono();

app.use('*', errorHandler);
app.use('*', cors({ origin: (origin) => origin || '*', credentials: true }));

app.route('/auth', authRouter);

// CSRF origin check for state-changing routes
app.use('*', originCheck(process.env.CSRF_ALLOWED_ORIGIN));

// Auth required
app.use('*', authRequired());

app.route('/companies', companiesRouter);
app.route('/leads', leadsRouter);
app.route('/deals', dealsRouter);
app.route('/activities', activitiesRouter);

const port = Number(process.env.PORT || 8787);
console.log(`API server starting on :${port}`);
serve({ fetch: app.fetch, port });
