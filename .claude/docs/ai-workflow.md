# AI Workflow Guide

## Providers & Models
- **Kling**: Text-to-video, configured in src/aisdk/kling
- **OpenAI**: DALL¡¤E image generation and GPT APIs via @ai-sdk/openai
- **Replicate / Stability**: SDXL variants exposed through @ai-sdk/replicate
- Plug additional providers into src/aisdk/providers/* and register in src/services/constant.ts

## Credits & Billing
- Credit balances persist in src/db/schema.ts (credits, 	ransactions tables)
- Updating AI outcomes must also append ledger entries and Stripe usage records when applicable
- Expose cost metadata through src/services/constant.ts so UI components can render pricing consistently

## Generation Flow Checklist
1. Validate request payload with Zod inside the API route
2. Instantiate provider via helpers in src/aisdk/
3. Call generateText2Image/generateVideo and stream progress where possible
4. Upload artifacts with 
ewStorage() to storage.uploadFile using deterministic keys
5. Persist metadata (prompt, provider, duration, storage key, credit burn)
6. Return signed URLs or job IDs; avoid embedding large payloads in the response

## Error Handling
- Fail fast on validation errors; return structured error objects via espErr
- Wrap provider errors with actionable messages surfaced to the UI
- Record provider failures (including request IDs) for audit/debugging

## Security & Safety
- Gate high-cost providers behind role/plan checks
- Ensure prompts are user-owned to avoid leaking competitor data
- Run safety filters when providers expose them; respect image/video moderation settings

Use this guide whenever you modify AI features to keep implementation consistent and token-efficient.
