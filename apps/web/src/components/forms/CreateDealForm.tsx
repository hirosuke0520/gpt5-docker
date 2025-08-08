"use client";
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  leadId: z.coerce.number().int().min(1),
  title: z.string().min(1),
  amount: z.coerce.number().min(0),
  stage: z.enum(['prospecting', 'proposal', 'negotiation', 'won', 'lost']).default('prospecting'),
});

type FormValues = z.infer<typeof schema>;

export default function CreateDealForm() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { stage: 'prospecting' } });

  const onSubmit = async (values: FormValues) => {
    const res = await fetch('/api/deals', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
    if (res.ok) {
      reset();
      window.location.href = '/deals';
    }
  };

  return (
    <form className="flex flex-wrap items-end gap-2" onSubmit={handleSubmit(onSubmit)}>
      <input className="border rounded p-2" placeholder="Lead ID" {...register('leadId', { valueAsNumber: true })} />
      <input className="border rounded p-2" placeholder="Title" {...register('title')} />
      <input className="border rounded p-2" placeholder="Amount" type="number" step="0.01" {...register('amount', { valueAsNumber: true })} />
      <select className="border rounded p-2" {...register('stage')}>
        <option value="prospecting">prospecting</option>
        <option value="proposal">proposal</option>
        <option value="negotiation">negotiation</option>
        <option value="won">won</option>
        <option value="lost">lost</option>
      </select>
      <button className="bg-blue-600 text-white px-3 py-2 rounded" disabled={isSubmitting}>Create Deal</button>
    </form>
  );
}
