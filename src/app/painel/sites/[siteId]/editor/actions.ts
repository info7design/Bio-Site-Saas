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

async function assertOwnedPage(siteId: string, pageId: string) {
  await assertOwnedSite(siteId);
  const page = await prisma.page.findFirst({ where: { id: pageId, siteId } });
  if (!page) throw new Error("Página não encontrada");
  return page;
}

function slugifyPage(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 30);
}

export async function addBlockAction(siteId: string, pageId: string, type: BlockType) {
  await assertOwnedPage(siteId, pageId);
  const count = await prisma.siteBlock.count({ where: { pageId } });
  const block = newBlock(type);
  const created = await prisma.siteBlock.create({
    data: { pageId, type, position: count, props: block.props, animation: block.animation },
  });
  revalidatePath(`/painel/sites/${siteId}/editor`);
  return created;
}

export async function updateBlockPropsAction(siteId: string, blockId: string, props: Record<string, any>) {
  await assertOwnedSite(siteId);
  await prisma.siteBlock.update({ where: { id: blockId }, data: { props } });
  revalidatePath(`/painel/sites/${siteId}/editor`);
}

export async function updateBlockStyleAction(siteId: string, blockId: string, style: Record<string, any>) {
  await assertOwnedSite(siteId);
  await prisma.siteBlock.update({ where: { id: blockId }, data: { style } });
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

export async function addPageAction(siteId: string, title: string) {
  const { org } = await requireCurrentOrg();
  const site = await prisma.bioSite.findFirst({ where: { id: siteId, orgId: org.id }, include: { pages: true } });
  if (!site) throw new Error("Site não encontrado");

  const maxPages = (org.subscription?.plan?.features as any)?.paginas ?? 1;
  if (site.pages.length >= maxPages) {
    throw new Error(`Seu plano permite até ${maxPages} página(s). Faça upgrade para criar mais.`);
  }

  const base = slugifyPage(title) || "pagina";
  let slug = base;
  let i = 1;
  while (site.pages.some((p) => p.slug === slug)) slug = `${base}-${i++}`;

  const page = await prisma.page.create({
    data: { siteId, slug, title, position: site.pages.length },
  });
  revalidatePath(`/painel/sites/${siteId}/editor`);
  return page;
}

export async function renamePageAction(siteId: string, pageId: string, title: string) {
  await assertOwnedPage(siteId, pageId);
  await prisma.page.update({ where: { id: pageId }, data: { title } });
  revalidatePath(`/painel/sites/${siteId}/editor`);
}

export async function deletePageAction(siteId: string, pageId: string) {
  await assertOwnedPage(siteId, pageId);
  const remaining = await prisma.page.count({ where: { siteId } });
  if (remaining <= 1) throw new Error("O site precisa ter pelo menos uma página.");
  await prisma.page.delete({ where: { id: pageId } });
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
