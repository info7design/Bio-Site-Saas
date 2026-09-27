import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireCurrentOrg } from "@/lib/current-org";
import Editor from "./Editor";

export default async function EditorPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params;
  const { org } = await requireCurrentOrg();

  const site = await prisma.bioSite.findFirst({
    where: { id: siteId, orgId: org.id },
    include: { blocks: { orderBy: { position: "asc" } }, theme: true },
  });
  if (!site) notFound();

  return <Editor site={site} />;
}
