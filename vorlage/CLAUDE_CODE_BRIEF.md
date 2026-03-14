# 🏗️ Claude Code Brief: Förderpilot
## Ein KI-Tool von mmind.ai | foerderpilot.mmind.space

---

## Projektüberblick

Baue eine **vollständige, produktionsreife Web App** als Lead-Magnet für mmind.ai. Die App hilft Unternehmen, Privatpersonen und Organisationen in Liechtenstein, passende Förderungen via KI-Chat zu finden.

**Datenbasis:** 100 Förderungen (web-verifiziert März 2026)

**Tech Stack:** React + TypeScript + Vite + Tailwind CSS + shadcn/ui  
**KI:** Anthropic Claude API (claude-sonnet-4-20250514) via fetch  
**Bundling:** Single-file HTML über Parcel (siehe SKILL: web-artifacts-builder)  
**Design-Skill:** Lese `/mnt/skills/public/frontend-design/SKILL.md` vor dem Coden!

---

## Sofort lesen vor dem Start

1. `/mnt/skills/examples/web-artifacts-builder/SKILL.md` – Build-Prozess
2. `/mnt/skills/public/frontend-design/SKILL.md` – Design-Richtlinien

---

## Alle Projektdateien

| Datei | Inhalt |
|-------|--------|
| `foerderungen_data.json` | Alle 84 Förderungen als strukturiertes JSON |
| `system_prompt.txt` | System-Prompt für den Claude API-Call |
| `CLAUDE_CODE_BRIEF.md` | Diese Datei |

---

## Features der App

### 1. Hero / Einstieg
- Headline: **"Welche Förderung passt zu dir?"**
- Subline: "100+ Förderungen in Liechtenstein – Förderpilot findet deine in Sekunden."
- Prominentes Chat-Input-Feld mit Placeholder-Text
- Alternativ: 4–5 Quick-Start-Buttons (z.B. "Ich bin ein KMU", "Ich baue ein Haus", "Ich bin Künstler/in", "Ich studiere", "Ich bin Landwirt/in")

### 2. KI-Chat (Kernfunktion)
- Nutzer beschreibt in einem Textfeld seine Situation (Freitext, 1–4 Sätze)
- **API-Call an Claude** mit:
  - System-Prompt aus `system_prompt.txt`
  - User-Message: Situation + die kompletten `foerderungen_data.json` als JSON-String
  - Model: `claude-sonnet-4-20250514`
  - `max_tokens: 2000`
- Claude antwortet im definierten JSON-Format (siehe system_prompt.txt)
- **Ergebnisse** werden als schöne Karten angezeigt:
  - Förderungsname + Anbieter
  - "Warum das passt" (der KI-Text)
  - Förderumfang + Frist
  - Priorität-Badge (hoch/mittel)
  - "Mehr erfahren" Button → öffnet Website in neuem Tab

### 3. Ergebnisseite
- Intro-Text der KI (aus JSON-Response)
- 3–6 Förderungs-Karten, sortiert nach Priorität
- "Nächster Schritt" Box (prominenter Hinweis)
- Optionaler Hinweis-Block
- **CTA-Sektion am Ende:**
  - Text: "Brauchst du Hilfe bei der Antragstellung?"
  - Button: "Kostenlose Erstberatung bei mmind.ai" → Link zu https://mmind.ai
  - Sekundärtext: "mmind.ai begleitet dich von der Fördersuche bis zur Einreichung."

### 4. Filter/Katalog (Sekundärfunktion, Tab oder Scroll-Section)
- Alle Förderungen tabellarisch/als Grid browsebar
- Filter nach: Kategorie, Zielgruppe, Fristtyp
- Suchfeld (live-filter über Name/Anbieter/Tags)
- Jede Karte: Name, Anbieter, Kategorie, Förderumfang, Frist, Link

