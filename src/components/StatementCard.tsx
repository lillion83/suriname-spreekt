import { useEffect, useState } from "react";
import { ThumbsUp, ThumbsDown, Minus, Flame, TrendingUp } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { categoryLabel, type Statement } from "@/data/statements";
import { cn } from "@/lib/utils";

type Choice = "agree" | "neutral" | "disagree";

interface Props {
  statement: Statement;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StatementCard({ statement, size = "md", className }: Props) {
  const { lang, t } = useI18n();
  const [choice, setChoice] = useState<Choice | null>(null);
  const [votes, setVotes] = useState(statement.votes);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(`vote-${statement.id}`) as Choice | null;
    if (stored) setChoice(stored);
  }, [statement.id]);

  const total = votes.agree + votes.neutral + votes.disagree;
  const pct = (n: number) => (total === 0 ? 0 : Math.round((n / total) * 100));

  const vote = (c: Choice) => {
    if (choice) return;
    setChoice(c);
    setVotes((v) => ({ ...v, [c]: v[c] + 1 }));
    if (typeof window !== "undefined") localStorage.setItem(`vote-${statement.id}`, c);
  };

  const text = lang === "nl" ? statement.nl : statement.en;
  const context = lang === "nl" ? statement.contextNl : statement.contextEn;

  const titleSize = size === "lg" ? "text-2xl md:text-3xl" : size === "sm" ? "text-base" : "text-lg md:text-xl";

  return (
    <article
      className={cn(
        "relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 md:p-6 shadow-card-soft transition-all hover:shadow-elevated hover:-translate-y-0.5",
        className,
      )}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
            {categoryLabel[statement.category][lang]}
          </span>
          <div className="flex gap-1.5">
            {statement.hot && (
              <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-destructive">
                <Flame className="h-3 w-3" /> {t("tag.hot")}
              </span>
            )}
            {statement.trending && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold-foreground">
                <TrendingUp className="h-3 w-3" /> {t("tag.trending")}
              </span>
            )}
          </div>
        </div>

        <h3 className={cn("font-display leading-tight text-foreground", titleSize)}>{text}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{context}</p>
      </div>

      <div className="mt-5">
        {!choice ? (
          <div className="grid grid-cols-3 gap-2">
            <VoteBtn onClick={() => vote("agree")} variant="agree" icon={<ThumbsUp className="h-4 w-4" />} label={t("vote.agree")} />
            <VoteBtn onClick={() => vote("neutral")} variant="neutral" icon={<Minus className="h-4 w-4" />} label={t("vote.neutral")} />
            <VoteBtn onClick={() => vote("disagree")} variant="disagree" icon={<ThumbsDown className="h-4 w-4" />} label={t("vote.disagree")} />
          </div>
        ) : (
          <div className="space-y-2.5 animate-in fade-in duration-500">
            <ResultBar label={t("vote.agree")} pct={pct(votes.agree)} active={choice === "agree"} color="bg-primary" />
            <ResultBar label={t("vote.neutral")} pct={pct(votes.neutral)} active={choice === "neutral"} color="bg-muted-foreground" />
            <ResultBar label={t("vote.disagree")} pct={pct(votes.disagree)} active={choice === "disagree"} color="bg-gold" />
            <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
              <span>{total.toLocaleString(lang === "nl" ? "nl-NL" : "en-US")} {t("vote.total")}</span>
              <span className="font-semibold text-primary">✓ {t("vote.thanks")}</span>
            </div>
          </div>
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
    disagree: "border-gold/40 text-gold-foreground hover:bg-gold hover:border-gold",
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
        <div
          className={cn("h-full rounded-full transition-all duration-700", color)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
