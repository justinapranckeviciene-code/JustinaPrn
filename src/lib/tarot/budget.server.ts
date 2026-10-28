// Shared budget primitives retained for the migration.
// Original GPT-6 Astra has no verified per-request cost bound yet.
// Paid AI must remain OFF; do not reuse the former mini-model calculation.
export const MONTHLY_LIMIT_CENTS = 1000;
export const RESERVATION_CENTS: number | null = null;

export const RESERVE_SCRIPT = `
local used = tonumber(redis.call('GET', KEYS[1]) or '0')
if used + tonumber(ARGV[1]) > tonumber(ARGV[2]) then return 0 end
local recent = tonumber(redis.call('GET', KEYS[2]) or '0')
if recent >= 12 then return -1 end
redis.call('INCRBY', KEYS[1], ARGV[1])
redis.call('EXPIRE', KEYS[1], 8640000)
redis.call('INCR', KEYS[2])
redis.call('EXPIRE', KEYS[2], 120)
return 1
`;

export function budgetKeys(now: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Vilnius",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(now);
  const year = parts.find((p) => p.type === "year")!.value;
  const month = parts.find((p) => p.type === "month")!.value;
  // One fixed namespace for ALL deployments; never reset on build/publish.
  return [
    `{mom-justina}:budget:${year}-${month}`,
    `{mom-justina}:minute:${Math.floor(now.getTime() / 60000)}`,
  ];
}

export async function reserveBudget(
  env: Record<string, string | undefined>,
  fetcher: typeof fetch = fetch,
  now = new Date(),
): Promise<"allowed" | "limit" | "rate" | "unavailable"> {
  if (RESERVATION_CENTS === null) return "unavailable";
  const url = env["UPSTASH_REDIS_REST_URL"];
  const token = env["UPSTASH_REDIS_REST_TOKEN"];
  if (!url || !token) return "unavailable";
  try {
    const endpoint = new URL(url);
    if (endpoint.protocol !== "https:" || endpoint.username || endpoint.password)
      return "unavailable";
    const response = await fetcher(endpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([
        "EVAL",
        RESERVE_SCRIPT,
        2,
        ...budgetKeys(now),
        RESERVATION_CENTS,
        MONTHLY_LIMIT_CENTS,
      ]),
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });
    if (!response.ok) return "unavailable";
    const result = (await response.json()) as { result?: unknown; error?: unknown };
    if (result.error) return "unavailable";
    if (result.result === 1) return "allowed";
    if (result.result === 0) return "limit";
    if (result.result === -1) return "rate";
    return "unavailable";
  } catch {
    return "unavailable";
  }
}
