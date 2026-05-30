import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StatementCard } from "@/components/StatementCard";
import { useI18n } from "@/lib/i18n";
import { statements } from "@/data/statements";
import { ArrowDown, Users, Vote, Sparkles, ArrowRight } from "lucide-react";

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
  const active = statements.filter((s) => !s.closed);
  const today = active[0];
  const trending = active.filter((s) => s.trending || s.hot).slice(0, 4);
  const latest = active.slice(1, 7);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden bg-hero-radial">
        <div className="mx-auto max-w-7xl px-4 md:px-8 pt-10 pb-12 md:pt-20 md:pb-20">
          <div className="flex items-center gap-2 mb-5">
            <span className="inline-flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {t("hero.eyebrow")}
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95]">
            <span className="block">SURINAME</span>
            <span className="block bg-gradient-emerald bg-clip-text text-transparent">
              {lang === "nl" ? "SPREEKT." : "SPEAKS."}
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
            {t("hero.subtitle")}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#today"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-bold uppercase tracking-wider text-background transition-all hover:bg-primary active:scale-95"
            >
              {t("hero.cta")} <ArrowDown className="h-4 w-4" />
            </a>
            <div className="flex items-center gap-2.5 rounded-full border border-border bg-card/70 px-4 py-2 backdrop-blur">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm">
                <span className="font-bold tabular-nums">12.847</span>{" "}
                <span className="text-muted-foreground">{t("hero.voters")}</span>
              </span>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <StatTile icon={<Vote className="h-4 w-4" />} value="284.512" label={lang === "nl" ? "Stemmen totaal" : "Total votes"} />
            <StatTile icon={<Sparkles className="h-4 w-4" />} value="38" label={lang === "nl" ? "Actuele stellingen" : "Live statements"} />
            <StatTile icon={<Users className="h-4 w-4" />} value="61.302" label={lang === "nl" ? "Geregistreerd" : "Registered"} />
            <StatTile accent value="93%" label={lang === "nl" ? "Vinden hun stem belangrijk" : "Find their voice matters"} />
          </div>
        </div>
      </section>

      {/* STELLING VAN DE DAG */}
      <section id="today" className="mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-20">
        <SectionHeader title={t("section.today")} sub={t("section.today.sub")} />
        {today && (
          <StatementCard
            statement={today}
            size="xl"
            className="bg-gradient-to-br from-card via-card to-cream border-primary/20"
          />
        )}
      </section>

      {/* TRENDING */}
      <section className="border-t border-border bg-cream/40">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-20">
          <SectionHeader title={t("section.trending")} sub={t("section.trending.sub")} live />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trending.map((s) => (
              <StatementCard key={s.id} statement={s} size="sm" showContext={false} />
            ))}
          </div>
        </div>
      </section>

      {/* LAATSTE STELLINGEN */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-20">
        <SectionHeader title={t("section.latest")} sub={t("section.latest.sub")} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {latest.map((s) => (
            <StatementCard key={s.id} statement={s} />
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Link
            to="/resultaten"
            className="inline-flex items-center gap-2 rounded-full border-2 border-foreground px-6 py-3 text-sm font-bold uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors"
          >
            {lang === "nl" ? "Alle stellingen" : "All statements"} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function SectionHeader({ title, sub, live }: { title: string; sub: string; live?: boolean }) {
  const { t } = useI18n();
  return (
    <div className="flex items-end justify-between gap-4 mb-6 md:mb-8">
      <div>
        <h2 className="font-display text-3xl md:text-5xl">{title}</h2>
        <p className="mt-2 text-muted-foreground">{sub}</p>
      </div>
      {live && (
        <div className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
          <span className="inline-flex h-2 w-2 rounded-full bg-primary animate-pulse" />
          {t("hero.live")}
        </div>
      )}
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
