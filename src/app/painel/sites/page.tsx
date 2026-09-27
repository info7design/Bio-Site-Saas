import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireCurrentOrg } from "@/lib/current-org";
import NewSiteForm from "./NewSiteForm";
import "@/styles/manifesti.css";

export default async function SitesPage() {
  const { org } = await requireCurrentOrg();
  const maxSites = org.subscription?.plan?.maxBioSites ?? 1;
  const canCreate = org.bioSites.length < maxSites;
  const templates = await prisma.template.findMany({ where: { active: true }, orderBy: { name: "asc" } });

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)", color: "var(--ink)", fontFamily: '"Plus Jakarta Sans","Inter",system-ui,sans-serif' }} className="app-fonts">
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 20px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-.03em" }}>Seus sites</h1>
        <p className="note" style={{ marginTop: 4 }}>
          {org.bioSites.length} de {maxSites} sites usados neste plano.
        </p>

        <div className="grid two" style={{ marginTop: 24 }}>
          {org.bioSites.map((site) => (
            <Link key={site.id} href={`/painel/sites/${site.id}/painel`} className="card">
              <span style={{ fontWeight: 700 }}>{site.title}</span>
              <p className="note" style={{ marginTop: 4 }}>/{site.slug}</p>
            </Link>
          ))}
        </div>

        {canCreate ? (
          <div className="card" style={{ marginTop: 24 }}>
            <NewSiteForm
              templates={templates.map((t) => ({
                id: t.id,
                name: t.name,
                primary: (t.theme as any)?.tokens?.primary ?? "#5b6cff",
              }))}
            />
          </div>
        ) : (
          <p className="card" style={{ marginTop: 24, color: "var(--warn)" }}>
            Você atingiu o limite de sites do seu plano atual.
          </p>
        )}
      </div>
    </div>
  );
}
