import { useEditor } from '../state/store';
import styles from './Toolbar.module.css';

interface Snippet {
  label: string;
  title: string;
  before: string;
  after: string;
  placeholder: string;
  /** Insert on its own line instead of inline. */
  block?: boolean;
}

const SNIPPETS: Snippet[] = [
  { label: 'B', title: 'Bold', before: '**', after: '**', placeholder: 'bold text' },
  { label: 'I', title: 'Italic', before: '*', after: '*', placeholder: 'italic text' },
  { label: 'H1', title: 'Heading 1', before: '# ', after: '', placeholder: 'Heading', block: true },
  { label: 'H2', title: 'Heading 2', before: '## ', after: '', placeholder: 'Heading', block: true },
  { label: 'H3', title: 'Heading 3', before: '### ', after: '', placeholder: 'Heading', block: true },
  { label: '• List', title: 'Bulleted list', before: '- ', after: '', placeholder: 'List item', block: true },
  { label: '1. List', title: 'Numbered list', before: '1. ', after: '', placeholder: 'List item', block: true },
  { label: 'Link', title: 'Link', before: '[', after: '](https://example.com)', placeholder: 'link text' },
  { label: '</>', title: 'Inline code', before: '`', after: '`', placeholder: 'code' },
  { label: 'Code', title: 'Code block', before: '```\n', after: '\n```', placeholder: 'code', block: true },
  { label: 'Quote', title: 'Quote', before: '> ', after: '', placeholder: 'Quote', block: true },
  { label: '—', title: 'Horizontal rule', before: '\n---\n', after: '', placeholder: '', block: true },
];

/**
 * Insert `before + selection + after` at the cursor position of the editor
 * textarea (or wrap the current selection). Falls back to appending when
 * the editor is not focused.
 */
export function Toolbar() {
  const { state, dispatch, editorRef } = useEditor();

  const insert = (snippet: Snippet) => {
    const textarea = editorRef.current;
    const current = state.markdown;
    if (!textarea) {
      dispatch({ type: 'SET_MARKDOWN', payload: current + snippet.before + snippet.placeholder + snippet.after });
      return;
    }

    const start = textarea.selectionStart ?? current.length;
    const end = textarea.selectionEnd ?? current.length;
    const selected = current.slice(start, end) || snippet.placeholder;

    const needsNewlineBefore =
      snippet.block && start > 0 && current[start - 1] !== '\n';
    const prefix = needsNewlineBefore ? '\n' : '';
    const insertion = prefix + snippet.before + selected + snippet.after;
    const next = current.slice(0, start) + insertion + current.slice(end);

    dispatch({ type: 'SET_MARKDOWN', payload: next });

    // Restore focus and select the inserted text so the user can type over it.
    window.setTimeout(() => {
      const el = editorRef.current;
      if (!el) return;
      el.focus();
      const selStart = start + prefix.length + snippet.before.length;
      el.setSelectionRange(selStart, selStart + selected.length);
    }, 0);
  };

  return (
    <div className={styles.toolbar} role="toolbar" aria-label="Formatting toolbar">
      {SNIPPETS.map((snippet) => (
        <button
          key={snippet.title}
          type="button"
          className={styles.button}
          title={snippet.title}
          aria-label={snippet.title}
          onClick={() => insert(snippet)}
        >
          {snippet.label}
        </button>
      ))}
    </div>
  );
}
