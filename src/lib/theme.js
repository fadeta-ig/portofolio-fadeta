export const themeStorageKey = 'gandiva-theme';
export const darkTheme = 'dark';
export const lightTheme = 'light';

export function readStoredTheme(storage = globalThis.localStorage) {
  try {
    const value = storage?.getItem(themeStorageKey);
    return value === darkTheme || value === lightTheme ? value : null;
  } catch {
    return null;
  }
}

export function writeStoredTheme(theme, storage = globalThis.localStorage) {
  try {
    storage?.setItem(themeStorageKey, theme);
    return true;
  } catch {
    return false;
  }
}

export function resolveTheme({ storedTheme, prefersDark = false } = {}) {
  if (storedTheme === darkTheme || storedTheme === lightTheme) return storedTheme;
  return prefersDark ? darkTheme : lightTheme;
}

export function applyTheme(theme, documentRef = globalThis.document) {
  if (!documentRef?.documentElement) return;

  const normalizedTheme = theme === darkTheme ? darkTheme : lightTheme;
  const root = documentRef.documentElement;
  root.dataset.theme = normalizedTheme;
  root.style.colorScheme = normalizedTheme;

  const themeColor = documentRef.querySelector('meta[name="theme-color"]');
  if (themeColor) {
    themeColor.setAttribute('content', normalizedTheme === darkTheme ? '#12110f' : '#f5f0e7');
  }
}
