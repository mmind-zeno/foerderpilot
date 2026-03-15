import type { Foerderung } from '../types'
import rawData from './foerderungen_data.json'

export const foerderungenData: Foerderung[] = rawData as Foerderung[]

export const KATEGORIEN = [
  'Wirtschaft & Innovation',
  'Gründung & Venture',
  'Energie & Umwelt',
  'Kultur & Medien',
  'Bildung & Forschung',
  'Jugend & Soziales',
  'Landwirtschaft & Umwelt',
  'Regional & International',
  'Stiftungen',
  'Beratung & Information',
] as const

export const ZIELGRUPPEN = [
  'Alle',
  'KMU',
  'Startups',
  'Unternehmen',
  'Privatpersonen',
  'Studierende',
  'Jugendliche',
  'Kulturschaffende',
  'Landwirte',
  'Organisationen',
  'Forschung',
] as const

export const FRIST_TYPEN = [
  { value: '', label: 'Alle Fristen' },
  { value: 'laufend', label: 'Laufend' },
  { value: 'jährlich', label: 'Jährlich' },
  { value: 'mehrmals jährlich', label: 'Mehrmals jährlich' },
  { value: 'antragsprinzip', label: 'Antragsprinzip' },
  { value: 'periodisch', label: 'Periodisch' },
] as const
