import { useState } from 'react'
import { foerderungenData, KATEGORIEN } from '../data/foerderungen'
import type { Foerderung } from '../types'

const ADMIN_PASSWORD = 'fp2026admin'
const AUTH_KEY = 'fp_admin_auth'

interface Props {
  onExit: () => void
  version: string
}

function PasswordGate({ onSuccess, onExit }: { onSuccess: () => void; onExit: () => void }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)

  const handleLogin = () => {
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, '1')
      onSuccess()
    } else {
      setError(true)
      setPw('')
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'radial-gradient(ellipse at center, #0D4F6B 0%, #093847 100%)' }}>
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 w-full max-w-sm shadow-2xl animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="white" strokeWidth="1.5" />
              <path d="M7 11V7a5 5 0 0110 0v4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="font-headline text-xl font-semibold text-white mb-1">Admin-Bereich</h2>
          <p className="text-white/50 text-sm">Förderpilot · interner Bereich</p>
        </div>

        <div className="space-y-3">
          <input
            type="password"
            value={pw}
            onChange={e => { setPw(e.target.value); setError(false) }}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="Passwort"
            autoFocus
            className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-white/30 focus:outline-none focus:ring-2 text-sm ${
              error ? 'border-red-400 focus:ring-red-400/30' : 'border-white/20 focus:ring-white/30'
            }`}
          />
          {error && (
            <p className="text-red-300 text-xs text-center">Falsches Passwort</p>
          )}
          <button
            onClick={handleLogin}
            className="w-full bg-white text-[#093847] font-semibold py-3 rounded-xl hover:bg-white/90 transition-colors text-sm"
          >
            Anmelden
          </button>
          <button
            onClick={onExit}
            className="w-full text-white/40 hover:text-white/70 transition-colors text-sm py-1"
          >
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminPanel({ onExit, version }: Props) {
  const [isAuth, setIsAuth] = useState(() => sessionStorage.getItem(AUTH_KEY) === '1')
  const [activeTab, setActiveTab] = useState<'dashboard' | 'foerderungen'>('dashboard')
  const [search, setSearch] = useState('')

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY)
    onExit()
  }

  if (!isAuth) {
    return <PasswordGate onSuccess={() => setIsAuth(true)} onExit={onExit} />
  }

  const categoryStats = KATEGORIEN.map(k => ({
    name: k,
    count: foerderungenData.filter((f: Foerderung) => f.kategorie === k).length,
  })).sort((a, b) => b.count - a.count)

  const filtered = search.trim()
    ? foerderungenData.filter((f: Foerderung) =>
        [f.name, f.anbieter, f.kategorie, f.zielgruppe_text].join(' ')
          .toLowerCase().includes(search.toLowerCase())
      )
    : foerderungenData

  return (
    <div className="fixed inset-0 z-[100] bg-[#F5F3EF] overflow-y-auto">
      {/* Admin Header */}
      <header className="sticky top-0 z-10 shadow-lg"
        style={{ background: 'linear-gradient(135deg, #093847 0%, #0D4F6B 100%)' }}>
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[11px] bg-amber-400 text-amber-900 px-2 py-0.5 rounded font-bold uppercase tracking-widest">
              Admin
            </span>
            <span className="font-headline text-lg font-semibold text-white">Förderpilot Dashboard</span>
            <span className="text-white/30 text-xs font-mono">v{version}</span>
          </div>
          <div className="flex items-center gap-4">
            {/* Tab Switch */}
            <div className="flex bg-white/10 rounded-xl p-1 gap-0.5">
              {(['dashboard', 'foerderungen'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-4 py-1.5 text-sm rounded-lg font-medium transition-all ${
                    activeTab === t ? 'bg-white text-[#093847]' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {t === 'dashboard' ? 'Dashboard' : 'Förderungen'}
                </button>
              ))}
            </div>
            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 2H2V12H5M9 4L12 7L9 10M12 7H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Abmelden
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* === DASHBOARD === */}
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in">
            <h2 className="font-headline text-2xl font-semibold text-[#1A1A1A] mb-6">Übersicht</h2>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Förderungen', value: String(foerderungenData.length), sub: 'total erfasst', color: '#0D4F6B' },
                { label: 'Kategorien', value: String(KATEGORIEN.length), sub: 'Bereiche', color: '#1a6d8f' },
                { label: 'Version', value: `v${version}`, sub: 'aktuell', color: '#E8530A' },
                { label: 'Datenstand', value: 'März 2026', sub: 'web-verifiziert', color: '#6B6860' },
              ].map(({ label, value, sub, color }) => (
                <div key={label} className="bg-white border border-[#D4D1CB] rounded-2xl p-5 shadow-sm">
                  <div className="text-2xl font-headline font-bold mb-1" style={{ color }}>{value}</div>
                  <div className="text-sm font-semibold text-[#1A1A1A]">{label}</div>
                  <div className="text-xs text-[#9B998F] mt-0.5">{sub}</div>
                </div>
              ))}
            </div>

            {/* Category breakdown */}
            <div className="bg-white border border-[#D4D1CB] rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-[#1A1A1A] mb-5 flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-[#0D4F6B] inline-block" />
                Förderungen nach Kategorie
              </h3>
              <div className="space-y-3">
                {categoryStats.map(({ name, count }) => (
                  <div key={name} className="flex items-center gap-3">
                    <span className="text-sm text-[#6B6860] shrink-0" style={{ width: '220px' }}>{name}</span>
                    <div className="flex-1 bg-[#EAE8E4] rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${(count / foerderungenData.length) * 100}%`,
                          background: 'linear-gradient(90deg, #0D4F6B, #1a6d8f)',
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-[#1A1A1A] w-8 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
              <strong>Hinweis:</strong> Dies ist ein passwortgeschützter Administrationsbereich für interne Zwecke.
              URL: <code className="font-mono bg-amber-100 px-1 rounded">#admin</code>
            </div>
          </div>
        )}

        {/* === FÖRDERUNGEN TABLE === */}
        {activeTab === 'foerderungen' && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-headline text-2xl font-semibold text-[#1A1A1A]">Alle Förderungen</h2>
              <span className="text-sm text-[#9B998F] bg-white border border-[#D4D1CB] px-3 py-1 rounded-lg">
                {filtered.length} / {foerderungenData.length}
              </span>
            </div>

            <div className="relative mb-4">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9B998F]" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M10 10L13.5 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Suche nach Name, Anbieter, Kategorie, Zielgruppe…"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-[#D4D1CB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D4F6B]/30 focus:border-[#0D4F6B] bg-white shadow-sm"
              />
            </div>

            <div className="bg-white border border-[#D4D1CB] rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F8F7F4] border-b border-[#D4D1CB]">
                      {['#', 'Name / Website', 'Anbieter', 'Kategorie', 'Frist-Typ', 'Förderumfang'].map(h => (
                        <th key={h} className={`text-left px-4 py-3 text-[#6B6860] font-semibold text-xs uppercase tracking-wider ${
                          ['Kategorie', 'Frist-Typ', 'Förderumfang'].includes(h) ? 'hidden lg:table-cell' : h === 'Anbieter' ? 'hidden md:table-cell' : ''
                        }`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((f: Foerderung, i: number) => (
                      <tr
                        key={f.id}
                        className={`border-b border-[#EAE8E4] hover:bg-[#F0F7FB] transition-colors ${i % 2 === 1 ? 'bg-[#FAFAF8]' : ''}`}
                      >
                        <td className="px-4 py-3 text-xs text-[#9B998F] font-mono w-10">{f.id}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-[#1A1A1A] leading-snug">{f.name}</div>
                          <a href={f.website} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-[#0D4F6B] hover:text-[#E8530A] transition-colors">
                            {f.website.replace('https://', '').split('/')[0]}
                          </a>
                        </td>
                        <td className="px-4 py-3 text-[#6B6860] hidden md:table-cell">{f.anbieter}</td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <span className="text-xs bg-[#EAE8E4] text-[#6B6860] px-2 py-0.5 rounded-full whitespace-nowrap">{f.kategorie}</span>
                        </td>
                        <td className="px-4 py-3 text-[#6B6860] text-xs hidden lg:table-cell capitalize">{f.frist_typ}</td>
                        <td className="px-4 py-3 text-[#6B6860] text-xs hidden lg:table-cell">{f.foerderumfang}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
