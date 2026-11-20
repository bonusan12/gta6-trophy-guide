// Leonida Trophy Atlas — the program that hands this entry in (Node 22, stdlib only).
//
// The guide itself is a set of plain static files under app/ (index.html, atlas.js,
// roadmap.js, atlas.css, data/trophies.json) plus 3–4 screenshots in screenshots/.
// This program copies both folders into the output directory and writes
// /output/dossier.json with the vendored make.fun library. The scorer re-runs
// buildDossier with its own copy of the library and compares the two byte for
// byte, so vendor/makefun-frontend.ts is kept exactly as the kit shipped it.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's own caps: text_max_bytes shapes the dossier text; the rest refuse
// an entry the scorer would refuse (more than 4 screenshots, one over 256 KiB,
// more than 993 files and directories in app/, or app/ over 48 MiB — all beside
// /output's own 1000-entry cap).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
