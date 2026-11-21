import { useEditor } from '../state/store';
import styles from './Editor.module.css';

export function Editor() {
  const { state, dispatch, editorRef } = useEditor();

  return (
    <section className={styles.pane} aria-label="Markdown editor">
      <header className={styles.paneHeader}>
        <span className={styles.paneTitle}>Editor</span>
        <span className={styles.paneHint}>Markdown</span>
      </header>
      <textarea
        ref={editorRef}
        className={styles.textarea}
        value={state.markdown}
        onChange={(e) => dispatch({ type: 'SET_MARKDOWN', payload: e.target.value })}
        placeholder="Write Markdown here…"
        aria-label="Markdown source"
        spellCheck
      />
    </section>
  );
}
