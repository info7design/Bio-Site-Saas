"use client";

import { useFormState } from "react-dom";
import SubmitButton from "@/components/SubmitButton";
import { createSiteAction, type CreateSiteState } from "./actions";

const initialState: CreateSiteState = {};

export default function NewSiteForm() {
  const [state, formAction] = useFormState(createSiteAction, initialState);

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-3 rounded-2xl border border-dashed border-slate-300 p-4 sm:flex-row sm:items-end">
      <label className="flex-1 text-sm font-medium text-slate-700">
        Nome do novo site
        <input
          name="title"
          required
          placeholder="Ex.: Salão da Ana"
          className="touch-target mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
        />
      </label>
      <SubmitButton pendingLabel="Criando...">Criar site</SubmitButton>
      {state?.error && <p className="text-sm font-medium text-red-600 sm:basis-full">{state.error}</p>}
    </form>
  );
}
