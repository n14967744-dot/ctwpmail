import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/* A signed reference to a quote request, handed to the browser after it is saved,
   so the follow-up "copier details" step can only add to that visitor's own request. */

const key = () => process.env.CTWP_IP_SALT || process.env.DATABASE_URL || "";
const sign = (id: number) => createHmac("sha256", key()).update(`request:${id}`).digest("hex").slice(0, 32);

export function makeRef(id: number): string | null {
  return key() ? `${id}.${sign(id)}` : null;
}

export function readRef(ref: string): number | null {
  const m = /^(\d{1,15})\.([a-f0-9]{32})$/.exec(ref);
  if (!m || !key()) return null;
  const id = Number(m[1]);
  const want = Buffer.from(sign(id));
  const got = Buffer.from(m[2]);
  return want.length === got.length && timingSafeEqual(want, got) ? id : null;
}
