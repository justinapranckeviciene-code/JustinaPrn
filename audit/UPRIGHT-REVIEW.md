# Tiesios kortos ir trijų kortų istorija — peržiūra

Data: 2026-10-29. Būsena: bandomoji versija; savininkės patvirtinimas ir galutinė peržiūra dar negauti. Vieša versija nepakeista.

## Kas pakeista

- Visi 78 originalūs kortų vaizdai ir Fisher–Yates trijų skirtingų kortų traukimas išsaugoti.
- Pašalintas orientacijos atsitiktinis parinkimas, paveikslėlio apvertimas ir apverstos orientacijos perdavimas aktyviam modeliui. Serveris atmeta papildomą orientacijos lauką.
- Pakaruoklio originalus atvaizdas lieka tiesus: jame žmogus natūraliai kabo galva žemyn.
- Promptas reikalauja vientiso trijų kortų pasakojimo, kontekstinių šviesiųjų ir šešėlinių prasmių, viso derinio TAIP / NE išvados ir konkretaus simbolinio pagrindimo. Draudžiamas mechaninis kortų vertinimas bei nepagrįsti faktų ar svetimų minčių teiginiai.
- Išsaugoti atsakymo laukai direct, story, next, caution, followups, prekės ženklas, dizainas ir paramos funkcija.
- Modelis gpt-6-astra, reasoning low, Responses API, struktūruoto atsakymo schema, saugojimo išjungimas ir esamos vykdymo ribos nepakeisti. Mokami palyginimai paleidžiami atskirai, ne per įprastą surinkimą.
- Ankstesni promptai ir interpretavimo taisyklės išsaugoti audit/before-upright/ prieš funkcinius pakeitimus.

## Techninė patikra

64 automatiniai testai praėjo, TypeScript patikra praėjo, bandomoji versija sėkmingai surinkta ir jos pradinis puslapis grąžina HTTP 200. Testai tikrina 78 vaizdų buvimą, unikalius traukimus, pozicijas, orientacijos įterpimo atmetimą, originalaus modelio nustatymus ir esamą biudžeto apsaugą.

Interaktyvi naršyklės patikra šioje sesijoje neatlikta: vietinė vykdymo aplinka nepasileido ir naršyklės valdymo priemonės neprieinamos. Tai lieka patikrinti prieš viešą publikavimą.

## Realūs promptų palyginimai

Atlikti 8 poriniai bandymai, iš viso 16 sėkmingų, apskaitytų generavimų. Kiekvienoje poroje naudotas tas pats modelis, klausimas, trys tiesios kortos ir tos pačios pozicijos; keistas tik promptas. Tai dabartinio ir naujo promptų palyginimas, ne seno Lovable tinklalapio bandymas.

Peržiūrėti visų 8 porų pilni direct ir story laukai. Juose nauja versija nepraranda išsamumo, konkrečiau pagrindžia tarpusavio ryšius ir išlaiko klausimo temą. Pavyzdžiai:

| Atvejis | Pastebėtas pokytis |
| --- | --- |
| R1 — grįžimas pas buvusį partnerį | Saulės šilumą apriboja Velnio prisirišimas ir Taurių Septyneto idealizavimas; nauja išvada „Labiau NE“ yra sąlyginė, ne nuosprendis partneriui. |
| R2 — ar tylėjimas įrodo apgaulę | Abiejose versijose įtarimas nelaikomas įrodymu; naujoje aiškiau susiejami Mėnulio neaiškumas, Žynės neprieinama informacija ir Kalavijų Septyneto slaptumo tema. |
| D1 — vadovavimas konfliktuojančiai komandai | Imperatoriaus tvarką riboja Lazdų Penketo varžymasis; Jėga keičia griežtą kontrolę į ramų vadovavimą. „Labiau TAIP“ su realių įgaliojimų sąlyga. |
| D2 — grįžimas po projekto nesėkmės | Pentaklių Aštuonetas kliūties pozicijoje rodo galimą persidirbimą po Bokšto sukrėtimo; Žvaigždė padeda keisti darbo būdą ir nežada automatinės sėkmės. |
| F1 — visos santaupos draugo verslui | Saulės optimizmas neatsveria Pentaklių Ketverto saugumo ir Velnio susisaistymo temos. „Labiau NE“ nėra tariamas verslo patikimumo nustatymas. |
| F2 — kasdienės išlaidos | Taurių Devyneto komfortas kliūties pozicijoje keičia Pentaklių Dvejeto laviravimo prasmę; Saikingumas sieja emocinius norus su praktine proporcija. |
| S1 — persikėlimas į kitą miestą | Vežimas perorientuoja Kvailio impulsą, Pakaruoklis įvardija pauzę ir atsisakymo kainą. Sąlyginis „Labiau TAIP“, be sėkmės pažado. |
| S2 — saugus darbas ar kūryba | Pentaklių Dešimtuko stabilumas nėra smerkiamas; jis gali tapti kliūtimi, kai pradžia lyginama su jau sukurta sistema. Lazdų Tūzas išjudina Kalavijų Dvejeto sąstingį. |

