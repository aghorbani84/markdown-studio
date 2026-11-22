import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type ThemeStyle = 'achaemenid' | 'modern';
export type ThemeMode = 'light' | 'dark';

export const STYLE_KEY = 'showcase-style';
export const MODE_KEY = 'showcase-mode';

function loadStyle(): ThemeStyle {
  try {
    const saved = window.localStorage.getItem(STYLE_KEY);
    if (saved === 'achaemenid' || saved === 'modern') return saved;
  } catch {
    // Ignore — fall through to the default.
  }
  return 'modern';
}

function loadMode(): ThemeMode {
  try {
    const saved = window.localStorage.getItem(MODE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // Ignore — fall through to the OS preference.
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

interface ThemeContextValue {
  style: ThemeStyle;
  mode: ThemeMode;
  setStyle: (style: ThemeStyle) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [style, setStyle] = useState<ThemeStyle>(loadStyle);
  const [mode, setMode] = useState<ThemeMode>(loadMode);

  useEffect(() => {
    try {
      window.localStorage.setItem(STYLE_KEY, style);
    } catch {
      // Ignore persistence failures.
    }
    document.documentElement.dataset.style = style;
  }, [style]);

  useEffect(() => {
    try {
      window.localStorage.setItem(MODE_KEY, mode);
    } catch {
      // Ignore persistence failures.
    }
    document.documentElement.dataset.mode = mode;
    // Back-compat with the pre-existing editor store, which reads/writes
    // `data-theme`; the token system itself keys off data-style/data-mode.
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      style,
      mode,
      setStyle,
      setMode,
      toggleMode: () => setMode((m) => (m === 'light' ? 'dark' : 'light')),
    }),
    [style, mode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
