import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('PWA bietet geführte Navigation statt alle Bereiche gleichzeitig zu zeigen', () => {
  const html = fs.readFileSync('apps/web/public/index.html', 'utf8');
  const app = fs.readFileSync('apps/web/public/app.js', 'utf8');
  const css = fs.readFileSync('apps/web/public/styles.css', 'utf8');
  assert.match(html, /Geführter Einstieg/);
  assert.match(html, /data-target="dashboard"/);
  assert.match(html, /data-view="masterdata"/);
  assert.match(app, /function showView/);
  assert.match(app, /showView\('start'\)/);
  assert.match(css, /\.view\{display:none\}/);
  assert.match(css, /\.view\.active\{display:block\}/);
});
