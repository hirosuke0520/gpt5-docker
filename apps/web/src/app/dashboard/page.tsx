async function getKpis() {
  const base = process.env.NEXT_PUBLIC_BASE_URL;
  const url = base ? `${base}/api/kpis` : 'http://localhost:3000/api/kpis';
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return { todayLeads: 0, openDealsTotal: 0, dueActivities: 0 };
  return res.json();
}

export default async function DashboardPage() {
  const kpis = await getKpis();
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="rounded border p-4 bg-white">
        <div className="text-sm text-gray-500">本日作成のLeads</div>
        <div className="text-2xl font-bold">{kpis.todayLeads}</div>
      </div>
      <div className="rounded border p-4 bg-white">
        <div className="text-sm text-gray-500">Open Deals 総額</div>
        <div className="text-2xl font-bold">{Number(kpis.openDealsTotal).toLocaleString()}</div>
      </div>
      <div className="rounded border p-4 bg-white">
        <div className="text-sm text-gray-500">今週期限の未完了Activities</div>
        <div className="text-2xl font-bold">{kpis.dueActivities}</div>
      </div>
    </div>
  );
}
