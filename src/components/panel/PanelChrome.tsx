"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";
import "@/styles/manifesti.css";

type NavItem = { href: string; label: string; icon: string };

const SOON = [
  { label: "Domínios", icon: "globe" },
  { label: "Integrações", icon: "plug" },
  { label: "Usuários", icon: "user" },
  { label: "Assinatura", icon: "card" },
];

export default function PanelChrome({
  children,
  nav,
  orgName,
  userName,
  planName,
  siteCount,
  maxSites,
  logoutAction,
  salesPageHref = "/",
  siteSwitcher,
  topRight,
}: {
  children: React.ReactNode;
  nav: NavItem[];
  orgName: string;
  userName: string;
  planName?: string;
  siteCount?: number;
  maxSites?: number;
  logoutAction: () => Promise<void>;
  salesPageHref?: string;
  siteSwitcher?: React.ReactNode;
  topRight?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const usagePct = maxSites ? Math.min(100, Math.round(((siteCount ?? 0) / maxSites) * 100)) : 0;
  const activeLabel = nav.find((item) => pathname === item.href || pathname?.startsWith(item.href + "/"))?.label ?? "Painel";
  const isEditor = pathname?.includes("/editor");

  return (
    <div className={`app ${open ? "side-open" : ""}`}>
      <aside className="side">
        <div className="brand">
          <span className="logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 19V6.5a1.5 1.5 0 0 1 2.6-1L12 10l4.4-4.5A1.5 1.5 0 0 1 19 6.5V19" />
            </svg>
          </span>
          <span>manifesti</span>
          <button type="button" className="btn ib sideclose" onClick={() => setOpen(false)} aria-label="Fechar menu">
            ×
          </button>
        </div>

        {siteSwitcher}

        <nav className="nav">
          {nav.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} onClick={() => setOpen(false)}>
                <Icon name={item.icon} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="navlabel">Em breve</div>
        <nav className="nav">
          {SOON.map((item) => (
            <button key={item.label} type="button" className="soon" disabled>
              <Icon name={item.icon} />
              {item.label}
              <small>pró</small>
            </button>
          ))}
        </nav>

        <div className="foot">
          <Link href={salesPageHref} className="btn sm" style={{ justifyContent: "center" }}>
            Ver página de vendas
          </Link>

          {maxSites != null && (
            <div className="usage">
              <div className="ut">
                <span>Sites</span>
                <b>
                  {siteCount} de {maxSites}
                </b>
              </div>
              <div className="ub">
                <i style={{ width: `${usagePct}%` }} />
              </div>
              {planName && <small>Plano {planName}</small>}
            </div>
          )}

          <div className="me">
            <span className="mav">{userName.slice(0, 2).toUpperCase()}</span>
            <span>
              <b>{userName}</b>
              <small>{orgName}</small>
            </span>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="btn sm" style={{ width: "100%", justifyContent: "center" }}>
              Sair
            </button>
          </form>
        </div>
      </aside>

      <div className="main">
        <header className="top">
          <button type="button" className="btn ib" onClick={() => setOpen(true)} aria-label="Abrir menu">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h10" />
            </svg>
          </button>
          <h1>{activeLabel}</h1>
          {topRight}
        </header>

        <section className={`view ${isEditor ? "editor-host" : ""}`}>{children}</section>
      </div>

      <button type="button" className="scrim" aria-label="Fechar menu" onClick={() => setOpen(false)} />
    </div>
  );
}
