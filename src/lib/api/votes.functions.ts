import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { d1Query, d1Configured } from "../db.server";

export type Tally = { agree: number; neutral: number; disagree: number };
export type Tallies = Record<string, Tally>;

const ChoiceSchema = z.enum(["agree", "neutral", "disagree"]);

// Read every statement's live tally in one round-trip. Returns {} when D1 is
// not configured so the client falls back to the static seed counts.
export const getTallies = createServerFn({ method: "GET" }).handler(
  async (): Promise<Tallies> => {
    if (!d1Configured()) return {};
    const rows = await d1Query<{
      statement_id: string;
      agree: number;
      neutral: number;
      disagree: number;
    }>("SELECT statement_id, agree, neutral, disagree FROM vote_tallies");

    const out: Tallies = {};
    for (const r of rows) {
      out[r.statement_id] = {
        agree: r.agree,
        neutral: r.neutral,
        disagree: r.disagree,
      };
    }
    return out;
  },
);

// Atomically increment one choice for one statement and return the new tally.
export const castVote = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({ statementId: z.string().min(1), choice: ChoiceSchema }),
  )
  .handler(async ({ data }): Promise<Tally | null> => {
    if (!d1Configured()) return null;
    // choice is whitelisted by the schema above, so it's safe to interpolate
    // as a column name (D1 can't parameterise identifiers).
    const col = data.choice;
    await d1Query(
      `UPDATE vote_tallies SET ${col} = ${col} + 1 WHERE statement_id = ?`,
      [data.statementId],
    );
    const rows = await d1Query<{
      agree: number;
      neutral: number;
      disagree: number;
    }>(
      "SELECT agree, neutral, disagree FROM vote_tallies WHERE statement_id = ?",
      [data.statementId],
    );
    return rows[0] ?? null;
  });
