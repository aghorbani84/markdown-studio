import { Landmark, Moon, Sparkles, Sun } from 'lucide-react';
import { useTheme, type ThemeStyle } from '../theme/ThemeContext';
import styles from './ThemeSwitcher.module.css';

const STYLES: { id: ThemeStyle; label: string; icon: typeof Landmark }[] = [
  { id: 'achaemenid', label: 'Achaemenid', icon: Landmark },
  { id: 'modern', label: 'Modern', icon: Sparkles },
];

export function ThemeSwitcher() {
  const { style, mode, setStyle, toggleMode } = useTheme();

  return (
    <div className={styles.switcher}>
      <div className={styles.styleToggle} role="group" aria-label="Visual style">
        {STYLES.map((s) => {
          const Icon = s.icon;
          const active = style === s.id;
          return (
            <button
              key={s.id}
              type="button"
              className={`${styles.styleButton} ${active ? styles.styleButtonActive : ''}`}
              aria-pressed={active}
              onClick={() => setStyle(s.id)}
            >
              <Icon size={14} strokeWidth={2} aria-hidden />
              {s.label}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        className={styles.modeButton}
        onClick={toggleMode}
        aria-label="Toggle dark mode"
        aria-pressed={mode === 'dark'}
        title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
      >
        {mode === 'light' ? (
          <Moon size={15} strokeWidth={2} aria-hidden />
        ) : (
          <Sun size={15} strokeWidth={2} aria-hidden />
        )}
      </button>
    </div>
  );
}
