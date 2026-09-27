const bookings = [
  { when: "28/09/2026 14:00", service: "Corte feminino", client: "Juliana Alves", status: "CONFIRMED" },
  { when: "28/09/2026 16:00", service: "Coloração", client: "Beatriz Lima", status: "PENDING" },
  { when: "29/09/2026 10:00", service: "Escova", client: "Paula Nogueira", status: "CONFIRMED" },
];

export default function DemoAgendaPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">Agenda</h1>
      <p className="mt-1 text-sm text-slate-600">Exemplo de como os agendamentos aparecem aqui.</p>

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
            {bookings.map((b, i) => (
              <tr key={i} className="border-b border-slate-50">
                <td className="px-4 py-3 text-slate-500">{b.when}</td>
                <td className="px-4 py-3">{b.service}</td>
                <td className="px-4 py-3">{b.client}</td>
                <td className="px-4 py-3">{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
