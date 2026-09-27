"use server";

import { z } from "zod";
import crypto from "crypto";
import { cookies, headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { computeSlots } from "@/lib/availability";

async function visitorId() {
  const jar = await cookies();
  let id = jar.get("biosite_visitor")?.value;
  if (!id) {
    id = crypto.randomBytes(16).toString("hex");
    jar.set("biosite_visitor", id, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365 });
  }
  return id;
}

function device() {
  const ua = headers().get("user-agent") ?? "";
  return /mobile/i.test(ua) ? "mobile" : "desktop";
}

export async function trackEventAction(siteId: string, type: string, targetId?: string) {
  try {
    await prisma.analyticsEvent.create({
      data: { siteId, type, targetId, visitorId: await visitorId(), device: device() },
    });
  } catch {
    // não bloqueia a navegação do visitante por falha de analytics
  }
}

const leadSchema = z.object({
  name: z.string().trim().min(1, "Informe seu nome"),
  phone: z.string().trim().min(8, "Informe um telefone válido"),
  email: z.string().trim().email().optional().or(z.literal("")),
  message: z.string().trim().optional(),
  consent: z.string().optional(),
});

export type LeadFormState = { error?: string; success?: boolean };

export async function submitLeadAction(siteId: string, _prev: LeadFormState, formData: FormData): Promise<LeadFormState> {
  const parsed = leadSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email") ?? "",
    message: formData.get("message") ?? "",
    consent: formData.get("consent"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  if (parsed.data.consent !== "on") return { error: "É preciso aceitar o uso dos dados (LGPD)" };

  const { consent, ...data } = parsed.data;
  await prisma.lead.create({
    data: { siteId, data, consent: true, source: "site", device: device() },
  });
  await trackEventAction(siteId, "lead");
  return { success: true };
}

export async function getSlotsAction(siteId: string, serviceId: string, date: string) {
  const [service, weekly, exceptions, bookings] = await Promise.all([
    prisma.service.findUnique({ where: { id: serviceId } }),
    prisma.availability.findMany({ where: { siteId, weekday: { not: null } } }),
    prisma.availability.findMany({ where: { siteId, date: { not: null } } }),
    prisma.booking.findMany({ where: { siteId, serviceId, status: { not: "CANCELLED" } } }),
  ]);
  if (!service) return [];

  return computeSlots({
    date,
    durationMin: service.durationMin,
    rules: weekly.map((w) => ({ weekday: w.weekday!, start: w.startTime!, end: w.endTime!, breakMin: w.breakMin })),
    exceptions: exceptions.map((e) => ({
      date: e.date!.toISOString().slice(0, 10),
      blocked: e.blocked,
      start: e.startTime ?? undefined,
      end: e.endTime ?? undefined,
    })),
    busy: bookings.map((b) => ({ startsAt: b.startsAt, endsAt: b.endsAt })),
  });
}

const bookingSchema = z.object({
  serviceId: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  name: z.string().trim().min(1, "Informe seu nome"),
  phone: z.string().trim().min(8, "Informe um telefone válido"),
});

export type BookingFormState = { error?: string; success?: boolean };

export async function createBookingAction(siteId: string, _prev: BookingFormState, formData: FormData): Promise<BookingFormState> {
  const parsed = bookingSchema.safeParse({
    serviceId: formData.get("serviceId"),
    date: formData.get("date"),
    time: formData.get("time"),
    name: formData.get("name"),
    phone: formData.get("phone"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const service = await prisma.service.findUnique({ where: { id: parsed.data.serviceId } });
  if (!service) return { error: "Serviço não encontrado" };

  const startsAt = new Date(`${parsed.data.date}T${parsed.data.time}:00-03:00`);
  const endsAt = new Date(startsAt.getTime() + service.durationMin * 60000);

  await prisma.booking.create({
    data: { siteId, serviceId: service.id, startsAt, endsAt, name: parsed.data.name, phone: parsed.data.phone },
  });
  await trackEventAction(siteId, "booking");
  return { success: true };
}
