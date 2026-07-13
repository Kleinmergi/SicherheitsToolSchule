# Architecture Decision Records

| ID | Datum | Entscheidung | Ausgangssituation | Alternativen | Begründung | Konsequenzen | Status |
|---|---|---|---|---|---|---|---|
| ADR-001 | 2026-07-13 | Node.js-Webserver mit REST und statischer PWA für Sprint 1 | Leeres Repository | Voller React/Prisma-Stack sofort | Keine Installationsabhängigkeit, schnell startbar | React/Prisma werden später ergänzt | Akzeptiert |
| ADR-002 | 2026-07-13 | Rollenbasierte Rechte serverseitig prüfen | Sensible Schul-/Personendaten | Nur UI-Ausblendung | Serverseitige Prüfung ist Pflicht | Jede geschützte API prüft Permission | Akzeptiert |
| ADR-003 | 2026-07-13 | Snapshot unveränderlich pro Übung | Anwesenheitsdaten ändern sich | Live-Berechnung | Nachvollziehbarkeit und Auditierbarkeit | Re-Snapshot liefert vorhandene Daten | Akzeptiert |
| ADR-004 | 2026-07-13 | Infoportal nur per dokumentierter Schnittstelle; sonst Import/Manuell/Demo | Keine gesicherte offizielle API im Repo | Endpunkte erfinden, Browserautomation | Datenschutz und Nutzungsbedingungen | Provider-Reihenfolge dokumentiert | Akzeptiert |
| ADR-005 | 2026-07-13 | PWA-Offline-Queue in localStorage für Sprint 1 | WLAN-Ausfall darf Meldung nicht verhindern | Nur Onlinebetrieb | Funktioniert ohne Backend-Verbindung | Geräteschutz und Löschung werden in Sprint 3 gehärtet | Akzeptiert |
| ADR-006 | 2026-07-13 | CSV-Export vor PDF/XLSX | Papierfallback nötig | PDF zuerst | Ohne externe Bibliothek sofort nutzbar | PDF/XLSX in Sprint 2 | Akzeptiert |
| ADR-007 | 2026-07-13 | Docker Compose mit einem App-Service | Schul-PC/Server-Betrieb | Kubernetes | Lokal einfacher betreibbar | PostgreSQL-Service folgt mit Persistenz | Akzeptiert |
| ADR-008 | 2026-07-13 | Keine echten Daten im Repository | Datenschutz | Realistische Echtdaten | DSGVO und Zweckbindung | Nur fiktive Demodaten | Akzeptiert |
