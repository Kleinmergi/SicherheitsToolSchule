# Risikoregister

| ID | Risiko | Wahrscheinlichkeit | Auswirkung | Priorität | Gegenmaßnahme | Verantwortlichkeit | Status |
|---|---|---|---|---|---|---|---|
| R-001 | Fehlende offizielle Infoportal-Schnittstelle | hoch | mittel | hoch | CSV/Excel, manuell und DemoProvider bereitstellen | Product Owner | aktiv |
| R-002 | Ausfall des Schul-WLANs | mittel | hoch | hoch | PWA-Offline-Queue und Papierlisten | PWA-Experte | aktiv |
| R-003 | Veraltete Anwesenheitsdaten | mittel | hoch | hoch | Synchronisationszeitpunkt im Snapshot speichern | Datenarchitekt | aktiv |
| R-004 | Falscher Sollbestand | mittel | hoch | hoch | Snapshot-Review und Absenzen berücksichtigen | Sicherheitsbeauftragter | aktiv |
| R-005 | Gleichzeitige Rückmeldungen | mittel | mittel | mittel | Client-ID-Deduplizierung | Backend | aktiv |
| R-006 | Verlorene mobile Geräte | mittel | hoch | hoch | Rollenrechte, spätere lokale Datenlöschung | Datenschutz | offen |
| R-007 | Unberechtigter Datenzugriff | niedrig | hoch | hoch | Serverseitige Berechtigungen, CSP, Audit | Security | aktiv |
| R-008 | Datenschutzverletzung | niedrig | sehr hoch | hoch | Datensparsamkeit, keine echten Repo-Daten | Datenschutz | aktiv |
| R-009 | Fehlerhafte Synchronisation | mittel | hoch | hoch | Offline-Tests und Statusanzeige | QA | aktiv |
| R-010 | Ausfall des Servers | niedrig | hoch | mittel | Docker-Start, Backups geplant | DevOps | offen |
| R-011 | Fehlende Papierlisten | mittel | hoch | hoch | CSV-Export heute; PDF Sprint 2 | Sekretariat | aktiv |
