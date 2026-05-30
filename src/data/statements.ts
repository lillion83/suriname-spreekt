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
}

export const statements: Statement[] = [
  {
    id: "valuta-stabiliteit",
    category: "economie",
    nl: "De SRD moet gekoppeld worden aan een sterkere buitenlandse munt om stabiliteit te garanderen.",
    en: "The SRD should be pegged to a stronger foreign currency to ensure stability.",
    contextNl: "Voorstel besproken in De Nationale Assemblée na aanhoudende inflatie.",
    contextEn: "Proposal discussed in the National Assembly after persistent inflation.",
    votes: { agree: 4821, neutral: 612, disagree: 1903 },
    hot: true,
  },
  {
    id: "goudinkomsten",
    category: "economie",
    nl: "Inkomsten uit goud- en oliewinning moeten direct in een burgerfonds vloeien.",
    en: "Revenue from gold and oil mining should flow directly into a citizens' fund.",
    contextNl: "Inspiratie uit het Noorse staatsfondsmodel.",
    contextEn: "Inspired by the Norwegian sovereign wealth fund model.",
    votes: { agree: 6210, neutral: 488, disagree: 742 },
    trending: true,
  },
  {
    id: "ov-paramaribo",
    category: "maatschappij",
    nl: "Paramaribo heeft een modern openbaar vervoersnetwerk nodig met vaste dienstregelingen.",
    en: "Paramaribo needs a modern public transport network with fixed schedules.",
    contextNl: "Verkeersdrukte groeit jaarlijks met dubbele cijfers.",
    contextEn: "Traffic congestion grows by double digits annually.",
    votes: { agree: 3120, neutral: 410, disagree: 280 },
  },
  {
    id: "amazone-bescherming",
    category: "milieu",
    nl: "Het Amazoneregenwoud in Suriname moet wettelijk onaantastbaar worden verklaard.",
    en: "The Amazon rainforest in Suriname should be declared legally untouchable.",
    contextNl: "Suriname is voor 93% bedekt door regenwoud.",
    contextEn: "Suriname is 93% covered by rainforest.",
    votes: { agree: 5102, neutral: 220, disagree: 612 },
    hot: true,
  },
  {
    id: "diaspora-stem",
    category: "politiek",
    nl: "Surinamers in de diaspora moeten kunnen stemmen bij nationale verkiezingen.",
    en: "Surinamese in the diaspora should be able to vote in national elections.",
    contextNl: "Discussie speelt al sinds 2010.",
    contextEn: "A debate ongoing since 2010.",
    votes: { agree: 2840, neutral: 720, disagree: 1980 },
  },
  {
    id: "onderwijs-talen",
    category: "maatschappij",
    nl: "Sranantongo moet een verplicht vak worden in het basisonderwijs.",
    en: "Sranantongo should be a mandatory subject in primary education.",
    contextNl: "Pleidooi vanuit culturele organisaties.",
    contextEn: "Advocated by cultural organisations.",
    votes: { agree: 3902, neutral: 540, disagree: 820 },
    trending: true,
  },
  {
    id: "kabinet-jongeren",
    category: "politiek",
    nl: "Een vast percentage van de regering moet onder de 35 jaar zijn.",
    en: "A fixed percentage of the government should be under 35 years old.",
    contextNl: "Jongerenraden vragen meer vertegenwoordiging.",
    contextEn: "Youth councils demand more representation.",
    votes: { agree: 2210, neutral: 690, disagree: 1410 },
  },
  {
    id: "kleinschalige-landbouw",
    category: "economie",
    nl: "De staat moet kleinschalige boeren prioriteren boven grote agro-import.",
    en: "The state should prioritise small-scale farmers over large agro-imports.",
    contextNl: "Voedselzekerheidsdebat na prijsstijgingen.",
    contextEn: "Food security debate after price increases.",
    votes: { agree: 4502, neutral: 380, disagree: 510 },
  },
];

export const categoryLabel: Record<Category, { nl: string; en: string }> = {
  politiek: { nl: "Politiek", en: "Politics" },
  economie: { nl: "Economie", en: "Economy" },
  maatschappij: { nl: "Maatschappij", en: "Society" },
  milieu: { nl: "Milieu", en: "Environment" },
};
