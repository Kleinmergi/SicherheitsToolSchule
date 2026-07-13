import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

async function waitFor(url, attempts = 30) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error(`Server nicht erreichbar: ${url}`);
}

test('statische Startseite wird als HTML und nicht als Buffer-JSON ausgeliefert', async () => {
  const port = 3199;
  const child = spawn(process.execPath, ['apps/api/src/server.js'], { env: { ...process.env, PORT: String(port) }, stdio: 'ignore' });
  try {
    const response = await waitFor(`http://127.0.0.1:${port}/`);
    const text = await response.text();
    assert.match(response.headers.get('content-type'), /text\/html/);
    assert.ok(text.startsWith('<!doctype html>'));
    assert.doesNotMatch(text, /"type":"Buffer"/);
  } finally {
    child.kill('SIGTERM');
    await new Promise(resolve => child.once('exit', resolve));
  }
});
