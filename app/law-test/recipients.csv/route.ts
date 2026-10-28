import { getLawTestRecipients } from "@/lib/law-test";
import { NextRequest } from "next/server";

const cell = (value: string) => `"${value.replaceAll('"', '""')}"`;
export async function GET(request: NextRequest) {
  let lawTestRecipients;
  try { lawTestRecipients = await getLawTestRecipients(); } catch { return new Response("Test records temporarily unavailable. Please try again.", { status: 503 }); }
  const base = request.nextUrl.origin;
  const header = ["source_id", "firm", "practice", "street", "city", "state", "zip", "page_url", "qr_test_url", "source_url", "source_checked_date", "mode"];
  const rows = lawTestRecipients.map(r => [r.id, r.name, r.practice, r.address, r.city, r.state, r.zip, `${base}/law-test/${r.slug}`, `${base}/law-test/${r.slug}?src=qr&utm_campaign=law-test-10`, r.sourceUrl, r.checkedDate, "TEST ONLY"]);
  return new Response("\uFEFF" + [header, ...rows].map(row => row.map(cell).join(",")).join("\r\n") + "\r\n", { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="CTWP_Law_Test_10.csv"', "Cache-Control": "no-store" } });
}
