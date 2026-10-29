# Paleidimo būsena – 2026-10-29

## Kas įgyvendinta

- Modelis tebėra `gpt-6-astra`, mąstymo lygis `low`, originalus promptas ir kortų tekstas nepakeisti. Bazinis adapteris paliktas poriniam palyginimui.
- Prijungta privati Vercel Blob saugykla `mom-justina-taro-budget`, Frankfurtas, tik šiam projektui. Vercel saugiai įrašo serverio prisijungimo nustatymą; jokių jo reikšmių GitHub nėra.
- Apskaita turi bendrą 10 000 000 mikroeurų (10 €) ribą. Prieš mokamą užklausą rezervuojama blogiausia peržiūrėtų parametrų kaina. `ifMatch` / ETag palyginimas neleidžia dviem serveriams vienu metu išleisti to paties likučio. Atnaujinimas ir naujas deployment nekuria naujos piniginės.
- Pabaigta užklausa suderinama pagal `usage.input_tokens` ir `usage.output_tokens`. Mąstymo žetonai įskaičiuoti į bendrą išvestį. Nepavykusi užklausa, nutrūkęs ryšys ar nežinoma kaina neatlaisvina rezervo. Ankstesnio mėnesio nebaigtos užklausos lieka rezervuotos ir naują mėnesį.
- Yra bendras 12 užklausų per minutę ir 3 užklausų per 5 minutes vienam anonimizuotam IP ribojimas. IP saugomas tik kaip HMAC; klausimai, kortų tekstai ir atsakymai išlaidų saugykloje nesaugomi. Tai nėra pažadas, kad robotas negalės išnaudoti leistino biudžeto. Lankytojo registracija ar mokėjimas neprivalomi.
- Naršyklės atmintyje iki 50 atsakymų pakartotinai naudojami tik tam pačiam klausimui, toms pačioms kortoms, jų eiliškumui ir orientacijoms. Kitų lankytojų atsakymai nesujungiami. Uždarius ar perkrovus puslapį ši talpykla dingsta.
- `AI_ENABLED` ir `AI_QUALITY_APPROVED` serverio jungikliai, API raktas, saugyklos prieiga ir galiojantis kainų patikrinimas privalomi. Nepakankama konfigūracija išjungia AI, užuot pateikusi išgalvotą interpretaciją.

## Svarbus naujas saugos parametras

Lankytojams skirtoje kandidatėje nustatyta 16 384 bendrų išvesties žetonų riba ir standartinis apdorojimas (`service_tier=default`), kad prieš užklausą būtų įmanoma rezervuoti ribotą kainą. Tai apima vidinį mąstymą; originalaus prompto maždaug 250 žodžių reikalavimas nepakeistas. Bazinis porinio palyginimo adapteris naujos ribos neturi. Jei riba pasiekiama, neužbaigtas atsakymas atmetamas. Kol 30 tikrų porinių palyginimų nepatvirtino kokybės, kandidatė lankytojams NEAKTYVUOJAMA. Negalima tvirtinti, kad kokybė jau įrodyta.

## Konservatyvi biudžeto apskaita

Oficiali šio modelio standartinė kaina: 10 USD / mln. įvesties, 50 USD / mln. išvesties žetonų; talpyklos rašymui taikomi kiti tarifai. Saugos apskaita naudoja didesnį 40 USD / mln. įvesties kainos viršutinį įvertį talpyklos rašymo atvejams ir 1,5 EUR/USD bendrą valiutos bei mokesčių rezervą. Todėl apskaitos rodmuo yra atsargus viršutinis įvertis, ne tiksli OpenAI sąskaita. Realios sąnaudos gali būti mažesnės. Užklausa gali būti sustabdyta dar nepasiekus 10 €, jei likučio nepakanka visam naujam rezervui.

Įvesties rezervas remiasi viso serializuoto prompto, schemos ir kortų teksto UTF-8 baitų viršutine riba su protokolo atsarga. Neatitinkantis ribų `usage` negrąžina lėšų; didesnės nei rezervas išlaidos užrakina tolesnį leidimą. Kainų patikrinimas galioja iki 2026-11-29 00:00 UTC; po to AI saugiai išsijungia iki naujo tarifų ir valiutos rezervo patikrinimo. Šis apribojimas sąmoningai neleidžia neribotai naudoti pasenusių kainų.

