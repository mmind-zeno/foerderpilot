const CONSENT_KEY = 'foerderpilot_consent_v1'

export function hasConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === 'true'
  } catch {
    return false
  }
}

function saveConsent() {
  try {
    localStorage.setItem(CONSENT_KEY, 'true')
  } catch { /* ignore */ }
}

interface Props {
  onAccept: () => void
}

export default function ConsentModal({ onAccept }: Props) {
  function handleAccept() {
    saveConsent()
    onAccept()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-up">

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-[#EAE8E4]">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 bg-[#0D4F6B]/10 rounded-xl flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 1.5L2.5 4.5V9C2.5 12.5 5.4 15.5 9 16.5C12.6 15.5 15.5 12.5 15.5 9V4.5L9 1.5Z" stroke="#0D4F6B" strokeWidth="1.4" strokeLinejoin="round"/>
                <path d="M6 9L7.8 11L12 7" stroke="#0D4F6B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="font-headline text-lg font-semibold text-[#1A1A1A]">
              Datenschutz & KI-Hinweis
            </h2>
          </div>
          <p className="text-[13px] text-[#9B998F] mt-2">
            Bitte lies und akzeptiere die folgenden Hinweise, bevor du Förderpilot nutzt.
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-4 text-[14px] text-[#1A1A1A] leading-relaxed">

          {/* KI */}
          <section>
            <h3 className="font-semibold text-[#0D4F6B] mb-1.5 flex items-center gap-2">
              <span className="text-xs bg-[#0D4F6B] text-white px-2 py-0.5 rounded font-mono">KI</span>
              Einsatz von Künstlicher Intelligenz
            </h3>
            <p className="text-[#6B6860]">
              Förderpilot nutzt ein <strong className="text-[#1A1A1A]">Large Language Model (LLM)</strong>,
              um deine Situationsbeschreibung auszuwerten und passende Förderungen zu empfehlen.
              Die Ergebnisse sind KI-generierte Empfehlungen – <strong className="text-[#1A1A1A]">keine Rechts- oder Beratungsleistung</strong>.
            </p>
          </section>

          {/* Daten */}
          <section>
            <h3 className="font-semibold text-[#1A1A1A] mb-1.5">Datenverarbeitung</h3>
            <ul className="space-y-1.5 text-[#6B6860]">
              <li className="flex gap-2">
                <span className="text-[#0D4F6B] mt-0.5 shrink-0">→</span>
                <span>Deine <strong className="text-[#1A1A1A]">Texteingabe</strong> wird an eine KI-API gesendet, um passende Förderungen zu finden.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#0D4F6B] mt-0.5 shrink-0">→</span>
                <span><strong className="text-[#1A1A1A]">Keine dauerhafte Speicherung</strong> durch Förderpilot. Keine Cookies, kein Tracking.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#0D4F6B] mt-0.5 shrink-0">→</span>
                <span>Der jeweilige KI-Anbieter verarbeitet die Daten gemäss seiner eigenen Datenschutzrichtlinie.</span>
              </li>
            </ul>
          </section>

          {/* Disclaimer */}
          <section className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-amber-800 text-[13px]">
              <strong>Haftungsausschluss:</strong> Förderungsinformationen basieren auf öffentlich zugänglichen Quellen (Stand März 2026). Ohne Gewähr für Richtigkeit oder Aktualität. Die KI-Empfehlungen ersetzen keine professionelle Beratung.
            </p>
          </section>
        </div>

        {/* Accept */}
        <div className="px-6 pb-6">
          <button
            onClick={handleAccept}
            className="w-full bg-[#0D4F6B] hover:bg-[#093847] text-white font-semibold py-3.5 rounded-xl transition-colors duration-200 text-[15px]"
          >
            Verstanden & Akzeptieren
          </button>
          <p className="text-center text-[11px] text-[#B0ADA5] mt-3">
            Diese Zustimmung wird in deinem Browser gespeichert.
          </p>
        </div>
      </div>
    </div>
  )
}
