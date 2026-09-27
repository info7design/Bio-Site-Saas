import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireCurrentOrg } from "@/lib/current-org";
import ApplyTemplateButton from "./ApplyTemplateButton";

export default async function SiteTemplatesPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params;
  const { org } = await requireCurrentOrg();
  const site = org.bioSites.find((s) => s.id === siteId);
  if (!site) notFound();

  const templates = await prisma.template.findMany({ where: { active: true }, orderBy: { category: "asc" } });

  return (
    <>
      <div className="tplhead">
        <div>
          <h2>Templates para {site.title}</h2>
          <p className="note">Escolha um estilo — cores e fontes aplicam na hora, tudo continua editável.</p>
        </div>
      </div>

      <div className="tplgrid">
        {templates.map((t) => {
          const tokens = (t.theme as any)?.tokens ?? {};
          return (
            <div key={t.id} className="tplcard">
              <div className="thumb" style={{ background: tokens.primary ?? "#5b4bff" }} />
              <h4>
                {t.name}
                <span className="tag">{t.category}</span>
              </h4>
              <div className="row">
                <ApplyTemplateButton siteId={siteId} templateId={t.id} />
              </div>
            </div>
          );
        })}
        {templates.length === 0 && <p className="note">Nenhum template cadastrado ainda.</p>}
      </div>
    </>
  );
}
