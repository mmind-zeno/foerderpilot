import type { ApiResponse, Foerderung } from '../types'
import { SYSTEM_PROMPT } from './systemPrompt'

// ─── Provider types ─────────────────────────────────────────────────────────

export type LLMProvider = 'claude' | 'openai' | 'gemini' | 'openrouter'

export interface ProviderConfig {
  provider: LLMProvider
  apiKey: string
  model: string
}

export const DEFAULT_MODELS: Record<LLMProvider, string> = {
  claude: 'claude-sonnet-4-20250514',
  openai: 'gpt-4o',
  gemini: 'gemini-2.0-flash',
  openrouter: 'openai/gpt-4o',
}

export const PROVIDER_LABELS: Record<LLMProvider, string> = {
  claude: 'Claude (Anthropic)',
  openai: 'OpenAI',
  gemini: 'Google Gemini',
  openrouter: 'OpenRouter',
}

export const OPENAI_MODELS = ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-4', 'o1-mini', 'o3-mini']
export const GEMINI_MODELS = ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-pro', 'gemini-1.5-flash']
export const OPENROUTER_MODELS = [
  // ── Gratis (empfohlen für Produktion) ──
  'google/gemini-2.0-flash-exp:free',       // ★ Beste Wahl: 1M Kontext, gutes Deutsch, JSON-sicher
  'meta-llama/llama-3.3-70b-instruct:free', // ★ Llama 70B: explizit Deutsch, 128k Kontext
  'deepseek/deepseek-v3-0324:free',         // DeepSeek V3: starkes Reasoning
  'mistralai/mistral-small-3.1-24b-instruct:free', // Mistral: 128k, multilingual
  // ── Bezahlmodelle ──
  'openai/gpt-4o',
  'openai/gpt-4o-mini',
  'anthropic/claude-sonnet-4-5',
  'anthropic/claude-3-5-haiku',
  'google/gemini-2.0-flash-001',
  'meta-llama/llama-3.3-70b-instruct',
  'mistralai/mistral-large',
  'deepseek/deepseek-chat-v3-0324',
]

// ─── Config helpers ──────────────────────────────────────────────────────────

export function getProviderConfig(): ProviderConfig {
  const provider = (localStorage.getItem('fp_llm_provider') || 'claude') as LLMProvider
  const apiKey = localStorage.getItem(`fp_${provider}_key`) || ''
  const model = localStorage.getItem(`fp_${provider}_model`) || DEFAULT_MODELS[provider]
  return { provider, apiKey, model }
}

export function saveProviderConfig(config: ProviderConfig) {
  localStorage.setItem('fp_llm_provider', config.provider)
  if (config.apiKey) localStorage.setItem(`fp_${config.provider}_key`, config.apiKey)
  if (config.model) localStorage.setItem(`fp_${config.provider}_model`, config.model)
}

// ─── JSON extraction ─────────────────────────────────────────────────────────

function extractJson(text: string): string {
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenceMatch) return fenceMatch[1].trim()
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start !== -1 && end !== -1 && end > start) return text.slice(start, end + 1)
  return text.trim()
}

// ─── Provider-specific call builders ────────────────────────────────────────

const isDev = import.meta.env.DEV

async function callClaude(userMessage: string): Promise<string> {
  const url = isDev ? 'https://api.anthropic.com/v1/messages' : '/api/chat'
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }

  if (isDev) {
    const key = import.meta.env.VITE_ANTHROPIC_API_KEY
    if (key) headers['x-api-key'] = key
    headers['anthropic-version'] = '2023-06-01'
    headers['anthropic-dangerous-direct-browser-access'] = 'true'
  }

  // Check if a custom Claude API key is stored in admin settings
  const storedKey = localStorage.getItem('fp_claude_key')
  if (storedKey) {
    headers['x-api-key'] = storedKey
    headers['anthropic-version'] = '2023-06-01'
    headers['anthropic-dangerous-direct-browser-access'] = 'true'
  }

  const model = localStorage.getItem('fp_claude_model') || DEFAULT_MODELS.claude

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    const msg = (err as { error?: { message?: string } })?.error?.message
    throw new Error(`Claude API Fehler ${response.status}: ${msg ?? response.statusText}`)
  }

  const data = await response.json() as { content: Array<{ type: string; text: string }> }
  const text = data.content[0]?.text
  if (!text) throw new Error('Keine Antwort von Claude erhalten.')
  return text
}

