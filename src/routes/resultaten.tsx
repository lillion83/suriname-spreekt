import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StatementCard } from "@/components/StatementCard";
import { useI18n } from "@/lib/i18n";
import { statements, categoryLabel, type Category } from "@/data/statements";
import { useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/resultaten")({
  head: () => ({
    meta: [
      { title: "Resultaten — Suriname Spreekt" },
      { name: "description", content: "Overzicht van alle actieve en afgesloten stellingen, gefilterd op categorie en datum." },
    ],
  }),
  component: ResultatenPage,
});

type StatusFilter = "all" | "active" | "closed";
type CatFilter = Category | "all";
type SortKey = "newest" | "oldest" | "most";

function ResultatenPage() {
  const { t, lang } = useI18n();
  const [cat, setCat] = useState<CatFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortKey>("newest");

  const filtered = useMemo(() => {
    const out = statements.filter((s) => {
      if (cat !== "all" && s.category !== cat) return false;
      if (status === "active" && s.closed) return false;
      if (status === "closed" && !s.closed) return false;
      return true;
    });
    out.sort((a, b) => {
      if (sort === "newest") return b.publishedAt.localeCompare(a.publishedAt);
      if (sort === "oldest") return a.publishedAt.localeCompare(b.publishedAt);
      const ta = a.votes.agree + a.votes.neutral + a.votes.disagree;
      const tb = b.votes.agree + b.votes.neutral + b.votes.disagree;
      return tb - ta;
    });
    return out;
  }, [cat, status, sort]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="border-b border-border bg-hero-radial">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-10 md:py-16">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            {lang === "nl" ? "Overzicht" : "Overview"}
          </span>
          <h1 className="mt-3 font-display text-4xl md:text-6xl leading-[1.02]">{t("results.title")}</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{t("results.sub")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          <FilterField label={t("filter.category")}>
            <Select value={cat} onValueChange={(v) => setCat(v as CatFilter)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filter.all")}</SelectItem>
                {(Object.keys(categoryLabel) as Category[]).map((c) => (
                  <SelectItem key={c} value={c}>{categoryLabel[c][lang]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label={t("filter.status")}>
            <Select value={status} onValueChange={(v) => setStatus(v as StatusFilter)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filter.all")}</SelectItem>
                <SelectItem value="active">{t("tag.active")}</SelectItem>
                <SelectItem value="closed">{t("tag.closed")}</SelectItem>
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label={t("filter.sort")}>
            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t("filter.newest")}</SelectItem>
                <SelectItem value="oldest">{t("filter.oldest")}</SelectItem>
                <SelectItem value="most">{t("filter.most")}</SelectItem>
              </SelectContent>
            </Select>
          </FilterField>
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">{t("filter.empty")}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((s) => (
              <StatementCard key={s.id} statement={s} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
