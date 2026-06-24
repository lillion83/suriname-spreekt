import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useI18n } from "@/lib/i18n";
import { statements, categoryLabel, seedComments, type Category } from "@/data/statements";
import { useMemo } from "react";
import {
  Activity,
  MessageSquare,
  Vote,
  Users,
  TrendingUp,
  TrendingDown,
  Flame,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "De Opinie Index van Suriname — Suriname Spreekt" },
      {
        name: "description",
        content:
          "Het officiële dashboard met live analyses van stemmen, discussies, sentiment en trends in Suriname.",
      },
      { property: "og:title", content: "De Opinie Index van Suriname" },
      {
        property: "og:description",
        content: "Realtime business intelligence over wat Suriname denkt.",
      },
    ],
  }),
  component: DashboardPage,
});

const REF_NOW = Date.now();
const DAY = 86400000;

function totalVotes(s: (typeof statements)[number]) {
  return s.votes.agree + s.votes.neutral + s.votes.disagree;
}

function sentimentScore(s: (typeof statements)[number]) {
  const t = totalVotes(s);
  if (!t) return 0;
  return ((s.votes.agree - s.votes.disagree) / t) * 100;
}

function DashboardPage() {
  const { t, lang } = useI18n();

  const data = useMemo(() => {
    const totalAllVotes = statements.reduce((a, s) => a + totalVotes(s), 0);
    const activeDiscussions = statements.filter((s) => !s.closed).length;
    // estimate active voters as ~62% of total votes (deterministic)
    const activeVoters = Math.round(totalAllVotes * 0.62);
    const totalComments =
      Object.values(seedComments).reduce((a, c) => a + c.length, 0) +
      Math.round(totalAllVotes * 0.018);

    // Average sentiment weighted by votes
    const weighted =
      statements.reduce((acc, s) => acc + sentimentScore(s) * totalVotes(s), 0) /
      Math.max(1, totalAllVotes);

    // Top this week (within 7 days of REF_NOW)
    const weekly = [...statements]
      .filter((s) => REF_NOW - new Date(s.publishedAt).getTime() <= 7 * DAY)
      .sort((a, b) => totalVotes(b) - totalVotes(a))
      .slice(0, 5);

    // Top this month (within 31 days)
    const monthly = [...statements]
      .filter((s) => REF_NOW - new Date(s.publishedAt).getTime() <= 31 * DAY)
      .sort((a, b) => totalVotes(b) - totalVotes(a))
      .slice(0, 5);

    // Growth: votes per week over last 8 weeks (bucket by publishedAt week)
    const weeks: { label: string; votes: number; discussions: number }[] = [];
    for (let i = 7; i >= 0; i--) {
      const end = REF_NOW - i * 7 * DAY;
      const start = end - 7 * DAY;
      const inBucket = statements.filter((s) => {
        const ts = new Date(s.publishedAt).getTime();
        return ts > start && ts <= end;
      });
      // simulate growth curve: cumulative effect
      const baseVotes = inBucket.reduce((a, s) => a + totalVotes(s), 0);
      const decay = Math.pow(0.82, i);
      weeks.push({
        label: `W-${i}`,
        votes: Math.round(baseVotes * (0.4 + decay * 0.9) + 1200 * (8 - i)),
        discussions: inBucket.length + Math.max(0, 6 - i),
      });
    }

    // Categories
    const catTotals: Record<Category, { votes: number; count: number; sentiment: number }> = {
      politiek: { votes: 0, count: 0, sentiment: 0 },
      economie: { votes: 0, count: 0, sentiment: 0 },
      maatschappij: { votes: 0, count: 0, sentiment: 0 },
      milieu: { votes: 0, count: 0, sentiment: 0 },
    };
    for (const s of statements) {
      const tv = totalVotes(s);
      catTotals[s.category].votes += tv;
      catTotals[s.category].count += 1;
      catTotals[s.category].sentiment += sentimentScore(s) * tv;
    }
    const categories = (Object.keys(catTotals) as Category[])
      .map((c) => ({
        key: c,
        votes: catTotals[c].votes,
        count: catTotals[c].count,
        sentiment: catTotals[c].votes ? catTotals[c].sentiment / catTotals[c].votes : 0,
      }))
      .sort((a, b) => b.votes - a.votes);

    // Week over week growth
    const last = weeks[weeks.length - 1].votes;
    const prev = weeks[weeks.length - 2].votes || 1;
    const growthPct = ((last - prev) / prev) * 100;

    return {
      totalAllVotes,
      activeDiscussions,
      activeVoters,
      totalComments,
      avgSentiment: weighted,
      weekly,
      monthly,
      weeks,
      categories,
      growthPct,
    };
  }, []);

  const fmt = (n: number) =>
    n.toLocaleString(lang === "nl" ? "nl-NL" : "en-US");

  const sentimentLabel =
    data.avgSentiment > 15
      ? lang === "nl" ? "Positief" : "Positive"
      : data.avgSentiment < -15
        ? lang === "nl" ? "Negatief" : "Negative"
        : lang === "nl" ? "Neutraal" : "Neutral";

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />

      <main className="mx-auto max-w-7xl px-4 md:px-8 py-8 md:py-12">
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary mb-3">
              <Sparkles className="h-3 w-3" />
              {lang === "nl" ? "Live data" : "Live data"}
            </div>
            <h1 className="font-display text-3xl md:text-5xl tracking-tight leading-[0.95]">
              {lang === "nl" ? "De Opinie Index" : "The Opinion Index"}
              <br />
              <span className="text-primary-glow">
                {lang === "nl" ? "van Suriname" : "of Suriname"}
              </span>
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              {lang === "nl"
                ? "Realtime analyse van alle stemmen, discussies en sentiment op het platform."
                : "Real-time analysis of every vote, discussion and sentiment on the platform."}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            {lang === "nl" ? "Bijgewerkt zojuist" : "Updated just now"}
          </div>
        </div>

        {/* KPI Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-10">
          <KpiCard
            icon={Users}
            label={lang === "nl" ? "Actieve stemmers" : "Active voters"}
            value={fmt(data.activeVoters)}
            delta="+8.4%"
            positive
          />
          <KpiCard
            icon={Activity}
            label={lang === "nl" ? "Actieve discussies" : "Active discussions"}
            value={fmt(data.activeDiscussions)}
            delta="+2"
            positive
          />
          <KpiCard
            icon={Vote}
            label={lang === "nl" ? "Totaal stemmen" : "Total votes"}
            value={fmt(data.totalAllVotes)}
            delta={`${data.growthPct >= 0 ? "+" : ""}${data.growthPct.toFixed(1)}%`}
            positive={data.growthPct >= 0}
          />
          <KpiCard
            icon={MessageSquare}
            label={lang === "nl" ? "Totaal reacties" : "Total comments"}
            value={fmt(data.totalComments)}
            delta="+12.1%"
            positive
          />
        </section>

        {/* Main bento */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 mb-6">
          {/* Growth chart - 2 cols */}
          <Card className="lg:col-span-2 p-5 md:p-6">
            <CardHeader
              title={lang === "nl" ? "Groei van discussies" : "Discussion growth"}
              sub={lang === "nl" ? "Stemmen per week — laatste 8 weken" : "Votes per week — last 8 weeks"}
              right={
                <div
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold",
                    data.growthPct >= 0
                      ? "bg-success/10 text-success"
                      : "bg-destructive/10 text-destructive",
                  )}
                >
                  {data.growthPct >= 0 ? (
                    <TrendingUp className="h-3.5 w-3.5" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5" />
                  )}
                  {data.growthPct >= 0 ? "+" : ""}
                  {data.growthPct.toFixed(1)}%
                </div>
              }
            />
            <GrowthChart weeks={data.weeks} />
          </Card>

          {/* Sentiment */}
          <Card className="p-5 md:p-6">
            <CardHeader
              title={lang === "nl" ? "Gemiddeld sentiment" : "Average sentiment"}
              sub={lang === "nl" ? "Gewogen naar stemvolume" : "Weighted by vote volume"}
            />
            <SentimentGauge value={data.avgSentiment} label={sentimentLabel} />
            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              <SentimentChip
                tone="negative"
                label={lang === "nl" ? "Negatief" : "Negative"}
                active={data.avgSentiment < -15}
              />
              <SentimentChip
                tone="neutral"
                label={lang === "nl" ? "Neutraal" : "Neutral"}
                active={Math.abs(data.avgSentiment) <= 15}
              />
              <SentimentChip
                tone="positive"
                label={lang === "nl" ? "Positief" : "Positive"}
                active={data.avgSentiment > 15}
              />
            </div>
          </Card>
        </section>

        {/* Topics + Categories */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 mb-6">
          {/* Weekly */}
          <Card className="p-5 md:p-6">
            <CardHeader
              title={lang === "nl" ? "Top deze week" : "Top this week"}
              sub={lang === "nl" ? "Meest besproken stellingen" : "Most discussed statements"}
              icon={<Flame className="h-4 w-4 text-gold" />}
            />
            <TopicList items={data.weekly} lang={lang} />
          </Card>

          {/* Monthly */}
          <Card className="p-5 md:p-6">
            <CardHeader
              title={lang === "nl" ? "Top deze maand" : "Top this month"}
              sub={lang === "nl" ? "Cumulatief stemvolume" : "Cumulative vote volume"}
              icon={<TrendingUp className="h-4 w-4 text-primary-glow" />}
            />
            <TopicList items={data.monthly} lang={lang} />
          </Card>

          {/* Categories */}
          <Card className="p-5 md:p-6">
            <CardHeader
              title={lang === "nl" ? "Categorieën" : "Categories"}
              sub={lang === "nl" ? "Aandeel van het debat" : "Share of debate"}
            />
            <CategoryBars
              cats={data.categories}
              total={data.totalAllVotes}
              lang={lang}
            />
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/* ───────── components ───────── */

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card shadow-card-soft",
        className,
      )}
    >
      {children}
    </div>
  );
}

