import { prisma } from "@/lib/prisma";
import { requireCurrentOrg } from "@/lib/current-org";

export default async function LeadsPage() {
  const { org } = await requireCurrentOrg();
  const leads = await prisma.lead.findMany({
    where: { site: { orgId: org.id } },
    include: { site: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">Leads</h1>
      <p className="mt-1 text-sm text-slate-600">Contatos recebidos pelos formulários dos seus sites.</p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs uppercase text-slate-400">
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Site</th>
              <th className="px-4 py-3">Dados</th>
              <th className="px-4 py-3">Origem</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-slate-50">
                <td className="px-4 py-3 text-slate-500">{lead.createdAt.toLocaleDateString("pt-BR")}</td>
                <td className="px-4 py-3">{lead.site.title}</td>
                <td className="px-4 py-3">{JSON.stringify(lead.data)}</td>
                <td className="px-4 py-3 text-slate-500">{lead.source ?? "—"}</td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-400">Nenhum lead ainda.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
