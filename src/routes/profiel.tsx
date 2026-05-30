import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useI18n, formatDate, type DictKey } from "@/lib/i18n";
import { useUser } from "@/lib/useUser";
import { getStatement, categoryLabel } from "@/data/statements";
import { useState } from "react";
import { Award, Vote, MessageSquare, Calendar, Edit2, Check, X, Lock, ThumbsUp, ThumbsDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profiel")({
  head: () => ({
    meta: [
      { title: "Profiel — Suriname Spreekt" },
      { name: "description", content: "Bekijk je stemmen, reacties en behaalde badges." },
    ],
  }),
  component: ProfielPage,
});

interface BadgeDef {
  key: string;
  labelKey: DictKey;
  descKey: DictKey;
  unlocked: boolean;
}

function ProfielPage() {
  const { t, lang } = useI18n();
  const { votes, comments, username, joined, updateName } = useUser();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(username);

  const voteCount = Object.keys(votes).length;
  const commentCount = comments.length;

  const badges: BadgeDef[] = [
    { key: "first", labelKey: "badge.first", descKey: "badge.first.desc", unlocked: voteCount >= 1 },
    { key: "engaged", labelKey: "badge.engaged", descKey: "badge.engaged.desc", unlocked: voteCount >= 5 },
    { key: "veteran", labelKey: "badge.veteran", descKey: "badge.veteran.desc", unlocked: voteCount >= 10 },
    { key: "voice", labelKey: "badge.voice", descKey: "badge.voice.desc", unlocked: commentCount >= 1 },
  ];

  const recentVotes = Object.entries(votes)
    .map(([id, choice]) => ({ statement: getStatement(id), choice }))
    .filter((x) => x.statement)
    .slice(-6)
    .reverse();

  const startEdit = () => {
    setDraft(username);
    setEditing(true);
  };
  const saveEdit = () => {
    const v = draft.trim();
    if (v) updateName(v);
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="border-b border-border bg-hero-radial">
        <div className="mx-auto max-w-5xl px-4 md:px-8 py-10 md:py-16">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{t("profile.title")}</span>
          <div className="mt-4 flex items-center gap-5">
            <div className="flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-gradient-emerald font-display text-2xl md:text-3xl text-primary-foreground shadow-elevated">
              {initials(username)}
            </div>
            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="flex items-center gap-2">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    maxLength={40}
                    className="font-display text-2xl md:text-4xl bg-transparent border-b-2 border-primary outline-none w-full"
                    autoFocus
                  />
                  <button onClick={saveEdit} className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center" aria-label={t("profile.save")}>
                    <Check className="h-4 w-4" />
                  </button>
                  <button onClick={() => setEditing(false)} className="h-9 w-9 rounded-full border border-border flex items-center justify-center" aria-label={t("profile.cancel")}>
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="font-display text-3xl md:text-5xl leading-tight truncate">{username}</h1>
                  <button
                    onClick={startEdit}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                  >
                    <Edit2 className="h-3 w-3" /> {t("profile.editName")}
                  </button>
                </div>
              )}
              {joined && (
                <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" /> {t("profile.member")} {formatDate(joined, lang)}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 md:px-8 py-10 md:py-12 space-y-10">
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <Stat icon={<Vote className="h-4 w-4" />} value={voteCount} label={t("profile.votes")} accent />
          <Stat icon={<MessageSquare className="h-4 w-4" />} value={commentCount} label={t("profile.comments")} />
        </div>

        <div>
          <h2 className="font-display text-2xl md:text-3xl mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-gold" /> {t("profile.badges")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {badges.map((b) => (
              <div
                key={b.key}
                className={cn(
                  "rounded-2xl border p-4 shadow-card-soft transition-all",
                  b.unlocked
                    ? "border-gold/40 bg-gradient-to-br from-card to-gold/10"
                    : "border-border bg-card opacity-60",
                )}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full mb-3",
                    b.unlocked ? "bg-gradient-gold text-gold-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  {b.unlocked ? <Award className="h-5 w-5" /> : <Lock className="h-4 w-4" />}
                </div>
                <div className="font-display text-sm">{t(b.labelKey)}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {b.unlocked ? t(b.descKey) : t("badge.locked")}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-2xl md:text-3xl mb-4">{t("profile.activity")}</h2>
          {recentVotes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center">
              <p className="text-muted-foreground text-sm">
                {lang === "nl" ? "Nog geen activiteit. Begin met stemmen!" : "No activity yet. Start voting!"}
              </p>
              <Link
                to="/"
                className="mt-4 inline-flex rounded-full bg-primary px-5 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground"
              >
                {t("hero.cta")}
              </Link>
            </div>
          ) : (
            <ul className="space-y-2">
              {recentVotes.map(({ statement, choice }) => (
                <li key={statement!.id}>
                  <Link
                    to="/discussie/$id"
                    params={{ id: statement!.id }}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card-soft hover:shadow-elevated transition-all"
                  >
                    <ChoiceBadge choice={choice} />
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
                        {categoryLabel[statement!.category][lang]}
                      </div>
                      <div className="text-sm font-semibold truncate">
                        {lang === "nl" ? statement!.nl : statement!.en}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Stat({ icon, value, label, accent }: { icon: React.ReactNode; value: number; label: string; accent?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl p-5 shadow-card-soft",
        accent ? "bg-gradient-emerald text-primary-foreground" : "border border-border bg-card",
      )}
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider opacity-80">
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-2 font-display text-4xl md:text-5xl tabular-nums">{value}</div>
    </div>
  );
}

function ChoiceBadge({ choice }: { choice: "agree" | "neutral" | "disagree" }) {
  const map = {
    agree: { icon: ThumbsUp, cls: "bg-primary text-primary-foreground" },
    neutral: { icon: Minus, cls: "bg-muted text-muted-foreground" },
    disagree: { icon: ThumbsDown, cls: "bg-gold text-gold-foreground" },
  } as const;
  const Icon = map[choice].icon;
  return (
    <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", map[choice].cls)}>
      <Icon className="h-4 w-4" />
    </div>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
