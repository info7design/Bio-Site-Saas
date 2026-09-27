export function whatsappUrl(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, "");
  const q = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${q}`;
}

/** Formato padrão reconhecido por Android/iOS para conectar em Wi-Fi via QR Code. */
export function wifiQrString(ssid: string, password: string, security: "WPA" | "WEP" | "nopass" = "WPA"): string {
  const esc = (v: string) => v.replace(/([\\;,:"])/g, "\\$1");
  return `WIFI:T:${security};S:${esc(ssid)};P:${esc(password)};;`;
}