## Peržiūros ribos ir publikavimo sąlyga

Tai nedidelė imtis ir kokybinė peržiūra, ne garantija, kad kiekvienas būsimas atsakymas bus teisingas ar vienodai geras. Visų 78 kortų failai ir traukimas patikrinti automatiškai; ši realių interpretacijų imtis neapima visų galimų derinių.

Žurnalų jungtis nukirpo kai kurių ilgų įrašų pabaigas. Todėl dalis next, caution ir followups laukų nebuvo pilnai perskaityta rankiniu būdu, nors visi 16 atsakymų praėjo serverio struktūros patikrą ir buvo apskaityti. Šios peržiūros nelaikome visų pilnų atsakymų patvirtinimu. Palyginimo įrankis atnaujintas ateityje išvesti mažus segmentus; mokami bandymai vien dėl žurnalų išvesties nekartoti.

Prieš viešą publikavimą būtina užbaigti pilnų atsakymų ir interaktyvaus srauto peržiūrą bei gauti savininkės patvirtinimą. PR lieka juodraštis; main nejungtas.

## Peržiūrėti tiesūs atsakymai ir kortų istorijos

### R1 — Ankstesnis promptas

**Klausimas:** Ar verta atnaujinti santykius su buvusiu partneriu?

**Atsakymas:** Atnaujinti santykius su buvusiu partneriu verta svarstyti tik tuomet, jei galite įvardyti, kas nuo išsiskyrimo realiai pasikeitė. Šios kortos simboliškai rodo šilumos ir artumo galimybę, tačiau stipri trauka ar gražūs prisiminimai dar nereiškia, kad ankstesnės problemos išspręstos.

**Kortų istorija:** Dabartinės situacijos pozicijoje tiesi Saulė pabrėžia džiaugsmą, atvirumą ir galimybę aiškiau pamatyti, kas jus siejo gero. Kliūties pozicijoje tiesus Velnias kviečia patikrinti, ar noras sugrįžti nesusijęs su emocine priklausomybe, pavydu, kontrole ar sunkumu paleisti pažįstamą ryšį; pati korta neįrodo, kad tai vyksta. Patarimo pozicijoje tiesus Taurių Septynetas ragina atskirti realias galimybes nuo idealizuojamo susitaikymo. Kartu kortos siūlo neprarasti vilties, bet vertinti ne vien jausmų intensyvumą: svarbiausia, ar šįkart santykiai būtų kitokie.

### R1 — Naujas promptas

**Klausimas:** Ar verta atnaujinti santykius su buvusiu partneriu?

**Atsakymas:** Labiau NE – šiuo metu santykių atnaujinti neverta, jei pagrindinis argumentas yra išlikusi šiluma ir stipri trauka, o ankstesnės problemos nepasikeitė. Saulės atvirumą šiame derinyje riboja Velnio prisirišimas ir Taurių Septyneto perspėjimas nepainioti trokštamo scenarijaus su realia galimybe; tai simbolinė kryptis, ne partnerio ketinimų ar ateities patvirtinimas.

