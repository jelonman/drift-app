import OpenAI from "openai";

const apiKey = process.env.OPENROUTER_API_KEY;
const model = process.env.OPENROUTER_MODEL || "anthropic/claude-3.5-sonnet";

// OpenRouter is OpenAI-compatible. We instantiate lazily so the build doesn't need the key.
let _client: OpenAI | null = null;
function getClient() {
  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY is not set. Add it to .env to enable AI features."
    );
  }
  if (!_client) {
    _client = new OpenAI({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
        "X-Title": "Four",
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
  const res = await client.chat.completions.create({
    model,
    temperature: opts.temperature ?? 0.7,
    max_tokens: opts.maxTokens ?? 1024,
    messages: [
      ...(opts.system ? [{ role: "system" as const, content: opts.system }] : []),
      ...opts.messages,
    ],
    ...(opts.json ? { response_format: { type: "json_object" as const } } : {}),
  });
  const content = res.choices[0]?.message?.content || "";
  return content;
}

export async function aiJson<T = unknown>(opts: AIOptions): Promise<T> {
  const text = await aiCall({ ...opts, json: true });
  try {
    return JSON.parse(text) as T;
  } catch {
    // Try to extract JSON from the response if the model wrapped it
    const m = text.match(/\{[\s\S]*\}/);
    if (m) return JSON.parse(m[0]) as T;
    throw new Error("AI did not return valid JSON: " + text.slice(0, 200));
  }
}

// Common system prompt builder that bans AI-slop phrasing across all 4 apps
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
