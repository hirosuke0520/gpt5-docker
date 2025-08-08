"use client";
import React, { useEffect, useMemo, useState } from 'react';
import type { Deal } from '@/types';
import CreateDealForm from '@/components/forms/CreateDealForm';

const stages: Deal['stage'][] = ['prospecting', 'proposal', 'negotiation', 'won', 'lost'];

export default function DealsKanbanPage() {
  const [items, setItems] = useState<Deal[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dragId, setDragId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/deals');
        if (!res.ok) throw new Error(`Failed to load deals (${res.status})`);
        const data = await res.json().catch(() => ({ items: [] }));
        setItems(Array.isArray(data?.items) ? data.items : []);
      } catch (e: any) {
        setError(e.message);
        setItems([]);
      }
    })();
  }, []);

  const grouped = useMemo(() => {
    const map: Record<string, Deal[]> = Object.fromEntries(stages.map(s => [s, []]));
    for (const d of items) map[d.stage].push(d);
    return map;
  }, [items]);

  async function updateStage(deal: Deal, to: Deal['stage']) {
    const prev = items;
    const optimistic = items.map(d => d.id === deal.id ? { ...d, stage: to } : d);
    setItems(optimistic);
    try {
      const res = await fetch(`/api/deals/${deal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: to })
      });
      if (!res.ok) throw new Error('Failed');
    } catch (e) {
      setItems(prev);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Deals (Kanban)</h2>
      <div className="mb-4"><CreateDealForm /></div>
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {stages.map((stage) => (
          <div
            key={stage}
            className="bg-gray-50 border rounded p-2 min-h-[200px]"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const idStr = e.dataTransfer.getData('text/plain');
              const id = Number(idStr);
              const deal = items.find(d => d.id === id);
              if (deal) updateStage(deal, stage);
              setDragId(null);
            }}
          >
            <div className="font-semibold capitalize mb-2">{stage}</div>
            <div className="space-y-2">
              {grouped[stage].map((d) => (
                <div
                  key={d.id}
                  className={`bg-white border rounded p-2 ${dragId === d.id ? 'opacity-50' : ''}`}
                  draggable
                  onDragStart={(e) => { e.dataTransfer.setData('text/plain', String(d.id)); setDragId(d.id); }}
                  onDragEnd={() => setDragId(null)}
                >
                  <div className="text-sm font-medium">{d.title}</div>
                  <div className="text-xs text-gray-500">{Number(d.amount).toLocaleString()}</div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {stages.filter(s => s !== d.stage).map((s) => (
                      <button key={s} className="text-xs underline" onClick={() => updateStage(d, s)}>
                        Move to {s}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
