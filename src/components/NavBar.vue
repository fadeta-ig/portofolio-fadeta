<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { Menu, MessageCircle, Moon, Sun, X } from '@lucide/vue';
import gsap from 'gsap';
import LogoMark from './LogoMark.vue';
import { useTheme } from '../composables/useTheme';

const { isDark, toggleTheme } = useTheme();

const navRef = ref(null);
const isMobileMenuOpen = ref(false);
let ctx;

const whatsapp = '6281553821808';
const whatsappMessage = encodeURIComponent('Halo Gandiva Labs, saya ingin konsultasi tentang pembuatan website.');
const whatsappLink = `https://wa.me/${whatsapp}?text=${whatsappMessage}`;

const navItems = [
  { label: 'Layanan', id: 'services' },
  { label: 'Karya', id: 'work' },
  { label: 'Proses', id: 'process' },
  { label: 'Tentang', id: 'studio' },
  { label: 'FAQ', id: 'faq' }
];

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  isMobileMenuOpen.value = false;
}

function handleEscape(event) {
  if (event.key === 'Escape') isMobileMenuOpen.value = false;
}

watch(isMobileMenuOpen, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

onMounted(() => {
  window.addEventListener('keydown', handleEscape);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  ctx = gsap.context(() => {
    gsap.from(navRef.value, {
      y: -18,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out'
    });
  }, navRef.value);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscape);
  document.body.style.overflow = '';
  ctx?.revert();
});
</script>

<template>
  <header ref="navRef" class="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5">
    <nav class="glass-panel mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl px-4 md:px-5" aria-label="Navigasi utama">
      <a href="#hero" class="flex items-center gap-2.5 rounded-xl" aria-label="Gandiva Labs — kembali ke atas" @click.prevent="scrollTo('hero')">
        <LogoMark :size="35" />
        <span class="text-[15px] font-bold tracking-[-0.025em] text-text-primary">Gandiva Labs</span>
      </a>

      <div class="hidden items-center gap-7 lg:flex">
        <a
          v-for="item in navItems"
          :key="item.id"
          :href="`#${item.id}`"
          class="py-3 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
          @click.prevent="scrollTo(item.id)"
        >
          {{ item.label }}
        </a>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="flex h-11 w-11 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-bg-secondary hover:text-text-primary"
          :aria-label="isDark ? 'Gunakan tema terang' : 'Gunakan tema gelap'"
          @click="toggleTheme"
        >
          <Sun v-if="isDark" class="h-[18px] w-[18px]" />
          <Moon v-else class="h-[18px] w-[18px]" />
        </button>

        <a
          :href="whatsappLink"
          target="_blank"
          rel="noopener noreferrer"
          data-track="nav_whatsapp"
          class="hidden min-h-11 items-center gap-2 rounded-full bg-text-primary px-5 text-sm font-bold text-bg-primary transition-transform hover:-translate-y-0.5 sm:inline-flex"
        >
          <MessageCircle class="h-4 w-4" />
          Konsultasi
        </a>

        <button
          type="button"
          class="flex h-11 w-11 items-center justify-center rounded-full text-text-primary transition-colors hover:bg-bg-secondary lg:hidden"
          :aria-label="isMobileMenuOpen ? 'Tutup menu' : 'Buka menu'"
          :aria-expanded="isMobileMenuOpen"
          aria-controls="mobile-menu"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <X v-if="isMobileMenuOpen" class="h-5 w-5" />
          <Menu v-else class="h-5 w-5" />
        </button>
      </div>
    </nav>
  </header>

  <Teleport to="body">
    <Transition name="menu-fade">
      <button
        v-if="isMobileMenuOpen"
        type="button"
        class="scrim fixed inset-0 z-40 cursor-default lg:hidden"
        aria-label="Tutup menu"
        @click="isMobileMenuOpen = false"
      />
    </Transition>

    <Transition name="menu-slide">
      <aside
        v-if="isMobileMenuOpen"
        id="mobile-menu"
        class="fixed inset-y-0 right-0 z-50 flex w-[min(21rem,88vw)] flex-col border-l border-border-default bg-bg-card p-5 shadow-2xl lg:hidden"
      >
        <div class="flex items-center justify-between border-b border-border-default pb-5">
          <div class="flex items-center gap-3">
            <LogoMark :size="38" />
            <span class="font-bold text-text-primary">Gandiva Labs</span>
          </div>
          <button type="button" class="flex h-11 w-11 items-center justify-center rounded-full hover:bg-bg-secondary" aria-label="Tutup menu" @click="isMobileMenuOpen = false">
            <X class="h-5 w-5" />
          </button>
        </div>

        <div class="flex flex-1 flex-col gap-1 py-6">
          <a
            v-for="item in navItems"
            :key="item.id"
            :href="`#${item.id}`"
            class="rounded-xl px-4 py-3 text-lg font-medium text-text-primary hover:bg-bg-secondary"
            @click.prevent="scrollTo(item.id)"
          >
            {{ item.label }}
          </a>
        </div>

        <a
          :href="whatsappLink"
          target="_blank"
          rel="noopener noreferrer"
          data-track="mobile_menu_whatsapp"
          class="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-text-primary px-5 text-sm font-bold text-bg-primary"
        >
          <MessageCircle class="h-4 w-4" />
          Ceritakan kebutuhan Anda
        </a>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
.menu-fade-enter-active,
.menu-fade-leave-active,
.menu-slide-enter-active,
.menu-slide-leave-active {
  transition: all 0.28s ease;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
}

.menu-slide-enter-from,
.menu-slide-leave-to {
  transform: translateX(100%);
}
</style>
