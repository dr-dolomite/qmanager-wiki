// Post-build step: turns Next's client-side redirect() pages in `out/` into a
// Cloudflare Pages `_redirects` file so they are real HTTP redirects.
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('out');
const rules = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== '_next') walk(full);
    } else if (entry.name === 'index.html') {
      const match = fs.readFileSync(full, 'utf8').match(/NEXT_REDIRECT;[a-z]+;([^;"\\]+)/);
      if (!match) continue;
      const from = '/' + path.relative(outDir, dir).split(path.sep).join('/') + '/';
      rules.push(`${from} ${match[1]} 302`);
    }
  }
}

walk(outDir);
rules.sort();
fs.writeFileSync(path.join(outDir, '_redirects'), rules.join('\n') + '\n');
console.log(`Wrote ${rules.length} redirects to out/_redirects`);
