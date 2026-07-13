import fs from 'node:fs';

const backlog = fs.readFileSync('docs/project-management/PRODUCT_BACKLOG.md', 'utf8');
const rows = backlog.split('\n').filter(line => /^\| US-\d{3} /.test(line));
const header = ['Title', 'Epic', 'User Story', 'Priority', 'Story Points', 'Status', 'Sprint', 'Acceptance Criteria', 'Labels'];
const escape = value => `"${String(value ?? '').replaceAll('"', '""')}"`;
const lines = [header.map(escape).join(',')];
for (const row of rows) {
  const cells = row.split('|').map(cell => cell.trim());
  const [id, epic, story, value, priority, points, dependencies, acceptance, status, sprint] = cells.slice(1, 11);
  const labels = ['user-story', `priority:${priority.toLowerCase().split(' ')[0]}`, epic.toLowerCase().includes('infoportal') ? 'infoportal' : '', epic.toLowerCase().includes('mobile') ? 'mobile' : '', epic.toLowerCase().includes('datenschutz') ? 'privacy' : ''].filter(Boolean).join(';');
  lines.push([`${id}: ${story}`, epic, story, priority, points, status, `Sprint ${sprint}`, acceptance, labels].map(escape).join(','));
}
const target = process.argv[2] || 'docs/project-management/github-project-import.csv';
fs.writeFileSync(target, `${lines.join('\n')}\n`);
console.log(`CSV exportiert: ${target} (${rows.length} Stories)`);
