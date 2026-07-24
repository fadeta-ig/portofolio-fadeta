export const measurementId = 'G-LQD4TF22QZ';
export const analyticsConsentStorageKey = 'gandiva.analytics-consent.v1';
export const cookieSettingsEvent = 'gandiva:open-cookie-settings';
export const analyticsConsentChangedEvent = 'gandiva:analytics-consent-changed';

let analyticsConfigured = false;
let memoryConsent = null;

function ensureGtag() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
}

function loadAnalyticsScript() {
  if (document.querySelector(`script[data-analytics-id="${measurementId}"]`)) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.dataset.analyticsId = measurementId;
  document.head.appendChild(script);
}

function clearAnalyticsCookies() {
  const cookieNames = document.cookie
    .split(';')
    .map((cookie) => cookie.split('=')[0]?.trim())
    .filter((name) => name && (name === '_ga' || name === '_gid' || name === '_gat' || name.startsWith('_ga_')));

  const domains = [undefined, window.location.hostname, `.${window.location.hostname}`];

  cookieNames.forEach((name) => {
    domains.forEach((domain) => {
      const domainPart = domain ? `; domain=${domain}` : '';
      document.cookie = `${name}=; Max-Age=0; path=/${domainPart}; SameSite=Lax`;
    });
  });
}

export function getAnalyticsConsent() {
  if (typeof window === 'undefined') return null;
  if (memoryConsent === 'granted' || memoryConsent === 'denied') return memoryConsent;

  try {
    const value = window.localStorage.getItem(analyticsConsentStorageKey);
    memoryConsent = value === 'granted' || value === 'denied' ? value : null;
    return memoryConsent;
  } catch {
    return null;
  }
}

export function hasAnalyticsConsent() {
  return getAnalyticsConsent() === 'granted';
}

function enableAnalytics() {
  ensureGtag();
  window.gtag('consent', 'update', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  });
  loadAnalyticsScript();

  if (!analyticsConfigured) {
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      send_page_view: false,
      anonymize_ip: true
    });
    analyticsConfigured = true;
  }
}

export function initializeAnalytics() {
  if (typeof window === 'undefined') return;
  memoryConsent = null;
  ensureGtag();
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500
  });

  if (hasAnalyticsConsent()) {
    enableAnalytics();
  } else {
    clearAnalyticsCookies();
  }
}

export function setAnalyticsConsent(allowed) {
  if (typeof window === 'undefined') return;

  const value = allowed ? 'granted' : 'denied';
  memoryConsent = value;

  try {
    window.localStorage.setItem(analyticsConsentStorageKey, value);
  } catch {
    // The explicit choice remains valid for this page session.
  }

  ensureGtag();

  if (allowed) {
    enableAnalytics();
  } else {
    window.gtag('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    clearAnalyticsCookies();
  }

  window.dispatchEvent(new CustomEvent(analyticsConsentChangedEvent, { detail: { value } }));
}

export function openCookieSettings() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(cookieSettingsEvent));
}

export function trackEvent(name, parameters = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function' || !hasAnalyticsConsent()) return;
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

export function resetAnalyticsStateForTests() {
  analyticsConfigured = false;
  memoryConsent = null;
}
