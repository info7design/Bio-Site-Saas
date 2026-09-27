import PanelChrome from "@/components/panel/PanelChrome";
import { demoLogoutAction } from "./actions";
import "@/styles/manifesti.css";

const nav = [
  { href: "/demo/painel", label: "Painel", icon: "home" },
  { href: "/demo/editor", label: "Editor", icon: "layout" },
  { href: "/demo/templates", label: "Templates", icon: "grid" },
  { href: "/demo/pedidos", label: "Pedidos", icon: "bag" },
  { href: "/demo/leads", label: "Leads", icon: "users" },
  { href: "/demo/agendamentos", label: "Agendamentos", icon: "cal" },
];

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <PanelChrome
      nav={nav}
      orgName="Salão da Ana"
      userName="Visitante"
      planName="Premium"
      siteCount={1}
      maxSites={3}
      logoutAction={demoLogoutAction}
      topRight={
        <>
          <span className="pill live hide-sm">manifesti.com.br/salao-da-ana</span>
          <span className="save hide-sm">Publicado</span>
          <button type="button" className="btn" disabled>
            Tema
          </button>
          <button type="button" className="btn primary" disabled>
            Publicar
          </button>
        </>
      }
    >
      {children}
    </PanelChrome>
  );
}
