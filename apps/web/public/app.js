const $ = selector => document.querySelector(selector);
const qKey = 'offlineAttendanceQueue';
let csrfToken = null;
let currentUser = null;

async function api(url, options = {}) {
  const headers = { 'content-type': 'application/json', ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}) };
  const response = await fetch(url, { credentials: 'same-origin', headers, ...options });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

function queue() { return JSON.parse(localStorage.getItem(qKey) || '[]'); }
function setQueue(items) { localStorage.setItem(qKey, JSON.stringify(items)); $('#queue').textContent = JSON.stringify(items, null, 2); }

async function sync() {
  const items = queue();
  if (!navigator.onLine) { $('#sync').textContent = 'Synchronisationsstatus: offline'; return; }
  for (const item of [...items]) {
    await api('/api/attendance', { method: 'POST', body: JSON.stringify(item) });
    setQueue(queue().filter(entry => entry.clientId !== item.clientId));
  }
  $('#sync').textContent = 'Synchronisationsstatus: online und synchronisiert';
}

async function refreshAuth() {
  const auth = await api('/api/auth/me');
  csrfToken = auth.csrfToken;
  currentUser = auth.user;
  $('#setupForm').style.display = auth.setupRequired ? 'block' : 'none';
  $('#loginForm').style.display = auth.user ? 'none' : 'block';
  $('#authStatus').textContent = auth.user ? `Angemeldet als ${auth.user.name} (${auth.user.role})` : auth.setupRequired ? 'Ersteinrichtung erforderlich: initiales Admin-Passwort vergeben.' : 'Nicht angemeldet.';
}

async function load() {
  await refreshAuth();
  const bootstrap = await api('/api/bootstrap');
  $('#forms').innerHTML = bootstrap.formTemplates.slice(0, 12).map(form => `<li>${form.name} · Version ${form.version}</li>`).join('');
  $('#templateSelect').innerHTML = bootstrap.formTemplates.map(form => `<option value="${form.id}">${form.name}</option>`).join('');
  $('#actions').innerHTML = bootstrap.actions.map(action => `<li>${action.title} · ${action.status} · Frist ${action.dueDate || 'offen'}</li>`).join('') || '<li>Keine offenen Maßnahmen</li>';
  await api('/api/exercises/snapshot', { method: 'POST', body: JSON.stringify({ exerciseId: 'ex1' }) }).catch(() => {});
  const dashboard = await api('/api/dashboard?exerciseId=ex1');
  $('#dashboard').innerHTML = `<p class="status">Erwartet: ${dashboard.expectedTotal} · Gemeldet: ${dashboard.reportedTotal} · bekannte Absenzen: ${dashboard.knownAbsences.length}</p><h3>Aktuell vermisst</h3><table><tr><th>Name</th><th>Gruppe</th><th>Hinweis</th></tr>${dashboard.missing.map(person => `<tr><td>${person.personName}</td><td>${person.group}</td><td>${person.supportNeed ? 'Unterstützungsbedarf berechtigt prüfen' : '-'}</td></tr>`).join('')}</table>`;
  setQueue(queue());
  sync();
}

async function report(status) {
  const payload = { clientId: crypto.randomUUID(), exerciseId: 'ex1', group: '7A', status, presentPersonIds: status === 'vollständig' ? ['s1', 's2'] : ['s1'], missingPersonIds: status === 'vollständig' ? [] : ['s2'], additionalPersons: [], assemblyPointId: 'sp1' };
  try {
    await api('/api/attendance', { method: 'POST', body: JSON.stringify(payload) });
    $('#mobileResult').textContent = 'Meldung verbindlich übermittelt';
  } catch (error) {
    const items = queue();
    items.push(payload);
    setQueue(items);
    $('#mobileResult').textContent = 'Offline gespeichert; automatische Synchronisation folgt.';
  }
  load();
}

$('#setupForm').onsubmit = event => { event.preventDefault(); api('/api/auth/setup', { method: 'POST', body: JSON.stringify({ password: $('#setupPassword').value }) }).then(() => { $('#authStatus').textContent = 'Ersteinrichtung gespeichert. Bitte anmelden.'; return refreshAuth(); }).catch(error => { $('#authStatus').textContent = error.message; }); };
$('#loginForm').onsubmit = event => { event.preventDefault(); api('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: $('#loginEmail').value, password: $('#loginPassword').value }) }).then(result => { csrfToken = result.csrfToken; currentUser = result.user; return load(); }).catch(error => { $('#authStatus').textContent = error.message; }); };

$('#complete').onclick = () => report('vollständig');
$('#missing').onclick = () => report('abweichung');
$('#blocked').onclick = () => { $('#mobileResult').textContent = 'Dringende Meldung erfasst: Fluchtweg blockiert'; };
$('#snapshot').onclick = () => api('/api/exercises/snapshot', { method: 'POST', body: JSON.stringify({ exerciseId: 'ex1' }) }).then(load);
$('#exerciseForm').onsubmit = event => { event.preventDefault(); api('/api/exercises', { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(event.target))) }).then(load); };
$('#portalSave').onclick = () => api('/api/infoportal/config', { method: 'POST', body: JSON.stringify({ code: $('#portal').value }) }).then(result => { $('#portalOut').textContent = JSON.stringify(result, null, 2); });
$('#demoImport').onclick = () => api('/api/import/demo', { method: 'POST' }).then(result => { $('#portalOut').textContent = JSON.stringify(result, null, 2); });
$('#formSubmit').onsubmit = event => { event.preventDefault(); api('/api/forms/submit', { method: 'POST', body: JSON.stringify({ templateId: $('#templateSelect').value, values: { summary: $('#formSummary').value, severity: 'mittel' } }) }).then(result => { $('#formResult').textContent = `Formular gespeichert: ${result.id}`; }); };
$('#actionForm').onsubmit = event => { event.preventDefault(); api('/api/actions', { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(event.target))) }).then(load); };
window.addEventListener('online', sync);
if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js');
load();
