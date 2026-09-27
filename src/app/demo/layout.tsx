import PanelChrome from "@/components/panel/PanelChrome";
import { demoLogoutAction } from "./actions";

const nav = [
  { href: "/demo", label: "Dashboard", icon: "grid" },
  { href: "/demo/sites", label: "Sites", icon: "layout" },
  { href: "/demo/leads", label: "Leads", icon: "users" },
  { href: "/demo/agenda", label: "Agenda", icon: "calendar" },
  { href: "/demo/conta", label: "Conta", icon: "user" },
];

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <PanelChrome nav={nav} orgName="Salão da Ana (demo)" userName="Visitante" logoutAction={demoLogoutAction}>
      {children}
    </PanelChrome>
  );
}
