import headerImg from '../assets/header.jpg'

const HEADLINES = [
  { main: 'Welche Förderung', accent: 'passt zu dir?' },
  { main: '100+ Förderungen', accent: 'in Liechtenstein.' },
  { main: 'KI-gestützte Suche,', accent: 'in Sekunden.' },
  { main: 'Von Wirtschaft bis Kultur –', accent: 'alles auf einen Blick.' },
  { main: 'Dein persönlicher', accent: 'Förderpilot.' },
]

export default function HeroBanner() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl mb-8 shadow-xl">
      {/* Bild */}
      <img
        src={headerImg}
        alt="Förderpilot – Liechtenstein"
        className="w-full object-cover"
        style={{ height: 'clamp(220px, 35vw, 380px)' }}
        loading="eager"
      />

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(9,56,71,0.82) 0%, rgba(13,79,107,0.65) 50%, rgba(9,56,71,0.45) 100%)',
        }}
      />

      {/* Animierte Texte */}
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="relative w-full text-center" style={{ height: '7rem' }}>
          {HEADLINES.map(({ main, accent }, i) => (
            <div key={i} className="hero-text-item">
              <p className="text-white/80 text-sm sm:text-base font-body font-medium tracking-wider uppercase mb-2 drop-shadow">
                {main}
              </p>
              <h2
                className="font-headline text-white leading-tight drop-shadow-lg"
                style={{ fontSize: 'clamp(1.6rem, 4.5vw, 2.8rem)', fontWeight: 700 }}
              >
                {accent}
              </h2>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Info Strip */}
      <div className="absolute bottom-0 inset-x-0 px-5 py-3 flex items-center justify-between"
        style={{ background: 'linear-gradient(to top, rgba(9,56,71,0.85), transparent)' }}>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
          <span className="text-white/80 text-xs font-medium">100 Förderungen · Stand März 2026</span>
        </div>
        <span className="text-white/60 text-xs">foerderpilot.mmind.space</span>
      </div>
    </div>
  )
}
