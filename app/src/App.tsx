import { useState, useCallback, useEffect } from 'react'
import type { ApiResponse, AppView, AppTab } from './types'
import { findFoerderungen } from './lib/api'
import { preFilterFoerderungen } from './lib/preFilter'
import { foerderungenData } from './data/foerderungen'
import Hero from './components/Hero'
import HeroBanner from './components/HeroBanner'
import ResultCards from './components/ResultCards'
import FilterCatalog from './components/FilterCatalog'
import LoadingSkeleton from './components/LoadingSkeleton'
import DatenschutzModal from './components/DatenschutzModal'
import AdminPanel from './components/AdminPanel'

const APP_VERSION = '1.6.0'
const SESSION_KEY = 'foerderpilot_last_result'
const SESSION_INPUT_KEY = 'foerderpilot_last_input'

function getStoredResult(): { result: ApiResponse; input: string } | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    const input = sessionStorage.getItem(SESSION_INPUT_KEY)
    if (raw && input) return { result: JSON.parse(raw) as ApiResponse, input }
  } catch { /* ignore */ }
  return null
}

function storeResult(result: ApiResponse, input: string) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(result))
    sessionStorage.setItem(SESSION_INPUT_KEY, input)
  } catch { /* ignore */ }
}

export default function App() {
  const stored = getStoredResult()
  const [tab, setTab] = useState<AppTab>('search')
  const [view, setView] = useState<AppView>(stored ? 'results' : 'hero')
  const [result, setResult] = useState<ApiResponse | null>(stored?.result ?? null)
  const [userInput, setUserInput] = useState(stored?.input ?? '')
  const [error, setError] = useState<string | null>(null)
  const [showDatenschutz, setShowDatenschutz] = useState(false)
  const [showAdmin, setShowAdmin] = useState(() => window.location.hash === '#admin')

  useEffect(() => {
    const handler = () => setShowAdmin(window.location.hash === '#admin')
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  const handleAdminExit = useCallback(() => {
    window.location.hash = ''
    setShowAdmin(false)
  }, [])

  const handleSearch = useCallback(async (input: string) => {
    setUserInput(input)
    setError(null)
    setView('loading')
    setTab('search')
    try {
      const relevantData = preFilterFoerderungen(input, foerderungenData)
      const apiResult = await findFoerderungen(input, relevantData)
      storeResult(apiResult, input)
      setResult(apiResult)
      setView('results')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unbekannter Fehler'
      setError(msg)
      setView('hero')
    }
  }, [])

  const handleReset = useCallback(() => {
    setView('hero')
    setResult(null)
    setError(null)
    try {
      sessionStorage.removeItem(SESSION_KEY)
      sessionStorage.removeItem(SESSION_INPUT_KEY)
    } catch { /* ignore */ }
  }, [])

  const showHeroBanner = tab === 'search' && view === 'hero'

  return (
    <div className="min-h-screen app-root font-body">

      {/* Admin Panel */}
      {showAdmin && <AdminPanel onExit={handleAdminExit} version={APP_VERSION} />}

      {/* Datenschutz Modal */}
      {showDatenschutz && <DatenschutzModal onClose={() => setShowDatenschutz(false)} />}

      {/* Navigation */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#D4D1CB] shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <button
              onClick={handleReset}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
                style={{ background: 'linear-gradient(135deg, #0D4F6B 0%, #1a6d8f 100%)' }}>
                <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1.5L10.2 6.5H15.5L11.2 9.5L13 14.5L8 11.5L3 14.5L4.8 9.5L0.5 6.5H5.8L8 1.5Z" fill="white" />
                </svg>
              </div>
              <div>
                <span className="font-headline font-bold text-[#1A1A1A] text-[16px] leading-none block">
                  Förderpilot
                </span>
                <span className="text-[10px] text-[#9B998F] leading-none">by mmind.ai</span>
              </div>
            </button>

            {/* Tabs */}
            <div className="flex items-center bg-[#F0EDE6] rounded-xl p-1 gap-0.5">
              <button
                onClick={() => setTab('search')}
                className={`px-4 py-2 text-[13px] font-semibold rounded-lg transition-all duration-150 ${
                  tab === 'search'
                    ? 'bg-white text-[#1A1A1A] shadow-sm'
                    : 'text-[#9B998F] hover:text-[#1A1A1A]'
                }`}
              >
                KI-Suche
              </button>
              <button
                onClick={() => setTab('catalog')}
                className={`px-4 py-2 text-[13px] font-semibold rounded-lg transition-all duration-150 ${
                  tab === 'catalog'
                    ? 'bg-white text-[#1A1A1A] shadow-sm'
                    : 'text-[#9B998F] hover:text-[#1A1A1A]'
                }`}
              >
                Alle Förderungen
              </button>
            </div>

            {/* Datenschutz */}
            <button
              onClick={() => setShowDatenschutz(true)}
              className="text-[12px] text-[#B0ADA5] hover:text-[#0D4F6B] transition-colors hidden sm:flex items-center gap-1.5"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1L1.5 3V6C1.5 8.3 3.5 10.46 6 11C8.5 10.46 10.5 8.3 10.5 6V3L6 1Z"
                  stroke="currentColor" strokeWidth="1.2" fill="none" />
              </svg>
              Datenschutz
            </button>
          </div>
        </div>
      </header>

      {/* Full-width Hero Banner — outside the constrained container */}
      {showHeroBanner && <HeroBanner />}

      {/* Main */}
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 ${showHeroBanner ? 'pt-6' : 'pt-8'}`}>
        {tab === 'catalog' ? (
          <FilterCatalog />
        ) : (
          <div className="max-w-3xl mx-auto">
            {/* Fehler-Banner */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6 animate-fade-in">
                <div className="flex gap-3">
                  <svg className="shrink-0 mt-0.5 text-red-400" width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M9 5V9.5M9 12V12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-red-800 mb-1">Fehler bei der KI-Analyse</p>
                    <p className="text-sm text-red-700">{error}</p>
                    <p className="text-sm text-red-500 mt-2">
                      Bitte versuche es erneut oder kontaktiere{' '}
                      <a href="https://mmind.ai" target="_blank" rel="noopener noreferrer" className="underline font-medium">
                        mmind.ai
                      </a>{' '}für persönliche Beratung.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {view === 'hero' && (
              <Hero onSubmit={handleSearch} isLoading={false} onDatenschutz={() => setShowDatenschutz(true)} />
            )}
            {view === 'loading' && (
              <div className="max-w-2xl mx-auto">
                <div className="rounded-xl p-4 mb-6 animate-fade-in"
                  style={{ background: 'rgba(13,79,107,0.06)', borderLeft: '3px solid #0D4F6B' }}>
                  <p className="text-[11px] text-[#0D4F6B] font-bold uppercase tracking-widest mb-1">KI analysiert</p>
                  <p className="text-sm text-[#1A1A1A] italic">"{userInput}"</p>
                </div>
                <LoadingSkeleton />
              </div>
            )}
            {view === 'results' && result && (
              <ResultCards
                result={result}
                onReset={handleReset}
                userInput={userInput}
                onDatenschutz={() => setShowDatenschutz(true)}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#D4D1CB] bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#B0ADA5]">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-md flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #0D4F6B, #1a6d8f)' }}>
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M5.5 1L7 4.5H10.5L7.5 6.5L8.5 10L5.5 8L2.5 10L3.5 6.5L0.5 4.5H4L5.5 1Z" fill="white" />
                </svg>
              </div>
              <span>
                <strong className="text-[#6B6860]">Förderpilot</strong>
                {' – '}
                <a href="https://mmind.ai" target="_blank" rel="noopener noreferrer"
                  className="hover:text-[#0D4F6B] transition-colors">powered by mmind.ai</a>
              </span>
              <span className="bg-[#EAE8E4] text-[#9B998F] text-[10px] px-1.5 py-0.5 rounded font-mono">
                v{APP_VERSION}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 justify-center text-center">
              <button onClick={() => setShowDatenschutz(true)}
                className="hover:text-[#0D4F6B] transition-colors">
                Datenschutz & KI-Hinweis
              </button>
              <span className="opacity-30">·</span>
              <a href="https://www.llv.li/de/unternehmen/finanzierung-foerderung"
                target="_blank" rel="noopener noreferrer"
                className="hover:text-[#0D4F6B] transition-colors">
                Amt für Volkswirtschaft FL
              </a>
              <span className="opacity-30">·</span>
              <span>Daten: März 2026 – Ohne Gewähr</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
