"use server";

import { rest } from "@/lib/supabase";

export type RequestState = { ok: boolean; error?: string };

const clip = (v: unknown, n = 200) => (typeof v === "string" ? v.trim().slice(0, n) : "");

export async function submitRequest(_prev: RequestState, form: FormData): Promise<RequestState> {
  const name = clip(form.get("name"), 120);
  const contact = clip(form.get("contact"), 160);
  const contactType = clip(form.get("contactType"), 10) === "email" ? "email" : "phone";
  const business = clip(form.get("business"), 160);
  const slug = clip(form.get("slug"), 120);

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
  return { ok: true };
}
