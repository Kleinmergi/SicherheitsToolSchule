import test from 'node:test';
import assert from 'node:assert/strict';
import { closeExercise, importStudentsCsv, startExercise, store, upsertClass, upsertStudent } from '../apps/api/src/data.js';

test('Klassen und Schüler können angelegt und aktualisiert werden', () => {
  const klass = upsertClass({ id: 'c-test', name: 'Testklasse', assemblyPointId: 'sp1' });
  assert.equal(klass.name, 'Testklasse');
  const student = upsertStudent({ id: 's-test', firstName: 'Tina', lastName: 'Test', classId: 'c-test' });
  assert.equal(student.classId, 'c-test');
  assert.throws(() => upsertStudent({ id: 's-bad', firstName: 'Fehler', lastName: 'Person', classId: 'fehlt' }), /Unbekannte Klasse/);
});

test('CSV-Import meldet Erfolge und Zeilenfehler', () => {
  upsertClass({ id: 'c-import', name: 'Importklasse', assemblyPointId: 'sp1' });
  const result = importStudentsCsv('id,firstName,lastName,classId,supportNeed\ns-import,Iman,Import,c-import,\ns-error,Erika,Fehler,keine,');
  assert.equal(result.imported, 1);
  assert.equal(result.errors.length, 1);
});

test('Übung kann gestartet und kontrolliert abgeschlossen werden', () => {
  const exercise = { id: 'ex-flow', title: 'Ablaufübung', type: 'Probealarm', date: '2026-07-13', status: 'geplant', buildings: ['b1'], assemblyPoints: ['sp1'] };
  store.exercises.push(exercise);
  const started = startExercise('ex-flow');
  assert.equal(started.exercise.status, 'laufend');
  assert.ok(started.snapshotCount > 0);
  const closed = closeExercise('ex-flow');
  assert.equal(closed.exercise.status, 'abgeschlossen');
  assert.ok(closed.exercise.finalSummary);
});
