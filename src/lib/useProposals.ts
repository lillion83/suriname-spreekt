import { useCallback, useEffect, useState } from "react";
import type { Category } from "@/data/statements";

export type ProposalStatus = "pending" | "approved" | "rejected" | "published";

export interface Proposal {
  id: string;
  title: string;
  description: string;
  category: Category;
  author: string;
  createdAt: string;
  status: ProposalStatus;
  baseSupport: number; // seeded supporters
  baseOppose: number;
}

const PROPOSALS_KEY = "ss-proposals";
const PROPOSAL_VOTES_KEY = "ss-proposal-votes";

export type ProposalVote = "support" | "oppose";

const seeds: Proposal[] = [
  {
    id: "seed-belasting-mkb",
    title: "Verlaag belasting voor kleine ondernemers",
    description:
      "Een tijdelijke belastingverlaging voor MKB-bedrijven om herstel na inflatie te versnellen en lokale werkgelegenheid te beschermen.",
    category: "economie",
    author: "Kavita P.",
    createdAt: "2026-05-26",
    status: "approved",
    baseSupport: 1842,
    baseOppose: 230,
  },
  {
    id: "seed-zonnepanelen",
    title: "Subsidie op zonnepanelen voor huishoudens",
    description:
      "Subsidieer 50% van de aanschafkosten voor zonnepanelen in particuliere woningen om de afhankelijkheid van het elektriciteitsnet te verminderen.",
    category: "milieu",
    author: "Dilan S.",
    createdAt: "2026-05-24",
    status: "published",
    baseSupport: 3120,
    baseOppose: 410,
  },
  {
    id: "seed-jeugdraad",
    title: "Nationale jeugdraad met adviesrecht",
    description:
      "Een wettelijk verankerde jeugdraad die de regering verplicht adviseert over besluiten die jongeren raken — onderwijs, klimaat en werk.",
    category: "politiek",
    author: "Mireille D.",
    createdAt: "2026-05-22",
    status: "pending",
    baseSupport: 902,
    baseOppose: 184,
  },
  {
    id: "seed-marktvergunning",
    title: "Vereenvoudig marktvergunningen voor jonge ondernemers",
    description:
      "Een digitaal loket waarbij jongeren onder 30 binnen 48 uur een tijdelijke marktvergunning kunnen krijgen.",
    category: "economie",
    author: "Roy A.",
    createdAt: "2026-05-19",
    status: "pending",
    baseSupport: 612,
    baseOppose: 98,
  },
  {
    id: "seed-schoolmaaltijd",
    title: "Gratis ontbijt op alle basisscholen",
    description:
      "Een ontbijtprogramma op basisscholen om schoolprestaties en gezondheid van kinderen in achterstandswijken te verbeteren.",
    category: "maatschappij",
    author: "Sharmila K.",
    createdAt: "2026-05-18",
    status: "approved",
    baseSupport: 4210,
    baseOppose: 295,
  },
  {
    id: "seed-rivierroute",
    title: "Riviertaxi-route Paramaribo–Commewijne",
    description:
      "Een snelle openbare riviertaxi-verbinding ter ontlasting van de Wijdenboschbrug en als toeristische impuls.",
    category: "maatschappij",
    author: "Anand R.",
    createdAt: "2026-05-15",
    status: "rejected",
    baseSupport: 480,
    baseOppose: 1320,
  },
];

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export const MODERATION_THRESHOLD = 1000;

export function useProposals() {
  const [userProposals, setUserProposals] = useState<Proposal[]>([]);
  const [votes, setVotes] = useState<Record<string, ProposalVote>>({});

  useEffect(() => {
    setUserProposals(read<Proposal[]>(PROPOSALS_KEY, []));
    setVotes(read<Record<string, ProposalVote>>(PROPOSAL_VOTES_KEY, {}));

    const onUpdate = () => {
      setUserProposals(read<Proposal[]>(PROPOSALS_KEY, []));
      setVotes(read<Record<string, ProposalVote>>(PROPOSAL_VOTES_KEY, {}));
    };
    window.addEventListener("storage", onUpdate);
    window.addEventListener("ss-proposal-update", onUpdate);
    return () => {
      window.removeEventListener("storage", onUpdate);
      window.removeEventListener("ss-proposal-update", onUpdate);
    };
  }, []);

  const all: Proposal[] = [...userProposals, ...seeds];

  const addProposal = useCallback(
    (input: { title: string; description: string; category: Category; author: string }) => {
      const p: Proposal = {
        id: crypto.randomUUID(),
        title: input.title,
        description: input.description,
        category: input.category,
        author: input.author,
        createdAt: new Date().toISOString(),
        status: "pending",
        baseSupport: 1,
        baseOppose: 0,
      };
      const next = [p, ...read<Proposal[]>(PROPOSALS_KEY, [])];
      write(PROPOSALS_KEY, next);
      // record own support automatically
      const v = { ...read<Record<string, ProposalVote>>(PROPOSAL_VOTES_KEY, {}), [p.id]: "support" as ProposalVote };
      write(PROPOSAL_VOTES_KEY, v);
      setUserProposals(next);
      setVotes(v);
      window.dispatchEvent(new Event("ss-proposal-update"));
      return p;
    },
    [],
  );

  const vote = useCallback((proposalId: string, choice: ProposalVote) => {
    const current = read<Record<string, ProposalVote>>(PROPOSAL_VOTES_KEY, {});
    let next: Record<string, ProposalVote>;
    if (current[proposalId] === choice) {
      // toggle off
      next = { ...current };
      delete next[proposalId];
    } else {
      next = { ...current, [proposalId]: choice };
    }
    write(PROPOSAL_VOTES_KEY, next);
    setVotes(next);
    window.dispatchEvent(new Event("ss-proposal-update"));
  }, []);

  return { proposals: all, votes, addProposal, vote };
}

export function tallies(p: Proposal, votes: Record<string, ProposalVote>) {
  const own = votes[p.id];
  const support = p.baseSupport + (own === "support" ? 1 : 0);
  const oppose = p.baseOppose + (own === "oppose" ? 1 : 0);
  return { support, oppose, net: support - oppose };
}
