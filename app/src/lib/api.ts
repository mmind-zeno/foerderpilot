import type { ApiResponse, Foerderung } from '../types'
import { SYSTEM_PROMPT } from './systemPrompt'

const MODEL = 'claude-sonnet-4-20250514'

/**
 * API-Endpunkt: In Produktion der Netlify-Proxy (/api/chat),
 * im lokalen Dev direkt zu Anthropic (wenn VITE_ANTHROPIC_API_KEY gesetzt).
 */
const isDev = import.meta.env.DEV
const API_URL = isDev
  ? 'https://api.anthropic.com/v1/messages'
  : '/api/chat'

function extractJson(text: string): string {
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenceMatch) return fenceMatch[1].trim()

  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start !== -1 && end !== -1 && end > start) {
    return text.slice(start, end + 1)
  }

  return text.trim()
}

export async function findFoerderungen(
  userInput: string,
  foerderungen: Foerderung[]
): Promise<ApiResponse> {
  const foerderungenJson = JSON.stringify(foerderungen)

  const body = JSON.stringify({
    model: MODEL,
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Hier ist meine Situation:\n\n${userInput}\n\n---\n\nFörderungsdaten (JSON):\n${foerderungenJson}`,
      },
    ],
  })

  // Im Dev-Modus: direkt zu Anthropic mit API-Key aus Env
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (isDev) {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
    if (apiKey) headers['x-api-key'] = apiKey
    headers['anthropic-version'] = '2023-06-01'
    headers['anthropic-dangerous-direct-browser-access'] = 'true'
  }

  let lastError: Error | null = null

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers,
        body,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMsg = (errorData as { error?: { message?: string } })?.error?.message
        throw new Error(
          `API Fehler ${response.status}: ${errorMsg ?? response.statusText}`
        )
      }

      const data = await response.json() as {
        content: Array<{ type: string; text: string }>
      }

      const rawText = data.content[0]?.text
      if (!rawText) throw new Error('Keine Antwort vom Modell erhalten.')

      const jsonString = extractJson(rawText)
      const parsed = JSON.parse(jsonString) as ApiResponse

      if (!parsed.intro || !Array.isArray(parsed.matches)) {
        throw new Error('Ungültiges Antwortformat vom Modell.')
      }

      parsed.matches.sort((a, b) => {
        if (a.prioritaet === 'hoch' && b.prioritaet !== 'hoch') return -1
        if (a.prioritaet !== 'hoch' && b.prioritaet === 'hoch') return 1
        return 0
      })

      return parsed
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      if (attempt === 0) {
        await new Promise((r) => setTimeout(r, 1000))
      }
    }
  }

  throw lastError!
}
