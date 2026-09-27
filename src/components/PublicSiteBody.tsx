import Link from "next/link";
import type { BlockType } from "@/lib/blocks";
import BlockView from "@/components/blocks/BlockView";
import ViewTracker from "@/components/blocks/ViewTracker";
import "@/styles/manifesti.css";

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
  const tokens = site.theme?.tokens ?? {};
  const primary = tokens.primary ?? "#5b4bff";

  const vars: Record<string, string> = {
    "--bg": tokens.bg ?? "#faf9f5",
    "--text": tokens.text ?? "#15151a",
    "--muted": tokens.muted ?? "color-mix(in srgb, var(--text) 55%, transparent)",
    "--primary": primary,
    "--secondary": tokens.secondary ?? "color-mix(in srgb, var(--primary) 14%, white)",
    "--btn-bg": tokens.btnBg ?? primary,
    "--btn-text": tokens.btnText ?? "#ffffff",
    "--radius": tokens.radius ?? "16px",
    "--shadow": tokens.shadow ?? "0 10px 24px -12px rgba(0,0,0,.35)",
    "--hf": tokens.headingFont ?? "inherit",
    "--gap": tokens.gap ?? "16px",
    "--fs": "15px",
    "--av": "92px",
  };

  return (
    <div className="bio" style={vars as React.CSSProperties}>
      <ViewTracker siteId={site.id} />
      <div className="page">
        {pages.length > 1 && (
          <div className="ptabs">
            {pages.map((p) => (
              <Link
                key={p.slug}
                href={p.slug ? `/${site.slug}/${p.slug}` : `/${site.slug}`}
                aria-current={p.slug === activeSlug ? "page" : undefined}
              >
                {p.title}
              </Link>
            ))}
          </div>
        )}

        {blocks.map((b) => (
          <div key={b.id} className="blk">
            <BlockView type={b.type as BlockType} props={b.props as Record<string, any>} mode="public" context={context} />
          </div>
        ))}

        <p className="note" style={{ textAlign: "center", marginTop: 24 }}>Feito com manifesti</p>
      </div>
    </div>
  );
}
