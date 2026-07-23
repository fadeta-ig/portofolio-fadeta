<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock3,
  LoaderCircle,
  X
} from '@lucide/vue';
import { trackEvent } from '../lib/analytics';
import {
  bookingEmbedUrl,
  bookingSchedule,
  bookingOfferStorageKeys,
  bookingPageUrl,
  getBookingOfferCopy,
  getBookingOfferSuppression,
  getBookingRouteType,
  getBookingTriggerConfig,
  overlayStateEvent,
  shouldTriggerBookingOffer
} from '../lib/bookingOffer';

const route = useRoute();
const isOpen = ref(false);
const stage = ref('offer');
const iframeLoaded = ref(false);
const showSlowMessage = ref(false);
const dialogRef = ref(null);
const closeButtonRef = ref(null);
const primaryButtonRef = ref(null);
const schedulerHeadingRef = ref(null);
const copy = computed(() => getBookingOfferCopy(route.path));
const dialogTitleId = computed(() => stage.value === 'offer' ? 'booking-offer-title' : 'booking-scheduler-title');
const dialogDescriptionId = computed(() => stage.value === 'offer' ? 'booking-offer-description' : 'booking-scheduler-description');

let triggerConfig = null;
let pageStartedAt = 0;
let dwellReached = false;
let scrollReached = false;
let triggerPending = false;
let hasShownInMemory = false;
let dwellTimer;
let retryTimer;
let iframeTimer;
let previouslyFocusedElement;
let previousBodyOverflow = '';

function getStorage(type) {
  try {
    return window[type];
  } catch {
    return null;
  }
}

