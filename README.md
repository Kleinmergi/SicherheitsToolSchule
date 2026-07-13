# SicherheitsToolSchule

Funktionsfähiger Sprint-1-Vertikalschnitt für ein deutsches Schul-Sicherheitsmanagement-Tool. Die Anwendung startet lokal als Node-Webserver mit REST-API und responsiver PWA-Oberfläche.

## Start

```bash
npm test
npm start
# Browser: http://localhost:3000
```

Optional mit Docker:

```bash
docker compose up --build
```

## Enthaltene Funktionen

- Rollen- und Berechtigungsmatrix für Administrator, Sicherheitsbeauftragte, Schulleitung, Lehrkräfte, Sekretariat und Beobachter.
- Schulstammdaten mit fiktiven Klassen, Schülern, Absenzen, Gebäuden und Sammelplätzen.
- Infoportal-Konfiguration ohne erfundene API-Endpunkte: Schulkennung wird in die Login-URL umgewandelt, Provider-Reihenfolge bevorzugt offizielle API/Exports und fällt auf CSV/Excel/manuell/Demo zurück.
- Übungsplanung mit Aufgaben- und Kalendereintrag.
- Freigabe, Anwesenheits-Snapshot, mobile Anwesenheitsmeldung, Soll-Ist-Dashboard, CSV-Export und Audit-Log.
- PWA mit Service Worker, Manifest, Offline-Warteschlange in `localStorage` und Synchronisationsanzeige.

## Dokumentation

Siehe `docs/` und `docs/project-management/` für Projektmanagement, Architektur, Datenschutz, Importformat, Betrieb und Handbücher.
