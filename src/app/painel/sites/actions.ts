"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireCurrentOrg } from "@/lib/current-org";
import { newBlock } from "@/lib/blocks";

const schema = z.object({ title: z.string().trim().min(2, "Dê um nome ao seu site") });

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
  const parsed = schema.safeParse({ title: formData.get("title") });
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

  const site = await prisma.bioSite.create({
    data: {
      orgId: org.id,
      slug,
      title: parsed.data.title,
      theme: { create: { preset: "moderno", tokens: { primary: "#5b6cff", radius: "1rem" } } },
      blocks: { create: [{ type: profile.type, position: 0, props: profile.props, animation: profile.animation }] },
    },
  });

  redirect(`/painel/sites/${site.id}/editor`);
}
