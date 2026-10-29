import { createHmac, randomUUID } from "node:crypto";
import { DECK, SPREAD_POSITIONS } from "./deck";
import { InputSchema, type InterpretResult } from "./contracts";
import { INSTRUCTIONS, jsonSchema } from "./prompt";
import { callDirectOpenAI } from "./openai.server";
import { mutateWallet } from "./wallet.server";
import {
  claim,
  settle,
  chargeMicroEur,
  inputTokenBound,
  OUTPUT_TOKEN_CEILING,
  PRICE_REVIEW_UNTIL,
} from "./wallet-core";

export function aiReady(env = process.env): boolean {
  return (
    env["AI_ENABLED"] === "true" &&
    env["AI_QUALITY_APPROVED"] === "true" &&
    Boolean((env["OPENAI_API_KEY"] || env["taro"]) && env["BLOB_READ_WRITE_TOKEN"]) &&
    Date.now() < Date.parse(PRICE_REVIEW_UNTIL)
  );
}
export async function generateGuardedReading(
  input: unknown,
  clientAddress: string,
  env = process.env,
): Promise<InterpretResult> {
  const fail = (error: string, retryable = false): InterpretResult => ({
    ok: false,
    error,
    retryable,
  });
  if (!aiReady(env)) return fail("AI interpretacijos dar ruošiamos.");
  const parsed = InputSchema.safeParse(input);
  if (!parsed.success || !clientAddress) return fail("Patikrink klausimą ir kortas.");
  const data = {
    question: parsed.data.question,
    cards: parsed.data.cards.map((draw, i) => {
      const card = DECK.find((card) => card.id === draw.id)!;
      return {
        name: `${card.name} (${card.nameEn})`,
        position: SPREAD_POSITIONS[i]!,
        reversed: draw.reversed,
      };
    }),
  };
  const id = randomUUID();
  const client = createHmac("sha256", env["BLOB_READ_WRITE_TOKEN"]!)
    .update(clientAddress)
    .digest("hex");
  // Bound includes prompt, schema, names, positions, orientation and protocol framing.
  const bound = inputTokenBound({ data, INSTRUCTIONS, jsonSchema });
  const reserve = chargeMicroEur(bound, OUTPUT_TOKEN_CEILING);
  let status;
  try {
    status = await mutateWallet((wallet) => claim(wallet, id, reserve, client));
  } catch {
    return fail("Išlaidų apskaita laikinai nepasiekiama. Bandyk vėliau.", true);
  }
  if (status === "limit")
    return fail(
      "Šio mėnesio AI biudžetas išnaudotas arba likutis per mažas saugiai užklausai. Kortas gali traukti toliau.",
    );
  if (status === "rate") return fail("Padaryk kelių minučių pertrauką ir bandyk dar kartą.", true);
  if (status !== "allowed") return fail("AI šiuo metu nepasiekiamas.");
  let accounted = false;
  try {
    const result = await callDirectOpenAI(data, env, fetch, {
      maxOutputTokens: OUTPUT_TOKEN_CEILING,
      async onUsage(usage) {
        if (usage.input_tokens > bound || usage.output_tokens > OUTPUT_TOKEN_CEILING) return;
        accounted = await mutateWallet((wallet) =>
          settle(wallet, id, chargeMicroEur(usage.input_tokens, usage.output_tokens)),
        );
      },
    });
    // Unknown/failed requests keep their entire reservation; never refund on a timeout.
    if (result.ok && !accounted)
      return fail("Atsakymo apskaitos patvirtinti nepavyko. Bandyk vėliau.");
    return result;
  } catch {
    return fail("AI atsakymas nutrūko. Bandyk vėliau.", true);
  }
}
