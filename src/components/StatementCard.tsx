import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { ThumbsUp, ThumbsDown, Minus, Flame, TrendingUp, Lock, MessageSquare, ArrowRight } from "lucide-react";
import { useI18n, formatDate } from "@/lib/i18n";
import { categoryLabel, type Statement } from "@/data/statements";
import { useUser, type Choice } from "@/lib/useUser";
import { useTallies, useCastVote } from "@/lib/useTallies";
import { cn } from "@/lib/utils";

interface Props {
  statement: Statement;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showContext?: boolean;
  showDiscussLink?: boolean;
}

export function StatementCard({ statement, size = "md", className, showContext = true, showDiscussLink = true }: Props) {
  const { lang, t } = useI18n();
  const { votes: userVotes, recordVote } = useUser();
  const choice = userVotes[statement.id] ?? null;
  const { data: tallies } = useTallies();
  const castVote = useCastVote();

  const liveVotes = useMemo(() => {
    // Prefer real server tallies (which already include the user's vote after
    // it's cast); otherwise fall back to the static seed, bumped locally.
    const server = tallies?.[statement.id];
    if (server) return server;
    if (!choice) return statement.votes;
    return { ...statement.votes, [choice]: statement.votes[choice] + 1 };
  }, [tallies, choice, statement.id, statement.votes]);

  const total = liveVotes.agree + liveVotes.neutral + liveVotes.disagree;
  const pct = (n: number) => (total === 0 ? 0 : Math.round((n / total) * 100));

  const vote = (c: Choice) => {
    if (choice || statement.closed) return;
    recordVote(statement.id, c);
    castVote.mutate({ statementId: statement.id, choice: c, baseline: statement.votes });
  };

  const text = lang === "nl" ? statement.nl : statement.en;
  const context = lang === "nl" ? statement.contextNl : statement.contextEn;

  const titleSize =
    size === "xl"
      ? "text-3xl md:text-4xl lg:text-5xl"
      : size === "lg"
        ? "text-2xl md:text-3xl"
        : size === "sm"
          ? "text-base"
          : "text-lg md:text-xl";

  const contextSize = size === "xl" || size === "lg" ? "text-base md:text-lg leading-relaxed" : "text-sm leading-relaxed";

  return (
    <article
      className={cn(
        "relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 md:p-6 shadow-card-soft transition-all hover:shadow-elevated",
        className,
      )}
    >
      <div className={cn("flex flex-col", size === "xl" ? "gap-5" : "gap-3")}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
              {categoryLabel[statement.category][lang]}
            </span>
            <span className="text-[10px] text-muted-foreground">
              · {formatDate(statement.publishedAt, lang)}
            </span>
          </div>
          <div className="flex gap-1.5 flex-wrap justify-end">
            {statement.closed && (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <Lock className="h-3 w-3" /> {t("tag.closed")}
              </span>
            )}
            {statement.hot && !statement.closed && (
              <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-destructive">
                <Flame className="h-3 w-3" /> {t("tag.hot")}
              </span>
            )}
            {statement.trending && !statement.closed && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold-foreground">
                <TrendingUp className="h-3 w-3" /> {t("tag.trending")}
              </span>
            )}
          </div>
        </div>

        <h3 className={cn("font-display leading-tight text-foreground", titleSize)}>{text}</h3>

        {showContext && <p className={cn("text-muted-foreground", contextSize)}>{context}</p>}
      </div>

      <div className={cn("flex flex-col gap-3", size === "xl" ? "mt-7" : "mt-5")}>
        {!choice && !statement.closed ? (
          <div className="grid grid-cols-3 gap-2">
            <VoteBtn onClick={() => vote("agree")} variant="agree" icon={<ThumbsUp className="h-4 w-4" />} label={t("vote.agree")} />
            <VoteBtn onClick={() => vote("neutral")} variant="neutral" icon={<Minus className="h-4 w-4" />} label={t("vote.neutral")} />
            <VoteBtn onClick={() => vote("disagree")} variant="disagree" icon={<ThumbsDown className="h-4 w-4" />} label={t("vote.disagree")} />
          </div>
        ) : (
          <div className="space-y-2.5 animate-in fade-in duration-500">
            <ResultBar label={t("vote.agree")} pct={pct(liveVotes.agree)} active={choice === "agree"} color="bg-primary" />
            <ResultBar label={t("vote.neutral")} pct={pct(liveVotes.neutral)} active={choice === "neutral"} color="bg-muted-foreground" />
            <ResultBar label={t("vote.disagree")} pct={pct(liveVotes.disagree)} active={choice === "disagree"} color="bg-gold" />
            <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
              <span className="tabular-nums">
                {total.toLocaleString(lang === "nl" ? "nl-NL" : "en-US")} {t("vote.total")}
              </span>
              {statement.closed ? (
                <span className="font-semibold">{t("vote.closed")}</span>
              ) : (
                <span className="font-semibold text-primary">✓ {t("vote.thanks")}</span>
              )}
            </div>
          </div>
        )}

        {showDiscussLink && (
          <Link
            to="/discussie/$id"
            params={{ id: statement.id }}
            className="group inline-flex items-center justify-between rounded-xl border border-dashed border-border px-3 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary hover:border-primary transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5" /> {t("vote.discuss")}
            </span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>
    </article>
  );
}

function VoteBtn({
  onClick,
  variant,
  icon,
  label,
}: {
  onClick: () => void;
  variant: "agree" | "neutral" | "disagree";
  icon: React.ReactNode;
  label: string;
}) {
  const styles = {
    agree: "border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary",
    neutral: "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
    disagree: "border-gold/50 text-gold-foreground hover:bg-gold hover:border-gold",
  }[variant];

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-1 rounded-xl border-2 bg-background py-3 px-2 text-xs font-bold uppercase tracking-wider transition-all active:scale-95",
        styles,
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function ResultBar({ label, pct, active, color }: { label: string; pct: number; active: boolean; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-semibold mb-1">
        <span className={cn(active && "text-primary")}>{label} {active && "•"}</span>
        <span className="tabular-nums">{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full rounded-full transition-all duration-700", color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