**Kortų istorija:** Dabartinės situacijos pozicijoje Saulė rodo, kad ryšyje gali būti tikro džiaugsmo, šilumos ir noro bendrauti be užuolankų. Jos vaiko atvirumas paaiškina, kodėl sugrįžimas gali atrodyti paprastas ir viliojantis, tačiau pats savaime neįrodo santykių brandos. Kliūties pozicijoje Velnias šį vaizdą apsunkina: prie postamento pririštos figūros simbolizuoja trauką, kuri gali laikyti kartu net tada, kai santykiai varžo. Todėl svarbiausia ne paneigti gerus prisiminimus, o atskirti juos nuo galimo seno kontrolės, priklausomo prisirišimo ar pasikartojančių konfliktų rato. Laisvos grandinės kartu primena, kad prisirišimas nėra prievolė sugrįžti. Patarimo pozicijoje Taurių Septynetas rodo debesyse iškilusius skirtingus, ne vien patrauklius vaizdinius: šalia susitaikymo svajonės būtina matyti ir jos kainą. Ši korta nežada naujos pradžios – ji ragina atsijoti fantazijas. Visa istorija kalba apie malonų artumo pažadą, kurio kol kas nepakanka senam santykių modeliui atsverti.

### R2 — Ankstesnis promptas

**Klausimas:** Ar jo tylėjimas įrodo, kad jis mane apgaudinėja?

**Atsakymas:** Ne, vien jo tylėjimas neįrodo, kad jis tave apgaudinėja, o Taro kortos negali patvirtinti neištikimybės ar melo. Šis išdėstymas labiau atspindi neaiškumą jūsų bendravime ir poreikį atskirti įtarimus nuo patikrinamų faktų.

**Kortų istorija:** Dabartinės situacijos pozicijoje tiesus Mėnulis simbolizuoja miglotumą: kai trūksta atsakymų, baimės gali užpildyti spragas, bet tai nėra apgaulės įrodymas. Kliūties pozicijoje tiesi Žynė pabrėžia neišsakytus dalykus ir užsisklendimą; vien nuojautos gali nepakakti suprasti, kodėl jis tyli. Patarimo pozicijoje tiesus Kalavijų Septynetas kviečia elgtis apdairiai: tiksliai įvardyti, ką pastebi, ir vertinti, ar jo žodžiai dera su veiksmais. Nors ši korta siejama su slėpimu, čia ji nėra nuosprendis jam ar raginimas slapta tikrinti. Kartu kortos siūlo ieškoti aiškumo, o ne laikyti nežinomybę kaltės patvirtinimu.

### R2 — Naujas promptas

**Klausimas:** Ar jo tylėjimas įrodo, kad jis mane apgaudinėja?

**Atsakymas:** Labiau NE – jo tylėjimas savaime neįrodo, kad jis tave apgaudinėja. Šis derinys simboliškai rodo miglotumą, neprieinamą informaciją ir vengimo tendenciją, tačiau kortos negali patvirtinti nei melo, nei neištikimybės, nei jo tylėjimo priežasties.

**Kortų istorija:** Dabartinės situacijos Mėnulis vaizduoja kelią neaiškioje šviesoje: kažką pastebi, bet dar negali patikimai atskirti tikro pavojaus nuo baimės sukurto vaizdo. Jo tylėjimas palieka spragą, kurią lengva užpildyti skaudžiausiu paaiškinimu. Kliūties pozicijoje Žynė šį neaiškumą sustiprina: jos uždanga ir iš dalies pridengtas ritinys primena ribotą prieigą prie informacijos. Čia vidinis nujautimas gali tapti akląja zona, jeigu jam suteikiama įrodymo galia; kartu ir pats neatsakymas trukdo suprasti santykio padėtį. Patarimo pozicijoje Kalavijų Septynetas, kurio veikėjas nešasi kalavijus žvalgydamasis atgal, įveda slaptumo, išsisukinėjimo ir apskaičiuoto elgesio temą. Tačiau šioje pozicijoje jis nėra nuosprendis apie jo veiksmus: ragina elgtis apgalvotai ir pačiai neįsivelti į spėliojimų, sekimo ar gudrių patikrinimų žaidimą. Visų trijų kortų istorija nepalanki aiškiam, atviram bendravimui, bet nepakankama išvadai apie apgaulę. Svarbus skirtumas: neaiškumas yra tikras tavo patyrimas, o jo paaiškinimas dar nenustatytas.

