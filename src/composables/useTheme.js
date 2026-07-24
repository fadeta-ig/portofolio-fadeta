import { onMounted, onUnmounted, ref } from 'vue';
import {
  applyTheme,
  darkTheme,
  lightTheme,
  readStoredTheme,
  writeStoredTheme
} from '../lib/theme';

/**
 * Theme composable — manages light/dark toggle with localStorage persistence.
 * Falls back to OS prefers-color-scheme on first visit.
 */
const isDark = ref(false);

export function useTheme() {
  let mediaQuery;
  let handleSystemChange;

  onMounted(() => {
    const currentTheme = document.documentElement.dataset.theme === darkTheme
      ? darkTheme
      : lightTheme;
    isDark.value = currentTheme === darkTheme;

    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    handleSystemChange = (event) => {
      const stored = readStoredTheme();
      if (!stored) {
        isDark.value = event.matches;
        applyTheme(event.matches ? darkTheme : lightTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    window.requestAnimationFrame(() => {
      document.documentElement.dataset.themeReady = 'true';
    });
  });

  onUnmounted(() => {
    if (mediaQuery && handleSystemChange) {
      mediaQuery.removeEventListener('change', handleSystemChange);
    }
  });

  function toggleTheme() {
    const nextTheme = document.documentElement.dataset.theme === darkTheme
      ? lightTheme
      : darkTheme;
    isDark.value = nextTheme === darkTheme;
    applyTheme(nextTheme);
    writeStoredTheme(nextTheme);
  }

  return {
    isDark,
    toggleTheme
  };
}
