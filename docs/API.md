# API-Dokumentation

- `GET /api/health`: Status.
- `GET /api/bootstrap`: Stammdaten, Rollen, Übungen, Formularvorlagen.
- `POST /api/infoportal/config`: Schulkennung/Loginadresse normalisieren.
- `POST /api/import/demo`: fiktive Demodaten aktivieren.
- `POST /api/exercises`: Übung anlegen.
- `POST /api/exercises/approve`: Übung freigeben.
- `POST /api/exercises/snapshot`: Sollbestand fixieren.
- `POST /api/attendance`: mobile Meldung übermitteln, dedupliziert per `clientId`.
- `GET /api/dashboard?exerciseId=ex1`: Live-Auswertung.
- `GET /api/exports/attendance.csv?exerciseId=ex1`: CSV-Anwesenheitsliste.
- `GET /api/audit`: Audit-Log.

## Authentifizierung und Verwaltung

- `GET /api/auth/me`: aktuelle Session, CSRF-Token und Ersteinrichtungsstatus.
- `POST /api/auth/setup`: initiales Administrator-Passwort setzen, nur vor Abschluss der Ersteinrichtung.
- `POST /api/auth/login`: Anmeldung mit HttpOnly-Session-Cookie und CSRF-Token.
- `POST /api/auth/logout`: Session beenden.
- `PUT /api/school`: Schuldaten berechtigt aktualisieren.
- `PUT /api/users/role`: Benutzerrolle berechtigt ändern.
