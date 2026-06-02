import OpenAI from "openai";

const apiKey = process.env.OPENCODE_GO_API_KEY || process.env.OPENROUTER_API_KEY;
const model = process.env.OPENCODE_GO_MODEL || process.env.OPENROUTER_MODEL || "deepseek-v4-flash";
const baseURL = process.env.OPENCODE_GO_BASE_URL || "https://openrouter.ai/api/v1";

let _client: OpenAI | null = null;
function getClient() {
  if (!apiKey) {
    throw new Error(
      "No API key set. Add OPENCODE_GO_API_KEY or OPENROUTER_API_KEY to .env."
    );
  }
  if (!_client) {
    _client = new OpenAI({
      apiKey,
      baseURL,
      defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
        "X-Title": "omicron",
      },
    });
  }
  return _client;
}

export type AIOptions = {
  system?: string;
  messages: { role: "user" | "assistant"; content: string }[];
  temperature?: number;
  maxTokens?: number;
  json?: boolean;
};

export async function aiCall(opts: AIOptions): Promise<string> {
  const client = getClient();
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await client.chat.completions.create({
      model,
      temperature: opts.temperature ?? 0.7,
      max_tokens: opts.maxTokens ?? 2048,
      messages: [
        ...(opts.system ? [{ role: "system" as const, content: opts.system }] : []),
        ...opts.messages,
      ],
      ...(opts.json ? { response_format: { type: "json_object" as const } } : {}),
    });
    const content = res.choices[0]?.message?.content || "";
    if (content) return content;
    if (attempt < 2) {
      const delay = (attempt + 1) * 500;
      await new Promise(r => setTimeout(r, delay));
    }
  }
  return "";
}

export function tryParseJSON(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    const m = s.match(/\{[\s\S]*\}/);
    if (!m) return null;
    const fixed = m[0]
      .replace(/,\s*([}\]])/g, "$1")
      .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3')
      .replace(/\/\/.*/g, "")
      .replace(/\/\*[\s\S]*?\*\//g, "");
    try { return JSON.parse(fixed); } catch { return null; }
  }
}

export async function aiJson<T = unknown>(opts: AIOptions): Promise<T> {
  const text = await aiCall({ ...opts, json: true });
  const clean = (s: string) => {
    const m = s.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (m) return m[1].trim();
    return s.replace(/^`+|`+$/g, "").trim();
  };
  const t = clean(text);
  const parsed = tryParseJSON(t);
  if (parsed) return parsed as T;
  throw new Error("AI did not return valid JSON: " + t.slice(0, 200));
}

export const NO_SLOP_RULES = `
BANNED PHRASES — do not use any of these or anything close:
delve, dive in, dive into, leverage, leverage AI, unlock, harness, seamless, seamless experience, streamline, streamlined, robust, supercharge, transformative, foster, facilitate, holistic, synergy, paradigm, in today's fast-paced world, in this day and age, it's important to note, I hope this helps, in conclusion, ultimately, at the end of the day, navigate the complexities of, in the realm of, game-changer, revolutionary, cutting-edge, next-generation, AI-powered, powered by AI

BANNED PUNCTUATION:
- em-dashes (—) — use periods, commas, or "and" instead
- "..." more than once in a row
- triple exclamation marks

BANNED PATTERNS:
- starting with "Great question!"
- starting with "Certainly!"
- using "Let's" at the start of every sentence
- numbered lists when 2-3 sentences would do

TONE:
- Talk like a friend who happens to know a lot about this
- Plain English, no buzzwords
- Short sentences. Concrete. Real.
- Prefer specific over general
- If a user is stressed, be calm. If they're tired, be gentle. If they're excited, be warm.
`.trim();
