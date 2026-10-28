import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { DECK, drawCards, cardImageRotation } from "./deck";

describe("tarot deck", () => {
  it("keeps the Hanged Man printed card upright unless the draw is reversed", () => {
    expect(DECK.find((c) => c.id === "major-12")?.name).toBe("Pakaruoklis");
    expect(cardImageRotation({ reversed: false })).toBe(0);
    expect(cardImageRotation({ reversed: true })).toBe(180);
  });
  it("has 78 unique cards", () => {
    expect(DECK).toHaveLength(78);
    expect(new Set(DECK.map((c) => c.id)).size).toBe(78);
  });
  it("has 22 major and 56 minor arcana", () => {
    expect(DECK.filter((c) => c.arcana === "major")).toHaveLength(22);
    expect(DECK.filter((c) => c.arcana === "minor")).toHaveLength(56);
  });
  it("every card has a bundled local image file", () => {
    for (const c of DECK) {
      expect(c.image.startsWith("/cards/")).toBe(true);
      expect(existsSync(resolve(__dirname, "../../../public", c.image.slice(1)))).toBe(true);
    }
  });
  it("never repeats a card within a draw", () => {
    for (let i = 0; i < 200; i++) {
      const cards = drawCards();
      expect(new Set(cards.map((c) => c.id)).size).toBe(cards.length);
    }
  });
  it("assigns every position and an orientation", () => {
    const cards = drawCards(["A", "B", "C"]);
    expect(cards.map((c) => c.position)).toEqual(["A", "B", "C"]);
    cards.forEach((c) => expect(typeof c.reversed).toBe("boolean"));
  });
});
