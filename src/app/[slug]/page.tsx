import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import PublicSiteBody from "@/components/PublicSiteBody";

async function getSite(slug: string) {
  return prisma.bioSite.findFirst({
    where: { slug, published: true },
    include: {
      theme: true,
      services: { where: { available: true } },
      pages: {
        orderBy: { position: "asc" },
        include: { blocks: { where: { visible: true }, orderBy: { position: "asc" } } },
      },
    },
  });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const site = await getSite(slug);
  if (!site) return {};
  return {
    title: site.seoTitle || site.title,
    description: site.seoDesc || undefined,
  };
}

export default async function PublicSitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = await getSite(slug);
  if (!site) notFound();

  const home = site.pages.find((p) => p.slug === "") ?? site.pages[0];
  if (!home) notFound();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const context = {
    siteId: site.id,
    appUrl: `${appUrl}/${site.slug}`,
    services: site.services.map((s) => ({ id: s.id, name: s.name, durationMin: s.durationMin })),
  };

  return (
    <PublicSiteBody
      site={site}
      pages={site.pages.map((p) => ({ slug: p.slug, title: p.title }))}
      activeSlug=""
      blocks={home.blocks}
      context={context}
    />
  );
}
