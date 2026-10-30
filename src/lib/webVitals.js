import { hasAnalyticsConsent, trackEvent } from './analytics.js';

export const webVitalsRelease = '2026-07-24-rum-v1';

let initialized = false;
let initPromise = null;

function viewportCategory(windowRef = globalThis.window) {
  if (!windowRef?.matchMedia) return 'unknown';
  if (windowRef.matchMedia('(max-width: 767px)').matches) return 'mobile';
  if (windowRef.matchMedia('(max-width: 1100px)').matches) return 'tablet';
  return 'desktop';
}

function attributionFor(metric) {
  const attribution = metric.attribution ?? {};
  const target = attribution.interactionTarget
    ?? attribution.lcpEntry?.element
    ?? attribution.largestShiftTarget
    ?? '';

  return {
    debug_target: String(target).slice(0, 160) || undefined,
    debug_type: attribution.interactionType
      ?? attribution.loadState
      ?? undefined
  };
}

export function formatWebVital(metric, {
  pagePath = globalThis.location?.pathname ?? '/',
  viewport = viewportCategory()
} = {}) {
  return {
    value: metric.delta,
    metric_name: metric.name,
    metric_id: metric.id,
    metric_value: metric.value,
    metric_delta: metric.delta,
    metric_rating: metric.rating,
    navigation_type: metric.navigationType,
    page_path: pagePath,
    viewport_category: viewport,
    app_release: webVitalsRelease,
    ...attributionFor(metric)
  };
}

async function startWebVitals() {
  try {
    const { onCLS, onINP, onLCP } = await import('web-vitals/attribution');
    const report = (metric) => {
      if (!hasAnalyticsConsent()) return;
      trackEvent('web_vital', formatWebVital(metric, {
        pagePath: `${window.location.pathname}${window.location.search}`
      }));
    };

    onCLS(report);
    onINP(report);
    onLCP(report);
    initialized = true;
    return true;
  } catch {
    initPromise = null;
    return false;
  }
}

export function initializeWebVitals() {
  if (typeof window === 'undefined' || !hasAnalyticsConsent()) return Promise.resolve(false);
  // Promise flight: concurrent callers share one init instead of racing.
  initPromise ??= startWebVitals();
  return initPromise;
}

export function resetWebVitalsForTests() {
  initialized = false;
  initPromise = null;
}