function CardHeader({
  title,
  sub,
  right,
  icon,
}: {
  title: string;
  sub?: string;
  right?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 mb-5">
      <div>
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="font-display text-lg tracking-tight">{title}</h2>
        </div>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  delta,
  positive,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  delta: string;
  positive: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 md:p-5 shadow-card-soft">
      <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-primary/5 blur-2xl" />
      <div className="relative flex items-start justify-between">
        <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <Icon className="h-4 w-4" />
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-0.5 text-[11px] font-bold rounded-full px-2 py-0.5",
            positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
          )}
        >
          {positive ? <ArrowUpRight className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {delta}
        </span>
      </div>
      <div className="mt-4">
        <div className="font-display text-2xl md:text-3xl tracking-tight tabular-nums">{value}</div>
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mt-1">
          {label}
        </div>
      </div>
    </div>
  );
}

function GrowthChart({ weeks }: { weeks: { label: string; votes: number; discussions: number }[] }) {
  const W = 600;
  const H = 200;
  const pad = { l: 8, r: 8, t: 12, b: 22 };
  const max = Math.max(...weeks.map((w) => w.votes));
  const min = Math.min(...weeks.map((w) => w.votes));
  const range = Math.max(1, max - min);
  const stepX = (W - pad.l - pad.r) / (weeks.length - 1);

  const pts = weeks.map((w, i) => {
    const x = pad.l + i * stepX;
    const y = pad.t + (1 - (w.votes - min) / range) * (H - pad.t - pad.b);
    return { x, y, ...w };
  });

  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = `${path} L${pts[pts.length - 1].x},${H - pad.b} L${pts[0].x},${H - pad.b} Z`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="none">
        <defs>
          <linearGradient id="growthFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--primary-glow)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--primary-glow)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid */}
        {[0.25, 0.5, 0.75].map((g) => (
          <line
            key={g}
            x1={pad.l}
            x2={W - pad.r}
            y1={pad.t + g * (H - pad.t - pad.b)}
            y2={pad.t + g * (H - pad.t - pad.b)}
            stroke="var(--border)"
            strokeDasharray="2 4"
          />
        ))}
        <path d={area} fill="url(#growthFill)" />
        <path
          d={path}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="var(--primary)" />
        ))}
        {pts.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={H - 6}
            textAnchor="middle"
            fontSize="10"
            fill="var(--muted-foreground)"
          >
            {p.label}
          </text>
        ))}
      </svg>
    </div>
  );
}

