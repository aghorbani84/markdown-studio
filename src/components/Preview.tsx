import { FileText } from 'lucide-react';
import { useEditor } from '../state/store';
import styles from './Preview.module.css';

interface PreviewProps {
  /** Sanitised HTML rendered by the Shell (single render per keystroke). */
  html: string;
}

export function Preview({ html }: PreviewProps) {
  const { state } = useEditor();
  const isEmpty = state.markdown.trim() === '';

  return (
    <section className={styles.pane} aria-label="Rendered preview">
      <header className={styles.paneHeader}>
        <span className={styles.paneTitle}>Preview</span>
        <span className={styles.paneHint}>Rendered</span>
      </header>
      <div className={styles.scroll}>
        <div className={styles.page}>
          {isEmpty ? (
            <div className={styles.empty}>
              <FileText size={21} strokeWidth={1.5} aria-hidden />
              <span className={styles.emptyTitle}>Nothing to preview yet</span>
              <span className={styles.emptyHint}>
                Start typing in the editor — your document takes shape here.
              </span>
            </div>
          ) : (
            <div
              className={styles.preview}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
        </div>
      </div>
    </section>
  );
}
