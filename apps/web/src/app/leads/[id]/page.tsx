import Link from 'next/link';
import CreateActivityForm from '@/components/forms/CreateActivityForm';

async function getLead(id: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL;
  const url = base ? `${base}/api/leads/${id}` : `http://localhost:3000/api/leads/${id}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const data = await getLead(params.id);
  if (!data) return <p className="text-sm text-gray-500">Not found</p>;
  const { lead, deals, activities } = data;
  return (
    <div className="space-y-6">
      <div>
        <Link className="text-sm underline" href="/leads">← Back</Link>
      </div>
      <div className="bg-white rounded border p-4">
        <h2 className="text-xl font-semibold">{lead.contactName}</h2>
        <div className="text-sm text-gray-500">{lead.company?.name}</div>
        <div className="mt-2 text-sm">Status: {lead.status} / Source: {lead.source}</div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded border p-4">
          <h3 className="font-semibold mb-2">Deals</h3>
          <ul className="list-disc pl-6">
            {deals.map((d: any) => (
              <li key={d.id}>{d.title} - {d.stage} - {Number(d.amount).toLocaleString()}</li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded border p-4 space-y-3">
          <h3 className="font-semibold mb-2">Activities</h3>
          <CreateActivityForm leadId={lead.id} />
          <ul className="space-y-2">
            {activities.map((a: any) => (
              <li key={a.id} className="flex items-center justify-between border p-2 rounded">
                <div>
                  <div className="text-sm">[{a.type}] {a.content}</div>
                  <div className="text-xs text-gray-500">due: {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : '-'}</div>
                </div>
                <form action={`/api/activities/${a.id}`} method="POST">
                  <input type="hidden" name="_method" value="PATCH" />
                  <input type="hidden" name="completed" value={(!a.completed).toString()} />
                  <button className="text-sm underline" aria-label="toggle complete">{a.completed ? 'Mark as Incomplete' : 'Mark as Complete'}</button>
                </form>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
