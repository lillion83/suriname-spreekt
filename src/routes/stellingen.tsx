import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useI18n } from "@/lib/i18n";
import { categoryLabel } from "@/data/statements";
import { useProposals, tallies } from "@/lib/useProposals";

export const Route = createFileRoute("/stellingen")({
  head: () => ({
    meta: [
      { title: "Gepubliceerde stellingen — Suriname Spreekt" },
      { name: "description", content: "Stellingen voorgesteld door burgers en goedgekeurd door moderatie." },
      { property: "og:title", content: "Gepubliceerde stellingen — Suriname Spreekt" },
      { property: "og:description", content: "Door burgers voorgestelde en gemodereerde stellingen." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StellingenPage,
});

function StellingenPage() {
  const { lang, formatDate } = useI18n() as ReturnType<typeof useI18n> & { formatDate?: (d: string) => string };
  const { proposals, votes } = useProposals();
  const nl = lang === "nl";
  const published = proposals.filter((p) => p.status === "published");

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-10 md:px-8">
        <h1 className="font-display text-3xl tracking-tight md:text-4xl">
          {nl ? "Gepubliceerde stellingen" : "Published statements"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {nl ? "Voorstellen van burgers die door moderatie zijn bevestigd." : "Citizen proposals confirmed by moderation."}
        </p>
        {published.length === 0 ? (
          <p className="mt-8 text-sm text-muted-foreground">{nl ? "Nog geen stellingen." : "No statements yet."}</p>
        ) : (
          <ul className="mt-8 space-y-4">
            {published.map((p) => (
              <li key={p.id} className="rounded-2xl border border-border bg-card p-5 shadow-card-soft">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">
                  {categoryLabel[p.category][lang]} · {formatDate ? formatDate(p.createdAt) : p.createdAt.slice(0, 10)}
                </p>
                <h2 className="mt-2 font-display text-xl tracking-tight">{p.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
                <p className="mt-3 text-xs font-semibold">
                  {tallies(p, votes).support.toLocaleString()} {nl ? "ondersteuners" : "supporters"} · {p.author}
                </p>
              </li>
            ))}
          </ul>
        )}
        <Link to="/voorstellen" className="mt-8 inline-block text-sm font-bold text-primary hover:underline">
          {nl ? "Stel zelf een onderwerp voor →" : "Suggest a topic →"}
        </Link>
      </main>
      <Footer />
    </div>
  );
}
