"use client";

import { useEffect, useState, useTransition } from "react";
import { useFormState } from "react-dom";
import { createBookingAction, getSlotsAction, type BookingFormState } from "@/app/[slug]/actions";

type Service = { id: string; name: string; durationMin: number };

const initialState: BookingFormState = {};

export default function PublicBookingBlock({ siteId, title, services }: { siteId: string; title?: string; services: Service[] }) {
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [slots, setSlots] = useState<string[]>([]);
  const [time, setTime] = useState("");
  const [, startTransition] = useTransition();

  const action = createBookingAction.bind(null, siteId);
  const [state, formAction] = useFormState(action, initialState);

  useEffect(() => {
    if (!serviceId || !date) return;
    startTransition(async () => {
      const result = await getSlotsAction(siteId, serviceId, date);
      setSlots(result);
      setTime("");
    });
  }, [serviceId, date, siteId]);

  if (services.length === 0) {
    return <div className="pcard note">Nenhum serviço disponível para agendamento.</div>;
  }

  if (state.success) {
    return <div className="pcard" style={{ textAlign: "center" }}>Agendamento confirmado! Você receberá a confirmação em breve.</div>;
  }

  return (
    <form action={formAction} className="pcard">
      <div className="ptitle">{title || "Agende seu horário"}</div>

      <select name="serviceId" value={serviceId} onChange={(e) => setServiceId(e.target.value)} className="pfield">
        {services.map((s) => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>

      <input type="date" name="date" value={date} onChange={(e) => setDate(e.target.value)} className="pfield" />

      <div className="slots">
        {slots.length === 0 && <span className="note">Nenhum horário livre nessa data.</span>}
        {slots.map((s) => (
          <button key={s} type="button" aria-pressed={time === s} onClick={() => setTime(s)}>{s}</button>
        ))}
      </div>
      <input type="hidden" name="time" value={time} />

      {time && (
        <>
          <input name="name" required placeholder="Seu nome" className="pfield" style={{ marginTop: 10 }} />
          <input name="phone" required placeholder="Telefone" className="pfield" />
        </>
      )}

      {state.error && <p style={{ color: "var(--bad, #d92d20)", fontSize: 13, marginBottom: 8 }}>{state.error}</p>}
      {time && <button type="submit" className="pblk">Confirmar agendamento</button>}
    </form>
  );
}
