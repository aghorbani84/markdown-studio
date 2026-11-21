export const STORAGE_KEY = 'markdown-studio:document:v1';
export const THEME_KEY = 'markdown-studio:theme:v1';

export const SAMPLE_MARKDOWN = `# Markdown Studio

A fast, distraction-free **live Markdown editor** with an instant preview. Type on the left, watch your document take shape on the right — no build step, no account, no waiting.

## Why Markdown?

Markdown is the simplest way to write for the web. You focus on *words and structure*, and the renderer handles the formatting:

- **Headings** organise ideas into a clear hierarchy
- **Lists** turn scattered thoughts into checkable steps
- **Links and code** keep references and snippets exactly where they belong
- **Tables** make data readable at a glance

> "The best writing tool is the one that gets out of your way."
> — Every writer who ever fought a word processor

## What this app can do

1. **Live preview** — every keystroke re-renders the document instantly.
2. **Formatting toolbar** — bold, italic, headings, lists, links and code blocks in one click.
3. **Autosave** — your work is saved to your browser automatically as you type.
4. **Export** — download your document as \`.md\` or as a standalone \`.html\` file.
5. **Copy HTML** — grab the rendered HTML for pasting into a blog or CMS.
6. **Dark mode** — easy on the eyes for late-night writing sessions.

## Try it yourself

Select some text in the editor and press the **Bold** button in the toolbar, or try writing a table:

| Feature | Included |
| ------- | -------- |
| Live preview | Yes |
| Autosave | Yes |
| Export | Yes |
| Account required | Never |

### A little code

\`\`\`typescript
function wordCount(text: string): number {
  return text.trim().split(/\\s+/).filter(Boolean).length;
}
\`\`\`

Inline code like \`npm run dev\` works too, and so do [links](https://marked.js.org) to the tools that power this app.

---

Happy writing — delete this document and make it your own.
`;
