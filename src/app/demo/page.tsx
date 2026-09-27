import Link from "next/link";

const kpis = [
  { label: "Visitas (14 dias)", value: 812 },
  { label: "Cliques e interações", value: 341 },
  { label: "Leads recebidos", value: 27 },
  { label: "Agendamentos", value: 14 },
];

export default function DemoDashboardPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">Olá, Visitante</h1>
      <p className="mt-1 text-sm text-slate-600">
        Plano atual: <b>Premium</b> (dados de demonstração)
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-2xl font-bold">{k.value}</p>
            <p className="mt-1 text-xs text-slate-500">{k.label}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-8 text-sm font-semibold uppercase text-slate-400">Seus sites</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Link href="/demo/editor" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Salão da Ana</span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">Publicado</span>
          </div>
          <p className="mt-1 text-sm text-slate-500">linkbio.manifesti.com.br/salao-da-ana</p>
        </Link>

        <div className="grid place-items-center rounded-2xl border-2 border-dashed border-slate-300 p-6 text-center text-sm font-medium text-slate-400">
          + Criar novo site (disponível após o cadastro)
        </div>
      </div>
    </div>
  );
}
