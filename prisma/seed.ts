import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PLANS = [
  { key: "gratis", name: "Grátis", priceCents: 0, maxBioSites: 1, maxSubaccounts: 0, features: { paginas: 1, templatesPremium: false, dominio: false, agendamento: false, pix: false } },
  { key: "pro", name: "Pro", priceCents: 9790, maxBioSites: 1, maxSubaccounts: 0, features: { paginas: 3, templatesPremium: true, dominio: false, agendamento: true, pix: true } },
  { key: "premium", name: "Premium", priceCents: 19790, maxBioSites: 3, maxSubaccounts: 0, features: { paginas: 3, templatesPremium: true, dominio: true, agendamento: true, pix: true, analytics: true } },
  { key: "scale", name: "Scale", priceCents: 29790, maxBioSites: 10, maxSubaccounts: 3, features: { paginas: 3, templatesPremium: true, dominio: true, agendamento: true, pix: true, analytics: true, whiteLabel: false } },
  { key: "whitelabel", name: "Whitelabel", priceCents: 0, maxBioSites: 999, maxSubaccounts: 999, features: { paginas: 3, templatesPremium: true, dominio: true, agendamento: true, pix: true, analytics: true, whiteLabel: true } },
];

const TEMPLATES = [
  { category: "geral", name: "Moderno", theme: { preset: "moderno", tokens: { primary: "#5b6cff", radius: "1rem" } }, blocks: [] },
  { category: "geral", name: "Minimalista", theme: { preset: "minimalista", tokens: { primary: "#111827", radius: "0.5rem" } }, blocks: [] },
  { category: "cardapio", name: "Restaurante", theme: { preset: "restaurante", tokens: { primary: "#e11d48", radius: "1.25rem" } }, blocks: [] },
];

async function main() {
  for (const plan of PLANS) {
    await prisma.plan.upsert({ where: { key: plan.key }, update: plan, create: plan });
  }
  for (const tpl of TEMPLATES) {
    const existing = await prisma.template.findFirst({ where: { name: tpl.name } });
    if (!existing) await prisma.template.create({ data: tpl });
  }
  console.log("Seed concluído: planos e templates.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
