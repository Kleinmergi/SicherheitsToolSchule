import http from 'node:http';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildWorkflow } from './workflow.js';
import { attendanceListHtml, audit, closeExercise, createActionFromFinding, createFormTemplate, createSnapshot, dashboard, duplicateFormTemplate, fieldTypes, findUserByEmail, importStudentsCsv, normalizeInfoportal, permissions, seedFormTemplates, setUserPassword, startExercise, store, submitForm, updateSchool, updateUserRole, upsertClass, upsertStudent, verifyPassword } from './data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const web = path.resolve(__dirname, '../../web/public');
const port = process.env.PORT || 3000;
const sessions = new Map();

function parseCookies(req) {
  return Object.fromEntries(String(req.headers.cookie || '').split(';').filter(Boolean).map(item => {
    const [key, ...value] = item.trim().split('=');
    return [key, decodeURIComponent(value.join('='))];
  }));
}

function currentSession(req) {
  const sid = parseCookies(req).sts_session;
  const session = sid ? sessions.get(sid) : null;
  if (!session || session.expiresAt < Date.now()) {
    if (sid) sessions.delete(sid);
    return null;
  }
  return session;
}

function publicUser(user) {
  if (!user) return null;
  const { passwordHash, ...safe } = user;
  return safe;
}

function send(res, code, body, contentType = 'application/json; charset=utf-8', extraHeaders = {}) {
  res.writeHead(code, {
    'content-type': contentType,
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'DENY',
    'referrer-policy': 'no-referrer',
    'content-security-policy': "default-src 'self'; style-src 'self' 'unsafe-inline'",
    ...extraHeaders
  });
  if (Buffer.isBuffer(body)) return res.end(body);
  res.end(typeof body === 'string' ? body : JSON.stringify(body));
}

async function body(req) {
  let raw = '';
  for await (const chunk of req) raw += chunk;
  return raw ? JSON.parse(raw) : {};
}

function requirePerm(req, res, perm) {
  const session = currentSession(req);
  const role = session?.role || req.headers['x-role'];
  if (!role || !(permissions[role] || []).includes(perm)) {
    send(res, 403, { error: 'Keine Berechtigung', required: perm });
    return false;
  }
  if (session && !['GET', 'HEAD', 'OPTIONS'].includes(req.method) && req.headers['x-csrf-token'] !== session.csrfToken) {
    send(res, 403, { error: 'CSRF-Prüfung fehlgeschlagen' });
    return false;
  }
  return true;
}

