import Link from "next/link";
import { requireCurrentOrg } from "@/lib/current-org";
import NewSiteForm from "./NewSiteForm";

export default async function SitesPage() {
  const { org } = await requireCurrentOrg();
  const maxSites = org.subscription?.plan?.maxBioSites ?? 1;
  const canCreate = org.bioSites.length < maxSites;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">Seus sites</h1>
      <p className="mt-1 text-sm text-slate-600">
        {org.bioSites.length} de {maxSites} sites usados neste plano.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {org.bioSites.map((site) => (
          <Link
            key={site.id}
            href={`/painel/sites/${site.id}/editor`}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <span className="font-semibold">{site.title}</span>
            <p className="mt-1 text-sm text-slate-500">/{site.slug}</p>
          </Link>
        ))}
      </div>

      {canCreate ? (
        <NewSiteForm />
      ) : (
        <p className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm text-amber-700">
          Você atingiu o limite de sites do seu plano atual.
        </p>
      )}
    </div>
  );
}
