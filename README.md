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

- Ersteinrichtung, Anmeldung per HttpOnly-Session-Cookie, CSRF-Token und Rollen-/Berechtigungsmatrix für Administrator, Sicherheitsbeauftragte, Schulleitung, Lehrkräfte, Sekretariat und Beobachter.
- Schulstammdaten mit fiktiven Klassen, Schülern, Absenzen, Gebäuden und Sammelplätzen.
- Infoportal-Konfiguration ohne erfundene API-Endpunkte: Schulkennung wird in die Login-URL umgewandelt, Provider-Reihenfolge bevorzugt offizielle API/Exports und fällt auf CSV/Excel/manuell/Demo zurück.
- Übungsplanung mit Aufgaben- und Kalendereintrag.
- Freigabe, Anwesenheits-Snapshot, mobile Anwesenheitsmeldung, Soll-Ist-Dashboard, CSV-Export und Audit-Log.
- Formulargenerator mit validierten Feldtypen, Pflichtfeldprüfung, Duplizieren und Formular-Einreichungen.
- Maßnahmenverwaltung mit Risiko, Priorität, Frist, Status und Verantwortlichkeit.
- Druckoptimierte Anwesenheitsliste für Browser-PDF als Papierfallback.
- Optionale JSON-Persistenz über `STS_DATA_FILE`.
- PWA mit Service Worker, Manifest, Offline-Warteschlange in `localStorage` und Synchronisationsanzeige.

## Dokumentation

Siehe `docs/` und `docs/project-management/` für Projektmanagement, Architektur, Datenschutz, Importformat, Betrieb und Handbücher.
