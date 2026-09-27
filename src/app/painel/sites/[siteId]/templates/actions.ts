"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireCurrentOrg } from "@/lib/current-org";

export async function applyTemplateAction(siteId: string, templateId: string) {
  const { org } = await requireCurrentOrg();
  const site = org.bioSites.find((s) => s.id === siteId);
  if (!site) throw new Error("Site não encontrado");

  const template = await prisma.template.findUnique({ where: { id: templateId } });
  if (!template) throw new Error("Template não encontrado");

  const theme = template.theme as { preset?: string; tokens?: Record<string, any> };
  const current = await prisma.siteTheme.findUnique({ where: { siteId } });

  await prisma.siteTheme.upsert({
    where: { siteId },
    update: { preset: theme.preset ?? "moderno", tokens: { ...(current?.tokens as any), ...theme.tokens } },
    create: { siteId, preset: theme.preset ?? "moderno", tokens: theme.tokens ?? {} },
  });

  revalidatePath(`/painel/sites/${siteId}`);
}
