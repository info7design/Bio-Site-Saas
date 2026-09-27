export default function DemoContaPage() {
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-bold">Sua conta</h1>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-400">Nome</p>
        <p className="font-medium">Visitante</p>
        <p className="mt-3 text-sm text-slate-400">E-mail</p>
        <p className="font-medium">demo@manifesti.com.br</p>
        <p className="mt-3 text-sm text-slate-400">Negócio</p>
        <p className="font-medium">Salão da Ana (demonstração)</p>
        <p className="mt-3 text-sm text-slate-400">Plano</p>
        <p className="font-medium">Premium</p>
      </div>

      <p className="mt-4 text-sm text-slate-500">
        Crie sua conta grátis para ter seus próprios dados, salvos de verdade.
      </p>
    </div>
  );
}
