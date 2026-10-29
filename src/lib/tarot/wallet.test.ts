import { describe, expect, it, vi } from "vitest";
import {
  claim,
  settle,
  emptyWallet,
  monthKey,
  chargeMicroEur,
  LIMIT_MICRO_EUR,
} from "./wallet-core";
import { mutateWallet, type LedgerStore } from "./wallet.server";
import { generateGuardedReading } from "./guarded.server";

const NOW = new Date("2026-10-29T10:00:00Z");
class Conflict extends Error {}
function memoryStore(): LedgerStore & { current: () => ReturnType<typeof emptyWallet> | null } {
  let state: ReturnType<typeof emptyWallet> | null = null;
  let revision = 0;
  return {
    async read() {
      return state ? { wallet: structuredClone(state), etag: String(revision) } : null;
    },
    async write(wallet, etag) {
      if ((state && etag !== String(revision)) || (!state && etag)) throw new Conflict();
      state = structuredClone(wallet);
      revision++;
    },
    isConflict: (error) => error instanceof Conflict,
    current: () => state,
  };
}

describe("shared conservative EUR 10 wallet", () => {
  it("reserves before work and refuses a request that could exceed the cap", () => {
    const wallet = emptyWallet();
    expect(claim(wallet, "one", 6_000_000, "a", NOW)).toBe("allowed");
    expect(claim(wallet, "two", 6_000_000, "b", NOW)).toBe("limit");
  });
  it("CAS prevents two independent server replicas from spending the same balance", async () => {
    const store = memoryStore();
    const results = await Promise.all(
      ["one", "two"].map((id) =>
        mutateWallet((wallet) => claim(wallet, id, 6_000_000, id, NOW), store),
      ),
    );
    expect(results.sort()).toEqual(["allowed", "limit"]);
    expect(
      Object.values(store.current()!.pending).reduce((sum, p) => sum + p.reserve, 0),
    ).toBeLessThanOrEqual(LIMIT_MICRO_EUR);
  });
  it("reconciles a completed request once, without double-refunding", () => {
    const wallet = emptyWallet();
    claim(wallet, "one", 2_000_000, "a", NOW);
    expect(settle(wallet, "one", 100_000, NOW)).toBe(true);
    expect(settle(wallet, "one", 100_000, NOW)).toBe(false);
    expect(wallet.spent[monthKey(NOW)]).toBe(100_000);
    expect(Object.keys(wallet.pending)).toHaveLength(0);
  });
  it("retains unknown or failed requests across month boundaries", () => {
    const wallet = emptyWallet();
    claim(wallet, "unknown", 6_000_000, "a", NOW);
    expect(claim(wallet, "next", 6_000_000, "b", new Date("2026-11-01T12:00:00Z"))).toBe("limit");
  });
  it("charges a cross-month completion conservatively to its completion month", () => {
    const wallet = emptyWallet();
    claim(wallet, "cross", 1_000_000, "a", NOW);
    expect(settle(wallet, "cross", 200_000, new Date("2026-11-01T12:00:00Z"))).toBe(true);
    expect(wallet.spent["2026-11"]).toBe(200_000);
  });
  it("stops on cost above the reserved bound", () => {
    const wallet = emptyWallet();
    claim(wallet, "one", 100, "a", NOW);
    expect(settle(wallet, "one", 101, NOW)).toBe(false);
    expect(wallet.fault).toBe(true);
    expect(wallet.pending["one"]?.reserve).toBe(100);
    expect(claim(wallet, "two", 100, "a", NOW)).toBe("unavailable");
  });
  it("limits each hashed visitor to three requests per five minutes", () => {
    const wallet = emptyWallet();
    for (let i = 0; i < 3; i++) expect(claim(wallet, String(i), 100, "same", NOW)).toBe("allowed");
    expect(claim(wallet, "four", 100, "same", NOW)).toBe("rate");
  });
  it("limits the global rate across different visitors", () => {
    const wallet = emptyWallet();
    for (let i = 0; i < 12; i++)
      expect(claim(wallet, String(i), 100, String(i), NOW)).toBe("allowed");
    expect(claim(wallet, "thirteen", 100, "new", NOW)).toBe("rate");
  });
  it("stops when the reviewed price schedule expires", () => {
    expect(claim(emptyWallet(), "one", 100, "a", new Date("2026-12-01"))).toBe("unavailable");
  });
  it("rejects malformed or negative token counts", () => {
    expect(() => chargeMicroEur(-1, 5)).toThrow();
    expect(() => chargeMicroEur(1.5, 5)).toThrow();
    expect(chargeMicroEur(1000, 1000)).toBe(135_000);
  });
  it("keeps the paid API blocked until real quality checks are approved", async () => {
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);
    const result = await generateGuardedReading({}, "test-client", {
      OPENAI_API_KEY: "test-only",
      BLOB_READ_WRITE_TOKEN: "test-only",
      AI_ENABLED: "true",
      AI_QUALITY_APPROVED: "false",
    });
    expect(result.ok).toBe(false);
    expect(fetcher).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
