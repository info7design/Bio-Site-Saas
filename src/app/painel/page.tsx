import Link from "next/link";
import { requireCurrentOrg } from "@/lib/current-org";

export default async function DashboardPage() {
  const { session, org } = await requireCurrentOrg();
  const firstName = session.user.name.split(" ")[0];

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">Olá, {firstName}</h1>
      <p className="mt-1 text-sm text-slate-600">
        Plano atual: <b>{org.subscription?.plan?.name ?? "Grátis"}</b>
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {org.bioSites.map((site) => (
          <Link
            key={site.id}
            href={`/painel/sites/${site.id}/editor`}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold">{site.title}</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${site.published ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                {site.published ? "Publicado" : "Rascunho"}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">linkbio.manifesti.com.br/{site.slug}</p>
          </Link>
        ))}

        <Link
          href="/painel/sites"
          className="touch-target grid place-items-center rounded-2xl border-2 border-dashed border-slate-300 p-6 text-center text-sm font-medium text-slate-500"
        >
          + Criar novo site
        </Link>
      </div>
    </div>
  );
}
