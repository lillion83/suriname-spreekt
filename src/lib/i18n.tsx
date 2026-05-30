import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Lang } from "@/data/statements";

type Dict = Record<string, { nl: string; en: string }>;

const dict: Dict = {
  "nav.home": { nl: "Stellingen", en: "Statements" },
  "nav.results": { nl: "Resultaten", en: "Results" },
  "nav.about": { nl: "Over ons", en: "About" },
  "hero.eyebrow": { nl: "De stem van Suriname", en: "The voice of Suriname" },
  "hero.title": { nl: "Suriname Spreekt.", en: "Suriname Speaks." },
  "hero.subtitle": {
    nl: "Stem op actuele stellingen over politiek, economie en samenleving. Zie direct wat heel Suriname vindt.",
    en: "Vote on current statements about politics, economy and society. See instantly what all of Suriname thinks.",
  },
  "hero.cta": { nl: "Begin met stemmen", en: "Start voting" },
  "hero.live": { nl: "Live stemmen", en: "Live votes" },
  "hero.voters": { nl: "actieve stemmers vandaag", en: "active voters today" },
  "section.trending": { nl: "Trending stellingen", en: "Trending statements" },
  "section.trending.sub": { nl: "Wat speelt er nu in het land", en: "What's happening in the country now" },
  "vote.agree": { nl: "Eens", en: "Agree" },
  "vote.neutral": { nl: "Neutraal", en: "Neutral" },
  "vote.disagree": { nl: "Oneens", en: "Disagree" },
  "vote.thanks": { nl: "Bedankt voor je stem", en: "Thanks for your vote" },
  "vote.total": { nl: "stemmen", en: "votes" },
  "tag.hot": { nl: "Heet", en: "Hot" },
  "tag.trending": { nl: "Trending", en: "Trending" },
  "footer.tagline": {
    nl: "Een onafhankelijk platform voor de stem van elke Surinamer.",
    en: "An independent platform for the voice of every Surinamese.",
  },
  "footer.rights": { nl: "Alle rechten voorbehouden.", en: "All rights reserved." },
};

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof dict) => string;
}

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("nl");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? (localStorage.getItem("ss-lang") as Lang | null) : null;
    if (stored === "nl" || stored === "en") setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("ss-lang", l);
  };

  const t = (key: keyof typeof dict) => dict[key]?.[lang] ?? String(key);

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n outside provider");
  return ctx;
}
