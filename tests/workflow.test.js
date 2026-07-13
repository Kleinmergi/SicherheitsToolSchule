import test from 'node:test';
import assert from 'node:assert/strict';
import { buildWorkflow } from '../apps/api/src/workflow.js';

test('Workflow berechnet nächsten sinnvollen Arbeitsschritt aus Domänenzustand', () => {
  const store = { users: [{ role: 'Administrator' }], classes: [], students: [], exercises: [], snapshots: [], attendanceReports: [] };
  const initial = buildWorkflow(store);
  assert.equal(initial.currentStepId, 'setup');
  store.users[0].passwordHash = 'hash';
  store.classes.push({ id: 'c1' });
  store.students.push({ id: 's1' });
  store.exercises.push({ id: 'ex1', status: 'laufend' });
  store.snapshots.push({ exerciseId: 'ex1' });
  const running = buildWorkflow(store);
  assert.equal(running.currentStepId, 'mobile');
  assert.ok(running.progress > initial.progress);
});
