import Link from "next/link";

const FEATURES = [
  { title: "Cardápio com pedido no WhatsApp", desc: "Cliente monta o pedido e envia direto pro seu WhatsApp." },
  { title: "Agenda com horários livres", desc: "Cliente escolhe o horário e você recebe a confirmação." },
  { title: "PIX copia e cola", desc: "Receba pagamentos sem taxas, direto na sua chave." },
  { title: "60 modelos prontos", desc: "Escolha um estilo e personalize cores, fontes e blocos." },
];

export default function LandingPage() {
  return (
    <main>
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/90 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2 font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white">M</span>
          manifesti
        </div>
        <Link
          href="/registrar"
          className="touch-target rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm"
        >
          Criar meu site
        </Link>
      </header>

      <section className="px-4 pb-10 pt-8 sm:px-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
          <span className="rounded-full bg-violet-600 px-2 py-0.5 text-white">Novo</span>
          Cardápio com pedido no WhatsApp
        </span>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Seu negócio em um{" "}
          <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-400 bg-clip-text text-transparent">
            link que vende
          </span>
          .
        </h1>
        <p className="mt-4 max-w-xl text-lg text-slate-600">
          Crie em minutos um mini site bonito, com cardápio, agenda, PIX e WhatsApp. Escolha entre 60 modelos e edite tudo direto do celular.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/registrar"
            className="touch-target rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
          >
            Começar grátis
          </Link>
          <Link
            href="/entrar"
            className="touch-target rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700"
          >
            Já tenho conta
          </Link>
        </div>
      </section>

      <section className="grid gap-4 px-4 pb-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <div key={f.title} className="rounded-2xl border border-slate-100 p-5 shadow-sm">
            <h3 className="font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{f.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