const routes = {
  'GET /api/health': (req, res) => send(res, 200, { status: 'ok', app: 'SicherheitsToolSchule' }),
  'GET /api/auth/me': (req, res) => {
    const session = currentSession(req);
    send(res, 200, { user: publicUser(store.users.find(item => item.id === session?.userId)), csrfToken: session?.csrfToken || null, setupRequired: !store.users.some(item => item.passwordHash) });
  },
  'POST /api/auth/setup': async (req, res) => {
    if (store.users.some(item => item.passwordHash)) return send(res, 409, { error: 'Ersteinrichtung bereits abgeschlossen' });
    const payload = await body(req);
    const user = setUserPassword('u-admin', payload.password);
    send(res, 201, { user });
  },
  'POST /api/auth/login': async (req, res) => {
    const payload = await body(req);
    const user = findUserByEmail(payload.email);
    if (!user || !verifyPassword(payload.password, user.passwordHash)) return send(res, 401, { error: 'Anmeldung fehlgeschlagen' });
    const sid = crypto.randomUUID();
    const csrfToken = crypto.randomUUID();
    sessions.set(sid, { userId: user.id, role: user.role, csrfToken, expiresAt: Date.now() + 8 * 60 * 60 * 1000 });
    audit(user.id, 'auth.login', 'session', { role: user.role });
    send(res, 200, { user: publicUser(user), csrfToken }, 'application/json; charset=utf-8', { 'set-cookie': `sts_session=${encodeURIComponent(sid)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800` });
  },
  'POST /api/auth/logout': (req, res) => {
    const sid = parseCookies(req).sts_session;
    if (sid) sessions.delete(sid);
    send(res, 200, { ok: true }, 'application/json; charset=utf-8', { 'set-cookie': 'sts_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0' });
  },
  'GET /api/workflow': (req, res) => send(res, 200, buildWorkflow(store)),
  'GET /api/bootstrap': (req, res) => send(res, 200, { school: store.school, users: store.users.map(publicUser), roles: Object.keys(permissions), permissions, classes: store.classes, students: store.students.map(({ supportNeed, ...student }) => student), exercises: store.exercises, assemblyPoints: store.assemblyPoints, formTemplates: seedFormTemplates(), formSubmissions: store.formSubmissions, fieldTypes, actions: store.actions }),
  'PUT /api/school': async (req, res) => {
    if (!requirePerm(req, res, 'school:manage')) return;
    send(res, 200, updateSchool(await body(req)));
  },
  'PUT /api/users/role': async (req, res) => {
    if (!requirePerm(req, res, 'roles:manage')) return;
    try {
      const payload = await body(req);
      send(res, 200, updateUserRole(payload.userId, payload.role));
    } catch (error) { send(res, 400, { error: error.message }); }
  },
  'POST /api/classes': async (req, res) => {
    if (!requirePerm(req, res, 'school:manage')) return;
    try { send(res, 201, upsertClass(await body(req))); } catch (error) { send(res, 400, { error: error.message }); }
  },
  'POST /api/students': async (req, res) => {
    if (!requirePerm(req, res, 'school:manage')) return;
    try { send(res, 201, upsertStudent(await body(req))); } catch (error) { send(res, 400, { error: error.message }); }
  },
  'POST /api/import/students.csv': async (req, res) => {
    if (!requirePerm(req, res, 'imports:run')) return;
    try { send(res, 200, importStudentsCsv((await body(req)).csv)); } catch (error) { send(res, 400, { error: error.message }); }
  },
  'POST /api/infoportal/config': async (req, res) => {
    if (!requirePerm(req, res, 'imports:run')) return;
    const payload = await body(req);
    store.school.code = payload.code || store.school.code;
    store.school.infoportalUrl = normalizeInfoportal(payload.login || payload.code);
    audit('admin', 'infoportal.configured', 'school', { url: store.school.infoportalUrl });
    send(res, 200, { providerOrder: ['SchuleInfoportalApiProvider', 'SchuleInfoportalExportProvider', 'CsvImportProvider', 'ExcelImportProvider', 'ManualDataProvider', 'DemoProvider'], url: store.school.infoportalUrl });
  },
  'POST /api/import/demo': (req, res) => {
    if (!requirePerm(req, res, 'imports:run')) return;
    audit('admin', 'demo.imported', 'school', { students: store.students.length });
    send(res, 200, { imported: { teachers: 1, students: store.students.length, classes: store.classes.length, absences: store.absences.length } });
  },
  'POST /api/exercises': async (req, res) => {
    if (!requirePerm(req, res, 'exercises:manage')) return;
    const payload = await body(req);
    const exercise = { id: `ex${store.exercises.length + 1}`, status: 'geplant', ...payload };
    store.exercises.push(exercise);
    store.tasks.push({ id: `t${store.tasks.length + 1}`, title: 'Übungsmappe erzeugen', exerciseId: exercise.id, status: 'neu' });
    store.calendar.push({ id: `cal${store.calendar.length + 1}`, title: exercise.title, date: exercise.date, type: 'Probealarm' });
    audit('safety', 'exercise.created', 'exercise', { id: exercise.id });
    send(res, 201, exercise);
  },
  'POST /api/exercises/start': async (req, res) => {
    if (!requirePerm(req, res, 'exercises:manage')) return;
    try { send(res, 200, startExercise((await body(req)).exerciseId)); } catch (error) { send(res, 400, { error: error.message }); }
  },
  'POST /api/exercises/close': async (req, res) => {
    if (!requirePerm(req, res, 'exercises:manage')) return;
    try { send(res, 200, closeExercise((await body(req)).exerciseId)); } catch (error) { send(res, 400, { error: error.message }); }
  },
  'POST /api/exercises/approve': async (req, res) => {
    if (!requirePerm(req, res, 'exercises:approve')) return;
    const payload = await body(req);
    const exercise = store.exercises.find(item => item.id === payload.exerciseId);
    if (!exercise) return send(res, 404, { error: 'Nicht gefunden' });
    exercise.status = 'freigegeben';
    exercise.approvedBy = payload.userId || 'u-head';
    audit('head', 'exercise.approved', 'exercise', { id: exercise.id });
    send(res, 200, exercise);
  },
  'POST /api/exercises/snapshot': async (req, res) => {
    if (!requirePerm(req, res, 'exercises:manage')) return;
    try { send(res, 201, { items: createSnapshot((await body(req)).exerciseId) }); } catch (error) { send(res, 404, { error: error.message }); }
  },
  'POST /api/attendance': async (req, res) => {
    if (!requirePerm(req, res, 'attendance:report')) return;
    const payload = await body(req);
    const report = { id: payload.clientId || crypto.randomUUID(), submittedAt: new Date().toISOString(), ...payload };
    if (!store.attendanceReports.some(item => item.id === report.id)) store.attendanceReports.push(report);
    audit('teacher', 'attendance.reported', 'attendance', { group: report.group });
    send(res, 201, report);
  },
  'GET /api/dashboard': (req, res) => send(res, 200, dashboard(new URL(req.url, 'http://local').searchParams.get('exerciseId') || 'ex1')),
  'GET /api/exports/attendance.csv': (req, res) => {
    const rows = dashboard(new URL(req.url, 'http://local').searchParams.get('exerciseId') || 'ex1').missing.map(item => `${item.personName};${item.group};${item.assemblyPointId}`);
    send(res, 200, `Name;Gruppe;Sammelplatz\n${rows.join('\n')}`, 'text/csv; charset=utf-8');
  },
  'GET /api/exports/attendance.html': (req, res) => send(res, 200, attendanceListHtml(new URL(req.url, 'http://local').searchParams.get('exerciseId') || 'ex1'), 'text/html; charset=utf-8'),
  'POST /api/forms': async (req, res) => {
    if (!requirePerm(req, res, 'forms:manage')) return;
    try { send(res, 201, createFormTemplate(await body(req))); } catch (error) { send(res, 400, { error: error.message }); }
  },
  'POST /api/forms/duplicate': async (req, res) => {
    if (!requirePerm(req, res, 'forms:manage')) return;
    try { send(res, 201, duplicateFormTemplate((await body(req)).id)); } catch (error) { send(res, 404, { error: error.message }); }
  },
  'POST /api/forms/submit': async (req, res) => {
    try {
      const payload = await body(req);
      send(res, 201, submitForm(payload.templateId, payload.values || {}, req.headers['x-user'] || 'system'));
    } catch (error) { send(res, 400, { error: error.message }); }
  },
  'POST /api/actions': async (req, res) => {
    if (!requirePerm(req, res, 'actions:manage')) return;
    send(res, 201, createActionFromFinding(await body(req)));
  },
  'GET /api/audit': (req, res) => {
    if (!requirePerm(req, res, 'audit:view')) return;
    send(res, 200, { items: store.audit });
  }
};

http.createServer(async (req, res) => {
  const key = `${req.method} ${req.url.split('?')[0]}`;
  if (routes[key]) return routes[key](req, res);
  const staticPath = path.join(web, req.url === '/' ? 'index.html' : req.url);
  if (!staticPath.startsWith(web)) return send(res, 400, { error: 'Ungültiger Pfad' });
  fs.readFile(staticPath, (error, data) => {
    if (error) return send(res, 404, 'Nicht gefunden', 'text/plain; charset=utf-8');
    const contentType = staticPath.endsWith('.js') ? 'text/javascript; charset=utf-8' : staticPath.endsWith('.css') ? 'text/css; charset=utf-8' : staticPath.endsWith('.json') || staticPath.endsWith('.webmanifest') ? 'application/json; charset=utf-8' : staticPath.endsWith('.svg') ? 'image/svg+xml' : 'text/html; charset=utf-8';
    send(res, 200, data, contentType);
  });
}).listen(port, () => console.log(`SicherheitsToolSchule läuft auf http://localhost:${port}`));
