import { useState, useRef, useCallback } from 'react'

const QUICK_STARTS = [
  { label: 'Ich bin ein KMU', text: 'Ich betreibe ein KMU in Liechtenstein mit 15 Mitarbeitenden und möchte ein Digitalisierungsprojekt starten.' },
  { label: 'Ich baue ein Haus', text: 'Ich plane ein Eigenheim in Liechtenstein und möchte es energieeffizient bauen oder sanieren.' },
  { label: 'Ich bin Künstler/in', text: 'Ich bin eine professionelle Künstlerin mit Wohnsitz in Liechtenstein und suche Förderung für mein Kulturprojekt.' },
  { label: 'Ich studiere', text: 'Ich studiere in Liechtenstein und suche Stipendien oder Bildungsförderung.' },
  { label: 'Ich bin Landwirt/in', text: 'Ich betreibe einen landwirtschaftlichen Betrieb in Liechtenstein und suche passende Förderungen.' },
]

interface Props {
  onSubmit: (input: string) => void
  isLoading: boolean
}

export default function Hero({ onSubmit, isLoading }: Props) {
  const [input, setInput] = useState('')
  const [charCount, setCharCount] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleInput = (value: string) => {
    setInput(value)
    setCharCount(value.length)
  }

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim()
    if (trimmed.length < 10) {
      textareaRef.current?.focus()
      return
    }
    onSubmit(trimmed)
  }, [input, onSubmit])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleQuickStart = (text: string) => {
    handleInput(text)
    textareaRef.current?.focus()
  }

  return (
    <div className="animate-fade-in">
      {/* Hero Headline */}
      <div className="text-center mb-10 pt-4">
        <div className="inline-flex items-center gap-2 bg-[#0D4F6B]/10 text-[#0D4F6B] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0D4F6B] inline-block animate-pulse" />
          100 Förderungen in Liechtenstein · Stand März 2026
        </div>

        <h1 className="font-headline text-4xl sm:text-5xl font-bold text-[#1A1A1A] leading-tight mb-4">
          Welche Förderung<br />
          <span className="text-[#0D4F6B]">passt zu dir?</span>
        </h1>

        <p className="text-base text-[#6B6860] max-w-md mx-auto leading-relaxed">
          100+ Förderungen in Liechtenstein – Förderpilot findet deine in Sekunden.
        </p>
      </div>

      {/* Input-Bereich */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border-2 border-[#D4D1CB] rounded-2xl p-1 shadow-sm focus-within:border-[#0D4F6B] transition-colors duration-200">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Beschreibe deine Situation… z.B. «Ich bin ein KMU und möchte in KI investieren» oder «Ich bin Künstlerin und suche ein Projektstipendium»"
            rows={4}
            disabled={isLoading}
            className="w-full px-4 pt-4 pb-2 text-[15px] text-[#1A1A1A] resize-none focus:outline-none rounded-xl bg-transparent placeholder-[#9B998F] leading-relaxed disabled:opacity-60"
          />
          <div className="flex items-center justify-between px-4 pb-3 pt-1">
            <span className="text-[12px] text-[#9B998F]">
              {charCount < 10 && charCount > 0 ? (
                <span className="text-amber-600">Bitte etwas mehr beschreiben</span>
              ) : (
                <>⌘+Enter zum Absenden</>
              )}
            </span>
            <button
              onClick={handleSubmit}
              disabled={isLoading || input.trim().length < 10}
              className="flex items-center gap-2 bg-[#E8530A] hover:bg-[#c4440a] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 hover:shadow-md active:scale-95"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin" width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="10" />
                  </svg>
                  Analysiere…
                </>
              ) : (
                <>
                  Förderungen finden
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M2 7.5H13M9 3L13 7.5L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick-Start Buttons */}
        <div className="mt-4">
          <p className="text-xs text-[#9B998F] text-center mb-3">Oder starte mit einem Beispiel:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {QUICK_STARTS.map(({ label, text }) => (
              <button
                key={label}
                onClick={() => handleQuickStart(text)}
                disabled={isLoading}
                className="text-sm bg-white border border-[#D4D1CB] text-[#6B6860] hover:border-[#0D4F6B] hover:text-[#0D4F6B] px-3.5 py-1.5 rounded-full transition-all duration-150 disabled:opacity-50"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Trust-Elemente */}
      <div className="mt-12 pt-8 border-t border-[#EAE8E4]">
        <div className="flex flex-wrap justify-center gap-8 text-[13px] text-[#9B998F]">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L10 5.5H15L11 8.5L12.5 13L8 10L3.5 13L5 8.5L1 5.5H6L8 1Z" fill="#D4D1CB" />
            </svg>
            100+ Förderungen erfasst
          </div>
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="#D4D1CB" strokeWidth="1.4" />
              <path d="M5 8L7 10L11 6" stroke="#D4D1CB" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Web-verifiziert März 2026
          </div>
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="3" width="12" height="10" rx="2" stroke="#D4D1CB" strokeWidth="1.4" />
              <path d="M2 6H14" stroke="#D4D1CB" strokeWidth="1.4" />
            </svg>
            KI powered by Claude
          </div>
        </div>
      </div>
    </div>
  )
}
