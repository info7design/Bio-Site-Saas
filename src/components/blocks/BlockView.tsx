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

const HEIGHT_CLASS: Record<string, string> = { baixa: "h-s", media: "h-m", alta: "h-l" };

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
        <div className={`cov ${HEIGHT_CLASS[props.height] ?? "h-m"} ${props.textAlign === "center" ? "al-center" : ""}`}>
          <div className="bgm" style={{ backgroundImage: props.image ? `url(${props.image})` : undefined }} />
          <div className="ct">
            {props.badge && <span className="bd">{props.badge}</span>}
            <h2>{props.title || "Seu negócio"}</h2>
            {props.subtitle && <p>{props.subtitle}</p>}
          </div>
        </div>
      );

    case "StoriesBlock":
      return (
        <div className="stories">
          {(props.items ?? []).map((it: any, i: number) => (
            <button key={i} type="button" className="st">
              <span className="sr" style={{ backgroundImage: it.image ? `url(${it.image})` : undefined }} />
              <span className="sl">{it.title}</span>
            </button>
          ))}
        </div>
      );

    case "BigTitleBlock":
      return <h2 style={{ textAlign: props.align === "center" ? "center" : "left" }}>{props.text}</h2>;

    case "DetailLineBlock":
      return (
        <div className="sect" style={{ marginBottom: 0 }}>
          <span>{props.icon} {props.text}</span>
        </div>
      );

    case "ProfileBlock":
      return (
        <div className="pfl">
          <div className="av" style={{ backgroundImage: props.avatar ? `url(${props.avatar})` : undefined }}>
            {!props.avatar && (props.name || "?").slice(0, 1).toUpperCase()}
          </div>
          <h2 className="pname">{props.name || "Seu nome"}</h2>
          {props.handle && <span className="hnd">{props.handle}</span>}
          {props.headline && <span className="phead">{props.headline}</span>}
          {props.bio && <p className="pbio">{props.bio}</p>}
          {props.location && <span className="loc">📍 {props.location}</span>}
        </div>
      );

    case "TextBlock":
      return (
        <div>
          {props.title && <h3 style={{ marginBottom: 6 }}>{props.title}</h3>}
          <p style={{ whiteSpace: "pre-wrap", color: "var(--muted, var(--text))" }}>{props.text}</p>
        </div>
      );

    case "ButtonBlock":
      return (
        <div className="pbtns">
          {(props.items ?? []).map((it: any) => (
            <a
              key={it.id}
              href={it.url}
              target="_blank"
              rel="noreferrer"
              className={`pbtn v-${it.style || "solid"} ${it.size && it.size !== "m" ? `sz-${it.size}` : ""}`}
            >
              {it.emoji && <span className="bt" style={{ display: "grid", placeItems: "center", fontSize: 20 }}>{it.emoji}</span>}
              <span className="tx">
                {it.title}
                {it.description && <small>{it.description}</small>}
              </span>
              <span className="ar">→</span>
            </a>
          ))}
        </div>
      );

    case "IconGridBlock":
      return (
        <div className="soc" style={{ justifyContent: "center" }}>
          {(props.items ?? []).map((it: any, i: number) => (
            <a key={i} href={it.url} target="_blank" rel="noreferrer">
              {it.icon} {it.label}
            </a>
          ))}
        </div>
      );

    case "SocialBlock":
      return (
        <div className="soc">
          {(props.items ?? []).map((it: any, i: number) => (
            <a key={i} href={it.url} target="_blank" rel="noreferrer">
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
          className="pbtn v-solid"
          style={{ ["--btn-bg" as any]: "#25d366", ["--btn-text" as any]: "#06381d", justifyContent: "center", textAlign: "center" }}
        >
          <span className="tx">{props.label || "Fale comigo no WhatsApp"}</span>
        </a>
      );

    case "CatalogBlock":
      if (mode === "public" && context) {
        return <PublicCatalogBlock siteId={context.siteId} title={props.title} phone={props.phone} items={props.items ?? []} />;
      }
      return (
        <div className="pcard">
          {props.title && <div className="ptitle">{props.title}</div>}
          {(props.items ?? []).map((it: any, i: number) => (
            <div key={i} className={`mn-it ${it.imageId ? "has-img" : ""}`}>
              {it.imageId && <div className="pimg" style={{ backgroundImage: `url(${it.imageId})` }} />}
              <div>
                <b>{it.name}</b>
                {it.description && <div className="ds">{it.description}</div>}
              </div>
              {money(it.priceCents) && <div className="pr">{money(it.priceCents)}</div>}
            </div>
          ))}
        </div>
      );

    case "ServiceBlock":
      return (
        <div className="pcard">
          {props.title && <div className="ptitle">{props.title}</div>}
          {(props.items ?? []).map((it: any, i: number) => (
            <div key={i} className="pprod">
              <div className="pimg" />
              <div>
                <b>{it.name}</b>
                <div className="phead">{it.durationMin} min</div>
              </div>
              {money(it.priceCents) && <span className="pr">{money(it.priceCents)}</span>}
            </div>
          ))}
        </div>
      );

    case "BookingBlock":
      if (mode === "public" && context) {
        return <PublicBookingBlock siteId={context.siteId} title={props.title} services={context.services ?? []} />;
      }
      return (
        <div className="pcard">
          <div className="ptitle">{props.title || "Agende seu horário"}</div>
          <p className="note">Agendamento disponível na página pública.</p>
        </div>
      );

    case "PixBlock": {
      const payload = props.key && props.receiver ? buildPixPayload({ key: props.key, receiver: props.receiver, city: props.city }) : null;
      return (
        <div className="pcard" style={{ textAlign: "center" }}>
          <div className="ptitle">{props.label || "Pagar com PIX"}</div>
          {payload && mode === "public" && <QrCanvas value={payload} size={160} />}
        </div>
      );
    }

    case "MapBlock":
      return (
        <div className="ph">📍 {props.address || "Endereço não informado"}</div>
      );

    case "GalleryBlock":
      return (
        <div className="gal">
          {(props.items ?? []).map((it: any, i: number) => (
            <div key={i} style={{ backgroundImage: `url(${it.url})` }} />
          ))}
        </div>
      );

    case "ImageBlocksBlock":
      return (
        <div className="gal">
          {(props.items ?? []).map((it: any, i: number) => (
            <div key={i} style={{ backgroundImage: `url(${it.url})` }} />
          ))}
        </div>
      );

    case "PhotoStripBlock":
      return (
        <div className="stories">
          {(props.items ?? []).map((it: any, i: number) => (
            <span key={i} className="sr" style={{ width: 120, height: 90, borderRadius: "var(--radius)", backgroundImage: `url(${it.url})` }} />
          ))}
        </div>
      );

    case "CardsBlock":
      return (
        <div className="bento" style={{ ["--cols" as any]: 1 }}>
          {(props.items ?? []).map((it: any, i: number) => (
            <a key={i} href={it.url || undefined} className="bc s-2x1" style={{ backgroundImage: it.image ? `url(${it.image})` : undefined }}>
              <h4>{it.title}</h4>
              {it.text && <p>{it.text}</p>}
            </a>
          ))}
        </div>
      );

    case "VideoBlock":
      return props.url ? (
        <div className="vid">
          <video src={props.url} controls />
        </div>
      ) : null;

    case "LeadFormBlock":
      if (mode === "public" && context) {
        return <PublicLeadForm siteId={context.siteId} props={props} />;
      }
      return (
        <div className="pcard">
          <div className="ptitle">{props.title || "Fale com a gente"}</div>
          <input className="pfield" placeholder="Nome" disabled />
          <input className="pfield" placeholder="Telefone" disabled />
          <button className="pblk" disabled>{props.button || "Enviar"}</button>
        </div>
      );

    case "WifiBlock":
      return (
        <div className="pcard" style={{ textAlign: "center" }}>
          <div className="ptitle">📶 {props.ssid || "Rede Wi-Fi"}</div>
          {mode === "public" && props.ssid && <QrCanvas value={wifiQrString(props.ssid, props.password ?? "", props.security ?? "WPA")} size={160} />}
        </div>
      );

    case "Tour360Block":
      return props.source ? (
        <div className="vid">
          <iframe src={props.source} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} />
        </div>
      ) : null;

    case "QRCodeBlock":
      if (mode === "public" && context?.appUrl) {
        return <QrCanvas value={`${context.appUrl}/`} fg={props.fg} bg={props.bg} />;
      }
      return <div className="qr" />;

    case "DividerBlock":
      return <div className="hr" />;

    case "CarouselBlock":
      return (
        <div className="stories">
          {(props.items ?? []).map((it: any, i: number) => (
            <span key={i} className="sr" style={{ width: 176, height: 112, borderRadius: "var(--radius)", backgroundImage: `url(${it.url})` }} />
          ))}
        </div>
      );

    case "TestimonialsBlock":
      return (
        <div className="pcard">
          {(props.items ?? []).map((it: any, i: number) => (
            <p key={i} style={{ marginBottom: 10 }}>
              <i>“{it.text}”</i>
              <br />
              <b>— {it.name}</b>
            </p>
          ))}
        </div>
      );

    case "FixedIconBarBlock":
      return (
        <div className="soc" style={{ justifyContent: "center", position: "sticky", bottom: 8 }}>
          {(props.items ?? []).map((it: any, i: number) => (
            <a key={i} href={it.url} target="_blank" rel="noreferrer">{it.icon}</a>
          ))}
        </div>
      );

    case "CustomHTMLBlock":
      return <div dangerouslySetInnerHTML={{ __html: props.html ?? "" }} />;

    default:
      return null;
  }
}
