import { NextRequest, NextResponse } from "next/server";
import { LAW_TEST_DATASET, getLawTestRecipient } from "@/lib/law-test";
import { rest } from "@/lib/supabase";

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const text = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";
const failure = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  let sameOrigin = false;
  try { const parsed = new URL(origin || ""); sameOrigin = ["https:", "http:"].includes(parsed.protocol) && parsed.host === request.headers.get("host"); } catch {}
  if (!sameOrigin) return failure("Please submit from your CTWP page.", 403);
  if (!request.headers.get("content-type")?.includes("application/json")) return failure("Send a JSON request.", 415);
  const raw = await request.text();
  if (raw.length > 12000) return failure("This request is too large.", 413);
  let body: Record<string, unknown>;
  try { body = JSON.parse(raw); } catch { return failure("The request could not be read."); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return failure("Invalid request.");
  const id = text(body.id, 36), runId = text(body.runId, 36);
  if (!uuid.test(id) || !uuid.test(runId)) return failure("Reload the page and try again.");
  if (body.event !== "visit" && body.event !== "form_submit") return failure("Invalid event.");
  let recipient;
  try { recipient = await getLawTestRecipient(body.slug); } catch { return failure("Your page is temporarily unavailable. Please try again.", 503); }
  if (!recipient) return failure("Your firm page could not be found.", 404);
  const payload: Record<string, unknown> = {};
  if (body.event === "form_submit") {
    if (!body.answers || typeof body.answers !== "object" || Array.isArray(body.answers)) return failure("Please add the form answers.");
    const input = body.answers as Record<string, unknown>;
    const answers = Object.fromEntries(["paper", "equipment", "model", "volume", "color", "cost", "agreement", "end", "name", "contact", "business"].map(key => [key, text(input[key], key === "contact" || key === "business" ? 160 : 120)]));
    if (!answers.business || !answers.name) return failure("Please add your firm name and your name.");
    if (body.contactType !== "email" && body.contactType !== "tel") return failure("Choose email or phone.");
    if (body.contactType === "email" ? !/^\S+@\S+\.\S+$/.test(answers.contact) : answers.contact.replace(/\D/g, "").length < 10) return failure("Please check the contact details.");
    payload.answers = answers;
    payload.priorities = Array.isArray(body.priorities) ? body.priorities.slice(0, 10).map(value => text(value, 120)) : [];
    payload.contact_type = body.contactType;
  }
  const result = await rest("law_preview_events?on_conflict=id", {
    signal: AbortSignal.timeout(15000),
    method: "POST", headers: { Prefer: "resolution=ignore-duplicates,return=minimal" },
    body: JSON.stringify({ id, run_id: runId, dataset: LAW_TEST_DATASET, recipient_id: recipient.id, slug: recipient.slug, business: recipient.name, source_record_id: recipient.sourceRecordId, source_dataset_id: recipient.sourceDatasetId, event_type: body.event, source: body.source === "qr" ? "qr" : "direct", is_test: true, payload }),
  });
  if (!result?.ok) {
    console.error("[law-test] save failed", result?.status ?? "not-configured");
    return failure("Your details were not saved. Please try again; your answers are still here.", 503);
  }
  return NextResponse.json({ ok: true, receipt: id, recipientId: recipient.id, isTest: true });
}
