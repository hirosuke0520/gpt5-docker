export type Company = {
  id: number;
  name: string;
  domain?: string | null;
  notes?: string | null;
  createdAt: string;
};

export type Lead = {
  id: number;
  companyId: number;
  contactName: string;
  email?: string | null;
  phone?: string | null;
  source: 'web' | 'referral' | 'event' | 'other';
  status: 'new' | 'qualified' | 'lost';
  score: number;
  createdAt: string;
  company?: Company;
};

export type Deal = {
  id: number;
  leadId: number;
  title: string;
  amount: number;
  stage: 'prospecting' | 'proposal' | 'negotiation' | 'won' | 'lost';
  expectedCloseDate?: string | null;
  createdAt: string;
};

export type Activity = {
  id: number;
  leadId: number;
  type: 'note' | 'task' | 'call' | 'email';
  content: string;
  dueDate?: string | null;
  completed: boolean;
  createdAt: string;
};
