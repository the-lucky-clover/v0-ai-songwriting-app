## Project overview

This repo is a Next.js + Electron hybrid app for AI-assisted songwriting. The UI is React (client components) and state is managed in `lib/store.ts` via `zustand` (persisted). Server-side AI generation lives in Next route handlers (see `app/api/generate/route.ts`) which stream model output to the UI.

## Key components & responsibilities

- `app/` — Next.js app routes and pages. `app/page.tsx` controls the entry flow (intro → landing → dashboard).
- `app/api/generate/route.ts` — central AI generation endpoint. Uses `ai` package `streamText()` and returns a streamed UI response. See this file for prompt structure and model selection (Anthropic model used in current code).
- `components/` — UI components. `components/ResearchAgent.tsx` shows how the renderer calls Electron APIs (`window.electronAPI`) to do scraping and research.
- `lib/store.ts` — global frontend state and persistence (Zustand + `persist`). Look here for conventions around AI config (`AIConfig`) and UI flags like `isGenerating`.
- `lib/db.ts` — database types and schema-like shapes used by server-side code. Uses Neon (`@neondatabase/serverless`) and expects `DATABASE_URL` in env.
- `main.js` & `preload.js` — Electron main process and context-bridge. `preload.js` exposes `electronAPI.scrape` and `electronAPI.aiResearch` which `components/ResearchAgent.tsx` invokes. `main.js` implements IPC handlers (axios + cheerio for scraping, OpenAI for research).

## Developer workflows & commands

- Local dev (Next): `npm run dev` — runs Next dev server on :3000. Useful for regular web development.
- Electron dev: `npm run electron-dev` — runs `concurrently` to start Next dev and then launch Electron when the site is ready. Use this to debug Electron-specific flows and `window.electronAPI` interactions.
- Build (production web): `npm run build` then `npm start` (Next production). Electron build: `npm run build-electron`.

Environment variables to set during development:

- `DATABASE_URL` — Neon database connection used by `lib/db.ts` (server-side code).
- `OPENAI_API_KEY` — used by `main.js` for electron-side AI research.
- Any model/provider keys the server API may need (the Next route uses the `ai` package; check the deployments for how keys are wired).

## Project-specific patterns & conventions

- Streaming AI responses: server-side endpoints use `streamText({...}).toUIMessageStreamResponse()` — follow `app/api/generate/route.ts` as the canonical example when adding new streamed generation endpoints.
- Prompt composition: keep system prompt and user prompt separate. The existing implementation builds a long `systemPrompt` and a short `userPrompt` before calling `streamText()`.
- Frontend state: mutations and derived behaviour live in `lib/store.ts`. Add new UI flags or AI config fields here and persist only what belongs in storage via `persist({ partialize })`.
- Electron <-> Renderer: use `preload.js` contextBridge to expose safe functions (`electronAPI.*`). Main process handlers (IPC) in `main.js` must sanitize and limit returned data (current code truncates scraped text to 1000 chars).

## Integration points & external deps

- AI/LLM: `ai` package used in Next API route (server). `main.js` uses the `openai` SDK for Electron-side research. Confirm which provider/key to use when modifying endpoints.
- Database: Neon (`@neondatabase/serverless`) — `lib/db.ts` is the single source for DB types used across the app.
- Electron: `preload.js` + `main.js` implement scraping and research features used in `components/ResearchAgent.tsx`.

## Where to look when changing behavior

- If changing generation prompts or model call patterns: edit `app/api/generate/route.ts` first.
- If adding a new persisted UI preference or AI tuning field: update `lib/store.ts` and the `partialize` list used by `persist`.
- If adding Electron features: update `preload.js` (exposed APIs) and `main.js` (IPC handlers), and then call them from renderer components (example: `components/ResearchAgent.tsx`).

## Safety & secrets

- Do not hardcode API keys. Keys are expected to be provided via environment variables (see `OPENAI_API_KEY`, `DATABASE_URL`).

## Example snippets (copy/paste safe)

- Streamed generation (server): see `app/api/generate/route.ts` for pattern:

  - Build `systemPrompt` and `userPrompt` strings
  - Call `streamText({ model, system, prompt })`
  - Return `result.toUIMessageStreamResponse()`

## Questions for maintainers

- Which LLM provider/keys should be considered canonical for server-side generation (Anthropic via `ai` vs OpenAI via `main.js`)?

---
If anything here is unclear or you'd like more examples (e.g., adding a new API route, wiring a new Electron IPC, or updating persisted store fields), tell me which area to expand.  
