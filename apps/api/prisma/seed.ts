import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/password.js';

const prisma = new PrismaClient();

function randomChoice<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randomInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

async function main() {
  // Reset non-user data to keep seed idempotent
  await prisma.activity.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.company.deleteMany();

  // Users
  const adminPassword = await hashPassword('password123');
  const memberPassword = await hashPassword('password123');

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: { email: 'admin@example.com', passwordHash: adminPassword, role: 'admin' }
  });
  await prisma.user.upsert({
    where: { email: 'member@example.com' },
    update: {},
    create: { email: 'member@example.com', passwordHash: memberPassword, role: 'member' }
  });

  // Companies (5)
  const companyNames = ['Acme Inc', 'Globex', 'Initech', 'Umbrella', 'Soylent'];
  const companies = [] as { id: number; name: string }[];
  for (let i = 0; i < companyNames.length; i++) {
    const name = companyNames[i];
    const created = await prisma.company.create({
      data: { name, domain: `company${i + 1}.com`, notes: 'Demo company' }
    });
    companies.push(created);
  }

  // Leads: 10 per company (total 50), each with at least one Deal and one Activity
  const sources = ['web', 'referral', 'event', 'other'] as const;
  const statuses = ['new', 'qualified', 'lost'] as const;
  const leads = [] as { id: number }[];

  for (const company of companies) {
    for (let j = 0; j < 10; j++) {
      const index = leads.length + 1;
      const lead = await prisma.lead.create({
        data: {
          companyId: company.id,
          contactName: `Contact ${company.name.split(' ')[0]}-${j + 1}`,
          email: `lead${index}@example.com`,
          phone: `000-000-${String(1000 + index)}`,
          source: randomChoice(sources) as any,
          status: randomChoice(statuses) as any,
          score: randomInt(10, 95)
        }
      });
      leads.push(lead);

      // At least one open Deal per lead, sometimes a second deal
      const stagesOpen = ['prospecting', 'proposal', 'negotiation'] as const;
      const stagesAny = ['prospecting', 'proposal', 'negotiation', 'won', 'lost'] as const;
      await prisma.deal.create({
        data: {
          leadId: lead.id,
          title: `Initial Deal for ${lead.contactName}`,
          amount: (1000 + randomInt(0, 9000)).toFixed(2),
          stage: randomChoice(stagesOpen) as any,
          expectedCloseDate: new Date(Date.now() + randomInt(7, 60) * 86400000)
        }
      });
      if (Math.random() > 0.5) {
        await prisma.deal.create({
          data: {
            leadId: lead.id,
            title: `Upsell Deal for ${lead.contactName}`,
            amount: (2000 + randomInt(0, 15000)).toFixed(2),
            stage: randomChoice(stagesAny) as any,
            expectedCloseDate: new Date(Date.now() + randomInt(10, 90) * 86400000)
          }
        });
      }

      // Activities: one incomplete due this week and one completed in the past
      const now = new Date();
      const startOfWeek = new Date(now);
      const day = startOfWeek.getDay();
      const diff = (day + 6) % 7; // Monday start
      startOfWeek.setDate(startOfWeek.getDate() - diff);

      await prisma.activity.create({
        data: {
          leadId: lead.id,
          type: 'task',
          content: `Follow up with ${lead.contactName}`,
          dueDate: new Date(startOfWeek.getTime() + randomInt(0, 6) * 86400000),
          completed: false
        }
      });
      await prisma.activity.create({
        data: {
          leadId: lead.id,
          type: 'note',
          content: `Initial note for ${lead.contactName}`,
          dueDate: new Date(now.getTime() - randomInt(1, 14) * 86400000),
          completed: true
        }
      });
    }
  }

  // Additional random deals to diversify pipeline (optional small set)
  for (let i = 0; i < 10; i++) {
    const lead = randomChoice(leads);
    await prisma.deal.create({
      data: {
        leadId: lead.id,
        title: `Extra Deal ${i + 1}`,
        amount: (1500 + randomInt(0, 12000)).toFixed(2),
        stage: randomChoice(['prospecting', 'proposal', 'negotiation', 'won', 'lost'] as const) as any,
        expectedCloseDate: new Date(Date.now() + randomInt(1, 90) * 86400000)
      }
    });
  }

  // Extra random activities
  const activityTypes = ['note', 'task', 'call', 'email'] as const;
  for (let i = 0; i < 50; i++) {
    const lead = randomChoice(leads);
    await prisma.activity.create({
      data: {
        leadId: lead.id,
        type: randomChoice(activityTypes) as any,
        content: `Activity ${i + 1}`,
        dueDate: Math.random() > 0.5 ? new Date(Date.now() + randomInt(-7, 14) * 86400000) : null,
        completed: Math.random() > 0.5
      }
    });
  }

  console.log('Seed completed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
