# Markdown Studio

> A live Markdown editor with instant, sanitized preview, an outline, document stats, and Markdown/HTML export.

[![Live demo](https://img.shields.io/badge/demo-GitHub%20Pages-2ea44f)](https://aghorbani84.github.io/markdown-studio/)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![marked](https://img.shields.io/badge/markdown-marked-informational)
![DOMPurify](https://img.shields.io/badge/sanitizer-DOMPurify-informational)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)

**Live demo:** https://aghorbani84.github.io/markdown-studio/

## Overview

Type Markdown on one side and watch the rendered document update on the other. Everything runs locally in the browser: no account, no backend, no network calls. Your document autosaves to `localStorage`.

## Features

- **Live preview** – GitHub-flavored Markdown rendered with `marked` and sanitized with DOMPurify on every keystroke
- **Formatting toolbar** – bold, italic, headings, lists, links, inline code, code blocks, quotes, and horizontal rules, inserted at the cursor
- **Layouts** – Split, Editor-only, and Preview-only views
- **Outline** – clickable list of headings that scrolls the preview
- **Document stats** – words, characters, headings, links, code blocks, estimated reading time, and render time; status bar with line counts and autosave state
- **Export** – download as `.md` or standalone `.html`, or copy the sanitized HTML to the clipboard
- **Themes** – Modern and Achaemenid visual styles, each with light and dark mode, remembered across visits
- **Autosave** – document saved to `localStorage` as you type; a sample document is seeded on first launch

## Tech stack

| Area | Tools |
| --- | --- |
| UI | React 19, TypeScript, lucide-react icons |
| State | React Context + `useReducer` |
| Rendering | `marked` + DOMPurify |
| Styling | CSS Modules with CSS custom properties |
| Build & lint | Vite, oxlint |
| Deployment | GitHub Pages via GitHub Actions |

## Getting started

Requires Node.js (CI uses Node 20).

```bash
git clone https://github.com/aghorbani84/markdown-studio.git
cd markdown-studio
npm install
npm run dev        # start the dev server (usually http://localhost:5173)
```

Other scripts:

```bash
npm run build          # type-check (tsc) + production build into dist/
npm run preview        # serve the production build locally
npm run lint           # run oxlint
npm run verify:render  # run the seeded document through marked + DOMPurify and
                       # assert headings, lists, tables, code blocks, and script stripping
```

## Project structure

```
src/
├── App.tsx               # shell: header, actions, layout, exports
├── main.tsx              # entry point
├── components/           # Toolbar, Editor, Preview, Outline, StatsBar,
│                         # StatusBar, ThemeSwitcher (+ CSS Modules)
├── lib/
│   ├── markdown.ts       # marked + DOMPurify pipeline, HTML export
│   ├── stats.ts          # document statistics
│   └── sample.ts         # seeded sample document
├── state/store.tsx       # Context + useReducer editor store, autosave
└── theme/ThemeContext.tsx
scripts/verify-render.mjs # render pipeline check (jsdom)
```

## Author

Built by [aghorbani84](https://github.com/aghorbani84).
