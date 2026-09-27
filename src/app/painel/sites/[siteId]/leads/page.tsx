import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireCurrentOrg } from "@/lib/current-org";

export default async function SiteLeadsPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params;
  const { org } = await requireCurrentOrg();
  const site = org.bioSites.find((s) => s.id === siteId);
  if (!site) notFound();

  const leads = await prisma.lead.findMany({
    where: { siteId, NOT: { data: { path: ["kind"], equals: "pedido_cardapio" } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <>
      <div className="hello">
        <div>
          <h2>Leads</h2>
          <p>Contatos recebidos pelo formulário de {site.title}.</p>
        </div>
      </div>

      <div className="card scroll">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Nome</th>
              <th>Contato</th>
              <th>Origem</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const data = lead.data as any;
              return (
                <tr key={lead.id}>
                  <td>{lead.createdAt.toLocaleDateString("pt-BR")}</td>
                  <td>{data?.name ?? "—"}</td>
                  <td>{[data?.phone, data?.email].filter(Boolean).join(" · ") || "—"}</td>
                  <td>{lead.source ?? "—"}</td>
                </tr>
              );
            })}
            {leads.length === 0 && (
              <tr>
                <td colSpan={4} className="note">Nenhum lead ainda.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
