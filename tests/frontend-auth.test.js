import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('Frontend blockiert geschützte Aktionen ohne Anmeldung statt 403-Spam zu erzeugen', () => {
  const app = fs.readFileSync('apps/web/public/app.js', 'utf8');
  assert.match(app, /function requireLogin/);
  assert.match(app, /setProtectedDisabled\(!auth\.user\)/);
  assert.match(app, /if \(!currentUser\) \{ \$\('#sync'\)/);
  assert.match(app, /if \(!requireLogin\('#mobileResult'\)\) return/);
  assert.match(app, /if \(!requireLogin\('#portalOut'\)\) return/);
});