### D1 — Ankstesnis promptas

**Klausimas:** Ar verta priimti vadovo pareigas, jei komanda nuolat konfliktuoja?

**Atsakymas:** Vadovo pareigas konfliktuojančioje komandoje verta svarstyti, jei kartu gausi aiškius įgaliojimus nustatyti darbo ir bendravimo taisykles bei aukštesnės vadovybės palaikymą. Kortų derinys palankesnis tvirtam, kantriam vadovavimui nei bandymui vien savo autoritetu nutildyti nesutarimus.

**Kortų istorija:** Dabartinės situacijos pozicijoje tiesus Imperatorius pabrėžia struktūros, atsakomybės ir aiškių ribų poreikį: šiai komandai gali trūkti nuoseklaus vadovavimo. Kliūties pozicijoje tiesus Lazdų Penketas rodo konkuruojančius interesus ir kovą dėl įtakos — vien tavo paskyrimas konfliktų neišspręs. Patarimo pozicijoje tiesi Jėga siūlo emocinę savitvardą, kantrybę ir gebėjimą išklausyti neprarandant ribų. Kartu kortos kviečia derinti Imperatoriaus tvarką su Jėgos ramybe, kad Lazdų Penketo varžymasis galėtų virsti konstruktyvia diskusija.

### D1 — Naujas promptas

**Klausimas:** Ar verta priimti vadovo pareigas, jei komanda nuolat konfliktuoja?

**Atsakymas:** Labiau TAIP, jei kartu su atsakomybe gausi realius įgaliojimus nustatyti darbo ir konfliktų sprendimo taisykles. Imperatoriaus struktūrą čia išbando Lazdų Penketo varžymasis, o Jėga siūlo vadovauti ramiai ir tvirtai, ne spaudimu; tai simbolinis pagrindas sąlyginiam sprendimui, ne pažadas, kad komanda pasikeis.

**Kortų istorija:** Dabartinės situacijos pozicijoje Imperatorius, sėdintis akmeniniame soste, išryškina aiškios atsakomybės, ribų ir sprendimų tvarkos poreikį. Šiame klausime vadovo pareigos reikštų ne vien aukštesnį statusą, bet būtinybę suteikti komandai atramą. Tačiau kliūties pozicijoje Lazdų Penketas rodo skirtingomis kryptimis mosuojamas lazdas: energijos yra, bet ji eikvojama tarpusavio varžymuisi, užuot siekus bendro rezultato. Todėl vien pareigų pavadinimas ar griežtesni nurodymai konfliktų neišspręstų — pernelyg kietas Imperatoriaus autoritetas galėtų tapti dar vienu kovos centru. Patarimo pozicijoje Jėga šią įtampą koreguoja: moteris liūtą valdo ne ginklu, o santūriu, užtikrintu prisilietimu. Tai kvietimas ne nusileisti triukšmingiausiems, bet išlaikyti ribas neprisidedant prie kovos. Visos trys kortos kartu palankios vadovavimui, kuris derina aiškią tvarką su gebėjimu atlaikyti prieštaravimus. Jos neragina priimti pareigų vien tam, kad savo kantrybe kompensuotum neveikiančią sistemą.

### D2 — Ankstesnis promptas

**Klausimas:** Kaip grįžti į darbą po nesėkmingo projekto?

**Atsakymas:** Grįžtant į darbą po nesėkmingo projekto, kortos siūlo ne mėginti iškart atkurti ankstesnį įvaizdį, o pripažinti, kas nepavyko, ir pasitikėjimą auginti mažais, matomais veiksmais. Galimas kelias pirmyn – vienas realistiškas įsipareigojimas ir atviresnis pokalbis apie tai, ko išmokai.

