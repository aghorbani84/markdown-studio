import { useMemo } from 'react';
import { renderMarkdown } from '../lib/markdown';
import { useEditor } from '../state/store';
import styles from './Preview.module.css';

export function Preview() {
  const { state } = useEditor();
  const html = useMemo(() => renderMarkdown(state.markdown), [state.markdown]);

  return (
    <section className={styles.pane} aria-label="Rendered preview">
      <header className={styles.paneHeader}>
        <span className={styles.paneTitle}>Preview</span>
        <span className={styles.paneHint}>Rendered</span>
      </header>
      <div
        className={styles.preview}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  );
}
