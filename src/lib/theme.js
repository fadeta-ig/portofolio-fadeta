export const themeStorageKey = 'gandiva-theme';
export const darkTheme = 'dark';
export const lightTheme = 'light';

function safeStorage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

export function readStoredTheme(storage) {
  try {
    const store = storage === undefined ? safeStorage() : storage;
    const value = store?.getItem(themeStorageKey);
    return value === darkTheme || value === lightTheme ? value : null;
  } catch {
    return null;
  }
}

export function writeStoredTheme(theme, storage) {
  try {
    const store = storage === undefined ? safeStorage() : storage;
    store?.setItem(themeStorageKey, theme);
    return true;
  } catch {
    return false;
  }
}

// Mirror of the inline boot script in index.html (kept duplicated on purpose:
// the boot script must run before Vue, and its bytes are pinned by the CSP
// hash in vercel.json). Keep the semantics identical in both places.
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
    themeColor.setAttribute('content', normalizedTheme === darkTheme ? '#12110f' : '#eef1ef');
  }
}
