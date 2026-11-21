import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
  type RefObject,
} from 'react';
import { SAMPLE_MARKDOWN, STORAGE_KEY, THEME_KEY } from '../lib/sample';

export type Theme = 'light' | 'dark';
export type ViewMode = 'split' | 'editor' | 'preview';

export interface EditorState {
  markdown: string;
  theme: Theme;
  viewMode: ViewMode;
  savedAt: number | null;
}

export type EditorAction =
  | { type: 'SET_MARKDOWN'; payload: string }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_VIEW_MODE'; payload: ViewMode }
  | { type: 'LOAD_DOCUMENT'; payload: string }
  | { type: 'RESET_DOCUMENT' }
  | { type: 'MARK_SAVED'; payload: number };

function loadInitialMarkdown(): string {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved !== null) return saved;
  } catch {
    // localStorage unavailable (private mode, etc.) — fall back to the sample.
  }
  return SAMPLE_MARKDOWN;
}

function loadInitialTheme(): Theme {
  try {
    const saved = window.localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // Ignore and fall through to the OS preference.
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function initialState(): EditorState {
  return {
    markdown: loadInitialMarkdown(),
    theme: loadInitialTheme(),
    viewMode: 'split',
    savedAt: null,
  };
}

function reducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SET_MARKDOWN':
      return { ...state, markdown: action.payload };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
    case 'LOAD_DOCUMENT':
      return { ...state, markdown: action.payload };
    case 'RESET_DOCUMENT':
      return { ...state, markdown: SAMPLE_MARKDOWN };
    case 'MARK_SAVED':
      return { ...state, savedAt: action.payload };
    default:
      return state;
  }
}

interface EditorContextValue {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
  /** Ref to the editor textarea, shared so the toolbar can insert at the cursor. */
  editorRef: RefObject<HTMLTextAreaElement | null>;
}

const EditorContext = createContext<EditorContextValue | null>(null);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const editorRef = useRef<HTMLTextAreaElement | null>(null);

  // Autosave: persist the document (debounced) and the theme on every change.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, state.markdown);
        dispatch({ type: 'MARK_SAVED', payload: Date.now() });
      } catch {
        // Storage full or unavailable — the document stays in memory.
      }
    }, 400);
    return () => window.clearTimeout(timer);
  }, [state.markdown]);

  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_KEY, state.theme);
    } catch {
      // Ignore persistence failures for the theme.
    }
    document.documentElement.dataset.theme = state.theme;
  }, [state.theme]);

  const value = useMemo(
    () => ({ state, dispatch, editorRef }),
    [state],
  );

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

export function useEditor(): EditorContextValue {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error('useEditor must be used inside <EditorProvider>');
  return ctx;
}
