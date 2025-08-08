import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/password.js';

const prisma = new PrismaClient();

function randomChoice<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randomInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

async function main() {
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

  // Companies
  const companyNames = ['Acme Inc', 'Globex', 'Initech', 'Umbrella', 'Soylent'];
  const companies = await Promise.all(companyNames.map((name, idx) =>
    prisma.company.upsert({
      where: { name },
      update: {},
      create: { name, domain: `company${idx + 1}.com`, notes: 'Demo company' }
    })
  ));

  // Leads (50)
  const sources = ['web', 'referral', 'event', 'other'] as const;
  const statuses = ['new', 'qualified', 'lost'] as const;
  const leads = [] as { id: number }[];
  for (let i = 0; i < 50; i++) {
    const company = randomChoice(companies);
    const lead = await prisma.lead.create({
      data: {
        companyId: company.id,
        contactName: `Contact ${i + 1}`,
        email: `lead${i + 1}@example.com`,
        phone: `000-000-${String(1000 + i)}`,
        source: randomChoice(sources) as any,
        status: randomChoice(statuses) as any,
        score: randomInt(0, 100)
      }
    });
    leads.push(lead);
  }

  // Deals (30)
  const stages = ['prospecting', 'proposal', 'negotiation', 'won', 'lost'] as const;
  for (let i = 0; i < 30; i++) {
    const lead = randomChoice(leads);
    await prisma.deal.create({
      data: {
        leadId: lead.id,
        title: `Deal ${i + 1}`,
        amount: (1000 + randomInt(0, 9000)).toFixed(2),
        stage: randomChoice(stages) as any,
        expectedCloseDate: new Date(Date.now() + randomInt(1, 60) * 86400000)
      }
    });
  }

  // Activities (100)
  const activityTypes = ['note', 'task', 'call', 'email'] as const;
  for (let i = 0; i < 100; i++) {
    const lead = randomChoice(leads);
    await prisma.activity.create({
      data: {
        leadId: lead.id,
        type: randomChoice(activityTypes) as any,
        content: `Activity ${i + 1}`,
        dueDate: Math.random() > 0.5 ? new Date(Date.now() + randomInt(-7, 14) * 86400000) : null,
        completed: Math.random() > 0.6
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
