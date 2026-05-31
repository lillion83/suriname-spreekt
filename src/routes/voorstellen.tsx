import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useI18n, formatDate } from "@/lib/i18n";
import { useUser } from "@/lib/useUser";
import {
  useProposals,
  tallies,
  MODERATION_THRESHOLD,
  type ProposalStatus,
  type Proposal,
} from "@/lib/useProposals";
import { categoryLabel, type Category } from "@/data/statements";
import { Lightbulb, ThumbsUp, ThumbsDown, Send, ShieldCheck, Clock, X, Megaphone, Flame, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/voorstellen")({
  head: () => ({
    meta: [
      { title: "Populaire Voorstellen — Suriname Spreekt" },
      {
        name: "description",
        content:
          "Stel een onderwerp voor en stem op voorstellen van andere Surinamers. Populaire ideeën gaan naar moderatie en worden gepubliceerd op het platform.",
      },
      { property: "og:title", content: "Populaire Voorstellen — Suriname Spreekt" },
      {
        property: "og:description",
        content: "Stel een onderwerp voor en stem op voorstellen van andere Surinamers.",
      },
    ],
  }),
  component: ProposalsPage,
});

type Tab = "popular" | "queue" | "approved" | "published" | "rejected" | "mine";

function ProposalsPage() {
  const { t, lang } = useI18n();
  const { username } = useUser();
  const { proposals, votes, addProposal, vote } = useProposals();
  const [tab, setTab] = useState<Tab>("popular");

  const mine = useMemo(
    () => proposals.filter((p) => p.author === username && p.id.length === 36),
    [proposals, username],
  );

  const list = useMemo(() => {
    const enriched = proposals.map((p) => ({ p, ...tallies(p, votes) }));
    switch (tab) {
      case "queue":
        return enriched.filter((x) => x.support >= MODERATION_THRESHOLD && x.p.status === "pending");
      case "approved":
        return enriched.filter((x) => x.p.status === "approved");
      case "published":
        return enriched.filter((x) => x.p.status === "published");
      case "rejected":
        return enriched.filter((x) => x.p.status === "rejected");
      case "mine":
        return enriched.filter((x) => mine.some((m) => m.id === x.p.id));
      case "popular":
      default:
        return [...enriched].sort((a, b) => b.net - a.net);
    }
  }, [proposals, votes, tab, mine]);

  const tabs: { id: Tab; labelNl: string; labelEn: string }[] = [
    { id: "popular", labelNl: "Populair", labelEn: "Popular" },
    { id: "queue", labelNl: "Moderatiewachtrij", labelEn: "Moderation queue" },
    { id: "approved", labelNl: "Goedgekeurd", labelEn: "Approved" },
    { id: "published", labelNl: "Gepubliceerd", labelEn: "Published" },
    { id: "rejected", labelNl: "Afgewezen", labelEn: "Rejected" },
    { id: "mine", labelNl: "Mijn voorstellen", labelEn: "My proposals" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="border-b border-border bg-gradient-to-br from-primary/[0.06] via-background to-gold/[0.05]">
        <div className="mx-auto max-w-6xl px-4 md:px-8 py-10 md:py-16">
          <div className="flex items-center gap-2 mb-3">
            <Megaphone className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              {lang === "nl" ? "Voorstellen" : "Proposals"}
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl leading-[1.05] tracking-tight max-w-3xl">
            {lang === "nl" ? "Populaire Voorstellen." : "Popular Proposals."}
          </h1>
          <p className="mt-4 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
            {lang === "nl"
              ? "Stel een onderwerp voor en stem op ideeën van andere Surinamers. Voorstellen met meer dan " +
                MODERATION_THRESHOLD.toLocaleString("nl-NL") +
                " ondersteuners gaan automatisch naar de redactie voor moderatie."
              : "Suggest a topic and vote on ideas from other Surinamese. Proposals with more than " +
                MODERATION_THRESHOLD.toLocaleString("en-US") +
                " supporters automatically enter editorial moderation."}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 md:px-8 py-8 md:py-12 grid lg:grid-cols-5 gap-8">
        {/* Submit form */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-24">
            <SubmitForm
              onSubmit={(payload) => addProposal({ ...payload, author: username })}
              lang={lang}
            />
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-3 space-y-5">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
            {tabs.map((tb) => (
              <button
                key={tb.id}
                onClick={() => setTab(tb.id)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors",
                  tab === tb.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/30",
                )}
              >
                {lang === "nl" ? tb.labelNl : tb.labelEn}
              </button>
            ))}
          </div>

          {list.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card/60 p-10 text-center text-sm text-muted-foreground">
              {lang === "nl" ? "Nog geen voorstellen in deze categorie." : "No proposals in this category yet."}
            </div>
          ) : (
            <ul className="space-y-4">
              {list.map(({ p, support, oppose, net }) => (
                <li key={p.id}>
                  <ProposalCard
                    proposal={p}
                    support={support}
                    oppose={oppose}
                    net={net}
                    myVote={votes[p.id]}
                    onVote={(c) => vote(p.id, c)}
                    lang={lang}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

function SubmitForm({
  onSubmit,
  lang,
}: {
  onSubmit: (p: { title: string; description: string; category: Category }) => void;
  lang: "nl" | "en";
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("maatschappij");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const tt = title.trim();
    const dd = description.trim();
    if (tt.length < 5) {
      setError(lang === "nl" ? "Titel moet minstens 5 tekens zijn." : "Title must be at least 5 characters.");
      return;
    }
    if (dd.length < 15) {
      setError(
        lang === "nl"
          ? "Geef een korte beschrijving van minstens 15 tekens."
          : "Add a short description of at least 15 characters.",
      );
      return;
    }
    setError(null);
    onSubmit({ title: tt, description: dd, category });
    setTitle("");
    setDescription("");
    setDone(true);
    setTimeout(() => setDone(false), 4000);
  };

  const cats: Category[] = ["politiek", "economie", "maatschappij", "milieu"];

  return (
    <form
      onSubmit={submit}
      className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.06] via-card to-gold/[0.06] p-5 md:p-6 shadow-card-soft"
    >
      <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-primary/15 blur-3xl" />

      <div className="relative flex items-center gap-2.5 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-md">
          <Lightbulb className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-display text-lg md:text-xl leading-tight">
            {lang === "nl" ? "Stel een onderwerp voor" : "Suggest a topic"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {lang === "nl" ? "Jouw idee, jouw stem." : "Your idea, your voice."}
          </p>
        </div>
      </div>

      <div className="relative space-y-4">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
            {lang === "nl" ? "Titel" : "Title"}
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            placeholder={lang === "nl" ? "Bv. Gratis schoolboeken voor brugklas" : "E.g. Free schoolbooks for year 7"}
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <div className="mt-1 text-right text-[10px] text-muted-foreground tabular-nums">{title.length}/120</div>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
            {lang === "nl" ? "Korte beschrijving" : "Short description"}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            maxLength={400}
            placeholder={lang === "nl" ? "Leg in 1–2 zinnen uit wat je voorstelt en waarom." : "Explain in 1–2 sentences what you propose and why."}
            className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <div className="mt-1 text-right text-[10px] text-muted-foreground tabular-nums">{description.length}/400</div>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
            {lang === "nl" ? "Categorie" : "Category"}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {cats.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={cn(
                  "rounded-xl border px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all",
                  category === c
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/30",
                )}
              >
                {categoryLabel[c][lang]}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
            {error}
          </p>
        )}

        {done && (
          <p className="rounded-lg border border-success/40 bg-success/10 px-3 py-2 text-xs font-semibold text-success">
            {lang === "nl"
              ? "Bedankt! Je voorstel staat nu op 'In behandeling'."
              : "Thank you! Your proposal is now 'Pending'."}
          </p>
        )}

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-glow px-4 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-md transition-all hover:shadow-lg active:scale-[0.98]"
        >
          <Send className="h-4 w-4" />
          {lang === "nl" ? "Voorstel indienen" : "Submit proposal"}
        </button>
      </div>
    </form>
  );
}

function ProposalCard({
  proposal,
  support,
  oppose,
  net,
  myVote,
  onVote,
  lang,
}: {
  proposal: Proposal;
  support: number;
  oppose: number;
  net: number;
  myVote?: "support" | "oppose";
  onVote: (c: "support" | "oppose") => void;
  lang: "nl" | "en";
}) {
  const total = support + oppose;
  const supportPct = total === 0 ? 0 : Math.round((support / total) * 100);
  const inQueue = support >= MODERATION_THRESHOLD && proposal.status === "pending";

  return (
    <article className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-card-soft transition-all hover:shadow-elevated">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
          {categoryLabel[proposal.category][lang]}
        </span>
        <span className="text-[10px] text-muted-foreground">· {formatDate(proposal.createdAt, lang)}</span>
        <span className="text-[10px] text-muted-foreground">· {proposal.author}</span>
        <div className="ml-auto flex gap-1.5 flex-wrap justify-end">
          {inQueue && (
            <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-destructive">
              <Flame className="h-3 w-3" /> {lang === "nl" ? "In wachtrij" : "In queue"}
            </span>
          )}
          <StatusBadge status={proposal.status} lang={lang} />
        </div>
      </div>

      <h3 className="font-display text-xl md:text-2xl leading-tight">{proposal.title}</h3>
      <p className="mt-2 text-sm md:text-base leading-relaxed text-foreground/85">{proposal.description}</p>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-success">
            <ThumbsUp className="h-3.5 w-3.5" />
            {support.toLocaleString(lang === "nl" ? "nl-NL" : "en-US")}{" "}
            <span className="font-normal text-muted-foreground">
              {lang === "nl" ? "ondersteuners" : "supporters"}
            </span>
          </span>
          <span className="tabular-nums text-muted-foreground">
            {oppose.toLocaleString(lang === "nl" ? "nl-NL" : "en-US")}{" "}
            {lang === "nl" ? "tegen" : "against"}
          </span>
        </div>
        <div className="relative h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-gradient-to-r from-success to-primary transition-all duration-700"
            style={{ width: `${supportPct}%` }}
          />
        </div>
        {proposal.status === "pending" && (
          <ModerationProgress support={support} lang={lang} />
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <VoteBtn
          onClick={() => onVote("support")}
          active={myVote === "support"}
          tone="support"
          label={lang === "nl" ? "Ondersteun" : "Support"}
          icon={<ThumbsUp className="h-4 w-4" />}
        />
        <VoteBtn
          onClick={() => onVote("oppose")}
          active={myVote === "oppose"}
          tone="oppose"
          label={lang === "nl" ? "Niet ondersteunen" : "Don't support"}
          icon={<ThumbsDown className="h-4 w-4" />}
        />
      </div>

      <p className="mt-3 text-[10px] text-muted-foreground tabular-nums">
        {lang === "nl" ? "Netto steun" : "Net support"}: {net > 0 ? "+" : ""}
        {net.toLocaleString(lang === "nl" ? "nl-NL" : "en-US")}
      </p>
    </article>
  );
}

function ModerationProgress({ support, lang }: { support: number; lang: "nl" | "en" }) {
  const pct = Math.min(100, Math.round((support / MODERATION_THRESHOLD) * 100));
  if (pct >= 100) {
    return (
      <p className="flex items-center gap-1.5 text-[11px] font-semibold text-primary">
        <ShieldCheck className="h-3 w-3" />
        {lang === "nl"
          ? "Drempel bereikt — in moderatiewachtrij."
          : "Threshold reached — in moderation queue."}
      </p>
    );
  }
  return (
    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
      <span>
        {lang === "nl" ? "Moderatiedrempel" : "Moderation threshold"}: {support.toLocaleString(lang === "nl" ? "nl-NL" : "en-US")}/{MODERATION_THRESHOLD.toLocaleString(lang === "nl" ? "nl-NL" : "en-US")}
      </span>
      <span className="tabular-nums">{pct}%</span>
    </div>
  );
}

function VoteBtn({
  onClick,
  active,
  tone,
  label,
  icon,
}: {
  onClick: () => void;
  active: boolean;
  tone: "support" | "oppose";
  label: string;
  icon: React.ReactNode;
}) {
  const styles =
    tone === "support"
      ? active
        ? "border-success bg-success text-primary-foreground"
        : "border-success/30 text-success hover:bg-success hover:text-primary-foreground hover:border-success"
      : active
        ? "border-destructive bg-destructive text-destructive-foreground"
        : "border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground hover:border-destructive";
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-1.5 rounded-xl border-2 bg-background py-2.5 px-3 text-xs font-bold uppercase tracking-wider transition-all active:scale-95",
        styles,
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function StatusBadge({ status, lang }: { status: ProposalStatus; lang: "nl" | "en" }) {
  const map: Record<ProposalStatus, { nl: string; en: string; cls: string; Icon: typeof Clock }> = {
    pending: {
      nl: "In behandeling",
      en: "Pending",
      cls: "bg-muted text-muted-foreground border-border",
      Icon: Clock,
    },
    approved: {
      nl: "Goedgekeurd",
      en: "Approved",
      cls: "bg-success/15 text-success border-success/30",
      Icon: ShieldCheck,
    },
    rejected: {
      nl: "Afgewezen",
      en: "Rejected",
      cls: "bg-destructive/10 text-destructive border-destructive/30",
      Icon: X,
    },
    published: {
      nl: "Gepubliceerd",
      en: "Published",
      cls: "bg-primary/10 text-primary border-primary/30",
      Icon: Megaphone,
    },
  };
  const m = map[status];
  const Icon = m.Icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        m.cls,
      )}
    >
      <Icon className="h-3 w-3" />
      {lang === "nl" ? m.nl : m.en}
    </span>
  );
}
