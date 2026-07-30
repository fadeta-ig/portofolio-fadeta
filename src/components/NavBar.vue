<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { ArrowUpRight, Menu, MessageCircle, Moon, Sun, X } from '@lucide/vue';
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
const isHeroNav = ref(route.path === '/');
let ctx;
let previouslyFocusedElement = null;
let previousBodyOverflow = '';
let restoreFocusOnClose = true;

const navItems = [
  { label: 'Solusi', detail: 'Layanan berdasarkan kebutuhan', id: 'services' },
  { label: 'Hasil', detail: 'Karya dan konteks proyek', path: '/portfolio' },
  { label: 'Cara kerja', detail: 'Proses yang transparan', id: 'process' },
  { label: 'Tentang', detail: 'Kenali Gandiva Labs', id: 'studio' }
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
  updateHeroNavState();
}

function updateHeroNavState() {
  if (route.path !== '/') {
    isHeroNav.value = false;
    return;
  }

  const hero = document.getElementById('hero');
  isHeroNav.value = hero
    ? hero.getBoundingClientRect().bottom > 104
    : window.scrollY < 120;
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

watch(() => route.path, async () => {
  await nextTick();
  updateHeroNavState();
});

onMounted(() => {
  window.addEventListener('resize', handleViewportChange, { passive: true });
  window.addEventListener('scroll', updateHeroNavState, { passive: true });
  updateHeroNavState();

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
  window.removeEventListener('scroll', updateHeroNavState);
  document.getElementById('app')?.removeAttribute('inert');
  document.body.style.overflow = previousBodyOverflow;
  ctx?.revert();
});
</script>

<template>
  <header
    ref="navRef"
    class="site-header fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5"
    :class="{ 'hero-nav-active': isHeroNav }"
  >
    <nav class="nav-surface glass-panel mx-auto flex h-16 max-w-7xl items-center justify-between rounded-[1.35rem] px-4 md:px-5" aria-label="Navigasi utama">
      <a ref="brandLinkRef" href="/" class="flex items-center gap-2.5 rounded-xl" aria-label="Gandiva Labs — kembali ke beranda" @click.prevent="goHome">
        <LogoMark :size="35" :variant="isHeroNav ? 'light' : 'auto'" />
        <span class="nav-brand text-[15px] font-bold tracking-[-0.025em] text-text-primary">Gandiva Labs</span>
      </a>

      <div class="hidden items-center gap-7 lg:flex">
        <a
          v-for="item in navItems"
          :key="item.label"
          :href="hrefFor(item)"
          class="nav-link py-3 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
          :class="route.path === item.path ? 'text-text-primary' : ''"
          @click.prevent="navigateTo(item)"
        >
          {{ item.label }}
        </a>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="nav-icon-button flex h-11 w-11 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-bg-secondary hover:text-text-primary"
          aria-label="Ganti tema warna"
          :aria-pressed="isDark"
          @click="toggleTheme"
        >
          <Sun class="theme-icon theme-icon-dark h-[18px] w-[18px]" aria-hidden="true" />
          <Moon class="theme-icon theme-icon-light h-[18px] w-[18px]" aria-hidden="true" />
        </button>

        <RouterLink
          to="/konsultasi"
          data-track="nav_consultation"
          class="nav-cta hidden min-h-11 items-center gap-2 rounded-full bg-text-primary px-5 text-sm font-bold text-bg-primary transition-transform hover:-translate-y-0.5 sm:inline-flex"
        >
          <MessageCircle class="h-4 w-4" />
          Ceritakan masalah
        </RouterLink>

        <button
          type="button"
          class="nav-icon-button nav-menu-button flex h-11 items-center justify-center gap-2 rounded-full px-3 text-text-primary transition-colors hover:bg-bg-secondary lg:hidden"
          :aria-label="isMobileMenuOpen ? 'Tutup menu' : 'Buka menu'"
          :aria-expanded="isMobileMenuOpen"
          aria-controls="mobile-menu"
          @click="toggleMobileMenu"
        >
          <X v-if="isMobileMenuOpen" class="h-[18px] w-[18px]" />
          <Menu v-else class="h-[18px] w-[18px]" />
          <span class="nav-menu-label">Menu</span>
        </button>
      </div>
    </nav>
  </header>

  <Teleport to="body">
    <Transition name="menu-fade">
      <div
        v-if="isMobileMenuOpen"
        class="mobile-menu-scrim scrim fixed inset-0 z-40 cursor-default lg:hidden"
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
        class="mobile-menu-panel fixed inset-y-2 right-2 z-50 flex flex-col overflow-hidden rounded-[2rem] p-4 lg:hidden"
        @keydown="handleDialogKeydown"
      >
        <div class="mobile-menu-head flex items-center justify-between rounded-[1.35rem] px-2 py-2">
          <div class="flex items-center gap-3">
            <LogoMark :size="38" variant="auto" />
            <div>
              <span id="mobile-menu-title" class="block text-sm font-bold text-text-primary">Gandiva Labs</span>
              <span class="mt-0.5 block text-[9px] font-bold uppercase tracking-[0.16em] text-text-tertiary">Navigation studio</span>
            </div>
          </div>
          <button ref="closeMenuButtonRef" type="button" class="mobile-menu-close flex h-11 w-11 items-center justify-center rounded-full" aria-label="Tutup menu" @click="closeMobileMenu()">
            <X class="h-5 w-5" />
          </button>
        </div>

        <nav class="flex flex-1 flex-col justify-center gap-2 py-5" aria-label="Navigasi mobile">
          <a
            v-for="(item, index) in navItems"
            :key="item.label"
            :href="hrefFor(item)"
            class="mobile-menu-link group grid min-h-[4.65rem] grid-cols-[2rem_1fr_auto] items-center gap-3 rounded-[1.25rem] px-4 text-text-primary"
            :aria-current="route.path === item.path ? 'page' : undefined"
            @click.prevent="navigateTo(item)"
          >
            <span class="mobile-menu-index">0{{ index + 1 }}</span>
            <span>
              <strong class="block text-lg tracking-[-0.035em]">{{ item.label }}</strong>
              <small class="mt-0.5 block text-[11px] font-medium text-text-tertiary">{{ item.detail }}</small>
            </span>
            <span class="mobile-menu-arrow flex h-9 w-9 items-center justify-center rounded-full">
              <ArrowUpRight class="h-4 w-4" aria-hidden="true" />
            </span>
          </a>
        </nav>

        <div class="mobile-menu-footer rounded-[1.45rem] p-3">
          <p class="mb-3 flex items-center gap-2 px-1 text-[10px] font-bold uppercase tracking-[0.13em] text-text-tertiary">
            <span class="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_0_4px_var(--accent-subtle)]" />
            Menerima proyek website baru
          </p>
          <RouterLink
            to="/konsultasi"
            data-track="mobile_menu_consultation"
            class="mobile-menu-cta inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-bold"
            @click="closeMobileMenu({ restoreFocus: false })"
          >
            <MessageCircle class="h-4 w-4" />
            Ceritakan masalah
            <ArrowUpRight class="h-4 w-4" />
          </RouterLink>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
.nav-surface,
.nav-brand,
.nav-link,
.nav-icon-button,
.nav-cta {
  transition:
    color 0.3s ease,
    background-color 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease,
    transform 0.3s ease;
}

.nav-surface {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--text-primary) 13%, transparent);
  background:
    radial-gradient(circle at 14% -70%, color-mix(in srgb, var(--bg-elevated) 56%, transparent), transparent 48%),
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--bg-card) 74%, transparent),
      color-mix(in srgb, var(--bg-primary) 48%, transparent)
    );
  box-shadow:
    0 18px 44px rgba(0, 0, 0, 0.14),
    inset 0 1px 0 color-mix(in srgb, var(--text-primary) 17%, transparent),
    inset 0 -1px 0 color-mix(in srgb, var(--text-primary) 4%, transparent);
  -webkit-backdrop-filter: blur(26px) saturate(175%);
  backdrop-filter: blur(26px) saturate(175%);
}

