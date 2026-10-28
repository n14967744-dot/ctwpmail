import "server-only";
import { rest } from "./supabase";
import type { LawTestRecipient } from "./law-test-types";

export const LAW_TEST_DATASET = "law-map-form-10-v1";
type StoredRecipient = {
  id: string; slug: string; name: string; practice: string; address: string; city: string;
  state: string; zip: string; source_url: string; checked_date: string;
  source_record_id: string; source_dataset_id: string;
};
export type LawTestSourceRecipient = LawTestRecipient & { sourceRecordId: string; sourceDatasetId: string };
const decode = (row: StoredRecipient): LawTestSourceRecipient => ({
  id: row.id, slug: row.slug, name: row.name, practice: row.practice, address: row.address,
  city: row.city, state: row.state, zip: row.zip, sourceUrl: row.source_url,
  checkedDate: row.checked_date, sourceRecordId: row.source_record_id, sourceDatasetId: row.source_dataset_id,
});

export function publicLawTestRecipient({ sourceRecordId: _record, sourceDatasetId: _dataset, ...recipient }: LawTestSourceRecipient): LawTestRecipient {
  return recipient;
}

export async function getLawTestRecipients(): Promise<LawTestRecipient[]> {
  const result = await rest(`law_preview_recipients?dataset=eq.${LAW_TEST_DATASET}&select=*&order=id.asc`, { signal: AbortSignal.timeout(15000) });
  if (!result?.ok) throw new Error("The test records are temporarily unavailable.");
  const rows: StoredRecipient[] = await result.json();
  if (rows.length !== 10) throw new Error("The ten-firm test group is not ready.");
  return rows.map(decode).map(publicLawTestRecipient);
}

export async function getLawTestRecipient(slug: unknown): Promise<LawTestSourceRecipient | undefined> {
  if (typeof slug !== "string" || !/^[a-z0-9-]{1,180}$/.test(slug)) return;
  const result = await rest(`law_preview_recipients?dataset=eq.${LAW_TEST_DATASET}&slug=eq.${encodeURIComponent(slug)}&select=*&limit=1`, { signal: AbortSignal.timeout(15000) });
  if (!result?.ok) throw new Error("The test records are temporarily unavailable.");
  const rows: StoredRecipient[] = await result.json();
  return rows[0] ? decode(rows[0]) : undefined;
}