**Kortų istorija:** Dabartinės situacijos pozicijoje tiesus Bokštas simbolizuoja sukrėstą pasitikėjimą ir subyrėjusias prielaidas apie projektą ar savo vaidmenį jame. Jis kviečia atskirti, kas iš tiesų neveikė, nuo minties, kad nesėkmė apibrėžia visą tavo kompetenciją. Kliūties pozicijoje tiesus Pentaklių Aštuonetas rodo, kad net darbštumas gali trukdyti, jei bandysi viską kompensuoti persidirbimu, begaliniu tobulinimu ar vien techninių įgūdžių šlifavimu, vengdamas aptarti projekto pamokas. Patarimo pozicijoje tiesi Žvaigždė siūlo atkurti kryptį ir viltį: pasirinkti prasmingą, įveikiamą užduotį ir leisti pasitikėjimui grįžti palaipsniui. Kartu kortos kalba apie perėjimą nuo sukrėtimo per sąmoningą darbo įpročių peržiūrą į tvaresnį sugrįžimą.

### D2 — Naujas promptas

**Klausimas:** Kaip grįžti į darbą po nesėkmingo projekto?

**Atsakymas:** Grįžk ne bandydamas kuo greičiau ištrinti nesėkmę nepriekaištingu darbu, o aiškiai įvardydamas, kas nepasiteisino, ir pasirinkdamas vieną realistišką užduotį pradžiai. Šis derinys simboliškai rodo atsargiai palankią atsigavimo kryptį, tačiau tam reikia keisti darbo būdą, o ne vien didinti pastangas.

**Kortų istorija:** Dabartinės situacijos Bokšte žaibas suardo statinį ir nubloškia jo karūną: nesėkmingas projektas galėjo sukrėsti ne tik planus, bet ir tavo supratimą apie savo kompetenciją ar kontrolę. Čia svarbu atskirti sugriuvusį projektą nuo išvados, kad sugriuvo visa tavo profesinė vertė. Kliūties pozicijoje Pentaklių Aštuonetas rodo meistrą, susitelkusį į vis naują dirbinį. Po Bokšto toks darbštumas gali tapti mėginimu susigrąžinti saugumą per nuolatinį taisymą, tobulinimą ar persidirbimą, nepatikrinus, ar pats darbo pagrindas buvo tinkamas. Taip galima kruopščiai kartoti tai, kas neveikė. Patarimo pozicijoje Žvaigždės figūra, viena koja siekianti vandenį, o keliu besiremianti į žemę, siūlo derinti jautrumą su praktiškumu. Jos pilamas vanduo reiškia atsinaujinimą, o ne skubų ankstesnio įvaizdžio atkūrimą. Visų trijų kortų istorija veda nuo sukrėtimo per perdėto darbo spąstus į atviresnį, tvaresnį grįžimą. Žvaigždė čia nėra pažadas, kad kitas projektas pasiseks; ji pataria atkurti pasitikėjimą mažais, patikrinamais veiksmais.

### F1 — Ankstesnis promptas

**Klausimas:** Ar verta visas santaupas skirti draugo siūlomam verslui?

**Atsakymas:** Šių kortų simbolika labiau ragina suabejoti mintimi visas santaupas susieti su draugo siūlomu verslu, nei ją palaiko. Saulė atspindi patrauklią galimybę ir entuziazmą, tačiau Pentaklių Ketvertas bei Velnias iškelia saugumo, prisirišimo ir galimos priklausomybės temą — tai nėra verslo sėkmės ar nesėkmės prognozė.

**Kortų istorija:** Dabartinėje situacijoje tiesi Saulė rodo optimizmą: draugo pasiūlymas gali atrodyti aiškus, perspektyvus, o pasitikėjimas draugu sustiprinti jo patrauklumą. Kliūties pozicijoje tiesus Pentaklių Ketvertas atskleidžia įtampą tarp noro auginti turimą gerovę ir poreikio išsaugoti saugumą. Klausime apie visas santaupas ši įtampa ypač svarbi. Patarimo pozicijoje tiesus Velnias kviečia atpažinti, kas gali varžyti laisvą pasirinkimą: pelno vilionė, baimė praleisti progą ar pareigos draugui jausmas. Jis neįrodo draugo nesąžiningumo. Kartu kortos pasakoja apie šviesiai atrodančią galimybę, kurios žavesį svarbu atskirti nuo emocinių saitų.

### F1 — Naujas promptas

**Klausimas:** Ar verta visas santaupas skirti draugo siūlomam verslui?

