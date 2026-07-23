export const bookingPageUrl = 'https://calendar.app.google/uFMcEBMzzNfDbx2LA';
export const bookingEmbedUrl = 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ1sNYzpphav2Surmq-FORkiQlhEu3URSyhXNv9pwUgc93NcUZlenTbmvuD-ohsyhN1enaH8L7a_?gv=true';
export const overlayStateEvent = 'gandiva:overlay-state-changed';
export const bookingSchedule = Object.freeze({
  daysLabel: 'Sabtu & Minggu',
  hoursLabel: '09.00–00.00 WIB',
  durationMinutes: 30,
  minimumNoticeHours: 24,
  maximumPerDay: 5
});

export const bookingOfferStorageKeys = Object.freeze({
  dismissedAt: 'gandiva.booking-offer.dismissed-at.v1',
  schedulerOpenedAt: 'gandiva.booking-offer.scheduler-opened-at.v1',
  shownThisSession: 'gandiva.booking-offer.shown-this-session.v1'
});

export const bookingOfferDurations = Object.freeze({
  dismissalSuppressionMs: 7 * 24 * 60 * 60 * 1000,
  schedulerSuppressionMs: 14 * 24 * 60 * 60 * 1000
});

const routeConfigs = Object.freeze({
  home: {
    dwellMs: 45_000,
    scrollProgress: 0.65,
    mobileRequiresBoth: true
  },
  solution: {
    dwellMs: 25_000,
    scrollProgress: 0.5,
    mobileRequiresBoth: true
  },
  caseStudy: {
    dwellMs: 30_000,
    scrollProgress: 0.55,
    mobileRequiresBoth: true
  },
  portfolio: {
    dwellMs: 35_000,
    scrollProgress: 0.55,
    mobileRequiresBoth: true
  }
});

const defaultCopy = Object.freeze({
  kicker: 'Konsultasi gratis · 30 menit',
  headline: 'Punya rencana untuk website bisnis Anda? Mari mulai dari percakapan yang tepat.',
  body: 'Baik Anda belum memiliki website maupun ingin mengembangkan yang sudah ada, Gandiva Labs siap membantu memetakan kebutuhan, prioritas, dan langkah awal yang paling masuk akal.'
});

const routeCopy = Object.freeze({
  solution: {
    kicker: 'Konsultasi gratis · 30 menit',
    headline: 'Belum yakin bentuk website mana yang paling sesuai untuk bisnis Anda?',
    body: 'Ceritakan kebutuhan Anda dalam sesi singkat bersama Gandiva Labs. Kita akan melihat tujuan, konteks bisnis, dan bentuk website yang paling relevan.'
  },
  portfolio: {
    kicker: 'Konsultasi gratis · 30 menit',
    headline: 'Punya gambaran website yang ingin diwujudkan?',
    body: 'Mari bahas arah, kebutuhan, dan pendekatan yang sesuai untuk bisnis Anda dalam konsultasi gratis selama 30 menit.'
  },
  caseStudy: {
    kicker: 'Konsultasi gratis · 30 menit',
    headline: 'Ingin membahas kemungkinan yang sesuai untuk bisnis Anda?',
    body: 'Setiap bisnis memiliki kebutuhan yang berbeda. Mari lihat pendekatan yang paling masuk akal untuk konteks Anda.'
  }
});

export function getBookingRouteType(path) {
  if (path === '/') return 'home';
  if (path === '/portfolio') return 'portfolio';
  if (path.startsWith('/solusi/')) return 'solution';
  if (path.startsWith('/hasil/')) return 'caseStudy';
  return null;
}

export function getBookingTriggerConfig(path) {
  const routeType = getBookingRouteType(path);
  return routeType ? routeConfigs[routeType] : null;
}

export function getBookingOfferCopy(path) {
  const routeType = getBookingRouteType(path);
  return routeCopy[routeType] ?? defaultCopy;
}

export function getBookingOfferSuppression({
  now = Date.now(),
  dismissedAt = 0,
  schedulerOpenedAt = 0,
  shownThisSession = false
} = {}) {
  if (shownThisSession) return 'session';
  if (schedulerOpenedAt > 0 && now - schedulerOpenedAt < bookingOfferDurations.schedulerSuppressionMs) {
    return 'scheduler-opened';
  }
  if (dismissedAt > 0 && now - dismissedAt < bookingOfferDurations.dismissalSuppressionMs) {
    return 'dismissed';
  }
  return '';
}

export function shouldTriggerBookingOffer({
  isMobile,
  dwellReached,
  scrollReached,
  exitIntent = false
}) {
  if (exitIntent && !isMobile) return true;
  return isMobile
    ? dwellReached && scrollReached
    : dwellReached || scrollReached;
}
