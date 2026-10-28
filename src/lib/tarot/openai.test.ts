import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { CASES } from "../../../audit/questions";
import { callOriginalGateway } from "./interpret.server";
import { callDirectOpenAI } from "./openai.server";
import { INSTRUCTIONS } from "./prompt";

const reading = {
  direct: "Testas",
  story: "Testas",
  next: "Testas",
  caution: "Testas",
  followups: [],
};
function response(complete = true) {
  return new Response(
    `data: ${JSON.stringify({ type: "response.output_text.delta", delta: JSON.stringify(reading) })}\n\n${complete ? 'data: {"type":"response.completed"}\n\n' : ""}`,
  );
}

describe("direct provider migration contract (mocked, not a quality comparison)", () => {
  it("retains original prompt byte for byte", () => {
    const original = readFileSync(
      resolve(__dirname, "../../../audit/original-interpret.functions.ts.txt"),
      "utf8",
    );
    expect(original.match(/const INSTRUCTIONS = `([\s\S]*?)`;/)?.[1]).toBe(INSTRUCTIONS);
  });
  it("fixtures cover 30 questions, five categories and all 78 cards", () => {
    expect(CASES).toHaveLength(30);
    expect(new Set(CASES.map((c) => c.category)).size).toBe(5);
    expect(new Set(CASES.flatMap((c) => c.cards.map((card) => card.id))).size).toBe(78);
  });
  it.each(CASES)("$id preserves the complete model request", async (entry) => {
    const originalFetch = vi.fn().mockImplementation(async () => response());
    const directFetch = vi.fn().mockImplementation(async () => response());
    await callOriginalGateway(entry, { LOVABLE_API_KEY: "test-only" }, originalFetch);
    await callDirectOpenAI(entry, { OPENAI_API_KEY: "test-only" }, directFetch);
    const original = JSON.parse(originalFetch.mock.calls[0]![1].body);
    const direct = JSON.parse(directFetch.mock.calls[0]![1].body);
    expect(direct).toEqual({ ...original, model: "gpt-6-astra" });
    expect(directFetch.mock.calls[0]![0]).toBe("https://api.openai.com/v1/responses");
    expect(directFetch.mock.calls[0]![1].headers).not.toHaveProperty("Lovable-API-Key");
  });
  it("rejects interrupted output even when the partial JSON is valid", async () => {
    const fetcher = vi.fn().mockResolvedValue(response(false));
    expect((await callDirectOpenAI(CASES[0]!, { OPENAI_API_KEY: "test-only" }, fetcher)).ok).toBe(
      false,
    );
  });
  it("never calls paid API without a configured key", async () => {
    const fetcher = vi.fn();
    expect((await callDirectOpenAI(CASES[0]!, {}, fetcher)).ok).toBe(false);
    expect(fetcher).not.toHaveBeenCalled();
  });
});
