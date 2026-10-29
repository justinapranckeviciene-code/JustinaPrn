# mom_justina — TARO

## Atidaryti svetainę

**[ATIDARYTI TARO PERŽIŪRĄ](https://mom-justina-taro-justina-prn.vercel.app)**

Tai paruošta Vercel peržiūra. AI interpretacijos dar neįjungtos: serveryje nėra saugiai prijungto OpenAI rakto, o 30 gyvų porinių kokybės palyginimų neatlikti. Puslapyje tai aiškiai pažymėta. Vercel Authentication išsaugota; gali reikėti prisijungti prie savininkės paskyros.

## Kas išsaugota

Originalus bordo ir aukso dizainas, visos 78 RWS kortos, atsitiktinis unikalių kortų traukimas, jų pozicijos ir tiesi/apversta orientacija. Pakaruoklio originalus piešinys teisingas: žmogus tiesioje kortoje kabo žemyn galva. Viršuje — mom_justina. Paramos mygtukas laukia savininkės patvirtintos HTTPS mokėjimo nuorodos; jis nesusijęs su teise užduoti klausimą.

Modelis lieka GPT-6 Astra (`gpt-6-astra` tiesioginėje OpenAI API), `reasoning.effort=low`. Originalus promptas ir JSON schema išsaugoti. Bazinis originalaus Lovable gateway adapteris paliktas poriniam palyginimui. Mokamo runtime kandidatėje 16 384 bendrų išvesties žetonų saugos riba reikalinga biudžeto rezervui; jos poveikis kokybei dar turi būti patikrintas, ne preziumuojamas.

## Išlaidų apsauga

Privati Vercel Blob saugykla saugo bendrą 10 € konservatyvios apskaitos piniginę visoms šio projekto kopijoms. ETag / ifMatch rezervavimas saugo nuo lygiagretaus likučio išleidimo. Įskaitytas modelio mąstymas; neaiškiai pasibaigusios užklausos išlaiko rezervą ir po mėnesio pasikeitimo. Yra bendras ir anonimizuoto IP dažnio ribojimas. Naršyklė pakartotinai naudoja tik tiksliai to paties klausimo, kortų, eiliškumo ir orientacijų atsakymą, be kitų lankytojų duomenų.

Apskaitos rodmuo yra atsargus kainos, valiutos ir mokesčių viršutinis įvertis, ne OpenAI sąskaita. Užklausa gali būti sustabdyta anksčiau, jei likučio neužtenka visam rezervui. Kainų patikrinimas galioja iki 2026-11-29 00:00 UTC, vėliau AI išsijungia iki peržiūros. Vercel paslaugų ir kitos OpenAI paskyros veiklos išlaidos į šios svetainės AI limitą neįeina.

Dabartinė išsami ataskaita: [audit/ACTIVATION-STATUS.md](audit/ACTIVATION-STATUS.md). Pradinis šaltinis ir kontrolinės sumos — aplanke audit.

## Patikra

61 automatinė patikra, TypeScript patikra ir vietinis Vercel build praėjo. Tikrame Vercel build papildomai patvirtinti vienalaikiai rezervai, suderinimas ir privataus QA failo ištrynimas. HTTP patikra grąžino 200 su mom_justina puslapiu. Tikrų AI kokybės palyginimų: 0/30; imitacinės patikros nėra modelio kokybės įrodymas.

```sh
npm ci
npm test
npm run typecheck
NITRO_PRESET=vercel npm run build
```

Vercel build su tikra prijungta saugykla:

```sh
node --experimental-strip-types scripts/budget-canary.ts && NITRO_PRESET=vercel npm run build
```

Canary AI nekviečia, tikrina atskirą vienkartinį QA failą ir neliečia tikros mėnesio piniginės.

## Serverio nustatymai

- OPENAI_API_KEY — atskiras savininkės raktas, įrašomas tik saugiai Vercel serverio nustatymuose. Į pokalbį ar Git jo nesiųsti.
- BLOB_READ_WRITE_TOKEN — jau automatiškai prijungtas iš privačios Vercel Blob saugyklos. Niekur jo nekopijuoti į frontend.
- AI_ENABLED — dabar false.
- AI_QUALITY_APPROVED — dabar false. Keisti tik po 30 gyvų porinių palyginimų.
- COFFEE_URL — savininkės HTTPS paramos puslapis; be jo parama išjungta.

.env.local ignoruojamas Git. Jokiems raktams nenaudoti VITE_ prefikso. Legacy budget.server.ts ir jo istorinės patikros runtime nenaudojami; aktyvus mechanizmas yra wallet-core.ts / wallet.server.ts / guarded.server.ts.

Originalas: Lovable projektas 6f00f10c-5584-4844-b226-2acf49264353, commit cb0bdb65fdf6580f71c69d85eeb29a28ca195ff2. Esama Lovable svetainė šio perkėlimo metu nekeista.
