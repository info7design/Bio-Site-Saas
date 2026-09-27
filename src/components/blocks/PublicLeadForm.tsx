"use client";

import { useFormState } from "react-dom";
import SubmitButton from "@/components/SubmitButton";
import { submitLeadAction, type LeadFormState } from "@/app/[slug]/actions";

const initialState: LeadFormState = {};

export default function PublicLeadForm({ siteId, props }: { siteId: string; props: Record<string, any> }) {
  const action = submitLeadAction.bind(null, siteId);
  const [state, formAction] = useFormState(action, initialState);

  if (state.success) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center text-sm font-medium text-emerald-700">
        Recebemos seus dados. Em breve entramos em contato!
      </div>
    );
  }

  return (
    <form action={formAction} className="rounded-2xl border border-slate-200 p-4">
      <h3 className="font-semibold">{props.title || "Fale com a gente"}</h3>
      <div className="mt-3 flex flex-col gap-2">
        <input name="name" required placeholder="Nome" className="touch-target rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        <input name="phone" required placeholder="Telefone" className="touch-target rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        <input name="email" type="email" placeholder="E-mail (opcional)" className="touch-target rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        <textarea name="message" placeholder="Mensagem" rows={3} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        <label className="flex items-start gap-2 text-xs text-slate-500">
          <input type="checkbox" name="consent" className="mt-0.5 h-4 w-4" />
          {props.consentText || "Concordo com o uso dos meus dados para contato (LGPD)."}
        </label>
      </div>
      {state.error && <p className="mt-2 text-xs font-medium text-red-600">{state.error}</p>}
      <SubmitButton pendingLabel="Enviando...">{props.button || "Enviar"}</SubmitButton>
    </form>
  );
}