.nav-surface::before {
  position: absolute;
  z-index: 0;
  inset: 0;
  background:
    linear-gradient(112deg, rgba(255, 255, 255, 0.15), transparent 25%, transparent 74%, rgba(238, 136, 89, 0.055)),
    radial-gradient(circle at 20% -90%, rgba(255, 255, 255, 0.36), transparent 43%);
  content: '';
  opacity: 0.72;
  pointer-events: none;
}

.nav-surface > * {
  position: relative;
  z-index: 1;
}

:global([data-theme="light"]) .site-header:not(.hero-nav-active) .nav-surface {
  border-color: rgba(255, 255, 255, 0.94);
  background:
    radial-gradient(circle at 14% -78%, rgba(255, 255, 255, 1), transparent 46%),
    radial-gradient(circle at 96% 130%, rgba(196, 95, 60, 0.08), transparent 32%),
    linear-gradient(145deg, rgba(255, 255, 255, 0.83), rgba(238, 243, 240, 0.62));
  box-shadow:
    0 20px 52px rgba(31, 45, 36, 0.13),
    0 4px 12px rgba(31, 45, 36, 0.035),
    inset 0 1px 0 #ffffff,
    inset 0 -1px 0 rgba(70, 91, 78, 0.05);
  -webkit-backdrop-filter: blur(30px) saturate(175%);
  backdrop-filter: blur(30px) saturate(175%);
}

