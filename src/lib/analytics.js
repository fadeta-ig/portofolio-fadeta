export const measurementId = 'G-LQD4TF22QZ';

export function initializeAnalytics() {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, { send_page_view: false });
}

export function trackEvent(name, parameters = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', name, parameters);
}

export function trackPageView(path, title) {
  if (typeof window === 'undefined') return;
  trackEvent('page_view', {
    page_location: `${window.location.origin}${path}`,
    page_path: path,
    page_title: title
  });
}
