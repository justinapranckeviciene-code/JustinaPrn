// Deck definition. Card art: Rider–Waite–Smith 1909 ("Pamela-A") scans from
// Wikimedia Commons, public domain (published 1909; illustrator died 1951).
// Files are bundled locally in /public/cards/<id>.jpg.
export type TarotCard = {
  id: string;
  name: string;
  nameEn: string;
  arcana: "major" | "minor";
  image: string;
};
export type DrawnCard = TarotCard & { position: string };

const MAJOR: [string, string][] = [
  ["Kvailys", "The Fool"],
  ["Magas", "The Magician"],
  ["Žynė", "The High Priestess"],
  ["Imperatorė", "The Empress"],
  ["Imperatorius", "The Emperor"],
  ["Hierofantas", "The Hierophant"],
  ["Įsimylėjėliai", "The Lovers"],
  ["Vežimas", "The Chariot"],
  ["Jėga", "Strength"],
  ["Atsiskyrėlis", "The Hermit"],
  ["Likimo ratas", "Wheel of Fortune"],
  ["Teisingumas", "Justice"],
  ["Pakaruoklis", "The Hanged Man"],
  ["Mirtis", "Death"],
  ["Saikingumas", "Temperance"],
  ["Velnias", "The Devil"],
  ["Bokštas", "The Tower"],
  ["Žvaigždė", "The Star"],
  ["Mėnulis", "The Moon"],
  ["Saulė", "The Sun"],
  ["Teismas", "Judgement"],
  ["Pasaulis", "The World"],
];
const SUITS: [string, string][] = [
  ["Lazdų", "Wands"],
  ["Taurių", "Cups"],
  ["Kalavijų", "Swords"],
  ["Pentaklių", "Pentacles"],
];
const RANKS: [string, string][] = [
  ["Tūzas", "Ace"],
  ["Dvejetas", "Two"],
  ["Trejetas", "Three"],
  ["Ketvertas", "Four"],
  ["Penketas", "Five"],
  ["Šešetas", "Six"],
  ["Septynetas", "Seven"],
  ["Aštuonetas", "Eight"],
  ["Devynetas", "Nine"],
  ["Dešimtukas", "Ten"],
  ["Pažas", "Page"],
  ["Riteris", "Knight"],
  ["Karalienė", "Queen"],
  ["Karalius", "King"],
];

const card = (
  id: string,
  name: string,
  nameEn: string,
  arcana: TarotCard["arcana"],
): TarotCard => ({
  id,
  name,
  nameEn,
  arcana,
  image: `/cards/${id}.jpg`,
});

export const DECK: TarotCard[] = [
  ...MAJOR.map(([lt, en], i) => card(`major-${i}`, lt, en, "major")),
  ...SUITS.flatMap(([suitLt, suitEn], s) =>
    RANKS.map(([rankLt, rankEn], r) =>
      card(`minor-${s}-${r + 1}`, `${suitLt} ${rankLt}`, `${rankEn} of ${suitEn}`, "minor"),
    ),
  ),
];

export const SPREAD_POSITIONS = ["Dabartinė situacija", "Kliūtis", "Patarimas"];

function randomInt(max: number, rand: () => number) {
  return Math.floor(rand() * max);
}

function cryptoRandom() {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return (a[0] ?? 0) / 2 ** 32;
}

/** Draws unique cards (no repeats) with positions. All printed cards remain upright. */
export function drawCards(
  positions = SPREAD_POSITIONS,
  rand: () => number = cryptoRandom,
): DrawnCard[] {
  const pool = [...DECK];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = randomInt(i + 1, rand);
    const tmp = pool[i]!;
    pool[i] = pool[j]!;
    pool[j] = tmp;
  }
  return positions.map((position, i) => ({ ...pool[i]!, position }));
}

/** RWS XII is naturally head-down; never rotate the printed artwork. */
export function cardImageRotation(): number {
  return 0;
}
