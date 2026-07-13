const $ = selector => document.querySelector(selector);
const qKey = 'offlineAttendanceQueue';
let csrfToken = null;
let currentUser = null;

async function api(url, options = {}) {
  const headers = { 'content-type': 'application/json', ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}) };
  const response = await fetch(url, { credentials: 'same-origin', headers, ...options });
  if (!response.ok) {
    const text = await response.text();
    try {
      const parsed = JSON.parse(text);
      throw new Error(parsed.error || text);
    } catch (error) {
      if (error instanceof SyntaxError) throw new Error(text);
      throw error;
    }
  }
  return response.json();
}

function requireLogin(messageTarget = '#authStatus') {
  if (currentUser) return true;
  document.querySelector(messageTarget).textContent = 'Bitte zuerst anmelden oder die Ersteinrichtung abschließen.';
  return false;
}

function setProtectedDisabled(disabled) {
  ['#complete', '#missing', '#snapshot', '#startExercise', '#closeExercise', '#portalSave', '#demoImport', '#studentImport'].forEach(selector => {
    const element = document.querySelector(selector);
    if (element) element.disabled = disabled;
  });
}


function showView(name) {
  document.querySelectorAll('.view').forEach(section => section.classList.toggle('active', section.dataset.view === name));
  document.querySelectorAll('.nav-btn').forEach(button => button.classList.toggle('active', button.dataset.target === name));
}

document.querySelectorAll('.nav-btn').forEach(button => {
  button.addEventListener('click', () => showView(button.dataset.target));
});

function queue() { return JSON.parse(localStorage.getItem(qKey) || '[]'); }
function setQueue(items) { localStorage.setItem(qKey, JSON.stringify(items)); $('#queue').textContent = JSON.stringify(items, null, 2); }

async function sync() {
  if (!currentUser) { $('#sync').textContent = 'Synchronisationsstatus: Anmeldung erforderlich'; return; }
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
  setProtectedDisabled(!auth.user);
}



function renderWorkflow(workflow) {
  $('#workflowProgress').textContent = `Fortschritt: ${workflow.progress}% · Nächster Schritt: ${workflow.currentStepId}`;
  $('#workflowSteps').innerHTML = workflow.steps.map(step => `<li class="${step.done ? 'done' : ''} ${step.id === workflow.currentStepId ? 'current' : ''}"><strong>${step.done ? '✅' : step.id === workflow.currentStepId ? '➡️' : '○'} ${step.label}</strong><br><span>${step.description}</span><br><button class="btn secondary" type="button" data-workflow-view="${step.view}">Öffnen</button></li>`).join('');
  document.querySelectorAll('[data-workflow-view]').forEach(button => button.addEventListener('click', () => showView(button.dataset.workflowView)));
}


function renderProtocols(submissions, templates) {
  if (!submissions?.length) {
    $('#protocolViewer').textContent = 'Noch keine Protokolle gespeichert.';
    return;
  }
  $('#protocolViewer').innerHTML = submissions.map(submission => {
    const template = templates.find(item => item.id === submission.templateId);
    const summary = submission.values?.summary || 'ohne Kurzbeschreibung';
    return `<article class="protocol-card"><h4>${template?.name || submission.templateId}</h4><p>${summary}</p><small>Version ${submission.templateVersion} · ${submission.submittedAt} · ${submission.submittedBy}</small></article>`;
  }).join('');
}

async function load() {
  await refreshAuth();
  const workflow = await api('/api/workflow');
  renderWorkflow(workflow);
  const bootstrap = await api('/api/bootstrap');
  $('#forms').innerHTML = bootstrap.formTemplates.slice(0, 12).map(form => `<li>${form.name} · Version ${form.version}</li>`).join('');
  $('#templateSelect').innerHTML = bootstrap.formTemplates.map(form => `<option value="${form.id}">${form.name}</option>`).join('');
  renderProtocols(bootstrap.formSubmissions, bootstrap.formTemplates);
  $('#actions').innerHTML = bootstrap.actions.map(action => `<li>${action.title} · ${action.status} · Frist ${action.dueDate || 'offen'}</li>`).join('') || '<li>Keine offenen Maßnahmen</li>';
  if (currentUser) await api('/api/exercises/snapshot', { method: 'POST', body: JSON.stringify({ exerciseId: 'ex1' }) }).catch(error => { $('#mobileResult').textContent = error.message; });
  const dashboard = await api('/api/dashboard?exerciseId=ex1');
  $('#dashboard').innerHTML = `<p class="status">Erwartet: ${dashboard.expectedTotal} · Gemeldet: ${dashboard.reportedTotal} · bekannte Absenzen: ${dashboard.knownAbsences.length}</p><h3>Aktuell vermisst</h3><table><tr><th>Name</th><th>Gruppe</th><th>Hinweis</th></tr>${dashboard.missing.map(person => `<tr><td>${person.personName}</td><td>${person.group}</td><td>${person.supportNeed ? 'Unterstützungsbedarf berechtigt prüfen' : '-'}</td></tr>`).join('')}</table>`;
  setQueue(queue());
  sync();
}

