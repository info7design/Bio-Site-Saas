import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireCurrentOrg } from "@/lib/current-org";
import Editor from "./Editor";

export default async function EditorPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params;
  const { org } = await requireCurrentOrg();

  const site = await prisma.bioSite.findFirst({
    where: { id: siteId, orgId: org.id },
    include: {
      theme: true,
      pages: {
        orderBy: { position: "asc" },
        include: { blocks: { orderBy: { position: "asc" } } },
      },
    },
  });
  if (!site) notFound();

  const maxPages = (org.subscription?.plan?.features as any)?.paginas ?? 1;

  return <Editor site={site} maxPages={maxPages} />;
}
