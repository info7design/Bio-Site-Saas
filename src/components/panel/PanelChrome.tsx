"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string; icon: string };

export default function PanelChrome({
  children,
  nav,
  orgName,
  userName,
  logoutAction,
}: {
  children: React.ReactNode;
  nav: NavItem[];
  orgName: string;
  userName: string;
  logoutAction: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isEditor = pathname?.includes("/editor");

  return (
    <div className="flex min-h-dvh flex-col bg-slate-50 lg:flex-row">
      {/* Sidebar desktop / gaveta mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
          <div className="flex items-center gap-2 font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white">
              M
            </span>
            {orgName}
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="touch-target grid place-items-center rounded-lg text-slate-500 lg:hidden"
            aria-label="Fechar menu"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`touch-target flex items-center rounded-xl px-3 py-2.5 text-sm font-medium ${
                  active ? "bg-violet-50 text-violet-700" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 p-3">
          <div className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-200 text-xs font-semibold">
              {userName.slice(0, 2).toUpperCase()}
            </span>
            <span className="truncate font-medium">{userName}</span>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="touch-target mt-1 w-full rounded-xl px-3 py-2 text-left text-sm text-slate-500 hover:bg-slate-50">
              Sair
            </button>
          </form>
        </div>
      </aside>

      {open && (
        <button
          aria-label="Fechar menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
        />
      )}

      <div className="flex min-h-dvh flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
            className="touch-target grid place-items-center rounded-lg text-slate-600"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h10" />
            </svg>
          </button>
          <span className="font-semibold">{orgName}</span>
        </header>

        <main className={`flex-1 ${isEditor ? "" : "p-4 pb-24 lg:p-8"}`}>{children}</main>
      </div>
    </div>
  );
}
