import { ListTree } from 'lucide-react';
import type { HeadingEntry } from '../lib/stats';
import styles from './Outline.module.css';

interface OutlineProps {
  headings: HeadingEntry[];
}

/** Compact document index: every heading, clickable, scrolls the preview to it. */
export function Outline({ headings }: OutlineProps) {
  const scrollToHeading = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className={styles.pane} aria-label="Document outline">
      <header className={styles.paneHeader}>
        <span className={styles.paneTitle}>
          <ListTree size={14} strokeWidth={2} aria-hidden />
          Outline
        </span>
        <span className={styles.count}>{headings.length}</span>
      </header>
      <div className={styles.list}>
        {headings.length === 0 ? (
          <p className={styles.empty}>No headings yet — add a # heading to build an index.</p>
        ) : (
          headings.map((heading) => (
            <button
              key={heading.id}
              type="button"
              className={styles.item}
              style={{ paddingLeft: 12 + (heading.depth - 1) * 12 }}
              onClick={() => scrollToHeading(heading.id)}
              title={heading.text}
            >
              <span className={styles.depth} aria-hidden>
                H{heading.depth}
              </span>
              <span className={styles.itemText}>{heading.text}</span>
            </button>
          ))
        )}
      </div>
    </nav>
  );
}
