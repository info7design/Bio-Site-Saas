import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireCurrentOrg } from "@/lib/current-org";

function money(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function SitePedidosPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params;
  const { org } = await requireCurrentOrg();
  const site = org.bioSites.find((s) => s.id === siteId);
  if (!site) notFound();

  const orders = await prisma.lead.findMany({
    where: { siteId, data: { path: ["kind"], equals: "pedido_cardapio" } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <>
      <div className="hello">
        <div>
          <h2>Pedidos do cardápio</h2>
          <p>Pedidos enviados pelos clientes de {site.title} pelo WhatsApp.</p>
        </div>
      </div>

      <div className="card scroll">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Itens</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const data = order.data as any;
              const items = (data.items ?? []).map((l: any) => `${l.qty}x ${l.name}`).join(", ");
              return (
                <tr key={order.id}>
                  <td>{order.createdAt.toLocaleString("pt-BR")}</td>
                  <td>{items}</td>
                  <td>{money(data.totalCents ?? 0)}</td>
                </tr>
              );
            })}
            {orders.length === 0 && (
              <tr>
                <td colSpan={3} className="note">Nenhum pedido ainda.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
