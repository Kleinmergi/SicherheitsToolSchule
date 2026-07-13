# Sprint Plan

## Sprint 0
- Sprintziel: Repository analysieren, Architektur festlegen, Projektstruktur und startbare Grundlage schaffen.
- Startdatum: 2026-07-13
- Enddatum: 2026-07-13
- Dauer: 1 Tag
- User Stories: US-001
- Geplante Story Points: 5
- Technische Aufgaben: Node-Server, statische PWA, Docker, Testgrundlage, Dokumentationsstruktur.
- Teststrategie: Node-Test für Healthcheck, statische Prüfung auf unfertige Marker.
- Risiken: Leeres Repository; begrenzte Zeit für Gesamtumfang.
- Ergebnis: Startbare Anwendung mit API und PWA-Grundlage.
- Review: Vertikaler Startpunkt ist lauffähig.
- Retrospektive: Externe Abhängigkeiten vermeiden beschleunigt Sprint 1.
- Verbesserungen: Funktionsumfang in kleine nutzbare Vertikalschnitte schneiden.

## Sprint 1
- Sprintziel: Erste nutzbare Alarmübungsstrecke von Import über Snapshot bis mobiler Meldung und Dashboard.
- Startdatum: 2026-07-13
- Enddatum: 2026-07-13
- Dauer: 1 Tag
- User Stories: US-002, US-003, US-004, US-005, US-006, US-007
- Geplante Story Points: 58
- Technische Aufgaben: Rollenprüfung, DemoProvider, Infoportal-URL-Normalisierung, Übungs-API, Snapshot-Logik, Offline-Queue, CSV-Export, Audit-Log.
- Teststrategie: Unit-, API-, Berechtigungs-, Import-, Snapshot- und Offline-Synchronisationslogiktests.
- Risiken: Kein offizieller Schule-Infoportal-API-Nachweis; daher keine API-Endpunkte erfunden.
- Ergebnis: Funktionaler End-to-End-Vertikalschnitt implementiert.
- Nicht abgeschlossen: PDF/XLSX-Export, echter Formulargenerator, PostgreSQL/Prisma.
- Review: Lehrkraft kann 7A vollständig melden; Dashboard reduziert vermisste Personen.
- Retrospektive: In-Memory-Daten sind ausreichend für Demo, müssen in Sprint 2 persistiert werden.
- Verbesserungen: Persistenz und Exportfunktionen priorisieren.

## Sprint 2 geplant
- Sprintziel: Persistenz, Formulargenerator und druckfertige PDF-Listen ausbauen.
- Startdatum: 2026-07-14
- Enddatum: 2026-07-28
- Dauer: 14 Tage
- User Stories: US-008, US-009, US-010
- Geplante Story Points: 29
