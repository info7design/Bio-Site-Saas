import type { BlockType } from "@/lib/blocks";
import { whatsappUrl, wifiQrString } from "@/lib/whatsapp";
import { buildPixPayload } from "@/lib/pix";
import QrCanvas from "@/components/blocks/QrCanvas";
import PublicLeadForm from "@/components/blocks/PublicLeadForm";
import PublicBookingBlock from "@/components/blocks/PublicBookingBlock";
import PublicCatalogBlock from "@/components/blocks/PublicCatalogBlock";

function money(cents?: number | null) {
  if (!cents && cents !== 0) return null;
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

type PublicContext = {
  siteId: string;
  appUrl?: string;
  services?: { id: string; name: string; durationMin: number }[];
};

export default function BlockView({
  type,
  props,
  mode = "edit",
  context,
}: {
  type: BlockType;
  props: Record<string, any>;
  mode?: "edit" | "public";
  context?: PublicContext;
}) {
  switch (type) {
    case "ProfileBlock":
      return (
        <div className="text-center">
          {props.cover && (
            <div className="h-28 w-full rounded-t-2xl bg-slate-200 bg-cover bg-center" style={{ backgroundImage: `url(${props.cover})` }} />
          )}
          <div className={`mx-auto -mt-8 h-20 w-20 overflow-hidden rounded-full border-4 border-white bg-slate-200 ${!props.cover ? "mt-4" : ""}`}>
            {props.avatar && <img src={props.avatar} alt={props.name} className="h-full w-full object-cover" />}
          </div>
          <h2 className="mt-2 text-lg font-bold">{props.name || "Seu nome"}</h2>
          {props.headline && <p className="text-sm text-slate-500">{props.headline}</p>}
          {props.bio && <p className="mt-1 px-4 text-sm text-slate-600">{props.bio}</p>}
        </div>
      );

    case "TextBlock":
      return (
        <div className="px-1">
          {props.title && <h3 className="font-semibold">{props.title}</h3>}
          <p className="whitespace-pre-wrap text-sm text-slate-600">{props.text}</p>
        </div>
      );

    case "ButtonBlock":
      return (
        <div className="flex flex-col gap-2">
          {(props.items ?? []).map((it: any) => (
            <a
              key={it.id}
              href={it.url}
              target="_blank"
              rel="noreferrer"
              className="touch-target flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium shadow-sm"
            >
              {it.emoji && <span>{it.emoji}</span>} {it.title}
            </a>
          ))}
        </div>
      );

    case "SocialBlock":
      return (
        <div className="flex flex-wrap justify-center gap-3">
          {(props.items ?? []).map((it: any, i: number) => (
            <a key={i} href={it.url} target="_blank" rel="noreferrer" className="touch-target rounded-full bg-slate-100 px-4 py-2 text-sm font-medium">
              {it.network}
            </a>
          ))}
        </div>
      );

    case "WhatsAppBlock":
      return (
        <a
          href={props.phone ? whatsappUrl(props.phone, props.message) : "#"}
          target="_blank"
          rel="noreferrer"
          className="touch-target flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-sm"
        >
          {props.label || "Fale comigo no WhatsApp"}
        </a>
      );

    case "CatalogBlock":
      if (mode === "public" && context) {
        return <PublicCatalogBlock siteId={context.siteId} title={props.title} phone={props.phone} items={props.items ?? []} />;
      }
      return (
        <div>
          {props.title && <h3 className="mb-2 font-semibold">{props.title}</h3>}
          <div className="flex flex-col gap-3">
            {(props.items ?? []).map((it: any, i: number) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-slate-100 p-2">
                {it.imageId && <img src={it.imageId} alt={it.name} className="h-14 w-14 rounded-lg object-cover" />}
                <div className="flex-1">
                  <p className="text-sm font-semibold">{it.name}</p>
                  {it.description && <p className="text-xs text-slate-500">{it.description}</p>}
                </div>
                {money(it.priceCents) && <span className="text-sm font-semibold">{money(it.priceCents)}</span>}
              </div>
            ))}
          </div>
        </div>
      );

    case "ServiceBlock":
      return (
        <div>
          {props.title && <h3 className="mb-2 font-semibold">{props.title}</h3>}
          <div className="flex flex-col gap-2">
            {(props.items ?? []).map((it: any, i: number) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                <div>
                  <p className="text-sm font-semibold">{it.name}</p>
                  <p className="text-xs text-slate-500">{it.durationMin} min</p>
                </div>
                {money(it.priceCents) && <span className="text-sm font-semibold">{money(it.priceCents)}</span>}
              </div>
            ))}
          </div>
        </div>
      );

    case "BookingBlock":
      if (mode === "public" && context) {
        return <PublicBookingBlock siteId={context.siteId} title={props.title} services={context.services ?? []} />;
      }
      return (
        <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500">
          {props.title || "Agende seu horário"}
          <p className="mt-1 text-xs">Agendamento disponível na página pública.</p>
        </div>
      );

    case "PixBlock": {
      const payload = props.key && props.receiver ? buildPixPayload({ key: props.key, receiver: props.receiver, city: props.city }) : null;
      return (
        <div className="rounded-2xl border border-slate-200 p-4 text-center">
          <p className="text-sm font-semibold">{props.label || "Pagar com PIX"}</p>
          {payload && mode === "public" && <QrCanvas value={payload} size={160} />}
          {payload && <p className="mt-2 break-all rounded-lg bg-slate-50 p-2 text-[10px] text-slate-500">{payload}</p>}
        </div>
      );
    }

    case "MapBlock":
      return (
        <div className="rounded-xl bg-slate-100 p-4 text-center text-sm text-slate-500">
          📍 {props.address || "Endereço não informado"}
        </div>
      );

    case "GalleryBlock":
      return (
        <div className="grid grid-cols-3 gap-1.5">
          {(props.items ?? []).map((it: any, i: number) => (
            <img key={i} src={it.url} alt="" className="aspect-square w-full rounded-lg object-cover" />
          ))}
        </div>
      );

    case "VideoBlock":
      return props.url ? (
        <div className="overflow-hidden rounded-xl">
          <video src={props.url} controls className="w-full" />
        </div>
      ) : null;

    case "LeadFormBlock":
      if (mode === "public" && context) {
        return <PublicLeadForm siteId={context.siteId} props={props} />;
      }
      return (
        <div className="rounded-2xl border border-slate-200 p-4">
          <h3 className="font-semibold">{props.title || "Fale com a gente"}</h3>
          <div className="mt-3 flex flex-col gap-2">
            <div className="touch-target rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-400">Nome</div>
            <div className="touch-target rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-400">Telefone</div>
          </div>
          <button className="touch-target mt-3 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">
            {props.button || "Enviar"}
          </button>
        </div>
      );

    case "WifiBlock":
      return (
        <div className="rounded-2xl border border-slate-200 p-4 text-center text-sm">
          <p className="font-semibold">📶 {props.ssid || "Rede Wi-Fi"}</p>
          {mode === "public" && props.ssid && <QrCanvas value={wifiQrString(props.ssid, props.password ?? "", props.security ?? "WPA")} size={160} />}
          <p className="text-slate-500">Toque para conectar</p>
        </div>
      );

    case "Tour360Block":
      return props.source ? (
        <div className="overflow-hidden rounded-xl">
          <iframe src={props.source} className="h-56 w-full" />
        </div>
      ) : null;

    case "QRCodeBlock":
      if (mode === "public" && context?.appUrl) {
        return <QrCanvas value={`${context.appUrl}/`} fg={props.fg} bg={props.bg} />;
      }
      return <div className="mx-auto h-32 w-32 rounded-xl border border-slate-200" style={{ background: props.bg }} />;

    case "DividerBlock":
      return <hr className="border-slate-200" />;

    case "CarouselBlock":
      return (
        <div className="flex gap-2 overflow-x-auto">
          {(props.items ?? []).map((it: any, i: number) => (
            <img key={i} src={it.url} alt="" className="h-28 w-44 flex-shrink-0 rounded-xl object-cover" />
          ))}
        </div>
      );

    case "TestimonialsBlock":
      return (
        <div className="flex flex-col gap-2">
          {(props.items ?? []).map((it: any, i: number) => (
            <div key={i} className="rounded-xl bg-slate-50 p-3 text-sm">
              <p className="italic text-slate-600">“{it.text}”</p>
              <p className="mt-1 text-xs font-semibold">— {it.name}</p>
            </div>
          ))}
        </div>
      );

    case "CustomHTMLBlock":
      return <div dangerouslySetInnerHTML={{ __html: props.html ?? "" }} />;

    default:
      return null;
  }
}
