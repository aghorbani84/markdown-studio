// Verifies the app's own Markdown pipeline (src/lib/markdown.ts) end to end:
// renders the seeded sample document and asserts the headline features.
// Run: npm run verify:render
// Uses tsc to transpile the TypeScript lib, and jsdom to provide the window
// DOMPurify needs outside a browser.
import { execSync } from 'node:child_process';
import { JSDOM } from 'jsdom';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const TMP = new URL('./.tmp-render/', import.meta.url).pathname;
mkdirSync(TMP, { recursive: true });

try {
  execSync(
    `npx tsc src/lib/markdown.ts src/lib/stats.ts src/lib/sample.ts --ignoreConfig --target es2022 --module es2022 --moduleResolution bundler --skipLibCheck --outDir ${TMP}`,
    { stdio: 'inherit' },
  );

  // Node ESM needs explicit extensions; the sources use extensionless
  // imports (bundler style), so patch the temp output only.
  const markdownJs = `${TMP}markdown.js`;
  writeFileSync(
    markdownJs,
    readFileSync(markdownJs, 'utf8').replaceAll("'./stats'", "'./stats.js'"),
  );

  const { window } = new JSDOM('');
  globalThis.window = window;

  const lib = await import(pathToFileURL(`${TMP}markdown.js`).href);
  const { SAMPLE_MARKDOWN } = await import(pathToFileURL(`${TMP}sample.js`).href);
  const { renderMarkdown, buildStandaloneHtml, countWords } = lib;

  const html = renderMarkdown(SAMPLE_MARKDOWN);
  const checks = [
    ['h1 heading renders', html.includes('<h1') && html.includes('Markdown Studio</h1>')],
    ['h2 heading renders', html.includes('<h2') && html.includes('Why Markdown?</h2>')],
    ['bold renders', html.includes('<strong>live Markdown editor</strong>')],
    ['italic renders', html.includes('<em>words and structure</em>')],
    ['bulleted list renders', html.includes('<ul>') && html.includes('<li>')],
    ['numbered list renders', html.includes('<ol>')],
    ['table renders', html.includes('<table>') && html.includes('Autosave')],
    ['fenced code block renders', html.includes('<pre>') && html.includes('wordCount')],
    ['blockquote renders', html.includes('<blockquote>')],
    ['link renders', html.includes('<a href="https://marked.js.org"')],
    ['script injection is stripped', !renderMarkdown('x <script>alert(1)</script>').includes('<script')],
    ['word count is sane', countWords(SAMPLE_MARKDOWN) > 200],
    [
      'standalone HTML export is a full document',
      buildStandaloneHtml('Test', '# Hi').startsWith('<!doctype html>'),
    ],
  ];

  let failed = 0;
  for (const [name, ok] of checks) {
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`);
    if (!ok) failed++;
  }

  if (failed > 0) {
    console.error(`\n${failed} check(s) failed`);
    process.exit(1);
  }
  console.log(`\nAll ${checks.length} render checks passed.`);
} finally {
  rmSync(TMP, { recursive: true, force: true });
}
