import { afterEach, beforeEach, vi } from 'vitest';

function createMatchMedia(query) {
  const listeners = new Set();
  return {
    media: query,
    matches: false,
    onchange: null,
    addEventListener: (_type, listener) => listeners.add(listener),
    removeEventListener: (_type, listener) => listeners.delete(listener),
    addListener: (listener) => listeners.add(listener),
    removeListener: (listener) => listeners.delete(listener),
    dispatchEvent: (event) => {
      listeners.forEach((listener) => listener(event));
      return true;
    }
  };
}

beforeEach(() => {
  document.head.querySelectorAll('script[data-analytics-id]').forEach((element) => element.remove());
  document.body.innerHTML = '<div id="app"><div id="test-mount"></div></div>';
  document.documentElement.dataset.theme = 'light';
  document.documentElement.removeAttribute('data-theme-ready');
  document.documentElement.style.colorScheme = '';
  document.body.style.overflow = '';
  window.localStorage.clear();
  window.dataLayer = [];
  delete window.gtag;

  vi.stubGlobal('matchMedia', vi.fn((query) => createMatchMedia(query)));
  vi.stubGlobal('requestAnimationFrame', vi.fn((callback) => {
    callback(0);
    return 1;
  }));
  vi.stubGlobal('cancelAnimationFrame', vi.fn());

  Object.defineProperty(HTMLElement.prototype, 'inert', {
    configurable: true,
    get() {
      return this.hasAttribute('inert');
    },
    set(value) {
      if (value) this.setAttribute('inert', '');
      else this.removeAttribute('inert');
    }
  });

  vi.spyOn(HTMLElement.prototype, 'getClientRects').mockImplementation(() => [{
    width: 1,
    height: 1,
    top: 0,
    right: 1,
    bottom: 1,
    left: 0
  }]);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  document.body.innerHTML = '';
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.removeAttribute('data-theme-ready');
});
