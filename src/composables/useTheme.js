import { ref, watch, onMounted } from 'vue';

const STORAGE_KEY = 'gandiva-theme';
const DARK_VALUE = 'dark';
const LIGHT_VALUE = 'light';

/**
 * Theme composable — manages light/dark toggle with localStorage persistence.
 * Falls back to OS prefers-color-scheme on first visit.
 */
const isDark = ref(false);

function applyTheme(dark) {
  const root = document.documentElement;
  if (dark) {
    root.setAttribute('data-theme', DARK_VALUE);
  } else {
    root.removeAttribute('data-theme');
  }
}

function getSystemPreference() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function getStoredTheme() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY);
}

function initTheme() {
  const stored = getStoredTheme();

  if (stored === DARK_VALUE) {
    isDark.value = true;
  } else if (stored === LIGHT_VALUE) {
    isDark.value = false;
  } else {
    isDark.value = getSystemPreference();
  }

  applyTheme(isDark.value);
}

export function useTheme() {
  onMounted(() => {
    initTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (event) => {
      const stored = getStoredTheme();
      if (!stored) {
        isDark.value = event.matches;
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
  });

  watch(isDark, (newVal) => {
    applyTheme(newVal);
    localStorage.setItem(STORAGE_KEY, newVal ? DARK_VALUE : LIGHT_VALUE);
  });

  function toggleTheme() {
    isDark.value = !isDark.value;
  }

  return {
    isDark,
    toggleTheme
  };
}
