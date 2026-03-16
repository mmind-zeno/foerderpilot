import { useState, useMemo } from 'react'
import { foerderungenData, KATEGORIEN, FRIST_TYPEN } from '../data/foerderungen'
import type { Foerderung } from '../types'

const FRIST_LABEL: Record<string, string> = {
  laufend: 'Laufend',
  jährlich: 'Jährlich',
  'mehrmals jährlich': 'Mehrmals jährl.',
  antragsprinzip: 'Antragsprinzip',
  periodisch: 'Periodisch',
}

const FRIST_COLOR: Record<string, string> = {
  laufend: 'bg-emerald-100 text-emerald-800',
  jährlich: 'bg-blue-100 text-blue-800',
  'mehrmals jährlich': 'bg-purple-100 text-purple-800',
  antragsprinzip: 'bg-amber-100 text-amber-800',
  periodisch: 'bg-slate-100 text-slate-700',
}

const KAT_CONFIG: Record<string, { icon: string; pill: string; pillActive: string }> = {
  'Wirtschaft & Innovation': {
    icon: '💡',
    pill: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200 hover:ring-blue-400',
    pillActive: 'bg-blue-600 text-white ring-1 ring-blue-600',
  },
  'Gründung & Venture': {
    icon: '🚀',
    pill: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200 hover:ring-violet-400',
    pillActive: 'bg-violet-600 text-white ring-1 ring-violet-600',
  },
  'Energie & Umwelt': {
    icon: '🌱',
    pill: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:ring-emerald-400',
    pillActive: 'bg-emerald-600 text-white ring-1 ring-emerald-600',
  },
  'Kultur & Medien': {
    icon: '🎨',
    pill: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200 hover:ring-rose-400',
    pillActive: 'bg-rose-600 text-white ring-1 ring-rose-600',
  },
  'Bildung & Forschung': {
    icon: '🎓',
    pill: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 hover:ring-indigo-400',
    pillActive: 'bg-indigo-600 text-white ring-1 ring-indigo-600',
  },
  'Jugend & Soziales': {
    icon: '🤝',
    pill: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200 hover:ring-amber-400',
    pillActive: 'bg-amber-500 text-white ring-1 ring-amber-500',
  },
  'Landwirtschaft & Umwelt': {
    icon: '🌾',
    pill: 'bg-lime-50 text-lime-700 ring-1 ring-lime-200 hover:ring-lime-400',
    pillActive: 'bg-lime-600 text-white ring-1 ring-lime-600',
  },
  'Regional & International': {
    icon: '🌍',
    pill: 'bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200 hover:ring-cyan-400',
    pillActive: 'bg-cyan-600 text-white ring-1 ring-cyan-600',
  },
  'Stiftungen': {
    icon: '🏛️',
    pill: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200 hover:ring-orange-400',
    pillActive: 'bg-orange-500 text-white ring-1 ring-orange-500',
  },
  'Beratung & Information': {
    icon: 'ℹ️',
    pill: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200 hover:ring-slate-400',
    pillActive: 'bg-slate-600 text-white ring-1 ring-slate-600',
  },
}

const KAT_DOT: Record<string, string> = {
  'Wirtschaft & Innovation': 'bg-blue-400',
  'Gründung & Venture': 'bg-violet-500',
  'Energie & Umwelt': 'bg-emerald-500',
  'Kultur & Medien': 'bg-rose-400',
  'Bildung & Forschung': 'bg-indigo-400',
  'Jugend & Soziales': 'bg-amber-400',
  'Landwirtschaft & Umwelt': 'bg-lime-500',
  'Regional & International': 'bg-cyan-500',
  'Stiftungen': 'bg-orange-400',
  'Beratung & Information': 'bg-slate-400',
}

