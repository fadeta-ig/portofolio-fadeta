<script setup>
import { defineAsyncComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from './components/NavBar.vue';
import CookieConsent from './components/CookieConsent.vue';
import { useSeo } from './composables/useSeo';

useSeo();

const route = useRoute();
const pendingRouteFocus = ref(false);
const bookingOfferReady = ref(false);
const BookingOffer = defineAsyncComponent(() => import('./components/BookingOffer.vue'));
let bookingIdleHandle;
let bookingFallbackTimer;

watch(() => route.path, (path, previousPath) => {
  if (!previousPath || path === previousPath) return;
  pendingRouteFocus.value = true;
});

function focusMainContent() {
  if (!pendingRouteFocus.value) return;
  pendingRouteFocus.value = false;
  document.getElementById('main-content')?.focus({ preventScroll: true });
}

onMounted(() => {
  if ('requestIdleCallback' in window) {
    bookingIdleHandle = window.requestIdleCallback(() => {
      bookingOfferReady.value = true;
    }, { timeout: 2_500 });
    return;
  }

  bookingFallbackTimer = window.setTimeout(() => {
    bookingOfferReady.value = true;
  }, 1_500);
});

onBeforeUnmount(() => {
  if (bookingIdleHandle !== undefined && 'cancelIdleCallback' in window) {
    window.cancelIdleCallback(bookingIdleHandle);
  }
  window.clearTimeout(bookingFallbackTimer);
});
</script>

<template>
  <div class="min-h-screen bg-bg-primary text-text-primary font-sans flex flex-col relative w-full overflow-x-hidden theme-transition">
    <a href="#main-content" class="skip-link">Lewati ke konten utama</a>
    <NavBar />
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in" @after-enter="focusMainContent">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
    <CookieConsent />
    <BookingOffer v-if="bookingOfferReady" />
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
