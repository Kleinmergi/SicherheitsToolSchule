import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('Service Worker bereinigt alte Caches und übernimmt sofort neue Version', () => {
  const sw = fs.readFileSync('apps/web/public/sw.js', 'utf8');
  assert.match(sw, /sicherheits-tool-v2/);
  assert.match(sw, /skipWaiting/);
  assert.match(sw, /caches\.delete/);
  assert.match(sw, /clients\.claim/);
});
