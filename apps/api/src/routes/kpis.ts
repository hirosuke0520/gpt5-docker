import { Hono } from 'hono';
import { prisma } from '../lib/prisma.js';

const router = new Hono();

router.get('/', async (c) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfWeek = new Date(startOfToday);
  const day = startOfWeek.getDay();
  const diff = (day + 6) % 7; // Monday as start
  startOfWeek.setDate(startOfWeek.getDate() - diff);

  const [todayLeads, openDealsAmount, dueActivities] = await Promise.all([
    prisma.lead.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.deal.aggregate({
      _sum: { amount: true },
      where: { stage: { in: ['prospecting', 'proposal', 'negotiation'] } }
    }),
    prisma.activity.count({ where: { completed: false, dueDate: { gte: startOfWeek } } })
  ]);

  const openDealsTotal = openDealsAmount._sum.amount ?? 0;
  return c.json({ todayLeads, openDealsTotal, dueActivities });
});

export default router;