**Atsakymas:** Labiau NE – simboliškai šis derinys nepalankus būtent sumanymui visas santaupas susieti su draugo siūlomu verslu: patrauklią perspektyvą riboja saugumo, kontrolės ir priklausomybės tema. Tai nėra verslo nesėkmės prognozė ar finansinė rekomendacija: kortos negali patvirtinti nei pasiūlymo pelningumo, nei draugo ketinimų.

**Kortų istorija:** Dabartinės situacijos Saulė vaizduoja nuogą vaiką ant balto žirgo ryškioje šviesoje – pasiūlymas gali atrodyti aiškus, nuoširdus ir kupinas galimybių. Draugystė čia gali sustiprinti įspūdį, kad nėra ko slėpti, tačiau vaiko atvirumas nėra verslo patikimumo įrodymas. Kliūties pozicijoje Pentaklių Ketvertas, kurio figūra monetą spaudžia prie krūtinės, o kitas laiko po kojomis ir ant galvos, į šį pasitikėjimą įneša stiprų saugumo bei kontrolės poreikį. Kai svarstomos visos santaupos, kalbama ne vien apie galimą uždarbį, bet ir apie pagrindą, kurio praradimas būtų sunkiai pakeliamas. Ši kliūtis nekviečia tiesiog paleisti atsargumo: patarimo pozicijoje Velnias nukreipia dėmesį į grandinėmis susietas figūras ir įsipareigojimus, kurie gali apriboti pasirinkimą. Jis ragina atpažinti, kuo viliojantis pasiūlymas galėtų pririšti – pelno troškimu, lojalumu draugui ar sunkumu pasitraukti. Taigi Saulės optimizmas nepanaikina kitų kortų įtampos: visa istorija kalba apie pavojų pasitikėjimą paversti pernelyg dideliu susisaistymu.

### F2 — Ankstesnis promptas

**Klausimas:** Kaip suvaldyti augančias kasdienes išlaidas?

**Atsakymas:** Augančių kasdienių išlaidų tema šios kortos išryškina pusiausvyrą tarp prisitaikymo ir noro išlaikyti įprastus malonumus. Simbolinė jų kryptis – ne griežtas savęs ribojimas, o nuosaikus kasdienių pasirinkimų permąstymas; tai refleksija, ne finansinis nurodymas.

**Kortų istorija:** Dabartinės situacijos pozicijoje tiesus Pentaklių Dvejetas rodo žongliravimą kintančiomis išlaidomis ir poreikį nuolat derintis. Tai gali reikšti, kad daug energijos tenka trumpalaikiam balansavimui. Kliūties pozicijoje tiesus Taurių Devynetas primena pasitenkinimą ir komfortą: sunkumų gali kelti nenoras atsisakyti įprastų malonumų, net kai jų kaina auga. Tai nėra kaltinimas išlaidumu – veikiau klausimas, kas iš tiesų suteikia pakankamai džiaugsmo. Patarimo pozicijoje tiesus Saikingumas kviečia vengti kraštutinumų ir ieškoti tvaraus ritmo. Kartu kortos pasakoja apie galimybę nuo nuolatinio laviravimo pereiti prie sąmoningesnio santykio su kasdieniais poreikiais.

### F2 — Naujas promptas

**Klausimas:** Kaip suvaldyti augančias kasdienes išlaidas?

**Atsakymas:** Šis derinys siūlo kasdienes išlaidas valdyti ne vis griežtesniu savęs ribojimu, o atpažįstant, kur būtinybė susipina su noru save pradžiuginti. Simbolinė kryptis palanki nuosekliam saikui: svarbiausia mažinti nuolatinį laviravimą ir susikurti pakartojamą ritmą, o ne vienkartinį taupymo proveržį.

