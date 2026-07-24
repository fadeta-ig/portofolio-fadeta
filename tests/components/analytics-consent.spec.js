import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  analyticsConsentChangedEvent,
  analyticsConsentStorageKey,
  getAnalyticsConsent,
  hasAnalyticsConsent,
  initializeAnalytics,
  measurementId,
  resetAnalyticsStateForTests,
  setAnalyticsConsent,
  trackEvent
} from '../../src/lib/analytics';

describe('analytics consent', () => {
  beforeEach(() => {
    resetAnalyticsStateForTests();
    window.localStorage.clear();
    window.gtag = vi.fn();
  });

  it('memulai consent mode denied tanpa memuat Google Analytics', () => {
    initializeAnalytics();

    expect(window.gtag).toHaveBeenCalledWith('consent', 'default', expect.objectContaining({
      analytics_storage: 'denied',
      ad_storage: 'denied'
    }));
    expect(document.querySelector(`script[data-analytics-id="${measurementId}"]`)).toBeNull();
    expect(hasAnalyticsConsent()).toBe(false);
  });

  it('menyimpan consent, memuat script tepat sekali, dan mengirim event setelah granted', () => {
    const consentListener = vi.fn();
    window.addEventListener(analyticsConsentChangedEvent, consentListener, { once: true });
    initializeAnalytics();

    setAnalyticsConsent(true);
    setAnalyticsConsent(true);
    trackEvent('cta_click', { cta_id: 'hero_consultation' });

    expect(window.localStorage.getItem(analyticsConsentStorageKey)).toBe('granted');
    expect(getAnalyticsConsent()).toBe('granted');
    expect(document.querySelectorAll(`script[data-analytics-id="${measurementId}"]`)).toHaveLength(1);
    expect(window.gtag).toHaveBeenCalledWith('event', 'cta_click', {
      cta_id: 'hero_consultation'
    });
    expect(consentListener).toHaveBeenCalledTimes(1);
  });

  it('menghentikan event analytics ketika consent ditolak kembali', () => {
    initializeAnalytics();
    setAnalyticsConsent(true);
    setAnalyticsConsent(false);
    window.gtag.mockClear();

    trackEvent('cta_click', { cta_id: 'footer' });

    expect(getAnalyticsConsent()).toBe('denied');
    expect(window.gtag).not.toHaveBeenCalledWith('event', expect.anything(), expect.anything());
  });

  it('mempertahankan pilihan eksplisit selama sesi jika localStorage tidak tersedia', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage blocked', 'SecurityError');
    });
    initializeAnalytics();

    setAnalyticsConsent(true);
    trackEvent('page_view', { page_path: '/' });

    expect(hasAnalyticsConsent()).toBe(true);
    expect(window.gtag).toHaveBeenCalledWith('event', 'page_view', { page_path: '/' });
  });
});
