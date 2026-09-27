import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireCurrentOrg } from "@/lib/current-org";

export default async function SiteDashboardPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params;
  const { session, org } = await requireCurrentOrg();
  const site = org.bioSites.find((s) => s.id === siteId);
  if (!site) notFound();

  const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

  const [views, clicks, leadsCount, bookingsCount, sourceCounts, deviceCounts, buttonClicks, recentLeads, recentBookings] = await Promise.all([
    prisma.analyticsEvent.count({ where: { siteId, type: "view", createdAt: { gte: since } } }),
    prisma.analyticsEvent.count({ where: { siteId, type: { in: ["click", "lead", "booking", "catalog_order"] }, createdAt: { gte: since } } }),
    prisma.lead.count({ where: { siteId, createdAt: { gte: since } } }),
    prisma.booking.count({ where: { siteId, createdAt: { gte: since } } }),
    prisma.analyticsEvent.groupBy({ by: ["source"], where: { siteId, createdAt: { gte: since } }, _count: true }),
    prisma.analyticsEvent.groupBy({ by: ["device"], where: { siteId, createdAt: { gte: since } }, _count: true }),
    prisma.analyticsEvent.groupBy({ by: ["targetId"], where: { siteId, type: "click", createdAt: { gte: since } }, _count: true }),
    prisma.lead.findMany({ where: { siteId }, orderBy: { createdAt: "desc" }, take: 4 }),
    prisma.booking.findMany({ where: { siteId }, orderBy: { createdAt: "desc" }, take: 4 }),
  ]);

  const conv = views > 0 ? ((clicks / views) * 100).toFixed(1) : "0.0";
  const firstName = session.user.name.split(" ")[0];

  const kpis = [
    { label: "Visitas (14 dias)", value: views },
    { label: "Cliques e interações", value: clicks },
    { label: "Leads", value: leadsCount },
    { label: "Agendamentos", value: bookingsCount },
    { label: "Conversão", value: `${conv}%` },
  ];

  const sources = sourceCounts
    .filter((s) => s.source)
    .sort((a, b) => b._count - a._count)
    .slice(0, 6);
  const maxSource = Math.max(1, ...sources.map((s) => s._count));

  const devices = deviceCounts
    .filter((d) => d.device)
    .sort((a, b) => b._count - a._count);
  const maxDevice = Math.max(1, ...devices.map((d) => d._count));

  const feed = [
    ...recentLeads.map((l) => ({ label: "Novo lead", when: l.createdAt })),
    ...recentBookings.map((b) => ({ label: `Agendamento: ${b.name}`, when: b.createdAt })),
  ]
    .sort((a, b) => b.when.getTime() - a.when.getTime())
    .slice(0, 6);

  return (
    <>
      <div className="hello">
        <div>
          <h2>Bom dia, {firstName}</h2>
          <p>Veja como está o desempenho de {site.title}.</p>
        </div>
      </div>

      <div className="grid kpis">
        {kpis.map((k) => (
          <div key={k.label} className="card kpi">
            <span>{k.label}</span>
            <b>{k.value}</b>
          </div>
        ))}
      </div>

      <div className="grid two" style={{ marginTop: 16 }}>
        <div className="card">
          <h3>Origem dos visitantes</h3>
          {sources.length === 0 ? (
            <p className="note">Sem dados ainda nos últimos 14 dias.</p>
          ) : (
            <div className="bars">
              {sources.map((s) => (
                <div key={s.source} className="bar">
                  <span>{s.source}</span>
                  <div>
                    <i style={{ width: `${(s._count / maxSource) * 100}%` }} />
                  </div>
                  <span>{s._count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="card">
          <h3>Dispositivos</h3>
          {devices.length === 0 ? (
            <p className="note">Sem dados ainda.</p>
          ) : (
            <div className="bars">
              {devices.map((d) => (
                <div key={d.device} className="bar">
                  <span>{d.device}</span>
                  <div>
                    <i style={{ width: `${(d._count / maxDevice) * 100}%` }} />
                  </div>
                  <span>{d._count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid three" style={{ marginTop: 16 }}>
        <div className="card">
          <h3>Botões mais acessados</h3>
          {buttonClicks.length === 0 ? (
            <p className="note">Nenhum clique registrado ainda.</p>
          ) : (
            <div className="bars">
              {buttonClicks.slice(0, 5).map((b) => (
                <div key={b.targetId ?? "—"} className="bar">
                  <span>{b.targetId ?? "—"}</span>
                  <div>
                    <i style={{ width: "100%" }} />
                  </div>
                  <span>{b._count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="card">
          <h3>Conversão</h3>
          <div className="kpi">
            <b>{conv}%</b>
          </div>
          <p className="note">
            {views} visitantes, {clicks} cliques em algum botão.
          </p>
        </div>
        <div className="card">
          <h3>Atividade recente</h3>
          {feed.length === 0 ? (
            <p className="note">Nenhuma atividade ainda.</p>
          ) : (
            <ul className="feed">
              {feed.map((f, i) => (
                <li key={i}>
                  <span className="fi">•</span>
                  <span>{f.label}</span>
                  <small>{f.when.toLocaleDateString("pt-BR")}</small>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
