import { requireCurrentOrg } from "@/lib/current-org";

export default async function ContaPage() {
  const { session, org } = await requireCurrentOrg();

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-bold">Sua conta</h1>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-400">Nome</p>
        <p className="font-medium">{session.user.name}</p>
        <p className="mt-3 text-sm text-slate-400">E-mail</p>
        <p className="font-medium">{session.user.email}</p>
        <p className="mt-3 text-sm text-slate-400">Negócio</p>
        <p className="font-medium">{org.name}</p>
        <p className="mt-3 text-sm text-slate-400">Plano</p>
        <p className="font-medium">{org.subscription?.plan?.name ?? "Grátis"}</p>
      </div>
    </div>
  );
}
