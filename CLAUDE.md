# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Förderpilot** is a React SPA that uses Claude AI to match users with 104+ government and foundation subsidies (Förderungen) in Liechtenstein. It is deployed as a single HTML file at `foerderpilot.mmind.space`.

## Common Commands

All commands run from the `app/` directory:

```bash
npm run dev       # Dev server at localhost:5173 (HMR)
npm run build     # TypeScript check + Vite build → dist/index.html (~300 KB single file)
npm run preview   # Preview production build locally
npm run lint      # ESLint
```

## Architecture

### Build Output

`vite-plugin-singlefile` bundles everything (JS, CSS, assets) into a single `dist/index.html`. This is intentional — production deployment is just copying one file.

### Data Flow

```
User Input → preFilter.ts (keyword scoring, cuts 104→~30 entries)
           → api.ts (sends reduced dataset to LLM with system prompt)
           → ResultCards.tsx (renders matched Förderungen)
```

The pre-filtering in `lib/preFilter.ts` is critical for cost/speed: it scores each `Foerderung` by keyword relevance and passes only the top ~35 to the LLM.

### LLM Integration (`lib/api.ts`)

- **Default provider:** Claude (`claude-sonnet-4-20250514`)
- **Alternate providers:** OpenAI, Gemini, OpenRouter (configurable via Admin Panel at `/#admin`)
- **Dev mode:** Calls Anthropic directly using `VITE_ANTHROPIC_API_KEY` from `.env`
- **Production:** Frontend calls `/api/chat` → Nginx → Docker proxy (port 3003) → Anthropic API (key injected server-side)
- The LLM must return **JSON only** (no markdown). `api.ts` strips code fences and retries once on failure.

### State Management

All state lives in `App.tsx`. No external state library. Key state:
- `tab`: `'search' | 'catalog'` — which main view is shown
- `view`: `'hero' | 'loading' | 'results'` — search tab sub-state
- Last search result is persisted to `sessionStorage` to survive navigation

### Production Deployment (Hetzner)

```
Browser → Nginx (443 SSL)
  /           → /opt/foerderpilot/static/index.html
  /api/chat   → localhost:3003 (Docker: deploy/proxy/server.js)
                  → api.anthropic.com (API key injected here)
```

Deploy: `scp dist/index.html hetzner:/opt/foerderpilot/static/index.html`

### Key Files

| File | Purpose |
|------|---------|
| `app/src/App.tsx` | Root component, all app state, search orchestration |
| `app/src/lib/api.ts` | Multi-provider LLM abstraction + response parsing |
| `app/src/lib/preFilter.ts` | Client-side keyword pre-filtering before API call |
| `app/src/lib/systemPrompt.ts` | System prompt sent to LLM (JSON-only output contract) |
| `app/src/data/foerderungen_data.json` | 104 Förderungen dataset (115 KB) |
| `app/src/types.ts` | All TypeScript interfaces (`Foerderung`, `FoerderungMatch`, `ApiResponse`) |
| `deploy/proxy/server.js` | Node.js proxy that injects the Anthropic API key |
| `deploy/nginx-foerderpilot.conf` | Nginx config with SSL + API proxy |

## Design System

Custom Tailwind theme in `tailwind.config.js`:
- **Primary:** `#0D4F6B` (teal)
- **Accent:** `#E8530A` (orange)
- **Background:** `#F8F7F4` (off-white)
- **Fonts:** `font-headline` = Fraunces (serif), `font-body` = Plus Jakarta Sans

## Data

- Förderungen are stored in `app/src/data/foerderungen_data.json` and exported via `app/src/data/foerderungen.ts`
- To update data, use the root-level scripts: `update-data-v3.js`, `enrich-data-v2.js`
- The `KATEGORIEN` constant in `foerderungen.ts` must stay in sync with the data
