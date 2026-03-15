/**
 * Data update v3:
 * - Remove ID 31 (Radio Liechtenstein – existiert nicht mehr)
 * - Add new category "Gründung & Venture" (IDs 101–105)
 */

const fs = require('fs')
const path = require('path')

const dataPath = path.join(__dirname, 'app/src/data/foerderungen_data.json')
let data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))

// Remove ID 31 (Radio Liechtenstein)
data = data.filter(e => e.id !== 31)
console.log('Removed ID 31 (Radio Liechtenstein)')

// New entries – Kategorie "Gründung & Venture"
const newEntries = [
  {
    id: 101,
    name: 'Business Angels Club Liechtenstein (BACL)',
    anbieter: 'Business Angels Club Liechtenstein',
    kategorie: 'Gründung & Venture',
    zielgruppe: ['Startups', 'Unternehmen'],
    zielgruppe_text: 'Startups und Wachstumsunternehmen mit Liechtenstein-Bezug in der Wachstumsphase',
    foerderumfang: 'Private Angel-Investitionen (Höhe individuell verhandelt)',
    foerderumfang_max_chf: null,
    antragsfrist: 'Laufend; 3 Pitch-Events pro Jahr (2026: 3 Termine geplant)',
    frist_typ: 'mehrmals jährlich',
    bedingungen: 'Der Business Angels Club Liechtenstein (BACL) vernetzt investitionsbereite Business Angels mit Startups und Wachstumsunternehmen aus Liechtenstein und der Region. Für Startups: Online-Antrag einreichen → Vorselektion durch BACL-Team → Einladung zum Pitch-Event. Anforderungen: Liechtenstein-Bezug, konkreter Businessplan, nachweisbares Wachstumspotenzial. Investitionshöhe wird individuell zwischen Startup und Angel verhandelt. WICHTIG: Kein staatliches Fördergeld – private Eigenkapitalinvestitionen mit unternehmerischem Risiko. 3 Pitching-Events pro Jahr (weitere möglich bei ausreichender Nachfrage). Antrag jederzeit einreichbar.',
    website: 'https://businessangels.li/',
    tags: ['startup', 'angel', 'investoren', 'venture', 'eigenkapital', 'pitch'],
    kontakt_email: 'office@businessangels.li',
    antrag_url: 'https://businessangels.li/unterstuetzungsantrag',
  },
  {
    id: 102,
    name: 'Technopark Liechtenstein – Seed & Growth Finanzierung',
    anbieter: 'Technopark Liechtenstein',
    kategorie: 'Gründung & Venture',
    zielgruppe: ['Startups'],
    zielgruppe_text: 'Startups im Früh- und Wachstumsstadium, die sich im Technopark Liechtenstein ansiedeln',
    foerderumfang: 'Seed bis CHF 50\'000 (Darlehen) + Growth-Finanzierung nach Bedarf',
    foerderumfang_max_chf: 50000,
    antragsfrist: 'Laufend (direkter Kontakt mit Technopark-Team)',
    frist_typ: 'laufend',
    bedingungen: 'Der Technopark Liechtenstein (TPFL) bietet zwei Finanzierungsmodelle: (1) Seed-Finanzierung – bis ca. CHF 50\'000 als Darlehen für die frühe Startphase; Ziel: Ideenentwicklung bis zur Produktreife. (2) Growth-Finanzierung – für Startups mit Marktpräsenz und ersten Verkaufserfolgen (nachgewiesene Traction). Voraussetzung für beide Modelle: Aufbau des Unternehmens am Technopark Liechtenstein (Büro- oder Coworking-Miete). Zusätzlich inklusive: Mentoring durch erfahrene Unternehmer, Netzwerkzugang, Innosuisse-Coaching (Kosten vom Land LI übernommen). Kein öffentliches Ausschreibungsverfahren – direkter Kontakt mit TPFL-Team empfohlen.',
    website: 'https://www.technopark-liechtenstein.li/',
    tags: ['startup', 'seed', 'darlehen', 'finanzierung', 'technopark', 'inkubator', 'mentoring'],
    kontakt_email: 'office@tpfl.li',
    kontakt_tel: '+423 239 77 77',
    antrag_url: 'https://www.technopark-liechtenstein.li/en/network-and-funding/',
  },
  {
    id: 103,
    name: 'Impuls Liechtenstein – FinTech & Digital Innovation',
    anbieter: 'Stabsstelle für Finanzmarktinnovation (SFID), Regierung Liechtenstein',
    kategorie: 'Gründung & Venture',
    zielgruppe: ['Unternehmen', 'Startups', 'Forschung'],
    zielgruppe_text: 'Fintech-, Blockchain- und Digital-Asset-Unternehmen sowie Innovatoren im Finanzbereich',
    foerderumfang: 'Regulatory Sandbox, Beratung, Netzwerkzugang (kostenlos)',
    foerderumfang_max_chf: null,
    antragsfrist: 'Laufend',
    frist_typ: 'laufend',
    bedingungen: 'Impuls Liechtenstein unterstützt Fintech- und Digitalunternehmen bei Ansiedlung und Innovation in Liechtenstein. Kernleistungen: (1) Blockchain Act (TVTG) – Liechtenstein ist weltweiter Pionier in der Tokenisierung von Vermögenswerten; umfassende Rechtsberatung zum TVTG. (2) Regulatory Sandbox (Reallabor) – geschützter Testrahmen für neue Geschäftsmodelle, die (noch) keine Bewilligung benötigen. (3) Netzwerkzugang zu Banken, Treuhändern, VC-Investoren und Aufsichtsbehörden (FMA). (4) SFI Blockchain & Innovation Circle: regelmässige Fachveranstaltungen. Kontakt: Stabsstelle für Finanzmarktinnovation (SFID) beim Ministerium für Finanzen.',
    website: 'https://impuls-liechtenstein.li/',
    tags: ['fintech', 'blockchain', 'digital', 'token', 'TVTG', 'regulatory sandbox', 'innovation'],
    kontakt_email: 'info.sfi@llv.li',
    antrag_url: 'https://impuls-liechtenstein.li/en/',
  },
  {
    id: 104,
    name: 'HOI start-ups – Startup Hub & Mentoring',
    anbieter: 'Büchel Holding / HOI',
    kategorie: 'Gründung & Venture',
    zielgruppe: ['Startups'],
    zielgruppe_text: 'Jungunternehmer und Startups in der Gründungs- und Frühphase in Liechtenstein',
    foerderumfang: 'Flexible Büroinfrastruktur, Mentoring und Netzwerkzugang (Mietbasis)',
    foerderumfang_max_chf: null,
    antragsfrist: 'Laufend',
    frist_typ: 'laufend',
    bedingungen: 'HOI start-ups (start-ups.li) ist ein privater Startup-Hub der Büchel Holding in Liechtenstein. Angebote: (1) Flexible Büroräume und Coworking-Plätze – kurzfristig und unkompliziert mietbar; (2) Mentoring durch erfahrene Unternehmer und Branchenexperten in allen Geschäftsbereichen; (3) Netzwerk mit etablierten Unternehmen und der Liechtensteinischen Landesbank als Finanzpartner; (4) Einzigartiges Umfeld mit Hotel, Restaurant und Veranstaltungsräumen – ideal für Pitches und Kundenveranstaltungen. Kein staatliches Fördergeld; Nutzungsgebühren für Räumlichkeiten marktüblich. Anfragen jederzeit möglich.',
    website: 'https://www.start-ups.li/',
    tags: ['startup', 'coworking', 'mentoring', 'hub', 'netzwerk', 'büro', 'gründung'],
    antrag_url: 'https://www.start-ups.li/kontakt',
  },
  {
    id: 105,
    name: 'Liechtenstein Venture Cooperative (LVC)',
    anbieter: 'Liechtenstein Business / Amt für Volkswirtschaft',
    kategorie: 'Gründung & Venture',
    zielgruppe: ['Startups', 'Unternehmen', 'Forschung'],
    zielgruppe_text: 'Erfinder, Innovatoren und Investoren, die gemeinsam eine Idee entwickeln und schützen wollen',
    foerderumfang: 'Einzigartiger Rechtsrahmen ohne Mindestkapital (kostengünstige Gründung)',
    foerderumfang_max_chf: null,
    antragsfrist: 'Laufend',
    frist_typ: 'laufend',
    bedingungen: 'Die Liechtenstein Venture Cooperative (LVC) ist eine weltweit einzigartige Rechtsform für Frühphasen-Innovationen. Kernmerkmale: (1) Kein Mindestkapital – die Innovation selbst ist die Einlage (präzise beschrieben in einem notariell beglaubigten Innovationsdokument); (2) Keine Offenlegungspflicht; (3) Handelsregistereintrag freiwillig (erhöht Sichtbarkeit); (4) Ideal für Konsortien aus Erfindern, Investoren und Unterstützern. Anwendungsfälle: IP-Schutz bei Co-Entwicklung, Forschungskooperationen, Pre-Seed-Phase. Gründung erfordert Notartermin; Liechtenstein Business berät kostenlos zur LVC und anderen liechtensteinischen Rechtsformen. Anerkannt als internationale Innovation im Startup-Recht.',
    website: 'https://www.liechtenstein-business.li/en/Service-for-entrepreneurs/Founding-a-company/Legal-forms/Liechtenstein-Venture-Cooperative-lvc',
    tags: ['LVC', 'venture cooperative', 'startup', 'rechtsform', 'IP', 'innovation', 'gründung'],
    kontakt_email: 'business@liechtenstein.li',
    kontakt_tel: '+423 239 63 63',
    antrag_url: 'https://www.liechtenstein-business.li/en/Service-for-entrepreneurs/Founding-a-company/Legal-forms/Liechtenstein-Venture-Cooperative-lvc',
  },
]

data.push(...newEntries)
console.log(`Added ${newEntries.length} new entries (IDs: ${newEntries.map(e => e.id).join(', ')})`)
console.log(`Total entries now: ${data.length}`)

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8')
console.log('✓ foerderungen_data.json updated')
