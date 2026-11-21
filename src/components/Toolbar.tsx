import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  SquareCode,
  type LucideIcon,
} from 'lucide-react';
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
  icon: LucideIcon;
}

const SNIPPETS: Snippet[] = [
  { label: 'B', title: 'Bold', before: '**', after: '**', placeholder: 'bold text', icon: Bold },
  { label: 'I', title: 'Italic', before: '*', after: '*', placeholder: 'italic text', icon: Italic },
  { label: 'H1', title: 'Heading 1', before: '# ', after: '', placeholder: 'Heading', block: true, icon: Heading1 },
  { label: 'H2', title: 'Heading 2', before: '## ', after: '', placeholder: 'Heading', block: true, icon: Heading2 },
  { label: 'H3', title: 'Heading 3', before: '### ', after: '', placeholder: 'Heading', block: true, icon: Heading3 },
  { label: '• List', title: 'Bulleted list', before: '- ', after: '', placeholder: 'List item', block: true, icon: List },
  { label: '1. List', title: 'Numbered list', before: '1. ', after: '', placeholder: 'List item', block: true, icon: ListOrdered },
  { label: 'Link', title: 'Link', before: '[', after: '](https://example.com)', placeholder: 'link text', icon: Link2 },
  { label: '</>', title: 'Inline code', before: '`', after: '`', placeholder: 'code', icon: Code },
  { label: 'Code', title: 'Code block', before: '```\n', after: '\n```', placeholder: 'code', block: true, icon: SquareCode },
  { label: 'Quote', title: 'Quote', before: '> ', after: '', placeholder: 'Quote', block: true, icon: Quote },
  { label: '—', title: 'Horizontal rule', before: '\n---\n', after: '', placeholder: '', block: true, icon: Minus },
];

/** Toolbar groups, in the order the formatting decisions are made. */
const GROUPS: Snippet[][] = [
  SNIPPETS.slice(0, 2),
  SNIPPETS.slice(2, 5),
  SNIPPETS.slice(5, 7),
  SNIPPETS.slice(7, 9),
  SNIPPETS.slice(9, 12),
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
      {GROUPS.map((group, gi) => (
        <div key={gi} className={styles.group} role="group" aria-label={`Formatting group ${gi + 1}`}>
          {group.map((snippet) => {
            const Icon = snippet.icon;
            return (
              <button
                key={snippet.title}
                type="button"
                className={styles.button}
                title={snippet.title}
                aria-label={snippet.title}
                onClick={() => insert(snippet)}
              >
                <Icon size={16} strokeWidth={2} aria-hidden />
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