### 5. Footer
- Logo/Name: **Förderpilot** – powered by mmind.ai (Link zu https://mmind.ai)
- App-URL: https://foerderpilot.mmind.space
- "Daten: Stand März 2026 – Ohne Gewähr"
- Link zu digihub.li als offizielle Beratungsstelle

---

## Design-Vorgaben

**Ästhetik:** Editorial / Informations-Design – klar, vertrauenswürdig, modern. Denke an einen gut gestalteten Schweizer Behördenlook, aber mit digitalem Flair.

**Farben:**
- Primary: Tiefes Blau-Grün (#0D4F6B oder ähnlich) – repräsentiert Liechtenstein, Verlässlichkeit
- Accent: Kräftiges Orangerot (#E8530A oder ähnlich) – für CTAs und Highlights
- Background: Sehr helles Grau oder warmes Off-White (#F8F7F4)
- Text: Dunkelgrau (#1A1A1A)

**Typografie:** Keine Inter! Wähle z.B.:
- Headlines: Fraunces, Playfair Display, oder ähnliches Serif
- Body: Plus Jakarta Sans, DM Sans, oder ähnlich

**Animationen:**
- Sanftes Loading-Skeleton während API-Call
- Staggered Fade-in der Ergebniskarten
- Smooth Scroll-Verhalten

**Keine typischen AI-Ästhetiken:**
- Kein lila Gradient auf weißem Hintergrund
- Keine überrundeten Karten mit dickem Drop-Shadow
- Kein Chatbot-Bubble-Look

---

## Claude API Integration

```typescript
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

async function findFoerderungen(userInput: string): Promise<ApiResponse> {
  const foerderungenJson = JSON.stringify(foerderungenData); // importiertes JSON

  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // API Key wird vom Proxy injiziert – KEIN API KEY im Code!
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: SYSTEM_PROMPT, // aus system_prompt.txt als String-Import
      messages: [
        {
          role: "user",
          content: `Hier ist meine Situation:\n\n${userInput}\n\n---\n\nFörderungsdaten (JSON):\n${foerderungenJson}`
        }
      ]
    })
  });

  const data = await response.json();
  const text = data.content[0].text;
  // JSON-Parse mit Fehlerbehandlung
  return JSON.parse(text);
}
```

**Fehlerbehandlung:**
- Loading-State während API-Call (Skeleton oder Spinner)
- Fallback bei API-Fehler: Freundliche Fehlermeldung + Empfehlung zu digihub.li
- JSON-Parse-Fehler graceful abfangen

---

## Dateistruktur (nach `init-artifact.sh`)

```
foerderungs-finder/
├── src/
│   ├── App.tsx              # Root-Komponente mit Routing/Views
│   ├── components/
│   │   ├── Hero.tsx         # Landing-Bereich mit Input
│   │   ├── ChatInput.tsx    # Texteingabe + Submit
│   │   ├── ResultCards.tsx  # Förderungs-Ergebniskarten
│   │   ├── FilterCatalog.tsx # Browse/Filter-Ansicht
│   │   ├── LoadingSkeleton.tsx
│   │   └── CtaSection.tsx   # mmind.ai CTA
│   ├── data/
│   │   └── foerderungen.ts  # Importiertes JSON + TypeScript-Typen
│   ├── lib/
│   │   ├── api.ts           # Claude API-Call-Logik
│   │   └── systemPrompt.ts  # System-Prompt als Konstante
│   └── types.ts             # TypeScript-Interfaces
├── index.html
└── ...
```

---

## TypeScript-Typen

```typescript
interface Foerderung {
  id: number;
  name: string;
  anbieter: string;
  kategorie: string;
  zielgruppe: string[];
  zielgruppe_text: string;
  foerderumfang: string;
  foerderumfang_max_chf: number | null;
  antragsfrist: string;
  frist_typ: "laufend" | "jährlich" | "mehrmals jährlich" | "antragsprinzip" | "periodisch";
  bedingungen: string;
  website: string;
  tags: string[];
}

interface FoerderungMatch {
  id: number;
  name: string;
  anbieter: string;
  warum_passend: string;
  foerderumfang: string;
  frist: string;
  website: string;
  prioritaet: "hoch" | "mittel";
}

interface ApiResponse {
  intro: string;
  matches: FoerderungMatch[];
  naechster_schritt: string;
  hinweis: string | null;
  cta_text: string;
}
```

---

## Build-Reihenfolge

1. Skills lesen (web-artifacts-builder + frontend-design)
2. `bash scripts/init-artifact.sh foerderungs-finder` ausführen
3. `cd foerderungs-finder`
4. JSON-Daten nach `src/data/foerderungen.ts` kopieren
5. System-Prompt als String in `src/lib/systemPrompt.ts` einfügen
6. TypeScript-Typen definieren
7. Komponenten bauen (Hero → Chat → Results → Catalog → CTA)
8. Styling + Animationen verfeinern
9. `bash scripts/bundle-artifact.sh` ausführen
10. `bundle.html` als Artifact präsentieren

---

## Qualitäts-Checkliste

- [ ] KI-Matching funktioniert mit echtem API-Call
- [ ] Alle 84 Förderungen im Katalog sichtbar
- [ ] Filter nach Kategorie + Zielgruppe funktioniert
- [ ] Loading-State vorhanden
- [ ] Fehlerbehandlung vorhanden
- [ ] CTA mit mmind.ai-Link korrekt
- [ ] Responsive (Mobile + Desktop)
- [ ] Links öffnen in neuem Tab
- [ ] Kein API-Key im Code
- [ ] Design: NICHT generisch-AI-mässig

---

## Branding & Links

- **App-Name:** Förderpilot
- **App-URL:** https://foerderpilot.mmind.space
- **mmind.ai Website:** https://mmind.ai
- **Offizielle Förderberatung FL:** https://digihub.li/services/foerderberatung/
- **Amt für Volkswirtschaft:** https://www.llv.li/de/unternehmen/finanzierung-foerderung
- **Footer-Hinweis:** "Förderungsdaten: Stand März 2026. Ohne Gewähr. Bitte prüfen Sie aktuelle Informationen direkt bei den Förderstellen."
