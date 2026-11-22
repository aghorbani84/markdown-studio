import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { analyzeDocument, type DocumentStats, type HeadingEntry } from './stats';

export { countCharsNoSpaces, countWords } from './stats';

marked.setOptions({ gfm: true, breaks: true });

/** Render Markdown to sanitised HTML. Returns an empty string for empty input. */
export function renderMarkdown(markdown: string): string {
  const raw = marked.parse(markdown) as string;
  return DOMPurify.sanitize(raw);
}

export interface RenderedDocument {
  /** Sanitised HTML with a unique `id` on every heading (see stats.ts). */
  html: string;
  /** Wall-clock time of marked.parse + sanitise, measured live. */
  ms: number;
  stats: DocumentStats;
}

/**
 * Render + measure + analyse in one pass. `ms` comes from performance.now()
 * around the real render — never a hard-coded number.
 */
export function renderDocument(markdown: string): RenderedDocument {
  const stats = analyzeDocument(markdown);
  const start = performance.now();
  const raw = marked.parse(markdown) as string;
  const withIds = addHeadingIds(raw, stats.headings);
  const html = DOMPurify.sanitize(withIds);
  return { html, ms: performance.now() - start, stats };
}

/**
 * Stamp the outline ids onto the rendered headings, in document order.
 * marked's default renderer emits bare `<h1>`…`<h6>` tags, so a sequential
 * replace lines up exactly with the token stream `analyzeDocument` walked.
 */
function addHeadingIds(html: string, headings: HeadingEntry[]): string {
  let index = 0;
  return html.replace(/<h([1-6])>/g, (match, level: string) => {
    const entry = headings[index++];
    if (!entry || entry.depth !== Number(level)) return match;
    return `<h${level} id="${entry.id}">`;
  });
}


const EXPORT_CSS = `
  body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 760px; margin: 2rem auto; padding: 0 1.5rem; }
  h1, h2, h3 { line-height: 1.25; }
  code { background: #f3f4f6; padding: 0.15em 0.4em; border-radius: 4px; font-size: 0.9em; }
  pre { background: #111827; color: #f9fafb; padding: 1rem; border-radius: 8px; overflow-x: auto; }
  pre code { background: transparent; color: inherit; padding: 0; }
  blockquote { border-left: 4px solid #6366f1; margin-left: 0; padding-left: 1rem; color: #4b5563; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #d1d5db; padding: 0.5rem 0.75rem; text-align: left; }
  th { background: #f3f4f6; }
  a { color: #4f46e5; }
  hr { border: none; border-top: 1px solid #e5e7eb; margin: 2rem 0; }
`;

/** Wrap rendered HTML in a complete standalone HTML document. */
export function buildStandaloneHtml(title: string, markdown: string): string {
  const body = renderMarkdown(markdown);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(title)}</title>
<style>${EXPORT_CSS}</style>
</head>
<body>
${body}
</body>
</html>
`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
