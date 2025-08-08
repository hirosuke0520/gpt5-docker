import Link from 'next/link';
import LeadsSearch from './search';
import CreateLeadForm from '@/components/forms/CreateLeadForm';

async function getLeads(searchParams: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();
  if (searchParams.q && typeof searchParams.q === 'string') params.set('q', searchParams.q);
  if (searchParams.status && typeof searchParams.status === 'string') params.set('status', searchParams.status);
  if (searchParams.companyId && typeof searchParams.companyId === 'string') params.set('companyId', searchParams.companyId);
  if (searchParams.page && typeof searchParams.page === 'string') params.set('page', searchParams.page);
  if (searchParams.pageSize && typeof searchParams.pageSize === 'string') params.set('pageSize', searchParams.pageSize);
  const base = process.env.NEXT_PUBLIC_BASE_URL;
  const url = base ? `${base}/api/leads?${params}` : `http://localhost:3000/api/leads?${params}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return { items: [], page: 1, pageSize: 20, total: 0 } as any;
  return res.json();
}

export default async function LeadsPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const data = await getLeads(searchParams);
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Leads</h2>
      <div className="mb-4 space-y-3">
        <LeadsSearch />
        <CreateLeadForm />
      </div>
      {data.items.length === 0 ? (
        <p className="text-sm text-gray-500">No leads</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-50 text-left text-sm">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Company</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Source</th>
                <th className="p-2 border">Score</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((lead: any) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="p-2 border"><Link className="underline" href={`/leads/${lead.id}`}>{lead.contactName}</Link></td>
                  <td className="p-2 border">{lead.company?.name || '-'}</td>
                  <td className="p-2 border">{lead.status}</td>
                  <td className="p-2 border">{lead.source}</td>
                  <td className="p-2 border text-right">{lead.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-sm">Page {data.page} / {Math.max(1, Math.ceil(data.total / data.pageSize))}</span>
            <div className="ml-auto flex gap-2">
              {data.page > 1 && (
                <Link className="underline text-sm" href={`/leads?${new URLSearchParams({ page: String(data.page - 1), pageSize: String(data.pageSize) }).toString()}`}>Prev</Link>
              )}
              {data.page * data.pageSize < data.total && (
                <Link className="underline text-sm" href={`/leads?${new URLSearchParams({ page: String(data.page + 1), pageSize: String(data.pageSize) }).toString()}`}>Next</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
