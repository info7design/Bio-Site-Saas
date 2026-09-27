import Link from "next/link";
import type { BlockType } from "@/lib/blocks";
import BlockView from "@/components/blocks/BlockView";
import ViewTracker from "@/components/blocks/ViewTracker";

type PageLite = { slug: string; title: string };
type BlockLite = { id: string; type: string; props: any };

export default function PublicSiteBody({
  site,
  pages,
  activeSlug,
  blocks,
  context,
}: {
  site: { id: string; slug: string; theme: { tokens: any } | null };
  pages: PageLite[];
  activeSlug: string;
  blocks: BlockLite[];
  context: { siteId: string; appUrl?: string; services?: { id: string; name: string; durationMin: number }[] };
}) {
  const primary = site.theme?.tokens?.primary ?? "#5b6cff";

  return (
    <main className="mx-auto min-h-dvh max-w-md bg-white px-4 py-8" style={{ ["--brand" as any]: primary }}>
      <ViewTracker siteId={site.id} />

      {pages.length > 1 && (
        <div className="mb-4 flex flex-wrap justify-center gap-1.5">
          {pages.map((p) => (
            <Link
              key={p.slug}
              href={p.slug ? `/${site.slug}/${p.slug}` : `/${site.slug}`}
              className={`touch-target rounded-full px-3 py-1.5 text-xs font-medium ${p.slug === activeSlug ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}
            >
              {p.title}
            </Link>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {blocks.map((b) => (
          <BlockView key={b.id} type={b.type as BlockType} props={b.props as Record<string, any>} mode="public" context={context} />
        ))}
      </div>
      <p className="mt-10 text-center text-[11px] text-slate-300">Feito com manifesti</p>
    </main>
  );
}
