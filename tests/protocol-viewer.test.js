import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { seedFormTemplates, store, submitForm } from '../apps/api/src/data.js';

test('Protokolle können gespeichert und im Frontend-Viewer angezeigt werden', () => {
  const template = seedFormTemplates()[0];
  const submission = submitForm(template.id, { summary: 'Viewer-Test Protokoll', severity: 'mittel' }, 'u-safety');
  assert.ok(store.formSubmissions.some(item => item.id === submission.id));
  const html = fs.readFileSync('apps/web/public/index.html', 'utf8');
  const app = fs.readFileSync('apps/web/public/app.js', 'utf8');
  assert.match(html, /protocolViewer/);
  assert.match(app, /function renderProtocols/);
  assert.match(app, /bootstrap\.formSubmissions/);
});
