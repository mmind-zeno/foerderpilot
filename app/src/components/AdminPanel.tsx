import { useState } from 'react'
import { foerderungenData, KATEGORIEN } from '../data/foerderungen'
import type { Foerderung } from '../types'
import {
  getProviderConfig, saveProviderConfig, testProviderConnection,
  DEFAULT_MODELS, PROVIDER_LABELS, OPENAI_MODELS, GEMINI_MODELS, OPENROUTER_MODELS,
  type LLMProvider, type ProviderConfig,
} from '../lib/api'

const ADMIN_PASSWORD = 'fp2026admin'
const AUTH_KEY = 'fp_admin_auth'

interface Props {
  onExit: () => void
  version: string
}

// ─── Password Gate ────────────────────────────────────────────────────────────

function PasswordGate({ onSuccess, onExit }: { onSuccess: () => void; onExit: () => void }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)

  const handleLogin = () => {
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, '1')
      onSuccess()
    } else {
      setError(true)
      setPw('')
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'radial-gradient(ellipse at center, #0D4F6B 0%, #093847 100%)' }}>
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 w-full max-w-sm shadow-2xl animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="white" strokeWidth="1.5" />
              <path d="M7 11V7a5 5 0 0110 0v4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="font-headline text-xl font-semibold text-white mb-1">Admin-Bereich</h2>
          <p className="text-white/50 text-sm">Förderpilot · interner Bereich</p>
        </div>
        <div className="space-y-3">
          <input
            type="password"
            value={pw}
            onChange={e => { setPw(e.target.value); setError(false) }}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="Passwort"
            autoFocus
            className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-white/30 focus:outline-none focus:ring-2 text-sm ${
              error ? 'border-red-400 focus:ring-red-400/30' : 'border-white/20 focus:ring-white/30'
            }`}
          />
          {error && <p className="text-red-300 text-xs text-center">Falsches Passwort</p>}
          <button onClick={handleLogin}
            className="w-full bg-white text-[#093847] font-semibold py-3 rounded-xl hover:bg-white/90 transition-colors text-sm">
            Anmelden
          </button>
          <button onClick={onExit}
            className="w-full text-white/40 hover:text-white/70 transition-colors text-sm py-1">
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Einstellungen Tab ────────────────────────────────────────────────────────

function EinstellungenTab({ version }: { version: string }) {
  const [config, setConfig] = useState<ProviderConfig>(getProviderConfig)
  const [keys, setKeys] = useState({
    claude: localStorage.getItem('fp_claude_key') || '',
    openai: localStorage.getItem('fp_openai_key') || '',
    gemini: localStorage.getItem('fp_gemini_key') || '',
    openrouter: localStorage.getItem('fp_openrouter_key') || '',
  })
  const [models, setModels] = useState({
    claude: localStorage.getItem('fp_claude_model') || DEFAULT_MODELS.claude,
    openai: localStorage.getItem('fp_openai_model') || DEFAULT_MODELS.openai,
    gemini: localStorage.getItem('fp_gemini_model') || DEFAULT_MODELS.gemini,
    openrouter: localStorage.getItem('fp_openrouter_model') || DEFAULT_MODELS.openrouter,
  })
  const [saved, setSaved] = useState(false)
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'ok' | 'error'>('idle')
  const [testMsg, setTestMsg] = useState('')
  const [showKey, setShowKey] = useState<Record<LLMProvider, boolean>>({
    claude: false, openai: false, gemini: false, openrouter: false,
  })

  const currentKey = keys[config.provider]
  const currentModel = models[config.provider]

  const handleSave = () => {
    const finalConfig: ProviderConfig = { provider: config.provider, apiKey: currentKey, model: currentModel }
    saveProviderConfig(finalConfig)
    // Save all keys/models
    ;(['claude', 'openai', 'gemini', 'openrouter'] as LLMProvider[]).forEach(p => {
      if (keys[p]) localStorage.setItem(`fp_${p}_key`, keys[p])
      localStorage.setItem(`fp_${p}_model`, models[p])
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleTest = async () => {
    setTestStatus('testing')
    setTestMsg('')
    try {
      const msg = await testProviderConnection({ provider: config.provider, apiKey: currentKey, model: currentModel })
      setTestStatus('ok')
      setTestMsg(msg)
    } catch (e) {
      setTestStatus('error')
      setTestMsg(e instanceof Error ? e.message : 'Verbindungsfehler')
    }
  }

  const providers: LLMProvider[] = ['claude', 'openai', 'gemini', 'openrouter']
  const modelOptions: Record<LLMProvider, string[]> = {
    claude: ['claude-sonnet-4-20250514', 'claude-opus-4-5', 'claude-haiku-4-5-20251001', 'claude-3-5-sonnet-20241022'],
    openai: OPENAI_MODELS,
    gemini: GEMINI_MODELS,
    openrouter: OPENROUTER_MODELS,
  }

  const providerDocs: Record<LLMProvider, { url: string; note: string }> = {
    claude: { url: 'https://console.anthropic.com', note: 'Standard – Server-Proxy ohne API-Key. Eigener Key optional.' },
    openai: { url: 'https://platform.openai.com/api-keys', note: 'API-Key aus dem OpenAI-Dashboard.' },
    gemini: { url: 'https://aistudio.google.com/app/apikey', note: 'API-Key aus Google AI Studio (kostenlos verfügbar).' },
    openrouter: { url: 'https://openrouter.ai/keys', note: 'Ein API-Key für viele Modelle. Günstig und flexibel.' },
  }

  return (
    <div className="animate-fade-in max-w-2xl">
      <h2 className="font-headline text-2xl font-semibold text-[#1A1A1A] mb-1">LLM-Einstellungen</h2>
      <p className="text-sm text-[#9B998F] mb-8">
        Wähle den KI-Anbieter für die Förderungssuche. Standard ist Claude via Server-Proxy (kein Key nötig).
        Aktivierter Anbieter: <span className="font-semibold text-[#0D4F6B]">{PROVIDER_LABELS[config.provider]}</span> · v{version}
      </p>

      {/* Provider Selection */}
      <div className="bg-white border border-[#D4D1CB] rounded-2xl p-6 mb-6 shadow-sm">
        <h3 className="font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-[#0D4F6B] inline-block" />
          KI-Anbieter auswählen
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {providers.map(p => (
            <button
              key={p}
              onClick={() => setConfig(c => ({ ...c, provider: p }))}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                config.provider === p
                  ? 'border-[#0D4F6B] bg-[#F0F7FB]'
                  : 'border-[#D4D1CB] hover:border-[#0D4F6B]/40'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                config.provider === p ? 'border-[#0D4F6B] bg-[#0D4F6B]' : 'border-[#D4D1CB]'
              }`}>
                {config.provider === p && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <div>
                <div className={`text-sm font-semibold ${config.provider === p ? 'text-[#0D4F6B]' : 'text-[#1A1A1A]'}`}>
                  {PROVIDER_LABELS[p]}
                </div>
                {p === 'claude' && <div className="text-xs text-emerald-600 font-medium">Standard</div>}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Provider Config */}
      <div className="bg-white border border-[#D4D1CB] rounded-2xl p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#1A1A1A] flex items-center gap-2">
            <span className="w-1 h-4 rounded-full bg-[#E8530A] inline-block" />
            {PROVIDER_LABELS[config.provider]} – Konfiguration
          </h3>
          <a href={providerDocs[config.provider].url} target="_blank" rel="noopener noreferrer"
            className="text-xs text-[#0D4F6B] hover:text-[#E8530A] underline transition-colors">
            API-Key holen ↗
          </a>
        </div>
        <p className="text-xs text-[#9B998F] mb-4 bg-[#F8F7F4] rounded-lg px-3 py-2">
          {providerDocs[config.provider].note}
        </p>

        {/* API Key */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-[#6B6860] uppercase tracking-wider mb-1.5">
            API-Key {config.provider === 'claude' ? '(optional)' : '(erforderlich)'}
          </label>
          <div className="relative">
            <input
              type={showKey[config.provider] ? 'text' : 'password'}
              value={keys[config.provider]}
              onChange={e => setKeys(k => ({ ...k, [config.provider]: e.target.value }))}
              placeholder={config.provider === 'claude' ? 'sk-ant-… (leer = Server-Proxy)' : `API-Key für ${PROVIDER_LABELS[config.provider]}`}
              className="w-full px-4 py-2.5 text-sm border border-[#D4D1CB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D4F6B]/30 focus:border-[#0D4F6B] bg-[#F8F7F4] font-mono pr-10"
            />
            <button
              onClick={() => setShowKey(s => ({ ...s, [config.provider]: !s[config.provider] }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B998F] hover:text-[#1A1A1A] transition-colors"
            >
              {showKey[config.provider] ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.4"/>
                  <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M1 1l14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.4"/>
                  <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Model Selection */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-[#6B6860] uppercase tracking-wider mb-1.5">Modell</label>
          <select
            value={models[config.provider]}
            onChange={e => setModels(m => ({ ...m, [config.provider]: e.target.value }))}
            className="w-full px-4 py-2.5 text-sm border border-[#D4D1CB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D4F6B]/30 focus:border-[#0D4F6B] bg-[#F8F7F4]"
          >
            {modelOptions[config.provider].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          {/* Custom model input for OpenRouter */}
          {config.provider === 'openrouter' && (
            <div className="mt-2">
              <input
                type="text"
                value={models.openrouter}
                onChange={e => setModels(m => ({ ...m, openrouter: e.target.value }))}
                placeholder="Oder eigenes Modell eingeben, z.B. meta-llama/llama-3.3-70b-instruct"
                className="w-full px-4 py-2 text-xs border border-[#D4D1CB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D4F6B]/30 bg-[#F8F7F4] font-mono"
              />
            </div>
          )}
        </div>

        {/* Test + Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleTest}
            disabled={testStatus === 'testing'}
            className="flex items-center gap-2 text-sm font-semibold text-[#0D4F6B] border border-[#0D4F6B] hover:bg-[#F0F7FB] px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
          >
            {testStatus === 'testing' ? (
              <><svg className="animate-spin w-4 h-4" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="10"/></svg>Testen…</>
            ) : (
              <>Verbindung testen</>
            )}
          </button>
          {testStatus === 'ok' && (
            <span className="text-sm text-emerald-700 font-medium flex items-center gap-1.5">
              <span className="text-emerald-500">✓</span> {testMsg}
            </span>
          )}
          {testStatus === 'error' && (
            <span className="text-sm text-red-600 flex items-center gap-1.5">
              <span>✕</span> {testMsg}
            </span>
          )}
        </div>
      </div>

      {/* All stored keys overview */}
      <div className="bg-[#F8F7F4] border border-[#D4D1CB] rounded-2xl p-5 mb-6">
        <h3 className="font-semibold text-[#6B6860] text-sm mb-3 uppercase tracking-wider">Gespeicherte Keys</h3>
        <div className="space-y-2">
          {providers.map(p => {
            const hasKey = !!(localStorage.getItem(`fp_${p}_key`))
            return (
              <div key={p} className="flex items-center justify-between text-sm">
                <span className="text-[#6B6860]">{PROVIDER_LABELS[p]}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    hasKey ? 'bg-emerald-100 text-emerald-700' : 'bg-[#EAE8E4] text-[#9B998F]'
                  }`}>
                    {hasKey ? 'Key gespeichert' : 'Kein Key'}
                  </span>
                  {hasKey && (
                    <button
                      onClick={() => {
                        localStorage.removeItem(`fp_${p}_key`)
                        setKeys(k => ({ ...k, [p]: '' }))
                      }}
                      className="text-xs text-red-400 hover:text-red-600 transition-colors"
                    >
                      Löschen
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className={`w-full font-semibold py-3 rounded-xl transition-all ${
          saved
            ? 'bg-emerald-600 text-white'
            : 'bg-[#0D4F6B] hover:bg-[#093847] text-white'
        }`}
      >
        {saved ? '✓ Gespeichert' : 'Einstellungen speichern'}
      </button>
    </div>
  )
}

// ─── Dashboard Tab ────────────────────────────────────────────────────────────

function DashboardTab({ version }: { version: string }) {
  const config = getProviderConfig()
  const categoryStats = KATEGORIEN.map(k => ({
    name: k,
    count: foerderungenData.filter((f: Foerderung) => f.kategorie === k).length,
  })).sort((a, b) => b.count - a.count)

  return (
    <div className="animate-fade-in">
      <h2 className="font-headline text-2xl font-semibold text-[#1A1A1A] mb-6">Übersicht</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Förderungen', value: String(foerderungenData.length), sub: 'total erfasst', color: '#0D4F6B' },
          { label: 'Kategorien', value: String(KATEGORIEN.length), sub: 'Bereiche', color: '#1a6d8f' },
          { label: 'Version', value: `v${version}`, sub: 'aktuell', color: '#E8530A' },
          { label: 'Aktiver LLM', value: PROVIDER_LABELS[config.provider].split(' ')[0], sub: config.model.split('/').pop() || '', color: '#6B6860' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="bg-white border border-[#D4D1CB] rounded-2xl p-5 shadow-sm">
            <div className="text-2xl font-headline font-bold mb-1" style={{ color }}>{value}</div>
            <div className="text-sm font-semibold text-[#1A1A1A]">{label}</div>
            <div className="text-xs text-[#9B998F] mt-0.5 truncate">{sub}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#D4D1CB] rounded-2xl p-6 shadow-sm">
        <h3 className="font-semibold text-[#1A1A1A] mb-5 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-[#0D4F6B] inline-block" />
          Förderungen nach Kategorie
        </h3>
        <div className="space-y-3">
          {categoryStats.map(({ name, count }) => (
            <div key={name} className="flex items-center gap-3">
              <span className="text-sm text-[#6B6860] shrink-0" style={{ width: '220px' }}>{name}</span>
              <div className="flex-1 bg-[#EAE8E4] rounded-full h-2">
                <div className="h-2 rounded-full"
                  style={{ width: `${(count / foerderungenData.length) * 100}%`, background: 'linear-gradient(90deg, #0D4F6B, #1a6d8f)' }} />
              </div>
              <span className="text-sm font-semibold text-[#1A1A1A] w-8 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
        <strong>Admin-URL:</strong> <code className="font-mono bg-amber-100 px-1 rounded">#admin</code> · Passwort-geschützt · Nicht im Menü sichtbar
      </div>
    </div>
  )
}

// ─── Förderungen Table Tab ────────────────────────────────────────────────────

const FRIST_COLOR: Record<string, string> = {
  laufend: 'bg-emerald-100 text-emerald-800',
  jährlich: 'bg-blue-100 text-blue-800',
  'mehrmals jährlich': 'bg-purple-100 text-purple-800',
  antragsprinzip: 'bg-amber-100 text-amber-800',
  periodisch: 'bg-slate-100 text-slate-700',
}

function FoerderungenTab() {
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<number | null>(null)

  const filtered = search.trim()
    ? foerderungenData.filter((f: Foerderung) =>
        [f.name, f.anbieter, f.kategorie, f.zielgruppe_text, f.bedingungen, ...f.tags].join(' ')
          .toLowerCase().includes(search.toLowerCase())
      )
    : foerderungenData

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-headline text-2xl font-semibold text-[#1A1A1A]">Alle Förderungen</h2>
        <span className="text-sm text-[#9B998F] bg-white border border-[#D4D1CB] px-3 py-1 rounded-lg">
          {filtered.length} / {foerderungenData.length}
        </span>
      </div>

      <div className="relative mb-4">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9B998F]" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M10 10L13.5 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
        <input
          type="text"
          value={search}
          onChange={e => { setSearch(e.target.value); setExpanded(null) }}
          placeholder="Suche in Name, Anbieter, Kategorie, Bedingungen, Tags…"
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-[#D4D1CB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D4F6B]/30 focus:border-[#0D4F6B] bg-white shadow-sm"
        />
      </div>

      <div className="space-y-2">
        {filtered.map((f: Foerderung) => (
          <div key={f.id} className="bg-white border border-[#D4D1CB] rounded-xl overflow-hidden shadow-sm hover:border-[#0D4F6B]/30 transition-colors">
            {/* Row header */}
            <button
              className="w-full text-left px-5 py-4 flex items-start gap-4"
              onClick={() => setExpanded(expanded === f.id ? null : f.id)}
            >
              <span className="text-xs font-mono text-[#9B998F] pt-0.5 w-6 shrink-0 text-right">{f.id}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[#1A1A1A] text-[14px] leading-snug">{f.name}</div>
                    <div className="text-xs text-[#6B6860] mt-0.5">{f.anbieter}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${FRIST_COLOR[f.frist_typ] || 'bg-gray-100 text-gray-700'}`}>
                      {f.frist_typ}
                    </span>
                    <span className="text-[11px] bg-[#EAE8E4] text-[#6B6860] px-2 py-0.5 rounded-full hidden sm:block">{f.kategorie}</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                      className={`text-[#9B998F] transition-transform ${expanded === f.id ? 'rotate-180' : ''}`}>
                      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <div className="text-xs text-[#9B998F] mt-1">{f.foerderumfang}</div>
              </div>
            </button>

            {/* Expanded details */}
            {expanded === f.id && (
              <div className="px-5 pb-5 pt-0 border-t border-[#F0EDE6] bg-[#FAFAF8] space-y-4">

                {/* Meta grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                  <div>
                    <div className="text-[10px] font-bold text-[#9B998F] uppercase tracking-widest mb-1">Förderumfang</div>
                    <div className="text-sm text-[#1A1A1A]">{f.foerderumfang}</div>
                    {f.foerderumfang_max_chf && (
                      <div className="text-xs text-[#6B6860] mt-0.5">Max: CHF {f.foerderumfang_max_chf.toLocaleString('de-CH')}</div>
                    )}
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[#9B998F] uppercase tracking-widest mb-1">Antragsfrist</div>
                    <div className="text-sm text-[#1A1A1A]">{f.antragsfrist}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[#9B998F] uppercase tracking-widest mb-1">Zielgruppe</div>
                    <div className="text-sm text-[#1A1A1A]">{f.zielgruppe_text}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[#9B998F] uppercase tracking-widest mb-1">Kategorie</div>
                    <div className="text-sm text-[#1A1A1A]">{f.kategorie}</div>
                  </div>
                </div>

                {/* Bedingungen */}
                <div>
                  <div className="text-[10px] font-bold text-[#9B998F] uppercase tracking-widest mb-1">Bedingungen & Details</div>
                  <div className="text-sm text-[#3A3A3A] leading-relaxed bg-white border border-[#EAE8E4] rounded-lg p-3">{f.bedingungen}</div>
                </div>

                {/* Contact info */}
                {(f.kontakt_email || f.kontakt_tel || f.antrag_url) && (
                  <div>
                    <div className="text-[10px] font-bold text-[#9B998F] uppercase tracking-widest mb-2">Kontakt & Antrag</div>
                    <div className="flex flex-wrap gap-3">
                      {f.kontakt_email && (
                        <a href={`mailto:${f.kontakt_email}`}
                          className="flex items-center gap-1.5 text-sm text-[#0D4F6B] hover:text-[#E8530A] transition-colors">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <rect x="1" y="2.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                            <path d="M1 4l6 4 6-4" stroke="currentColor" strokeWidth="1.3"/>
                          </svg>
                          {f.kontakt_email}
                        </a>
                      )}
                      {f.kontakt_tel && (
                        <a href={`tel:${f.kontakt_tel}`}
                          className="flex items-center gap-1.5 text-sm text-[#0D4F6B] hover:text-[#E8530A] transition-colors">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2 2h3l1.5 3.5-2 1.2A8.5 8.5 0 007.3 10l1.2-2L12 9.5V12a1 1 0 01-1 1C5 13 1 9 1 3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.3"/>
                          </svg>
                          {f.kontakt_tel}
                        </a>
                      )}
                      {f.antrag_url && (
                        <a href={f.antrag_url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm font-semibold text-[#E8530A] hover:underline transition-colors">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2 12L12 2M12 2H7M12 2v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Direkt zum Antrag
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {f.tags.map(t => (
                    <span key={t} className="text-[11px] bg-[#EAE8E4] text-[#6B6860] px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>

                {/* Website link */}
                <a href={f.website} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#0D4F6B] hover:text-[#E8530A] transition-colors font-medium">
                  Website besuchen
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1 9L9 1M9 1H5M9 1v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main AdminPanel ──────────────────────────────────────────────────────────

type AdminTab = 'dashboard' | 'foerderungen' | 'einstellungen'

export default function AdminPanel({ onExit, version }: Props) {
  const [isAuth, setIsAuth] = useState(() => sessionStorage.getItem(AUTH_KEY) === '1')
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard')

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY)
    onExit()
  }

  if (!isAuth) {
    return <PasswordGate onSuccess={() => setIsAuth(true)} onExit={onExit} />
  }

  const tabs: { key: AdminTab; label: string }[] = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'foerderungen', label: 'Förderungen' },
    { key: 'einstellungen', label: 'LLM-Einstellungen' },
  ]

  return (
    <div className="fixed inset-0 z-[100] bg-[#F5F3EF] overflow-y-auto">
      {/* Admin Header */}
      <header className="sticky top-0 z-10 shadow-lg"
        style={{ background: 'linear-gradient(135deg, #093847 0%, #0D4F6B 100%)' }}>
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[11px] bg-amber-400 text-amber-900 px-2 py-0.5 rounded font-bold uppercase tracking-widest">Admin</span>
            <span className="font-headline text-lg font-semibold text-white">Förderpilot Dashboard</span>
            <span className="text-white/30 text-xs font-mono">v{version}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-white/10 rounded-xl p-1 gap-0.5">
              {tabs.map(t => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`px-4 py-1.5 text-sm rounded-lg font-medium transition-all whitespace-nowrap ${
                    activeTab === t.key ? 'bg-white text-[#093847]' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 2H2V12H5M9 4L12 7L9 10M12 7H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Abmelden
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && <DashboardTab version={version} />}
        {activeTab === 'foerderungen' && <FoerderungenTab />}
        {activeTab === 'einstellungen' && <EinstellungenTab version={version} />}
      </div>
    </div>
  )
}
