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
  }

  return (
    <div className="relative">
      {title && <h3 className="mb-2 font-semibold">{title}</h3>}
      <div className="flex flex-col gap-3">
        {items.map((it, i) => {
          const qty = cart[it.name] ?? 0;
          return (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-slate-100 p-2">
              {it.imageId && <img src={it.imageId} alt={it.name} className="h-14 w-14 rounded-lg object-cover" />}
              <div className="flex-1">
                <p className="text-sm font-semibold">{it.name}</p>
                {it.description && <p className="text-xs text-slate-500">{it.description}</p>}
                {it.priceCents != null && <p className="text-sm font-semibold text-slate-700">{money(it.priceCents)}</p>}
              </div>
              {it.available === false ? (
                <span className="text-xs text-slate-400">Indisponível</span>
              ) : (
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => addTo(it.name, -1)} className="touch-target h-8 w-8 rounded-full border border-slate-200 text-sm font-bold">−</button>
                  <span className="w-4 text-center text-sm">{qty}</span>
                  <button type="button" onClick={() => addTo(it.name, 1)} className="touch-target h-8 w-8 rounded-full border border-slate-200 text-sm font-bold">+</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {count > 0 && (
        <button
          type="button"
          onClick={checkout}
          className="touch-target sticky bottom-3 mt-3 flex w-full items-center justify-between rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg"
        >
          <span>{count} {count === 1 ? "item" : "itens"} · {money(total)}</span>
          <span>Pedir no WhatsApp →</span>
        </button>
      )}
    </div>
  );
}