.hero-nav-active .nav-surface {
  border-color: rgba(255, 255, 255, 0.17);
  background:
    radial-gradient(circle at 16% -85%, rgba(255, 255, 255, 0.22), transparent 46%),
    radial-gradient(circle at 92% 130%, rgba(238, 136, 89, 0.09), transparent 34%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.105), rgba(255, 255, 255, 0.04));
  box-shadow:
    0 20px 52px rgba(0, 0, 0, 0.32),
    inset 0 1px 0 rgba(255, 255, 255, 0.22),
    inset 0 -1px 0 rgba(255, 255, 255, 0.045),
    inset 1px 0 0 rgba(255, 255, 255, 0.06);
  -webkit-backdrop-filter: blur(28px) saturate(180%);
  backdrop-filter: blur(28px) saturate(180%);
}

.hero-nav-active .nav-brand {
  color: #f5f0e7;
}

.hero-nav-active .nav-link {
  color: rgba(245, 240, 231, 0.68);
}

.hero-nav-active .nav-link:hover {
  color: #f5f0e7;
}

.hero-nav-active .nav-icon-button {
  color: rgba(245, 240, 231, 0.76);
}

.hero-nav-active .nav-icon-button:hover {
  background: rgba(245, 240, 231, 0.09);
  color: #f5f0e7;
}

.hero-nav-active .nav-cta {
  border: 1px solid rgba(255, 255, 255, 0.62);
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(236, 229, 218, 0.9));
  color: #171511;
  box-shadow:
    0 10px 28px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    inset 0 -1px 0 rgba(23, 21, 17, 0.08);
}

.hero-nav-active .nav-cta:hover {
  background: #fffaf2;
}

.nav-menu-label {
  font-size: 0.72rem;
  font-weight: 750;
}

.mobile-menu-scrim {
  background: color-mix(in srgb, var(--overlay-scrim) 74%, transparent);
  -webkit-backdrop-filter: blur(10px) saturate(120%);
  backdrop-filter: blur(10px) saturate(120%);
}

.mobile-menu-panel {
  isolation: isolate;
  width: min(23rem, calc(100vw - 1rem));
  border: 1px solid var(--glass-border);
  background:
    radial-gradient(circle at 14% -8%, var(--glass-highlight), transparent 34%),
    radial-gradient(circle at 102% 108%, var(--glass-accent), transparent 38%),
    linear-gradient(155deg, var(--glass-surface-strong), var(--glass-surface));
  box-shadow:
    -24px 0 70px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 var(--glass-highlight),
    inset 0 -1px 0 color-mix(in srgb, var(--text-primary) 5%, transparent);
  -webkit-backdrop-filter: blur(34px) saturate(180%);
  backdrop-filter: blur(34px) saturate(180%);
}

