export type Lang = "nl" | "en";

export type Category = "politiek" | "economie" | "maatschappij" | "milieu";

export interface Statement {
  id: string;
  category: Category;
  nl: string;
  en: string;
  contextNl: string;
  contextEn: string;
  votes: { agree: number; neutral: number; disagree: number };
  hot?: boolean;
  trending?: boolean;
  closed?: boolean;
  publishedAt: string; // ISO date
}

export const statements: Statement[] = [
  {
    id: "valuta-stabiliteit",
    category: "economie",
    nl: "De SRD moet gekoppeld worden aan een sterkere buitenlandse munt om stabiliteit te garanderen.",
    en: "The SRD should be pegged to a stronger foreign currency to ensure stability.",
    contextNl:
      "Na maandenlange koersschommelingen en aanhoudende inflatie ligt het voorstel om de SRD vast te koppelen aan een sterkere buitenlandse valuta opnieuw op tafel in De Nationale Assemblée. Voorstanders wijzen op stabiliteit voor importeurs en spaarders, terwijl tegenstanders waarschuwen voor verlies van monetaire onafhankelijkheid en hogere kwetsbaarheid voor externe schokken. Welke kant kies jij?",
    contextEn:
      "After months of currency swings and persistent inflation, the proposal to peg the SRD to a stronger foreign currency is once again on the table in the National Assembly. Supporters point to stability for importers and savers, while opponents warn of losing monetary independence and higher exposure to external shocks. Which side do you choose?",
    votes: { agree: 4821, neutral: 612, disagree: 1903 },
    hot: true,
    publishedAt: "2026-05-28",
  },
  {
    id: "goudinkomsten",
    category: "economie",
    nl: "Inkomsten uit goud- en oliewinning moeten direct in een burgerfonds vloeien.",
    en: "Revenue from gold and oil mining should flow directly into a citizens' fund.",
    contextNl:
      "Naar voorbeeld van het Noorse staatsfonds zou een deel van de opbrengsten uit grondstoffen rechtstreeks ten goede komen aan elke Surinamer, in plaats van te verdwijnen in de algemene begroting.",
    contextEn:
      "Modeled after Norway's sovereign wealth fund, a share of commodity revenues would go directly to every Surinamese citizen instead of disappearing into the general budget.",
    votes: { agree: 6210, neutral: 488, disagree: 742 },
    trending: true,
    publishedAt: "2026-05-26",
  },
  {
    id: "ov-paramaribo",
    category: "maatschappij",
    nl: "Paramaribo heeft een modern openbaar vervoersnetwerk nodig met vaste dienstregelingen.",
    en: "Paramaribo needs a modern public transport network with fixed schedules.",
    contextNl: "Verkeersdrukte in en rond de hoofdstad groeit jaarlijks met dubbele cijfers.",
    contextEn: "Traffic congestion in and around the capital grows by double digits each year.",
    votes: { agree: 3120, neutral: 410, disagree: 280 },
    publishedAt: "2026-05-24",
  },
  {
    id: "amazone-bescherming",
    category: "milieu",
    nl: "Het Amazoneregenwoud in Suriname moet wettelijk onaantastbaar worden verklaard.",
    en: "The Amazon rainforest in Suriname should be declared legally untouchable.",
    contextNl: "Suriname is voor 93% bedekt door regenwoud — het hoogste percentage ter wereld.",
    contextEn: "Suriname is 93% covered by rainforest — the highest percentage in the world.",
    votes: { agree: 5102, neutral: 220, disagree: 612 },
    hot: true,
    publishedAt: "2026-05-22",
  },
  {
    id: "diaspora-stem",
    category: "politiek",
    nl: "Surinamers in de diaspora moeten kunnen stemmen bij nationale verkiezingen.",
    en: "Surinamese in the diaspora should be able to vote in national elections.",
    contextNl: "De discussie over diaspora-stemrecht speelt al sinds 2010.",
    contextEn: "The debate around diaspora voting rights has been ongoing since 2010.",
    votes: { agree: 2840, neutral: 720, disagree: 1980 },
    publishedAt: "2026-05-20",
  },
  {
    id: "onderwijs-talen",
    category: "maatschappij",
    nl: "Sranantongo moet een verplicht vak worden in het basisonderwijs.",
    en: "Sranantongo should be a mandatory subject in primary education.",
    contextNl: "Culturele organisaties pleiten voor erkenning van Sranantongo als nationale taal.",
    contextEn: "Cultural organisations advocate recognising Sranantongo as a national language.",
    votes: { agree: 3902, neutral: 540, disagree: 820 },
    trending: true,
    publishedAt: "2026-05-18",
  },
  {
    id: "kabinet-jongeren",
    category: "politiek",
    nl: "Een vast percentage van de regering moet onder de 35 jaar zijn.",
    en: "A fixed percentage of the government should be under 35 years old.",
    contextNl: "Jongerenraden in Paramaribo en Nickerie vragen meer vertegenwoordiging.",
    contextEn: "Youth councils in Paramaribo and Nickerie demand more representation.",
    votes: { agree: 2210, neutral: 690, disagree: 1410 },
    publishedAt: "2026-05-16",
  },
  {
    id: "kleinschalige-landbouw",
    category: "economie",
    nl: "De staat moet kleinschalige boeren prioriteren boven grote agro-import.",
    en: "The state should prioritise small-scale farmers over large agro-imports.",
    contextNl: "Het voedselzekerheidsdebat laaide op na recente prijsstijgingen.",
    contextEn: "The food security debate intensified after recent price hikes.",
    votes: { agree: 4502, neutral: 380, disagree: 510 },
    publishedAt: "2026-05-14",
  },
  {
    id: "kustbescherming",
    category: "milieu",
    nl: "Suriname moet jaarlijks 1% van het BBP investeren in kustbescherming.",
    en: "Suriname should invest 1% of GDP annually in coastal protection.",
    contextNl: "De stijgende zeespiegel bedreigt 80% van de bevolking die langs de kust woont.",
    contextEn: "Rising sea levels threaten the 80% of the population living along the coast.",
    votes: { agree: 5910, neutral: 410, disagree: 320 },
    closed: true,
    publishedAt: "2026-04-30",
  },
  {
    id: "gratis-internet",
    category: "maatschappij",
    nl: "Elke school moet gratis snel internet krijgen, gefinancierd door de staat.",
    en: "Every school should get free fast internet, funded by the state.",
    contextNl: "Een derde van de scholen buiten Paramaribo heeft geen stabiele verbinding.",
    contextEn: "A third of schools outside Paramaribo lack a stable connection.",
    votes: { agree: 7102, neutral: 240, disagree: 380 },
    closed: true,
    publishedAt: "2026-04-15",
  },
];

