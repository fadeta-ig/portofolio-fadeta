<script setup>
import NavBar from './components/NavBar.vue';
import CookieConsent from './components/CookieConsent.vue';
import { useSeo } from './composables/useSeo';

useSeo();
</script>

<template>
  <div class="min-h-screen bg-bg-primary text-text-primary font-sans flex flex-col relative w-full overflow-x-hidden theme-transition">
    <NavBar />
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
    <CookieConsent />
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
