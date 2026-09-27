"use client";

import { useMemo, useState } from "react";
import { whatsappUrl } from "@/lib/whatsapp";
import { trackEventAction, submitOrderAction } from "@/app/[slug]/actions";

type Item = { name: string; description?: string; priceCents?: number; imageId?: string; available?: boolean };
type CartLine = { name: string; priceCents: number; qty: number };

function money(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function PublicCatalogBlock({
  siteId,
  title,
  phone,
  items,
}: {
  siteId: string;
  title?: string;
  phone?: string;
  items: Item[];
}) {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [showCart, setShowCart] = useState(false);

  const lines: CartLine[] = useMemo(
    () =>
      Object.entries(cart)
        .filter(([, qty]) => qty > 0)
        .map(([name, qty]) => ({ name, qty, priceCents: items.find((i) => i.name === name)?.priceCents ?? 0 })),
    [cart, items]
  );
  const total = lines.reduce((sum, l) => sum + l.priceCents * l.qty, 0);
  const count = lines.reduce((sum, l) => sum + l.qty, 0);

  function addTo(name: string, delta: number) {
    setCart((prev) => ({ ...prev, [name]: Math.max(0, (prev[name] ?? 0) + delta) }));
  }

  async function checkout() {
    const itemsText = lines.map((l) => `• ${l.qty}x ${l.name} — ${money(l.priceCents * l.qty)}`).join("\n");
    const message = `Olá! Vim pelo seu cardápio e gostaria de pedir:\n\n${itemsText}\n\nTotal: ${money(total)}`;
    if (phone) window.open(whatsappUrl(phone, message), "_blank");
    await submitOrderAction(siteId, lines, total);
    await trackEventAction(siteId, "catalog_order");
    setCart({});
    setShowCart(false);
  }

  return (
    <div className="pcard" style={{ position: "relative" }}>
      {title && <div className="ptitle">{title}</div>}
      {items.map((it, i) => {
        const qty = cart[it.name] ?? 0;
        return (
          <div key={i} className={`mn-it ${it.imageId ? "has-img" : ""}`}>
            {it.imageId && <div className="pimg" style={{ backgroundImage: `url(${it.imageId})` }} />}
            <div>
              <b>{it.name}</b>
              {it.description && <div className="ds">{it.description}</div>}
              {it.priceCents != null && <div className="pr">{money(it.priceCents)}</div>}
            </div>
            <div className="mn-act">
              {it.available === false ? (
                <span className="note">Indisponível</span>
              ) : qty === 0 ? (
                <button type="button" className="mn-add" onClick={() => addTo(it.name, 1)}>+</button>
              ) : (
                <div className="mn-step">
                  <button type="button" onClick={() => addTo(it.name, -1)}>−</button>
                  <span>{qty}</span>
                  <button type="button" onClick={() => addTo(it.name, 1)}>+</button>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {count > 0 && !showCart && (
        <button type="button" className="mn-bar" onClick={() => setShowCart(true)}>
          <small>{count} {count === 1 ? "item" : "itens"}</small>
          <span>Ver pedido · {money(total)}</span>
        </button>
      )}

      {showCart && (
        <div className="mn-cart">
          <h5>Seu pedido</h5>
          {lines.map((l, i) => (
            <div key={i} className="ln">
              <span>{l.qty}x {l.name}</span>
              <span>{money(l.priceCents * l.qty)}</span>
            </div>
          ))}
          <div className="tot">
            <span>Total</span>
            <span>{money(total)}</span>
          </div>
          <a href="#" onClick={(e) => { e.preventDefault(); checkout(); }} className="send">
            Enviar pedido no WhatsApp
          </a>
          <p className="fine">Você confirma os itens e o valor direto com o estabelecimento.</p>
        </div>
      )}
    </div>
  );
}