export const categoryLabel: Record<Category, { nl: string; en: string }> = {
  politiek: { nl: "Politiek", en: "Politics" },
  economie: { nl: "Economie", en: "Economy" },
  maatschappij: { nl: "Maatschappij", en: "Society" },
  milieu: { nl: "Milieu", en: "Environment" },
};

export const seedComments: Record<string, { user: string; nl: string; en: string; at: string }[]> = {
  "valuta-stabiliteit": [
    {
      user: "Anand R.",
      nl: "Een vaste koppeling klinkt veilig, maar wij verliezen dan al onze beleidsruimte. Riskant.",
      en: "A fixed peg sounds safe, but we'd lose all our policy room. Risky.",
      at: "2026-05-29T10:14:00Z",
    },
    {
      user: "Sharmila K.",
      nl: "Mijn spaargeld smelt weg. Stabiliteit nu, hervormingen later.",
      en: "My savings are melting. Stability now, reforms later.",
      at: "2026-05-29T13:02:00Z",
    },
    {
      user: "Roy A.",
      nl: "Eerst de begroting op orde. Daarna pas praten over koppeling.",
      en: "First fix the budget. Then talk about pegging.",
      at: "2026-05-30T08:41:00Z",
    },
  ],
  "goudinkomsten": [
    {
      user: "Mireille D.",
      nl: "Een burgerfonds is precies wat we nodig hebben. Geen excuses meer.",
      en: "A citizens' fund is exactly what we need. No more excuses.",
      at: "2026-05-27T09:20:00Z",
    },
  ],
};

export function getStatement(id: string) {
  return statements.find((s) => s.id === id);
}
