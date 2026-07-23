import assert from 'node:assert/strict';
import test from 'node:test';
import {
  bookingEmbedUrl,
  bookingOfferDurations,
  bookingSchedule,
  bookingPageUrl,
  getBookingOfferCopy,
  getBookingOfferSuppression,
  getBookingRouteType,
  getBookingTriggerConfig,
  shouldTriggerBookingOffer
} from '../src/lib/bookingOffer.js';

test('link booking menggunakan URL HTTPS Google yang telah disetujui', () => {
  assert.equal(bookingPageUrl, 'https://calendar.app.google/uFMcEBMzzNfDbx2LA');
  assert.match(bookingEmbedUrl, /^https:\/\/calendar\.google\.com\/calendar\/appointments\/schedules\//);
  assert.match(bookingEmbedUrl, /[?&]gv=true(?:&|$)/);
});

test('booking hanya aktif pada halaman dengan intent relevan', () => {
  assert.equal(getBookingRouteType('/'), 'home');
  assert.equal(getBookingRouteType('/portfolio'), 'portfolio');
  assert.equal(getBookingRouteType('/solusi/company-profile'), 'solution');
  assert.equal(getBookingRouteType('/hasil/shinyoung-beauty'), 'caseStudy');
  assert.equal(getBookingRouteType('/konsultasi'), null);
  assert.equal(getBookingRouteType('/privasi'), null);
  assert.equal(getBookingRouteType('/terima-kasih'), null);
});

test('copy booking mencakup bisnis baru maupun website existing', () => {
  const homeCopy = getBookingOfferCopy('/');
  assert.match(homeCopy.body, /belum memiliki website/i);
  assert.match(homeCopy.body, /mengembangkan yang sudah ada/i);
  assert.match(getBookingOfferCopy('/portfolio').headline, /ingin diwujudkan/i);
  assert.match(getBookingOfferCopy('/solusi/website-custom').headline, /paling sesuai/i);
});

test('jadwal final konsisten dengan keputusan bisnis', () => {
  assert.deepEqual(bookingSchedule, {
    daysLabel: 'Sabtu & Minggu',
    hoursLabel: '09.00–00.00 WIB',
    durationMinutes: 30,
    minimumNoticeHours: 24,
    maximumPerDay: 5
  });
});

test('trigger desktop menggunakan waktu atau scroll, mobile membutuhkan keduanya', () => {
  assert.equal(shouldTriggerBookingOffer({
    isMobile: false,
    dwellReached: true,
    scrollReached: false
  }), true);
  assert.equal(shouldTriggerBookingOffer({
    isMobile: true,
    dwellReached: true,
    scrollReached: false
  }), false);
  assert.equal(shouldTriggerBookingOffer({
    isMobile: true,
    dwellReached: true,
    scrollReached: true
  }), true);
  assert.equal(shouldTriggerBookingOffer({
    isMobile: false,
    dwellReached: false,
    scrollReached: false,
    exitIntent: true
  }), true);
  assert.equal(shouldTriggerBookingOffer({
    isMobile: true,
    dwellReached: false,
    scrollReached: false,
    exitIntent: true
  }), false);
});

test('setiap tipe halaman memiliki threshold trigger yang valid', () => {
  for (const path of ['/', '/portfolio', '/solusi/company-profile', '/hasil/wijaya-inovasi']) {
    const config = getBookingTriggerConfig(path);
    assert.ok(config.dwellMs >= 15_000);
    assert.ok(config.scrollProgress >= 0.5 && config.scrollProgress <= 0.75);
  }
  assert.equal(getBookingTriggerConfig('/privasi'), null);
});

test('suppression mengikuti session, penutupan tujuh hari, dan pembukaan kalender empat belas hari', () => {
  const now = 1_800_000_000_000;
  assert.equal(getBookingOfferSuppression({ now, shownThisSession: true }), 'session');
  assert.equal(getBookingOfferSuppression({
    now,
    dismissedAt: now - bookingOfferDurations.dismissalSuppressionMs + 1
  }), 'dismissed');
  assert.equal(getBookingOfferSuppression({
    now,
    dismissedAt: now - bookingOfferDurations.dismissalSuppressionMs
  }), '');
  assert.equal(getBookingOfferSuppression({
    now,
    schedulerOpenedAt: now - bookingOfferDurations.schedulerSuppressionMs + 1
  }), 'scheduler-opened');
  assert.equal(getBookingOfferSuppression({
    now,
    schedulerOpenedAt: now - bookingOfferDurations.schedulerSuppressionMs
  }), '');
});
