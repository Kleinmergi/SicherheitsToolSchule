import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export const permissions = {
  Administrator: ['school:manage', 'users:manage', 'roles:manage', 'imports:run', 'exercises:manage', 'exercises:approve', 'attendance:report', 'dashboard:view', 'documents:manage', 'surveys:manage', 'calendar:manage', 'actions:manage', 'audit:view', 'sensitive:view', 'forms:manage'],
  Sicherheitsbeauftragter: ['exercises:manage', 'attendance:report', 'dashboard:view', 'documents:manage', 'surveys:manage', 'calendar:manage', 'actions:manage', 'forms:manage'],
  Schulleitung: ['exercises:approve', 'dashboard:view', 'reports:view', 'actions:manage'],
  Lehrkraft: ['attendance:report', 'mobile:view', 'feedback:create'],
  Sekretariat: ['imports:run', 'attendance:print', 'dashboard:view'],
  Beobachter: ['observations:create', 'mobile:view']
};

const defaultStore = {
  school: { name: 'Demo-Gesamtschule am Park', code: 'meine-schule', infoportalUrl: 'https://schule-infoportal.de/login/meine-schule', year: '2026/2027' },
  users: [
    { id: 'u-admin', name: 'Admin Demo', email: 'admin@demo.schule', role: 'Administrator' },
    { id: 'u-safety', name: 'Sina Sicherheit', email: 'sicherheit@demo.schule', role: 'Sicherheitsbeauftragter' },
    { id: 'u-head', name: 'Heike Leitung', email: 'leitung@demo.schule', role: 'Schulleitung' },
    { id: 'u-teacher', name: 'Lena Lehrkraft', email: 'lehrkraft@demo.schule', role: 'Lehrkraft' }
  ],
  buildings: [{ id: 'b1', name: 'Hauptgebäude' }, { id: 'b2', name: 'Sporthalle' }],
  assemblyPoints: [{ id: 'sp1', name: 'Sammelplatz A - Sportplatz' }, { id: 'sp2', name: 'Sammelplatz B - Parkplatz' }],
  classes: [{ id: 'c7a', name: '7A', teacherId: 'u-teacher', assemblyPointId: 'sp1' }, { id: 'c8b', name: '8B', teacherId: 'u-teacher', assemblyPointId: 'sp2' }],
  students: [{ id: 's1', firstName: 'Mila', lastName: 'Beispiel', classId: 'c7a' }, { id: 's2', firstName: 'Noah', lastName: 'Muster', classId: 'c7a', supportNeed: 'Begleitung Treppe' }, { id: 's3', firstName: 'Emma', lastName: 'Demo', classId: 'c8b' }],
  absences: [{ personId: 's3', reason: 'krank', date: '2026-07-13' }],
  exercises: [{ id: 'ex1', title: 'Probealarm Sprint 1', type: 'Probealarm', date: '2026-07-13', status: 'laufend', buildings: ['b1'], assemblyPoints: ['sp1', 'sp2'], approvedBy: 'u-head', startedAt: '2026-07-13T09:00:00.000Z' }],
  snapshots: [], attendanceReports: [], emergencyReports: [], tasks: [], documents: [], surveys: [], calendar: [], actions: [], audit: [], formTemplates: [], formSubmissions: []
};

export const store = structuredClone(defaultStore);

export function persist(file = process.env.STS_DATA_FILE) {
  if (!file) return false;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(store, null, 2));
  return true;
}

export function load(file = process.env.STS_DATA_FILE) {
  if (!file || !fs.existsSync(file)) return false;
  Object.assign(store, JSON.parse(fs.readFileSync(file, 'utf8')));
  seedFormTemplates();
  return true;
}

