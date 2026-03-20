# Förderpilot – Vollständiger Projekt-Kontext

> Dieses Dokument fasst alle relevanten Informationen zum Projekt zusammen.
> Stand: 2026-03-19 | Version: v1.13.0 | Status: **LIVE**

---

## 1. Projektüberblick

**Förderpilot** ist eine React Single-Page-App (SPA) die Unternehmen, Privatpersonen und Organisationen in Liechtenstein hilft, passende Förderungen via KI zu finden.

- **URL:** https://foerderpilot.mmind.space
- **GitHub:** https://github.com/mmind-zeno/foerderpilot
- **Zweck:** Lead-Magnet für mmind.ai (KI-Beratung Liechtenstein)
- **Datenbasis:** 104 Förderungen (web-verifiziert März 2026)

---

## 2. Tech Stack

| Was | Technologie |
|-----|-------------|
| Frontend | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS v3 (custom theme) |
| Build | `vite-plugin-singlefile` → alles in einer HTML-Datei |
| KI | Multi-Provider: OpenRouter, Claude, OpenAI, Gemini |
| Proxy | Node.js (Docker, Port 3003) |
| Hosting | Hetzner VPS, Nginx + SSL |

### Design System

- **Primary:** `#0D4F6B` (Teal)
- **Accent:** `#E8530A` (Orange)
- **Background:** `#F8F7F4` (Off-White)
- **Headlines:** Fraunces (Serif)
- **Body:** Plus Jakarta Sans

---

## 3. Architektur

### Build Output

`vite-plugin-singlefile` bündelt alles (JS, CSS, Fonts, Assets) in eine einzige `dist/index.html` (~8.9 MB). Deploy = eine Datei kopieren.

### Datenfluss

```
User Input → preFilter.ts (Keyword-Scoring, reduziert 104 → ~30 Einträge)
           → api.ts (sendet reduziertes Dataset + System-Prompt an LLM)
           → ResultCards.tsx (rendert gematchte Förderungen)
```

`preFilter.ts` ist kritisch für Kosten/Geschwindigkeit: bewertet jede Förderung per Keyword-Relevanz, nur Top ~35 gehen an das LLM.

### Produktions-Infrastruktur

```
Browser → Nginx (443 SSL, foerderpilot.mmind.space)
  /           → /opt/foerderpilot/static/index.html  (statisch)
  /api/chat   → localhost:3003 (Docker-Proxy)
                  → OpenRouter / Anthropic / OpenAI  (Key server-seitig)
```

---

## 4. LLM-Konfiguration

### Aktueller Produktions-Default

| | |
|--|--|
| **Provider** | OpenRouter |
| **Modell** | `google/gemini-2.0-flash-001` |
| **Key** | Server-seitig in Docker-Env (nicht im Bundle!) |

### Priorität (hoch → niedrig)

| Priorität | Quelle | Wer setzt es |
|-----------|--------|--------------|
| 1 | `localStorage["fp_llm_provider"]` + Key | Admin via `/#admin` (nur eigener Browser) |
| 2 | `VITE_DEFAULT_PROVIDER` + `VITE_DEFAULT_MODEL` in `app/.env` | Build-Zeit (gilt für alle User) |
| 3 | Fallback: `claude` via Proxy | Hardcoded |

### API-Key-Sicherheit (wichtig!)

- **API-Keys liegen NICHT im JS-Bundle** (seit v1.13.0)
- Keys sind Umgebungsvariablen im Docker-Container auf dem Server
- `VITE_*`-Variablen werden von Vite in den Bundle eingebettet → **niemals Keys als `VITE_*` setzen**
- Nur `VITE_DEFAULT_PROVIDER` und `VITE_DEFAULT_MODEL` dürfen in `app/.env` stehen

### Proxy-Routing (`deploy/proxy/server.js`)

```
Header x-fp-provider: openrouter → openrouter.ai        (OPENROUTER_API_KEY)
Header x-fp-provider: openai     → api.openai.com        (OPENAI_API_KEY)
Kein Header / claude              → api.anthropic.com     (ANTHROPIC_API_KEY)
```

### User-Rollen

| User | LLM | Einstellungen |
|------|-----|---------------|
| Normaler User | Build-Default (OpenRouter/Gemini) | Keine |
| Admin (`/#admin`) | Kann Provider/Modell/Key setzen | Nur eigener Browser (localStorage) |

**Admin-Änderungen gelten nicht global** — für globale Änderungen: `app/.env` anpassen + rebuild + deploy.

---

## 5. Key Files

| Datei | Zweck |
|-------|-------|
| `app/src/App.tsx` | Root-Komponente, gesamter App-State, Search-Orchestrierung |
| `app/src/lib/api.ts` | Multi-Provider LLM-Abstraktion + Response-Parsing |
| `app/src/lib/preFilter.ts` | Client-seitiges Keyword-Vorfiltern vor API-Call |
| `app/src/lib/systemPrompt.ts` | System-Prompt (JSON-only Output Contract) |
| `app/src/data/foerderungen_data.json` | 104 Förderungen Dataset (115 KB) |
| `app/src/types.ts` | TypeScript-Interfaces (Foerderung, FoerderungMatch, ApiResponse) |
| `deploy/proxy/server.js` | Node.js Multi-Provider Proxy (Keys server-seitig) |
| `deploy/nginx-foerderpilot.conf` | Nginx-Config mit SSL + API-Proxy |
| `app/.env` | Build-Defaults (NUR provider/model, KEIN Key) |

---

## 6. TypeScript-Interfaces