function readTimestamp(storage, key) {
  const value = Number(storage?.getItem(key));
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function writeStorage(storage, key, value) {
  try {
    storage?.setItem(key, String(value));
  } catch {
    // In-memory state still prevents the offer from repeating in this visit.
  }
}

function isSuppressed() {
  const localStorage = getStorage('localStorage');
  const sessionStorage = getStorage('sessionStorage');
  return Boolean(getBookingOfferSuppression({
    dismissedAt: readTimestamp(localStorage, bookingOfferStorageKeys.dismissedAt),
    schedulerOpenedAt: readTimestamp(localStorage, bookingOfferStorageKeys.schedulerOpenedAt),
    shownThisSession: hasShownInMemory || sessionStorage?.getItem(bookingOfferStorageKeys.shownThisSession) === '1'
  }));
}

function clearTriggerTimers() {
  window.clearTimeout(dwellTimer);
  window.clearTimeout(retryTimer);
}

function scheduleRetry() {
  window.clearTimeout(retryTimer);
  retryTimer = window.setTimeout(() => {
    if (triggerPending) attemptOpen();
  }, 3_000);
}

function isAnotherOverlayOpen() {
  return Boolean(document.querySelector('[data-blocks-marketing-overlay]'));
}

function isEditingField() {
  const activeElement = document.activeElement;
  return activeElement instanceof HTMLElement
    && (activeElement.matches('input, select, textarea, [contenteditable="true"]'));
}

function openOffer() {
  if (isOpen.value || hasShownInMemory || isSuppressed()) return;

  hasShownInMemory = true;
  triggerPending = false;
  stage.value = 'offer';
  isOpen.value = true;
  writeStorage(getStorage('sessionStorage'), bookingOfferStorageKeys.shownThisSession, '1');
  clearTriggerTimers();

  trackEvent('booking_offer_view', {
    page_path: route.path,
    route_type: getBookingRouteType(route.path)
  });
}

function attemptOpen() {
  if (!triggerConfig || isOpen.value || hasShownInMemory || isSuppressed()) return;

  if (document.visibilityState !== 'visible' || isAnotherOverlayOpen() || isEditingField()) {
    triggerPending = true;
    scheduleRetry();
    return;
  }

  openOffer();
}

function evaluateTrigger({ exitIntent = false } = {}) {
  if (!triggerConfig) return;
  const isMobile = window.matchMedia('(max-width: 767px)').matches;
  if (shouldTriggerBookingOffer({ isMobile, dwellReached, scrollReached, exitIntent })) {
    attemptOpen();
  }
}

function handleScroll() {
  if (!triggerConfig || hasShownInMemory) return;
  const documentHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
  const progress = documentHeight > 0
    ? (window.scrollY + window.innerHeight) / documentHeight
    : 0;

  if (progress >= triggerConfig.scrollProgress) {
    scrollReached = true;
    evaluateTrigger();
  }
}

function handleExitIntent(event) {
  if (!triggerConfig || hasShownInMemory || window.matchMedia('(max-width: 767px)').matches) return;
  if (Date.now() - pageStartedAt < 15_000) return;
  if (event.clientY <= 0 && !event.relatedTarget) evaluateTrigger({ exitIntent: true });
}

function handleOverlayStateChange() {
  if (triggerPending && !isAnotherOverlayOpen()) attemptOpen();
}

function setupTrigger() {
  clearTriggerTimers();
  triggerConfig = getBookingTriggerConfig(route.path);
  pageStartedAt = Date.now();
  dwellReached = false;
  scrollReached = false;
  triggerPending = false;

  if (!triggerConfig || hasShownInMemory || isSuppressed()) return;

  dwellTimer = window.setTimeout(() => {
    dwellReached = true;
    evaluateTrigger();
  }, triggerConfig.dwellMs);

  handleScroll();
}

function closeDialog(source = 'close-button', { recordDismissal = true } = {}) {
  if (!isOpen.value) return;

  if (recordDismissal && stage.value === 'offer') {
    writeStorage(getStorage('localStorage'), bookingOfferStorageKeys.dismissedAt, Date.now());
  }

  if (recordDismissal) {
    trackEvent('booking_offer_dismiss', {
      page_path: route.path,
      route_type: getBookingRouteType(route.path),
      stage: stage.value,
      dismiss_source: source
    });
  }

  isOpen.value = false;
  window.clearTimeout(iframeTimer);
}

async function openScheduler() {
  stage.value = 'scheduler';
  iframeLoaded.value = false;
  showSlowMessage.value = false;
  writeStorage(getStorage('localStorage'), bookingOfferStorageKeys.schedulerOpenedAt, Date.now());

  trackEvent('booking_scheduler_open', {
    page_path: route.path,
    route_type: getBookingRouteType(route.path),
    provider: 'google_calendar'
  });

  window.clearTimeout(iframeTimer);
  iframeTimer = window.setTimeout(() => {
    if (!iframeLoaded.value) showSlowMessage.value = true;
  }, 10_000);

  await nextTick();
  schedulerHeadingRef.value?.focus();
}

async function returnToOffer() {
  stage.value = 'offer';
  window.clearTimeout(iframeTimer);
  await nextTick();
  primaryButtonRef.value?.focus();
}

function handleIframeLoad() {
  iframeLoaded.value = true;
  showSlowMessage.value = false;
  window.clearTimeout(iframeTimer);
  trackEvent('booking_scheduler_loaded', {
    page_path: route.path,
    provider: 'google_calendar'
  });
}

function handleFallbackClick() {
  writeStorage(getStorage('localStorage'), bookingOfferStorageKeys.schedulerOpenedAt, Date.now());
  trackEvent('booking_fallback_click', {
    page_path: route.path,
    provider: 'google_calendar'
  });
}

function handleDialogKeydown(event) {
  if (event.key === 'Escape') {
    event.preventDefault();
    closeDialog('escape');
    return;
  }
  if (event.key !== 'Tab' || !dialogRef.value) return;

  const focusable = [...dialogRef.value.querySelectorAll(
    'a[href], button:not([disabled]), iframe, input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )].filter((element) => element.getClientRects().length > 0 && element.getAttribute('aria-hidden') !== 'true');

  if (!focusable.length) {
    event.preventDefault();
    dialogRef.value.focus();
    return;
  }

  const first = focusable[0];
  const last = focusable.at(-1);
  if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.value)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

watch(isOpen, async (open) => {
  const appRoot = document.getElementById('app');

  if (open) {
    previouslyFocusedElement = document.activeElement;
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    await nextTick();
    dialogRef.value?.focus();
    if (appRoot) appRoot.inert = true;
    return;
  }

  if (appRoot) appRoot.inert = false;
  document.body.style.overflow = previousBodyOverflow;
  await nextTick();
  if (previouslyFocusedElement?.isConnected && previouslyFocusedElement !== document.body) {
    previouslyFocusedElement.focus();
  }
});

watch(() => route.path, async () => {
  closeDialog('route-change', { recordDismissal: false });
  await nextTick();
  window.requestAnimationFrame(setupTrigger);
});

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  document.addEventListener('mouseout', handleExitIntent);
  window.addEventListener(overlayStateEvent, handleOverlayStateChange);
  setupTrigger();
});

onBeforeUnmount(() => {
  clearTriggerTimers();
  window.clearTimeout(iframeTimer);
  window.removeEventListener('scroll', handleScroll);
  document.removeEventListener('mouseout', handleExitIntent);
  window.removeEventListener(overlayStateEvent, handleOverlayStateChange);
  document.getElementById('app')?.removeAttribute('inert');
  document.body.style.overflow = previousBodyOverflow;
});
</script>

<template>
  <Teleport to="body">
    <Transition name="booking-backdrop">
      <div
        v-if="isOpen"
        class="booking-backdrop fixed inset-0 z-[110]"
        aria-hidden="true"
        @click="closeDialog('backdrop')"
      />
    </Transition>

    <Transition name="booking-dialog">
      <section
        v-if="isOpen"
        ref="dialogRef"
        class="booking-dialog"
        :class="{ 'booking-dialog-scheduler': stage === 'scheduler' }"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="dialogTitleId"
        :aria-describedby="dialogDescriptionId"
        tabindex="-1"
        @keydown="handleDialogKeydown"
      >
        <template v-if="stage === 'offer'">
          <div class="booking-glow" aria-hidden="true" />
          <button
            ref="closeButtonRef"
            type="button"
            class="booking-close"
            aria-label="Tutup penawaran konsultasi"
            @click="closeDialog('close-button')"
          >
            <X />
          </button>

          <div class="booking-offer-grid">
            <div class="booking-offer-copy">
              <p class="booking-kicker">
                <span aria-hidden="true" />
                {{ copy.kicker }}
              </p>
              <h2 id="booking-offer-title">{{ copy.headline }}</h2>
              <p id="booking-offer-description" class="booking-description">
                {{ copy.body }} Gratis dan tanpa kewajiban lanjut.
              </p>

              <div class="booking-availability">
                <span><CalendarDays aria-hidden="true" /> {{ bookingSchedule.daysLabel }}</span>
                <span><Clock3 aria-hidden="true" /> {{ bookingSchedule.hoursLabel }}</span>
              </div>

              <button ref="primaryButtonRef" type="button" class="booking-primary group" @click="openScheduler">
                Lihat jadwal yang tersedia
                <ArrowRight aria-hidden="true" />
              </button>
              <button type="button" class="booking-later" @click="closeDialog('later-button')">Nanti saja</button>

              <p class="booking-trust">
                {{ bookingSchedule.durationMinutes }} menit <span aria-hidden="true">·</span> Google Meet
                <span aria-hidden="true">·</span> Booking min. {{ bookingSchedule.minimumNoticeHours }} jam sebelumnya
                <span aria-hidden="true">·</span> Maks. {{ bookingSchedule.maximumPerDay }} sesi per hari
              </p>
            </div>

            <aside class="booking-value-panel" aria-label="Yang akan dibahas">
              <div>
                <p class="booking-panel-label">Sesi singkat, arah lebih jelas</p>
                <h3>Mulai dari kebutuhan bisnis, bukan istilah teknis.</h3>
              </div>
              <ul>
                <li><span><Check aria-hidden="true" /></span> Pahami kebutuhan utama</li>
                <li><span><Check aria-hidden="true" /></span> Tentukan prioritas yang tepat</li>
                <li><span><Check aria-hidden="true" /></span> Susun langkah awal</li>
              </ul>
            </aside>
          </div>
        </template>

        <template v-else>
          <header class="booking-scheduler-header">
            <button type="button" class="booking-icon-button" aria-label="Kembali ke penawaran" @click="returnToOffer">
              <ArrowLeft />
            </button>
            <div class="min-w-0 flex-1">
              <p class="booking-scheduler-eyebrow">Gandiva Labs · Konsultasi gratis</p>
              <h2 id="booking-scheduler-title" ref="schedulerHeadingRef" tabindex="-1">Pilih waktu yang nyaman</h2>
              <p id="booking-scheduler-description">
                {{ bookingSchedule.daysLabel }}, {{ bookingSchedule.hoursLabel }}
                · Min. {{ bookingSchedule.minimumNoticeHours }} jam sebelumnya
                · Maks. {{ bookingSchedule.maximumPerDay }} sesi per hari
              </p>
            </div>
            <a
              :href="bookingPageUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="booking-external"
              @click="handleFallbackClick"
            >
              <span>Buka terpisah</span>
              <ArrowUpRight aria-hidden="true" />
            </a>
            <button type="button" class="booking-icon-button" aria-label="Tutup kalender konsultasi" @click="closeDialog('close-button')">
              <X />
            </button>
          </header>

          <div class="booking-frame-shell">
            <div v-if="!iframeLoaded" class="booking-loading" role="status" aria-live="polite">
              <LoaderCircle aria-hidden="true" />
              <span>Menyiapkan jadwal yang tersedia…</span>
            </div>

            <iframe
              :src="bookingEmbedUrl"
              title="Kalender booking konsultasi gratis Gandiva Labs"
              loading="lazy"
              referrerpolicy="strict-origin-when-cross-origin"
              @load="handleIframeLoad"
            />

            <div v-if="showSlowMessage" class="booking-slow-message" role="status">
              <p>Kalender membutuhkan waktu lebih lama dari biasanya.</p>
              <a :href="bookingPageUrl" target="_blank" rel="noopener noreferrer" @click="handleFallbackClick">
                Buka halaman booking
                <ArrowUpRight aria-hidden="true" />
              </a>
            </div>
          </div>
        </template>
      </section>
    </Transition>
  </Teleport>
</template>

<style scoped>
.booking-backdrop {
  background: color-mix(in srgb, var(--overlay-scrim) 88%, transparent);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
}

.booking-dialog {
  position: fixed;
  right: 0.75rem;
  bottom: 0.75rem;
  left: 0.75rem;
  z-index: 120;
  max-height: calc(100dvh - 1.5rem);
  overflow: hidden;
  border: 1px solid var(--border-default);
  border-radius: 1.6rem;
  background: var(--bg-elevated);
  box-shadow: var(--shadow-lg);
  color: var(--text-primary);
  outline: none;
}

.booking-glow {
  position: absolute;
  top: -8rem;
  left: -5rem;
  width: 22rem;
  height: 18rem;
  border-radius: 999px;
  background: radial-gradient(circle, var(--accent-muted), transparent 68%);
  pointer-events: none;
}

.booking-close,
.booking-icon-button {
  display: inline-flex;
  min-width: 2.75rem;
  height: 2.75rem;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-default);
  border-radius: 999px;
  background: color-mix(in srgb, var(--bg-elevated) 88%, transparent);
  color: var(--text-secondary);
  transition: color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
}

