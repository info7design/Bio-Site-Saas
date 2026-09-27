"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireCurrentOrg } from "@/lib/current-org";
import { newBlock } from "@/lib/blocks";

const schema = z.object({
  title: z.string().trim().min(2, "Dê um nome ao seu site"),
  templateId: z.string().optional(),
});

function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 40);
}

export type CreateSiteState = { error?: string };

export async function createSiteAction(_prev: CreateSiteState, formData: FormData): Promise<CreateSiteState> {
  const parsed = schema.safeParse({ title: formData.get("title"), templateId: formData.get("templateId") || undefined });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const { org } = await requireCurrentOrg();

  const maxSites = org.subscription?.plan?.maxBioSites ?? 1;
  if (org.bioSites.length >= maxSites) {
    return { error: `Seu plano permite até ${maxSites} site(s). Faça upgrade para criar mais.` };
  }

  const base = slugify(parsed.data.title) || "site";
  let slug = base;
  let i = 1;
  while (await prisma.bioSite.findUnique({ where: { slug } })) {
    slug = `${base}-${i++}`;
  }

  const profile = newBlock("ProfileBlock");
  profile.props.name = parsed.data.title;

  const template = parsed.data.templateId ? await prisma.template.findUnique({ where: { id: parsed.data.templateId } }) : null;
  const themeFromTemplate = (template?.theme as { preset?: string; tokens?: Record<string, any> } | null) ?? null;

  const site = await prisma.bioSite.create({
    data: {
      orgId: org.id,
      slug,
      title: parsed.data.title,
      theme: {
        create: {
          preset: themeFromTemplate?.preset ?? "moderno",
          tokens: themeFromTemplate?.tokens ?? { primary: "#5b6cff", radius: "1rem" },
        },
      },
      pages: {
        create: [
          {
            slug: "",
            title: "Início",
            position: 0,
            blocks: { create: [{ type: profile.type, position: 0, props: profile.props, animation: profile.animation }] },
          },
        ],
      },
    },
  });

  redirect(`/painel/sites/${site.id}/editor`);
}
