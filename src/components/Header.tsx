import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { Globe } from "lucide-react";

export function Header() {
  const { lang, setLang, t } = useI18n();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-emerald shadow-card-soft">
            <span className="font-display text-base text-primary-foreground">SS</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-sm tracking-tight">SURINAME</span>
            <span className="font-display text-sm tracking-tight text-primary-glow">SPREEKT</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/" className="hover:text-primary transition-colors">{t("nav.home")}</Link>
          <a href="#trending" className="hover:text-primary transition-colors">{t("nav.results")}</a>
          <a href="#about" className="hover:text-primary transition-colors">{t("nav.about")}</a>
        </nav>

        <button
          onClick={() => setLang(lang === "nl" ? "en" : "nl")}
          className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold uppercase tracking-wider hover:border-primary hover:text-primary transition-colors"
          aria-label="Switch language"
        >
          <Globe className="h-3.5 w-3.5" />
          {lang === "nl" ? "NL" : "EN"}
        </button>
      </div>
    </header>
  );
}
