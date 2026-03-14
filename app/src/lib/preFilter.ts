import type { Foerderung } from '../types'

/**
 * Client-seitiger Vorfilter: Reduziert die 100 Einträge auf die ~25-35
 * relevantesten anhand von Keyword-Matching auf Tags, Zielgruppe, Name und Kategorie.
 * Sendet nur diese gefilterten Daten an die Claude API → ~60% weniger Input-Tokens.
 * Falls < 10 Treffer: vollständige Liste zurückgeben.
 */
export function preFilterFoerderungen(
  userInput: string,
  allData: Foerderung[],
  maxResults = 35
): Foerderung[] {
  const text = userInput.toLowerCase()

  // Extrahiere relevante Schlüsselwörter aus dem User-Input
  const keywords = extractKeywords(text)

  if (keywords.length === 0) return allData

  // Scoring: Jede Förderung bekommt einen Score
  const scored = allData.map((f) => {
    let score = 0
    const searchable = [
      f.name.toLowerCase(),
      f.anbieter.toLowerCase(),
      f.kategorie.toLowerCase(),
      f.zielgruppe_text.toLowerCase(),
      ...f.zielgruppe.map((z) => z.toLowerCase()),
      ...f.tags.map((t) => t.toLowerCase()),
      f.bedingungen.toLowerCase(),
    ].join(' ')

    for (const kw of keywords) {
      if (searchable.includes(kw)) {
        // Höherer Score wenn im Tag/Zielgruppe vs. Bedingungen
        if (f.tags.some((t) => t.toLowerCase().includes(kw))) score += 3
        if (f.zielgruppe.some((z) => z.toLowerCase().includes(kw))) score += 3
        if (f.name.toLowerCase().includes(kw)) score += 2
        if (f.kategorie.toLowerCase().includes(kw)) score += 2
        score += 1
      }
    }

    return { foerderung: f, score }
  })

  const filtered = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map((s) => s.foerderung)

  // Mindestens 10 Ergebnisse, sonst alles zurückgeben
  return filtered.length >= 10 ? filtered : allData
}

const KEYWORD_MAP: Record<string, string[]> = {
  kmu: ['kmu', 'kleines', 'mittleres', 'unternehmen', 'betrieb', 'firma', 'mitarbeitende'],
  startup: ['startup', 'gründung', 'gründen', 'jungunternehmer', 'neu'],
  innovation: ['innovation', 'innovativ', 'forschung', 'entwicklung', 'r&d', 'f&e'],
  digitalisierung: ['digital', 'digitalisierung', 'software', 'app', 'ki', 'ai', 'technologie'],
  energie: ['energie', 'solar', 'photovoltaik', 'wärmepumpe', 'heizung', 'sanierung', 'dämmung', 'haus', 'gebäude', 'minergie'],
  kultur: ['kunst', 'kultur', 'musik', 'theater', 'film', 'fotografie', 'literatur', 'künstler'],
  bildung: ['studium', 'studieren', 'schule', 'ausbildung', 'weiterbildung', 'stipendium', 'bildung'],
  jugend: ['jugend', 'jung', 'kinder', 'verein', 'sport'],
  landwirtschaft: ['landwirt', 'bauer', 'agrar', 'feld', 'tier', 'vieh', 'alpen', 'wald', 'forst'],
  sozial: ['sozial', 'miete', 'armut', 'bedürftig', 'familie', 'pflege', 'gesundheit'],
  international: ['international', 'export', 'ausland', 'europa', 'eu', 'bodensee'],
  stiftung: ['stiftung', 'verein', 'npo', 'gemeinnützig'],
  umwelt: ['umwelt', 'klima', 'nachhaltigkeit', 'biodiversität', 'naturschutz'],
}

function extractKeywords(text: string): string[] {
  const found = new Set<string>()

  for (const [category, terms] of Object.entries(KEYWORD_MAP)) {
    if (terms.some((t) => text.includes(t))) {
      found.add(category)
      terms.filter((t) => text.includes(t)).forEach((t) => found.add(t))
    }
  }

  // Auch direkte Wörter aus dem Input extrahieren (Wörter > 3 Zeichen)
  const words = text.split(/\s+/).filter((w) => w.length > 3)
  words.forEach((w) => found.add(w))

  return Array.from(found)
}
