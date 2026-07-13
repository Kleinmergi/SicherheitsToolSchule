# Product Backlog

| ID | Epic | User Story | Nutzen | Priorität | Story Points | Abhängigkeiten | Akzeptanzkriterien | Status | Sprint |
|---|---|---|---|---|---:|---|---|---|---|
| US-001 | Fundament | Als Administrator möchte ich die Anwendung lokal starten, damit die Schule unabhängig arbeiten kann. | Betriebsfähigkeit | Must | 5 | keine | `npm start` liefert Weboberfläche und `/api/health`; Dockerfile vorhanden. | Done | 0 |
| US-002 | Rollen & Rechte | Als Administrator möchte ich Rollen mit Rechten nutzen, damit sensible Daten geschützt sind. | Datenschutz | Must | 8 | US-001 | API prüft Rechte; Rollenmatrix dokumentiert; unberechtigte Anfrage erhält 403. | Done | 1 |
| US-003 | Infoportal/Import | Als Sekretariat möchte ich Daten ohne direkte Portalanbindung importieren, damit die Anwendung sofort nutzbar ist. | Datenverfügbarkeit | Must | 8 | US-001 | Schulkennung erzeugt URL; Provider-Reihenfolge ist sichtbar; Demoimport funktioniert. | Done | 1 |
| US-004 | Übungsplanung | Als Sicherheitsbeauftragter möchte ich eine Übung anlegen, damit Aufgaben und Termine entstehen. | Vorbereitung | Must | 8 | US-002 | POST `/api/exercises` erzeugt Übung, Aufgabe und Kalendereintrag. | Done | 1 |
| US-005 | Anwesenheits-Snapshot | Als Sicherheitsbeauftragter möchte ich einen unveränderlichen Sollbestand erzeugen, damit spätere Datenänderungen laufende Übungen nicht verfälschen. | Verlässlichkeit | Must | 13 | US-003, US-004 | Snapshot speichert Quelle, Zeitpunkt, Gruppe, Raum, Sammelplatz und Absenzstatus. | Done | 1 |
| US-006 | Mobile Meldung | Als Lehrkraft möchte ich mobil mit wenigen Eingaben melden, damit am Sammelplatz schnell Klarheit entsteht. | Schnelligkeit | Must | 13 | US-005 | PWA zeigt große Buttons, speichert offline und synchronisiert online. | Done | 1 |
| US-007 | Live-Dashboard | Als Schulleitung möchte ich fehlende Personen sehen, damit ich Entscheidungen treffen kann. | Lagebild | Must | 8 | US-006 | Dashboard zeigt Soll, Ist, Absenzen und vermisste Personen mit Textsymbolen. | Done | 1 |
| US-008 | Formulare | Als Sicherheitsbeauftragter möchte ich versionierte Formulare, damit Protokolle einheitlich sind. | Qualität | Should | 13 | US-001 | Standardvorlagen sind abrufbar; Generator wird in Sprint 2 erweitert. | Ready | 2 |
| US-009 | PDF/Excel | Als Sekretariat möchte ich druckbare Listen und Exporte, damit Papierfallback bereitsteht. | Ausfallsicherheit | Should | 8 | US-005 | CSV vorhanden; PDF/XLSX folgen. | In Progress | 2 |
| US-010 | Maßnahmen | Als Schulleitung möchte ich Mängel in Maßnahmen überführen, damit Risiken nachverfolgt werden. | Verbesserung | Should | 8 | US-008 | Statusmodell und Dashboard für Fristen. | Backlog | 2 |
