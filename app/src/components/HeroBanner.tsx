import headerImg from '../assets/header-v2.png'

const HEADLINES = [
  { sub: 'Liechtenstein · 104 Förderungen', main: 'Welche Förderung passt zu dir?' },
  { sub: 'KI-gestützte Suche', main: 'In Sekunden zur richtigen Förderung.' },
  { sub: 'Wirtschaft · Kultur · Bildung · Umwelt', main: 'Alles auf einen Blick.' },
  { sub: 'Unternehmen, Privatpersonen & Organisationen', main: 'Dein persönlicher Förderpilot.' },
  { sub: 'Stand März 2026 · Web-verifiziert', main: 'Verlässliche Förderdaten.' },
]

export default function HeroBanner() {
  return (
    <div className="relative w-full overflow-hidden" style={{ boxShadow: '0 4px 32px rgba(9,56,71,0.18)' }}>
      {/* Bild */}
      <img
        src={headerImg}
        alt="Förderpilot – Liechtenstein"
        className="w-full object-cover object-center"
        style={{ height: 'clamp(260px, 38vw, 480px)' }}
        loading="eager"
      />

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(9,56,71,0.78) 0%, rgba(13,79,107,0.55) 45%, rgba(9,56,71,0.35) 100%)',
        }}
      />

      {/* Subtle radial accent top-right */}
      <div className="absolute top-0 right-0 w-96 h-96 opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #E8530A, transparent 70%)', transform: 'translate(30%, -30%)' }} />

      {/* Animierte Texte */}
      <div className="absolute inset-0 flex items-center justify-center px-6 sm:px-12">
        <div className="relative w-full max-w-3xl text-center" style={{ height: 'clamp(100px, 14vw, 160px)' }}>
          {HEADLINES.map(({ sub, main }, i) => (
            <div key={i} className="hero-text-item">
              <p className="text-white/70 text-xs sm:text-sm font-body font-semibold tracking-widest uppercase mb-3 drop-shadow">
                {sub}
              </p>
              <h1
                className="font-headline text-white leading-tight drop-shadow-lg"
                style={{ fontSize: 'clamp(1.7rem, 4.8vw, 3rem)', fontWeight: 700, textShadow: '0 2px 16px rgba(0,0,0,0.3)' }}
              >
                {main}
              </h1>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Info Strip */}
      <div className="absolute bottom-0 inset-x-0 px-5 sm:px-8 py-3 flex items-center justify-between"
        style={{ background: 'linear-gradient(to top, rgba(9,56,71,0.90), transparent)' }}>
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block shadow-sm" />
          <span className="text-white/80 text-xs font-semibold tracking-wide">104 Förderungen · Stand März 2026</span>
        </div>
        <span className="text-white/40 text-xs font-mono hidden sm:block">foerderpilot.mmind.space</span>
      </div>
    </div>
  )
}
