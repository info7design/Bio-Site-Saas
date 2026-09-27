import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireCurrentOrg } from "@/lib/current-org";

export default async function SiteAgendamentosPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params;
  const { org } = await requireCurrentOrg();
  const site = org.bioSites.find((s) => s.id === siteId);
  if (!site) notFound();

  const bookings = await prisma.booking.findMany({
    where: { siteId },
    include: { service: true },
    orderBy: { startsAt: "desc" },
    take: 100,
  });

  return (
    <>
      <div className="hello">
        <div>
          <h2>Agendamentos</h2>
          <p>Reservas recebidas em {site.title}.</p>
        </div>
      </div>

      <div className="card scroll">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Serviço</th>
              <th>Cliente</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((bk) => (
              <tr key={bk.id}>
                <td>{bk.startsAt.toLocaleString("pt-BR")}</td>
                <td>{bk.service.name}</td>
                <td>{bk.name}</td>
                <td>
                  <span className="tag t1">{bk.status}</span>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={4} className="note">Nenhum agendamento ainda.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
