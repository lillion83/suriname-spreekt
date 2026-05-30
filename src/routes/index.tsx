import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { StatementCard } from "@/components/StatementCard";
import { useI18n } from "@/lib/i18n";
import { statements } from "@/data/statements";
import { ArrowDown, Users, Vote, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Suriname Spreekt — Stem op actuele stellingen" },
      { name: "description", content: "Het onafhankelijke platform waar Surinamers stemmen op stellingen over politiek, economie en samenleving." },
    ],
  }),
  component: Index,
});

function Index() {
  const { t, lang } = useI18n();
  const [first, second, third, fourth, ...rest] = statements;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden bg-hero-radial">
        <div className="mx-auto max-w-7xl px-4 md:px-8 pt-12 pb-16 md:pt-20 md:pb-24">
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {t("hero.eyebrow")}
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95]">
            <span className="block">{lang === "nl" ? "SURINAME" : "SURINAME"}</span>
            <span className="block bg-gradient-emerald bg-clip-text text-transparent">
              {lang === "nl" ? "SPREEKT." : "SPEAKS."}
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
            {t("hero.subtitle")}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#trending"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-bold uppercase tracking-wider text-background transition-all hover:bg-primary active:scale-95"
            >
              {t("hero.cta")} <ArrowDown className="h-4 w-4" />
            </a>
            <div className="flex items-center gap-3 rounded-full border border-border bg-card/60 px-4 py-2 backdrop-blur">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm">
                <span className="font-bold tabular-nums">12.847</span>{" "}
                <span className="text-muted-foreground">{t("hero.voters")}</span>
              </span>
            </div>
          </div>

          {/* live stat strip */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <StatTile icon={<Vote className="h-4 w-4" />} value="284.512" label={lang === "nl" ? "Stemmen totaal" : "Total votes"} />
            <StatTile icon={<Sparkles className="h-4 w-4" />} value="38" label={lang === "nl" ? "Actuele stellingen" : "Live statements"} />
            <StatTile icon={<Users className="h-4 w-4" />} value="61.302" label={lang === "nl" ? "Geregistreerde stemmers" : "Registered voters"} />
            <StatTile accent value="93%" label={lang === "nl" ? "Vinden hun stem belangrijk" : "Find their voice matters"} />
          </div>
        </div>
      </section>

      {/* BENTO GRID */}
      <section id="trending" className="mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-24">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-3xl md:text-5xl">{t("section.trending")}</h2>
            <p className="mt-2 text-muted-foreground">{t("section.trending.sub")}</p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <span className="inline-flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            {t("hero.live")}
          </div>
        </div>

        {/* Mobile: simple stack. Desktop: bento */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-5 auto-rows-auto">
          <StatementCard statement={first} size="lg" className="md:col-span-4 md:row-span-2 bg-gradient-to-br from-card to-cream" />
          <StatementCard statement={second} className="md:col-span-2" />
          <StatementCard statement={third} className="md:col-span-2" />

          <StatementCard statement={fourth} size="lg" className="md:col-span-3 md:row-span-2 bg-gradient-to-br from-card to-accent/40" />
          {rest.slice(0, 1).map((s) => (
            <StatementCard key={s.id} statement={s} className="md:col-span-3" />
          ))}
          {rest.slice(1, 2).map((s) => (
            <StatementCard key={s.id} statement={s} className="md:col-span-3" />
          ))}

          {rest.slice(2).map((s) => (
            <StatementCard key={s.id} statement={s} className="md:col-span-3" />
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="border-t border-border bg-cream">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {lang === "nl" ? "Over het platform" : "About the platform"}
            </span>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">
              {lang === "nl" ? "Eén stem. Eén stem. Heel Suriname." : "One voice. One vote. All of Suriname."}
            </h2>
          </div>
          <div className="space-y-4 text-muted-foreground text-base leading-relaxed">
            <p>
              {lang === "nl"
                ? "Suriname Spreekt is een onafhankelijk burgerplatform. Geen politieke kleur, geen agenda — alleen de stem van het volk. Anoniem, snel en transparant."
                : "Suriname Spreekt is an independent citizen platform. No political colour, no agenda — only the voice of the people. Anonymous, fast and transparent."}
            </p>
            <p>
              {lang === "nl"
                ? "Elke week voegen we nieuwe stellingen toe op basis van wat er speelt in De Nationale Assemblée, de media en op straat."
                : "Each week we add new statements based on what's happening in the National Assembly, the media and on the streets."}
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-emerald">
              <span className="font-display text-sm text-primary-foreground">SS</span>
            </div>
            <div>
              <div className="font-display text-sm">SURINAME SPREEKT</div>
              <div className="text-xs text-muted-foreground">{t("footer.tagline")}</div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Suriname Spreekt — {t("footer.rights")}
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatTile({
  icon,
  value,
  label,
  accent,
}: {
  icon?: React.ReactNode;
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div
      className={
        accent
          ? "rounded-2xl bg-gradient-emerald p-4 text-primary-foreground shadow-elevated"
          : "rounded-2xl border border-border bg-card p-4 shadow-card-soft"
      }
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider opacity-80">
        {icon}
        <span className="truncate">{label}</span>
      </div>
      <div className="mt-2 font-display text-2xl md:text-3xl tabular-nums">{value}</div>
    </div>
  );
}
