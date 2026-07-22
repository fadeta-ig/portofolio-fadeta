<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { Cookie, X } from '@lucide/vue';
import {
  cookieSettingsEvent,
  getAnalyticsConsent,
  setAnalyticsConsent,
  trackPageView
} from '../lib/analytics';

const isVisible = ref(false);
const savedConsent = ref(null);
const acceptButtonRef = ref(null);
let revealTimer;
let previouslyFocusedElement;

function showSettings(shouldFocus = false) {
  savedConsent.value = getAnalyticsConsent();
  previouslyFocusedElement = shouldFocus ? document.activeElement : null;
  isVisible.value = true;

  if (shouldFocus) {
    nextTick(() => acceptButtonRef.value?.focus());
  }
}

function hideSettings(restoreFocus = false) {
  isVisible.value = false;

  if (restoreFocus && previouslyFocusedElement instanceof HTMLElement) {
    nextTick(() => previouslyFocusedElement.focus());
  }
}

function chooseAnalytics(allowed) {
  setAnalyticsConsent(allowed);
  savedConsent.value = allowed ? 'granted' : 'denied';

  if (allowed) {
    trackPageView(
      `${window.location.pathname}${window.location.search}${window.location.hash}`,
      document.title || 'Gandiva Labs'
    );
  }

  hideSettings(Boolean(previouslyFocusedElement));
}

function handleOpenSettings() {
  showSettings(true);
}

onMounted(() => {
  savedConsent.value = getAnalyticsConsent();

  if (savedConsent.value === null) {
    revealTimer = window.setTimeout(() => showSettings(false), 650);
  }

  window.addEventListener(cookieSettingsEvent, handleOpenSettings);
});

onBeforeUnmount(() => {
  window.clearTimeout(revealTimer);
  window.removeEventListener(cookieSettingsEvent, handleOpenSettings);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="cookie-banner">
      <section v-if="isVisible" class="pointer-events-none fixed inset-x-0 bottom-0 z-[100] p-3 sm:p-5" aria-labelledby="cookie-consent-title">
        <div class="pointer-events-auto relative mx-auto max-w-5xl overflow-hidden rounded-[1.5rem] border border-border-default bg-bg-elevated/95 shadow-[var(--shadow-lg)] backdrop-blur-xl">
          <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" aria-hidden="true" />

          <div class="grid gap-5 p-5 sm:p-6 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center md:gap-6">
            <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-subtle text-accent" aria-hidden="true">
              <Cookie class="h-5 w-5" stroke-width="1.7" />
            </div>

            <div class="min-w-0" :class="savedConsent ? 'pr-10 md:pr-0' : ''">
              <div class="flex flex-wrap items-center gap-2">
                <h2 id="cookie-consent-title" class="text-lg font-bold tracking-[-0.025em] text-text-primary">Pilihan privasi Anda</h2>
                <span v-if="savedConsent" class="rounded-full border border-border-default bg-bg-secondary px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-text-tertiary">
                  Analytics {{ savedConsent === 'granted' ? 'aktif' : 'nonaktif' }}
                </span>
              </div>
              <p class="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
                Kami menggunakan Google Analytics untuk memahami halaman dan tombol yang paling berguna. Analytics tetap nonaktif sampai Anda mengizinkannya.
              </p>
              <RouterLink to="/privasi" class="mt-2 inline-flex text-xs font-bold text-text-tertiary underline decoration-border-default underline-offset-4 transition-colors hover:text-accent">Baca informasi privasi</RouterLink>
            </div>

            <div class="flex flex-col-reverse gap-2 sm:flex-row md:flex-col-reverse lg:flex-row" :class="savedConsent ? 'md:mr-8' : ''">
              <button type="button" class="inline-flex min-h-11 items-center justify-center rounded-full border border-border-default px-5 text-xs font-bold text-text-primary transition-colors hover:border-text-tertiary hover:bg-bg-secondary" @click="chooseAnalytics(false)">
                Tolak analytics
              </button>
              <button ref="acceptButtonRef" type="button" class="inline-flex min-h-11 items-center justify-center rounded-full bg-text-primary px-5 text-xs font-bold text-bg-primary transition-transform hover:-translate-y-0.5" @click="chooseAnalytics(true)">
                Izinkan analytics
              </button>
            </div>
          </div>

          <button
            v-if="savedConsent"
            type="button"
            class="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-text-tertiary transition-colors hover:bg-bg-secondary hover:text-text-primary"
            aria-label="Tutup pengaturan cookie"
            @click="hideSettings(true)"
          >
            <X class="h-4 w-4" />
          </button>
        </div>
      </section>
    </Transition>
  </Teleport>
</template>

<style scoped>
.cookie-banner-enter-active,
.cookie-banner-leave-active {
  transition:
    opacity 0.28s ease,
    transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.cookie-banner-enter-from,
.cookie-banner-leave-to {
  opacity: 0;
  transform: translateY(1.25rem);
}

@media (prefers-reduced-motion: reduce) {
  .cookie-banner-enter-active,
  .cookie-banner-leave-active {
    transition: none;
  }
}
</style>
