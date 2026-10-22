import "server-only";

function env() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ""), key };
}

function headers(key: string, extra: Record<string, string> = {}) {
  return { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...extra };
}

export async function rest(path: string, init: RequestInit = {}): Promise<Response | null> {
  const e = env();
  if (!e) return null;
  try {
    return await fetch(`${e.url}/rest/v1/${path}`, {
      ...init,
      cache: "no-store",
      headers: headers(e.key, (init.headers as Record<string, string>) ?? {}),
    });
  } catch {
    return null;
  }
}
