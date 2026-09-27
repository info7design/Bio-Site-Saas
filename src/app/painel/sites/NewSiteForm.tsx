"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import SubmitButton from "@/components/SubmitButton";
import { createSiteAction, type CreateSiteState } from "./actions";

const initialState: CreateSiteState = {};

type Template = { id: string; name: string; primary: string };

export default function NewSiteForm({ templates }: { templates: Template[] }) {
  const [state, formAction] = useFormState(createSiteAction, initialState);
  const [templateId, setTemplateId] = useState(templates[0]?.id ?? "");

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4 rounded-2xl border border-dashed border-slate-300 p-4">
      <label className="text-sm font-medium text-slate-700">
        Nome do novo site
        <input
          name="title"
          required
          placeholder="Ex.: Salão da Ana"
          className="touch-target mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
        />
      </label>

      {templates.length > 0 && (
        <div>
          <p className="text-sm font-medium text-slate-700">Estilo inicial</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {templates.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTemplateId(t.id)}
                className={`touch-target flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium ${templateId === t.id ? "border-violet-500 bg-violet-50" : "border-slate-200"}`}
              >
                <span className="h-3 w-3 rounded-full" style={{ background: t.primary }} />
                {t.name}
              </button>
            ))}
          </div>
        </div>
      )}
      <input type="hidden" name="templateId" value={templateId} />

      <SubmitButton pendingLabel="Criando...">Criar site</SubmitButton>
      {state?.error && <p className="text-sm font-medium text-red-600">{state.error}</p>}
    </form>
  );
}
