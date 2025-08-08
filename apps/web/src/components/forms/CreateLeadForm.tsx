"use client";
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  companyId: z.string().min(1),
  contactName: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  source: z.enum(['web', 'referral', 'event', 'other']).default('web'),
  status: z.enum(['new', 'qualified', 'lost']).default('new'),
  score: z.coerce.number().int().min(0).default(0)
});

type FormValues = z.infer<typeof schema>;

export default function CreateLeadForm() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { source: 'web', status: 'new', score: 0 } });

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/companies');
      const data = await res.json();
      setCompanies(data.items || []);
    })();
  }, []);

  const onSubmit = async (values: FormValues) => {
    setLoading(true); setError(null);
    try {
      const payload = {
        ...values,
        companyId: Number(values.companyId) || values.companyId
      };
      const res = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Failed to create lead');
      reset();
      window.location.href = '/leads';
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };

  return (
    <form className="grid grid-cols-1 md:grid-cols-6 gap-2" onSubmit={handleSubmit(onSubmit)}>
      <select className="border rounded p-2 md:col-span-2" {...register('companyId')}>
        <option value="">Select company</option>
        {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <input className="border rounded p-2 md:col-span-2" placeholder="Contact name" {...register('contactName')} />
      <select className="border rounded p-2" {...register('source')}>
        <option value="web">web</option>
        <option value="referral">referral</option>
        <option value="event">event</option>
        <option value="other">other</option>
      </select>
      <select className="border rounded p-2" {...register('status')}>
        <option value="new">new</option>
        <option value="qualified">qualified</option>
        <option value="lost">lost</option>
      </select>
      <input className="border rounded p-2 md:col-span-2" placeholder="Email" {...register('email')} />
      <input className="border rounded p-2 md:col-span-2" placeholder="Phone" {...register('phone')} />
      <input className="border rounded p-2" type="number" placeholder="Score" {...register('score', { valueAsNumber: true })} />
      <button className="bg-blue-600 text-white px-3 py-2 rounded md:col-span-1" disabled={loading}>Create Lead</button>
      {error && <p className="text-red-600 text-sm md:col-span-6">{error}</p>}
      {(errors.companyId || errors.contactName) && <p className="text-red-600 text-sm md:col-span-6">Invalid input</p>}
    </form>
  );
}
