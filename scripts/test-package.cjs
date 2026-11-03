const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const directory = fs.mkdtempSync(path.join(root, '.package-test-'));
const run = (command, args) => execFileSync(command, args, { cwd: directory, stdio: 'pipe' });
try {
  const npm = process.env.npm_execpath;
  assert.ok(npm, 'Run this check with npm run test:package');
  const packed = JSON.parse(run(process.execPath, [npm, 'pack', root, '--ignore-scripts', '--json']));
  const packageDirectory = path.join(directory, 'node_modules/@tjsr/testutils');
  fs.mkdirSync(packageDirectory, { recursive: true });
  run('tar', ['-xzf', packed[0].filename, '-C', packageDirectory, '--strip-components=1']);
  const manifest = JSON.parse(fs.readFileSync(path.join(packageDirectory, 'package.json'), 'utf8'));
  for (const condition of ['import', 'require']) {
    for (const field of ['types', 'default']) {
      assert.ok(fs.existsSync(path.join(packageDirectory, manifest.exports['.'][condition][field])));
    }
  }
  const fixture = `import { generateSessionIdForTestName, getSetCookieString } from '@tjsr/testutils';
const id: string = generateSessionIdForTestName('package regression');
const cookie: string = getSetCookieString('sid', id, 'secret');
// @ts-expect-error The exported function must retain its string argument type.
generateSessionIdForTestName(123);
export { cookie };
`;
  for (const extension of ['mts', 'cts']) {
    fs.writeFileSync(path.join(directory, `consumer.${extension}`), fixture);
    run(process.execPath, [path.join(root, 'node_modules/typescript/bin/tsc'), '--ignoreConfig', '--noEmit', '--strict', '--module', 'NodeNext', '--moduleResolution', 'NodeNext', '--target', 'ES2022', `consumer.${extension}`]);
  }
  const assertion = `if (typeof utils.generateSessionIdForTestName('package regression') !== 'string') throw new Error('Missing runtime export');`;
  fs.writeFileSync(path.join(directory, 'runtime.mjs'), `import * as utils from '@tjsr/testutils';\n${assertion}\n`);
  fs.writeFileSync(path.join(directory, 'runtime.cjs'), `const utils = require('@tjsr/testutils');\n${assertion}\n`);
  run(process.execPath, ['runtime.mjs']);
  run(process.execPath, ['runtime.cjs']);
  console.log('Packed ESM/CommonJS declarations and runtime exports passed.');
} catch (error) {
  if (error.stdout) process.stderr.write(error.stdout);
  if (error.stderr) process.stderr.write(error.stderr);
  throw error;
} finally {
  fs.rmSync(directory, { recursive: true, force: true });
}
