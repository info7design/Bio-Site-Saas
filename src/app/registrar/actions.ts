"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, hashPassword } from "@/lib/auth";

const schema = z.object({
  name: z.string().trim().min(2, "Informe seu nome"),
  email: z.string().trim().toLowerCase().email("E-mail inválido"),
  password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres"),
  orgName: z.string().trim().min(2, "Informe o nome do seu negócio"),
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

export type RegisterState = { error?: string };

export async function registerAction(_prev: RegisterState, formData: FormData): Promise<RegisterState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    orgName: formData.get("orgName"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }
  const { name, email, password, orgName } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "Já existe uma conta com este e-mail" };

  const baseSlug = slugify(orgName) || "negocio";
  let slug = baseSlug;
  let i = 1;
  while (await prisma.organization.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${i++}`;
  }

  const freePlan = await prisma.plan.findUnique({ where: { key: "gratis" } });

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: await hashPassword(password),
      memberships: {
        create: {
          role: "OWNER",
          org: {
            create: {
              name: orgName,
              slug,
              ...(freePlan
                ? { subscription: { create: { planId: freePlan.id, status: "active" } } }
                : {}),
            },
          },
        },
      },
    },
  });

  await createSession(user.id);
  redirect("/painel");
}
