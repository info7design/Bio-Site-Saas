import { requireCurrentOrg } from "@/lib/current-org";

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  await requireCurrentOrg();
  return <>{children}</>;
}