Pavyzdys be talpyklos: 1000 įvesties ir 1000 bendros išvesties žetonų kainuotų 0,06 USD pagal standartinį tarifą. Saugos apskaita šiam pavyzdžiui įskaitytų 0,135 €. Tikras užklausų kiekis už 10 € dar neišmatuotas; prieš aktyvavimą reikia 30 tikrų atsakymų `usage`. Mokamų AI užklausų neribotumas nežadamas. Šis apskaitos limitas taikomas šiai svetainei; Vercel paslaugų išlaidos ir kiti to paties OpenAI projekto naudojimo būdai į jį neįeina.

Šaltinis: https://developers.openai.com/api/docs/models/gpt-6-astra

## Patikra ir likusios kliūtys

61 automatinė patikra, TypeScript patikra ir vietinis Vercel build praėjo. Tarp patikrų: lygiagretūs rezervai, per mažas likutis, dvigubas suderinimas, nebaigtos užklausos ir mėnesio pasikeitimas, kainų galiojimo pabaiga, užklausų dažnis, originalaus prompto ir visų 78 kortų išsaugojimas.

`scripts/budget-canary.ts` skirtas tikrai privačiai saugyklai patikrinti Vercel build aplinkoje su atskiru vienkartiniu QA failu; jis AI nekviečia ir tikros mėnesio piniginės nekeičia. Tikro Vercel build žurnale patvirtinta: `Private budget store verified: concurrent cap, reconciliation, private cleanup. No AI calls.` Naujas deployment `dpl_D6FDR7vVV6b45G3rBn2CK6G1gJPi` pasiekė READY, commit `3744e7adea0542483c0e4bdabfc86b8f11f424ed`. HTTP patikra grąžino 200, puslapyje patvirtintas mom_justina pavadinimas, klausimo laukas ir pranešimas, kad AI dar ruošiamos.

OpenAI rakto saugus sukūrimas anksčiau grąžino `OpenAI Platform rejected the API key request.` Priežastis nepateikta; negalima to vadinti lėšų trūkumu ar neteisingu slaptažodžiu be įrodymų. Vercel projekte vis dar nėra `OPENAI_API_KEY`. Pokalbyje atsiųstas ankstesnis raktas nenaudojamas ir turi būti atšauktas. Tikrų AI kokybės palyginimų atlikta 0 iš 30. Savanoriškai paramai dar nėra savininkės patvirtintos mokėjimo nuorodos.

## Tikra AI patikra – 2026-10-29 ryte

Savininkės įrašytas serverio slaptas nustatymas `poen_ai_key` pritaikytas production ir preview aplinkoms. Jo reikšmė neatverta ir į GitHub neįrašyta. Modelio GET patikra patvirtino prieigą prie `gpt-6-astra`; tai savaime nepatvirtina mokamo generavimo.

Senoje viešoje svetainėje pateiktas tikras klausimas „Ar verta atnaujinti santykius su buvusiu partneriu?“. Ištrauktos kortos: Kalavijų Karalius apverstas, Taurių Dešimtukas tiesus, Kalavijų Karalienė apversta. Paspaudus interpretaciją gautas matomas „Not enough credits“, atsakymas nesugeneruotas.

Naujas tiesioginis adapteris išbandytas su tuo pačiu klausimu, kortomis, orientacijomis ir originaliu promptu. Prieš kiekvieną iš dviejų bandymų bendroje tikroje piniginėje įrašytas maksimalus išlaidų rezervas. Pirmas bandymas grąžino nesėkmingą SSE atsakymą. Vienas diagnostinis pakartojimas parodė `response.failed` / `error`, kodas `credit_balance_exhausted` (deployment `dpl_GC594yjAC4Y7oLxjmC4BLsZuiRGT`). Daugiau mokamų bandymų neatlikta. Nežinomų sąnaudų rezervai saugiai palikti užimti; tikras žetonų sunaudojimas ir sąskaitos kaina nepatvirtinti.

Tikrų sėkmingų interpretacijų 0; sėkmingų kokybės porų 0/30. Abu kreditų trūkumai blokuoja palyginimą. `AI_ENABLED` ir `AI_QUALITY_APPROVED` lieka false; nauja vieša AI paslauga nepaleista. Ankstesnis šio dokumento teiginys apie trūkstamą raktą yra istorinis ir pakeistas šios skilties duomenimis.
