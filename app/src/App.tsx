import { useState, useCallback } from 'react'
import type { ApiResponse, AppView, AppTab } from './types'
import { findFoerderungen } from './lib/api'
import { preFilterFoerderungen } from './lib/preFilter'
import { foerderungenData } from './data/foerderungen'
import Hero from './components/Hero'
import ResultCards from './components/ResultCards'
import FilterCatalog from './components/FilterCatalog'
import LoadingSkeleton from './components/LoadingSkeleton'
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

  return (
    <div className="min-h-screen bg-[#F8F7F4] font-body">
      {/* Navigation */}
      <header className="sticky top-0 z-20 bg-[#F8F7F4]/90 backdrop-blur-sm border-b border-[#D4D1CB]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <button
              onClick={handleReset}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-7 h-7 bg-[#0D4F6B] rounded-lg flex items-center justify-center">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M7.5 2L9.5 6.5H14L10.5 9L12 13.5L7.5 11L3 13.5L4.5 9L1 6.5H5.5L7.5 2Z" fill="white" />
                </svg>
              </div>
              <span className="font-headline font-semibold text-[#1A1A1A] text-[15px]">
                Förderpilot
              </span>
            </button>

            {/* Tab-Navigation */}
            <div className="flex items-center bg-[#EAE8E4] rounded-lg p-1 gap-0.5">
              <button
                onClick={() => setTab('search')}
                className={`px-3.5 py-1.5 text-sm font-medium rounded-md transition-all duration-150 ${
                  tab === 'search'
                    ? 'bg-white text-[#1A1A1A] shadow-sm'
                    : 'text-[#6B6860] hover:text-[#1A1A1A]'
                }`}
              >
                KI-Suche
              </button>
              <button
                onClick={() => setTab('catalog')}
                className={`px-3.5 py-1.5 text-sm font-medium rounded-md transition-all duration-150 ${
                  tab === 'catalog'
                    ? 'bg-white text-[#1A1A1A] shadow-sm'
                    : 'text-[#6B6860] hover:text-[#1A1A1A]'
                }`}
              >
                Alle Förderungen
              </button>
            </div>

            {/* powered by */}
            <a
              href="https://mmind.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] text-[#9B998F] hover:text-[#0D4F6B] transition-colors hidden sm:block"
            >
              by mmind.ai
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-16">
        {tab === 'catalog' ? (
          <FilterCatalog />
        ) : (
          <>
            {/* Fehler-Banner */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6 animate-fade-in">
                <div className="flex gap-3">
                  <svg className="shrink-0 mt-0.5 text-red-500" width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M9 5V9.5M9 12V12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-red-800 mb-1">Fehler bei der Suche</p>
                    <p className="text-sm text-red-700">{error}</p>
                    <p className="text-sm text-red-600 mt-2">
                      Alternativ:{' '}
                      <a
                        href="https://digihub.li/services/foerderberatung/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline font-medium"
                      >
                        Kostenlose Beratung bei digihub.li
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {view === 'hero' && (
              <Hero onSubmit={handleSearch} isLoading={false} />
            )}
            {view === 'loading' && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-[#0D4F6B]/5 border border-[#0D4F6B]/20 rounded-xl p-4 mb-6 animate-fade-in">
                  <p className="text-xs text-[#0D4F6B] font-semibold uppercase tracking-wider mb-1">Anfrage</p>
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
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#D4D1CB] bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-[#9B998F]">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-[#0D4F6B] rounded flex items-center justify-center">
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M5.5 1L7 4.5H10.5L7.5 6.5L8.5 10L5.5 8L2.5 10L3.5 6.5L0.5 4.5H4L5.5 1Z" fill="white" />
                </svg>
              </div>
              <span>
                <strong className="text-[#1A1A1A]">Förderpilot</strong>
                {' – '}
                <a
                  href="https://mmind.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#0D4F6B] transition-colors"
                >
                  powered by mmind.ai
                </a>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 justify-center text-center">
              <a
                href="https://digihub.li/services/foerderberatung/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#0D4F6B] transition-colors"
              >
                Offizielle Beratung: digihub.li
              </a>
              <span className="opacity-40">·</span>
              <span>Daten: Stand März 2026 – Ohne Gewähr</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
