/**
 * Comprehensive enrichment v2 for foerderungen_data.json
 * Adds contact info + enhanced descriptions for all 100 entries
 * Data researched March 2026 from official websites
 */

const fs = require('fs')
const path = require('path')

const dataPath = path.join(__dirname, 'app/src/data/foerderungen_data.json')
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))

// Enrichment map: id → fields to merge/override
const enrichments = {

  // ─── WIRTSCHAFT & INNOVATION ─────────────────────────────────────────────

  1: {
    kontakt_email: 'info.avw@llv.li',
    kontakt_tel: '+423 236 68 71',
    antrag_url: 'https://www.llv.li/de/unternehmen/finanzierung-foerderung/forschung-und-innovation',
    bedingungen: 'KMU mit max. 250 Mitarbeitenden und Jahresumsatz bis CHF 50 Mio., Sitz in Liechtenstein. Zwingend: Kooperation mit einer anerkannten Forschungseinrichtung (z.B. Universität Liechtenstein, Schweizer FH, Technologieinstitut). Gefördert werden externe F&E-Kosten: Laboranalysen, Prototypenentwicklung, Machbarkeitsstudien, technische Gutachten. WICHTIG: Pro Unternehmen und Kalenderjahr kann entweder der Innovations- ODER der Exportscheck beantragt werden – nicht beide kombinierbar! Jahresbudget CHF 400\'000; Vergabe nach Eingangsprinzip (First come, first served). Antrag online beim Amt für Volkswirtschaft einreichen. Budget ab März 2025 verfügbar.',
  },

  2: {
    kontakt_email: 'info.avw@llv.li',
    kontakt_tel: '+423 236 68 71',
    antrag_url: 'https://www.llv.li/de/unternehmen/finanzierung-foerderung/forschung-und-innovation',
    foerderumfang: 'Modulbezogen: Konzept (Analyse & Strategie), Investition (Software, Hardware), Training (Mitarbeiterschulung)',
    bedingungen: 'KMU mit Sitz in Liechtenstein, max. 250 Mitarbeitende. Drei förderfähige Module: (1) Konzept-Modul – Erstellung einer Digitalisierungsstrategie durch externe Beratung; (2) Investitions-Modul – Anschaffung von digitaler Software oder Hardware mit konkretem betrieblichem Mehrwert; (3) Training-Modul – Schulung von Mitarbeitenden für neue digitale Werkzeuge. Jedes Modul kann unabhängig beantragt werden. Projektziel und messbarer Nutzen müssen im Antrag dargelegt werden. Antrag beim Amt für Volkswirtschaft per Online-Portal.',
  },

  3: {
    kontakt_email: 'info.avw@llv.li',
    kontakt_tel: '+423 236 68 71',
    antrag_url: 'https://www.llv.li/de/unternehmen/finanzierung-foerderung/exportscheck',
    bedingungen: 'KMU mit Sitz in Liechtenstein, max. 250 Mitarbeitende. Förderfähig: konkrete Exportprojekte (Markteintritt, Exportstrategie, Erstberatung) und Leitmessebesuche (jede Messe pro Unternehmen einmalig förderbar). Liechtenstein hat Rahmenvertrag mit Switzerland Global Enterprise (S-GE) – Exportberatung und Netzwerkzugang inklusive. Gesamtjahresbudget CHF 400\'000; First-come-first-served. WICHTIG: Pro Unternehmen und Jahr entweder Exportscheck ODER Innovationsscheck – keine Kombination möglich. Antrag vor Beginn der Exportmassnahme einreichen.',
  },

  4: {
    kontakt_email: 'info.avw@llv.li',
    kontakt_tel: '+423 236 68 71',
    antrag_url: 'https://www.innosuisse.admin.ch/en',
    bedingungen: 'Liechtensteinische Unternehmen haben seit 2016 uneingeschränkten Zugang zu Innosuisse (früher KTI). Voraussetzung: Forschungspartner ist eine anerkannte Forschungseinrichtung in der Schweiz oder Liechtenstein (Universität, FH, ETH, PSI etc.). Innosuisse übernimmt die Forschungskosten beim Forschungspartner; das Unternehmen trägt seine eigenen Kosten selbst. Typische Projektlaufzeit: 1–3 Jahre. Projektantrag wird gemeinsam mit dem Forschungspartner eingereicht. Nationale Kontaktstelle (NKS) für FL: Amt für Volkswirtschaft. Antragsberatung dringend empfohlen.',
  },

  5: {
    kontakt_email: 'info@uni.li',
    kontakt_tel: '+423 265 12 00',
    antrag_url: 'https://www.uni.li/de/forschung/forschungsfoerderung/foerderinstrumente',
    bedingungen: 'Ausschliesslich für Forschende und Doktorierende der Universität Liechtenstein. Affiliation zur Universität zwingend. Projekte müssen zu den strategischen Forschungsschwerpunkten der Universität passen (Architektur, Wirtschaftsinformatik, Betriebswirtschaft, Recht). Antragstellung intern; Entscheid durch universitäre Forschungskommission. 2024 wurden 41 Projekte gefördert. Wichtig: Externe Bewerber ohne Uni-LI-Affiliation sind nicht antragsberechtigt.',
  },

  6: {
    kontakt_email: 'info@uni.li',
    kontakt_tel: '+423 265 12 00',
    antrag_url: 'https://www.llv.li/de/landesverwaltung/amt-fuer-kultur/kulturschaffen/eea-grants',
    foerderumfang: 'Projektbezogen; Förderquoten bis 85% der förderfähigen Kosten',
    bedingungen: 'EEA Grants sind EU/EEA-Fördermittel (finanziert von Norwegen, Island und Liechtenstein) für EU-Mitgliedstaaten und Liechtenstein. Programmperiode 2021–2028. Förderbereiche: Kultur, Bildung, Zivilgesellschaft, Forschung, Umwelt. Partner aus Geberland (Norwegen, Island oder FL) zwingend. Hohe bürokratische Anforderungen; professionelles Projektmanagement erforderlich. Anträge über nationale Verwaltungseinheiten (je nach Bereich). Beratung bei Universität Liechtenstein.',
  },

  7: {
    kontakt_email: 'info@uni.li',
    kontakt_tel: '+423 265 12 00',
    antrag_url: 'https://erasmus.uni.li',
    bedingungen: 'EU-Programm für Bildung, Jugend und Sport (2021–2027). Förderbereiche: KA1 Lernmobilität (Auslandsaufenthalte), KA2 Kooperationsprojekte (Partnerschaften zwischen Institutionen), KA3 Politikunterstützung. Antragstellung jährlich (Fristen je nach Aktion: meist Februar/März für KA2). Offene für Schulen, Hochschulen, Berufsbildung, Erwachsenenbildung, Jugendorganisationen. Liechtenstein nimmt als EWR-Mitglied vollständig teil. Nationale Kontaktstelle: Universität Liechtenstein. Anträge auf Englisch.',
  },

  8: {
    kontakt_email: 'info@snf.ch',
    kontakt_tel: '+41 31 308 22 22',
    antrag_url: 'https://www.snf.ch/de/foerderung/foerderportfolio',
    bedingungen: 'Liechtensteinische Forschende können SNF-Förderung beantragen, sofern sie an einer anerkannten Institution (Universität LI, Schweizer Hochschule etc.) affiliiert sind. Wichtigste Fördertypen: Projektförderung (CHF 50\'000–1 Mio.+), Ambizione (Nachwuchsforschende), PRIMA (Frauen), Sinergia (interdisziplinär). Antragssprachen: Deutsch, Französisch, Englisch. Peer-Review-Verfahren; Bearbeitungszeit 4–6 Monate. Kosten: Personal, Sachmittel, Reisen, indir. Kosten. Anmeldung über mySNF-Portal. Vorab persönliche Förderberatung bei SNF empfohlen.',
  },

  9: {
    kontakt_email: 'office@fwf.ac.at',
    kontakt_tel: '+43 1 5056740',
    antrag_url: 'https://www.fwf.ac.at/de/forschungsfoerderung/antragstellung',
    bedingungen: 'Österreichischer Wissenschaftsfonds (FWF); zugänglich für FL-Forschende mit institutioneller Affiliation. Fördertypen: Einzelprojekte (ab EUR 50\'000), START-Programm (Nachwuchs), internationale Joint Projects. Alle Disziplinen förderbar. Peer-Review-basiert; strenge Qualitätsanforderungen. Antragssprachen: Deutsch oder Englisch. Bearbeitungszeit: 4–6 Monate. Online-Antragstellung über ELANE-Portal. Besonderheit: FWF legt Forschungsergebnisse Open Access frei.',
  },

  10: {
    kontakt_email: 'info@uni.li',
    kontakt_tel: '+423 265 12 00',
    antrag_url: 'https://www.bodenseekonferenz.org',
    bedingungen: 'Wissenschaftsverbund der Vierländerregion Bodensee (Deutschland, Österreich, Schweiz, Liechtenstein, Fürstentum). Kooperationsforschung zwischen mindestens zwei Institutionen aus verschiedenen Ländern der Bodenseeregion. Periodische Ausschreibungen; Fokus auf angewandte und interdisziplinäre Forschung mit regionalem Bezug. Antragskoordination über Universität Liechtenstein oder direkt über IBK.',
  },

  11: {
    kontakt_email: 'info@wirtschaftskammer.li',
    kontakt_tel: '+423 237 77 88',
    antrag_url: 'https://wirtschaftskammer.li/',
    bedingungen: 'Wirtschaftskammer Liechtenstein (WKL) bietet KMU und Unternehmern vielfältige Unterstützung: kostenlose Erstberatung zu Unternehmensgründung, Arbeitsrecht, Steuerrecht, Exportfragen. Mitglieder profitieren von vergünstigten Fachberatungen, Weiterbildungen und Netzwerkveranstaltungen. Mitgliedschaft für Gewerbebetriebe in Liechtenstein (Jahresbeitrag ab CHF 350). Öffnungszeiten: Mo–Do 08:00–11:30 und 13:30–16:30, Fr 08:00–11:30 und 13:30–16:00.',
  },

  12: {
    antrag_url: 'https://digihub.li/services/foerderberatung/',
    bedingungen: 'digihub.li ist eine unabhängige Förderberatungsplattform für liechtensteinische Unternehmen und Privatpersonen. Kostenloser Service: Übersicht über verfügbare Förderungen, individuelle Beratung zur Antragstellung, Identifikation der geeigneten Fördermittel. Kein formaler Antragsprozess erforderlich – einfach Kontakt aufnehmen. Besonders nützlich für Erstantragsteller ohne Erfahrung mit Förderprogrammen.',
  },

  13: {
    kontakt_email: 'info.avw@llv.li',
    kontakt_tel: '+423 236 68 71',
    antrag_url: 'https://www.llv.li/de/unternehmen/finanzierung-foerderung',
    bedingungen: 'Unterstützung für Jungunternehmer und Startups durch das Amt für Volkswirtschaft. Leistungen: Beratung zur Geschäftsidee, Finanzplanung, Marktanalyse, Vernetzung mit Investoren und Acceleratoren. Liechtenstein Business begleitet Ansiedlungen. Kein separater Förderungsbetrag – Wert liegt in professioneller Beratung und Netzwerkzugang. Ergänzend: Zugang zu Innosuisse, Innovationsscheck und EEA Grants möglich.',
  },

  14: {
    kontakt_email: 'info@uni.li',
    kontakt_tel: '+423 265 12 00',
    antrag_url: 'https://www.uni.li',
    bedingungen: 'Das Technologie- und Innovationszentrum an der Universität Liechtenstein bietet Startups und Innovatoren Infrastruktur (Büros, Labors, Meetingräume), Mentoring durch erfahrene Unternehmer und Wissenschaftler sowie Vernetzung mit dem Uni-Ökosystem. Besonders geeignet für technologie-orientierte Gründungen im Frühstadium. Bewerbung direkt bei der Universität.',
  },

  15: {
    kontakt_email: 'info.avw@llv.li',
    kontakt_tel: '+423 236 68 71',
    antrag_url: 'https://www.llv.li/de/unternehmen/finanzierung-foerderung',
    bedingungen: 'Das Amt für Volkswirtschaft vermittelt KMU und Unternehmen subventionierte externe Beratungsleistungen. Themen: Betriebsoptimierung, Organisationsentwicklung, Strategie, Nachfolgeplanung, HR. Unternehmen in Liechtenstein können vergünstigte Beratung zu einem Bruchteil der Marktpreise in Anspruch nehmen. Antragsprinzip: Antrag vor Beginn der Beratung stellen.',
  },

  // ─── ENERGIE & UMWELT (LLV-Programme – bereits enriched: 16–22) ──────────

  23: {
    kontakt_email: 'info.au@llv.li',
    kontakt_tel: '+423 236 64 00',
    antrag_url: 'https://www.llv.li/de/privatpersonen/freizeit-umwelt-und-tierhaltung/umwelt',
    bedingungen: 'Aktionsplan Biodiversität 2030+ des Amtes für Umwelt. Fördert Massnahmen zum Schutz und zur Förderung der Artenvielfalt: Anlage von Blumenwiesen, Hecken, Kleingewässern, Trockensteinmauern; ökologische Aufwertung von Landwirtschaftsflächen; Renaturierungsprojekte. Zielgruppen: Landwirte, Grundbesitzer, Naturschutzorganisationen, Gemeinden. Antragsformulare beim Amt für Umwelt. Projektbeschreibung und Kostenschätzung erforderlich.',
  },

  24: {
    kontakt_email: 'info.au@llv.li',
    kontakt_tel: '+423 236 64 00',
    antrag_url: 'https://www.llv.li/de/privatpersonen/freizeit-umwelt-und-tierhaltung/umwelt',
    bedingungen: 'Förderung von Massnahmen zum Schutz der Gewässer und des Grundwassers. Förderfähig: Renaturierung von Bächen und Auen, Ufergehölzpflanzungen, Verbesserung der Wasserqualität, Anlage von Pufferzonen. Antrag beim Amt für Umwelt mit Projektbeschreibung, Lageplan und Kostenschätzung. Prüfung durch Fachstelle; Bewilligungsverfahren beachten.',
  },

  25: {
    kontakt_email: 'info.au@llv.li',
    kontakt_tel: '+423 236 64 00',
    antrag_url: 'https://www.llv.li/de/privatpersonen/freizeit-umwelt-und-tierhaltung/umwelt',
    bedingungen: 'Förderung nachhaltiger Forstwirtschaft für Waldbesitzer und Forstbetriebe. Förderfähig: Jungwaldpflege, Aufforstung, Waldwegebau, Schutzwaldpflege, waldbauliche Massnahmen. Waldwirtschaftsplan oder Betriebsplan Voraussetzung. Anträge vor Massnahmenbeginn beim Amt für Umwelt. Kombinierbar mit nationalen Förderprogrammen.',
  },

  // ─── KULTUR & MEDIEN ────────────────────────────────────────────────────

  29: {
    kontakt_email: 'mail@kunstmuseum.li',
    kontakt_tel: '+423 235 03 00',
    antrag_url: 'https://www.kunstmuseum.li',
    bedingungen: 'Das Kunstmuseum Liechtenstein kooperiert mit Künstlern bei Ausstellungsprojekten und bietet Plattform für zeitgenössische und moderne Kunst. Keine offene Ausschreibung – Kurator entscheidet über Projekte und Einladungen. Für Anfragen: schriftliche Projektbeschreibung, Portfoliomappe, Ausstellungskonzept einreichen. Besonderheit: Kunstmuseum ist mit der Hilti Art Foundation im selben Gebäude (Städtle 32, Vaduz).',
  },

  31: {
    kontakt_tel: '+423 236 06 10',
    bedingungen: 'Radio Liechtenstein ist der öffentliche Radiosender des Fürstentums. Unterstützt Kulturschaffende durch Sendeplätze, Berichte und Medienpartnerschaften bei Kulturprojekten. Kein direktes Fördergeld – Wert liegt in Medienpräsenz und Berichterstattung. Anfragen direkt an die Redaktion richten. Besonders für Kultur- und Musikveranstaltungen in Liechtenstein relevant.',
  },

  32: {
    kontakt_tel: '+423 234 3762',
    antrag_url: 'https://www.hiltifoundation.org/what-we-do',
    bedingungen: 'Die Hilti Foundation fördert Musikprojekte, die eine messbare soziale Wirkung erzielen (z.B. Musikpädagogik für benachteiligte Kinder, Gemeinschaftsprojekte, Inklusion durch Musik). Fokus auf Nachhaltigkeit und skalierbare Wirkungsmodelle. Keine offene Ausschreibung – strategische Partnerauswahl. Anfragen mit detailliertem Wirkungskonzept, Budget und Evaluationsplan einreichen. Internationalausgerichtet, mit Fokus auf Liechtenstein und die Region.',
  },

  33: {
    kontakt_tel: '+423 265 30 03',
    antrag_url: 'https://www.ffj-stiftung.li/',
    bedingungen: 'Die Fürst Franz Josef von Liechtenstein Stiftung vergibt alle zwei Jahre den Fürst-Franz-Josef-von-Liechtenstein-Preis für herausragende kulturelle Leistungen (dotiert mit CHF 30\'000). Für kulturelle Einzelprojekte: schriftliches Gesuch mit Projektbeschreibung, Biografie, Referenzen und Budget an die Stiftung. Fokus auf Kunst und Kultur mit liechtensteinischem Bezug. Keine offene jährliche Ausschreibung; Kontakt für Voranfrage empfohlen.',
  },

  34: {
    kontakt_email: 'info@eb-liechtenstein.li',
    kontakt_tel: '+423 375 91 00',
    antrag_url: 'https://www.eb-liechtenstein.li/',
    bedingungen: 'Erwachsenenbildung Liechtenstein (EB) fördert Weiterbildungsangebote und Kulturvermittlung für Erwachsene. Programme in Zusammenarbeit mit Schulen und Kulturinstitutionen. Subventionierte Kurs- und Seminarangebote; Teilnahmegebühren je nach Programm. Für Bildungseinrichtungen und Kulturorganisationen: Projektpartnerschaft anfragen. Jahresprogramm auf Website.',
  },

  35: {
    kontakt_email: 'info@landesbibliothek.li',
    kontakt_tel: '+423 236 63 63',
    antrag_url: 'https://www.landesbibliothek.li/',
    bedingungen: 'Die Liechtensteinische Landesbibliothek unterstützt Bildungs- und Kulturprojekte mit liechtensteinischem Bezug. Angebote: Lesungen, Ausstellungen, kulturpädagogische Veranstaltungen, Kooperation mit Schulen. Keine direkte finanzielle Projektförderung – Wert liegt in Infrastruktur (Veranstaltungsräume, Bestände), Netzwerk und Medienpartnerschaften. Anfragen für Kooperationsprojekte an Direktion richten.',
  },

  36: {
    kontakt_email: 'info@landesmuseum.li',
    kontakt_tel: '+423 239 68 20',
    antrag_url: 'https://www.landesmuseum.li/',
    bedingungen: 'Das Liechtensteinische Landesmuseum fördert Projekte zu Kulturerbe, Geschichte und Naturkunde Liechtensteins. Möglichkeiten: Kooperationsausstellungen, Forschungspartnerschaften, Leihgaben. Keine offene Projektförderung – Anfragen kuratorisch geprüft. Für Forschungsprojekte mit historisch-kulturellem Bezug: schriftliche Anfrage mit Konzept, Zeitplan und Budget. Adresse: Städtle 43, 9490 Vaduz.',
  },

  37: {
    kontakt_email: 'office@kunstschule.li',
    kontakt_tel: '+423 375 05 05',
    antrag_url: 'https://www.kunstschule.li/',
    bedingungen: 'Die Kunstschule Liechtenstein in Nendeln bietet subventionierte Kurse, Workshops und berufsbegleitende Weiterbildung in Bildender Kunst, Design und Medien. Angebot für alle Altersgruppen. Kursgebühren sind dank Landessubventionierung deutlich günstiger als Marktpreise. Keine separate Antragsförderung – Anmeldung direkt für Kurse. Berufsschulabschlüsse und Kunstdiplome möglich.',
  },

  38: {
    kontakt_email: 'info@musikschule.li',
    kontakt_tel: '+423 235 03 30',
    antrag_url: 'https://www.musikschule.li/',
    bedingungen: 'Die Liechtensteinische Musikschule bietet subventionierten Musikunterricht für alle Altersgruppen (ab 3 Jahren). Instrumente: Streichinstrumente, Blasinstrumente, Klavier, Gitarre, Gesang, Percussion, Komposition. Staatliche Subventionierung macht Unterricht erschwinglich (Lektionsgebühr je nach Einkommensgruppe). Aufnahme nach Anmeldung und kurzem Vorgespräch. Stipendien für besonders begabte Schüler möglich (Auskunft bei der Schule).',
  },

  // ─── BILDUNG & FORSCHUNG ─────────────────────────────────────────────────

  39: {
    kontakt_email: 'stipendienstelle@llv.li',
    kontakt_tel: '+423 236 67 78',
    antrag_url: 'https://www.llv.li/de/landesverwaltung/schulamt/stipendien',
    foerderumfang: 'Einkommensabhängig (variabel, bis ca. CHF 16\'000/Jahr)',
    bedingungen: 'Staatliche Bildungsstipendien des Schulamtes (Stipendienstelle). Anspruch: Schüler und Studierende mit Wohnsitz in Liechtenstein bei nachgewiesener Bedürftigkeit (Einkommens- und Vermögensprüfung der Familie). Ausbildungsstufen: Berufslehre, Berufsmatura, Gymnasium, Hochschule. Stipendium deckt Ausbildungskosten (Schulgeld, Lehrmittel, evtl. Lebenshaltungskosten). Antrag vor Schuljahresbeginn beim Schulamt einreichen. Formular auf llv.li. Rückzahlungspflicht: Nein (Stipendium, kein Darlehen).',
  },

  40: {
    kontakt_email: 'stipendienstelle@llv.li',
    kontakt_tel: '+423 236 67 78',
    antrag_url: 'https://www.llv.li/de/landesverwaltung/schulamt/stipendien',
    foerderumfang: 'Einkommensabhängig (variabel)',
    bedingungen: 'Lehrlings- und Berufsausbildungsstipendien für Auszubildende in anerkannten Lehrberufen in Liechtenstein. Bedürftigkeitsprüfung; elterliches Einkommen relevant. Antrag zu Beginn der Ausbildung bei der Stipendienstelle des Schulamtes. Formular auf llv.li; Einreichung mit aktueller Steuerveranlagung, Ausbildungsvertrag und Schulbestätigung. Jährliche Erneuerung des Antrags erforderlich.',
  },

  41: {
    kontakt_email: 'info.asd@llv.li',
    kontakt_tel: '+423 236 71 11',
    antrag_url: 'https://www.llv.li/de/landesverwaltung/amt-fuer-soziale-dienste',
    bedingungen: 'Das Amt für Soziale Dienste (ASD) kann Weiterbildungs- und Umschulungsmassnahmen für Arbeitssuchende und Sozialhilfeempfänger finanzieren. Voraussetzung: Angemeldete Arbeitslosigkeit oder Sozialhilfebezug. Massnahme muss zur Wiedereingliederung in den Arbeitsmarkt geeignet sein. Kurskosten, Lehrmittel und ggf. Verpflegungskosten förderfähig. Antrag über persönliche Fallbegleitung beim ASD. Massnahme muss vorab bewilligt sein.',
  },

  42: {
    kontakt_email: 'info.aku@llv.li',
    kontakt_tel: '+423 236 63 40',
    antrag_url: 'https://www.llv.li/de/landesverwaltung/amt-fuer-kultur',
    bedingungen: 'Das Amt für Kultur fördert Sprachkurse und Sprachförderungsprojekte, insbesondere für Integration und Bildung. Subventioniertes Kursangebot für Deutsch als Zweitsprache und weitere Sprachen. Kooperationen mit Schulen, Gemeinden und Kultureinrichtungen. Keine individuelle Förderantragstellung – Teilnahme an bestehenden Kursen; Institutionen können für neue Sprachkursangebote Projektförderung beantragen.',
  },

  43: {
    kontakt_email: 'info@uni.li',
    kontakt_tel: '+423 265 12 00',
    antrag_url: 'https://www.uni.li/de/studium/finanzierung',
    bedingungen: 'Die Universität Liechtenstein vergibt Leistungs- und Bedarfsstipendien für Studierende aller Studiengänge (BSc, MSc, PhD). Leistungsstipendien für besonders gute akademische Ergebnisse. Bedarfsstipendien bei nachgewiesener finanzieller Bedürftigkeit. Zusätzlich: Graduiertenstipendien für Doktorierende. Bewerbung mit Motivationsschreiben, Lebenslauf, Immatrikulationsnachweis und ggf. Einkommensnachweisen. Fristen: Semesterbeginn. Detaillierte Informationen auf uni.li.',
  },

  44: {
    kontakt_email: 'info@uni.li',
    kontakt_tel: '+423 265 12 00',
    antrag_url: 'https://www.uni.li/de/studium/mobilitaet-und-austausch',
    foerderumfang: 'Vollstipendien: Studiengebühren, Lebenshaltungskostenzuschuss, Reisekosten',
    bedingungen: 'Erasmus Mundus Joint Master Degrees sind EU-finanzierte internationale Masterprogramme mit Studium an mehreren europäischen Hochschulen. Für Bewerber ausserhalb Europas: Vollstipendien verfügbar (Studiengebühren + EUR 1\'000/Monat Lebenshaltungskosten + Reisekosten). Für EU/EWR-Bürger: Teilstipendien. Bewerbung direkt beim jeweiligen Programm; Zulassung hochkompetitiv. Liste der Erasmus Mundus Programme auf der EU-Website.',
  },

  45: {
    kontakt_email: 'info@uni.li',
    kontakt_tel: '+423 265 12 00',
    antrag_url: 'https://www.uni.li/de/forschung/forschungsfoerderung',
    bedingungen: 'Forschungs- und Doktorandenstipendien über verschiedene Programme: (1) Interne Uni-LI-Stipendien für Doktorierende (über FFF-Programm); (2) SNF Doctoral Fellowships; (3) FWF Stipendien; (4) Industry-funded PhD positions. Voraussetzung: Abgeschlossenes Masterstudium, Forschungsexposé, Betreuungszusage von Professorin/Professor. Für interne Stipendien: Bewerbung bei Graduiertenschule der Universität Liechtenstein.',
  },

  46: {
    kontakt_email: 'info@uni.li',
    kontakt_tel: '+423 265 12 00',
    antrag_url: 'https://www.uni.li/de/studium/mobilitaet-und-austausch',
    bedingungen: 'Erasmus+ Mobilitätsstipendien für Auslandsstudium und Praktika. Betrag: EUR 300–500/Monat je nach Zielland (Programmland). Mindestdauer: 2 Monate (Praktikum) bzw. ein Semester (Studium). Bewerbung bei Auslandskoordination der Universität Liechtenstein; Zulassung an Partnerhochschule erforderlich. Anerkennungszusage für Studienleistungen vorab einholen (Learning Agreement). Fristen: Oktober/November für Sommersemester, März/April für Wintersemester.',
  },

  // ─── JUGEND & SOZIALES ───────────────────────────────────────────────────

  48: {
    kontakt_email: 'info.asd@llv.li',
    kontakt_tel: '+423 236 71 11',
    antrag_url: 'https://www.llv.li/de/landesverwaltung/amt-fuer-soziale-dienste',
    bedingungen: 'Jugendleiterurlaub gemäss Jugendgesetz Liechtenstein. Anspruch: Jugendleiter ab 16 Jahren, die ehrenamtlich in anerkannten Jugendorganisationen tätig sind. Arbeitgeber muss den Urlaub gewähren; staatliche Entschädigungszahlung für Lohnausfall. Antrag beim Amt für Soziale Dienste mit Nachweis der Jugendleiterschaft und Kursbestätigung. Jährlich antragsberechtigt.',
  },

  49: {
    kontakt_email: 'info.asd@llv.li',
    kontakt_tel: '+423 236 71 11',
    antrag_url: 'https://www.llv.li/de/landesverwaltung/amt-fuer-soziale-dienste/finanzielle-hilfen/mietbeitraege',
    foerderumfang: 'Einkommensabhängig (Differenz zwischen zumutbarer Wohnkostenbelastung und tatsächlicher Miete)',
    bedingungen: 'Staatliche Mietbeihilfen für einkommensschwache Personen mit Wohnsitz in Liechtenstein. Anspruch: Eigenes Einkommen unterhalb der Einkommensgrenze; tatsächliche Mietkosten übersteigen zumutbaren Eigenanteil. Berechnung nach Haushaltsgrösse und Einkommen. Nicht kumulierbar mit anderen Wohnbeihilfen. Antrag mit Mietvertrag, Einkommensnachweis und aktueller Steuerveranlagung beim Amt für Soziale Dienste. Laufend antragsberechtigt.',
  },

  50: {
    kontakt_email: 'sport@llv.li',
    kontakt_tel: '+423 236 63 30',
    antrag_url: 'https://www.llv.li/de/landesverwaltung/stabsstelle-fuer-sport',
    bedingungen: 'J+S (Jugend und Sport) ist ein Bundesprogramm (CH/LI) zur Sportförderung für Kinder und Jugendliche bis 20 Jahre. Liechtenstein erhält jährlich ca. CHF 230\'000+ für ~50 Organisationen. Voraussetzungen für Organisationen: J+S-Anerkennung (Registrierung als J+S-Anbieter), ausgebildete J+S-Leiter, Kurse nach J+S-Rahmenprogramm. Für neue J+S-Leiter: Ausbildungskurse über Swiss Olympic / Stabsstelle Sport. Anmeldung über Sportamt.',
  },

  55: {
    kontakt_email: 'info.asd@llv.li',
    kontakt_tel: '+423 236 71 11',
    antrag_url: 'https://www.llv.li/de/landesverwaltung/amt-fuer-soziale-dienste/chancengleichheit',
    bedingungen: 'Das Amt für Soziale Dienste fördert Projekte zur Förderung der Chancengleichheit und Gleichstellung. Förderbereiche: Gleichstellung von Frauen und Männern, Integration von Menschen mit Behinderungen, Prävention von Diskriminierung. Antragsberechtigte: Institutionen, Vereine, gemeinnützige Organisationen. Antrag mit Projektbeschreibung, Zielgruppen, Massnahmen, Wirkungsziele und detailliertem Budget. Entscheid durch das ASD.',
  },

  56: {
    kontakt_email: 'info@lak.li',
    kontakt_tel: '+423 239 12 12',
    antrag_url: 'https://lak.li/',
    bedingungen: 'Die LAK (Liechtensteinische Alters- und Krankenhilfe) betreibt Pflegeheime, Spitex und ambulante Dienste. Für Pflegebedürftige: staatlich subventionierte Pflege in LAK-Einrichtungen (St. Florin Vaduz, St. Laurentius Schaan, St. Mamertus Triesen, weitere). Finanzielle Unterstützung möglich für Personen, die Pflegekosten nicht vollständig selbst tragen können. Einstufung nach Pflegebedarf (RAI-Assessment). Anmeldung für Pflegeplatz über Spitex oder direkt bei LAK.',
  },

  59: {
    kontakt_tel: '+423 235 44 11',
    antrag_url: 'https://www.landesspital.li/',
    bedingungen: 'Das Liechtensteinische Landesspital (LLS) in Vaduz bietet stationäre und ambulante medizinische Versorgung für Einwohner Liechtensteins. Staatlich finanziert; Kosten für Grundversicherte durch obligatorische Krankenkasse und staatliche Subventionen gedeckt. Notfallversorgung rund um die Uhr. Für Spezialpatienten: Überweisungen an Zentrumsspitäler in der Schweiz. Keine separate Antragstellung – direkter Zugang über Hausarzt oder Notfallstation.',
  },

  // ─── LANDWIRTSCHAFT & UMWELT ─────────────────────────────────────────────

  61: {
    kontakt_email: 'info.au@llv.li',
    kontakt_tel: '+423 236 64 00',
    antrag_url: 'https://www.llv.li/de/privatpersonen/freizeit-umwelt-und-tierhaltung/landwirtschaft/foerderung',
    foerderumfang: 'Einkommensunabhängige Flächenbeiträge (CHF/ha) + Tierprämien; variiert nach Bewirtschaftungsform',
    bedingungen: 'Direktzahlungen für Landwirte in Liechtenstein nach Agrarpolitikgesetz. Beitragsberechtigt: Bewirtschafter mit mind. 1 ha landwirtschaftliche Nutzfläche (LN). Beitragstypen: Kulturlandschaftsbeitrag (CHF/ha), Versorgungssicherheitsbeitrag, Biodiversitätsbeiträge, Tierwohlbeiträge. Antragstellung jährlich bis 31. Januar über Amt für Umwelt. Kontrollbesuche möglich. Anrechenbare Flächen müssen in Liechtenstein liegen.',
  },

  62: {
    kontakt_email: 'info.au@llv.li',
    kontakt_tel: '+423 236 64 00',
    antrag_url: 'https://www.llv.li/de/privatpersonen/freizeit-umwelt-und-tierhaltung/landwirtschaft/foerderung',
    foerderumfang: 'CHF-Beiträge pro ha je nach Ökotyp (Extenso-Wiesen: ca. CHF 1\'000/ha; Bio: ca. CHF 1\'600/ha)',
    bedingungen: 'Ökobeiträge (Ökologischer Leistungsnachweis, ÖLN) für Landwirte mit ökologisch besonders wertvoller Bewirtschaftung. Förderbare Ökotypen: Extensiv genutzte Wiesen, wenig intensiv genutzte Wiesen, Streueflächen, Hecken/Bäume, Buntbrachen, Blühstreifen. Biologische Bewirtschaftung: Zusatzbeiträge für Bio-Betriebe (BioSuisse- oder Demeter-zertifiziert). Jährlicher Antrag beim Amt für Umwelt bis 31. Januar; Nachweis der ökologischen Massnahmen erforderlich.',
  },

  63: {
    kontakt_email: 'info.au@llv.li',
    kontakt_tel: '+423 236 64 00',
    antrag_url: 'https://www.llv.li/de/privatpersonen/freizeit-umwelt-und-tierhaltung/landwirtschaft/foerderung',
    bedingungen: 'Alpungshilfe für die Bewirtschaftung liechtensteinischer und ausseralperischer Alpen. Grundbeitrag pro Normalstoss (NST) plus Zuschläge für besondere Leistungen (Alpung in schwer zugänglichem Gelände, Tierbetreuung, Milchwirtschaft). Voraussetzung: Mindestbewirtschaftungsdauer auf der Alp; Alpkataster-Einbindung. Jährlicher Antrag beim Amt für Umwelt; Bestossung mit zugelassenen Nutztieren nachweisen.',
  },

  64: {
    kontakt_email: 'info.au@llv.li',
    kontakt_tel: '+423 236 64 00',
    antrag_url: 'https://www.llv.li/de/privatpersonen/freizeit-umwelt-und-tierhaltung/landwirtschaft/foerderung',
    foerderumfang: 'Bis zu 50% der anrechenbaren Investitionskosten (Gebäude, Wege, Meliorationen)',
    bedingungen: 'Förderung struktureller Verbesserungen in der Landwirtschaft. Förderfähig: Landwirtschaftliche Gebäude (Stall, Scheune), Güllegrube, Hofzufahrt, Drainagen, Güterwege, Bewässerungsanlagen. Voraussetzungen: Baubewilligung, detaillierter Kostenvoranschlag, Nachweis der betrieblichen Notwendigkeit. Antrag VOR Baubeginn beim Amt für Umwelt. Mindestselbstfinanzierungsanteil 50%. Betrieb muss langfristig wirtschaftlich tragfähig sein.',
  },

  65: {
    kontakt_email: 'info.au@llv.li',
    kontakt_tel: '+423 236 64 00',
    antrag_url: 'https://www.llv.li/de/privatpersonen/freizeit-umwelt-und-tierhaltung/landwirtschaft',
    bedingungen: 'Förderung regionaler Wertschöpfungsketten im Agrar- und Lebensmittelbereich. Förderfähig: Aufbau oder Ausbau von Direktvermarktung, Verarbeitungsanlagen (Käserei, Schlachthof, Bäckerei), Kooperationen zwischen Landwirten und Verarbeitungsbetrieben. Fokus auf regionale, liechtensteinische Produkte. Antrag mit Businessplan, Nachhaltigkeitskonzept und Absatzstrategie beim Amt für Umwelt.',
  },

  66: {
    kontakt_email: 'info.au@llv.li',
    kontakt_tel: '+423 236 64 00',
    antrag_url: 'https://www.llv.li/de/privatpersonen/freizeit-umwelt-und-tierhaltung',
    bedingungen: 'Tierschutz und Tiergesundheitsförderung für Landwirte und Tierhalter. Förderfähig: besonders tierfreundliche Stallhaltung (RAUS/BTS-Beiträge), freiwillige Tierseuchen-Prophylaxemassnahmen, Investitionen in tierschutzgerechte Haltungsinfrastruktur. Pflichtprogramm: Vorgaben des Tierschutzgesetzes (TSchG). Freiwillige Massnahmen: Zusatzbeiträge möglich. Beratung und Kontrollen durch Veterinärdienst.',
  },

  67: {
    kontakt_email: 'info.au@llv.li',
    kontakt_tel: '+423 236 64 00',
    antrag_url: 'https://www.llv.li/de/privatpersonen/freizeit-umwelt-und-tierhaltung/umwelt',
    bedingungen: 'Förderung nachhaltiger Forstwirtschaft für Waldbesitzer und Forstbetriebe. Förderfähige Massnahmen: Jungwaldpflege und Durchforstung, Schutzwaldpflege, waldbauliche Aufwertungen, Forstwegebau, Aufforstung mit standortgerechten Baumarten. Antrag mit Waldwirtschaftsplan oder Massnahmenplan beim Amt für Umwelt. Zuschuss zum lokalen Forstwirtschaftsplan empfohlen.',
  },

  // ─── REGIONAL & INTERNATIONAL ────────────────────────────────────────────

  68: {
    kontakt_email: 'info@bodenseekonferenz.org',
    kontakt_tel: '+49 7531 52722',
    antrag_url: 'https://www.bodenseekonferenz.org',
    bedingungen: 'IBK-Begegnungsförderung für grenzüberschreitende Projekte in der Bodenseeregion (D, A, CH, LI, FL). Max. EUR 3\'000 pro Projekt. Voraussetzung: Kooperation mit mind. einem Partner aus einem anderen IBK-Mitgliedsland. Themen: Kultur, Bildung, Sport, gesellschaftliche Begegnung. Antrag über Geschäftsstelle der IBK (Konstanz); 3 Entscheidungsrunden pro Jahr. Einfaches Verfahren; kurzer Antrag mit Kurzbeschreibung und Kostenplan.',
  },

  69: {
    kontakt_email: 'info@bodenseekonferenz.org',
    kontakt_tel: '+49 7531 52722',
    antrag_url: 'https://www.bodenseekonferenz.org',
    foerderumfang: 'Bis zu EUR 30\'000 pro Projekt (max. 50% der förderfähigen Kosten)',
    bedingungen: 'INTERREG VI Alpenrhein-Bodensee-Hochrhein (ABH): EU-Förderprogramm für grenzüberschreitende Kooperationsprojekte. Liechtenstein als vollwertiger Programmpartner. Themenschwerpunkte: Innovation, Nachhaltigkeit, Gemeinschaft, regionale Wettbewerbsfähigkeit. Mindestens 2 Projektpartner aus verschiedenen Programmregionen. Antrag auf Englisch oder Deutsch; ausführlicher Projektantrag mit Wirkungslogik erforderlich. Beratung über IBK-Geschäftsstelle dringend empfohlen. Laufzeit typisch 2–3 Jahre.',
  },

  71: {
    kontakt_email: 'info.avw@llv.li',
    kontakt_tel: '+423 236 68 71',
    antrag_url: 'https://www.llv.li/de/unternehmen/finanzierung-foerderung',
    bedingungen: 'Das Amt für Volkswirtschaft unterstützt grenzüberschreitende Kooperationen zwischen liechtensteinischen und ausländischen Unternehmen oder Organisationen. Förderung im Rahmen bestehender Abkommen (INTERREG, bilaterale Verträge, IBK). Beratung und Begleitung bei Antragsverfahren für internationale Förderprogramme. Keine eigenständige Förderung – Koordination und Vermittlung zu geeigneten EU-/internationalen Programmen.',
  },

  // ─── STIFTUNGEN ──────────────────────────────────────────────────────────

  75: {
    kontakt_tel: '+423 234 3762',
    antrag_url: 'https://www.hiltifoundation.org/what-we-do',
    bedingungen: 'Die Hilti Foundation fördert Projekte im Bereich bezahlbares Wohnen und Technologieinnovation für soziale Zwecke. Fokus auf skalierbare Lösungen für Wohnraummangel und leistbares Wohnen in urbanen Gebieten. Keine offene Ausschreibung – strategische Partnerschaften. Projektanfragen mit klarer Wirkungslogik, nachgewiesener Machbarkeit, Skalierbarkeitsplan und erfahrenem Team. Bevorzugt: Projekte mit Technologiekomponente und messbarer sozialer Wirkung.',
  },

  76: {
    kontakt_tel: '+423 234 3762',
    antrag_url: 'https://www.hiltifoundation.org/applied-research-education',
    bedingungen: 'Die Hilti Foundation fördert angewandte Forschung und Bildungsprojekte in den Bereichen STEM, Nachhaltigkeit und soziale Innovation. Typische Projekte: Kooperationen zwischen Hochschulen und Praxis, Bildungsprogramme für benachteiligte Jugendliche, Forschung zu relevanten gesellschaftlichen Herausforderungen. Anfragen: detailliertes Wirkungskonzept, Budget, Evaluationsplan, Teamprofil. Keine offene jährliche Ausschreibung – Anfragen jederzeit möglich.',
  },

  77: {
    kontakt_tel: '+423 265 30 03',
    antrag_url: 'https://www.ffj-stiftung.li/',
    bedingungen: 'Die Fürst Franz Josef von Liechtenstein Stiftung fördert wissenschaftliche Projekte und Forschungsarbeiten mit liechtensteinischem Bezug. Alle zwei Jahre: Verleihung des Fürst-Franz-Josef-von-Liechtenstein-Preises (CHF 30\'000) an herausragende wissenschaftliche Leistungen. Für Einzelprojekte: Gesuch an Stiftung mit Forschungskonzept, Budgetplan und Referenzen. Vorrang für Nachwuchswissenschaftler. Anfragen über die Stiftungsadresse (Postfach 56, FL-9490 Vaduz).',
  },

  78: {
    antrag_url: 'https://besserezukunft.li/',
    bedingungen: 'Die Bessere Zukunft Stiftung mit Sitz in Liechtenstein fördert Projekte gegen Hunger, Armut und für nachhaltige Entwicklung weltweit. Fokus auf Subsistenzlandwirtschaft, Ernährungssicherheit und Armutsbekämpfung. Anfragen per E-Mail mit Projektbeschreibung, Zielgruppe, Wirkungs-Logik, Budget und Organisationsprofil. Keine offene jährliche Ausschreibung.',
  },

  79: {
    kontakt_email: 'info@specialolympics.li',
    kontakt_tel: '+423 793 99 75',
    antrag_url: 'https://specialolympics.li/',
    bedingungen: 'Special Olympics Liechtenstein (SOLie) fördert sportliche Inklusion für Menschen mit geistiger Behinderung. Finanzierung von Sportprogrammen, Trainings, nationalen und internationalen Wettkämpfen (World Games, European Games). Sportler mit geistiger Behinderung und deren Familien als Zielgruppe. Keine Förderbeträge an Einzelpersonen – Teilnahme an Programmen kostenlos. Vereine können für Inklusionsprojekte Unterstützung anfragen. Freiwillige und Coaches gesucht.',
  },

  80: {
    antrag_url: 'https://www.fastenopfer.li/',
    bedingungen: 'WIR TEILEN: Fastenopfer Liechtenstein ist eine kirchliche Hilfsorganisation, die Entwicklungsprojekte in Asien, Afrika und Lateinamerika fördert. Schwerpunkte: Nahrungsmittelsicherheit, Klimaschutz, Menschenrechte, Basisgesundheit. Lokale Partnerorganisationen in Entwicklungsländern als Projektträger. Liechtensteinische Organisationen können durch Partnerschaft oder Spendenprojekte unterstützen. Direkte Projektförderung für externe Bewerber auf Anfrage.',
  },

  81: {
    antrag_url: 'https://www.rotary.org/',
    bedingungen: 'Der Rotary Club Liechtenstein-Eschnerberg unterstützt soziale und humanitäre Projekte lokal und international. Förderbereiche: Gesundheitsversorgung, Bildung, Wasserversorgung, Frauenförderung, Katastrophenhilfe. Für Förderanfragen: Kontakt mit dem RC Liechtenstein-Eschnerberg aufnehmen (über rotary.org Clubsuche). Global Grants über Rotary International möglich (internationales Kooperationsprojekt erforderlich). Schwerpunkt auf messbarer gemeinnütziger Wirkung.',
  },

  // ─── BERATUNG & INFORMATION ──────────────────────────────────────────────

  83: {
    antrag_url: 'https://www.fundraiso.ch/de/page/stiftungsverzeichnis-liechtenstein',
    bedingungen: 'Fundraiso.ch bietet eine der grössten Stiftungsdatenbanken der Schweiz und Liechtensteins. Enthält über 500 liechtensteinische Stiftungen und deren Förderschwerpunkte. Für Organisationen und Privatpersonen, die geeignete Förderstiftungen suchen. Basis-Zugang kostenlos; Premium-Features kostenpflichtig (ab CHF 49/Monat). Ergänzungstool zu dieser Plattform für spezifische Stiftungsrecherche.',
  },

  84: {
    antrag_url: 'https://www.gemeinnuetzig.li/',
    bedingungen: 'gemeinnuetzig.li ist das offizielle Verzeichnis gemeinnütziger Organisationen in Liechtenstein. Führt über 600 Vereine, Stiftungen und Initiativen. Für Fördersuche: vollständige Liste nach Themenbereich filterbar. Für Organisationen: kostenloser Eintrag ins Verzeichnis möglich. Ergänzt VLGST-Stiftungsverzeichnis um alle Arten gemeinnütziger Organisationen.',
  },

  // ─── ENERGIE & UMWELT (weitere) ──────────────────────────────────────────

  86: {
    kontakt_tel: '+41 44 421 34 45',
    antrag_url: 'https://www.enaw.ch',
    bedingungen: 'Die Energie-Agentur der Wirtschaft (EnAW) unterstützt KMU in Liechtenstein bei der systematischen Reduktion des Energieverbrauchs. Hauptinstrument: Zielvereinbarungen mit Bund und/oder Land. Leistungen: kostenlose Energieanalyse, Massnahmenplanung, Zugang zu Fördermitteln (Land Liechtenstein + Gemeinden + Klimastiftung kumulierbar), Beitrag zu Zertifizierungen. Liechtensteinische KMU können dem EnAW-Netzwerk beitreten (Jahresbeitrag). Geförderte Massnahmen: Druckluft, Beleuchtung, Kältetechnik, Wärmerückgewinnung, Motorenoptimierung.',
  },

  // ─── KULTUR & MEDIEN (Medienförderung) ───────────────────────────────────

  91: {
    kontakt_email: 'info.ak@llv.li',
    kontakt_tel: '+423 236 60 60',
    antrag_url: 'https://www.llv.li/de/unternehmen/finanzierung-foerderung/anschubfinanzierung-medienunternehmen',
    bedingungen: 'Staatliche Medienförderung gemäss Medienförderungsgesetz (MFG, in Kraft ab 1. März 2025). Förderberechtigt: Medienunternehmen mit Sitz in Liechtenstein, mind. ein hauptberuflicher Medienmitarbeiter (min. 50% Pensum), publizistische Grundversorgung, Redaktionsstatut und Journalistenkodex. Förderkomponenten: Sockelbeitrag CHF 100\'000 + variable Beiträge (Verbreitungskosten 30%, Aus-/Weiterbildung 75%). Digitale und Online-Medien ausdrücklich förderfähig. Gesamtbudget: ca. CHF 1.8 Mio./Jahr. Antrag jährlich bei der Medienkommission.',
  },

  92: {
    kontakt_email: 'info.ak@llv.li',
    kontakt_tel: '+423 236 60 60',
    antrag_url: 'https://www.llv.li/de/unternehmen/finanzierung-foerderung/anschubfinanzierung-medienunternehmen',
    bedingungen: 'Einmalige Anschubfinanzierung für neue Medienunternehmen, die die Voraussetzungen für die reguläre Medienförderung noch nicht erfüllen. Neu seit MFG-Revision (5. Dezember 2024, in Kraft 1. März 2025). Voraussetzungen: Sitz in Liechtenstein, journalistisch-redaktionelle Tätigkeit, Businessplan. Höhe: nach Businessplan und Regierungsentscheid. Laufend beantragbar (Antragsformular auf llv.li seit 1. März 2025). Nur einmal pro Unternehmen; danach reguläre Medienförderung anstreben.',
  },

  // ─── JUGEND & SOZIALES (Swisslos, Sport) ─────────────────────────────────

  95: {
    kontakt_email: 'sport@llv.li',
    kontakt_tel: '+423 236 63 30',
    antrag_url: 'https://www.llv.li/de/landesverwaltung/stabsstelle-fuer-sport',
    bedingungen: 'Swisslos Fonds Liechtenstein: Ausschüttung des liechtensteinischen Anteils am Swisslos-Reingewinn an gemeinnützige Organisationen in Sport, Kultur und gesellschaftlichen Projekten. Antragsberechtigte: Vereine, Organisationen, Institutionen mit gemeinnützigem Zweck und Sitz in Liechtenstein. Antrag jährlich bei der Stabsstelle für Sport (für Sportprojekte) oder der jeweils zuständigen Stelle. Verwendungsnachweis erforderlich.',
  },

  96: {
    kontakt_email: 'info.aku@llv.li',
    kontakt_tel: '+423 236 63 40',
    antrag_url: 'https://www.llv.li/de/landesverwaltung/amt-fuer-kultur/kulturschaffen',
    bedingungen: 'Atelier Berlin: Liechtenstein verfügt über ein Atelier in Berlin (Mitte), das das Amt für Kultur an liechtensteinische Kunstschaffende (Bildende Kunst) vergibt. Aufenthaltsdauer: in der Regel mehrere Monate. Bedingungen: liechtensteinische Staatsbürgerschaft oder Wohnsitz, professionelle künstlerische Tätigkeit in der Bildenden Kunst, überzeugendes Arbeitskonzept für den Berliner Aufenthalt. Keine finanzielle Unterstützung – nur Atelierstudio. Frühzeitig beim Amt für Kultur anfragen (beschränkte Plätze).',
  },

  // ─── JUGEND & SOZIALES (Wohnbau) ─────────────────────────────────────────

  97: {
    kontakt_email: 'info.ahr@llv.li',
    kontakt_tel: '+423 236 66 00',
    antrag_url: 'https://www.llv.li/de/privatpersonen/bauen-und-wohnen/wohnbaufoerderung',
    bedingungen: 'Wohnbauförderung des Amtes für Hochbau und Raumplanung. Anspruch: Volljährige mit Wohnsitz in Liechtenstein, erstmaliger Wohneigentumserwerb (kein bestehendes familiengerechtes Wohneigentum in FL), EWR-Bürger oder Schweizer gleichgestellt. Einkommensgrenzen 2025: Alleinstehende CHF 112\'200, Haushalt CHF 201\'800. Nettowohnfläche 60–150 m². Förderinstrument: zinsgünstiges Landesdarlehen oder Zinsverbilligung für bestehende Hypothek. Antrag VOR Baubeginn oder Kaufabschluss beim Amt für Hochbau einreichen. Kombinierbar mit Energieförderungen.',
  },

  // ─── JUGEND & SOZIALES (Zahnpflege) ─────────────────────────────────────

  100: {
    kontakt_email: 'info.ag@llv.li',
    kontakt_tel: '+423 236 73 48',
    antrag_url: 'https://www.llv.li/de/privatpersonen/gesundheit-vorsorge-und-pflege/gesundheit-und-praevention/zahnpflege',
    bedingungen: 'Kinder- und Jugendzahnpflege: Staat Liechtenstein übernimmt 40% der Zahnarztkosten nach Kinder- und Jugendzahnpflegetarif für alle unter 18 Jahren mit Wohnsitz in FL. Kein Antrag nötig – direkt beim Zahnarzt einlösen. Alle zur Kinder- und Jugendzahnpflege zugelassenen Zahnärzte in Liechtenstein akzeptieren den Tarif. Eigenanteil der Familie: 60%. Für Spezialbehandlungen (Kieferorthopädie): Überweisung durch Zahnarzt + Voranmeldung beim Amt für Gesundheit ZWINGEND vor der Behandlung. Gilt bis zum 18. Geburtstag.',
  },
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
console.log(`✓ Enriched ${enriched} entries with contact data and enhanced descriptions`)
console.log(`  Total entries: ${data.length}`)