.booking-close:hover,
.booking-icon-button:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
  transform: translateY(-1px);
}

.booking-close svg,
.booking-icon-button svg {
  width: 1.1rem;
  height: 1.1rem;
}

.booking-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 2;
}

.booking-offer-grid {
  position: relative;
  display: grid;
  max-height: calc(100dvh - 1.5rem);
  overflow-y: auto;
}

.booking-offer-copy {
  padding: 4.5rem 1.4rem 1.5rem;
}

.booking-kicker {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  margin: 0;
  color: var(--accent);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  line-height: 1;
  text-transform: uppercase;
}

.booking-kicker span {
  width: 0.42rem;
  height: 0.42rem;
  border-radius: 999px;
  background: var(--accent);
}

.booking-offer-copy h2 {
  max-width: 14ch;
  margin: 1rem 0 0;
  font-size: clamp(2rem, 9vw, 3rem);
  font-weight: 500;
  letter-spacing: -0.055em;
  line-height: 0.98;
  text-wrap: balance;
}

.booking-description {
  max-width: 37rem;
  margin: 1.15rem 0 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.65;
}

.booking-availability {
  display: flex;
  margin-top: 1.25rem;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.booking-availability span {
  display: inline-flex;
  min-height: 2rem;
  padding: 0.38rem 0.72rem;
  align-items: center;
  gap: 0.4rem;
  border: 1px solid var(--border-default);
  border-radius: 999px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: 0.68rem;
  font-weight: 700;
}

.booking-availability svg {
  width: 0.85rem;
  height: 0.85rem;
  color: var(--accent);
}

.booking-primary {
  display: flex;
  width: 100%;
  min-height: 3.35rem;
  margin-top: 1.4rem;
  padding: 0.75rem 1.2rem;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  border-radius: 999px;
  background: var(--text-primary);
  color: var(--bg-primary);
  font-size: 0.8rem;
  font-weight: 700;
  transition: transform 0.25s ease;
}

.booking-primary:hover {
  transform: translateY(-2px);
}

.booking-primary svg {
  width: 1rem;
  height: 1rem;
  transition: transform 0.25s ease;
}

.booking-primary:hover svg {
  transform: translateX(0.2rem);
}

.booking-later {
  display: block;
  margin: 0.8rem auto 0;
  padding: 0.35rem 0.65rem;
  color: var(--text-tertiary);
  font-size: 0.72rem;
  font-weight: 700;
  transition: color 0.2s ease;
}

.booking-later:hover {
  color: var(--text-primary);
}

.booking-trust {
  display: flex;
  margin: 0.8rem 0 0;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.35rem;
  color: var(--text-tertiary);
  font-size: 0.64rem;
  line-height: 1.5;
}

.booking-value-panel {
  display: none;
  padding: 2rem;
  flex-direction: column;
  justify-content: space-between;
  background:
    radial-gradient(circle at 90% 10%, rgba(238, 136, 89, 0.2), transparent 34%),
    #171511;
  color: #f5f0e7;
}

.booking-panel-label {
  margin: 0;
  color: #ee8859;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.booking-value-panel h3 {
  max-width: 12ch;
  margin: 0.9rem 0 0;
  font-size: 1.65rem;
  font-weight: 500;
  letter-spacing: -0.04em;
  line-height: 1.05;
}

.booking-value-panel ul {
  display: grid;
  margin: 2rem 0 0;
  gap: 0.8rem;
  color: #c8c0b5;
  font-size: 0.78rem;
  list-style: none;
}

.booking-value-panel li {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.booking-value-panel li span {
  display: inline-flex;
  width: 1.55rem;
  height: 1.55rem;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(245, 240, 231, 0.14);
  border-radius: 999px;
  color: #ee8859;
}

.booking-value-panel li svg {
  width: 0.8rem;
  height: 0.8rem;
  stroke-width: 2.5;
}

.booking-dialog-scheduler {
  top: 0.5rem;
  right: 0.5rem;
  bottom: 0.5rem;
  left: 0.5rem;
  display: flex;
  max-height: none;
  flex-direction: column;
  border-radius: 1.35rem;
}

.booking-scheduler-header {
  display: flex;
  padding: 0.75rem;
  align-items: center;
  gap: 0.65rem;
  border-bottom: 1px solid var(--border-default);
  background: color-mix(in srgb, var(--bg-elevated) 94%, transparent);
}

.booking-scheduler-eyebrow {
  margin: 0 0 0.1rem;
  overflow: hidden;
  color: var(--accent);
  font-size: 0.55rem;
  font-weight: 700;
  letter-spacing: 0.11em;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
}

.booking-scheduler-header h2 {
  margin: 0;
  overflow: hidden;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
  outline: none;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.booking-scheduler-header p:last-child {
  display: none;
  margin: 0.12rem 0 0;
  color: var(--text-tertiary);
  font-size: 0.65rem;
}

.booking-external {
  display: inline-flex;
  height: 2.75rem;
  padding: 0 0.75rem;
  align-items: center;
  gap: 0.35rem;
  border: 1px solid var(--border-default);
  border-radius: 999px;
  color: var(--text-secondary);
  font-size: 0.68rem;
  font-weight: 700;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.booking-external:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.booking-external span {
  display: none;
}

.booking-external svg {
  width: 1rem;
  height: 1rem;
}

.booking-frame-shell {
  position: relative;
  display: flex;
  min-height: 0;
  flex: 1;
  background: #fff;
}

.booking-frame-shell iframe {
  width: 100%;
  height: 100%;
  min-height: 40rem;
  border: 0;
  background: #fff;
}

.booking-loading {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  background: var(--bg-elevated);
  color: var(--text-secondary);
  font-size: 0.78rem;
}

.booking-loading svg {
  width: 1rem;
  height: 1rem;
  animation: booking-spin 0.8s linear infinite;
  color: var(--accent);
}

.booking-slow-message {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  left: 1rem;
  z-index: 2;
  padding: 0.9rem 1rem;
  border: 1px solid var(--border-default);
  border-radius: 1rem;
  background: var(--bg-elevated);
  box-shadow: var(--shadow-md);
  color: var(--text-secondary);
  font-size: 0.75rem;
}

.booking-slow-message p {
  margin: 0;
}

.booking-slow-message a {
  display: inline-flex;
  margin-top: 0.45rem;
  align-items: center;
  gap: 0.3rem;
  color: var(--text-primary);
  font-weight: 700;
}

.booking-slow-message svg {
  width: 0.9rem;
  height: 0.9rem;
}

.booking-backdrop-enter-active,
.booking-backdrop-leave-active {
  transition: opacity 0.25s ease;
}

.booking-dialog-enter-active,
.booking-dialog-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.booking-backdrop-enter-from,
.booking-backdrop-leave-to,
.booking-dialog-enter-from,
.booking-dialog-leave-to {
  opacity: 0;
}

.booking-dialog-enter-from,
.booking-dialog-leave-to {
  transform: translateY(1.25rem);
}

@keyframes booking-spin {
  to { transform: rotate(360deg); }
}

@media (min-width: 640px) {
  .booking-offer-copy {
    padding: 4.5rem 2rem 2rem;
  }

  .booking-primary {
    width: auto;
    padding-inline: 1.4rem;
  }

  .booking-later {
    display: inline-block;
    margin: 1rem 0 0 0.75rem;
  }

  .booking-trust {
    justify-content: flex-start;
  }

  .booking-scheduler-header {
    padding: 0.9rem 1rem;
  }

  .booking-scheduler-header p:last-child,
  .booking-external span {
    display: block;
  }
}

@media (min-width: 768px) {
  .booking-dialog {
    top: 50%;
    right: auto;
    bottom: auto;
    left: 50%;
    width: min(58rem, calc(100vw - 3rem));
    max-height: calc(100dvh - 3rem);
    border-radius: 1.8rem;
    transform: translate(-50%, -50%);
  }

  .booking-offer-grid {
    grid-template-columns: minmax(0, 1.45fr) minmax(16rem, 0.75fr);
    max-height: calc(100dvh - 3rem);
  }

  .booking-offer-copy {
    padding: 3.25rem;
  }

  .booking-offer-copy h2 {
    font-size: clamp(2.55rem, 4.5vw, 3.55rem);
  }

  .booking-value-panel {
    display: flex;
  }

  .booking-close {
    top: 1.15rem;
    right: 1.15rem;
    border-color: rgba(245, 240, 231, 0.16);
    background: rgba(23, 21, 17, 0.4);
    color: #f5f0e7;
  }

  .booking-close:hover {
    background: rgba(245, 240, 231, 0.12);
    color: #fff;
  }

  .booking-dialog-scheduler {
    width: min(72rem, calc(100vw - 3rem));
    height: min(50rem, calc(100dvh - 3rem));
    max-height: calc(100dvh - 3rem);
  }

  .booking-dialog-enter-from,
  .booking-dialog-leave-to {
    transform: translate(-50%, calc(-50% + 1rem)) scale(0.985);
  }
}

@media (prefers-reduced-motion: reduce) {
  .booking-backdrop-enter-active,
  .booking-backdrop-leave-active,
  .booking-dialog-enter-active,
  .booking-dialog-leave-active {
    transition: none;
  }

  .booking-loading svg {
    animation-duration: 1.6s;
  }
}
</style>