:global([data-theme="light"]) .mobile-menu-panel {
  border-color: rgba(255, 255, 255, 0.96);
  background:
    radial-gradient(circle at 14% -6%, rgba(255, 255, 255, 1), transparent 35%),
    radial-gradient(circle at 104% 110%, rgba(196, 95, 60, 0.11), transparent 38%),
    linear-gradient(155deg, rgba(255, 255, 255, 0.9), rgba(232, 238, 234, 0.72));
  box-shadow:
    -28px 0 76px rgba(31, 45, 36, 0.18),
    inset 0 1px 0 #ffffff,
    inset 0 -1px 0 rgba(70, 91, 78, 0.05);
}

.mobile-menu-panel::before {
  position: absolute;
  z-index: -1;
  inset: 0;
  background:
    linear-gradient(115deg, rgba(255, 255, 255, 0.18), transparent 23%, transparent 76%, var(--glass-accent));
  content: '';
  pointer-events: none;
}

.mobile-menu-head,
.mobile-menu-footer {
  border: 1px solid color-mix(in srgb, var(--text-primary) 9%, var(--glass-border));
  background: color-mix(in srgb, var(--glass-surface-strong) 70%, transparent);
  box-shadow: inset 0 1px 0 var(--glass-highlight);
}

.mobile-menu-close,
.mobile-menu-arrow {
  border: 1px solid var(--glass-border);
  background:
    radial-gradient(circle at 32% 0%, var(--glass-highlight), transparent 52%),
    var(--glass-surface);
  box-shadow:
    0 8px 20px rgba(32, 25, 18, 0.08),
    inset 0 1px 0 var(--glass-highlight);
}

.mobile-menu-link {
  border: 1px solid transparent;
  background: color-mix(in srgb, var(--glass-surface) 55%, transparent);
  box-shadow: inset 0 1px 0 color-mix(in srgb, var(--glass-highlight) 55%, transparent);
  transition:
    border-color 0.25s ease,
    background-color 0.25s ease,
    box-shadow 0.25s ease,
    transform 0.25s ease;
}

.mobile-menu-link:hover,
.mobile-menu-link:focus-visible,
.mobile-menu-link[aria-current='page'] {
  border-color: color-mix(in srgb, var(--accent) 24%, var(--glass-border));
  background: color-mix(in srgb, var(--glass-surface-strong) 82%, var(--accent-subtle));
  box-shadow:
    0 12px 28px rgba(32, 25, 18, 0.08),
    inset 0 1px 0 var(--glass-highlight);
  transform: translateX(-3px);
}

.mobile-menu-index {
  color: var(--accent);
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.13em;
}

.mobile-menu-arrow {
  color: var(--text-secondary);
  transition: color 0.25s ease, transform 0.25s ease;
}

.mobile-menu-link:hover .mobile-menu-arrow,
.mobile-menu-link:focus-visible .mobile-menu-arrow {
  color: var(--accent);
  transform: rotate(8deg);
}

.mobile-menu-cta {
  border: 1px solid color-mix(in srgb, var(--text-primary) 60%, transparent);
  background:
    linear-gradient(145deg, var(--text-primary), color-mix(in srgb, var(--text-primary) 88%, var(--accent)));
  color: var(--bg-primary);
  box-shadow:
    0 14px 32px color-mix(in srgb, var(--text-primary) 22%, transparent),
    inset 0 1px 0 color-mix(in srgb, var(--bg-primary) 35%, transparent);
}

.theme-icon-dark {
  display: none;
}

:global([data-theme="dark"] .theme-icon-dark) {
  display: block;
}

:global([data-theme="dark"] .theme-icon-light) {
  display: none;
}

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
  transform: translateX(calc(100% + 1rem)) scale(0.985);
}

@media (max-width: 639px) {
  .site-header {
    padding: 0.55rem;
  }

  .nav-surface {
    height: 3.65rem;
    padding-right: 0.45rem;
    padding-left: 0.75rem;
    border-radius: 1.25rem;
  }

  .nav-brand {
    font-size: 0.84rem;
  }

  .nav-icon-button {
    width: 2.75rem;
    height: 2.75rem;
  }

  .nav-menu-button {
    width: auto;
    padding-inline: 0.78rem;
  }
}

@media (max-height: 690px) {
  .mobile-menu-link {
    min-height: 3.85rem;
  }

  .mobile-menu-link small,
  .mobile-menu-footer p {
    display: none;
  }
}
</style>
