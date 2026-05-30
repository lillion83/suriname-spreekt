import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Lang } from "@/data/statements";

type Dict = Record<string, { nl: string; en: string }>;

const dict: Dict = {
  "nav.home": { nl: "Home", en: "Home" },
  "nav.results": { nl: "Resultaten", en: "Results" },
  "nav.discuss": { nl: "Discussie", en: "Discussion" },
  "nav.profile": { nl: "Profiel", en: "Profile" },
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

  "section.today": { nl: "Stelling van de dag", en: "Statement of the day" },
  "section.today.sub": { nl: "Vandaag bepaal jij mee.", en: "Today you help decide." },
  "section.trending": { nl: "Trending onderwerpen", en: "Trending topics" },
  "section.trending.sub": { nl: "Wat speelt er nu in het land", en: "What's happening in the country now" },
  "section.latest": { nl: "Laatste stellingen", en: "Latest statements" },
  "section.latest.sub": { nl: "Vers binnen, klaar voor jouw stem.", en: "Fresh in, ready for your vote." },

  "vote.agree": { nl: "Eens", en: "Agree" },
  "vote.neutral": { nl: "Neutraal", en: "Neutral" },
  "vote.disagree": { nl: "Oneens", en: "Disagree" },
  "vote.thanks": { nl: "Bedankt voor je stem", en: "Thanks for your vote" },
  "vote.total": { nl: "stemmen", en: "votes" },
  "vote.closed": { nl: "Stemming gesloten", en: "Voting closed" },
  "vote.discuss": { nl: "Naar discussie", en: "Open discussion" },

  "tag.hot": { nl: "Heet", en: "Hot" },
  "tag.trending": { nl: "Trending", en: "Trending" },
  "tag.closed": { nl: "Gesloten", en: "Closed" },
  "tag.active": { nl: "Actief", en: "Active" },

  "results.title": { nl: "Alle stellingen", en: "All statements" },
  "results.sub": { nl: "Bekijk en filter actieve en afgesloten stemmingen.", en: "Browse and filter active and closed votes." },
  "filter.category": { nl: "Categorie", en: "Category" },
  "filter.all": { nl: "Alle", en: "All" },
  "filter.status": { nl: "Status", en: "Status" },
  "filter.sort": { nl: "Sortering", en: "Sort" },
  "filter.newest": { nl: "Nieuwste eerst", en: "Newest first" },
  "filter.oldest": { nl: "Oudste eerst", en: "Oldest first" },
  "filter.most": { nl: "Meeste stemmen", en: "Most votes" },
  "filter.empty": { nl: "Geen stellingen gevonden.", en: "No statements found." },

  "discuss.results": { nl: "Stemresultaten", en: "Vote results" },
  "discuss.comments": { nl: "Reacties", en: "Comments" },
  "discuss.placeholder": { nl: "Deel je mening over deze stelling…", en: "Share your view on this statement…" },
  "discuss.post": { nl: "Plaats reactie", en: "Post comment" },
  "discuss.first": { nl: "Wees de eerste die reageert.", en: "Be the first to comment." },
  "discuss.back": { nl: "Terug naar overzicht", en: "Back to overview" },
  "discuss.context": { nl: "Achtergrond", en: "Background" },

  "profile.title": { nl: "Mijn profiel", en: "My profile" },
  "profile.votes": { nl: "Stemmen uitgebracht", en: "Votes cast" },
  "profile.comments": { nl: "Reacties geplaatst", en: "Comments posted" },
  "profile.member": { nl: "Lid sinds", en: "Member since" },
  "profile.badges": { nl: "Badges", en: "Badges" },
  "profile.activity": { nl: "Recente activiteit", en: "Recent activity" },
  "profile.editName": { nl: "Bewerk gebruikersnaam", en: "Edit username" },
  "profile.save": { nl: "Opslaan", en: "Save" },
  "profile.cancel": { nl: "Annuleren", en: "Cancel" },

  "badge.first": { nl: "Eerste Stem", en: "First Voice" },
  "badge.first.desc": { nl: "Je eerste stem uitgebracht.", en: "Cast your first vote." },
  "badge.engaged": { nl: "Betrokken Burger", en: "Engaged Citizen" },
  "badge.engaged.desc": { nl: "5 of meer stemmen.", en: "5 or more votes." },
  "badge.veteran": { nl: "Veteraan", en: "Veteran" },
  "badge.veteran.desc": { nl: "10 of meer stemmen.", en: "10 or more votes." },
  "badge.voice": { nl: "Stem van het Volk", en: "Voice of the People" },
  "badge.voice.desc": { nl: "Eerste reactie geplaatst.", en: "Posted your first comment." },
  "badge.locked": { nl: "Nog te ontgrendelen", en: "Not yet unlocked" },

  "footer.tagline": {
    nl: "Een onafhankelijk platform voor de stem van elke Surinamer.",
    en: "An independent platform for the voice of every Surinamese.",
  },
  "footer.rights": { nl: "Alle rechten voorbehouden.", en: "All rights reserved." },

  "common.you": { nl: "Jij", en: "You" },
  "common.justNow": { nl: "zojuist", en: "just now" },
};

export type DictKey = keyof typeof dict;

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: DictKey) => string;
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

  const t = (key: DictKey) => dict[key]?.[lang] ?? String(key);

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n outside provider");
  return ctx;
}

export function formatDate(iso: string, lang: Lang) {
  const d = new Date(iso);
  return d.toLocaleDateString(lang === "nl" ? "nl-NL" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
