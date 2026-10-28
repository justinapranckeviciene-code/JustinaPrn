# TARO perkėlimo patikra – 2026-10-28

**Būsena: NEPUBLIKUOTA. Tai paruošta kopija, ne užbaigtas perkėlimas.**

## Išsaugotas originalas

- Lovable projektas `6f00f10c-5584-4844-b226-2acf49264353`, šaltinio commit `cb0bdb65fdf6580f71c69d85eeb29a28ca195ff2`.
- Originalus AI šaltinis: `original-interpret.functions.ts.txt`.
- Modelis originale `openai/gpt-6-astra`; tiesioginėje OpenAI API to paties modelio ID yra `gpt-6-astra`.
- Nepakeisti promptas, `reasoning.effort=low`, `stream=true`, `store=false`, vartotojo klausimo/kortų tekstas ir JSON atsakymo schema. Naujas trumpesnis atsakymo ar žetonų limitas nepridėtas.
- Atskiro TAIP/NE algoritmo originaliame kode nėra. Interpretacija priklauso nuo modelio ir bendro prompto. Atskirų 78 kortų interpretacijų tekstų originale taip pat nėra: perduodami kortų pavadinimai, pozicijos ir orientacijos.
- SHA-256 prompto ir 78 vietinių paveikslėlių kontrolinės sumos: `source-manifest.json`. Kontrolinės sumos fiksuoja išsaugotą vietinę kopiją; nepriklausomas visų originalaus viešo serverio baitų palyginimas šioje sesijoje neatliktas.

## Paruošta ir patikrinta

- Ankstesnėje kopijoje išsaugotas bordo ir aukso dizainas, pavadinimas `mom_justina`, savanoriškos paramos vieta ir nemokamas kortų traukimas be registracijos.
- Visi 78 JPEG atidaromi ir praeina PIL failų patikrą.
- Pakaruoklio originalus paveikslėlis apžiūrėtas: XII viršuje, pavadinimas apačioje, žmogus kabo žemyn galva. Tai teisinga tiesios kortos orientacija; papildomas 180° pasukimas sugadintų simboliką. Kopijoje apverčiamas visas vaizdas tik esant `reversed=true`.
- Paruoštas tiesioginis OpenAI adapteris `openai.server.ts`. Jis dar neprijungtas prie lankytojų užklausų ir negali apeiti esamo mokamų užklausų blokavimo.
- 50 automatinių patikrų praėjo. Jose yra 30 fiksuotų klausimų abiejų adapterių užklausos parametrų palyginimų su imitaciniu transportu. Promptas sutampa simbolis į simbolį. Tai NĖRA tikri modelio atsakymai ir NĖRA AI kokybės įrodymas.
- TypeScript patikra ir `NITRO_PRESET=vercel npm run build` praėjo.
- `vercel.json` neleidžia automatinio publikavimo iš Git.
- Vercel sukurtas tuščias projektas `mom-justina-taro`, ID `prj_5PGXHDL6AliuN9h4j9chf4RUAH1L`, Node 24. Svetainė neįkelta: `live=false`, nėra deployment ar domeno. Peržiūrų autentifikavimo apsauga įjungta.

## 30 tikrų klausimų palyginimas

Atlikta **0 iš 30**. `questions.ts` paruošti 6 santykių, 6 darbo, 6 pinigų, 6 pasirinkimų ir 6 TAIP/NE klausimai. Fiksuotos vienodos kortos abiem adapteriams apima visas 78 kortas ir abi orientacijas.

Kiekvienai porai dar reikia įrašyti seno ir naujo modelio atsakymus, faktinius usage duomenis ir vertinimą: ryšys su klausimu, visos trys kortos, jų pozicijos/orientacijos, tarpusavio ryšiai, pagrįstumas be priverstinio pozityvumo, TAIP/NE nuoseklumas, pasikartojimai ir neužbaigti atsakymai. Vienodi parametrai negarantuoja identiško modelio elgesio per skirtingus teikėjus. Iki šių bandymų kokybės lygybė neįrodyta.

## Kaina ir 10 EUR riba

Oficiali 2026-10-28 standartinė GPT-6 Astra kaina: 10 USD / 1 mln. įvesties ir 50 USD / 1 mln. išvesties žetonų. Išvesties sąnaudos apima apmokestinamą mąstymą, ne tik matomą tekstą. Šaltiniai:

- https://developers.openai.com/api/docs/models
- https://developers.openai.com/api/docs/pricing

Be talpyklos vienos užklausos USD kaina = įvesties žetonai × 0,00001 + išvesties žetonai × 0,00005.

Tik iliustracija, ne matavimas: 1000 įvesties ir 1000 bendros išvesties žetonų kainuotų 0,06 USD; 1000 įvesties ir 3000 bendros išvesties – 0,16 USD. Dar reikia EUR/USD kurso, taikomų mokesčių ir realaus usage. Todėl patikimas užklausų skaičius už 10 EUR kol kas NENUSTATYTAS.

Kodas šiandien NEĮGYVENDINA aktyvaus, patvirtinto 10 EUR ribotuvo. Esami Redis rezervavimo ruošiniai su `RESERVATION_CENTS=null` atsisako leisti mokamas užklausas. Lankytojams skirta AI funkcija užblokuota, todėl ši kopija AI išlaidų nesukuria. Tai nėra veikiančios paslaugos pakaitalas.

Prieš aktyvavimą reikia bendros patvarios apskaitos visoms kopijoms, atominio blogiausios galimos kainos rezervavimo prieš užklausą, tikslaus usage suderinimo ir atsargaus EUR/mokesčių rezervo. Nežinoma kaina, apskaitos gedimas, neaiški baigtis ar nepakankamas likutis turi sustabdyti naują mokamą užklausą. Vien išlaidų įspėjimas nėra griežtas limitas. Negalima tyliai pakeisti modelio ar sutrumpinti atsakymų.

Pasiekus patvirtintą limitą numatoma sustabdyti naujas AI interpretacijas iki kito Vilniaus kalendorinio mėnesio; kortų rodymas ir jau parodytas atsakymas turi likti. Ši elgsena dar turi būti įgyvendinta ir patikrinta su realia apskaita.

## Likę blokavimai

1. GitHub prieiga atkurta savininkei įdiegus ChatGPT Codex Connector tik pasirinktai saugyklai. Pilna paruošta kopija įkelta, įskaitant visus 78 kortų paveikslėlius. Ankstesnis 403 blokavimas pašalintas. Tai nekeičia publikavimo ar AI aktyvavimo draudimo.
2. Savininkės nuotraukoje matomas API raktas `Taro`, bet jo slapta reikšmė neperduota darbo aplinkai/serveriui. Nuotrauka nepatvirtina modelio prieigos, kredito likučio ar rakto veikimo. Slapta reikšmė neturi patekti į chatą ar Git.
3. Neįgyvendintas ir realiai nepatikrintas griežtas 10 EUR limitas, patvari apskaita, lankytojų piktnaudžiavimo ribojimas ir suasmeninimo neprarandanti talpykla.
4. Nėra tikros savininkės paramos puslapio nuorodos; mygtukas neturi rinkti pinigų į spėjamą paskyrą.
5. Neatlikti 30 gyvų porinių kokybės bandymų ir telefono/kompiuterio Vercel peržiūros bandymai.

Iki blokavimų pašalinimo produkcija nepublikuojama. Esama Lovable svetainė šioje sesijoje nekeista.