async function report(status) {
  if (!requireLogin('#mobileResult')) return;
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
  showView('start');
load();
}

$('#setupForm').onsubmit = event => { event.preventDefault(); api('/api/auth/setup', { method: 'POST', body: JSON.stringify({ password: $('#setupPassword').value }) }).then(() => { $('#authStatus').textContent = 'Ersteinrichtung gespeichert. Bitte anmelden.'; return refreshAuth(); }).catch(error => { $('#authStatus').textContent = error.message; }); };
$('#loginForm').onsubmit = event => { event.preventDefault(); api('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: $('#loginEmail').value, password: $('#loginPassword').value }) }).then(result => { csrfToken = result.csrfToken; currentUser = result.user; return showView('start');
load(); }).catch(error => { $('#authStatus').textContent = error.message; }); };

$('#complete').onclick = () => report('vollständig');
$('#missing').onclick = () => report('abweichung');
$('#blocked').onclick = () => { $('#mobileResult').textContent = 'Dringende Meldung erfasst: Fluchtweg blockiert'; };
$('#snapshot').onclick = () => { if (requireLogin()) api('/api/exercises/snapshot', { method: 'POST', body: JSON.stringify({ exerciseId: 'ex1' }) }).then(load).catch(error => { $('#mobileResult').textContent = error.message; }); };
$('#exerciseForm').onsubmit = event => { event.preventDefault(); if (requireLogin()) api('/api/exercises', { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(event.target))) }).then(load).catch(error => { $('#mobileResult').textContent = error.message; }); };
$('#classForm').onsubmit = event => { event.preventDefault(); if (!requireLogin('#peopleResult')) return; api('/api/classes', { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(event.target))) }).then(result => { $('#peopleResult').textContent = `Klasse gespeichert: ${result.name}`; return showView('start');
load(); }).catch(error => { $('#peopleResult').textContent = error.message; }); };
$('#studentForm').onsubmit = event => { event.preventDefault(); if (!requireLogin('#peopleResult')) return; api('/api/students', { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(event.target))) }).then(result => { $('#peopleResult').textContent = `Person gespeichert: ${result.firstName} ${result.lastName}`; return showView('start');
load(); }).catch(error => { $('#peopleResult').textContent = error.message; }); };
$('#startExercise').onclick = () => { if (!requireLogin('#mobileResult')) return; api('/api/exercises/start', { method: 'POST', body: JSON.stringify({ exerciseId: 'ex1' }) }).then(load).catch(error => { $('#mobileResult').textContent = error.message; }); };
$('#closeExercise').onclick = () => { if (!requireLogin('#mobileResult')) return; api('/api/exercises/close', { method: 'POST', body: JSON.stringify({ exerciseId: 'ex1' }) }).then(load).catch(error => { $('#mobileResult').textContent = error.message; }); };

$('#portalSave').onclick = () => { if (!requireLogin('#portalOut')) return; api('/api/infoportal/config', { method: 'POST', body: JSON.stringify({ code: $('#portal').value }) }).then(result => { $('#portalOut').textContent = JSON.stringify(result, null, 2); }).catch(error => { $('#portalOut').textContent = error.message; }); };
$('#demoImport').onclick = () => { if (!requireLogin('#portalOut')) return; api('/api/import/demo', { method: 'POST' }).then(result => { $('#portalOut').textContent = JSON.stringify(result, null, 2); }).catch(error => { $('#portalOut').textContent = error.message; }); };
$('#studentImport').onclick = () => { if (!requireLogin('#portalOut')) return; api('/api/import/students.csv', { method: 'POST', body: JSON.stringify({ csv: $('#studentCsv').value }) }).then(result => { $('#portalOut').textContent = JSON.stringify(result, null, 2); return showView('start');
load(); }).catch(error => { $('#portalOut').textContent = error.message; }); };
$('#formSubmit').onsubmit = event => { event.preventDefault(); if (!requireLogin('#formResult')) return; api('/api/forms/submit', { method: 'POST', body: JSON.stringify({ templateId: $('#templateSelect').value, values: { summary: $('#formSummary').value, severity: 'mittel' } }) }).then(result => { $('#formResult').textContent = `Formular gespeichert: ${result.id}`; return load(); }).catch(error => { $('#formResult').textContent = error.message; }); };
$('#actionForm').onsubmit = event => { event.preventDefault(); if (!requireLogin()) return; api('/api/actions', { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(event.target))) }).then(load).catch(error => { $('#authStatus').textContent = error.message; }); };
window.addEventListener('online', sync);
if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js');
showView('start');
load();
