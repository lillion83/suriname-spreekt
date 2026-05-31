import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  statementNl: z.string(),
  statementEn: z.string(),
  votes: z.object({ agree: z.number(), neutral: z.number(), disagree: z.number() }),
  comments: z.array(z.string()).max(200),
  lang: z.enum(["nl", "en"]),
});

export type InsightsResult = {
  summary: string;
  pros: string[];
  cons: string[];
  sentiment: "positive" | "neutral" | "negative";
  sentimentScore: number; // -100..100
};

export const getInsights = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<InsightsResult> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

    const total = data.votes.agree + data.votes.neutral + data.votes.disagree;
    const pct = (n: number) => (total === 0 ? 0 : Math.round((n / total) * 100));

    const lang = data.lang;
    const statement = lang === "nl" ? data.statementNl : data.statementEn;
    const sysNl =
      "Je bent een neutrale analist die online discussies samenvat voor een Surinaams burgerplatform. Antwoord altijd in het Nederlands. Geef beknopte, neutrale en respectvolle inzichten. Antwoord uitsluitend met geldige JSON.";
    const sysEn =
      "You are a neutral analyst summarising online discussions for a Surinamese civic platform. Always reply in English. Provide concise, neutral and respectful insights. Reply with valid JSON only.";

    const commentsBlock = data.comments.length
      ? data.comments.map((c, i) => `${i + 1}. ${c}`).join("\n")
      : lang === "nl"
        ? "(Nog geen reacties — baseer je analyse op de stemverdeling en de stelling zelf.)"
        : "(No comments yet — base your analysis on the vote distribution and statement itself.)";

    const userPrompt =
      lang === "nl"
        ? `Stelling: "${statement}"

Stemverdeling: Eens ${pct(data.votes.agree)}%, Neutraal ${pct(data.votes.neutral)}%, Oneens ${pct(data.votes.disagree)}% (totaal ${total} stemmen).

Reacties:
${commentsBlock}

Geef terug als JSON met exact deze velden:
{
  "summary": "Eén alinea van max 60 woorden die de stemverdeling en kernpunten van de discussie samenvat.",
  "pros": ["3 korte bullets met de belangrijkste argumenten vóór"],
  "cons": ["3 korte bullets met de belangrijkste argumenten tegen"],
  "sentiment": "positive" | "neutral" | "negative",
  "sentimentScore": getal tussen -100 (zeer negatief) en 100 (zeer positief)
}`
        : `Statement: "${statement}"

Vote distribution: Agree ${pct(data.votes.agree)}%, Neutral ${pct(data.votes.neutral)}%, Disagree ${pct(data.votes.disagree)}% (total ${total} votes).

Comments:
${commentsBlock}

Return JSON with exactly these fields:
{
  "summary": "One paragraph max 60 words summarising the vote distribution and key discussion points.",
  "pros": ["3 short bullets with the main arguments in favour"],
  "cons": ["3 short bullets with the main arguments against"],
  "sentiment": "positive" | "neutral" | "negative",
  "sentimentScore": number between -100 (very negative) and 100 (very positive)
}`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: lang === "nl" ? sysNl : sysEn },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      if (res.status === 429) throw new Error("rate_limited");
      if (res.status === 402) throw new Error("credits_exhausted");
      throw new Error(`AI gateway error ${res.status}`);
    }

    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const content = json.choices?.[0]?.message?.content ?? "{}";
    let parsed: Partial<InsightsResult> = {};
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = {};
    }

    const sentiment: InsightsResult["sentiment"] =
      parsed.sentiment === "positive" || parsed.sentiment === "negative" || parsed.sentiment === "neutral"
        ? parsed.sentiment
        : "neutral";

    return {
      summary: typeof parsed.summary === "string" ? parsed.summary : "",
      pros: Array.isArray(parsed.pros) ? parsed.pros.slice(0, 5).map(String) : [],
      cons: Array.isArray(parsed.cons) ? parsed.cons.slice(0, 5).map(String) : [],
      sentiment,
      sentimentScore: typeof parsed.sentimentScore === "number" ? Math.max(-100, Math.min(100, parsed.sentimentScore)) : 0,
    };
  });