**Kortų istorija:** Dabartinės situacijos Pentaklių Dvejetas vaizduoja žmogų, žongliruojantį dviem monetomis, o už jo laivai kyla ir leidžiasi bangose. Tai atliepia kasdienybę, kurioje vieną išlaidą pakeičia kita: lankstumas padeda išsilaikyti, tačiau pats žongliravimas jau reikalauja dėmesio. Kliūties pozicijoje Taurių Devynetas šią istoriją papildo pasitenkinimo tema. Prieš devynias išrikiuotas taures patogiai sėdinti figūra simbolizuoja malonumą ir jausmą „man užtenka, man gera“; čia šešėlis gali būti nenoras atsisakyti įprasto komforto arba polinkis mažus pirkinius laikyti savaime suprantamu atlygiu. Taigi sunkumas gali slypėti ne vien kintančiose kainose, bet ir tame, kokį pasitenkinimą norisi išsaugoti. Patarimo pozicijoje Saikingumas keičia žongliravimą į apgalvotą skysčio pylimą iš vienos taurės į kitą: ne viską uždrausti, o rasti tinkamą proporciją. Viena angelo pėda vandenyje, kita sausumoje sieja emocinius norus su praktine tikrove. Derinys ragina ne smerkti malonumus, bet pastebėti jų vietą bendrame kasdienybės ritme.

### S1 — Ankstesnis promptas

**Klausimas:** Ar šiuo metu verta persikelti gyventi į kitą miestą?

**Atsakymas:** Pagal šias kortas persikėlimą į kitą miestą šiuo metu verta rimtai svarstyti, tačiau ne kaip spontanišką šuolį. Palankesnė kryptis – ruoštis pokyčiui dabar, o persikelti tada, kai aiškiai žinosi, ko ieškai naujame mieste ir kaip ten kursi kasdienybę.

**Kortų istorija:** Dabartinės situacijos pozicijoje tiesus Kvailys rodo atvirumą naujai pradžiai: kitas miestas gali reikšti daugiau laisvės ir galimybių, bet dar ne visos persikėlimo aplinkybės aiškios. Kliūties pozicijoje tiesus Pakaruoklis išryškina laukimą, įstrigimą arba būtinybę pakeisti požiūrį: svarbu suprasti, ką reikėtų paleisti iš dabartinio gyvenimo. Patarimo pozicijoje tiesus Vežimas kviečia pačiam nustatyti kryptį ir veikti nuosekliai. Kartu kortos siūlo ne atsisakyti persikėlimo, o pradinį entuziazmą paversti kryptingu pasirengimu.

### S1 — Naujas promptas

**Klausimas:** Ar šiuo metu verta persikelti gyventi į kitą miestą?

**Atsakymas:** Labiau TAIP – verta kryptingai ruoštis persikėlimui, tačiau ne išvykti vien dėl naujos pradžios vilionės. Kvailio norą žengti pirmyn pristabdo Pakaruoklis, o Vežimas pataria judėti tik aiškiai pasirinkus kryptį ir suvaldžius praktines aplinkybes; tai simbolinė gairė, ne garantija, kad kitame mieste seksis geriau.

**Kortų istorija:** Dabartinėje situacijoje Kvailys stovi prie skardžio su lengvu ryšuliu: naujas miestas gali atrodyti kaip galimybė pradėti be ankstesnių suvaržymų, tačiau jo žvilgsnis neaprėpia žemės po kojomis. Čia svarbu atskirti atvirumą patirčiai nuo neįvertinto šuolio. Kliūties pozicijoje Pakaruoklis šį impulsą sustabdo: pakibusi figūra rodo laukimą, kitokio požiūrio poreikį ir būtinybę kažko atsisakyti. Derinyje tai gali reikšti, kad noras išvykti jau yra, bet dar nepriimta persikėlimo kaina – atsisveikinimas su pažįstama aplinka, patogumu ar dabartiniais įsipareigojimais. Kita šios kliūties pusė – užsitęsęs svarstymas, kai laukiama visiško tikrumo. Patarimo pozicijoje Vežimas siūlo išeitį ne per dar vieną spontanišką šuolį, o per priešingų jėgų suvaldymą. Juodas ir baltas sfinksai primena, kad noras keistis ir poreikis išlaikyti saugumą turi tarnauti vienai krypčiai. Todėl derinys palankus apgalvotam persikėlimui, bet nepalaiko nei aklo skubėjimo, nei neriboto atidėliojimo.

### S2 — Ankstesnis promptas

**Klausimas:** Kaip apsispręsti tarp saugaus darbo ir kūrybinės veiklos?

