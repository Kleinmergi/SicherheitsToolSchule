# GitHub Project Synchronisation

## Aktueller Status

Eine externe Synchronisation wurde geprüft. In dieser Arbeitsumgebung sind weder ein Git-Remote noch die GitHub CLI `gh` verfügbar. Deshalb wurden keine externen GitHub-Daten verändert.

## Lokale Synchronisationsquelle

- `PRODUCT_BACKLOG.md` ist die fachliche Quelle für Epics und User Stories.
- `KANBAN.md` ist das lokale Project Board.
- `scripts/sync-github-project.mjs` erzeugt aus dem Backlog einen reproduzierbaren Sync-Plan für Labels, Milestones, Issues und ein GitHub Project.

## Verwendung bei vorhandenem GitHub-Zugriff

```bash
npm run pm:sync:dry-run
npm run pm:sync -- --owner ORG_ODER_USER --repo REPO --project "SicherheitsToolSchule" --project-number 1 --apply
npm run pm:project:csv
```

Ohne `--apply` werden nur die geplanten Befehle ausgegeben. Mit `--apply` werden ausschließlich offizielle `gh`-Kommandos verwendet; es werden keine Issues geschlossen und keine Releases erzeugt.


## Vorhandenes Kanban nutzen

Das im Repository sichtbare GitHub-Kanban kann genutzt werden, sobald Owner, Repository und Project-Nummer bekannt sind. Ohne diese Angaben und ohne installierte GitHub CLI bleibt die Synchronisation lokal. Für die manuelle Befüllung erzeugt `npm run pm:project:csv` eine CSV-Datei mit Titel, Epic, Story, Priorität, Story Points, Status, Sprint, Akzeptanzkriterien und Labels. Diese CSV kann als Quelle für Issues oder Project Items verwendet werden.

Empfohlene Ansicht im GitHub Project:

- Board nach Feld `Status`: Backlog, Ready, In Progress, Review, Test, Done, Blocked.
- Tabellenansicht nach `Sprint`.
- Filter `label:priority:must` für MVP-/Pflichtumfang.
