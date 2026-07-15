import { useEffect, useState } from 'react';

const STORAGE_KEY = 'perimo_theme';

type Theme = 'light' | 'dark';

function readStoredTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  // 'system' (set elsewhere, e.g. the admin Profile Menu) or unset — fall back
  // to the OS preference so a first-time visitor still gets the right theme.
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Self-contained theme toggle for the public Role Selection page. Shares the
 *  same localStorage key as the admin Profile Menu's theme selector so a
 *  choice made in one place is respected in the other, without depending on
 *  a global dark-mode system that doesn't exist yet across the whole app. */
export function usePageTheme() {
  const [theme, setTheme] = useState<Theme>(readStoredTheme);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return { theme, toggle, isDark: theme === 'dark' };
}
