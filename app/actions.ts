"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { query } from "@/lib/db";
import { scanCount, sendAlert, sendTelegram, type AlertPayload } from "@/lib/alert";
import { advanceStage, geo, insertEvent, parseUA, recordingId } from "@/lib/track";

export type RequestState = { ok: boolean; error?: string };

const clip = (v: unknown, n = 200) => (typeof v === "string" ? v.trim().slice(0, n) : "");

/** Which extra questions each page's form asks, and the label used for each in the alert message. */
const FORMS = {
  dental: { phone: "(210) 284-3727", fields: [["pages", "Pages/mo"], ["color", "Color"], ["scanning", "Scanning"]] },
  accounting: { phone: "(979) 779-2998", fields: [["timing", "Timing"], ["equipment", "Current copier"], ["spend", "Monthly spend"]] },
} as const;

/** Saves the request, then (after the response) logs the event, advances the lead stage and sends the alerts. */
async function saveRequest(form: FormData, kind: keyof typeof FORMS): Promise<RequestState> {
  const cfg = FORMS[kind];
  const name = clip(form.get("name"), 120);
  const contact = clip(form.get("contact"), 160);
  const contactType = clip(form.get("contactType"), 10) === "email" ? "email" : "phone";
  const business = clip(form.get("business"), 160);
  const slug = clip(form.get("slug"), 120).toLowerCase().replace(/[^a-z0-9-]/g, "");
  const source = clip(form.get("source"), 10) === "qr" ? "qr" : "direct";
  const sessionId = clip(form.get("ph_session"), 64);

  if (!name) return { ok: false, error: "Please add your name." };
  if (contactType === "email" ? !/^\S+@\S+\.\S+$/.test(contact) : contact.replace(/\D/g, "").length < 10)
    return { ok: false, error: contactType === "email" ? "Please check your email address." : "Please add a 10-digit phone number." };

  const help = form.getAll("help").map((v) => clip(v, 80)).filter(Boolean).slice(0, 10);
  const extras = cfg.fields.map(([key, label]) => ({ key, label, value: clip(form.get(key), 120) || null }));
  const answers = { ...Object.fromEntries(extras.map((e) => [e.key, e.value])), help, contactType };

  const saved = await query(
    `insert into landing_requests (slug, business, answers, name, contact, source, lead_id)
     values ($1, $2, $3::jsonb, $4, $5, $6, (select id from leads where slug = $1))
     returning id`,
    [slug || null, business || null, JSON.stringify(answers), name, contact, source],
  );
  if (!saved?.length) return { ok: false, error: `Something went wrong. Please call us at ${cfg.phone}.` };

  const h = await headers();
  after(async () => {
    if (slug) {
      await Promise.all([
        insertEvent("form_submit", h, {
          slug, source, session_id: sessionId || null, referrer: null, screen: null,
          device: parseUA(h.get("user-agent") ?? ""), ...geo(h),
        }, { form_started: true, form_submitted: true }),
        advanceStage(slug, "requested_info"),
      ]);
    }
    const payload: AlertPayload = {
      event: "form_submit",
      business: business || null,
      slug: slug || null,
      source,
      scan_count: await scanCount(slug || null),
      time_iso: new Date().toISOString(),
      name,
      phone: contactType === "phone" ? contact : null,
      email: contactType === "email" ? contact : null,
      options: help,
      message: extras.filter((e) => e.value).map((e) => `${e.label}: ${e.value}`).join(" · ") || null,
    };
    await Promise.all([sendAlert(payload), sendTelegram(payload, recordingId(sessionId || null))]);
  });
  return { ok: true };
}

/** Dentist page form. */
export async function submitRequest(_prev: RequestState, form: FormData): Promise<RequestState> {
  return saveRequest(form, "dental");
}

/** Accounting and tax-preparation page form. */
export async function submitAccountingRequest(_prev: RequestState, form: FormData): Promise<RequestState> {
  return saveRequest(form, "accounting");
}
