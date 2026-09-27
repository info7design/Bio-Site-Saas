import { requireCurrentOrg } from "@/lib/current-org";
import { logoutAction } from "./actions";
import PanelChrome from "@/components/panel/PanelChrome";

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const { session, org } = await requireCurrentOrg();

  const nav = [
    { href: "/painel", label: "Dashboard", icon: "grid" },
    { href: "/painel/sites", label: "Sites", icon: "layout" },
    { href: "/painel/leads", label: "Leads", icon: "users" },
    { href: "/painel/agenda", label: "Agenda", icon: "calendar" },
    { href: "/painel/conta", label: "Conta", icon: "user" },
  ];

  return (
    <PanelChrome
      nav={nav}
      orgName={org.name}
      userName={session.user.name}
      logoutAction={logoutAction}
    >
      {children}
    </PanelChrome>
  );
}
