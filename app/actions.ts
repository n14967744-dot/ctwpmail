"use server";

import { after } from "next/server";
import { rest } from "@/lib/supabase";
import { scanCount, sendAlert } from "@/lib/alert";

export type RequestState = { ok: boolean; error?: string };

const clip = (v: unknown, n = 200) => (typeof v === "string" ? v.trim().slice(0, n) : "");

export async function submitRequest(_prev: RequestState, form: FormData): Promise<RequestState> {
  const name = clip(form.get("name"), 120);
  const contact = clip(form.get("contact"), 160);
  const contactType = clip(form.get("contactType"), 10) === "email" ? "email" : "phone";
  const business = clip(form.get("business"), 160);
  const slug = clip(form.get("slug"), 120);
  const source = clip(form.get("source"), 10) === "qr" ? "qr" : "direct";

  if (!name) return { ok: false, error: "Please add your name." };
  if (contactType === "email" ? !/^\S+@\S+\.\S+$/.test(contact) : contact.replace(/\D/g, "").length < 10)
    return { ok: false, error: contactType === "email" ? "Please check your email address." : "Please add a 10-digit phone number." };

  const answers = {
    pages: clip(form.get("pages"), 40) || null,
    color: clip(form.get("color"), 40) || null,
    scanning: clip(form.get("scanning"), 40) || null,
    help: form.getAll("help").map((v) => clip(v, 80)).filter(Boolean).slice(0, 10),
    contactType,
  };

  const res = await rest("landing_requests", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ slug: slug || null, business: business || null, answers, name, contact }),
  });
  if (!res || !res.ok) return { ok: false, error: `Something went wrong. Please call us at (210) 284-3727.` };
  const options = answers.help;
  after(async () => {
    await sendAlert({
      event: "form_submit",
      business: business || null,
      slug: slug || null,
      source,
      scan_count: await scanCount(slug || null),
      time_iso: new Date().toISOString(),
      name,
      phone: contactType === "phone" ? contact : null,
      email: contactType === "email" ? contact : null,
      options,
      message: [answers.pages && `Pages/mo: ${answers.pages}`, answers.color && `Color: ${answers.color}`, answers.scanning && `Scanning: ${answers.scanning}`]
        .filter(Boolean).join(" · ") || null,
    });
  });
  return { ok: true };
}