**Atsakymas:** Sprendžiant tarp saugaus darbo ir kūrybinės veiklos, kortos siūlo ne skubiai atsisakyti vieno kelio, o praktiškai išbandyti kūrybinį impulsą. Saugumas tau svarbus, tačiau verta atskirti, kiek jį renkiesi dėl savo poreikių, o kiek dėl lūkesčio gyventi „teisingai“.

**Kortų istorija:** Dabartinėje situacijoje tiesus Kalavijų Dvejetas rodo svarstymų aklavietę: gali norėti aiškumo dar prieš leisdamas sau patirti kūrybinį kelią. Kliūties pozicijoje tiesus Pentaklių Dešimtukas pabrėžia stabilumo, nusistovėjusios karjeros ir šeimos lūkesčių svorį. Tai vertybės, ne savaiminė problema, tačiau jos gali tapti vieninteliu pasirinkimo matu. Patarimo pozicijoje tiesus Lazdų Tūzas kviečia suteikti kūrybinei idėjai konkretų pradžios tašką. Kartu kortos siūlo išeiti iš vidinio ginčo per nedidelį bandymą, o ne reikalauti iš savęs galutinio sprendimo šiandien.

### S2 — Naujas promptas

**Klausimas:** Kaip apsispręsti tarp saugaus darbo ir kūrybinės veiklos?

**Atsakymas:** Apsispręsk ne vien svarstydamas, ką prarastum, bet praktiškai išbandydamas, ką galėtum sukurti. Šis derinys palankesnis konkrečiam kūrybiniam bandymui nei neribotam saugaus pasirinkimo saugojimui, tačiau neragina iškart mesti darbo: kūrybinis impulsas dar nėra tvarios veiklos įrodymas.

**Kortų istorija:** Dabartinės situacijos pozicijoje Kalavijų Dvejetas vaizduoja užrištomis akimis sėdinčią figūrą, laikančią sukryžiuotus kalavijus. Tai sustabdyto sprendimo vaizdas: abi galimybes laikai pusiausvyroje, bet kartu gali neleisti sau aiškiai įvardyti, ko nori. Už figūros esantis vanduo primena jausmus, kurių vien logiškas argumentų svėrimas neaprėpia. Kliūties pozicijoje Pentaklių Dešimtukas šią aklavietę susieja su sukauptu saugumu, šeimos lūkesčiais ar įprastu sėkmės modeliu. Jo namai, kelios kartos ir turtas nėra blogybė — kliūtimi tampa reikalavimas, kad bet kuris naujas kelias iškart suteiktų tokią pačią atramą. Taip kūrybinę pradžią lygintum su jau pastatyta sistema. Patarimo pozicijoje Lazdų Tūzas, iš debesies tiesiama ranka su sprogstančia lazda, siūlo šią nelygią kovą pakeisti veiksmu: suteikti idėjai apčiuopiamą pradžią. Jis neatšaukia Pentaklių Dešimtuko vertės, bet išjudina Kalavijų Dvejeto sąstingį. Sprendimui reikia ne pažado apie sėkmę, o patirties, ar kūrybinis noras išlieka susidūręs su darbu.


## Papildoma kalbos ir aiškumo korekcija po peržiūros

Pašalintas matomas užrašas „Tiesi“ po kortomis. Naujame prompte uždrausti skaitytojui nereikalingi kaladės trumpiniai ir orientacijos komentarai; piešinių detalių aprašymai turi užleisti vietą klausimo bei trijų kortų ryšio interpretacijai.

TAIP / NE taisyklė papildyta neiginių ir tikrinamo teiginio krypties patikra. Pavyzdžiui, „Ar bus sunku?“ ir „Ar nebus sunku?“ negali būti atsakomi tuo pačiu nepaaiškintu TAIP. Kai žyma dviprasmiška, reikia tiesiogiai įvardyti grįžimo sunkumą ar sklandumą pagal derinį.

Aukščiau pateiktos 8 poros priklauso ankstesnei bandomojo prompto redakcijai. Šių papildomų kalbos taisyklių realių AI atsakymų patikra dar neatlikta; ankstesnių bandymų joms nepriskiriame. Viešas publikavimas vis dar nepatvirtintas.
