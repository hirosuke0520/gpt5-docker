"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';

export default function LeadsSearch() {
  const router = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get('q') || '');
  const [status, setStatus] = useState(sp.get('status') || '');

  useEffect(() => {
    setQ(sp.get('q') || '');
    setStatus(sp.get('status') || '');
  }, [sp]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const p = new URLSearchParams();
    if (q) p.set('q', q);
    if (status) p.set('status', status);
    router.push(`/leads?${p.toString()}`);
  }

  return (
    <form className="flex gap-2 mb-3" onSubmit={submit}>
      <input className="border rounded p-2 flex-1" placeholder="Search name/email/phone" value={q} onChange={(e) => setQ(e.target.value)} />
      <select className="border rounded p-2" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">All</option>
        <option value="new">new</option>
        <option value="qualified">qualified</option>
        <option value="lost">lost</option>
      </select>
      <button className="bg-blue-600 text-white px-3 py-2 rounded">Search</button>
    </form>
  );
}
