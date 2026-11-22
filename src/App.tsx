import { useEffect, useMemo, useState } from 'react';
import {
  Columns2,
  Copy,
  Download,
  FileDown,
  FileText,
  PanelLeft,
  PanelRight,
  RotateCcw,
} from 'lucide-react';
import { EditorProvider, useEditor, type ViewMode } from './state/store';
import { ThemeProvider } from './theme/ThemeContext';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { Toolbar } from './components/Toolbar';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { StatsBar } from './components/StatsBar';
import { Outline } from './components/Outline';
import { StatusBar } from './components/StatusBar';
import { buildStandaloneHtml, renderDocument, renderMarkdown } from './lib/markdown';
import styles from './App.module.css';

function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for browsers/contexts without async clipboard access.
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    textarea.remove();
    return ok;
  }
}

const VIEW_MODES: { id: ViewMode; label: string; icon: typeof Columns2 }[] = [
  { id: 'split', label: 'Split', icon: Columns2 },
  { id: 'editor', label: 'Editor', icon: PanelLeft },
  { id: 'preview', label: 'Preview', icon: PanelRight },
];

function Shell() {
  const { state, dispatch } = useEditor();
  const [notice, setNotice] = useState<string | null>(null);

  // One render per keystroke: HTML + live render time + token-stream stats.
  const rendered = useMemo(() => renderDocument(state.markdown), [state.markdown]);
  const { stats } = rendered;

  // Datasheet title: version + the numbers that prove it, in the tab too.
  const datasheet = `${stats.words.toLocaleString()} words · ${stats.headingCount.toLocaleString()} headings · rendered in ${rendered.ms.toFixed(1)} ms`;
  useEffect(() => {
    document.title = `Markdown Studio v2 — ${datasheet}`;
  }, [datasheet]);

  const flash = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice((current) => (current === message ? null : current)), 3000);
  };

  const exportMarkdown = () => {
    download('document.md', state.markdown, 'text/markdown');
    flash('Downloaded document.md');
  };

  const exportHtml = () => {
    download('document.html', buildStandaloneHtml('Markdown Studio Export', state.markdown), 'text/html');
    flash('Downloaded document.html');
  };

  const copyHtml = async () => {
    const ok = await copyToClipboard(renderMarkdown(state.markdown));
    flash(ok ? 'Rendered HTML copied to clipboard' : 'Could not access the clipboard');
  };

  const showEditor = state.viewMode === 'split' || state.viewMode === 'editor';
  const showPreview = state.viewMode === 'split' || state.viewMode === 'preview';
  const showOutline = showPreview;

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <FileText size={18} strokeWidth={2} className={styles.brandIcon} aria-hidden />
          {/* Faravahar accent — Achaemenid style only (one place, ≤28px, gold). */}
          <svg
            className={styles.faravahar}
            viewBox="0 0 48 28"
            width="28"
            height="17"
            aria-hidden
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          >
            <circle cx="24" cy="12" r="3.2" />
            <path d="M21 9.5C15 5.5 9 4.5 4.5 6M21 12H5M21 14.5C15 18.5 9 19.5 4.5 18" />
            <path d="M27 9.5C33 5.5 39 4.5 43.5 6M27 12H43M27 14.5C33 18.5 39 19.5 43.5 18" />
            <path d="M22 16.5v6M24 16.5v8M26 16.5v6" />
          </svg>
          <div className={styles.brandText}>
            <h1 className={styles.title}>Markdown Studio v2</h1>
            <span className={styles.subtitle}>{datasheet}</span>
          </div>
        </div>
        <div className={styles.actions}>
          <div className={styles.viewToggle} role="group" aria-label="Layout">
            {VIEW_MODES.map((mode) => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.id}
                  type="button"
                  className={`${styles.viewButton} ${state.viewMode === mode.id ? styles.viewButtonActive : ''}`}
                  aria-pressed={state.viewMode === mode.id}
                  onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: mode.id })}
                >
                  <Icon size={15} strokeWidth={2} aria-hidden />
                  {mode.label}
                </button>
              );
            })}
          </div>
          <span className={styles.actionsDivider} aria-hidden />
          <ThemeSwitcher />
          <span className={styles.actionsDivider} aria-hidden />
          <button type="button" className={styles.actionButton} onClick={copyHtml}>
            <Copy size={15} strokeWidth={2} aria-hidden />
            Copy HTML
          </button>
          <button type="button" className={`${styles.actionButton} ${styles.bordered}`} onClick={exportMarkdown}>
            <FileDown size={15} strokeWidth={2} aria-hidden />
            Export .md
          </button>
          <button
            type="button"
            className={`${styles.actionButton} ${styles.primary}`}
            onClick={exportHtml}
          >
            <Download size={15} strokeWidth={2} aria-hidden />
            Export .html
          </button>
          <button
            type="button"
            className={`${styles.actionButton} ${styles.iconOnly}`}
            onClick={() => {
              dispatch({ type: 'RESET_DOCUMENT' });
              flash('Sample document restored');
            }}
            aria-label="Reset document"
            title="Reset document"
          >
            <RotateCcw size={15} strokeWidth={2} aria-hidden />
          </button>
        </div>
      </header>

      <StatsBar stats={stats} renderMs={rendered.ms} />

      <Toolbar />

      {notice && (
        <div className={styles.notice} role="status">
          {notice}
        </div>
      )}

      <main
        className={`${styles.main} ${state.viewMode === 'split' ? styles.mainSplit : styles.mainSingle} ${showOutline ? styles.mainOutline : ''}`}
      >
        {showOutline && (
          <div className={styles.outlineSlot}>
            <Outline headings={stats.headings} />
          </div>
        )}
        {showEditor && <Editor />}
        {showPreview && <Preview html={rendered.html} />}
      </main>

      <StatusBar />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <EditorProvider>
        <Shell />
      </EditorProvider>
    </ThemeProvider>
  );
}
