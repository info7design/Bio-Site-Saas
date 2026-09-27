/**
 * Gerador de "PIX Copia e Cola" (BR Code estático, padrão EMV do Banco Central).
 * O sistema apenas apresenta os dados; não intermedia o dinheiro.
 */

function tlv(id: string, value: string): string {
  return id + String(value.length).padStart(2, "0") + value;
}

export function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

const strip = (s: string, max: number) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9 ]/g, "").slice(0, max).toUpperCase();

export function buildPixPayload(opts: {
  key: string;
  receiver: string;
  city?: string;
  amount?: number; // em reais
  txid?: string;
}): string {
  const merchantAccount = tlv("00", "br.gov.bcb.pix") + tlv("01", opts.key);
  const parts = [
    tlv("00", "01"),
    tlv("26", merchantAccount),
    tlv("52", "0000"),
    tlv("53", "986"),
    opts.amount && opts.amount > 0 ? tlv("54", opts.amount.toFixed(2)) : "",
    tlv("58", "BR"),
    tlv("59", strip(opts.receiver, 25) || "RECEBEDOR"),
    tlv("60", strip(opts.city ?? "SAO PAULO", 15) || "SAO PAULO"),
    tlv("62", tlv("05", opts.txid ? strip(opts.txid, 25) || "***" : "***")),
  ].join("");
  const withCrcId = parts + "6304";
  return withCrcId + crc16(withCrcId);
}
