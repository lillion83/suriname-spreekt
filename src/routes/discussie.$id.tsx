import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StatementCard } from "@/components/StatementCard";
import { getStatement, seedComments, categoryLabel } from "@/data/statements";
import { useI18n, formatDate } from "@/lib/i18n";
import { useUser } from "@/lib/useUser";
import { useMemo, useState } from "react";
import { ArrowLeft, MessageSquare, Send } from "lucide-react";
import { AIInsights } from "@/components/AIInsights";

export const Route = createFileRoute("/discussie/$id")({
  loader: ({ params }) => {
    const s = getStatement(params.id);
    if (!s) throw notFound();
    return { id: params.id };
  },
  component: DiscussionPage,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Stelling niet gevonden.</p>
    </div>
  ),
});

function DiscussionPage() {
  const { id } = Route.useLoaderData();
  const statement = getStatement(id)!;
  const { t, lang } = useI18n();
  const { comments, addComment, username } = useUser();
  const [text, setText] = useState("");

  const seeded = (seedComments[id] ?? []).map((c) => ({
    id: `seed-${c.user}-${c.at}`,
    user: c.user,
    text: lang === "nl" ? c.nl : c.en,
    at: c.at,
    own: false,
  }));
  const own = comments
    .filter((c) => c.statementId === id)
    .map((c) => ({ id: c.id, user: username, text: c.text, at: c.at, own: true }));
  const all = [...own, ...seeded];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    addComment(id, trimmed);
    setText("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-5xl px-4 md:px-8 py-8 md:py-12">
        <Link
          to="/resultaten"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> {t("discuss.back")}
        </Link>

        <div className="mb-3 flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            {categoryLabel[statement.category][lang]}
          </span>
          <span className="text-[10px] text-muted-foreground">
            · {formatDate(statement.publishedAt, lang)}
          </span>
        </div>

        <h1 className="font-display text-3xl md:text-5xl lg:text-6xl leading-[1.05]">
          {lang === "nl" ? statement.nl : statement.en}
        </h1>

        <div className="mt-8 grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <section className="rounded-2xl border border-border bg-card p-6 shadow-card-soft">
              <h2 className="font-display text-sm uppercase tracking-[0.2em] text-primary mb-3">
                {t("discuss.context")}
              </h2>
              <p className="text-base md:text-lg leading-relaxed text-foreground/85">
                {lang === "nl" ? statement.contextNl : statement.contextEn}
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h2 className="font-display text-2xl">{t("discuss.comments")}</h2>
                <span className="text-sm text-muted-foreground">({all.length})</span>
              </div>

              <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-4 shadow-card-soft">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={t("discuss.placeholder")}
                  rows={3}
                  className="w-full resize-none bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
                  maxLength={500}
                />
                <div className="flex items-center justify-between pt-3 border-t border-border/60">
                  <span className="text-xs text-muted-foreground">{text.length}/500</span>
                  <button
                    type="submit"
                    disabled={!text.trim()}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground transition-all hover:bg-primary-glow disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {t("discuss.post")} <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>

              <div className="mt-5 space-y-3">
                {all.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">{t("discuss.first")}</p>
                )}
                {all.map((c) => (
                  <div key={c.id} className="rounded-2xl border border-border bg-card p-4 shadow-card-soft">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-emerald text-[10px] font-bold text-primary-foreground">
                          {initials(c.user)}
                        </div>
                        <span className="text-sm font-semibold">
                          {c.own ? t("common.you") : c.user}
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        {formatDate(c.at, lang)}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/85">{c.text}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div>
                <h2 className="font-display text-sm uppercase tracking-[0.2em] text-primary mb-3">
                  {t("discuss.results")}
                </h2>
                <StatementCard
                  statement={statement}
                  showContext={false}
                  showDiscussLink={false}
                />
              </div>
              <AIInsights statement={statement} commentTexts={allTexts} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
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
