export const LIMIT_MICRO_EUR = 10_000_000;
// Includes a deliberately conservative allowance for currency conversion and tax.
export const EUR_PER_USD_CEILING = 1.5;
export const OUTPUT_TOKEN_CEILING = 16_384;
// Also covers input-cache write premiums; actual standard input is cheaper.
export const INPUT_USD_PER_MILLION_CEILING = 40;
export const OUTPUT_USD_PER_MILLION = 50;
export const PRICE_REVIEW_UNTIL = "2026-11-29T00:00:00Z";

export type Wallet = {
  version: 1;
  spent: Record<string, number>;
  pending: Record<string, { reserve: number; started: number }>;
  events: { at: number; client: string }[];
  fault: boolean;
};
export const emptyWallet = (): Wallet => ({
  version: 1,
  spent: {},
  pending: {},
  events: [],
  fault: false,
});

export function monthKey(now: Date): string {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Europe/Vilnius",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(now);
  return `${parts.find((p) => p.type === "year")!.value}-${parts.find((p) => p.type === "month")!.value}`;
}
export function chargeMicroEur(input: number, output: number): number {
  if (![input, output].every((n) => Number.isSafeInteger(n) && n >= 0))
    throw new Error("Invalid usage");
  return Math.ceil(
    (input * INPUT_USD_PER_MILLION_CEILING + output * OUTPUT_USD_PER_MILLION) * EUR_PER_USD_CEILING,
  );
}
export function inputTokenBound(body: unknown): number {
  // A UTF-8 byte bound plus room for protocol framing, rather than an average token estimate.
  const bytes = new TextEncoder().encode(JSON.stringify(body)).length + 2048;
  if (bytes > 16_384) throw new Error("Input exceeds the reviewed billing bound");
  return bytes;
}
export function claim(
  wallet: Wallet,
  id: string,
  reserve: number,
  client: string,
  now = new Date(),
): "allowed" | "limit" | "rate" | "unavailable" {
  if (wallet.fault || now.getTime() >= Date.parse(PRICE_REVIEW_UNTIL)) return "unavailable";
  if (!Number.isSafeInteger(reserve) || reserve <= 0 || reserve > LIMIT_MICRO_EUR)
    return "unavailable";
  if (wallet.pending[id]) return "unavailable";
  const held = Object.values(wallet.pending).reduce((sum, p) => sum + p.reserve, 0);
  if ((wallet.spent[monthKey(now)] ?? 0) + held + reserve > LIMIT_MICRO_EUR) return "limit";
  const time = now.getTime();
  wallet.events = wallet.events.filter((e) => e.at > time - 300_000);
  if (
    wallet.events.filter((e) => e.at > time - 60_000).length >= 12 ||
    wallet.events.filter((e) => e.client === client).length >= 3
  )
    return "rate";
  wallet.pending[id] = { reserve, started: time };
  wallet.events.push({ at: time, client });
  return "allowed";
}
export function settle(wallet: Wallet, id: string, charge: number, now = new Date()): boolean {
  const pending = wallet.pending[id];
  if (!pending || !Number.isSafeInteger(charge) || charge < 0) return false;
  if (charge > pending.reserve) {
    wallet.fault = true;
    return false;
  }
  // All unresolved requests, including last month's, remain reserved across month boundaries.
  const month = monthKey(now);
  wallet.spent[month] = (wallet.spent[month] ?? 0) + charge;
  delete wallet.pending[id];
  return true;
}
