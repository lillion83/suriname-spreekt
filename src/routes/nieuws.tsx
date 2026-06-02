import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StatementCard } from "@/components/StatementCard";
import { useI18n, formatDate } from "@/lib/i18n";
import { news } from "@/data/news";
import { getStatement } from "@/data/statements";
import { Newspaper, ArrowRight, Radio } from "lucide-react";

export const Route = createFileRoute("/nieuws")({
  head: () => ({
    meta: [
      { title: "Nieuws & stellingen — Suriname Spreekt" },
      {
        name: "description",
        content:
          "Lees het laatste nieuws over Suriname en stem direct op de bijbehorende stelling. Realtime opinie van het volk.",
      },
      { property: "og:title", content: "Nieuws & stellingen — Suriname Spreekt" },
      {
        property: "og:description",
        content: "Nieuws gekoppeld aan stellingen. Direct stemmen, direct resultaat.",
      },
    ],
  }),
  component: NewsPage,
});

function NewsPage() {
  const { lang } = useI18n();
  const [hero, ...rest] = news;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />

      <main className="mx-auto max-w-7xl px-4 md:px-8 py-8 md:py-12">
        {/* Page header */}
        <div className="mb-10 md:mb-14 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary mb-4">
            <Radio className="h-3 w-3" />
            {lang === "nl" ? "Nieuws & opinie" : "News & opinion"}
          </div>
          <h1 className="font-display text-4xl md:text-6xl leading-[0.95] tracking-tight">
            {lang === "nl" ? "Het nieuws.\n" : "The news.\n"}
            <span className="text-primary-glow">
              {lang === "nl" ? "Jouw stem." : "Your voice."}
            </span>
          </h1>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl">
            {lang === "nl"
              ? "Iedere headline komt met een stelling. Lees, vorm je mening en stem direct — zonder de pagina te verlaten."
              : "Every headline comes with a statement. Read, form your opinion and vote instantly — without leaving the page."}
          </p>
        </div>

        {/* Hero feature */}
        <NewsFeature item={hero} featured />

        {/* Rest */}
        <div className="mt-10 grid grid-cols-1 gap-10">
          {rest.map((n) => (
            <NewsFeature key={n.id} item={n} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function NewsFeature({
  item,
  featured = false,
}: {
  item: (typeof news)[number];
  featured?: boolean;
}) {
  const { lang, t } = useI18n();
  const statement = getStatement(item.statementId);
  if (!statement) return null;

  const title = lang === "nl" ? item.titleNl : item.titleEn;
  const summary = lang === "nl" ? item.summaryNl : item.summaryEn;

  return (
    <article className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-7">
      {/* News column */}
      <div className="lg:col-span-7 flex flex-col">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-card-soft group">
          <div className={featured ? "aspect-[16/9]" : "aspect-[16/10]"}>
            <img
              src={item.image}
              alt={title}
              loading={featured ? "eager" : "lazy"}
              width={1024}
              height={640}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </div>
          <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-background/90 backdrop-blur px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
            <Newspaper className="h-3 w-3 text-primary" />
            {item.source}
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            <span>{formatDate(item.publishedAt, lang)}</span>
            <span>·</span>
            <span>{item.source}</span>
          </div>
          <h2
            className={
              featured
                ? "mt-2 font-display text-3xl md:text-4xl lg:text-5xl leading-[1.02] tracking-tight"
                : "mt-2 font-display text-2xl md:text-3xl leading-[1.05] tracking-tight"
            }
          >
            {title}
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">{summary}</p>
        </div>
      </div>

      {/* Linked statement column */}
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-24">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              {lang === "nl" ? "Gerelateerde stelling" : "Related statement"}
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <StatementCard
            statement={statement}
            size="md"
            showContext={false}
            showDiscussLink={false}
            className="bg-gradient-to-br from-card to-secondary/40"
          />

          <Link
            to="/discussie/$id"
            params={{ id: statement.id }}
            className="mt-3 inline-flex items-center justify-between w-full rounded-xl border border-dashed border-border px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary hover:border-primary transition-colors group"
          >
            <span>{lang === "nl" ? "Lees het volledige debat" : "Read the full debate"}</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
