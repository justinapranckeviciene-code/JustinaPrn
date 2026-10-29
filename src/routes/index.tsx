import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { drawCards, cardImageRotation, type DrawnCard } from "@/lib/tarot/deck";
import { interpretReading, type Reading } from "@/lib/tarot/interpret.functions";

import { getPublicConfig } from "@/lib/public-config.functions";

export const Route = createFileRoute("/")({
  loader: () => getPublicConfig(),
  head: () => ({
    meta: [
      { title: "mom_justina – atsakymas į tavo klausimą" },
      {
        name: "description",
        content:
          "Užduok klausimą, ištrauk tris Rider–Waite–Smith Taro kortas ir gauk interpretaciją lietuviškai.",
      },
      { property: "og:title", content: "mom_justina – atsakymas į tavo klausimą" },
      {
        property: "og:description",
        content: "Nemokamas trijų kortų Taro ritualas su klasikinėmis Rider–Waite–Smith kortomis.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

/** Client-side time limit for one interpretation request. */
const AI_TIMEOUT_MS = 75_000;

type AiState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "done"; reading: Reading }
  | { status: "error"; message: string; retryable: boolean };

function Index() {
  const { coffeeUrl, aiReady } = Route.useLoaderData();
  const readingsCache = useRef(new Map<string, Reading>());
  const interpret = useServerFn(interpretReading);
  const [question, setQuestion] = useState("");
  const [cards, setCards] = useState<DrawnCard[] | null>(null);
  const [flipped, setFlipped] = useState<boolean[]>([]);
  const [ai, setAi] = useState<AiState>({ status: "idle" });
  const requestRef = useRef<AbortController | null>(null);

  const valid = question.trim().length >= 3;
  const allFlipped = cards !== null && flipped.every(Boolean);

  useEffect(() => () => requestRef.current?.abort(), []);

  function start() {
    if (!valid) return;
    const drawn = drawCards();
    setCards(drawn);
    setFlipped(drawn.map(() => false));
    setAi({ status: "idle" });
  }

  async function runInterpretation() {
    if (!cards || !aiReady || requestRef.current) return;
    const cacheKey = JSON.stringify([
      question.trim(),
      cards.map((c) => [c.id, c.position]),
    ]);
    const cached = readingsCache.current.get(cacheKey);
    if (cached) {
      setAi({ status: "done", reading: cached });
      return;
    }
    const ctrl = new AbortController();
    requestRef.current = ctrl;
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      ctrl.abort();
    }, AI_TIMEOUT_MS);
    setAi({ status: "loading" });
    try {
      const r = await interpret({
        data: {
          question,
          cards: cards.map((c) => ({ id: c.id })),
        },
        signal: ctrl.signal,
      });
      if (requestRef.current !== ctrl) return;
      if (r.ok) {
        if (readingsCache.current.size >= 50)
          readingsCache.current.delete(readingsCache.current.keys().next().value!);
        readingsCache.current.set(cacheKey, r.reading);
      }
      setAi(
        r.ok
          ? { status: "done", reading: r.reading }
          : { status: "error", message: r.error, retryable: r.retryable },
      );
    } catch {
      if (requestRef.current !== ctrl) return;
      setAi(
        timedOut
          ? { status: "error", message: "AI per ilgai neatsakė.", retryable: true }
          : { status: "error", message: "Nepavyko susisiekti su serveriu.", retryable: true },
      );
    } finally {
      clearTimeout(timer);
      if (requestRef.current === ctrl) requestRef.current = null;
    }
  }

  function reset() {
    requestRef.current?.abort();
    requestRef.current = null;
    setCards(null);
    setFlipped([]);
    setQuestion("");
    setAi({ status: "idle" });
  }

  return (
    <main className="bg-ritual min-h-screen px-4 pb-28 pt-10 sm:px-6">
      <div className="mx-auto max-w-xl">
        <header className="text-center">
          <p className="text-[11px] tracking-[0.3em] text-gold">✦ mom_justina ✦</p>
          <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
            Atsakymas į tavo klausimą
          </h1>
          <div className="ornament mx-auto mt-4 w-40" aria-hidden />
        </header>

        {!aiReady && (
          <p
            role="status"
            className="mt-6 rounded-lg border border-gold/30 bg-card/60 p-3 text-center text-sm text-muted-foreground"
          >
            Peržiūros versija. Kortas gali ištraukti ir apversti. AI interpretacijos dar ruošiamos.
          </p>
        )}

        {!cards ? (
          <section className="mt-10 space-y-4">
            <div className="mx-auto flex max-w-xs justify-center -space-x-8" aria-hidden>
              {[-10, 0, 10].map((r) => (
                <div
                  key={r}
                  style={{ transform: `rotate(${r}deg)` }}
                  className="card-back card-frame flex aspect-[11/19] w-20 items-center justify-center rounded-lg"
                >
                  <span className="font-display text-2xl text-gold">✦</span>
                </div>
              ))}
            </div>
            <label htmlFor="q" className="block pt-4 font-display text-2xl">
              Tavo klausimas
            </label>
            <Textarea
              id="q"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              maxLength={500}
              rows={4}
              placeholder="Pvz.: Ar verta šį rudenį keisti darbą?"
              className="bg-card/80 text-base"
            />
            <Button
              className="w-full glow tracking-wider"
              size="lg"
              disabled={!valid}
              onClick={start}
            >
              PRADĖTI NEMOKAMĄ RITUALĄ
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Trys kortos iš 78 kortų Rider–Waite–Smith kaladės.
            </p>
          </section>
        ) : (
          <section className="mt-8">
            <p className="text-center font-display text-xl italic text-muted-foreground">
              „{question}“
            </p>
            <div className="mt-6 grid grid-cols-3 gap-2.5 sm:gap-4">
              {cards.map((c, i) => (
                <TarotCardView
                  key={c.id}
                  card={c}
                  flipped={!!flipped[i]}
                  onFlip={() => setFlipped((f) => f.map((v, j) => (j === i ? true : v)))}
                />
              ))}
            </div>

            {!allFlipped && (
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Paliesk kortas, kad jas atverstum.
              </p>
            )}

            {allFlipped && ai.status === "idle" && (
              <Button
                className="mt-8 w-full glow tracking-wider"
                size="lg"
                onClick={runInterpretation}
                disabled={!aiReady}
              >
                {aiReady ? "GAUTI INTERPRETACIJĄ" : "AI INTERPRETACIJOS RUOŠIAMOS"}
              </Button>
            )}
            {ai.status === "loading" && (
              <div className="mt-8 text-center" role="status">
                <p className="text-sm text-gold animate-pulse">Skaitomos kortos…</p>
                <p className="mt-1 text-xs text-muted-foreground">Tai gali užtrukti iki minutės.</p>
              </div>
            )}
            {ai.status === "error" && (
              <div
                role="alert"
                className="mt-8 rounded-lg border border-destructive/60 bg-card p-4 text-sm"
              >
                <p className="font-medium text-destructive">Interpretacijos gauti nepavyko</p>
                <p className="mt-1 text-muted-foreground">{ai.message} Tavo kortos išsaugotos.</p>
                {ai.retryable && (
                  <Button variant="outline" className="mt-3 w-full" onClick={runInterpretation}>
                    Bandyti dar kartą
                  </Button>
                )}
              </div>
            )}
            {ai.status === "done" && <ReadingView reading={ai.reading} />}

            <Button
              className="mt-8 h-14 w-full border border-gold/50 text-base font-semibold uppercase tracking-wide shadow-lg shadow-black/20"
              onClick={reset}
            >
              Užduoti kitą klausimą
            </Button>
          </section>
        )}
        <footer className="mt-10 border-t border-border pt-6 text-center">
          {coffeeUrl ? (
            <a
              href={coffeeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-50 inline-flex min-h-11 max-w-[calc(100vw-2rem)] items-center justify-center rounded-full border border-gold/60 bg-card px-5 py-2 text-sm text-gold shadow-[0_4px_24px_rgba(0,0,0,0.35)] transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold sm:right-6"
            >
              ☕ Pavaišink mane kava
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="min-h-11 rounded-md border border-border px-5 py-2 text-sm text-muted-foreground"
            >
              ☕ Pavaišink mane kava
            </button>
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            Energetiniai mainai ✧ Tavo palaikymas padeda man kurti.
          </p>
        </footer>
      </div>
    </main>
  );
}

export function TarotCardView({
  card,
  flipped,
  onFlip,
}: {
  card: DrawnCard;
  flipped: boolean;
  onFlip: () => void;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  return (
    <div className="flex flex-col items-center text-center">
      <p className="mb-2 flex min-h-8 items-end justify-center text-[10px] uppercase leading-tight tracking-wider text-gold sm:text-[11px]">
        {card.position}
      </p>
      <button
        type="button"
        aria-label={flipped ? card.name : `Atversti kortą: ${card.position}`}
        onClick={onFlip}
        className="flip block aspect-[11/19] w-full"
      >
        <div className={`flip-inner h-full w-full ${flipped ? "is-flipped" : ""}`}>
          <div className="flip-face card-back card-frame flex items-center justify-center rounded-lg">
            <span className="font-display text-3xl text-gold">✦</span>
          </div>
          <div className="flip-face flip-front card-frame overflow-hidden rounded-lg bg-card">
            {imgFailed ? (
              <div
                className="flex h-full flex-col items-center justify-center p-2"
              >
                <span className="font-display text-base leading-tight">{card.name}</span>
              </div>
            ) : (
              <img
                src={card.image}
                alt={card.nameEn}
                loading="eager"
                onError={() => setImgFailed(true)}
                className="h-full w-full object-contain"
                style={{ transform: `rotate(${cardImageRotation()}deg)` }}
              />
            )}
          </div>
        </div>
      </button>
      <div
        className={`mt-2 min-h-12 transition-opacity duration-500 ${flipped ? "opacity-100" : "opacity-0"}`}
        aria-hidden={!flipped}
      >
        <p className="font-display text-sm leading-tight sm:text-base">{card.name}</p>
        {card.id === "major-12" && (
          <span className="sr-only">
            Pakaruoklis tiesus: žmogus kabo galva žemyn.
          </span>
        )}
        <p
          className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground"
        >
          Tiesi
        </p>
      </div>
    </div>
  );
}

function ReadingView({ reading }: { reading: Reading }) {
  const blocks: [string, string][] = [
    ["Atsakymas", reading.direct],
    ["Kortų istorija", reading.story],
    ["Kitas žingsnis", reading.next],
    ["Atsargiai", reading.caution],
  ];
  return (
    <article className="mt-8 space-y-5 rounded-xl border border-border bg-card/60 p-5">
      {blocks.map(([t, b]) => (
        <div key={t}>
          <h2 className="font-display text-xl text-gold">{t}</h2>
          <p className="mt-1 text-sm leading-relaxed">{b}</p>
        </div>
      ))}
      {reading.followups.length > 0 && (
        <div>
          <h2 className="font-display text-xl text-gold">Galima paklausti toliau</h2>
          <ul className="mt-1 list-disc pl-5 text-sm">
            {reading.followups.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        Taro – apmąstymų įrankis, ne garantuota prognozė.
      </p>
    </article>
  );
}
