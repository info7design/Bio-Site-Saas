/**
 * Cálculo de horários disponíveis para agendamento.
 * Lógica pura (sem I/O) para ser testável e reutilizável no servidor.
 */

export type WeeklyRule = { weekday: number; start: string; end: string; breakMin: number };
export type Exception = { date: string; blocked: boolean; start?: string; end?: string }; // date: YYYY-MM-DD
export type Busy = { startsAt: Date; endsAt: Date };

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export function computeSlots(params: {
  date: string; // YYYY-MM-DD (dia local do negócio)
  durationMin: number;
  rules: WeeklyRule[];
  exceptions: Exception[];
  busy: Busy[];
  stepMin?: number;
  now?: Date;
  utcOffsetMin?: number; // ex.: -180 para America/Sao_Paulo
}): string[] {
  const { date, durationMin, rules, exceptions, busy } = params;
  const step = params.stepMin ?? 10;
  const offset = params.utcOffsetMin ?? -180;
  const now = params.now ?? new Date();

  const ex = exceptions.find((e) => e.date === date);
  if (ex?.blocked) return [];

  const [y, mo, d] = date.split("-").map(Number);
  const weekday = new Date(Date.UTC(y, mo - 1, d)).getUTCDay();
  const rule = rules.find((r) => r.weekday === weekday);
  const start = ex?.start ?? rule?.start;
  const end = ex?.end ?? rule?.end;
  if (!start || !end) return [];
  const gap = rule?.breakMin ?? 0;

  const dayStartUtc = Date.UTC(y, mo - 1, d) - offset * 60000;
  const slots: string[] = [];

  for (let t = toMin(start); t + durationMin <= toMin(end); t += step) {
    const s = dayStartUtc + t * 60000;
    const e = s + durationMin * 60000;
    if (s <= now.getTime()) continue;
    const clash = busy.some((b) => s < b.endsAt.getTime() + gap * 60000 && e + gap * 60000 > b.startsAt.getTime());
    if (!clash) {
      const hh = String(Math.floor(t / 60)).padStart(2, "0");
      const mm = String(t % 60).padStart(2, "0");
      slots.push(`${hh}:${mm}`);
    }
  }
  return slots;
}
