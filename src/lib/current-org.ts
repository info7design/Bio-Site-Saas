import "server-only";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function requireCurrentOrg() {
  const session = await getSession();
  if (!session) redirect("/entrar");

  const membership = session.user.memberships[0];
  if (!membership) redirect("/entrar");

  const org = await prisma.organization.findUnique({
    where: { id: membership.orgId },
    include: { bioSites: { orderBy: { createdAt: "asc" } }, subscription: { include: { plan: true } } },
  });
  if (!org) redirect("/entrar");

  return { session, org, role: membership.role };
}
