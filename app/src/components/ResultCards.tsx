import type { ApiResponse } from '../types'

interface Props {
  result: ApiResponse
  onReset: () => void
  userInput: string
}

export default function ResultCards({ result, onReset, userInput }: Props) {
  return (
    <div className="animate-fade-in">
      {/* Intro */}
      <div className="bg-[#0D4F6B] text-white rounded-xl p-6 mb-8">
        <div className="flex items-start gap-3">
          <div className="mt-1 shrink-0">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L12.39 7.26L18 8.18L14 12.08L14.9 17.64L10 15L5.1 17.64L6 12.08L2 8.18L7.61 7.26L10 2Z"
                fill="currentColor" opacity="0.9" />
            </svg>
          </div>
          <p className="text-[15px] leading-relaxed opacity-95">{result.intro}</p>
        </div>
        {/* Suchanfrage anzeigen */}
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-xs opacity-60 uppercase tracking-wider mb-1">Deine Anfrage</p>
          <p className="text-sm opacity-80 italic">"{userInput}"</p>
        </div>
      </div>

      {/* Ergebniszahl */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-headline text-xl font-semibold text-[#1A1A1A]">
          {result.matches.length} passende Förderungen gefunden
        </h2>
        <button
          onClick={onReset}
          className="text-sm text-[#0D4F6B] hover:text-[#E8530A] transition-colors duration-200 flex items-center gap-1"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L1 7M1 7L7 13M1 7H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Neue Suche
        </button>
      </div>

      {/* Förderungs-Karten */}
      <div className="space-y-4 mb-8">
        {result.matches.map((match, idx) => (
          <div
            key={match.id}
            className="bg-white border border-[#D4D1CB] rounded-xl p-6 animate-slide-up hover:border-[#0D4F6B]/30 hover:shadow-md transition-all duration-200"
            style={{ animationDelay: `${idx * 80}ms`, animationFillMode: 'both' }}
          >
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-headline text-lg font-semibold text-[#1A1A1A] leading-snug">
                  {match.name}
                </h3>
                <p className="text-sm text-[#6B6860] mt-0.5">{match.anbieter}</p>
              </div>
              <span
                className={`shrink-0 text-xs font-semibold px-3 py-1 rounded-full ${
                  match.prioritaet === 'hoch'
                    ? 'bg-[#E8530A] text-white'
                    : 'bg-[#EAE8E4] text-[#6B6860]'
                }`}
              >
                {match.prioritaet === 'hoch' ? 'Sehr passend' : 'Passend'}
              </span>
            </div>

            {/* Warum passend */}
            <p className="text-[14px] text-[#1A1A1A] leading-relaxed mb-4">
              {match.warum_passend}
            </p>

            {/* Details */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-[#6B6860] mb-4 pb-4 border-b border-[#EAE8E4]">
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1C4.24 1 2 3.24 2 6C2 9.5 7 13 7 13C7 13 12 9.5 12 6C12 3.24 9.76 1 7 1ZM7 7.75C6.03 7.75 5.25 6.97 5.25 6C5.25 5.03 6.03 4.25 7 4.25C7.97 4.25 8.75 5.03 8.75 6C8.75 6.97 7.97 7.75 7 7.75Z"
                    fill="currentColor" />
                </svg>
                <strong className="text-[#1A1A1A]">Förderung:</strong> {match.foerderumfang}
              </span>
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="2" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M1 5H13" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M4 1V3M10 1V3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                <strong className="text-[#1A1A1A]">Frist:</strong> {match.frist}
              </span>
            </div>

            {/* Button */}
            <a
              href={match.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0D4F6B] hover:text-[#E8530A] transition-colors duration-200"
            >
              Mehr erfahren & Antrag stellen
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        ))}
      </div>

      {/* Nächster Schritt */}
      <div className="bg-[#F0EDE6] border border-[#D4D1CB] rounded-xl p-5 mb-6">
        <div className="flex gap-3">
          <div className="shrink-0 mt-0.5">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="#0D4F6B" strokeWidth="1.5" />
              <path d="M10 6V10.5M10 13.5V14" stroke="#0D4F6B" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0D4F6B] mb-1">Nächster Schritt</p>
            <p className="text-[14px] text-[#1A1A1A] leading-relaxed">{result.naechster_schritt}</p>
          </div>
        </div>
      </div>

      {/* Hinweis (optional) */}
      {result.hinweis && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
          <div className="flex gap-3">
            <div className="shrink-0 mt-0.5 text-amber-600">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 1L16.5 15H1.5L9 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M9 7V10M9 12.5V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-[14px] text-amber-900 leading-relaxed">{result.hinweis}</p>
          </div>
        </div>
      )}

      {/* CTA Sektion */}
      <div className="bg-gradient-to-br from-[#0D4F6B] to-[#093847] text-white rounded-2xl p-8 mt-8">
        <div className="max-w-lg mx-auto text-center">
          <p className="font-headline text-xl font-semibold mb-2">
            Brauchst du Hilfe bei der Antragstellung?
          </p>
          <p className="text-sm opacity-80 mb-6">
            mmind.ai begleitet dich von der Fördersuche bis zur Einreichung.
          </p>
          <a
            href="https://mmind.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#E8530A] hover:bg-[#c4440a] text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
          >
            Kostenlose Erstberatung bei mmind.ai
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <p className="text-xs opacity-50 mt-4">
            Offizielle Förderberatung auch bei{' '}
            <a href="https://digihub.li/services/foerderberatung/" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">
              digihub.li
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
