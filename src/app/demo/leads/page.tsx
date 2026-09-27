const leads = [
  { date: "26/09/2026", type: "Pedido", detail: "2x Corte feminino, 1x Escova — R$ 220,00" },
  { date: "25/09/2026", type: "Lead", detail: "Maria Silva · (11) 98888-0000" },
  { date: "24/09/2026", type: "Pedido", detail: "1x Coloração — R$ 150,00" },
  { date: "23/09/2026", type: "Lead", detail: "Carla Mendes · carla@email.com" },
];

export default function DemoLeadsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">Leads e pedidos</h1>
      <p className="mt-1 text-sm text-slate-600">Exemplo de como os contatos e pedidos aparecem aqui.</p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs uppercase text-slate-400">
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Detalhes</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l, i) => (
              <tr key={i} className="border-b border-slate-50">
                <td className="px-4 py-3 text-slate-500">{l.date}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${l.type === "Pedido" ? "bg-emerald-50 text-emerald-700" : "bg-violet-50 text-violet-700"}`}>
                    {l.type}
                  </span>
                </td>
                <td className="px-4 py-3">{l.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
