# 19 — LLM Provider Config

OpenRouter setup, `PlatformConfig` model slots, `getAIModels()` cache, switching models procedure. The reason models live in DB and not in code.

> **Doc reference:** `library/knowledge-base/ai/coach-architecture.md §3`. Code: `lib/ai-client.ts`.

---

## 1. OpenRouter — the only gateway

All LLM inference routes through `https://openrouter.ai/api/v1` via the OpenAI-compatible SDK. One client, one auth, one credit balance.

```typescript
// lib/ai-client.ts
_client = new OpenAI({
  apiKey:  process.env.OPENROUTER_API_KEY,
  baseURL: process.env.OPENROUTER_URL || "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": process.env.APP_URL || "https://example.com",
    "X-Title":      "the deploying product",
  },
});
```

`HTTP-Referer` and `X-Title` are OpenRouter conventions for attribution and analytics — keep them.

| Env var | Value |
|---|---|
| `OPENROUTER_URL` | `https://openrouter.ai/api/v1` |
| `OPENROUTER_API_KEY` | OpenRouter API key (secret) |
| `APP_URL` | `process.env.APP_URL` (used in `HTTP-Referer`) |

**Direct provider calls** (Anthropic, OpenAI, Meta direct, Cohere chat) bypass the gateway and break the pattern. **Must-fix.**

---

## 2. The three model slots — `PlatformConfig`

Models live in `PlatformConfig` (DB), not in code. SA-editable via the AI Configuration screen.

| Slot | Default | Used for |
|---|---|---|
| `modelChat` | `meta-llama/Llama-3.3-70B-Instruct` | Coaching responses, matching, generation |
| `modelFast` | `meta-llama/Llama-3.1-8B-Instruct` | Routing classification, media summarization, eval-as-judge |
| `modelVision` | `meta-llama/llama-3.2-11b-vision-instruct` | Image and video frame analysis |

---

## 3. `getAIModels()` — the cached reader

```typescript
export async function getAIModels(): Promise<{
  chat:   string;
  fast:   string;
  vision: string;
}>
```

- **Cache key:** `platform:ai-models` in Valkey.
- **TTL:** 1 hour.
- **Cache miss path:** `prisma.platformConfig.findFirst()` → write to Valkey → return.

**Never hardcode model names anywhere except `PlatformConfig` defaults.** Hardcoded model names in code are **must-fix**.

---

## 4. `invalidateAIModelsCache()` — must be called after slot edits

After SA saves new model selections in the Super Admin platform-config route:

```typescript
await prisma.platformConfig.update({ where: { id }, data: { modelChat, modelFast, modelVision }});
await invalidateAIModelsCache();   // DEL platform:ai-models
```

Without the invalidation, the new slot values won't take effect for up to 1 hour. **Missing invalidation call after a slot edit is a must-fix.**

---

## 5. Why models live in DB, not code

1. **Hot-swap without redeploy** — SA changes `modelChat` from `Llama-3.3-70B` to `claude-3-5-sonnet` without engineering involvement.
2. **A/B by tenant possible** — extending to per-tenant model slots is a schema change, not a code change.
3. **Cost lever in admin hands** — switching from a premium to a cheaper model is a SA decision, not a deploy.
4. **Provider failover via OpenRouter** — OpenRouter handles provider-level failover; the slot value can stay stable while the underlying model gets routed.

---

## 6. Switching models — procedure

When SA wants to change a slot:

1. **Read the current eval baseline** — pull last 7 days of `AiTrace.retrievalScore`, `routingCorrect`, `agreementScore` for the affected slot.
2. **Set up A/B if possible** — `PlatformConfig` is platform-wide today; per-tenant slots would enable A/B. Until then, pre-prod testing is the path.
3. **Edit the slot** in SA AI Configuration.
4. **Call `invalidateAIModelsCache()`** (handled automatically by the SA route).
5. **Watch the metrics for 48 hours** — alert if any metric drops > 10% from baseline.
6. **Rollback path** — revert the slot edit, re-invalidate the cache.

For routing slot (`modelFast`), expect routing accuracy to be most affected. For chat slot (`modelChat`), expect coaching rubric scores. For vision slot, watch image/video processing success rate.

---

## 7. The `getReferralAiConfig()` separate path

Referral intro generation has its own config (loaded from `PlatformConfig`):

