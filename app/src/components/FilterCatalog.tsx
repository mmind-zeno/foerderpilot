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

export default function FilterCatalog() {
  const [search, setSearch] = useState('')
  const [selectedKat, setSelectedKat] = useState('')
  const [selectedFrist, setSelectedFrist] = useState('')

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return foerderungenData.filter((f: Foerderung) => {
      if (selectedKat && f.kategorie !== selectedKat) return false
      if (selectedFrist && f.frist_typ !== selectedFrist) return false
      if (q) {
        const searchable = [
          f.name,
          f.anbieter,
          f.kategorie,
          f.zielgruppe_text,
          ...f.tags,
        ].join(' ').toLowerCase()
        return searchable.includes(q)
      }
      return true
    })
  }, [search, selectedKat, selectedFrist])

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-headline text-2xl font-semibold text-[#1A1A1A] mb-1">
          Alle 100 Förderungen in Liechtenstein
        </h2>
        <p className="text-sm text-[#6B6860]">Stand März 2026 · Ohne Gewähr</p>
      </div>

      {/* Filter-Leiste */}
      <div className="bg-white border border-[#D4D1CB] rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-3">
        {/* Suche */}
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B998F]" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M10 10L13.5 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Suche nach Name, Anbieter, Tags…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-[#D4D1CB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D4F6B]/30 focus:border-[#0D4F6B] bg-[#F8F7F4]"
          />
        </div>

        {/* Kategorie */}
        <select
          value={selectedKat}
          onChange={(e) => setSelectedKat(e.target.value)}
          className="text-sm border border-[#D4D1CB] rounded-lg px-3 py-2 bg-[#F8F7F4] focus:outline-none focus:ring-2 focus:ring-[#0D4F6B]/30 focus:border-[#0D4F6B] text-[#1A1A1A]"
        >
          <option value="">Alle Kategorien</option>
          {KATEGORIEN.map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>

        {/* Fristtyp */}
        <select
          value={selectedFrist}
          onChange={(e) => setSelectedFrist(e.target.value)}
          className="text-sm border border-[#D4D1CB] rounded-lg px-3 py-2 bg-[#F8F7F4] focus:outline-none focus:ring-2 focus:ring-[#0D4F6B]/30 focus:border-[#0D4F6B] text-[#1A1A1A]"
        >
          {FRIST_TYPEN.map((ft) => (
            <option key={ft.value} value={ft.value}>{ft.label}</option>
          ))}
        </select>

        {/* Reset */}
        {(search || selectedKat || selectedFrist) && (
          <button
            onClick={() => { setSearch(''); setSelectedKat(''); setSelectedFrist('') }}
            className="text-sm text-[#6B6860] hover:text-[#E8530A] transition-colors px-2"
          >
            Zurücksetzen
          </button>
        )}
      </div>

      {/* Ergebnis-Counter */}
      <p className="text-sm text-[#6B6860] mb-4">
        <span className="font-semibold text-[#1A1A1A]">{filtered.length}</span> von 100 Förderungen
      </p>

      {/* Liste */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-[#9B998F]">
            <p className="text-lg font-headline mb-2">Keine Treffer</p>
            <p className="text-sm">Versuche eine andere Suche oder setze die Filter zurück.</p>
          </div>
        ) : (
          filtered.map((f: Foerderung) => (
            <div
              key={f.id}
              className="bg-white border border-[#D4D1CB] rounded-xl p-5 hover:border-[#0D4F6B]/40 hover:shadow-sm transition-all duration-150"
            >
              <div className="flex items-start gap-4">
                {/* ID */}
                <span className="shrink-0 text-xs font-mono text-[#9B998F] pt-0.5 w-6 text-right">
                  {f.id}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-[#1A1A1A] text-[15px] leading-snug truncate">
                        {f.name}
                      </h3>
                      <p className="text-xs text-[#6B6860] mt-0.5">{f.anbieter}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${FRIST_COLOR[f.frist_typ] ?? 'bg-gray-100 text-gray-700'}`}>
                        {FRIST_LABEL[f.frist_typ] ?? f.frist_typ}
                      </span>
                    </div>
                  </div>

                  {/* Meta-Infos */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[#6B6860] mb-3">
                    <span>
                      <span className="text-[#9B998F]">Kategorie:</span>{' '}
                      <span className="text-[#1A1A1A]">{f.kategorie}</span>
                    </span>
                    <span>
                      <span className="text-[#9B998F]">Förderung:</span>{' '}
                      <span className="text-[#1A1A1A]">{f.foerderumfang}</span>
                    </span>
                    <span>
                      <span className="text-[#9B998F]">Frist:</span>{' '}
                      <span className="text-[#1A1A1A]">{f.antragsfrist}</span>
                    </span>
                  </div>

                  {/* Zielgruppe Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {f.zielgruppe.slice(0, 4).map((z) => (
                      <span key={z} className="text-[11px] bg-[#EAE8E4] text-[#6B6860] px-2 py-0.5 rounded-full">
                        {z}
                      </span>
                    ))}
                  </div>

                  {/* Link */}
                  <a
                    href={f.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] font-medium text-[#0D4F6B] hover:text-[#E8530A] transition-colors inline-flex items-center gap-1"
                  >
                    Website besuchen
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path d="M1 10L10 1M10 1H4M10 1V7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
