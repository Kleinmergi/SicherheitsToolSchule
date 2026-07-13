# Sprint Plan

Die Sprintzuordnung folgt der gewünschten fachlichen Reihenfolge. Bereits vorhandene Funktionen bleiben als erledigte technische Vorgriffe markiert, werden aber in den passenden fachlichen Sprint einsortiert.

## Sprint 0 – Projektvorbereitung
- Zeitraum: 2026-07-13 bis 2026-07-13
- Ziel: Repository analysieren, Architektur festlegen, Entwicklungsumgebung einrichten, lokale GitHub-Project-Synchronisation vorbereiten, Datenmodell entwerfen, CI-Grundlage, Gantt und Roadmap erstellen.
- Stories: Vorbereitende technische Aufgaben ohne eigene User-Story-ID.
- Ergebnis: Projektstruktur, Docker, Tests, Projektmanagement-Dokumente und Sync-Skript sind vorhanden.
- Review: Ohne `gh` und ohne Git-Remote kann kein externes GitHub Project angelegt werden; die Markdown- und Skript-Synchronisation ist vorbereitet.
- Retrospektive: Projektmanagement muss kleinschrittiger sein; Backlog wurde auf 39 Stories normalisiert.

## Sprint 1 – Lauffähiges Grundsystem
- Zeitraum: 2026-07-14 bis 2026-07-28
- Ziel: Ein Administrator kann die Anwendung starten, sich anmelden und eine Schule einrichten.
- Stories: US-001, US-002, US-003, US-004
- Geplante Story Points: 21
- Teststrategie: Starttest, Authentifizierungstests, Rollen-/Berechtigungstests, Stammdaten-API-Tests.
- Risiken: Sichere Passwortspeicherung und Sessionverwaltung benötigen echte Persistenz.
- Status: US-001 bis US-004 erledigt; nächste Härtung ist Argon2id/Produktdatenbank statt Demo-In-Memory-Betrieb.

## Sprint 2 – Personen und Übungen
- Zeitraum: 2026-07-29 bis 2026-08-12
- Ziel: Eine Übung kann mit fiktiven Schuldaten vollständig vorbereitet werden.
- Stories: US-005, US-006, US-007, US-008, US-009, US-010
- Geplante Story Points: 39
- Teststrategie: Importtests, Datenvalidierung, Übungsstatus-Tests, Checklisten-Tests.
- Risiken: Excel-Import erfordert Bibliothek; zunächst CSV stabilisieren.
- Status: US-007 und US-008 erledigt; Start/Abschluss werden verfeinert.

## Sprint 3 – Mobile Anwesenheit
- Zeitraum: 2026-08-13 bis 2026-08-27
- Ziel: Eine Räumungsübung kann mit mehreren mobilen Geräten simuliert werden; MVP-Meilenstein.
- Stories: US-011, US-012, US-013, US-014, US-015
- Geplante Story Points: 26
- Teststrategie: Mobile API-Tests, Offline-Queue-Test, Deduplizierung, Dashboard-Test.
- Risiken: Gleichzeitige Meldungen und lokale personenbezogene Daten.
- Status: US-012, US-013 und US-015 sind als Vertikalschnitt erledigt; US-011 und US-014 werden konkretisiert.

## Sprint 4 – Druck und Protokolle
- Zeitraum: 2026-08-28 bis 2026-09-11
- Ziel: Papierfallback, Übungsmappe und Protokollierung sind nutzbar.
- Stories: US-016, US-017, US-018, US-019, US-020, US-021
- Geplante Story Points: 39
- Teststrategie: Drucklisten-Test, Formularvalidierung, PDF-/HTML-Exporttest, Versionsprüfung.
- Risiken: Vollständige PDF-Zusammenführung erfordert robusten Renderer.
- Status: US-016, US-018 und US-019 erledigt; Übungsmappe und PDF-Archiv folgen.

## Sprint 5 – Dokumente, Kalender und Feedback
- Zeitraum: 2026-09-12 bis 2026-09-26
- Ziel: Informationen, Dokumente, Umfragen und Kalender werden fachlich nutzbar.
- Stories: US-022, US-023, US-024, US-025, US-026, US-027, US-028, US-029, US-030
- Geplante Story Points: 53
- Teststrategie: Dokumentberechtigungen, QR-Link, Umfrageauswertung, ICS-Import/-Export.
- Risiken: Offline-Dokumente dürfen sensible Daten nicht unkontrolliert behalten.

## Sprint 6 – Infoportal-Integration
- Zeitraum: 2026-09-27 bis 2026-10-11
- Ziel: Portaladresse, Provider-Schnittstelle, Verbindungstest und autorisierte Datenübernahme sind umgesetzt; CSV/Excel bleibt Rückfalllösung.
- Stories: US-031, US-032, US-033, US-034, US-035
- Geplante Story Points: 34
- Teststrategie: Provider-Vertragstests, Importtests, Datenschutz-Logprüfung.
- Risiken: Keine offizielle API oder Exportfunktion verfügbar; keine API-Endpunkte erfinden.
- Status: US-031 erledigt; US-035 teilweise über CSV/Demo abgedeckt.

## Sprint 7 – Absicherung und Veröffentlichung
- Zeitraum: 2026-10-12 bis 2026-10-26
- Ziel: Datenschutz, Audit, Löschung, Backup, Offlineverhalten, E2E, Sicherheitsprüfung und Handbücher abschließen.
- Stories: US-036, US-037, US-038, US-039
- Geplante Story Points: 29
- Teststrategie: E2E-Gesamtablauf, Sicherheitsheader, Backup/Restore, Löschlauf, Offline-Synchronisation.
- Risiken: Produktive Härtung benötigt realistische Betriebsumgebung.
- Status: US-036 und US-039 sind als Grundlage erledigt; Löschung und Backup folgen.