export function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt:${salt}:${hash}`;
}

export function verifyPassword(password, encoded) {
  if (!encoded?.startsWith('scrypt:')) return false;
  const [, salt, hash] = encoded.split(':');
  const candidate = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), candidate);
}

export function setUserPassword(userId, password) {
  if (!password || password.length < 12) throw new Error('Passwort muss mindestens 12 Zeichen lang sein');
  const user = store.users.find(item => item.id === userId);
  if (!user) throw new Error('Benutzer nicht gefunden');
  user.passwordHash = hashPassword(password);
  user.passwordChangedAt = new Date().toISOString();
  audit('system', 'user.passwordChanged', 'user', { userId });
  return { id: user.id, email: user.email, role: user.role };
}

export function findUserByEmail(email) {
  return store.users.find(item => item.email.toLowerCase() === String(email || '').toLowerCase());
}

export function updateSchool(input) {
  store.school = { ...store.school, ...input, infoportalUrl: input.infoportalUrl || store.school.infoportalUrl };
  audit('admin', 'school.updated', 'school', { name: store.school.name, year: store.school.year });
  return store.school;
}

export function updateUserRole(userId, role) {
  if (!permissions[role]) throw new Error('Unbekannte Rolle');
  const user = store.users.find(item => item.id === userId);
  if (!user) throw new Error('Benutzer nicht gefunden');
  user.role = role;
  audit('admin', 'user.roleChanged', 'user', { userId, role });
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export function audit(user, action, entity, details = {}) {
  store.audit.push({ id: crypto.randomUUID(), at: new Date().toISOString(), user, action, entity, details });
  persist();
}

export function normalizeInfoportal(input) {
  if (!input) return '';
  if (input.startsWith('https://schule-infoportal.de/login/')) return input;
  const code = input.replace(/^\/+|\/+$/g, '');
  return `https://schule-infoportal.de/login/${encodeURIComponent(code)}`;
}

export const fieldTypes = ['text', 'textarea', 'number', 'date', 'time', 'datetime', 'boolean', 'singleChoice', 'multiChoice', 'rating', 'person', 'group', 'room', 'assemblyPoint', 'table', 'repeatable', 'signature', 'photo', 'attachment', 'calculated'];

export function seedFormTemplates() {
  if (store.formTemplates.length) return store.formTemplates;
  const names = ['Planung eines Probealarms', 'Vorbereitungscheckliste', 'Freigabe durch die Schulleitung', 'Informationsliste beteiligter Personen', 'Alarmierungsprotokoll', 'Beobachtungsprotokoll', 'Räumungsprotokoll', 'Sammelplatzprotokoll', 'Anwesenheitsabgleich', 'Meldung vermisster Personen', 'Meldung zusätzlicher Personen', 'Meldung verletzter Personen', 'Erste-Hilfe-Protokoll', 'Feuerwehrübergabe', 'Nachbesprechung', 'Feedback der Lehrkräfte', 'Feedback der Beobachter', 'Feedback der Schülerinnen und Schüler', 'Mängelprotokoll', 'Maßnahmenplan', 'Abschlussbericht', 'Sicherheitsbegehung', 'Gefährdungsmeldung', 'Beinaheunfall', 'Unfallmeldung', 'technische Störung', 'defekter Fluchtweg', 'defekter Notausgang', 'Kontrolle der Feuerlöscher', 'Kontrolle der Flucht- und Rettungspläne', 'Kontrolle des Erste-Hilfe-Materials', 'tatsächliches Sicherheitsereignis'];
  store.formTemplates = names.map((name, index) => ({
    id: `tpl-${index + 1}`,
    name,
    version: 1,
    archived: false,
    fields: [{ id: 'summary', label: 'Kurzbeschreibung', type: 'textarea', required: true }, { id: 'severity', label: 'Bewertung', type: 'singleChoice', options: ['niedrig', 'mittel', 'hoch'], required: false }]
  }));
  return store.formTemplates;
}

export function createFormTemplate(input) {
  const invalid = (input.fields || []).find(field => !fieldTypes.includes(field.type));
  if (invalid) throw new Error(`Nicht unterstützter Feldtyp: ${invalid.type}`);
  const template = { id: crypto.randomUUID(), name: input.name, version: 1, archived: false, fields: input.fields || [] };
  store.formTemplates.push(template);
  audit('system', 'form.created', 'formTemplate', { id: template.id, name: template.name });
  return template;
}

export function duplicateFormTemplate(id) {
  const source = store.formTemplates.find(template => template.id === id);
  if (!source) throw new Error('Formularvorlage nicht gefunden');
  const copy = { ...structuredClone(source), id: crypto.randomUUID(), name: `${source.name} Kopie`, version: 1 };
  store.formTemplates.push(copy);
  audit('system', 'form.duplicated', 'formTemplate', { source: id, copy: copy.id });
  return copy;
}

