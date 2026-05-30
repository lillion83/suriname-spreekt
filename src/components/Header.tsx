import { Link, useRouterState } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { Globe, Home, BarChart3, User, Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export function Header() {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  const items = [
    { to: "/", label: t("nav.home"), icon: Home },
    { to: "/resultaten", label: t("nav.results"), icon: BarChart3 },
    { to: "/profiel", label: t("nav.profile"), icon: User },
  ] as const;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-emerald shadow-card-soft">
              <span className="font-display text-base text-primary-foreground">SS</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-sm tracking-tight">SURINAME</span>
              <span className="font-display text-sm tracking-tight text-primary-glow">SPREEKT</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm font-semibold">
            {items.map((item) => {
              const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "relative px-4 py-2 rounded-full transition-colors",
                    active ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === "nl" ? "en" : "nl")}
              className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold uppercase tracking-wider hover:border-primary hover:text-primary transition-colors"
              aria-label="Switch language"
            >
              <Globe className="h-3.5 w-3.5" />
              {lang === "nl" ? "NL" : "EN"}
            </button>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button
                  className="md:hidden flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card"
                  aria-label="Open menu"
                >
                  <Menu className="h-4 w-4" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0">
                <SheetHeader className="border-b border-border p-5">
                  <SheetTitle className="font-display text-lg tracking-tight">SURINAME SPREEKT</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col p-3 gap-1">
                  {items.map((item) => {
                    const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-4 py-3 font-semibold transition-colors",
                          active
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground hover:bg-muted",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur-xl">
        <div className="grid grid-cols-3 h-16">
          {items.map((item) => {
            const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className={cn("h-5 w-5", active && "scale-110")} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
