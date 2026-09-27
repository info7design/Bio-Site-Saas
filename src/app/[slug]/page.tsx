import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import BlockView from "@/components/blocks/BlockView";
import ViewTracker from "@/components/blocks/ViewTracker";
import type { BlockType } from "@/lib/blocks";

async function getSite(slug: string) {
  return prisma.bioSite.findFirst({
    where: { slug, published: true },
    include: {
      blocks: { where: { visible: true }, orderBy: { position: "asc" } },
      theme: true,
      services: { where: { available: true } },
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

  const primary = (site.theme?.tokens as any)?.primary ?? "#5b6cff";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const context = {
    siteId: site.id,
    appUrl: `${appUrl}/${site.slug}`,
    services: site.services.map((s) => ({ id: s.id, name: s.name, durationMin: s.durationMin })),
  };

  return (
    <main className="mx-auto min-h-dvh max-w-md bg-white px-4 py-8" style={{ ["--brand" as any]: primary }}>
      <ViewTracker siteId={site.id} />
      <div className="flex flex-col gap-4">
        {site.blocks.map((b) => (
          <BlockView key={b.id} type={b.type as BlockType} props={b.props as Record<string, any>} mode="public" context={context} />
        ))}
      </div>
      <p className="mt-10 text-center text-[11px] text-slate-300">Feito com manifesti</p>
    </main>
  );
}
