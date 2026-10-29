# mom_justina — Taro

## Atidaryti svetainės peržiūrą

**[ATIDARYTI mom_justina TARO](https://mom-justina-taro-dutjxws2a-justina-prn.vercel.app)**

Peržiūra paruošta Vercel 2026-10-29, deployment `dpl_jJMbBwkRpcX73STcfnohqWEc26DK`, source commit `903655e4de8246f1c4bec478487e8d1d6f420d46`. Vercel Authentication išsaugota: gali reikėti prisijungti prie savininkės Vercel paskyros. Tai kortų ir dizaino peržiūra. AI interpretacijos išjungtos, kol nėra saugiai prijungto rakto ir patikrinto biudžeto. Pilno paleidimo bei 30 gyvų AI palyginimų dar nėra. Automatinis HTTP turinio patikrinimas per Vercel jungtį buvo sustabdytas prisijungimo apsaugos, todėl naršyklės patikra dar nebaigta.

Migration of Taro Mom Justina from Lovable to a standalone TanStack Start / React application for Vercel. Original source snapshot: `cb0bdb65fdf6580f71c69d85eeb29a28ca195ff2`, Lovable project `6f00f10c-5584-4844-b226-2acf49264353`.

## Status

Update 2026-10-28: the owner approved using her existing OpenAI key named `Taro` directly with the SAME GPT-6 Astra model. `src/lib/tarot/openai.server.ts` is the direct-provider candidate, retaining the original request body except for the provider-specific model prefix. It is deliberately not wired into the visitor runtime: the key is not available to this checkout, the budget remains unverified and live quality comparisons have not run. See `audit/MIGRATION-REPORT.md`. The original gateway adapter is retained as the comparison baseline.

**Not deployed. GitHub write access was restored after the owner installed ChatGPT Codex Connector for this repository. The prepared source has been uploaded. Do not enable automatic publishing until the outstanding live checks pass.**

- Original burgundy/gold design and all 78 original local RWS images retained.
- Header and page metadata use `mom_justina`.
- Card rotations explicitly follow the draw. The printed Hanged Man card is upright when the figure hangs head-down; a reversed draw rotates the entire printed card 180 degrees. The original image is already in the correct printed orientation, so it was not destructively rotated.
- Images use `object-contain` to preserve their full printed borders.
- AI retains the ORIGINAL `openai/gpt-6-astra` model through the ORIGINAL Lovable gateway, with reasoning effort `low`, streaming, the original prompt and JSON schema. The cheaper-model substitution was removed at the owner’s request. No browser API key and no fallback readings.
- A voluntary coffee link is ready, but remains disabled until the owner supplies her real payment-page URL.
- `vercel.json` explicitly disables Git automatic deployment for the initial migration.

## Run and check

Node 24 is used for the verified Vercel build (Node >=22.12 supported by the package manifest).

```sh
npm ci
npm run dev
npm test
npm run typecheck
NITRO_PRESET=vercel npm run build
```

The Vercel build produces `.vercel/output`. Development reads `.env.local`; never commit that file. See `.env.example` for variable names. Use an owner-controlled, persistent Upstash Redis database. Use the same database for preview and production so they share a single monthly quota.

## AI budget — unresolved, paid calls blocked

The owner's €10/month requirement still applies. The previous mini-model pricing calculation and 250-attempt allowance were removed: they do not apply to GPT-6 Astra. No cheaper model may be selected as a fallback.

The original settings have no explicit output-token cap. A genuine €10 spending cap must therefore be verified at the original provider/billing layer before activation. Shared Redis budget primitives are retained, but no per-attempt price is configured; they fail closed. `generateReading` blocks all paid calls until this is resolved. Do not set an arbitrary per-request cost or silently change reasoning/output settings to make the budget appear satisfied.

The original `callOriginalGateway` implementation is retained for review and mocked tests, including the exact model ID, provider URL, prompt text, reasoning effort and structured-output format. Restoring this function does not provision a Lovable gateway credential for use on Vercel. Verify provider portability/access before deployment.

## Configuration before activation

1. An empty Vercel project `mom-justina-taro` (`prj_5PGXHDL6AliuN9h4j9chf4RUAH1L`) has now been created without a deployment. Connect Vercel's GitHub integration to `justinapranckeviciene-code/JustinaPrn`. The first project-import attempt was rejected because that integration is not installed; no Vercel project/deployment was created by that failed call.
2. Verify that an owner-authorized `LOVABLE_API_KEY` can call the original Lovable gateway from Vercel. No API credential was created/saved during this migration. Do not substitute another model or provider without owner approval.
3. Configure `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` for a persistent owner-controlled database in Vercel's Preview and Production environments. Never prefix secrets with `VITE_`.
4. Set `COFFEE_URL` to the owner's real HTTPS support page (Buy Me a Coffee, Ko-fi, Revolut.me or PayPal). The button is independent from readings; no payment unlock, checkout webhook or subscription.
5. Resolve the original model’s provider-level €10 cap first, then enable its runtime path for one authorized live reading. Test quota exhaustion, parallel requests and counter outage against the real provider/store. Until then, the runtime stays blocked.
6. Check the protected Vercel preview on phone and desktop: draw/reveal 3 distinct cards, upright/reversed XII orientation, Lithuanian AI output, support URL ownership, and reset.
7. Only after all checks pass, enable AI in production and publish the tested source. Keep automatic Git deployment disabled unless a tested release workflow replaces this gate.

## Privacy

When activated, questions/cards are sent through the original Lovable AI gateway to OpenAI only when the visitor requests an interpretation. `store:false` is set. The app does not persist questions or readings. Redis holds aggregate quota counts only. OpenAI may retain data according to its own API data policy; the app's flag is not a promise of provider-level zero retention. Do not log private questions or API responses.

Card art is the retained Rider–Waite–Smith 1909 public-domain scan set. Original source attribution is preserved in `src/lib/tarot/deck.ts`.
