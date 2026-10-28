import { DECK, SPREAD_POSITIONS } from "../src/lib/tarot/deck";

const groups = {
  santykiai: [
    "Ar verta atnaujinti santykius su buvusiu partneriu?",
    "Kaip kalbėtis su partneriu, kai jis vengia pokalbio?",
    "Ko nepastebiu mūsų dažnuose ginčuose?",
    "Kaip nustatyti ribas draugystėje, kurioje jaučiuosi išnaudojama?",
    "Ką galiu padaryti, kad santykiuose būtų daugiau pasitikėjimo?",
    "Ar mano noras susitaikyti kyla iš meilės, ar vienatvės baimės?",
  ],
  darbas: [
    "Ar verta šį rudenį keisti darbą?",
    "Kaip pasiruošti pokalbiui dėl paaukštinimo?",
    "Kas trukdo mano kūrybinei veiklai augti?",
    "Kaip reaguoti į nuolatinę vadovo kritiką?",
    "Ar pradėti savarankišką veiklą, kai dar neturiu klientų?",
    "Ką svarbu įvertinti prieš grįžtant į ankstesnę darbovietę?",
  ],
  pinigai: [
    "Kodėl man sunku laikytis savo išlaidų plano?",
    "Ką apmąstyti prieš skolinant pinigus artimajam?",
    "Kaip tvarkytis su baime, kai pajamos nepastovios?",
    "Ką galiu suprasti apie įprotį pirkti patiriant stresą?",
    "Kokius savo veiklos kainodaros įpročius verta peržiūrėti?",
    "Ar mano skubėjimas daugiau uždirbti trukdo priimti apgalvotus sprendimus?",
  ],
  pasirinkimai: [
    "Likti dabartiniame mieste ar kraustytis arčiau šeimos?",
    "Kaip rinktis tarp dviejų įdomių mokymų?",
    "Ar tęsti projektą, kuriam jau skyriau daug laiko?",
    "Ką svarbu suprasti prieš priimant bendradarbiavimo pasiūlymą?",
    "Kaip atskirti intuiciją nuo baimės šiame pasirinkime?",
    "Ar dabar pradėti naują veiklą, ar pirmiau užbaigti senąją?",
  ],
  taip_ne: [
    "Ar šią savaitę parašyti žmogui, su kuriuo susipykau? Atsakyk TAIP, NE arba NEAIŠKU ir pagrįsk.",
    "Ar priimti darbo pasiūlymą, kuriame neaiškios pareigos? Atsakyk TAIP arba NE su išlygomis.",
    "Ar verta dar kartą bandyti po nesėkmės? Noriu TAIP arba NE ir paaiškinimo pagal kortas.",
    "Ar mano planui dabar tinkamas metas? Pateik TAIP, NE arba NEAIŠKU.",
    "Ar sutikti su bendradarbiavimu, kai nesutariame dėl atsakomybių? Atsakyk TAIP arba NE.",
    "Ar skubėti priimti sprendimą šiandien? Atsakyk TAIP, NE arba NEAIŠKU ir pagrįsk visomis kortomis.",
  ],
};

// Fixed identical spreads for both providers. Covers every card at least once.
export const CASES = Object.entries(groups)
  .flatMap(([category, questions]) => questions.map((question) => ({ category, question })))
  .map((entry, i) => ({
    id: `Q${String(i + 1).padStart(2, "0")}`,
    ...entry,
    cards: SPREAD_POSITIONS.map((position, j) => {
      const card = DECK[(i * 3 + j) % DECK.length]!;
      return {
        id: card.id,
        name: `${card.name} (${card.nameEn})`,
        position,
        reversed: (i + j) % 2 === 1,
      };
    }),
  }));
