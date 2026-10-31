import { describe, expect, it, vi } from "vitest";
import { callOriginalGateway, generateReading } from "./interpret.server";
import { budgetKeys, reserveBudget } from "./budget.server";
import { INSTRUCTIONS } from "../../../audit/before-upright/prompt";

const input = {
  question: "Ką galiu pakeisti darbe?",
  cards: [
    { id: "major-12", reversed: false },
    { id: "major-0", reversed: true },
    { id: "minor-3-14", reversed: false },
  ],
};
const originalInput = {
  question: input.question,
  cards: [
    { name: "Pakaruoklis (The Hanged Man)", position: "Dabartinė situacija", reversed: false },
    { name: "Kvailys (The Fool)", position: "Kliūtis", reversed: true },
    { name: "Pentaklių Karalius (King of Pentacles)", position: "Patarimas", reversed: false },
  ],
};
const reading = {
  direct: "Atsakymas.",
  story: "Trijų kortų istorija.",
  next: "Žingsnis.",
  caution: "Atsargiai.",
  followups: ["Ką keisti?"],
};
function stream(events: unknown[]) {
  return new Response(events.map((event) => `data: ${JSON.stringify(event)}\n\n`).join(""), {
    headers: { "Content-Type": "text/event-stream" },
  });
}

describe("original AI preserved", () => {
  it("keeps paid runtime blocked until original-model budget is verified", async () => {
    const fetcher = vi.fn();
    expect((await generateReading(input, { LOVABLE_API_KEY: "test-only" }, fetcher)).ok).toBe(
      false,
    );
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("does not reuse the cheaper-model cost allowance", async () => {
    const fetcher = vi.fn();
    expect(
      await reserveBudget(
        { UPSTASH_REDIS_REST_URL: "https://redis.example", UPSTASH_REDIS_REST_TOKEN: "test-only" },
        fetcher,
      ),
    ).toBe("unavailable");
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("retains exact original gateway, model, reasoning and output settings", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue(
        stream([
          { type: "response.output_text.delta", delta: JSON.stringify(reading) },
          { type: "response.completed" },
        ]),
      );
    expect(
      await callOriginalGateway(originalInput, { LOVABLE_API_KEY: "test-only" }, fetcher),
    ).toEqual({ ok: true, reading });
    expect(fetcher.mock.calls[0]![0]).toBe("https://ai.gateway.lovable.dev/v1/responses");
    const body = JSON.parse(fetcher.mock.calls[0]![1].body);
    expect(body.model).toBe("openai/gpt-6-astra");
    expect(body.reasoning).toEqual({ effort: "low" });
    expect(body.stream).toBe(true);
    expect(body.store).toBe(false);
    expect(body).not.toHaveProperty("max_output_tokens");
    expect(body.instructions).toBe(INSTRUCTIONS);
    expect(body.input[0].content).toContain(
      "1. Dabartinė situacija: Pakaruoklis (The Hanged Man) (tiesi)",
    );
    expect(body.input[0].content).toContain("2. Kliūtis: Kvailys (The Fool) (apversta)");
  });
  it("does not call gateway without its credential", async () => {
    const fetcher = vi.fn();
    expect((await callOriginalGateway(originalInput, {}, fetcher)).ok).toBe(false);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it.each(["response.failed", "response.incomplete", "error", "response.refusal.delta"])(
    "does not fabricate output for %s",
    async (type) => {
      const fetcher = vi.fn().mockResolvedValue(stream([{ type }]));
      expect(
        (await callOriginalGateway(originalInput, { LOVABLE_API_KEY: "test-only" }, fetcher)).ok,
      ).toBe(false);
    },
  );
  it("keeps Vilnius calendar month boundaries", () => {
    expect(budgetKeys(new Date("2026-10-31T21:59:59Z"))[0]).toContain("2026-10");
    expect(budgetKeys(new Date("2026-10-31T22:00:00Z"))[0]).toContain("2026-11");
  });
});
