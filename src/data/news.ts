import havenImg from "@/assets/news-haven.jpg.asset.json";
import rainforestImg from "@/assets/news-rainforest.jpg.asset.json";
import onderwijsImg from "@/assets/news-onderwijs.jpg.asset.json";
import parlementImg from "@/assets/news-parlement.jpg.asset.json";

export interface NewsItem {
  id: string;
  titleNl: string;
  titleEn: string;
  summaryNl: string;
  summaryEn: string;
  image: string;
  source: string;
  publishedAt: string;
  statementId: string; // links to statements.ts
}

export const news: NewsItem[] = [
  {
    id: "n-haven-investering",
    titleNl: "Nieuwe miljoeneninvestering aangekondigd voor de haven van Paramaribo",
    titleEn: "Major new investment announced for the port of Paramaribo",
    summaryNl:
      "Een internationaal consortium tekende deze week een intentieverklaring voor uitbreiding van de containercapaciteit met 60% en de bouw van een tweede aanlegsteiger. De regering verwacht 1.200 nieuwe banen in de logistieke sector binnen drie jaar.",
    summaryEn:
      "An international consortium signed a letter of intent this week for a 60% expansion of container capacity and the construction of a second pier. The government expects 1,200 new logistics jobs within three years.",
    image: havenImg.url,
    source: "De Ware Tijd",
    publishedAt: "2026-05-30",
    statementId: "kleinschalige-landbouw",
  },
  {
    id: "n-amazone-wet",
    titleNl: "DNA debatteert over wettelijke bescherming Amazoneregenwoud",
    titleEn: "National Assembly debates legal protection of the Amazon rainforest",
    summaryNl:
      "Een coalitie van milieu-organisaties presenteerde een wetsvoorstel dat 70% van het Surinaamse regenwoud onaantastbaar zou maken voor mijnbouw en houtkap. De discussie verdeelt voor- en tegenstanders langs economische lijnen.",
    summaryEn:
      "A coalition of environmental organisations presented a bill that would make 70% of Suriname's rainforest off-limits to mining and logging. The debate splits supporters and opponents along economic lines.",
    image: rainforestImg.url,
    source: "Starnieuws",
    publishedAt: "2026-05-29",
    statementId: "amazone-bescherming",
  },
  {
    id: "n-onderwijs-internet",
    titleNl: "Onderzoek: 1 op 3 scholen buiten Paramaribo zonder stabiel internet",
    titleEn: "Study: 1 in 3 schools outside Paramaribo lack stable internet",
    summaryNl:
      "Uit een nieuw onderzoek van het Nationaal Onderwijsinstituut blijkt dat duizenden leerlingen in het binnenland en de districten geen toegang hebben tot digitaal lesmateriaal. Het ministerie kondigt een nieuw programma aan.",
    summaryEn:
      "A new study by the National Education Institute shows that thousands of students in the interior and districts have no access to digital learning materials. The ministry has announced a new programme.",
    image: onderwijsImg.url,
    source: "Suriname Herald",
    publishedAt: "2026-05-28",
    statementId: "gratis-internet",
  },
  {
    id: "n-diaspora-stem",
    titleNl: "Diaspora-organisaties roepen op tot stemrecht bij verkiezingen 2030",
    titleEn: "Diaspora organisations call for voting rights in 2030 elections",
    summaryNl:
      "Surinaamse gemeenschappen in Nederland en de VS bundelen hun krachten in een petitie die nu meer dan 40.000 handtekeningen heeft. Ze eisen volwaardig stemrecht bij de eerstvolgende nationale verkiezingen.",
    summaryEn:
      "Surinamese communities in the Netherlands and the US are joining forces in a petition that has now gathered over 40,000 signatures. They demand full voting rights at the next national elections.",
    image: parlementImg.url,
    source: "NOS Caribbean",
    publishedAt: "2026-05-27",
    statementId: "diaspora-stem",
  },
];