async function callOpenAI(userMessage: string, config: ProviderConfig): Promise<string> {
  if (!config.apiKey) throw new Error('OpenAI API-Key fehlt. Bitte in den Admin-Einstellungen hinterlegen.')

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: 2000,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    const msg = (err as { error?: { message?: string } })?.error?.message
    throw new Error(`OpenAI API Fehler ${response.status}: ${msg ?? response.statusText}`)
  }

  const data = await response.json() as { choices: Array<{ message: { content: string } }> }
  const text = data.choices[0]?.message?.content
  if (!text) throw new Error('Keine Antwort von OpenAI erhalten.')
  return text
}

async function callGemini(userMessage: string, config: ProviderConfig): Promise<string> {
  if (!config.apiKey) throw new Error('Gemini API-Key fehlt. Bitte in den Admin-Einstellungen hinterlegen.')

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${config.apiKey}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        role: 'user',
        parts: [{ text: `${SYSTEM_PROMPT}\n\n---\n\n${userMessage}` }],
      }],
      generationConfig: { maxOutputTokens: 2000 },
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    const msg = (err as { error?: { message?: string } })?.error?.message
    throw new Error(`Gemini API Fehler ${response.status}: ${msg ?? response.statusText}`)
  }

  const data = await response.json() as { candidates: Array<{ content: { parts: Array<{ text: string }> } }> }
  const text = data.candidates[0]?.content?.parts[0]?.text
  if (!text) throw new Error('Keine Antwort von Gemini erhalten.')
  return text
}

async function callOpenRouter(userMessage: string, config: ProviderConfig): Promise<string> {
  if (!config.apiKey) throw new Error('OpenRouter API-Key fehlt. Bitte in den Admin-Einstellungen hinterlegen.')

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
      'HTTP-Referer': 'https://foerderpilot.mmind.space',
      'X-Title': 'Förderpilot',
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: 2000,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    const msg = (err as { error?: { message?: string } })?.error?.message
    throw new Error(`OpenRouter API Fehler ${response.status}: ${msg ?? response.statusText}`)
  }

  const data = await response.json() as { choices: Array<{ message: { content: string } }> }
  const text = data.choices[0]?.message?.content
  if (!text) throw new Error('Keine Antwort von OpenRouter erhalten.')
  return text
}

// ─── Main export ─────────────────────────────────────────────────────────────

export async function findFoerderungen(
  userInput: string,
  foerderungen: Foerderung[]
): Promise<ApiResponse> {
  const config = getProviderConfig()
  const foerderungenJson = JSON.stringify(foerderungen)
  const userMessage = `Hier ist meine Situation:\n\n${userInput}\n\n---\n\nFörderungsdaten (JSON):\n${foerderungenJson}`

  let lastError: Error | null = null

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      let rawText: string

      switch (config.provider) {
        case 'openai':
          rawText = await callOpenAI(userMessage, config)
          break
        case 'gemini':
          rawText = await callGemini(userMessage, config)
          break
        case 'openrouter':
          rawText = await callOpenRouter(userMessage, config)
          break
        default:
          rawText = await callClaude(userMessage)
      }

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
      if (attempt === 0) await new Promise((r) => setTimeout(r, 1000))
    }
  }

  throw lastError!
}

// ─── Test connection ──────────────────────────────────────────────────────────

export async function testProviderConnection(config: ProviderConfig): Promise<string> {
  const testMsg = 'Antworte nur mit dem JSON: {"status":"ok","provider":"' + config.provider + '"}'
  const miniMsg = `Test-Anfrage zur Verbindungsprüfung:\n${testMsg}`

  switch (config.provider) {
    case 'openai':
      await callOpenAI(miniMsg, config)
      return `OpenAI (${config.model}) verbunden`
    case 'gemini':
      await callGemini(miniMsg, config)
      return `Gemini (${config.model}) verbunden`
    case 'openrouter':
      await callOpenRouter(miniMsg, config)
      return `OpenRouter (${config.model}) verbunden`
    default:
      await callClaude(miniMsg)
      return `Claude (${config.model}) verbunden`
  }
}
