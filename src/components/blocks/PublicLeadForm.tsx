"use client";

import { useFormState } from "react-dom";
import { submitLeadAction, type LeadFormState } from "@/app/[slug]/actions";

const initialState: LeadFormState = {};

export default function PublicLeadForm({ siteId, props }: { siteId: string; props: Record<string, any> }) {
  const action = submitLeadAction.bind(null, siteId);
  const [state, formAction] = useFormState(action, initialState);

  if (state.success) {
    return (
      <div className="pcard" style={{ textAlign: "center" }}>
        Recebemos seus dados. Em breve entramos em contato!
      </div>
    );
  }

  return (
    <form action={formAction} className="pcard">
      <div className="ptitle">{props.title || "Fale com a gente"}</div>
      <input name="name" required placeholder="Nome" className="pfield" />
      <input name="phone" required placeholder="Telefone" className="pfield" />
      <input name="email" type="email" placeholder="E-mail (opcional)" className="pfield" />
      <textarea name="message" placeholder="Mensagem" rows={3} className="pfield" />
      <label style={{ display: "flex", gap: 8, fontSize: 12, marginBottom: 10 }}>
        <input type="checkbox" name="consent" style={{ width: "auto" }} />
        {props.consentText || "Concordo com o uso dos meus dados para contato (LGPD)."}
      </label>
      {state.error && <p style={{ color: "var(--bad, #d92d20)", fontSize: 13, marginBottom: 8 }}>{state.error}</p>}
      <button type="submit" className="pblk">{props.button || "Enviar"}</button>
    </form>
  );
}
