"use client";

import { useState, useTransition } from "react";
import { updateSiteMetaAction } from "./actions";

export default function SiteSettings({
  siteId,
  title,
  seoTitle,
  seoDesc,
  primary,
}: {
  siteId: string;
  title: string;
  seoTitle: string;
  seoDesc: string;
  primary: string;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title, seoTitle, seoDesc, primary });
  const [, startTransition] = useTransition();

  function save() {
    startTransition(() => updateSiteMetaAction(siteId, form));
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="touch-target rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
      >
        Tema
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
          <div className="w-full max-w-sm rounded-t-2xl bg-white p-5 sm:rounded-2xl">
            <h3 className="text-sm font-semibold">Ajustes do site</h3>
            <div className="mt-3 flex flex-col gap-3">
              <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                Nome do site
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="touch-target rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                Cor principal
                <input type="color" value={form.primary} onChange={(e) => setForm({ ...form, primary: e.target.value })} className="h-10 w-full rounded-xl border border-slate-200" />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                Título para o Google (SEO)
                <input value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} className="touch-target rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                Descrição para o Google (SEO)
                <textarea value={form.seoDesc} onChange={(e) => setForm({ ...form, seoDesc: e.target.value })} rows={2} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              </label>
            </div>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => setOpen(false)} className="touch-target flex-1 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600">
                Cancelar
              </button>
              <button type="button" onClick={save} className="touch-target flex-1 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
