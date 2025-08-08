"use client";
import React, { useState } from 'react';

export default function CreateActivityForm({ leadId }: { leadId: number }) {
  const [type, setType] = useState<'note'|'task'|'call'|'email'>('note');
  const [content, setContent] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, type, content, dueDate })
      });
      if (!res.ok) throw new Error('Failed to add activity');
      setContent(''); setDueDate(''); setType('note');
      window.location.reload();
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  }

  return (
    <form className="flex flex-wrap items-end gap-2" onSubmit={onSubmit}>
      <select className="border rounded p-2" value={type} onChange={(e) => setType(e.target.value as any)}>
        <option value="note">note</option>
        <option value="task">task</option>
        <option value="call">call</option>
        <option value="email">email</option>
      </select>
      <input className="border rounded p-2 flex-1" placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
      <input className="border rounded p-2" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      <button className="bg-blue-600 text-white px-3 py-2 rounded" disabled={loading || !content}>Add Activity</button>
      {error && <span className="text-red-600 text-sm">{error}</span>}
    </form>
  );
}
