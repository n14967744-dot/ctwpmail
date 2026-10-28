export type LawTestRecipient = {
  id: string; slug: string; name: string; practice: string; address: string; city: string;
  state: string; zip: string; sourceUrl: string; checkedDate: string;
};

export function lawTestAddress(record: LawTestRecipient) {
  return [record.address, `${record.city}, ${record.state} ${record.zip}`].filter(Boolean).join(", ");
}
