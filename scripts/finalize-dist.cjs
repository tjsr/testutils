const fs = require('node:fs');
const path = require('node:path');

// CommonJS .js and .d.ts files need their own package boundary because the
// package root is ESM. Keep both declaration graphs aligned with emitted JS.
fs.writeFileSync('dist/cjs/package.json', JSON.stringify({ type: 'commonjs' }) + '\n');
function rewriteDeclarations(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      rewriteDeclarations(file);
    } else if (entry.name.endsWith('.d.ts')) {
      const source = fs.readFileSync(file, 'utf8');
      fs.writeFileSync(file, source.replace(/(['"])(\.\.?\/[^'"]+)\.ts\1/g, '$1$2.js$1'));
    }
  }
}
rewriteDeclarations('dist');
