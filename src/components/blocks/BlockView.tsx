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

const BUTTON_STYLES: Record<string, string> = {
  solido: "bg-slate-900 text-white border-transparent",
  suave: "bg-violet-50 text-violet-700 border-transparent",
  contorno: "bg-transparent text-slate-900 border-slate-300",
  vidro: "bg-white/60 text-slate-900 border-white/40 backdrop-blur",
  pilula: "bg-white text-slate-900 border-slate-200 !rounded-full",
  degrade: "bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white border-transparent",
};

const COVER_FORMAT_CLASS: Record<string, string> = {
  card: "rounded-2xl",
  fullscreen: "rounded-none -mx-4 w-[calc(100%+2rem)]",
  arc: "rounded-b-[3rem]",
  wave: "[clip-path:ellipse(75%_100%_at_50%_0%)]",
  diagonal: "[clip-path:polygon(0_0,100%_0,100%_85%,0_100%)]",
  organic: "rounded-[2rem_3rem_1rem_3rem]",
};

const COVER_HEIGHT_CLASS: Record<string, string> = { baixa: "h-24", media: "h-40", alta: "h-56" };

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
    case "CoverBlock":
      return (
        <div
          className={`relative flex flex-col justify-end overflow-hidden bg-slate-200 bg-cover bg-center p-4 text-white ${COVER_FORMAT_CLASS[props.format] ?? COVER_FORMAT_CLASS.card} ${COVER_HEIGHT_CLASS[props.height] ?? COVER_HEIGHT_CLASS.media}`}
          style={{ backgroundImage: props.image ? `url(${props.image})` : undefined }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0" />
          <div className={`relative ${props.textAlign === "center" ? "text-center" : "text-left"}`}>
            <h2 className="text-xl font-bold">{props.title || "Seu negócio"}</h2>
            {props.subtitle && <p className="text-sm text-white/80">{props.subtitle}</p>}
          </div>
        </div>
      );

    case "StoriesBlock":
      return (
        <div className="flex gap-3 overflow-x-auto px-1">
          {(props.items ?? []).map((it: any, i: number) => (
            <div key={i} className="flex flex-shrink-0 flex-col items-center gap-1">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 p-0.5">
                <div className="h-full w-full overflow-hidden rounded-full border-2 border-white bg-slate-200 bg-cover bg-center" style={{ backgroundImage: it.image ? `url(${it.image})` : undefined }} />
              </div>
              <span className="max-w-[4rem] truncate text-[11px] text-slate-600">{it.title}</span>
            </div>
          ))}
        </div>
      );

    case "BigTitleBlock":
      return <h1 className={`text-2xl font-extrabold leading-tight ${props.align === "center" ? "text-center" : "text-left"}`}>{props.text}</h1>;

    case "DetailLineBlock":
      return (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>{props.icon}</span>
          <span>{props.text}</span>
        </div>
      );

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
              className={`touch-target flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium shadow-sm ${BUTTON_STYLES[it.style] ?? BUTTON_STYLES.contorno}`}
            >
              {it.emoji && <span>{it.emoji}</span>} {it.title}
            </a>
          ))}
        </div>
      );

    case "IconGridBlock":
      return (
        <div className="grid grid-cols-4 gap-3">
          {(props.items ?? []).map((it: any, i: number) => (
            <a key={i} href={it.url} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-xl">{it.icon}</span>
              <span className="max-w-[3.5rem] truncate text-[11px] text-slate-600">{it.label}</span>
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

    case "ImageBlocksBlock":
      return (
        <div className={props.layout === "list" ? "flex flex-col gap-3" : props.layout === "mosaic" ? "grid grid-cols-3 gap-1.5 [&>*:first-child]:col-span-2 [&>*:first-child]:row-span-2" : "grid grid-cols-2 gap-1.5"}>
          {(props.items ?? []).map((it: any, i: number) => (
            <figure key={i} className="overflow-hidden rounded-xl">
              <img src={it.url} alt={it.caption ?? ""} className="aspect-square w-full object-cover" />
              {it.caption && <figcaption className="mt-1 text-xs text-slate-500">{it.caption}</figcaption>}
            </figure>
          ))}
        </div>
      );

    case "PhotoStripBlock":
      return (
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4">
          {(props.items ?? []).map((it: any, i: number) => (
            <img key={i} src={it.url} alt="" className="h-24 w-24 flex-shrink-0 rounded-xl object-cover" />
          ))}
        </div>
      );

    case "CardsBlock":
      return (
        <div className="flex flex-col gap-3">
          {(props.items ?? []).map((it: any, i: number) => (
            <a key={i} href={it.url || undefined} className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
              {it.image && <img src={it.image} alt="" className="h-28 w-full object-cover" />}
              <div className="p-3">
                <p className="text-sm font-semibold">{it.title}</p>
                {it.text && <p className="mt-0.5 text-xs text-slate-500">{it.text}</p>}
              </div>
            </a>
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

    case "FixedIconBarBlock":
      return (
        <div className="sticky bottom-2 z-10 mx-auto flex w-fit gap-4 rounded-full border border-slate-200 bg-white/90 px-4 py-2 shadow-lg backdrop-blur">
          {(props.items ?? []).map((it: any, i: number) => (
            <a key={i} href={it.url} target="_blank" rel="noreferrer" className="touch-target grid place-items-center text-lg">
              {it.icon}
            </a>
          ))}
        </div>
      );

    case "CustomHTMLBlock":
      return <div dangerouslySetInnerHTML={{ __html: props.html ?? "" }} />;

    default:
      return null;
  }
}
