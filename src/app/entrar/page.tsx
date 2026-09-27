"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import SubmitButton from "@/components/SubmitButton";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function EntrarPage() {
  const [state, formAction] = useFormState(loginAction, initialState);

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-5 py-10">
      <h1 className="text-2xl font-bold">Entrar</h1>
      <p className="mt-1 text-sm text-slate-600">Acesse o painel do seu site.</p>

      <form action={formAction} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          E-mail
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className="touch-target rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Senha
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="touch-target rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
        </label>

        {state?.error && <p className="text-sm font-medium text-red-600">{state.error}</p>}

        <SubmitButton pendingLabel="Entrando...">Entrar</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Ainda não tem conta?{" "}
        <Link href="/registrar" className="font-semibold text-violet-700">
          Criar grátis
        </Link>
      </p>
    </main>
  );
}
