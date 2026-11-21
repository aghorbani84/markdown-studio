# Markdown Studio

A live Markdown editor with an instant rendered preview. Type on the left, watch
your document take shape on the right — no account, no backend, everything runs
locally in your browser.

## Features

- **Live preview** — every keystroke re-renders the document instantly
- **Formatting toolbar** — bold, italic, headings, lists, links, inline code,
  code blocks, quotes and horizontal rules, inserted at the cursor
- **Split / Editor / Preview layouts** — switch the workspace to suit the task
- **Export** — download the document as `.md` or as a standalone `.html` file
- **Copy HTML** — copy the sanitised rendered HTML to the clipboard
- **Dark / light mode** — persisted across visits
- **Word & character counts** — words, characters, characters without spaces,
  and lines in the status bar
- **Autosave** — the document is saved to `localStorage` as you type and
  restored on the next visit; a real sample document about the app itself is
  seeded on first launch

## Tech used

- **React 19 + TypeScript + Vite**
- **State: React Context + `useReducer`** — a single editor store
  (`src/state/store.tsx`) holds the document, theme and layout; autosave and
  theme persistence live in the provider
- **Styling: CSS Modules** — one scoped module per component, with CSS custom
  properties for the light/dark themes
- **Rendering: `marked`** (GitHub-flavoured Markdown) with **`DOMPurify`**
  sanitising the HTML before it is injected into the preview
- **Data: `localStorage` only** — no API, no keys, no network calls

## How to run

```bash
npm install
npm run dev
```

Then open the URL shown in the terminal (usually http://localhost:5173).

Other scripts:

```bash
npm run build    # typecheck + production build
npm run verify:render  # renders the seeded doc through the real marked +
                       # DOMPurify pipeline and asserts headings, lists,
                       # tables, code blocks and script stripping (13 checks)
npm run preview  # serve the production build locally
```

## Project structure

```
src/
  App.tsx                 # Shell: header, actions, layout, exports
  App.module.css
  index.css               # Theme variables (light/dark) and base styles
  main.tsx                # Entry point
  components/
    Toolbar.tsx           # Formatting toolbar (cursor-aware insertion)
    Editor.tsx            # Markdown textarea
    Preview.tsx           # Sanitised rendered HTML
    StatusBar.tsx         # Word / character / line counts, autosave status
  lib/
    markdown.ts           # marked + DOMPurify pipeline, HTML export builder
    sample.ts             # Seeded sample document + storage keys
  state/
    store.tsx             # Context + useReducer editor store, autosave
```
