import { redirect } from "next/navigation";
import { requireCurrentOrg } from "@/lib/current-org";

export default async function PainelIndexPage() {
  const { org } = await requireCurrentOrg();
  const first = org.bioSites[0];
  redirect(first ? `/painel/sites/${first.id}/painel` : "/painel/sites");
}
