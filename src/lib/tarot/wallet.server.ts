import { get, put, BlobPreconditionFailedError, BlobNotFoundError } from "@vercel/blob";
import { z } from "zod";
import { emptyWallet, type Wallet } from "./wallet-core.ts";

const money = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
const WalletSchema = z
  .object({
    version: z.literal(1),
    spent: z.record(money),
    pending: z.record(z.object({ reserve: money, started: money })),
    events: z.array(z.object({ at: money, client: z.string().max(128) })).max(1000),
    fault: z.boolean(),
  })
  .strict();
const WALLET_PATH = "tarot-budget/v1/wallet.json";

export interface LedgerStore {
  read(): Promise<{ wallet: Wallet; etag: string } | null>;
  write(wallet: Wallet, etag?: string): Promise<void>;
  isConflict(error: unknown): boolean;
}

export function blobLedger(path = WALLET_PATH): LedgerStore {
  if (path !== WALLET_PATH && !/^qa\/wallet-[a-zA-Z0-9-]+\.json$/.test(path))
    throw new Error("Invalid ledger path");
  return {
    async read() {
      try {
        const result = await get(path, {
          access: "private",
          useCache: false,
          abortSignal: AbortSignal.timeout(8000),
        });
        if (!result) return null;
        if (result.statusCode !== 200) throw new Error("Unexpected ledger response");
        if (result.blob.size > 512_000) throw new Error("Ledger is unexpectedly large");
        return {
          wallet: WalletSchema.parse(await new Response(result.stream).json()),
          etag: result.blob.etag,
        };
      } catch (error) {
        if (error instanceof BlobNotFoundError) return null;
        throw error;
      }
    },
    async write(wallet, etag) {
      await put(path, JSON.stringify(WalletSchema.parse(wallet)), {
        access: "private",
        addRandomSuffix: false,
        contentType: "application/json",
        ...(etag ? { ifMatch: etag } : { allowOverwrite: false }),
        abortSignal: AbortSignal.timeout(8000),
      });
    },
    isConflict: (error) =>
      error instanceof BlobPreconditionFailedError ||
      (error instanceof Error && /already exists/i.test(error.message)),
  };
}

// CAS writes are the spending gate: no paid request starts unless its hold was committed.
export async function mutateWallet<T>(
  update: (wallet: Wallet) => T,
  store: LedgerStore = blobLedger(),
): Promise<T> {
  for (let attempt = 0; attempt < 6; attempt++) {
    const snapshot = await store.read();
    const wallet = snapshot?.wallet ?? emptyWallet();
    const result = update(wallet);
    try {
      await store.write(wallet, snapshot?.etag);
      return result;
    } catch (error) {
      if (!store.isConflict(error) || attempt === 5) throw error;
      await new Promise((resolve) => setTimeout(resolve, 25 * (attempt + 1)));
    }
  }
  throw new Error("Ledger unavailable");
}
