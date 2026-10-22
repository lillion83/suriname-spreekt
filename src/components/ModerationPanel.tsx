import { Link } from "@tanstack/react-router";
import { Check, X, Send, ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { categoryLabel } from "@/data/statements";
import { useProposals, moderationQueue, tallies, type Proposal } from "@/lib/useProposals";

export function ModerationPanel() {
  const { lang } = useI18n();
  const { proposals, votes, setStatus } = useProposals();
  const nl = lang === "nl";
  const queue = moderationQueue(proposals, votes);
  const approved = proposals.filter((p) => p.status === "approved");

  const Row = ({ p, actions }: { p: Proposal; actions: React.ReactNode }) => (
    <li className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="font-semibold leading-snug">{p.title}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {categoryLabel[p.category][lang]} · {tallies(p, votes).support.toLocaleString()}{" "}
          {nl ? "ondersteuners" : "supporters"} · {p.author}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">{actions}</div>
    </li>
  );

  const btn = "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors";

  return (
    <section className="mt-6 rounded-2xl border border-border bg-card p-5 md:p-6 shadow-card-soft">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h2 className="font-display text-lg tracking-tight">{nl ? "Moderatiepanel" : "Moderation panel"}</h2>
        </div>
        <Link to="/stellingen" className="text-xs font-bold text-primary hover:underline">
          {nl ? "Bekijk gepubliceerde stellingen →" : "View published statements →"}
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {nl ? "Wachtrij" : "Queue"} ({queue.length})
          </h3>
          {queue.length === 0 ? (
            <p className="text-sm text-muted-foreground">{nl ? "De wachtrij is leeg." : "The queue is empty."}</p>
          ) : (
            <ul className="space-y-3">
              {queue.map((p) => (
                <Row
                  key={p.id}
                  p={p}
                  actions={
                    <>
                      <button onClick={() => setStatus(p.id, "approved")} className={`${btn} bg-primary text-primary-foreground hover:opacity-90`}>
                        <Check className="h-3.5 w-3.5" /> {nl ? "Goedkeuren" : "Approve"}
                      </button>
                      <button onClick={() => setStatus(p.id, "rejected")} className={`${btn} border border-border hover:border-destructive hover:text-destructive`}>
                        <X className="h-3.5 w-3.5" /> {nl ? "Afwijzen" : "Reject"}
                      </button>
                    </>
                  }
                />
              ))}
            </ul>
          )}
        </div>
        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {nl ? "Goedgekeurd — klaar voor publicatie" : "Approved — ready to publish"} ({approved.length})
          </h3>
          {approved.length === 0 ? (
            <p className="text-sm text-muted-foreground">{nl ? "Niets om te publiceren." : "Nothing to publish."}</p>
          ) : (
            <ul className="space-y-3">
              {approved.map((p) => (
                <Row
                  key={p.id}
                  p={p}
                  actions={
                    <button onClick={() => setStatus(p.id, "published")} className={`${btn} bg-accent text-accent-foreground hover:opacity-90`}>
                      <Send className="h-3.5 w-3.5" /> {nl ? "Publiceer als stelling" : "Publish as statement"}
                    </button>
                  }
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
