import assert from 'node:assert/strict';
import test from 'node:test';
import { formatWebVital, webVitalsRelease } from '../src/lib/webVitals.js';

test('payload Web Vitals memiliki dimensi p75 yang dapat dianalisis tanpa teks pengguna', () => {
  const payload = formatWebVital({
    name: 'LCP',
    id: 'v5-123',
    value: 1820.42,
    delta: 1820.42,
    rating: 'good',
    navigationType: 'navigate',
    attribution: {
      lcpEntry: { element: 'h1.hero-title' },
      loadState: 'dom-content-loaded'
    }
  }, {
    pagePath: '/portfolio',
    viewport: 'mobile'
  });

  assert.deepEqual(payload, {
    value: 1820.42,
    metric_name: 'LCP',
    metric_id: 'v5-123',
    metric_value: 1820.42,
    metric_delta: 1820.42,
    metric_rating: 'good',
    navigation_type: 'navigate',
    page_path: '/portfolio',
    viewport_category: 'mobile',
    app_release: webVitalsRelease,
    debug_target: 'h1.hero-title',
    debug_type: 'dom-content-loaded'
  });
  assert.equal('text' in payload, false);
});

test('debug target Web Vitals dibatasi panjangnya', () => {
  const payload = formatWebVital({
    name: 'INP',
    id: 'v5-456',
    value: 160,
    delta: 160,
    rating: 'good',
    navigationType: 'navigate',
    attribution: { interactionTarget: 'a'.repeat(500), interactionType: 'pointer' }
  }, { pagePath: '/', viewport: 'desktop' });

  assert.equal(payload.debug_target.length, 160);
});
