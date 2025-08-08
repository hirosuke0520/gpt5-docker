"use client";
import React, { useEffect, useState } from 'react';

export default function CompaniesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch('/api/companies');
    const data = await res.json();
    setItems(data.items || []);
  }

  useEffect(() => { load(); }, []);

  async function createCompany(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/companies', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name })
      });
      if (!res.ok) throw new Error('Failed to create');
      setName('');
      await load();
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  }

  async function updateCompany(id: number) {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`/api/companies/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: editingName }) });
      if (!res.ok) throw new Error('Failed to update');
      setEditingId(null);
      await load();
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  }

  async function deleteCompany(id: number) {
    if (!confirm('Delete company?')) return;
    setLoading(true); setError(null);
    try {
      const res = await fetch(`/api/companies/${id}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 204) throw new Error('Failed to delete');
      await load();
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Companies</h2>
      <form className="flex gap-2" onSubmit={createCompany}>
        <input className="border rounded p-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="New company name" />
        <button className="bg-blue-600 text-white px-3 py-2 rounded" disabled={loading || !name}>Create</button>
      </form>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <ul className="bg-white border rounded divide-y">
        {items.map((c) => (
          <li key={c.id} className="p-2 flex items-center justify-between gap-2">
            {editingId === c.id ? (
              <input className="border rounded p-1 flex-1" value={editingName} onChange={(e) => setEditingName(e.target.value)} />
            ) : (
              <span className="flex-1">{c.name}</span>
            )}
            {editingId === c.id ? (
              <>
                <button className="text-sm underline" onClick={() => updateCompany(c.id)}>Save</button>
                <button className="text-sm underline" onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <button className="text-sm underline" onClick={() => { setEditingId(c.id); setEditingName(c.name); }}>Edit</button>
                <button className="text-sm underline text-red-600" onClick={() => deleteCompany(c.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
