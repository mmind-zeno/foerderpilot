import { useState, useCallback, useEffect } from 'react'
import type { ApiResponse, AppView, AppTab } from './types'
import { findFoerderungen } from './lib/api'
import { preFilterFoerderungen } from './lib/preFilter'
import { foerderungenData } from './data/foerderungen'
import Hero from './components/Hero'
import HeroBanner from './components/HeroBanner'
import ResultCards from './components/ResultCards'
import FilterCatalog from './components/FilterCatalog'
import LoadingView from './components/LoadingView'
import DatenschutzModal from './components/DatenschutzModal'
import ConsentModal, { hasConsent } from './components/ConsentModal'
import AdminPanel from './components/AdminPanel'
import mmindLogo from './assets/logo_mmind.svg'
import erasmusLogo from './assets/logo-erasmus.svg'

const APP_VERSION = '1.9.0'
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
  const [consentGiven, setConsentGiven] = useState(() => hasConsent())
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

      {/* Consent Modal (first visit) */}
      {!consentGiven && <ConsentModal onAccept={() => setConsentGiven(true)} />}

      {/* Admin Panel */}
      {showAdmin && <AdminPanel onExit={handleAdminExit} version={APP_VERSION} />}

      {/* Datenschutz Modal */}
      {showDatenschutz && <DatenschutzModal onClose={() => setShowDatenschutz(false)} />}

      {/* Navigation */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#D4D1CB] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Top row: Logo + Desktop Tabs + Datenschutz */}
          <div className="flex items-center justify-between h-14 sm:h-16">

            {/* Logo */}
            <button
              onClick={handleReset}
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shadow-md shrink-0"
                style={{ background: 'linear-gradient(135deg, #0D4F6B 0%, #1a6d8f 100%)' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1.5L9.8 6.5H15.2L10.9 9.5L12.5 14.5L8 11.5L3.5 14.5L5.1 9.5L0.8 6.5H6.2L8 1.5Z" stroke="white" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <span className="font-headline font-bold text-[#1A1A1A] text-[15px] sm:text-[16px] leading-none block">
                  Förderpilot
                </span>
                <span className="text-[10px] text-[#9B998F] leading-none">by mmind.ai</span>
              </div>
            </button>

            {/* Desktop Tabs (hidden on mobile) */}
            <div className="hidden sm:flex items-center bg-[#F0EDE6] rounded-xl p-1 gap-0.5">
              <button
                onClick={() => setTab('search')}
                className={`px-5 py-2.5 text-[13px] font-semibold rounded-lg transition-all duration-150 ${
                  tab === 'search'
                    ? 'bg-white text-[#1A1A1A] shadow-sm'
                    : 'text-[#9B998F] hover:text-[#1A1A1A]'
                }`}
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="inline-block mr-1.5 -mt-px">
                  <circle cx="5.5" cy="5.5" r="3.8" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M8.5 8.5L11 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>KI-Suche
              </button>
              <button
                onClick={() => setTab('catalog')}
                className={`px-5 py-2.5 text-[13px] font-semibold rounded-lg transition-all duration-150 ${
                  tab === 'catalog'
                    ? 'bg-white text-[#1A1A1A] shadow-sm'
                    : 'text-[#9B998F] hover:text-[#1A1A1A]'
                }`}
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="inline-block mr-1.5 -mt-px">
                  <path d="M2 3.5H11M2 6.5H11M2 9.5H7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>Alle Förderungen
              </button>
            </div>

            {/* Right side: mmind logo + Datenschutz */}
            <div className="flex items-center gap-3 sm:gap-4">
              <a href="https://mmind.ai" target="_blank" rel="noopener noreferrer"
                className="opacity-55 hover:opacity-90 transition-opacity">
                <img src={mmindLogo} alt="mmind.ai" className="h-[16px] sm:h-[18px] w-auto" />
              </a>
              <button
                onClick={() => setShowDatenschutz(true)}
                className="text-[12px] text-[#B0ADA5] hover:text-[#0D4F6B] transition-colors hidden sm:flex items-center gap-1.5"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1L1.5 3V6C1.5 8.3 3.5 10.5 6 11C8.5 10.5 10.5 8.3 10.5 6V3L6 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                  <path d="M4 6L5.5 7.5L8 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Datenschutz
              </button>
            </div>
          </div>

          {/* Mobile Tab Bar (hidden on sm+) */}
          <div className="sm:hidden flex -mx-4 border-t border-[#EAE8E4]">
            <button
              onClick={() => setTab('search')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-[13px] font-semibold transition-all border-b-2 ${
                tab === 'search'
                  ? 'border-[#0D4F6B] text-[#0D4F6B] bg-[#F0F7FB]'
                  : 'border-transparent text-[#9B998F] hover:text-[#1A1A1A]'
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M9 9L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              KI-Suche
            </button>
            <div className="w-px bg-[#EAE8E4] my-1.5" />
            <button
              onClick={() => setTab('catalog')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-[13px] font-semibold transition-all border-b-2 ${
                tab === 'catalog'
                  ? 'border-[#0D4F6B] text-[#0D4F6B] bg-[#F0F7FB]'
                  : 'border-transparent text-[#9B998F] hover:text-[#1A1A1A]'
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 3.5H12M2 7H12M2 10.5H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Alle Förderungen
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
                    <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M9 5.5V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M9 12.5V12.6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
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
              <LoadingView userInput={userInput} />
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col gap-4 text-[12px] text-[#B0ADA5]">

            {/* Erasmus+ Hinweis */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 py-3 px-4 bg-[#F0EDE6] rounded-xl">
              <a href="https://erasmus-plus.ec.europa.eu/" target="_blank" rel="noopener noreferrer"
                className="shrink-0 opacity-80 hover:opacity-100 transition-opacity">
                <img src={erasmusLogo} alt="Erasmus+" className="h-[28px] w-auto" />
              </a>
              <p className="text-[11px] text-[#6B6860] text-center sm:text-left leading-snug">
                Dieses Projekt wurde im Rahmen des{' '}
                <strong className="text-[#1A1A1A]">Erasmus+ Programms</strong> der Europäischen Union gefördert.
                Der Inhalt gibt ausschliesslich die Ansicht der Autoren wieder; die Europäische Kommission übernimmt keine Verantwortung für die Verwendung der enthaltenen Informationen.
              </p>
            </div>

            {/* Bottom row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                  style={{ background: 'linear-gradient(135deg, #0D4F6B, #1a6d8f)' }}>
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M5.5 1.5L6.9 4.8H10.3L7.5 6.8L8.5 10L5.5 8L2.5 10L3.5 6.8L0.7 4.8H4.1L5.5 1.5Z" stroke="white" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round"/>
                  </svg>
                </div>
                <span className="font-semibold text-[#6B6860]">Förderpilot</span>
                <span className="opacity-30">–</span>
                <span>powered by</span>
                <a href="https://mmind.ai" target="_blank" rel="noopener noreferrer"
                  className="opacity-70 hover:opacity-100 transition-opacity">
                  <img src={mmindLogo} alt="mmind.ai" className="h-[14px] w-auto" />
                </a>
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
        </div>
      </footer>
    </div>
  )
}
