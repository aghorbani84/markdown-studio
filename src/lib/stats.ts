import { lexer, walkTokens } from 'marked';

/**
 * Document statistics derived from the marked token stream — never regex
 * guesses. Headings, links and code blocks are counted from real tokens;
 * words/chars come from the source text. `renderDocument` (lib/markdown)
 * reuses the heading ids produced here so the outline scrolls to the exact
 * element the preview rendered.
 */

export interface HeadingEntry {
  depth: number;
  text: string;
  /** Unique slug id, matching the `id` attribute on the rendered heading. */
  id: string;
}

export interface DocumentStats {
  words: number;
  characters: number;
  charsNoSpaces: number;
  lines: number;
  headings: HeadingEntry[];
  headingCount: number;
  links: number;
  codeBlocks: number;
  /** Estimated reading time in whole minutes at 200 wpm, minimum 1. */
  readingTimeMinutes: number;
}

/** Count words in a document (whitespace-separated tokens). */
export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

/** Count non-whitespace characters. */
export function countCharsNoSpaces(text: string): number {
  return text.replace(/\s/g, '').length;
}

/** URL-safe slug for a heading; empty input falls back to "heading". */
export function slugifyHeading(text: string): string {
  const slug = text
    .toLowerCase()
    .trim()
    .replace(/<[^>]+>/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return slug || 'heading';
}

/** Analyse a Markdown document. Pure function of the source text. */
export function analyzeDocument(markdown: string): DocumentStats {
  const tokens = lexer(markdown);
  const headings: HeadingEntry[] = [];
  let links = 0;
  let codeBlocks = 0;
  const usedIds = new Map<string, number>();

  walkTokens(tokens, (token) => {
    if (token.type === 'heading') {
      const base = slugifyHeading(token.text);
      const seen = usedIds.get(base) ?? 0;
      usedIds.set(base, seen + 1);
      headings.push({
        depth: token.depth,
        text: token.text,
        id: seen === 0 ? base : `${base}-${seen}`,
      });
    } else if (token.type === 'link') {
      links += 1;
    } else if (token.type === 'code') {
      codeBlocks += 1;
    }
  });

  const words = countWords(markdown);
  return {
    words,
    characters: markdown.length,
    charsNoSpaces: countCharsNoSpaces(markdown),
    lines: markdown === '' ? 0 : markdown.split('\n').length,
    headings,
    headingCount: headings.length,
    links,
    codeBlocks,
    readingTimeMinutes: Math.max(1, Math.ceil(words / 200)),
  };
}
