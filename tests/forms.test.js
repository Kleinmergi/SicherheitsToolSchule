import test from 'node:test';
import assert from 'node:assert/strict';
import { attendanceListHtml, createActionFromFinding, createFormTemplate, duplicateFormTemplate, seedFormTemplates, store, submitForm } from '../apps/api/src/data.js';

test('Standardformularvorlagen decken geforderte Protokollarten ab', () => {
  const templates = seedFormTemplates();
  assert.ok(templates.length >= 32);
  assert.ok(templates.some(template => template.name === 'Feuerwehrübergabe'));
});

test('Formulargenerator validiert Feldtypen und Pflichtfelder', () => {
  const template = createFormTemplate({ name: 'Testformular', fields: [{ id: 'summary', label: 'Kurzbeschreibung', type: 'textarea', required: true }] });
  assert.throws(() => submitForm(template.id, {}), /Pflichtfeld/);
  const submission = submitForm(template.id, { summary: 'Alles geprüft' }, 'u-safety');
  assert.equal(submission.templateVersion, 1);
});

test('Formularvorlagen können dupliziert werden', () => {
  const source = store.formTemplates[0];
  const copy = duplicateFormTemplate(source.id);
  assert.notEqual(copy.id, source.id);
  assert.match(copy.name, /Kopie/);
});

test('Maßnahmen und druckbare Anwesenheitsliste werden erzeugt', () => {
  const action = createActionFromFinding({ title: 'Tür prüfen', description: 'Notausgang klemmt', dueDate: '2026-07-20' });
  assert.equal(action.status, 'neu');
  const html = attendanceListHtml('ex1');
  assert.match(html, /Vertraulich/);
  assert.match(html, /Anwesenheitsliste/);
});
