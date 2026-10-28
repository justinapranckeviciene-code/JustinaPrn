import { ReadingSchema, type InterpretResult } from "./contracts";
import { INSTRUCTIONS, jsonSchema } from "./prompt";

type OriginalInput = {
  question: string;
  cards: { name: string; position: string; reversed: boolean }[];
};

/** Direct-provider candidate. Not enabled in production until budget and live quality checks pass. */
export async function callDirectOpenAI(
  data: OriginalInput,
  env: Record<string, string | undefined>,
  fetcher: typeof fetch = fetch,
): Promise<InterpretResult> {
  const apiKey = env["OPENAI_API_KEY"];
  if (!apiKey) return { ok: false, error: "AI paslauga nesukonfigūruota.", retryable: false };

  const cardsText = data.cards
    .map((c, i) => `${i + 1}. ${c.position}: ${c.name} (${c.reversed ? "apversta" : "tiesi"})`)
    .join("\n");

  let res: Response;
  try {
    res = await fetcher("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: AbortSignal.timeout(70_000),
      body: JSON.stringify({
        model: "gpt-6-astra",
        stream: true,
        store: false,
        reasoning: { effort: "low" },
        instructions: INSTRUCTIONS,
        input: [
          {
            role: "user",
            content: `Klausimas: ${data.question}\n\nIštrauktos kortos:\n${cardsText}`,
          },
        ],
        text: {
          format: { type: "json_schema", name: "tarot_reading", strict: true, schema: jsonSchema },
        },
      }),
    });
  } catch {
    return { ok: false, error: "Nepavyko pasiekti AI paslaugos.", retryable: true };
  }

  if (!res.ok || !res.body) {
    const status = res.status;
    let msg = "";
    try {
      const j = (await res.json()) as { message?: string; error?: { message?: string } };
      msg = j.message ?? j.error?.message ?? "";
    } catch {
      /* ignore */
    }
    // Do not log provider messages: they can contain private request content.
    if (status === 429)
      return { ok: false, error: "Per daug užklausų. Pabandykite po minutės.", retryable: true };
    if (status === 402)
      return { ok: false, error: "AI paslaugos apmokėjimas nepasiekiamas.", retryable: false };
    if (status === 403) return { ok: false, error: "AI prieiga atmesta.", retryable: false };
    return { ok: false, error: "AI paslauga laikinai nepasiekiama.", retryable: status >= 500 };
  }

  // Consume SSE stream server-side.
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  let text = "";
  let refused = false;
  let completed = false;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let idx;
    while ((idx = buf.indexOf("\n\n")) !== -1) {
      const frame = buf.slice(0, idx);
      buf = buf.slice(idx + 2);
      for (const line of frame.split("\n")) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        let ev: { type?: string; delta?: string };
        try {
          ev = JSON.parse(payload) as { type?: string; delta?: string };
        } catch {
          continue; /* partial */
        }
        if (ev.type === "response.output_text.delta" && ev.delta) text += ev.delta;
        if (ev.type === "response.refusal.delta") refused = true;
        if (
          ev.type === "response.failed" ||
          ev.type === "response.incomplete" ||
          ev.type === "error"
        ) {
          await reader.cancel().catch(() => {});
          return { ok: false, error: "AI nepavyko sugeneruoti atsakymo.", retryable: true };
        }
        if (ev.type === "response.completed") completed = true;
      }
    }
    if (completed) {
      await reader.cancel().catch(() => {});
      break;
    }
  }
  if (!completed) return { ok: false, error: "AI atsakymas nutrūko.", retryable: true };
  if (refused) return { ok: false, error: "AI atsisakė atsakyti į šį klausimą.", retryable: false };
  try {
    return { ok: true, reading: ReadingSchema.parse(JSON.parse(text)) };
  } catch {
    return { ok: false, error: "AI grąžino netinkamą atsakymą.", retryable: true };
  }
}
