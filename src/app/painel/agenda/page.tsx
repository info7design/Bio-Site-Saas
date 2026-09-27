import { prisma } from "@/lib/prisma";
import { requireCurrentOrg } from "@/lib/current-org";

export default async function AgendaPage() {
  const { org } = await requireCurrentOrg();
  const bookings = await prisma.booking.findMany({
    where: { site: { orgId: org.id } },
    include: { site: true, service: true },
    orderBy: { startsAt: "desc" },
    take: 100,
  });

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">Agenda</h1>
      <p className="mt-1 text-sm text-slate-600">Agendamentos recebidos pelos seus sites.</p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs uppercase text-slate-400">
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Serviço</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((bk) => (
              <tr key={bk.id} className="border-b border-slate-50">
                <td className="px-4 py-3 text-slate-500">{bk.startsAt.toLocaleString("pt-BR")}</td>
                <td className="px-4 py-3">{bk.service.name}</td>
                <td className="px-4 py-3">{bk.name}</td>
                <td className="px-4 py-3">{bk.status}</td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-400">Nenhum agendamento ainda.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
