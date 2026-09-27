import { prisma } from "@/lib/prisma";
import { requireCurrentOrg } from "@/lib/current-org";

function money(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function summarize(data: any) {
  if (data?.kind === "pedido_cardapio") {
    const items = (data.items ?? []).map((l: any) => `${l.qty}x ${l.name}`).join(", ");
    return `${items} — ${money(data.totalCents ?? 0)}`;
  }
  const parts = [data?.name, data?.phone, data?.email, data?.message].filter(Boolean);
  return parts.join(" · ") || "—";
}

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
      <h1 className="text-2xl font-bold">Leads e pedidos</h1>
      <p className="mt-1 text-sm text-slate-600">Contatos e pedidos de cardápio recebidos pelos seus sites.</p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs uppercase text-slate-400">
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Site</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Detalhes</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const data = lead.data as any;
              const isOrder = data?.kind === "pedido_cardapio";
              return (
                <tr key={lead.id} className="border-b border-slate-50">
                  <td className="px-4 py-3 text-slate-500">{lead.createdAt.toLocaleDateString("pt-BR")}</td>
                  <td className="px-4 py-3">{lead.site.title}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${isOrder ? "bg-emerald-50 text-emerald-700" : "bg-violet-50 text-violet-700"}`}>
                      {isOrder ? "Pedido" : "Lead"}
                    </span>
                  </td>
                  <td className="px-4 py-3">{summarize(data)}</td>
                </tr>
              );
            })}
            {leads.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-400">Nenhum lead ou pedido ainda.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