function SentimentGauge({ value, label }: { value: number; label: string }) {
  // value range -100..100
  const pct = (value + 100) / 2; // 0..100
  return (
    <div>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-4xl tracking-tight tabular-nums">
          {value >= 0 ? "+" : ""}
          {value.toFixed(1)}
        </span>
        <span className="text-xs uppercase tracking-wider font-bold text-muted-foreground">
          / 100
        </span>
      </div>
      <div className="mt-1 text-sm font-semibold text-primary">{label}</div>
      <div className="relative mt-4 h-2.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-destructive via-gold to-success"
          style={{ width: "100%" }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-foreground border-2 border-background shadow-md"
          style={{ left: `calc(${pct}% - 8px)` }}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
        <span>-100</span>
        <span>0</span>
        <span>+100</span>
      </div>
    </div>
  );
}

function SentimentChip({
  tone,
  label,
  active,
}: {
  tone: "positive" | "neutral" | "negative";
  label: string;
  active: boolean;
}) {
  const styles: Record<string, string> = {
    positive: active ? "bg-success/15 text-success border-success/30" : "border-border text-muted-foreground",
    neutral: active ? "bg-gold/20 text-gold-foreground border-gold/40" : "border-border text-muted-foreground",
    negative: active ? "bg-destructive/15 text-destructive border-destructive/30" : "border-border text-muted-foreground",
  };
  return (
    <div className={cn("rounded-lg border px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider", styles[tone])}>
      {label}
    </div>
  );
}

function TopicList({
  items,
  lang,
}: {
  items: typeof statements;
  lang: "nl" | "en";
}) {
  const max = Math.max(1, ...items.map(totalVotes));
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {lang === "nl" ? "Geen data voor deze periode." : "No data for this period."}
      </p>
    );
  }
  return (
    <ol className="space-y-3">
      {items.map((s, i) => {
        const tv = totalVotes(s);
        const pct = (tv / max) * 100;
        return (
          <li key={s.id}>
            <Link
              to="/discussie/$id"
              params={{ id: s.id }}
              className="group block"
            >
              <div className="flex items-center gap-3">
                <span className="font-display text-sm w-5 text-muted-foreground tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {lang === "nl" ? s.nl : s.en}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold tabular-nums text-muted-foreground">
                      {tv.toLocaleString(lang === "nl" ? "nl-NL" : "en-US")}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

function CategoryBars({
  cats,
  total,
  lang,
}: {
  cats: { key: Category; votes: number; count: number; sentiment: number }[];
  total: number;
  lang: "nl" | "en";
}) {
  return (
    <div className="space-y-4">
      {cats.map((c) => {
        const pct = total ? (c.votes / total) * 100 : 0;
        return (
          <div key={c.key}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">{categoryLabel[c.key][lang]}</span>
              <span className="tabular-nums text-muted-foreground text-xs">
                {pct.toFixed(1)}%
              </span>
            </div>
            <div className="mt-1.5 h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="mt-1 flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
              <span>
                {c.count} {lang === "nl" ? "stellingen" : "statements"}
              </span>
              <span
                className={cn(
                  c.sentiment > 15
                    ? "text-success"
                    : c.sentiment < -15
                      ? "text-destructive"
                      : "text-muted-foreground",
                )}
              >
                {c.sentiment >= 0 ? "+" : ""}
                {c.sentiment.toFixed(0)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
