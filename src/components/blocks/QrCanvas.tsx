"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function QrCanvas({ value, fg = "#000000", bg = "#ffffff", size = 200 }: { value: string; fg?: string; bg?: string; size?: number }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!value) {
      setSrc(null);
      return;
    }
    QRCode.toDataURL(value, { width: size, margin: 1, color: { dark: fg, light: bg } })
      .then((url) => active && setSrc(url))
      .catch(() => active && setSrc(null));
    return () => {
      active = false;
    };
  }, [value, fg, bg, size]);

  if (!src) return <div className="mx-auto grid h-40 w-40 place-items-center rounded-xl border border-dashed border-slate-300 text-xs text-slate-400">QR Code</div>;
  return <img src={src} alt="QR Code" width={size} height={size} className="mx-auto rounded-xl" />;
}
