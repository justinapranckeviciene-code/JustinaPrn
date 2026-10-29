// Runs in Vercel's build with the connected private store, never calls the AI.
import { randomUUID } from "node:crypto";
import { del } from "@vercel/blob";
import { blobLedger, mutateWallet } from "../src/lib/tarot/wallet.server.ts";
import { claim, settle, LIMIT_MICRO_EUR } from "../src/lib/tarot/wallet-core.ts";

if (!process.env["BLOB_READ_WRITE_TOKEN"]) throw new Error("Private budget store is not connected");
const path = `qa/wallet-${randomUUID()}.json`;
const store = blobLedger(path);
const now = new Date("2026-10-29T10:00:00Z");
const ids = [randomUUID(), randomUUID()];
const outcomes = await Promise.all(
  ids.map((id) => mutateWallet((wallet) => claim(wallet, id, 6_000_000, id, now), store)),
);
if (
  outcomes.filter((value) => value === "allowed").length !== 1 ||
  outcomes.filter((value) => value === "limit").length !== 1
)
  throw new Error("Concurrent spending gate failed");
const winner = ids[outcomes.indexOf("allowed")]!;
await mutateWallet((wallet) => settle(wallet, winner, 1_000_000, now), store);
const final = await store.read();
if (
  !final ||
  Object.keys(final.wallet.pending).length !== 0 ||
  final.wallet.spent["2026-10"] !== 1_000_000 ||
  final.wallet.spent["2026-10"] > LIMIT_MICRO_EUR
)
  throw new Error("Budget reconciliation failed");
// Exercise the >1 KiB threshold where delivery compression changes HTTP ETags.
await mutateWallet((wallet) => {
  wallet.events = Array.from({length: 40}, (_, i) => ({at: now.getTime(), client: `qa-large-ledger-${i}`}));
}, store);
await mutateWallet((wallet) => { wallet.spent["2026-10"]! += 1; }, store);
const large = await store.read();
if (!large || large.wallet.spent["2026-10"] !== 1_000_001 || JSON.stringify(large.wallet).length < 1024)
  throw new Error("Large-ledger conditional update failed");
await del(path, { ifMatch: large.etag });
console.log(
  "Private budget store verified: concurrent cap, reconciliation, large-ledger identity ETag, private cleanup. No AI calls.",
);
