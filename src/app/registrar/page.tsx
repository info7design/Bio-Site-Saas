"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import SubmitButton from "@/components/SubmitButton";
import { registerAction, type RegisterState } from "./actions";

const initialState: RegisterState = {};

export default function RegistrarPage() {
  const [state, formAction] = useFormState(registerAction, initialState);

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-5 py-10">
      <h1 className="text-2xl font-bold">Criar sua conta</h1>
      <p className="mt-1 text-sm text-slate-600">Grátis para começar, sem cartão.</p>

      <form action={formAction} className="mt-6 flex flex-col gap-4">
        <Field label="Seu nome" name="name" type="text" autoComplete="name" required />
        <Field label="Nome do seu negócio" name="orgName" type="text" autoComplete="organization" required />
        <Field label="E-mail" name="email" type="email" autoComplete="email" required />
        <Field label="Senha (mín. 8 caracteres)" name="password" type="password" autoComplete="new-password" required minLength={8} />

        {state?.error && <p className="text-sm font-medium text-red-600">{state.error}</p>}

        <SubmitButton pendingLabel="Criando...">Criar minha conta</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Já tem conta?{" "}
        <Link href="/entrar" className="font-semibold text-violet-700">
          Entrar
        </Link>
      </p>
    </main>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, name, ...rest } = props;
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
      {label}
      <input
        {...rest}
        name={name}
        className="touch-target rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
      />
    </label>
  );
}
