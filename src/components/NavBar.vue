<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { Menu, MessageCircle, Moon, Sun, X } from '@lucide/vue';
import { useRoute, useRouter } from 'vue-router';
import gsap from 'gsap';
import LogoMark from './LogoMark.vue';
import { useTheme } from '../composables/useTheme';
import { overlayStateEvent } from '../lib/bookingOffer';

const { isDark, toggleTheme } = useTheme();
const route = useRoute();
const router = useRouter();

const navRef = ref(null);
const brandLinkRef = ref(null);
const menuDialogRef = ref(null);
const closeMenuButtonRef = ref(null);
const isMobileMenuOpen = ref(false);
let ctx;
let previouslyFocusedElement = null;
let previousBodyOverflow = '';
let restoreFocusOnClose = true;

const navItems = [
  { label: 'Solusi', id: 'services' },
  { label: 'Hasil', path: '/portfolio' },
  { label: 'Cara kerja', id: 'process' },
  { label: 'Tentang', id: 'studio' }
];

function hrefFor(item) {
  return item.path ?? `/#${item.id}`;
}

async function navigateTo(item) {
  const isSamePageAnchor = !item.path && route.path === '/';
  closeMobileMenu({ restoreFocus: isSamePageAnchor });

  if (item.path) {
    await router.push(item.path);
    return;
  }

  if (route.path === '/') {
    await nextTick();
    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  await router.push({ name: 'home', hash: `#${item.id}` });
}

async function goHome() {
  const isAlreadyHome = route.path === '/';
  closeMobileMenu({ restoreFocus: isAlreadyHome });
  if (route.path === '/') {
    await nextTick();
    document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
    return;
  }
  await router.push({ name: 'home' });
}

function closeMobileMenu({ restoreFocus = true } = {}) {
  restoreFocusOnClose = restoreFocus;
  isMobileMenuOpen.value = false;
}

function toggleMobileMenu() {
  if (isMobileMenuOpen.value) {
    closeMobileMenu();
    return;
  }
  restoreFocusOnClose = true;
  isMobileMenuOpen.value = true;
}

function handleDialogKeydown(event) {
  if (event.key === 'Escape') {
    event.preventDefault();
    closeMobileMenu();
    return;
  }
  if (event.key !== 'Tab') return;

  const focusable = [...menuDialogRef.value.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )].filter((element) => !element.hasAttribute('hidden'));

  if (!focusable.length) {
    event.preventDefault();
    menuDialogRef.value.focus();
    return;
  }

  const first = focusable[0];
  const last = focusable.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function handleViewportChange() {
  if (window.innerWidth >= 1024 && isMobileMenuOpen.value) {
    closeMobileMenu();
  }
}

watch(isMobileMenuOpen, async (isOpen) => {
  const appRoot = document.getElementById('app');

  if (isOpen) {
    previouslyFocusedElement = document.activeElement;
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    await nextTick();
    closeMenuButtonRef.value?.focus();
    if (appRoot) appRoot.inert = true;
    window.dispatchEvent(new Event(overlayStateEvent));
    return;
  }

  if (appRoot) appRoot.inert = false;
  document.body.style.overflow = previousBodyOverflow;
  await nextTick();
  const previousFocusIsVisible = previouslyFocusedElement?.isConnected
    && previouslyFocusedElement.getClientRects().length > 0;
  const focusTarget = previousFocusIsVisible
    ? previouslyFocusedElement
    : brandLinkRef.value;
  if (restoreFocusOnClose && focusTarget) {
    focusTarget.focus();
  }
  restoreFocusOnClose = true;
  window.dispatchEvent(new Event(overlayStateEvent));
});

onMounted(() => {
  window.addEventListener('resize', handleViewportChange, { passive: true });

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
  window.removeEventListener('resize', handleViewportChange);
  document.getElementById('app')?.removeAttribute('inert');
  document.body.style.overflow = previousBodyOverflow;
  ctx?.revert();
});
</script>

<template>
  <header ref="navRef" class="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5">
    <nav class="glass-panel mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl px-4 md:px-5" aria-label="Navigasi utama">
      <a ref="brandLinkRef" href="/" class="flex items-center gap-2.5 rounded-xl" aria-label="Gandiva Labs — kembali ke beranda" @click.prevent="goHome">
        <LogoMark :size="35" :variant="isDark ? 'light' : 'dark'" />
        <span class="text-[15px] font-bold tracking-[-0.025em] text-text-primary">Gandiva Labs</span>
      </a>

      <div class="hidden items-center gap-7 lg:flex">
        <a
          v-for="item in navItems"
          :key="item.label"
          :href="hrefFor(item)"
          class="py-3 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
          :class="route.path === item.path ? 'text-text-primary' : ''"
          @click.prevent="navigateTo(item)"
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

        <RouterLink
          to="/konsultasi"
          data-track="nav_consultation"
          class="hidden min-h-11 items-center gap-2 rounded-full bg-text-primary px-5 text-sm font-bold text-bg-primary transition-transform hover:-translate-y-0.5 sm:inline-flex"
        >
          <MessageCircle class="h-4 w-4" />
          Ceritakan masalah
        </RouterLink>

        <button
          type="button"
          class="flex h-11 w-11 items-center justify-center rounded-full text-text-primary transition-colors hover:bg-bg-secondary lg:hidden"
          :aria-label="isMobileMenuOpen ? 'Tutup menu' : 'Buka menu'"
          :aria-expanded="isMobileMenuOpen"
          aria-controls="mobile-menu"
          @click="toggleMobileMenu"
        >
          <X v-if="isMobileMenuOpen" class="h-5 w-5" />
          <Menu v-else class="h-5 w-5" />
        </button>
      </div>
    </nav>
  </header>

  <Teleport to="body">
    <Transition name="menu-fade">
      <div
        v-if="isMobileMenuOpen"
        class="scrim fixed inset-0 z-40 cursor-default lg:hidden"
        aria-hidden="true"
        @click="closeMobileMenu()"
      />
    </Transition>

    <Transition name="menu-slide">
      <aside
        v-if="isMobileMenuOpen"
        id="mobile-menu"
        ref="menuDialogRef"
        data-blocks-marketing-overlay
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
        tabindex="-1"
        class="fixed inset-y-0 right-0 z-50 flex w-[min(21rem,88vw)] flex-col border-l border-border-default bg-bg-card p-5 shadow-2xl lg:hidden"
        @keydown="handleDialogKeydown"
      >
        <div class="flex items-center justify-between border-b border-border-default pb-5">
          <div class="flex items-center gap-3">
            <LogoMark :size="38" :variant="isDark ? 'light' : 'dark'" />
            <span id="mobile-menu-title" class="font-bold text-text-primary">Menu Gandiva Labs</span>
          </div>
          <button ref="closeMenuButtonRef" type="button" class="flex h-11 w-11 items-center justify-center rounded-full hover:bg-bg-secondary" aria-label="Tutup menu" @click="closeMobileMenu()">
            <X class="h-5 w-5" />
          </button>
        </div>

        <nav class="flex flex-1 flex-col gap-1 py-6" aria-label="Navigasi mobile">
          <a
            v-for="item in navItems"
            :key="item.label"
            :href="hrefFor(item)"
            class="rounded-xl px-4 py-3 text-lg font-medium text-text-primary hover:bg-bg-secondary"
            :aria-current="route.path === item.path ? 'page' : undefined"
            @click.prevent="navigateTo(item)"
          >
            {{ item.label }}
          </a>
        </nav>

        <RouterLink
          to="/konsultasi"
          data-track="mobile_menu_consultation"
          class="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-text-primary px-5 text-sm font-bold text-bg-primary"
          @click="closeMobileMenu({ restoreFocus: false })"
        >
          <MessageCircle class="h-4 w-4" />
          Ceritakan masalah
        </RouterLink>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
.menu-fade-enter-active,
.menu-fade-leave-active,
.menu-slide-enter-active,
.menu-slide-leave-active {
  transition: opacity 0.28s ease, transform 0.28s ease;
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
