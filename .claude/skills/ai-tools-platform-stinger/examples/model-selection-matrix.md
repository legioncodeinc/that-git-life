# Example: Model Selection for a SaaS Product

## Context

A B2B SaaS product (team productivity app) is building AI features across three use cases:
1. **Chat assistant** — users ask questions about their workspace data; complex reasoning required.
2. **Document summarization** — auto-summarize uploaded PDFs; 50K-200K token documents.
3. **Intent classification** — route incoming user requests to features; high volume (500K/day); simple.

## Analysis

### Use case 1: Chat assistant

Requirements:
- Complex multi-step reasoning
- Function calling (search, lookup, create)
- 32K context for conversation history
- Sub-2 second response time for most queries

| Model | Quality fit | Latency | Cost (500 calls/day, 4K tokens) | Notes |
|---|---|---|---|---|
| Claude 3.7 Sonnet | Excellent | 1.5-3s | $540/month | Best reasoning; recommended |
| GPT-4.1 | Excellent | 1-2s | $480/month | Strong coding + function calling |
| Gemini 2.5 Pro | Very good | 2-4s | $375/month | Best if >100K context needed |
| Claude Haiku 3.5 | Adequate | 0.5-1s | $48/month | Noticeably weaker on complex queries |

**Recommendation:** Claude 3.7 Sonnet for chat. Fallback to GPT-4.1 via Portkey.

### Use case 2: Document summarization

Requirements:
- 50K-200K token documents (full book/report ingestion)
- Quality over speed (async background job, 60s budget)
- Cost is important at scale

| Model | Context window | Quality at 100K | Cost (1K docs/day, 100K tokens avg) | Notes |
|---|---|---|---|---|
| Gemini 2.5 Pro | 1M | Excellent | $3,750/month | Best long-context; expensive |
| Claude 3.7 Sonnet | 200K | Very good | $4,500/month | Strong; expensive at this volume |
| Gemini 2.0 Flash | 1M | Good | $300/month | **10x cheaper**; quality difference acceptable for summaries |
| GPT-4.1 | 1M | Very good | $6,000/month | Most expensive at this volume |

**Recommendation:** Gemini 2.0 Flash for document summarization. The 10x cost advantage over frontier models is decisive for this async, quality-tolerant workload. Validate quality on a sample of 100 documents before committing.

### Use case 3: Intent classification

Requirements:
- Route 500K requests/day to 8 feature categories
- Response < 500ms
- Accuracy > 92% (measured)
- Lowest possible cost

| Model | Accuracy | Latency | Cost (500K calls/day, 200 tokens avg) | Notes |
|---|---|---|---|---|
| Claude Haiku 3.5 | 96% | 200-400ms | $2,400/month | High quality; expensive at volume |
| GPT-4o-mini | 95% | 150-300ms | $450/month | Good quality; much cheaper |
| Llama 3.1 8B (Groq) | 92% | 50-150ms | $540/month | Meets quality bar; fastest |
| Gemini 1.5 Flash | 93% | 200-400ms | $225/month | Cheapest; adequate |

**Recommendation:** GPT-4o-mini for intent classification. Strong accuracy, fast, and 80% cheaper than Haiku. Consider Groq (Llama 8B) if latency drops below 150ms is needed.

## Final recommendation summary

| Use case | Primary model | Cheap fallback | Monthly cost (at stated volumes) |
|---|---|---|---|
| Chat assistant | Claude 3.7 Sonnet | GPT-4.1 | $540 |
| Document summarization | Gemini 2.0 Flash | Gemini 1.5 Flash | $300 |
| Intent classification | GPT-4o-mini | Llama 3.1 8B (Groq) | $450 |
| **Total** | | | **~$1,290/month** |

## Wiring the three models via Portkey

```typescript
// Three virtual keys: claude-sonnet, gemini-flash, gpt-mini
export const chatClient = new Portkey({ virtualKey: "claude-sonnet" });
export const summaryClient = new Portkey({ virtualKey: "gemini-flash" });
export const classifyClient = new Portkey({ virtualKey: "gpt-mini" });
```

## Re-evaluation triggers

- If Gemini 2.0 Flash quality is insufficient on your corpus → upgrade to Gemini 2.5 Pro (10x cost increase but same workflow).
- If monthly AI spend exceeds $2K → add batch API for document summarization (50% discount on Gemini, 24h turnaround for background jobs).
- Re-evaluate quarterly as new model versions release.

*Recommendation valid as of 2026-05. Prices based on provider list pricing.*
