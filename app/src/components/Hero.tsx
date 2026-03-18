import { useState, useRef, useCallback } from 'react'

const QUICK_STARTS = [
  { label: '🏢 KMU', text: 'Ich betreibe ein KMU in Liechtenstein mit 15 Mitarbeitenden und möchte ein Digitalisierungsprojekt starten.' },
  { label: '🚀 Startup', text: 'Ich gründe ein Startup in Liechtenstein und suche Finanzierung, Mentoring oder Unterstützung für den Aufbau meines Unternehmens.' },
  { label: '🏠 Hausbau', text: 'Ich plane ein Eigenheim in Liechtenstein und möchte es energieeffizient bauen oder sanieren.' },
  { label: '🎨 Kultur', text: 'Ich bin eine professionelle Künstlerin mit Wohnsitz in Liechtenstein und suche Förderung für mein Kulturprojekt.' },
  { label: '🎓 Studium', text: 'Ich studiere in Liechtenstein und suche Stipendien oder Bildungsförderung.' },
  { label: '🌾 Landwirtschaft', text: 'Ich betreibe einen landwirtschaftlichen Betrieb in Liechtenstein und suche passende Förderungen.' },
]

interface Props {
  onSubmit: (input: string) => void
  isLoading: boolean
  onDatenschutz: () => void
}

export default function Hero({ onSubmit, isLoading, onDatenschutz }: Props) {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleInput = (value: string) => setInput(value)

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim()
    if (trimmed.length < 10) { textareaRef.current?.focus(); return }
    onSubmit(trimmed)
  }, [input, onSubmit])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); handleSubmit() }
  }

  const handleQuickStart = (text: string) => {
    handleInput(text)
    setTimeout(() => textareaRef.current?.focus(), 50)
  }

  return (
    <div className="animate-fade-in">
      {/* Input-Bereich */}
      <div className="max-w-2xl mx-auto">

        {/* Label */}
        <div className="mb-3">
          <h2 className="font-headline text-lg sm:text-xl font-semibold text-[#1A1A1A] mb-1">
            Beschreibe deine Situation
          </h2>
          <p className="text-sm text-[#9B998F]">
            Unsere KI analysiert 103 Förderungen und findet die passenden für dich.
          </p>
        </div>

        {/* Eingabe-Box */}
        <div
          className="bg-white rounded-2xl shadow-lg border focus-within:shadow-xl transition-all duration-200"
          style={{ borderColor: '#D4D1CB', borderWidth: '1.5px' }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="z.B. «Ich bin ein KMU und möchte in KI investieren» oder «Ich bin Künstlerin und suche ein Projektstipendium» oder «Ich plane ein energieeffizientes Eigenheim»…"
            rows={4}
            disabled={isLoading}
            className="w-full px-5 pt-5 pb-3 text-[15px] text-[#1A1A1A] resize-none focus:outline-none rounded-t-2xl bg-transparent placeholder-[#C0BDB5] leading-relaxed disabled:opacity-60"
          />
          <div className="flex items-center justify-between px-5 pb-4 pt-2.5 border-t border-[#F0EDE6]">
            <span className="text-[12px] text-[#B0ADA5]">
              {input.trim().length > 0 && input.trim().length < 10 ? (
                <span className="text-amber-500 font-medium">Bitte etwas mehr beschreiben</span>
              ) : (
                <span className="hidden sm:inline">⌘+Enter zum Absenden</span>
              )}
            </span>
            <button
              onClick={handleSubmit}
              disabled={isLoading || input.trim().length < 10}
              className="flex items-center gap-2 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-all duration-200 active:scale-95 btn-glow disabled:opacity-35 disabled:cursor-not-allowed disabled:shadow-none"
              style={{ background: 'linear-gradient(135deg, #E8530A 0%, #c4440a 100%)' }}
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
                    <path d="M3 7.5H12M8.5 4L12 7.5L8.5 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

        {/* KI-Hinweis */}
        <p className="text-center text-[12px] text-[#B0ADA5] mt-2.5">
          Eingabe wird via KI (LLM) analysiert.{' '}
          <button onClick={onDatenschutz} className="underline hover:text-[#0D4F6B] transition-colors">
            Datenschutz & Disclaimer
          </button>
        </p>

        {/* Quick-Start Buttons */}
        <div className="mt-5">
          <p className="text-xs text-[#B0ADA5] text-center mb-3 font-medium tracking-widest uppercase">
            Schnellstart
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 snap-x justify-start sm:justify-center sm:flex-wrap" style={{ scrollbarWidth: 'none' }}>
            {QUICK_STARTS.map(({ label, text }) => (
              <button
                key={label}
                onClick={() => handleQuickStart(text)}
                disabled={isLoading}
                className="shrink-0 snap-start text-[13px] bg-white border border-[#D4D1CB] text-[#6B6860] hover:border-[#0D4F6B] hover:text-[#0D4F6B] hover:bg-[#F0F7FB] hover:shadow-sm px-4 py-2 rounded-full transition-all duration-150 disabled:opacity-50 shadow-sm font-medium"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Trust-Elemente */}
      <div className="mt-10 pt-7 border-t border-[#EAE8E4]">
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
          {[
            {
              icon: (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 5L8 2L14 5L8 8L2 5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                  <path d="M2 8L8 11L14 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 11L8 14L14 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ),
              text: '103 Förderungen erfasst',
            },
            {
              icon: (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1.5L2 4.5V9C2 12 4.7 14.5 8 15.5C11.3 14.5 14 12 14 9V4.5L8 1.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                  <path d="M5.5 8.5L7 10L10.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ),
              text: 'Web-verifiziert März 2026',
            },
            {
              icon: (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M9.5 1.5L4 8.5H8.5L6.5 14.5L13 7.5H8.5L9.5 1.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round"/>
                </svg>
              ),
              text: 'KI-gestützte Analyse',
            },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2.5 text-[13px] text-[#9B998F]">
              <span className="text-[#C4C1B8] flex-shrink-0">{icon}</span>
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
