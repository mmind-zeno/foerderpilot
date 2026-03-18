import type { ApiResponse } from '../types'

interface Props {
  result: ApiResponse
  onReset: () => void
  userInput: string
  onDatenschutz: () => void
}

export default function ResultCards({ result, onReset, userInput, onDatenschutz }: Props) {
  return (
    <div className="animate-fade-in">
      {/* Intro */}
      <div className="rounded-2xl p-6 mb-8 relative overflow-hidden shadow-lg"
        style={{ background: 'linear-gradient(135deg, #093847 0%, #0D4F6B 60%, #1a6d8f 100%)' }}>
        {/* dot pattern */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        {/* accent glow */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #E8530A, transparent 70%)', transform: 'translate(25%,-25%)' }} />

        <div className="relative flex items-start gap-3">
          <div className="mt-0.5 shrink-0 w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1.5L9.8 6.5H15.2L10.9 9.5L12.5 14.5L8 11.5L3.5 14.5L5.1 9.5L0.8 6.5H6.2L8 1.5Z" stroke="white" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="text-[15px] leading-relaxed text-white/95">{result.intro}</p>
        </div>
        <div className="relative mt-4 pt-4 border-t border-white/15">
          <p className="text-[11px] text-white/50 uppercase tracking-widest mb-1 font-semibold">Deine Anfrage</p>
          <p className="text-sm text-white/75 italic">"{userInput}"</p>
        </div>
        {/* KI Badge */}
        <div className="relative mt-3 flex items-center gap-2">
          <span className="text-[11px] bg-white/15 text-white/70 px-2 py-0.5 rounded-full font-mono">KI</span>
          <button onClick={onDatenschutz} className="text-[11px] text-white/50 hover:text-white/80 underline transition-colors">
            KI-generierte Empfehlungen · Datenschutz
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-headline text-xl sm:text-2xl font-semibold text-[#1A1A1A]">
          <span className="text-[#0D4F6B]">{result.matches.length}</span> passende Förderungen
        </h2>
        <button
          onClick={onReset}
          className="text-sm text-[#6B6860] hover:text-[#E8530A] transition-colors duration-200 flex items-center gap-1.5 border border-[#D4D1CB] hover:border-[#E8530A] px-3 py-1.5 rounded-lg"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M5 2L1 6.5L5 11M1 6.5H12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Neue Suche
        </button>
      </div>

      {/* Karten */}
      <div className="space-y-4 mb-8">
        {result.matches.map((match, idx) => (
          <div
            key={match.id}
            className={`bg-white border border-[#D4D1CB] rounded-2xl p-6 card-hover animate-slide-up ${
              match.prioritaet === 'hoch' ? 'card-priority' : ''
            }`}
            style={{ animationDelay: `${idx * 80}ms`, animationFillMode: 'both' }}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-headline text-[17px] sm:text-[18px] font-semibold text-[#1A1A1A] leading-snug">
                  {match.name}
                </h3>
                <p className="text-[13px] text-[#9B998F] mt-0.5">{match.anbieter}</p>
              </div>
              <span className={`shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-full tracking-wide ${
                match.prioritaet === 'hoch'
                  ? 'bg-[#E8530A] text-white shadow-sm'
                  : 'bg-[#EAE8E4] text-[#6B6860]'
              }`}>
                {match.prioritaet === 'hoch' ? '★ Sehr passend' : 'Passend'}
              </span>
            </div>

            <p className="text-[14px] text-[#3A3A3A] leading-relaxed mb-4">{match.warum_passend}</p>

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-[#6B6860] mb-4 pb-4 border-b border-[#F0EDE6]">
              <span className="flex items-center gap-1.5">
                <span className="text-[#0D4F6B] font-bold">◈</span>
                <strong className="text-[#1A1A1A] font-medium">Förderung:</strong> {match.foerderumfang}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-[#0D4F6B] font-bold">◷</span>
                <strong className="text-[#1A1A1A] font-medium">Frist:</strong> {match.frist}
              </span>
            </div>

            <a
              href={match.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#0D4F6B] hover:text-[#E8530A] transition-colors duration-200 group"
            >
              Mehr erfahren & Antrag stellen
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"
                className="transition-transform group-hover:translate-x-0.5">
                <path d="M2 6.5H11M7.5 3L11 6.5L7.5 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        ))}
      </div>

      {/* Nächster Schritt */}
      <div className="bg-[#F0F7FB] border border-[#C5DDE8] rounded-2xl p-5 mb-5">
        <div className="flex gap-3">
          <div className="shrink-0 mt-0.5 w-9 h-9 bg-[#0D4F6B]/10 rounded-xl flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6.5" stroke="#0D4F6B" strokeWidth="1.4"/>
              <path d="M8 7.5V11" stroke="#0D4F6B" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M8 5.5V5.6" stroke="#0D4F6B" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <p className="text-[12px] font-bold text-[#0D4F6B] uppercase tracking-wider mb-1">Nächster Schritt</p>
            <p className="text-[14px] text-[#1A1A1A] leading-relaxed">{result.naechster_schritt}</p>
          </div>
        </div>
      </div>

      {/* Hinweis optional */}
      {result.hinweis && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-5">
          <div className="flex gap-3">
            <div className="shrink-0 mt-0.5 text-amber-500">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2L16.5 15H1.5L9 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M9 8V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M9 13V13.1" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-[14px] text-amber-900 leading-relaxed">{result.hinweis}</p>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="rounded-2xl p-8 sm:p-10 mt-8 relative overflow-hidden shadow-xl"
        style={{ background: 'linear-gradient(135deg, #093847 0%, #0D4F6B 50%, #1a6d8f 100%)' }}>
        <div className="absolute top-0 right-0 w-56 h-56 rounded-full opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #E8530A, transparent)', transform: 'translate(20%, -20%)' }} />
        <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #1a6d8f, transparent)', transform: 'translate(-30%, 30%)' }} />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
        <div className="relative text-center">
          <p className="font-headline text-xl sm:text-2xl font-semibold text-white mb-2">
            Hilfe bei der Antragstellung?
          </p>
          <p className="text-sm text-white/70 mb-7 max-w-sm mx-auto leading-relaxed">
            mmind.ai begleitet dich von der Fördersuche bis zur erfolgreichen Einreichung.
          </p>
          <a
            href="https://mmind.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.03] active:scale-100 btn-glow"
            style={{ background: 'linear-gradient(135deg, #E8530A 0%, #c4440a 100%)' }}
          >
            Kostenlose Erstberatung bei mmind.ai
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <p className="text-[11px] text-white/40 mt-5">
            KI-generierte Empfehlungen – kein Ersatz für professionelle Beratung ·{' '}
            <button onClick={onDatenschutz} className="underline hover:text-white/70 transition-colors">
              Datenschutz
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
