# Changelog

## 0.7.1 - 2026-07-13
- Protokoll-Viewer ergänzt: gespeicherte Formular-/Protokolleinreichungen werden im Bereich Protokolle angezeigt.
- Bootstrap liefert gespeicherte Protokolleinreichungen an die PWA.
- README erklärt die Erstanmeldung ohne fest hinterlegtes Passwort.
- Regressionstest für Protokollspeicherung und Viewer ergänzt.

## 0.7.0 - 2026-07-13
- Grundarchitektur um ein eigenes Workflow-Modul erweitert, das den nächsten fachlichen Arbeitsschritt aus dem Domänenzustand berechnet.
- Neuer lesender Endpunkt `/api/workflow` ergänzt.
- PWA-Startseite zeigt jetzt Fortschritt und klickbare Ablauf-Schritte statt nur statischer Anleitung.
- Architekturübersicht mit Zielbild, Laufzeitbausteinen, Ablaufdiagramm und Härtungspfad überarbeitet.
- Workflow-Regressionstest ergänzt.

## 0.6.0 - 2026-07-13
- PWA-Oberfläche neu strukturiert: geführter Einstieg, Hauptnavigation und getrennte Arbeitsbereiche statt gleichzeitiger Anzeige aller Funktionen.
- Start, Lagebild, mobile Meldung, Übung, Stammdaten und Protokolle sind als Reiter erreichbar.
- Regressionstest für die geführte Navigation ergänzt.

## 0.5.4 - 2026-07-13
- Frontend blockiert geschützte Aktionen bis zur Anmeldung und zeigt eine verständliche Meldung statt 403-Fehlerflut.
- Offline-Synchronisation wartet jetzt auf eine aktive Session.
- API-Fehler werden im Frontend lesbar aus JSON-Fehlerantworten extrahiert.
- Regressionstest für geschützte Frontend-Aktionen ohne Anmeldung ergänzt.

## 0.5.3 - 2026-07-13
- Service Worker Cache auf Version v2 gehoben und alte Caches werden beim Aktivieren gelöscht.
- Service Worker übernimmt neue Version sofort mit `skipWaiting()` und `clients.claim()`, damit der Browser nicht weiter eine alte Buffer-JSON-Startseite ausliefert.
- Regressionstest für Service-Worker-Cache-Aktualisierung ergänzt.

## 0.5.2 - 2026-07-13
- Vorhandenes GitHub-Kanban wird in der Dokumentation unterstützt.
- Sync-Skript um `--project-number` für vorhandene GitHub Projects erweitert.
- CSV-Export für manuelle GitHub-Project-Befüllung ergänzt.

## 0.5.1 - 2026-07-13
- Fehler behoben, bei dem statische Dateien im Browser als JSON-serialisierte Buffer angezeigt wurden.
- Regressionstest ergänzt, der die Startseite als echtes HTML prüft.

## 0.5.0 - 2026-07-13
- Klassen- und Schülerverwaltung als geschützte API und PWA-Formulare ergänzt.
- CSV-Schülerimport mit Zeilenfehlerbericht ergänzt.
- Übungsstatusübergänge Start und Abschluss mit Snapshot beziehungsweise Abschlusszusammenfassung ergänzt.
- Tests für Stammdatenpflege, Import und Übungsstart/-abschluss ergänzt.

## 0.4.0 - 2026-07-13
- Ersteinrichtung für initiales Administrator-Passwort ergänzt.
- Login mit HttpOnly-Session-Cookie, CSRF-Token und Logout ergänzt.
- Geschützte Endpunkte für Schuldatenänderung und Rollenänderung ergänzt.
- PWA um Ersteinrichtung und Anmeldung erweitert.
- Tests für Passwort-Hashing, Benutzer-/Schulverwaltung und Rollenänderung ergänzt.

## 0.3.0 - 2026-07-13
- Product Backlog auf 39 kleinschrittige User Stories entlang der 11 gewünschten Epics umgestellt.
- Sprintplan auf Sprint 0 bis Sprint 7 mit MVP-Meilenstein in Sprint 3 ausgerichtet.
- Lokales Kanban, Roadmap und GitHub-Synchronisationsdokumentation aktualisiert.
- Sync-Skript für Labels, Milestones und Issues ergänzt; externe Ausführung bleibt ohne `gh` und Git-Remote deaktiviert.

## 0.2.0 - 2026-07-13
- Sprint 2: Formulargenerator mit Feldtypvalidierung, Pflichtfeldprüfung und Duplizieren.
- Druckoptimierte Anwesenheitsliste als HTML-Ausgabe für Browser-PDF.
- Maßnahmen können aus Befunden erzeugt werden.
- Optionale JSON-Persistenz über `STS_DATA_FILE`.

## 0.1.0 - 2026-07-13
- Sprint 0: Repository-Struktur, Startbefehl, Docker-Grundlage, Dokumentationsstruktur.
- Sprint 1: Rollenrechte, Demoimport, Infoportal-Konfiguration, Übungsplanung, Snapshot, mobile PWA-Meldung, Dashboard, CSV-Export und Audit-Log.
