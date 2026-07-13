import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const backlog = fs.readFileSync('docs/project-management/PRODUCT_BACKLOG.md', 'utf8');
const rows = backlog.split('\n').filter(line => /^\| US-\d{3} /.test(line));
const labels = ['epic', 'user-story', 'frontend', 'backend', 'database', 'mobile', 'security', 'privacy', 'integration', 'infoportal', 'calendar', 'documentation', 'testing', 'bug', 'blocked', 'priority:must', 'priority:should', 'priority:could'];
const sprints = [...new Set(rows.map(row => row.split('|')[10]?.trim()).filter(Boolean))].sort();
const args = new Set(process.argv.slice(2));
const apply = args.has('--apply');
const owner = valueAfter('--owner');
const repo = valueAfter('--repo');
const project = valueAfter('--project') || 'SicherheitsToolSchule';

function valueAfter(flag) {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function command(parts) {
  return parts.filter(Boolean).join(' ');
}

function run(parts) {
  const cmd = command(parts);
  console.log(cmd);
  if (!apply) return;
  const result = spawnSync(parts[0], parts.slice(1), { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
}

if (apply && (!owner || !repo)) {
  console.error('Für --apply sind --owner und --repo erforderlich.');
  process.exit(1);
}

if (apply && spawnSync('gh', ['--version']).status !== 0) {
  console.error('GitHub CLI gh ist nicht verfügbar.');
  process.exit(1);
}

console.log(`# Sync-Plan für ${rows.length} User Stories, ${sprints.length} Milestones und Project "${project}"`);
for (const label of labels) run(['gh', 'label', 'create', label, '--repo', owner && repo ? `${owner}/${repo}` : '<owner>/<repo>', '--force']);
for (const sprint of sprints) run(['gh', 'api', `repos/${owner || '<owner>'}/${repo || '<repo>'}/milestones`, '-f', `title=Sprint ${sprint}`, '-f', 'state=open']);
for (const row of rows) {
  const cells = row.split('|').map(cell => cell.trim());
  const [id, epic, story, value, priority, points, dependencies, acceptance, status, sprint] = cells.slice(1, 11);
  const title = `${id}: ${story.replace(/^Als /, 'Als ')}`;
  const body = [`## Epic`, epic, `## Nutzen`, value, `## Story Points`, points, `## Abhängigkeiten`, dependencies, `## Akzeptanzkriterien`, acceptance, `## Lokaler Status`, status].join('\n\n');
  const priorityLabel = `priority:${priority.toLowerCase().split(' ')[0]}`;
  run(['gh', 'issue', 'create', '--repo', owner && repo ? `${owner}/${repo}` : '<owner>/<repo>', '--title', JSON.stringify(title), '--body', JSON.stringify(body), '--label', `user-story,${priorityLabel}`, '--milestone', JSON.stringify(`Sprint ${sprint}`)]);
}
