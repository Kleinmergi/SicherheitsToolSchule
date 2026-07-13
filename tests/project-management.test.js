import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

test('Product Backlog enthält 39 kleinschrittige User Stories', () => {
  const backlog = fs.readFileSync('docs/project-management/PRODUCT_BACKLOG.md', 'utf8');
  const stories = backlog.split('\n').filter(line => /^\| US-\d{3} /.test(line));
  assert.equal(stories.length, 39);
  assert.ok(stories.some(line => line.includes('US-031') && line.includes('Loginadresse')));
  assert.ok(stories.some(line => line.includes('US-039') && line.includes('schlechter Verbindung')));
});

test('GitHub-Sync-Skript erzeugt lokalen Sync-Plan ohne externe Änderung', () => {
  const result = spawnSync('node', ['scripts/sync-github-project.mjs'], { encoding: 'utf8' });
  assert.equal(result.status, 0);
  assert.match(result.stdout, /39 User Stories/);
  assert.match(result.stdout, /gh issue create/);
});