export function submitForm(templateId, values, user = 'system') {
  const template = store.formTemplates.find(item => item.id === templateId);
  if (!template) throw new Error('Formularvorlage nicht gefunden');
  for (const field of template.fields.filter(item => item.required)) {
    if (values[field.id] === undefined || values[field.id] === '') throw new Error(`Pflichtfeld fehlt: ${field.label}`);
  }
  const submission = { id: crypto.randomUUID(), templateId, templateVersion: template.version, values, submittedBy: user, submittedAt: new Date().toISOString() };
  store.formSubmissions.push(submission);
  audit(user, 'form.submitted', 'formSubmission', { id: submission.id, templateId });
  return submission;
}

export function createSnapshot(exerciseId) {
  const exercise = store.exercises.find(item => item.id === exerciseId);
  if (!exercise) throw new Error('Übung nicht gefunden');
  if (store.snapshots.some(item => item.exerciseId === exerciseId)) return store.snapshots.filter(item => item.exerciseId === exerciseId);
  const now = new Date().toISOString();
  const rows = store.students.map(student => {
    const klass = store.classes.find(item => item.id === student.classId);
    const absence = store.absences.find(item => item.personId === student.id && item.date === exercise.date);
    return { id: crypto.randomUUID(), exerciseId, timestamp: now, source: 'DemoProvider/CSV-Import', personId: student.id, personName: `${student.firstName} ${student.lastName}`, group: klass?.name, expectedTeacherId: klass?.teacherId, expectedRoom: 'laut Stundenplan', assemblyPointId: klass?.assemblyPointId, absenceStatus: absence?.reason || 'erwartet', lastSync: now, supportNeed: student.supportNeed };
  });
  store.snapshots.push(...rows);
  audit('system', 'snapshot.created', 'exercise', { exerciseId, count: rows.length });
  return rows;
}

export function dashboard(exerciseId) {
  const snap = store.snapshots.filter(item => item.exerciseId === exerciseId);
  const reports = store.attendanceReports.filter(item => item.exerciseId === exerciseId);
  const presentIds = new Set(reports.flatMap(item => item.presentPersonIds || []));
  const missing = snap.filter(item => item.absenceStatus === 'erwartet' && !presentIds.has(item.personId));
  return { expectedTotal: snap.filter(item => item.absenceStatus === 'erwartet').length, reportedTotal: presentIds.size, knownAbsences: snap.filter(item => item.absenceStatus !== 'erwartet'), missing, additional: reports.flatMap(item => item.additionalPersons || []), injured: store.emergencyReports.filter(item => item.type === 'verletzte Person'), completeClasses: reports.filter(item => item.status === 'vollständig').map(item => item.group), openEmergencyReports: store.emergencyReports.filter(item => !item.closedAt), firstReportAt: reports[0]?.submittedAt, lastReportAt: reports.at(-1)?.submittedAt };
}

export function createActionFromFinding(input) {
  const action = { id: crypto.randomUUID(), title: input.title, description: input.description, origin: input.origin || 'Protokoll', risk: input.risk || 'mittel', priority: input.priority || 'hoch', responsibleUserId: input.responsibleUserId || 'u-safety', dueDate: input.dueDate, status: 'neu', comments: [], attachments: [], effectivenessCheck: null, closedAt: null };
  store.actions.push(action);
  audit('system', 'action.created', 'action', { id: action.id, title: action.title });
  return action;
}

export function attendanceListHtml(exerciseId) {
  const rows = store.snapshots.filter(item => item.exerciseId === exerciseId);
  const generated = new Date().toISOString();
  const body = rows.map(row => `<tr><td>${row.personName}</td><td>${row.group || ''}</td><td>${row.expectedRoom || ''}</td><td>${row.assemblyPointId || ''}</td><td>${row.absenceStatus}</td><td>☐</td><td></td></tr>`).join('');
  return `<!doctype html><html lang="de"><meta charset="utf-8"><title>Anwesenheitsliste</title><style>@page{size:A4 landscape}body{font-family:Arial}table{width:100%;border-collapse:collapse}td,th{border:1px solid #333;padding:4px}.confidential{font-weight:bold}</style><body><p class="confidential">Vertraulich - ${store.school.name} - erstellt ${generated}</p><h1>Anwesenheitsliste ${exerciseId}</h1><table><tr><th>Name</th><th>Klasse/Kurs</th><th>Raum</th><th>Sammelplatz</th><th>Soll-Status</th><th>Kontrolle</th><th>Bemerkung</th></tr>${body}</table></body></html>`;
}

load();
seedFormTemplates();
