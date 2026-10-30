(() => {
  const root = document.documentElement;
  const themeColor = document.querySelector('meta[name="theme-color"]');
  let storedTheme = null;
  try {
    storedTheme = window.localStorage.getItem('gandiva-theme');
  } catch { /* Akses storage ditolak: lanjut dengan preferensi OS. */ }
  const isDark = storedTheme === 'dark'
    || (storedTheme !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  root.dataset.theme = isDark ? 'dark' : 'light';
  root.style.colorScheme = isDark ? 'dark' : 'light';
  if (themeColor) themeColor.content = isDark ? '#12110f' : '#eef1ef';
})();
