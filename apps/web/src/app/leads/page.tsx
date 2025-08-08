import Link from 'next/link';
import LeadsSearch from './search';
import CreateLeadForm from '@/components/forms/CreateLeadForm';

async function getLeads(searchParams: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();
  if (searchParams.q && typeof searchParams.q === 'string') params.set('q', searchParams.q);
  if (searchParams.status && typeof searchParams.status === 'string') params.set('status', searchParams.status);
  if (searchParams.companyId && typeof searchParams.companyId === 'string') params.set('companyId', searchParams.companyId);
  const apiBase = process.env.API_BASE_URL || 'http://localhost:8787';
  const res = await fetch(`${apiBase}/leads?${params}`, { cache: 'no-store', credentials: 'include' as any });
  if (!res.ok) return { items: [], page: 1, pageSize: 20, total: 0 };
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
        </div>
      )}
    </div>
  );
}
