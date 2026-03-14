# Förderpilot – Implementierungsplan

## Analyse der Vorlagen-Dateien

### foerderungen_data.json
- 100 Einträge, IDs 1–100, keine Duplikate
- 9 Kategorien, 30 Zielgruppen-Werte, 5 Fristtypen
- 93/100 Einträge haben `foerderumfang_max_chf = null`
- JSON-Größe: ~60KB (als Prompt-Input relevant)

### system_prompt.txt
- Antwortet IMMER als reines JSON-Objekt
- Schema: intro, matches[], naechster_schritt, hinweis, cta_text
- Priorität: "hoch" | "mittel"

### CLAUDE_CODE_BRIEF.md
- React + TypeScript + Vite + Tailwind
- Model: claude-sonnet-4-20250514, max_tokens: 2000
- Kein API-Key im Code (Proxy-Injection)
- Single-file HTML Output

---

## Tech Stack (angepasst für lokales Dev)

| Was | Gewählt |
|-----|---------|
| Framework | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS v3 + PostCSS |
| UI-Lib | KEINE shadcn/ui – pure Tailwind (einfacher, kein CLI-Setup) |
| Fonts | Google Fonts via `<link>` (Fraunces + Plus Jakarta Sans) |
| Output | `vite-plugin-singlefile` → bundle.html |
| API-Key | `VITE_ANTHROPIC_API_KEY` env var (lokaler Dev) |

---

## Verbesserungen gegenüber Brief

1. **Client-Side Pre-Filter**: Bevor der API-Call gesendet wird, filtert eine
   einfache Keyword-Funktion die 100 Einträge auf ~25–35 relevanteste.
   → Reduziert Input-Tokens ~60%, beschleunigt Response um ~3–5s.
   Falls < 10 Treffer: vollständiges JSON senden.

2. **Quick-Start Buttons füllen Input**: Klick auf "Ich bin ein KMU" trägt
   Beispieltext ins Textarea ein (kein separater API-Call).

3. **Tab-Navigation**: Zwei Tabs – "KI-Suche" und "Alle Förderungen" –
   persistent im URL-Hash (/#catalog, /#search).

4. **sessionStorage**: Letztes Ergebnis wird gespeichert → Browser-Back
   zeigt Ergebnisse wieder ohne neuen API-Call.

5. **Retry bei Netzwerkfehler**: Einmaliger automatischer Retry.

6. **JSON Fence Stripping**: Falls Claude trotzdem Backticks liefert,
   wird der JSON-Block extrahiert.

7. **Keyboard**: Ctrl+Enter oder Cmd+Enter sendet das Formular.

8. **Priorität-Sortierung**: "hoch" immer vor "mittel" in ResultCards.

9. **Katalog-Filter**: Live-Filter über Name/Anbieter/Tags (Debounce 200ms).

---

## Dateistruktur

```
foerderpilot/app/
├── src/
│   ├── App.tsx               # Root, Tab/View-Routing
│   ├── components/
│   │   ├── Hero.tsx          # Landing mit Input + Quick-Buttons
│   │   ├── ResultCards.tsx   # Ergebniskarten + CTA
│   │   ├── FilterCatalog.tsx # Browse + Filter
│   │   └── LoadingSkeleton.tsx
│   ├── data/
│   │   └── foerderungen.ts   # JSON-Import + TypeScript-Typen
│   ├── lib/
│   │   ├── api.ts            # Claude-API-Logik
│   │   ├── systemPrompt.ts   # Prompt-Konstante
│   │   └── preFilter.ts      # Client-Side Vorfilterung
│   └── types.ts
├── index.html                # Fonts-Links
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
└── tsconfig.json
```

---

## Build-Reihenfolge

1. [x] Vorlage lesen & analysieren
2. [ ] `npm create vite` → app/
3. [ ] Dependencies installieren
4. [ ] tailwind.config + theme (Farben + Fonts)
5. [ ] types.ts schreiben
6. [ ] foerderungen.ts (JSON-Import)
7. [ ] systemPrompt.ts
8. [ ] preFilter.ts (keyword matching)
9. [ ] api.ts (Claude-Call + error handling)
10. [ ] LoadingSkeleton.tsx
11. [ ] ResultCards.tsx
12. [ ] FilterCatalog.tsx
13. [ ] Hero.tsx
14. [ ] App.tsx
15. [ ] index.html (Fonts)
16. [ ] `npm run build` → bundle.html
