import { hasAnalyticsConsent, trackEvent } from './analytics.js';

export const webVitalsRelease = '2026-07-24-rum-v1';

let initialized = false;

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

export async function initializeWebVitals() {
  if (initialized || typeof window === 'undefined' || !hasAnalyticsConsent()) return false;
  initialized = true;

  const pagePath = `${window.location.pathname}${window.location.search}`;

  try {
    const { onCLS, onINP, onLCP } = await import('web-vitals/attribution');
    const report = (metric) => {
      if (!hasAnalyticsConsent()) return;
      trackEvent('web_vital', formatWebVital(metric, { pagePath }));
    };

    onCLS(report);
    onINP(report);
    onLCP(report);
    return true;
  } catch {
    initialized = false;
    return false;
  }
}

export function resetWebVitalsForTests() {
  initialized = false;
}
