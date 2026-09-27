import Link from "next/link";

export default function DemoSitesPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">Seus sites</h1>
      <p className="mt-1 text-sm text-slate-600">1 de 3 sites usados neste plano (demonstração).</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link href="/demo/editor" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="font-semibold">Salão da Ana</span>
          <p className="mt-1 text-sm text-slate-500">/salao-da-ana</p>
        </Link>
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
        Criar novos sites, escolher templates e publicar de verdade fica disponível depois do cadastro grátis.
      </div>
    </div>
  );
}