export default function FilterCatalog() {
  const [search, setSearch] = useState('')
  const [selectedKat, setSelectedKat] = useState('')
  const [selectedFrist, setSelectedFrist] = useState('')
  const [expanded, setExpanded] = useState<number | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return foerderungenData.filter((f: Foerderung) => {
      if (selectedKat && f.kategorie !== selectedKat) return false
      if (selectedFrist && f.frist_typ !== selectedFrist) return false
      if (q) {
        const searchable = [
          f.name, f.anbieter, f.kategorie, f.zielgruppe_text, f.bedingungen, ...f.tags,
        ].join(' ').toLowerCase()
        return searchable.includes(q)
      }
      return true
    })
  }, [search, selectedKat, selectedFrist])

  const toggleExpand = (id: number) => setExpanded(prev => prev === id ? null : id)
  const hasFilters = search || selectedKat || selectedFrist
  const resetFilters = () => { setSearch(''); setSelectedKat(''); setSelectedFrist(''); setExpanded(null) }

  return (
    <div className="animate-fade-in">
      <div className="lg:flex lg:gap-8 lg:items-start">

        {/* ── Sidebar ── */}
        <aside className="w-full lg:w-64 xl:w-72 shrink-0 mb-5 lg:mb-0 lg:sticky lg:top-[4.5rem] lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto">

          {/* Header */}
          <div className="mb-5">
            <h2 className="font-headline text-xl lg:text-2xl font-semibold text-[#1A1A1A] mb-1">
              Alle {foerderungenData.length} Förderungen
            </h2>
            <p className="text-xs text-[#6B6860]">Liechtenstein · Stand März 2026 · Ohne Gewähr</p>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B998F]" width="15" height="15" viewBox="0 0 16 16" fill="none">
              <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M10 10L13.5 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Name, Anbieter, Tags…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setExpanded(null) }}
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-[#D4D1CB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D4F6B]/30 focus:border-[#0D4F6B] bg-white"
            />
          </div>

          {/* Frist filter */}
          <select
            value={selectedFrist}
            onChange={(e) => setSelectedFrist(e.target.value)}
            className="w-full text-sm border border-[#D4D1CB] rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#0D4F6B]/30 focus:border-[#0D4F6B] text-[#1A1A1A] mb-4"
          >
            {FRIST_TYPEN.map((ft) => (
              <option key={ft.value} value={ft.value}>{ft.label}</option>
            ))}
          </select>

          {/* Category list — VERTICAL on desktop */}
          <div className="hidden lg:block mb-4">
            <p className="text-[10px] font-bold text-[#9B998F] uppercase tracking-widest mb-2 px-1">Kategorie</p>
            <div className="space-y-0.5">
              <button
                onClick={() => { setSelectedKat(''); setExpanded(null) }}
                className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                  selectedKat === '' ? 'bg-[#0D4F6B] text-white' : 'text-[#6B6860] hover:bg-[#EAE8E4]'
                }`}
              >
                <span>Alle Kategorien</span>
                <span className={`text-[11px] font-semibold tabular-nums ${selectedKat === '' ? 'opacity-70' : 'text-[#9B998F]'}`}>
                  {foerderungenData.length}
                </span>
              </button>
              {KATEGORIEN.map((k) => {
                const cfg = KAT_CONFIG[k]
                const count = foerderungenData.filter(f => f.kategorie === k).length
                const isActive = selectedKat === k
                return (
                  <button
                    key={k}
                    onClick={() => { setSelectedKat(isActive ? '' : k); setExpanded(null) }}
                    className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all ${
                      isActive ? 'bg-[#EAE8E4] text-[#1A1A1A] font-semibold' : 'text-[#6B6860] hover:bg-[#F0EDE6] font-medium'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full shrink-0 ${KAT_DOT[k] ?? 'bg-gray-300'}`} />
                    <span className="flex-1">{cfg?.icon} {k}</span>
                    <span className={`text-[11px] tabular-nums ${isActive ? 'text-[#6B6860]' : 'text-[#9B998F]'}`}>{count}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Category pills — HORIZONTAL on mobile */}
          <div className="flex lg:hidden gap-2 overflow-x-auto pb-1 snap-x mb-2" style={{ scrollbarWidth: 'none' }}>
            <button
              onClick={() => { setSelectedKat(''); setExpanded(null) }}
              className={`shrink-0 snap-start text-[12px] font-semibold px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
                selectedKat === '' ? 'bg-[#0D4F6B] text-white shadow-sm' : 'bg-[#EAE8E4] text-[#6B6860] hover:bg-[#D4D1CB]'
              }`}
            >
              Alle ({foerderungenData.length})
            </button>
            {KATEGORIEN.map((k) => {
              const cfg = KAT_CONFIG[k]
              const count = foerderungenData.filter(f => f.kategorie === k).length
              const isActive = selectedKat === k
              return (
                <button
                  key={k}
                  onClick={() => { setSelectedKat(isActive ? '' : k); setExpanded(null) }}
                  className={`shrink-0 snap-start flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${isActive ? cfg?.pillActive : cfg?.pill}`}
                >
                  <span>{cfg?.icon}</span>
                  <span>{k}</span>
                  <span className={isActive ? 'opacity-70' : 'opacity-50'}>({count})</span>
                </button>
              )
            })}
          </div>

          {/* Counter + Reset */}
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-[#6B6860]">
              <span className="font-semibold text-[#1A1A1A]">{filtered.length}</span>
              <span className="text-[#9B998F]"> / {foerderungenData.length}</span>
            </p>
            {hasFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-[#6B6860] hover:text-[#E8530A] transition-colors flex items-center gap-1"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                Zurücksetzen
              </button>
            )}
          </div>
        </aside>

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0">

          {/* Mobile counter */}
          <p className="text-sm text-[#6B6860] mb-4 lg:hidden">
            <span className="font-semibold text-[#1A1A1A]">{filtered.length}</span> von {foerderungenData.length} Förderungen
            {selectedKat && (
              <span className="ml-2 text-[11px] bg-[#EAE8E4] text-[#6B6860] px-2 py-0.5 rounded-full">
                {KAT_CONFIG[selectedKat]?.icon} {selectedKat}
              </span>
            )}
          </p>

          {/* Desktop counter + hint */}
          <div className="hidden lg:flex items-center justify-between mb-4">
            <p className="text-sm text-[#6B6860]">
              {selectedKat
                ? <><span className="font-semibold text-[#1A1A1A]">{filtered.length}</span> Förderungen in <span className="font-medium">{KAT_CONFIG[selectedKat]?.icon} {selectedKat}</span></>
                : <><span className="font-semibold text-[#1A1A1A]">{filtered.length}</span> Förderungen{search && <> für „{search}"</>}</>
              }
            </p>
            <p className="text-xs text-[#B0ADA5]">Klicke für Details</p>
          </div>

          {/* Card list */}
          <div className="space-y-2">
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-[#9B998F]">
                <div className="text-4xl mb-4">🔍</div>
                <p className="text-lg font-headline mb-2">Keine Treffer</p>
                <p className="text-sm mb-4">Versuche eine andere Suche oder setze die Filter zurück.</p>
                <button
                  onClick={resetFilters}
                  className="text-sm text-[#0D4F6B] hover:text-[#E8530A] underline transition-colors"
                >
                  Filter zurücksetzen
                </button>
              </div>
            ) : (
              filtered.map((f: Foerderung) => (
                <div
                  key={f.id}
                  className="bg-white border border-[#D4D1CB] rounded-xl overflow-hidden hover:border-[#0D4F6B]/30 transition-colors shadow-sm"
                >
                  {/* Summary row */}
                  <button
                    className="w-full text-left p-4 sm:p-5"
                    onClick={() => toggleExpand(f.id)}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <span className="shrink-0 text-xs font-mono text-[#9B998F] pt-0.5 w-6 text-right hidden sm:block">{f.id}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${KAT_DOT[f.kategorie] ?? 'bg-gray-300'}`} />
                              <h3 className="font-semibold text-[#1A1A1A] text-[14px] sm:text-[15px] leading-snug">{f.name}</h3>
                            </div>
                            <p className="text-xs text-[#6B6860] mt-0.5">{f.anbieter}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full hidden sm:inline ${FRIST_COLOR[f.frist_typ] ?? 'bg-gray-100 text-gray-700'}`}>
                              {FRIST_LABEL[f.frist_typ] ?? f.frist_typ}
                            </span>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                              className={`text-[#9B998F] transition-transform duration-200 shrink-0 ${expanded === f.id ? 'rotate-180' : ''}`}>
                              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-[#6B6860] mt-2">
                          <span><span className="text-[#9B998F]">Förderung:</span> {f.foerderumfang}</span>
                          <span className="sm:hidden"><span className="text-[#9B998F]">Frist:</span> {FRIST_LABEL[f.frist_typ] ?? f.frist_typ}</span>
                        </div>

                        <div className="flex flex-wrap gap-1 mt-2">
                          {f.zielgruppe.slice(0, 3).map((z) => (
                            <span key={z} className="text-[11px] bg-[#EAE8E4] text-[#6B6860] px-2 py-0.5 rounded-full">{z}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Expanded details */}
                  {expanded === f.id && (
                    <div className="border-t border-[#F0EDE6] bg-[#FAFAF8] px-4 sm:px-5 pb-5 pt-4 space-y-4">

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <div className="text-[10px] font-bold text-[#9B998F] uppercase tracking-widest mb-1">Förderumfang</div>
                          <div className="text-sm text-[#1A1A1A] font-medium">{f.foerderumfang}</div>
                          {f.foerderumfang_max_chf && (
                            <div className="text-xs text-[#6B6860] mt-0.5">Max: CHF {f.foerderumfang_max_chf.toLocaleString('de-CH')}</div>
                          )}
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-[#9B998F] uppercase tracking-widest mb-1">Antragsfrist</div>
                          <div className="text-sm text-[#1A1A1A]">{f.antragsfrist}</div>
                        </div>
                        <div className="sm:col-span-2 lg:col-span-1">
                          <div className="text-[10px] font-bold text-[#9B998F] uppercase tracking-widest mb-1">Zielgruppe</div>
                          <div className="text-sm text-[#1A1A1A]">{f.zielgruppe_text}</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] font-bold text-[#9B998F] uppercase tracking-widest mb-2">Voraussetzungen & Details</div>
                        <div className="text-sm text-[#3A3A3A] leading-relaxed bg-white border border-[#EAE8E4] rounded-lg p-4">
                          {f.bedingungen}
                        </div>
                      </div>

                      {(f.kontakt_email || f.kontakt_tel || f.antrag_url) && (
                        <div>
                          <div className="text-[10px] font-bold text-[#9B998F] uppercase tracking-widest mb-2">Kontakt & Direktantrag</div>
                          <div className="flex flex-wrap gap-3 sm:gap-4">
                            {f.kontakt_email && (
                              <a href={`mailto:${f.kontakt_email}`}
                                className="flex items-center gap-2 text-sm text-[#0D4F6B] hover:text-[#E8530A] transition-colors font-medium">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                  <rect x="1" y="2.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                                  <path d="M1 4l6 4 6-4" stroke="currentColor" strokeWidth="1.3" />
                                </svg>
                                {f.kontakt_email}
                              </a>
                            )}
                            {f.kontakt_tel && (
                              <a href={`tel:${f.kontakt_tel}`}
                                className="flex items-center gap-2 text-sm text-[#0D4F6B] hover:text-[#E8530A] transition-colors font-medium">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                  <path d="M2 2h3l1.5 3.5-2 1.2A8.5 8.5 0 007.3 10l1.2-2L12 9.5V12a1 1 0 01-1 1C5 13 1 9 1 3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.3" />
                                </svg>
                                {f.kontakt_tel}
                              </a>
                            )}
                            {f.antrag_url && (
                              <a href={f.antrag_url} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm font-semibold text-white bg-[#E8530A] hover:bg-[#c4440a] px-4 py-1.5 rounded-lg transition-colors">
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                  <path d="M2 11L11 2M11 2H6M11 2v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Direkt zum Antrag
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex flex-wrap gap-1.5">
                          {f.tags.map((t) => (
                            <span key={t} className="text-[11px] bg-[#EAE8E4] text-[#6B6860] px-2 py-0.5 rounded-full">{t}</span>
                          ))}
                        </div>
                        <a
                          href={f.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0D4F6B] hover:text-[#E8530A] transition-colors group"
                        >
                          Website besuchen
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                            className="transition-transform group-hover:translate-x-0.5">
                            <path d="M1 11L11 1M11 1H6M11 1v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
