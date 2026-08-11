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
  headline: 'Ingin Memperbaiki Tampilan & Efektivitas Website Bisnis Anda?',
  body: 'Mari jadwalkan diskusi 30 menit gratis. Kita bedah kebutuhan website Anda dan tentukan langkah awal yang paling tepat tanpa kewajiban apa pun.'
});

const routeCopy = Object.freeze({
  solution: {
    kicker: 'Konsultasi gratis · 30 menit',
    headline: 'Belum Yakin Bentuk Website Mana yang Paling Cocok?',
    body: 'Diskusikan kebutuhan produk Anda dalam sesi singkat 30 menit. Kita pilihkan solusi dan estimasi biaya yang paling masuk akal.'
  },
  portfolio: {
    kicker: 'Konsultasi gratis · 30 menit',
    headline: 'Ingin Membuat Website dengan Standar Kualitas Seperti Ini?',
    body: 'Mari bahas konsep, kebutuhan fitur, dan jadwal pengerjaan yang sesuai dengan target bisnis Anda.'
  },
  caseStudy: {
    kicker: 'Konsultasi gratis · 30 menit',
    headline: 'Punya Tantangan Bisnis yang Serupa?',
    body: 'Mari bedah titik hambatan bisnis Anda dan tentukan alur website yang tepat untuk mempermudah penjualan.'
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
