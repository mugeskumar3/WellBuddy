export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Applies the selected theme ('light' | 'dark' | 'system') to document.documentElement.
 * When in 'system' mode, listens for OS color scheme preference changes.
 * Returns a cleanup function.
 */
export function applyTheme(theme: ThemeMode = 'light'): () => void {
  if (typeof window === 'undefined') return () => {};

  const root = document.documentElement;
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const resolveIsDark = (): boolean => {
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    return mediaQuery.matches;
  };

  const update = () => {
    const isDark = resolveIsDark();
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    root.style.colorScheme = isDark ? 'dark' : 'light';
  };

  update();

  if (theme === 'system') {
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }

  return () => {};
}
