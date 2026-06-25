import process from "node:process";

// Talks to Cloudflare D1 over its HTTP query API. This avoids relying on a
// native Worker binding (which varies by Nitro version); it only needs three
// env vars, which resolve reliably at request time on Cloudflare Workers.
//
// Required env (set as Pages secrets):
//   CF_ACCOUNT_ID     – Cloudflare account id
//   CF_D1_DATABASE_ID – the D1 database id
//   CF_D1_API_TOKEN   – API token with "D1 Edit" permission
//
// Read env INSIDE the function — module-scope reads are undefined on Workers.

interface D1Result<T> {
  result: { results: T[]; success: boolean }[];
  success: boolean;
  errors: { code: number; message: string }[];
}

export function d1Configured() {
  return Boolean(
    process.env.CF_ACCOUNT_ID &&
      process.env.CF_D1_DATABASE_ID &&
      process.env.CF_D1_API_TOKEN,
  );
}

export async function d1Query<T = Record<string, unknown>>(
  sql: string,
  params: (string | number)[] = [],
): Promise<T[]> {
  const accountId = process.env.CF_ACCOUNT_ID;
  const dbId = process.env.CF_D1_DATABASE_ID;
  const token = process.env.CF_D1_API_TOKEN;
  if (!accountId || !dbId || !token) {
    throw new Error("D1 is not configured");
  }

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${dbId}/query`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ sql, params }),
    },
  );

  if (!res.ok) {
    throw new Error(`D1 HTTP ${res.status}`);
  }

  const json = (await res.json()) as D1Result<T>;
  if (!json.success) {
    throw new Error(json.errors?.[0]?.message ?? "D1 query failed");
  }
  return json.result[0]?.results ?? [];
}
