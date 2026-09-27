"use client";

import { useEffect, useState, useTransition } from "react";
import { useFormState } from "react-dom";
import SubmitButton from "@/components/SubmitButton";
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
    return <p className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-sm text-slate-400">Nenhum serviço disponível para agendamento.</p>;
  }

  if (state.success) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center text-sm font-medium text-emerald-700">
        Agendamento confirmado! Você receberá a confirmação em breve.
      </div>
    );
  }

  return (
    <form action={formAction} className="rounded-2xl border border-slate-200 p-4">
      <h3 className="font-semibold">{title || "Agende seu horário"}</h3>

      <label className="mt-3 flex flex-col gap-1 text-sm font-medium text-slate-700">
        Serviço
        <select name="serviceId" value={serviceId} onChange={(e) => setServiceId(e.target.value)} className="touch-target rounded-xl border border-slate-200 px-3 py-2 text-sm">
          {services.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </label>

      <label className="mt-3 flex flex-col gap-1 text-sm font-medium text-slate-700">
        Data
        <input type="date" name="date" value={date} onChange={(e) => setDate(e.target.value)} className="touch-target rounded-xl border border-slate-200 px-3 py-2 text-sm" />
      </label>

      <p className="mt-3 text-sm font-medium text-slate-700">Horários livres</p>
      <div className="mt-1 flex flex-wrap gap-1.5">
        {slots.length === 0 && <span className="text-xs text-slate-400">Nenhum horário livre nessa data.</span>}
        {slots.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setTime(s)}
            className={`touch-target rounded-full border px-3 py-1.5 text-xs font-medium ${time === s ? "border-violet-600 bg-violet-600 text-white" : "border-slate-200 text-slate-600"}`}
          >
            {s}
          </button>
        ))}
      </div>
      <input type="hidden" name="time" value={time} />

      {time && (
        <div className="mt-3 flex flex-col gap-2">
          <input name="name" required placeholder="Seu nome" className="touch-target rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          <input name="phone" required placeholder="Telefone" className="touch-target rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        </div>
      )}

      {state.error && <p className="mt-2 text-xs font-medium text-red-600">{state.error}</p>}
      {time && <SubmitButton pendingLabel="Confirmando...">Confirmar agendamento</SubmitButton>}
    </form>
  );
}
