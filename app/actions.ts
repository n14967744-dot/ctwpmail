"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { query } from "@/lib/db";
import { scanCount, sendAlert, sendTelegram, telegramPhoto, telegramText, type AlertPayload } from "@/lib/alert";
import { makeRef, readRef } from "@/lib/requestRef";
import { advanceStage, geo, insertEvent, parseUA, recordingId } from "@/lib/track";

/** `ref` is a signed reference to the saved request, used by the follow-up copier details step. */
export type RequestState = { ok: boolean; error?: string; ref?: string };

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

  const saved = await query<{ id: number | string }>(
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
  return { ok: true, ref: makeRef(Number(saved[0].id)) ?? undefined };
}

/** Dentist page form. */
export async function submitRequest(_prev: RequestState, form: FormData): Promise<RequestState> {
  return saveRequest(form, "dental");
}

/** Accounting and tax-preparation page form. */
export async function submitAccountingRequest(_prev: RequestState, form: FormData): Promise<RequestState> {
  return saveRequest(form, "accounting");
}

/* Optional copier details, added after the request is sent. Keys are merged into the request's answers. */
const DETAILS = [
  ["provider", "Provider"], ["equipment", "Current copier"], ["serial", "Serial number"],
  ["leaseEnd", "Lease ends"], ["spend", "Monthly spend"],
] as const;
const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
const PHOTO_MAX_BYTES = 3_500_000;
const PHOTOS_PER_REQUEST = 3;

/** Adds copier details and an optional photo to a request the visitor just sent. */
export async function addRequestDetails(_prev: RequestState, form: FormData): Promise<RequestState> {
  const fail = (error: string): RequestState => ({ ok: false, error });
  const id = readRef(clip(form.get("ref"), 80));
  if (!id) return fail("We couldn’t match this to your request. Please call us at (979) 779-2998.");

  const filled = DETAILS.map(([key, label]) => ({ key, label, value: clip(form.get(key), 160) })).filter((d) => d.value);
  const file = form.get("photo");
  const photo = file instanceof File && file.size > 0 ? file : null;
  if (!filled.length && !photo) return fail("Add a photo or fill in at least one line.");
  if (photo && (!PHOTO_TYPES.includes(photo.type) || photo.size > PHOTO_MAX_BYTES))
    return fail("That photo couldn’t be used. Please try a different one.");

  const details = { ...Object.fromEntries(filled.map((d) => [d.key, d.value])), ...(photo ? { photo: true } : {}) };
  const rows = await query<{ slug: string | null; business: string | null }>(
    `update landing_requests set answers = answers || $2::jsonb
      where id = $1 and created_at > now() - interval '1 day'
      returning slug, business`,
    [id, JSON.stringify(details)],
  );
  if (!rows?.length) return fail("Something went wrong. Please call us at (979) 779-2998.");

  let bytes: Uint8Array<ArrayBuffer> | null = null;
  if (photo) {
    bytes = new Uint8Array(await photo.arrayBuffer());
    const stored = await query(
      `insert into landing_request_photos (request_id, content_type, bytes)
       select $1, $2, decode($3, 'base64')
        where (select count(*) from landing_request_photos where request_id = $1) < $4
       returning id`,
      [id, photo.type, Buffer.from(bytes).toString("base64"), PHOTOS_PER_REQUEST],
    );
    if (!stored) return fail("Your details were saved, but the photo didn’t upload. Please try the photo again.");
  }

  const { slug, business } = rows[0];
  after(async () => {
    const lines = [
      `➕ Copier details: ${business ?? "(unknown business)"}${slug ? ` (${slug})` : ""}`,
      ...filled.map((d) => `${d.label}: ${d.value}`),
    ];
    if (bytes && photo) await telegramPhoto(bytes, photo.type, lines.join("\n"), "details-photo");
    else await telegramText(lines.join("\n"), "details");
  });
  return { ok: true };
}