```typescript
interface ReferralAiConfig {
  model:           string;          // defaults to "meta-llama/Llama-3.3-70B-Instruct"
  promptTemplate:  string | null;
  toneWeight:      number;
  contextDepth:    string;          // "brief" | "standard" | "rich"
}
```

Cached separately under `platform:referral-ai-config` (1h TTL). When the SA edits the model in the referral-AI section, both `platform:ai-models` AND `platform:referral-ai-config` may need invalidation depending on whether they share the chat slot.

See `guides/18-matching.md`.

---

## 8. OpenRouter-specific operational concerns

### Prepaid credit balance

OpenRouter operates on prepaid credit. **At $0, all AI features silently fail** (HTTP 402 from upstream).

**Required production safeguards:**

1. **Auto-reload** in OpenRouter dashboard — minimum balance + auto-reload amount.
2. **Low-balance webhook** → Slack/PagerDuty alert.
3. **Monitor `OPENROUTER_BALANCE`** in the observability dashboard.

### Provider preferences

OpenRouter supports `provider.order` and `provider.allow_fallbacks` to control which underlying provider serves a model. Useful for:

- Cost optimization (preferring a cheaper provider for `modelFast`).
- Latency optimization (preferring a faster provider).
- Compliance (excluding providers that don't meet residency requirements).

These settings can be added to the `openai.chat.completions.create` call via `extra_body: { provider: { ... } }`. Document any usage in `library/knowledge-base/ai/coach-architecture.md`.

### Rate limits

OpenRouter has tier-based rate limits. Production tier is sufficient for current the deploying product's scale. Monitor `429` responses; if sustained, contact OpenRouter for tier increase.

---

## 9. Per-feature model overrides — when allowed

Most calls use the slot pattern (`modelChat`, `modelFast`, `modelVision`). Some calls have specific needs:

- **Routing** — explicit `modelFast` (cost).
- **Matching** — `modelChat` (reasoning).
- **Eval-as-judge** — explicit `modelFast` (cost; calibrate quarterly).
- **Image/video frame description** — `modelVision`.
- **Recursive summarization** — `modelFast` (cost; quality acceptable for factual extraction).

These overrides are **always read from `getAIModels()`** — never hardcoded.

---

## 10. The model slot table — the canonical reference

For any LLM call in the codebase, ask: which slot does it use?

| Use case | Slot | File |
|---|---|---|
| Coaching response (global, module) | `chat` | `agent-orchestrator.ts`, `coaching-llm.ts` |
| Routing classification | `fast` | `ai-coach-router.ts` |
| Matching | `chat` | `ai-matching.ts` |
| Onboarding agent | `chat` | `onboarding-ai.ts` |
| Session summary — extract | `fast` | `coaching-llm.ts` |
| Session summary — narrative | `chat` | `coaching-llm.ts` |
| Module opening message | `chat` | `coaching-llm.ts` |
| Recursive summarization (`MediaSummarizer`) | `fast` | `media-summarizer.ts` |
| Image / video frame description | `vision` | `image-processor.ts`, `video-processor.ts` |
| Retrieval-precision eval | `fast` | `ai-eval.ts` |
| Routing eval | `fast` | `ai-eval.ts` |
| Referral intro | `chat` (or `getReferralAiConfig().model`) | `referral-ai.ts` |

A use case missing from this table or using the wrong slot is a finding.

---

## 11. Common findings

| Finding | Severity | Reference |
|---|---|---|
| Hardcoded model name in code (e.g., `"meta-llama/Llama-3.3-70B-Instruct"` literal) | must-fix | this guide §3 |
| `getAIModels()` not awaited (returning a Promise) | must-fix | this guide §3 |
| Direct provider call (Anthropic SDK, OpenAI SDK pointed at OpenAI directly, Meta API, Cohere chat) | must-fix | this guide §1 |
| `invalidateAIModelsCache()` not called after slot edit | must-fix | this guide §4 |
| `OPENROUTER_API_KEY` missing in production env | must-fix | this guide §1 |
| `OPENROUTER_BALANCE` monitoring not configured | must-fix | this guide §8 |
| Per-feature override using a different slot than §10 table | must-fix | this guide §10 |
| Model swap done without 48h post-swap monitoring window | should-refactor | this guide §6 |
| `getReferralAiConfig()` model hardcoded (instead of from `PlatformConfig`) | must-fix | this guide §7 |
| `extra_body.provider` settings used without doc update | should-refactor | this guide §8 |
