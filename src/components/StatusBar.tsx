import { countCharsNoSpaces, countWords } from '../lib/markdown';
import { useEditor } from '../state/store';
import styles from './StatusBar.module.css';

export function StatusBar() {
  const { state } = useEditor();
  const words = countWords(state.markdown);
  const chars = state.markdown.length;
  const charsNoSpaces = countCharsNoSpaces(state.markdown);
  const lines = state.markdown === '' ? 0 : state.markdown.split('\n').length;
  const savedLabel = state.savedAt
    ? `Autosaved ${new Date(state.savedAt).toLocaleTimeString()}`
    : 'Autosave on';

  return (
    <footer className={styles.statusBar} aria-label="Document statistics">
      <span>{words.toLocaleString()} words</span>
      <span>{chars.toLocaleString()} characters</span>
      <span>{charsNoSpaces.toLocaleString()} characters (no spaces)</span>
      <span>{lines.toLocaleString()} lines</span>
      <span className={styles.saved}>{savedLabel}</span>
    </footer>
  );
}
