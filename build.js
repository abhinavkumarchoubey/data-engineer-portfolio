// Build script: stitches <!--#include partials/x.html--> tags in src/*.html
// into static output under /docs, then copies assets as-is.
// Run with: node build.js

const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'src');
const OUT = path.join(__dirname, 'docs');
const PARTIALS_DIR = path.join(SRC, 'partials');

const INCLUDE_RE = /<!--#include\s+([^\s]+)\s*-->/g;

function resolveIncludes(html, seen) {
  return html.replace(INCLUDE_RE, (match, includePath) => {
    const fullPath = path.join(SRC, includePath);
    if (seen.has(fullPath)) {
      throw new Error(`Circular include detected: ${includePath}`);
    }
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Include not found: ${includePath}`);
    }
    const partial = fs.readFileSync(fullPath, 'utf8');
    const nextSeen = new Set(seen);
    nextSeen.add(fullPath);
    return resolveIncludes(partial, nextSeen);
  });
}

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    const dest = path.join(to, entry.name);
    if (entry.isDirectory()) {
      copyDir(src, dest);
    } else {
      fs.copyFileSync(src, dest);
    }
  }
}

function clean(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  fs.mkdirSync(dir, { recursive: true });
}

function build() {
  clean(OUT);

  // Process every top-level .html file in src/ (skip partials directory).
  const htmlFiles = fs.readdirSync(SRC).filter((f) => f.endsWith('.html'));

  for (const file of htmlFiles) {
    const raw = fs.readFileSync(path.join(SRC, file), 'utf8');
    const resolved = resolveIncludes(raw, new Set());
    fs.writeFileSync(path.join(OUT, file), resolved, 'utf8');
    console.log(`built ${file}`);
  }

  // Copy assets untouched.
  const assetsSrc = path.join(SRC, 'assets');
  if (fs.existsSync(assetsSrc)) {
    copyDir(assetsSrc, path.join(OUT, 'assets'));
    console.log('copied assets/');
  }

  // .nojekyll tells GitHub Pages not to run its own Jekyll build over /docs.
  fs.writeFileSync(path.join(OUT, '.nojekyll'), '');

  console.log(`\nDone. Output in ${path.relative(__dirname, OUT)}/`);
}

build();
