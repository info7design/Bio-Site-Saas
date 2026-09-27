"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { publishSiteAction, updateSiteMetaAction } from "@/app/painel/sites/[siteId]/editor/actions";

export default function PublishBar({
  siteId,
  slug,
  title,
  seoTitle,
  seoDesc,
  primary,
  published: initialPublished,
}: {
  siteId: string;
  slug: string;
  title: string;
  seoTitle: string;
  seoDesc: string;
  primary: string;
  published: boolean;
}) {
  const [published, setPublished] = useState(initialPublished);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title, seoTitle, seoDesc, primary });
  const [, startTransition] = useTransition();
  const router = useRouter();

  function togglePublish() {
    const next = !published;
    setPublished(next);
    startTransition(async () => {
      await publishSiteAction(siteId, next);
      router.refresh();
    });
  }

  function save() {
    startTransition(async () => {
      await updateSiteMetaAction(siteId, form);
      router.refresh();
    });
    setOpen(false);
  }

  return (
    <>
      <span className={`pill ${published ? "live" : "warn"} hide-sm`}>manifesti.com.br/{slug}</span>
      <span className="save hide-sm">{published ? "Publicado" : "Rascunho"}</span>
      <button type="button" className="btn" onClick={() => setOpen(true)}>
        Tema
      </button>
      <button type="button" className="btn primary" onClick={togglePublish}>
        {published ? "Despublicar" : "Publicar"}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.4)" }}>
          <div className="card" style={{ width: "min(90vw,380px)" }}>
            <h3 style={{ marginBottom: 12 }}>Ajustes do site</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div className="fld">
                <label>Nome do site</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="fld">
                <label>Cor principal</label>
                <input type="color" value={form.primary} onChange={(e) => setForm({ ...form, primary: e.target.value })} />
              </div>
              <div className="fld">
                <label>Título para o Google (SEO)</label>
                <input value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} />
              </div>
              <div className="fld">
                <label>Descrição para o Google (SEO)</label>
                <textarea value={form.seoDesc} onChange={(e) => setForm({ ...form, seoDesc: e.target.value })} rows={2} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <button type="button" className="btn" style={{ flex: 1, justifyContent: "center" }} onClick={() => setOpen(false)}>
                Cancelar
              </button>
              <button type="button" className="btn primary" style={{ flex: 1, justifyContent: "center" }} onClick={save}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
