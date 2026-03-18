interface Props {
  onClose: () => void
}

export default function DatenschutzModal({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#EAE8E4]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#0D4F6B]/10 rounded-xl flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 1.5L2.5 4.5V9C2.5 12.5 5.4 15.5 9 16.5C12.6 15.5 15.5 12.5 15.5 9V4.5L9 1.5Z" stroke="#0D4F6B" strokeWidth="1.4" strokeLinejoin="round"/>
                <path d="M6 9L7.8 11L12 7" stroke="#0D4F6B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="font-headline text-lg font-semibold text-[#1A1A1A]">
              Datenschutz & KI-Hinweis
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#EAE8E4] transition-colors text-[#9B998F]"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-5 text-[14px] text-[#1A1A1A] leading-relaxed">

          {/* KI Hinweis */}
          <section>
            <h3 className="font-semibold text-[#0D4F6B] mb-2 flex items-center gap-2">
              <span className="text-xs bg-[#0D4F6B] text-white px-2 py-0.5 rounded font-mono">KI</span>
              Einsatz von Künstlicher Intelligenz
            </h3>
            <p className="text-[#6B6860]">
              Förderpilot nutzt ein <strong className="text-[#1A1A1A]">Large Language Model (LLM)</strong>,
              um deine Situationsbeschreibung auszuwerten und passende Förderungen zu empfehlen.
              Die Ergebnisse sind KI-generierte Empfehlungen – keine Rechts- oder Beratungsleistung.
            </p>
          </section>

          {/* Datenverarbeitung */}
          <section>
            <h3 className="font-semibold text-[#1A1A1A] mb-2">Welche Daten werden verarbeitet?</h3>
            <ul className="space-y-2 text-[#6B6860]">
              <li className="flex gap-2">
                <span className="text-[#0D4F6B] mt-0.5">→</span>
                <span><strong className="text-[#1A1A1A]">Deine Texteingabe</strong> wird zusammen mit den Förderdaten an eine
                KI-API gesendet, um passende Förderungen zu identifizieren.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#0D4F6B] mt-0.5">→</span>
                <span><strong className="text-[#1A1A1A]">Keine Speicherung</strong> durch Förderpilot: Deine Eingaben werden
                nicht dauerhaft gespeichert. Das letzte Ergebnis wird nur temporär im Browser-Speicher
                (sessionStorage) gehalten und beim Schliessen des Tabs gelöscht.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#0D4F6B] mt-0.5">→</span>
                <span>Der jeweilige KI-Anbieter verarbeitet die Daten gemäss seiner eigenen Datenschutzrichtlinie.</span>
              </li>
            </ul>
          </section>

          {/* Keine Cookies */}
          <section>
            <h3 className="font-semibold text-[#1A1A1A] mb-2">Cookies & Tracking</h3>
            <p className="text-[#6B6860]">
              Förderpilot verwendet <strong className="text-[#1A1A1A]">keine Cookies</strong> und kein
              Tracking. Es werden keine personenbezogenen Daten zu Analyse- oder Marketingzwecken erhoben.
            </p>
          </section>

          {/* Disclaimer */}
          <section className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h3 className="font-semibold text-amber-900 mb-2">Haftungsausschluss</h3>
            <p className="text-amber-800 text-[13px]">
              Die angezeigten Förderungsinformationen basieren auf öffentlich zugänglichen Quellen
              (Stand März 2026) und wurden sorgfältig recherchiert. <strong>Ohne Gewähr für Richtigkeit,
              Vollständigkeit oder Aktualität.</strong> Bitte prüfe aktuelle Informationen direkt
              bei den jeweiligen Förderstellen. Die KI-Empfehlungen ersetzen keine professionelle
              Beratung.
            </p>
          </section>

          {/* Betreiber */}
          <section>
            <h3 className="font-semibold text-[#1A1A1A] mb-2">Betreiber</h3>
            <p className="text-[#6B6860]">
              Förderpilot ist ein Service von{' '}
              <a href="https://mmind.ai" target="_blank" rel="noopener noreferrer"
                className="text-[#0D4F6B] font-medium hover:text-[#E8530A]">mmind.ai</a>.
              Bei Fragen zum Datenschutz: <a href="mailto:info@mmind.ai"
                className="text-[#0D4F6B] hover:text-[#E8530A]">info@mmind.ai</a>
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full bg-[#0D4F6B] hover:bg-[#093847] text-white font-semibold py-3 rounded-xl transition-colors duration-200"
          >
            Verstanden
          </button>
        </div>
      </div>
    </div>
  )
}
