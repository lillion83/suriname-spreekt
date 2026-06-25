import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTallies, castVote, type Tallies, type Tally } from "./api/votes.functions";
import type { Choice } from "./useUser";

const KEY = ["tallies"] as const;

// Live tallies for all statements, fetched once and cached. Returns undefined
// until loaded (or if the backend is unreachable) so callers fall back to the
// static seed counts baked into the statement data.
export function useTallies() {
  return useQuery<Tallies>({
    queryKey: KEY,
    queryFn: () => getTallies(),
    staleTime: 30_000,
    retry: false,
  });
}

// Submits a vote and optimistically bumps the cached tally so the result bar
// updates instantly, before the server round-trip resolves.
export function useCastVote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { statementId: string; choice: Choice; baseline: Tally }) =>
      castVote({ data: { statementId: vars.statementId, choice: vars.choice } }),
    onMutate: async ({ statementId, choice, baseline }) => {
      await qc.cancelQueries({ queryKey: KEY });
      const prev = qc.getQueryData<Tallies>(KEY);
      qc.setQueryData<Tallies>(KEY, (old) => {
        const current = old?.[statementId] ?? baseline;
        return {
          ...old,
          [statementId]: { ...current, [choice]: current[choice] + 1 },
        };
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(KEY, ctx.prev);
    },
    onSuccess: (server, { statementId }) => {
      if (server) {
        qc.setQueryData<Tallies>(KEY, (old) => ({ ...old, [statementId]: server }));
      }
    },
  });
}
