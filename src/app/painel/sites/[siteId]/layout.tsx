import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireCurrentOrg } from "@/lib/current-org";
import { logoutAction } from "@/app/painel/actions";
import PanelChrome from "@/components/panel/PanelChrome";
import SiteSwitcher from "@/components/panel/SiteSwitcher";
import PublishBar from "@/components/panel/PublishBar";
import "@/styles/manifesti.css";

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;
  const { session, org } = await requireCurrentOrg();

  const site = org.bioSites.find((s) => s.id === siteId);
  if (!site) notFound();

  const theme = await prisma.siteTheme.findUnique({ where: { siteId } });

  const nav = [
    { href: `/painel/sites/${siteId}/painel`, label: "Painel", icon: "home" },
    { href: `/painel/sites/${siteId}/editor`, label: "Editor", icon: "layout" },
    { href: `/painel/sites/${siteId}/templates`, label: "Templates", icon: "grid" },
    { href: `/painel/sites/${siteId}/pedidos`, label: "Pedidos", icon: "bag" },
    { href: `/painel/sites/${siteId}/leads`, label: "Leads", icon: "users" },
    { href: `/painel/sites/${siteId}/agendamentos`, label: "Agendamentos", icon: "cal" },
  ];

  const maxSites = org.subscription?.plan?.maxBioSites ?? 1;

  return (
    <PanelChrome
      nav={nav}
      orgName={org.name}
      userName={session.user.name}
      planName={org.subscription?.plan?.name}
      siteCount={org.bioSites.length}
      maxSites={maxSites}
      logoutAction={logoutAction}
      siteSwitcher={<SiteSwitcher sites={org.bioSites.map((s) => ({ id: s.id, title: s.title }))} activeSiteId={siteId} />}
      topRight={
        <PublishBar
          siteId={site.id}
          slug={site.slug}
          title={site.title}
          seoTitle={site.seoTitle ?? ""}
          seoDesc={site.seoDesc ?? ""}
          primary={(theme?.tokens as any)?.primary ?? "#5b6cff"}
          published={site.published}
        />
      }
    >
      {children}
    </PanelChrome>
  );
}