```typescript
interface Foerderung {
  id: number
  name: string
  anbieter: string
  kategorie: string
  zielgruppe: string[]
  zielgruppe_text: string
  foerderumfang: string
  foerderumfang_max_chf: number | null
  antragsfrist: string
  frist_typ: "laufend" | "jährlich" | "mehrmals jährlich" | "antragsprinzip" | "periodisch"
  bedingungen: string
  website: string
  tags: string[]
}

interface FoerderungMatch {
  id: number
  name: string
  anbieter: string
  warum_passend: string
  foerderumfang: string
  frist: string
  website: string
  prioritaet: "hoch" | "mittel"
}

interface ApiResponse {
  intro: string
  matches: FoerderungMatch[]
  naechster_schritt: string
  hinweis: string | null
  cta_text: string
}
```

---

## 7. State Management

Gesamter State in `App.tsx`. Kein externes State-Library.

| State | Typ | Bedeutung |
|-------|-----|-----------|
| `tab` | `'search' \| 'catalog'` | Aktive Hauptansicht |
| `view` | `'hero' \| 'loading' \| 'results'` | Sub-State des Search-Tabs |
| Letztes Ergebnis | `sessionStorage` | Überlebt Navigation |

---

## 8. Lokale Entwicklung

```bash
cd app/
npm run dev       # Dev-Server localhost:5173 (HMR)
npm run build     # TypeScript-Check + Vite-Build → dist/index.html
npm run preview   # Produktions-Build lokal testen
npm run lint      # ESLint
```

**`.env` für lokale Entwicklung** (`app/.env`):
```
VITE_DEFAULT_PROVIDER=openrouter
VITE_DEFAULT_MODEL=google/gemini-2.0-flash-001
# Dev-only Keys (nur lokal, nie in Produktion):
# VITE_OPENROUTER_KEY=sk-or-...
# VITE_ANTHROPIC_API_KEY=sk-ant-...
```

---

## 9. Deploy-Workflow

### Frontend

```bash
cd app/
npm run build
scp dist/index.html hetzner:/opt/foerderpilot/static/index.html
# Kein Nginx-Restart nötig
```

### Proxy (nur bei server.js-Änderungen)

```bash
scp deploy/proxy/server.js hetzner:/opt/foerderpilot/proxy/server.js
ssh hetzner "cd /opt/foerderpilot/proxy && docker compose down && docker compose build --no-cache && docker compose up -d"
ssh hetzner "docker logs foerderpilot-proxy --tail 20"
```

### Version erhöhen

In `app/src/App.tsx`:
```typescript
const APP_VERSION = '1.x.0'
```

---

## 10. Server-Zugang

| | |
|--|--|
| **Server-IP** | 195.201.145.97 |
| **SSH-Alias** | `hetzner` |
| **SSH-Befehl** | `ssh hetzner` |
| **Foerderpilot Static** | `/opt/foerderpilot/static/index.html` |
| **Proxy-Config** | `/opt/foerderpilot/proxy/` |
| **Proxy .env** | `/opt/foerderpilot/proxy/.env` |
| **SSL** | Let's Encrypt, gültig bis 2026-06-12 |

**SSH-Config** (`~/.ssh/config`):
```
Host hetzner
  HostName 195.201.145.97
  User root
```

### Weitere Webapps auf demselben Server

| Projekt | Port | Domain |
|---------|------|--------|
| EU AI Act Hub | 3000 | aiact.mmind.space |
| Forklore | 3001 | forklore.mmind.space |
| Vegaluna | 3002 | — |
| **Förderpilot Proxy** | **3003** | **foerderpilot.mmind.space** |

### Server-Keys prüfen

```bash
ssh hetzner "docker logs foerderpilot-proxy --tail 5"
# Zeigt: claude: ✓/✗, openrouter: ✓/✗, openai: ✓/✗

# Key setzen/ändern:
ssh hetzner "cat /opt/foerderpilot/proxy/.env"
ssh hetzner "echo 'OPENROUTER_API_KEY=sk-or-...' >> /opt/foerderpilot/proxy/.env"
ssh hetzner "cd /opt/foerderpilot/proxy && docker compose restart"
```

---

## 11. Daten aktualisieren

```bash
# Root-Level Scripts:
node update-data-v3.js    # Förderungen aktualisieren
node enrich-data-v2.js    # Daten anreichern
```

`KATEGORIEN` in `app/src/data/foerderungen.ts` muss mit den Daten synchron bleiben.

---

## 12. Branding & Links

| | |
|--|--|
| **App-Name** | Förderpilot |
| **App-URL** | https://foerderpilot.mmind.space |
| **mmind.ai** | https://mmind.ai |
| **Datenschutz** | https://mmind.ai/datenschutz |
| **Impressum** | https://mmind.ai/impressum |
| **Footer-Hinweis** | "Daten: März 2026 – Ohne Gewähr" |

---

## 13. Versions-Historie (wichtigste Änderungen)

| Version | Änderung |
|---------|----------|
| v1.5.0 | Neue Kategorie Gründung & Venture, 104 Förderungen |
| v1.6.0 | Neues Header-Bild, Full-Width Desktop Sidebar |
| v1.7.0 | Mobile Nav Überarbeitung, mmind-Logo im Footer |
| v1.9.0 | Consent Modal, Erasmus Footer, Loading View |
| v1.10.0 | OpenRouter als globaler Default via `.env` |
| v1.11.0 | Erasmus-Branding entfernt |
| v1.12.0 | Footer: Datenschutz + Impressum → mmind.ai |
| v1.13.0 | **API-Keys aus Bundle entfernt → nur server-seitig (Sicherheit)** |
