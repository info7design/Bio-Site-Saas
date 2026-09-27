"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireCurrentOrg } from "@/lib/current-org";
import { newBlock, type BlockType } from "@/lib/blocks";

async function assertOwnedSite(siteId: string) {
  const { org } = await requireCurrentOrg();
  const site = await prisma.bioSite.findFirst({ where: { id: siteId, orgId: org.id } });
  if (!site) throw new Error("Site não encontrado");
  return site;
}

export async function addBlockAction(siteId: string, type: BlockType) {
  const site = await assertOwnedSite(siteId);
  const count = await prisma.siteBlock.count({ where: { siteId: site.id } });
  const block = newBlock(type);
  const created = await prisma.siteBlock.create({
    data: { siteId: site.id, type, position: count, props: block.props, animation: block.animation },
  });
  revalidatePath(`/painel/sites/${siteId}/editor`);
  return created;
}

export async function updateBlockPropsAction(siteId: string, blockId: string, props: Record<string, any>) {
  await assertOwnedSite(siteId);
  await prisma.siteBlock.update({ where: { id: blockId }, data: { props } });
  revalidatePath(`/painel/sites/${siteId}/editor`);
}

export async function toggleBlockVisibleAction(siteId: string, blockId: string, visible: boolean) {
  await assertOwnedSite(siteId);
  await prisma.siteBlock.update({ where: { id: blockId }, data: { visible } });
  revalidatePath(`/painel/sites/${siteId}/editor`);
}

export async function deleteBlockAction(siteId: string, blockId: string) {
  await assertOwnedSite(siteId);
  await prisma.siteBlock.delete({ where: { id: blockId } });
  revalidatePath(`/painel/sites/${siteId}/editor`);
}

export async function reorderBlocksAction(siteId: string, orderedIds: string[]) {
  await assertOwnedSite(siteId);
  await prisma.$transaction(
    orderedIds.map((id, position) => prisma.siteBlock.update({ where: { id }, data: { position } }))
  );
  revalidatePath(`/painel/sites/${siteId}/editor`);
}

export async function updateSiteMetaAction(
  siteId: string,
  data: { title?: string; seoTitle?: string; seoDesc?: string; primary?: string }
) {
  await assertOwnedSite(siteId);
  const { primary, ...siteFields } = data;
  await prisma.bioSite.update({ where: { id: siteId }, data: siteFields });
  if (primary) {
    const current = await prisma.siteTheme.findUnique({ where: { siteId } });
    const tokens = { ...(current?.tokens as Record<string, any> | undefined), primary };
    await prisma.siteTheme.upsert({
      where: { siteId },
      update: { tokens },
      create: { siteId, preset: "moderno", tokens },
    });
  }
  revalidatePath(`/painel/sites/${siteId}/editor`);
}

export async function publishSiteAction(siteId: string, published: boolean) {
  await assertOwnedSite(siteId);
  await prisma.bioSite.update({
    where: { id: siteId },
    data: { published, publishedAt: published ? new Date() : null },
  });
  revalidatePath(`/painel/sites/${siteId}/editor`);
}
