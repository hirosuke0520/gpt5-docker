import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { errorHandler } from './middlewares/error.js';
import { authRequired } from './middlewares/auth.js';
import { originCheck } from './middlewares/csrf.js';
import authRouter from './routes/auth.js';
import companiesRouter from './routes/companies.js';
import leadsRouter from './routes/leads.js';
import dealsRouter from './routes/deals.js';
import activitiesRouter from './routes/activities.js';
import kpisRouter from './routes/kpis.js';

export function createApp() {
  const app = new Hono();

  app.use('*', errorHandler);
  app.use('*', cors({ origin: (origin) => origin || '*', credentials: true }));

  app.route('/auth', authRouter);

  // CSRF origin check for state-changing routes
  app.use('*', originCheck(process.env.CSRF_ALLOWED_ORIGIN));

  // Auth required beyond this point
  app.use('*', authRequired());

  app.route('/companies', companiesRouter);
  app.route('/leads', leadsRouter);
  app.route('/deals', dealsRouter);
  app.route('/activities', activitiesRouter);
  app.route('/kpis', kpisRouter);

  return app;
}
