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
npm run pm:sync -- --owner ORG_ODER_USER --repo REPO --project "SicherheitsToolSchule" --apply
```

Ohne `--apply` werden nur die geplanten Befehle ausgegeben. Mit `--apply` werden ausschließlich offizielle `gh`-Kommandos verwendet; es werden keine Issues geschlossen und keine Releases erzeugt.
