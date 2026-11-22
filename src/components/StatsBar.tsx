import type { DocumentStats } from '../lib/stats';
import styles from './StatsBar.module.css';

interface StatsBarProps {
  stats: DocumentStats;
  /** Live-measured render time (performance.now() around the real render). */
  renderMs: number;
}

function formatMs(ms: number): string {
  return `${ms.toFixed(1)} ms`;
}

/**
 * Live document-stats bar + proof strip. Every number is measured from the
 * document itself: counts from the marked token stream, render time from
 * performance.now(). No hard-coded values anywhere.
 */
export function StatsBar({ stats, renderMs }: StatsBarProps) {
  const cells: { label: string; value: string }[] = [
    { label: 'Words', value: stats.words.toLocaleString() },
    { label: 'Characters', value: stats.characters.toLocaleString() },
    { label: 'Headings', value: stats.headingCount.toLocaleString() },
    { label: 'Links', value: stats.links.toLocaleString() },
    { label: 'Code blocks', value: stats.codeBlocks.toLocaleString() },
    { label: 'Reading time', value: `~${stats.readingTimeMinutes} min` },
  ];

  return (
    <div className={styles.bar} aria-label="Document statistics">
      {cells.map((cell) => (
        <div key={cell.label} className={styles.cell}>
          <span className={styles.label}>{cell.label}</span>
          <span className={styles.value}>{cell.value}</span>
        </div>
      ))}
      <div className={styles.proof} role="status" aria-label="Live render proof">
        <span className={styles.liveDot} aria-hidden />
        <span>
          rendered in {formatMs(renderMs)} · {stats.words.toLocaleString()} words ·{' '}
          {stats.headingCount.toLocaleString()} headings
        </span>
      </div>
    </div>
  );
}
