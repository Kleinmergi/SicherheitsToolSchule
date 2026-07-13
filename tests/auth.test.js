import test from 'node:test';
import assert from 'node:assert/strict';
import { findUserByEmail, hashPassword, setUserPassword, store, updateSchool, updateUserRole, verifyPassword } from '../apps/api/src/data.js';

test('Passwörter werden gehasht und verifiziert', () => {
  const encoded = hashPassword('SehrSicheresPasswort2026!');
  assert.match(encoded, /^scrypt:/);
  assert.equal(verifyPassword('SehrSicheresPasswort2026!', encoded), true);
  assert.equal(verifyPassword('falsch', encoded), false);
});

test('Admin-Passwort kann ohne Klartextspeicherung gesetzt werden', () => {
  const result = setUserPassword('u-admin', 'NochSichereresPasswort2026!');
  const user = findUserByEmail('admin@demo.schule');
  assert.equal(result.email, 'admin@demo.schule');
  assert.notEqual(user.passwordHash, 'NochSichereresPasswort2026!');
});

test('Schuldaten und Rollen werden kontrolliert aktualisiert', () => {
  const school = updateSchool({ name: 'Demo-Schule Sprint 1', year: '2026/2027' });
  assert.equal(school.name, 'Demo-Schule Sprint 1');
  const user = updateUserRole('u-teacher', 'Lehrkraft');
  assert.equal(user.role, 'Lehrkraft');
  assert.throws(() => updateUserRole('u-teacher', 'Unbekannt'), /Unbekannte Rolle/);
  assert.ok(store.audit.some(entry => entry.action === 'school.updated'));
});
