export interface Foerderung {
  id: number
  name: string
  anbieter: string
  kategorie: string
  zielgruppe: string[]
  zielgruppe_text: string
  foerderumfang: string
  foerderumfang_max_chf: number | null
  antragsfrist: string
  frist_typ: 'laufend' | 'jährlich' | 'mehrmals jährlich' | 'antragsprinzip' | 'periodisch'
  bedingungen: string
  website: string
  tags: string[]
}

export interface FoerderungMatch {
  id: number
  name: string
  anbieter: string
  warum_passend: string
  foerderumfang: string
  frist: string
  website: string
  prioritaet: 'hoch' | 'mittel'
}

export interface ApiResponse {
  intro: string
  matches: FoerderungMatch[]
  naechster_schritt: string
  hinweis: string | null
  cta_text: string
}

export type AppView = 'hero' | 'loading' | 'results'
export type AppTab = 'search' | 'catalog'
