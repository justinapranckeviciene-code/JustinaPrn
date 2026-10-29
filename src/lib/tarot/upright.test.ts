import { describe, expect, it } from "vitest";
import { InputSchema } from "./contracts";
import { drawCards, SPREAD_POSITIONS, DECK } from "./deck";
describe("upright-only reading boundary", () => {
  const valid = { question: "Ar verta keisti darbą?", cards: DECK.slice(0,3).map(c=>({id:c.id})) };
  it("accepts three distinct card IDs and rejects orientation injection", () => {
    expect(InputSchema.safeParse(valid).success).toBe(true);
    for (const reversed of [true, false]) {
      expect(InputSchema.safeParse({...valid, cards:valid.cards.map(c=>({...c,reversed}))}).success).toBe(false);
    }
  });
  it("rejects duplicated or unknown cards", () => {
    expect(InputSchema.safeParse({...valid,cards:[valid.cards[0],valid.cards[0],valid.cards[1]]}).success).toBe(false);
    expect(InputSchema.safeParse({...valid,cards:[valid.cards[0],valid.cards[1],{id:"invented"}]}).success).toBe(false);
  });
  it("preserves shuffle, positions and unique selections across random draws", () => {
    for(let i=0;i<300;i++){
      const cards=drawCards();
      expect(cards.map(c=>c.position)).toEqual(SPREAD_POSITIONS);
      expect(new Set(cards.map(c=>c.id)).size).toBe(3);
      expect(cards.every(c=>!Object.hasOwn(c,"reversed"))).toBe(true);
    }
  });
});
