import { z } from "zod";
import { DECK } from "./deck";

export const InputSchema = z
  .object({
    question: z.string().trim().min(3).max(500),
    cards: z
      .array(
        z
          .object({
            id: z.string().refine((id) => DECK.some((card) => card.id === id)),
            reversed: z.boolean(),
          })
          .strict(),
      )
      .length(3),
  })
  .strict()
  .refine((input) => new Set(input.cards.map((card) => card.id)).size === 3);

export const ReadingSchema = z
  .object({
    direct: z.string().min(1).max(3000),
    story: z.string().min(1).max(6000),
    next: z.string().min(1).max(2000),
    caution: z.string().min(1).max(2000),
    followups: z.array(z.string().min(1).max(500)).max(3),
  })
  .strict();
export type Reading = z.infer<typeof ReadingSchema>;
export type InterpretResult =
  { ok: true; reading: Reading } | { ok: false; error: string; retryable: boolean };
