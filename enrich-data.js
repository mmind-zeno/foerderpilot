/**
 * Enriches foerderungen_data.json with researched contact info
 * Data verified from official websites, March 2026
 */

const fs = require('fs')
const path = require('path')

const dataPath = path.join(__dirname, 'app/src/data/foerderungen_data.json')
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))

// Enrichment map: id → { kontakt_email, kontakt_tel, antrag_url }
const enrichments = {
  // Kulturstiftung Liechtenstein — verified: kulturstiftung.li/stiftung/geschaeftsstelle-2/
  26: { kontakt_email: 'info@kulturstiftung.li', kontakt_tel: '+423 236 60 87', antrag_url: 'https://www.kulturstiftung.li/antragstellung-2/projektbeitrag-2/' },
  27: { kontakt_email: 'info@kulturstiftung.li', kontakt_tel: '+423 236 60 87', antrag_url: 'https://www.kulturstiftung.li/wp-content/uploads/KSL_Antragsformular.pdf' },
  28: { kontakt_email: 'info@kulturstiftung.li', kontakt_tel: '+423 236 60 87', antrag_url: 'https://www.kulturstiftung.li/antragstellung-2/werkjahrstipendium-2/' },
  93: { kontakt_email: 'info@kulturstiftung.li', kontakt_tel: '+423 236 60 87', antrag_url: 'https://www.kulturstiftung.li/antragstellung-2/fortbildung-2/' },
  94: { kontakt_email: 'info@kulturstiftung.li', kontakt_tel: '+423 236 60 87', antrag_url: 'https://www.kulturstiftung.li/antragstellung-2/leistungsvereinbarung-2/' },

  // LIFE Klimastiftung Liechtenstein — verified: klimastiftung.li
  21: { kontakt_email: 'info@klimastiftung.li', kontakt_tel: '+423 230 13 26', antrag_url: 'https://klimastiftung.li/forderantrag/' },
  22: { kontakt_email: 'info@klimastiftung.li', kontakt_tel: '+423 230 13 26', antrag_url: 'https://klimastiftung.li/forderantrag/' },

  // Kinder- und Jugendbeirat (kijub) — verified: kijub.li/kontakt
  47: { kontakt_email: 'info@kijub.li', antrag_url: 'https://kijub.li/antrag-auf-foerderung/' },

  // Energiefachstelle / energiebündel.li — verified: energiebuendel.li
  16: { kontakt_email: 'info.energie@llv.li', kontakt_tel: '+423 236 69 88', antrag_url: 'https://www.energiebuendel.li' },
  17: { kontakt_email: 'info.energie@llv.li', kontakt_tel: '+423 236 69 88', antrag_url: 'https://www.energiebuendel.li' },
  18: { kontakt_email: 'info.energie@llv.li', kontakt_tel: '+423 236 69 88', antrag_url: 'https://www.energiebuendel.li' },
  19: { kontakt_email: 'info.energie@llv.li', kontakt_tel: '+423 236 69 88' },
  20: { kontakt_email: 'info.energie@llv.li', kontakt_tel: '+423 236 69 88' },
  87: { kontakt_email: 'info.energie@llv.li', kontakt_tel: '+423 236 69 88', antrag_url: 'https://www.energiebuendel.li' },
  88: { kontakt_email: 'info.energie@llv.li', kontakt_tel: '+423 236 69 88', antrag_url: 'https://www.energiebuendel.li' },
  89: { kontakt_email: 'info.energie@llv.li', kontakt_tel: '+423 236 69 88', antrag_url: 'https://www.llv.li/de/privatpersonen/bauen-und-wohnen/energie-energiefachstelle/energiefoerderung/gemeindefoerderung' },
  90: { kontakt_tel: '+423 236 01 11' },

  // Sophie von Liechtenstein Stiftung — verified: svl-stiftung.li
  51: { kontakt_email: 'c.jochum@svl-stiftung.li', kontakt_tel: '+423 79 46000' },
  52: { kontakt_email: 'c.jochum@svl-stiftung.li', kontakt_tel: '+423 79 46000' },
  53: { kontakt_email: 'c.jochum@svl-stiftung.li', kontakt_tel: '+423 79 46000' },

  // Netzwerk Familie Liechtenstein — verified: netzwerk-familie.li
  54: { kontakt_email: 'netzwerk-familie@hin.li', kontakt_tel: '+423 263 60 60' },

  // Maiores Stiftung — verified: maiores.li
  57: { kontakt_email: 'office@maiores.li', kontakt_tel: '+423 235 81 29' },
  58: { kontakt_email: 'office@maiores.li', kontakt_tel: '+423 235 81 29' },

  // Familienhilfe Liechtenstein — verified: familienhilfe.li
  60: { kontakt_email: 'info@familienhilfe.li', kontakt_tel: '+423 236 00 66' },

  // Liechtensteinischer Entwicklungsdienst (LED) — verified: led.li
  70: { kontakt_email: 'info@led.li', kontakt_tel: '+423 222 09 70' },

  // Stiftung Guido Feger — verified: guido-feger-stiftung.li
  72: { kontakt_email: 'info@guido-feger-stiftung.li', antrag_url: 'https://www.guido-feger-stiftung.li/de/gesuche' },
  73: { kontakt_email: 'info@guido-feger-stiftung.li', antrag_url: 'https://www.guido-feger-stiftung.li/de/gesuche' },
  74: { kontakt_email: 'info@guido-feger-stiftung.li', antrag_url: 'https://www.guido-feger-stiftung.li/de/gesuche' },

  // Hilti Art Foundation — verified: haf.li
  30: { kontakt_email: 'info@haf.li' },

  // VLGST — verified: vlgst.li
  82: { kontakt_email: 'info@vlgst.li', kontakt_tel: '+423 222 30 10' },

  // Klimastiftung Schweiz — verified: klimastiftung.ch
  85: { kontakt_tel: '+41 43 285 44 80' },

  // Liechtenstein Business — verified: liechtenstein-business.li
  98: { kontakt_email: 'business@liechtenstein.li', kontakt_tel: '+423 239 63 63' },

  // Prämienverbilligung — from official data field: +423 236 72 62
  99: { kontakt_tel: '+423 236 72 62', antrag_url: 'https://www.llv.li/de/online-services/antragsformular-praemienverbilligung-in-der-krankenversicherung-27839' },
}

let enriched = 0
const updated = data.map(entry => {
  const extra = enrichments[entry.id]
  if (extra) {
    enriched++
    return { ...entry, ...extra }
  }
  return entry
})

fs.writeFileSync(dataPath, JSON.stringify(updated, null, 2), 'utf8')
console.log(`✓ Enriched ${enriched} of ${data.length} Förderungen with contact/application data`)
console.log(`  Fields added: kontakt_email, kontakt_tel, antrag_url`)
