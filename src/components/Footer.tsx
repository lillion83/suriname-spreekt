import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-10 pb-24 md:pb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-emerald">
            <span className="font-display text-sm text-primary-foreground">SS</span>
          </div>
          <div>
            <div className="font-display text-sm">SURINAME SPREEKT</div>
            <div className="text-xs text-muted-foreground">{t("footer.tagline")}</div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Suriname Spreekt — {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
