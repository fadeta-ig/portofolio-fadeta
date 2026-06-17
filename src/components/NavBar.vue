<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Download, Sun, Moon, Menu, X } from 'lucide-vue-next';
import gsap from 'gsap';
import LogoMark from './LogoMark.vue';
import { cvPdf } from '../data/assets';
import { useTheme } from '../composables/useTheme';

const { isDark, toggleTheme } = useTheme();

const isMobileMenuOpen = ref(false);
const navRef = ref(null);
const navLinksRef = ref(null);
let ctx;

const navItems = [
  { label: 'Tentang', id: 'about' },
  { label: 'Pendidikan', id: 'education' },
  { label: 'Keahlian', id: 'expertise' },
  { label: 'Proyek', id: 'karya' },
  { label: 'Sertifikasi', id: 'certifications' }
];

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
    isMobileMenuOpen.value = false;
  }
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.fromTo(navRef.value,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.1 }
    );
  }, navRef.value);
});

onUnmounted(() => {
  ctx?.revert();
});
</script>

<template>
  <!-- Desktop Navbar -->
  <nav
    ref="navRef"
    class="fixed top-0 left-0 w-full z-50 glass-panel theme-transition"
    style="opacity: 0;"
  >
    <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <!-- Logo -->
      <a
        href="#"
        @click.prevent="scrollTo('hero')"
        class="focus:outline-none"
        aria-label="Home"
      >
        <LogoMark :size="36" />
      </a>

      <!-- Desktop Links -->
      <div ref="navLinksRef" class="hidden md:flex items-center gap-8">
        <a
          v-for="item in navItems"
          :key="item.id"
          :href="`#${item.id}`"
          @click.prevent="scrollTo(item.id)"
          class="text-sm font-medium text-text-secondary hover:text-accent transition-colors duration-300"
        >
          {{ item.label }}
        </a>
      </div>

      <!-- Right Actions -->
      <div class="flex items-center gap-3">
        <!-- Theme Toggle -->
        <button
          @click="toggleTheme"
          class="relative w-10 h-10 flex items-center justify-center rounded-full text-text-secondary hover:text-accent hover:bg-accent-subtle transition-all duration-300"
          :aria-label="isDark ? 'Mode terang' : 'Mode gelap'"
        >
          <Transition name="theme-icon" mode="out-in">
            <Moon v-if="!isDark" class="w-[18px] h-[18px]" :key="'moon'" />
            <Sun v-else class="w-[18px] h-[18px]" :key="'sun'" />
          </Transition>
        </button>

        <!-- Resume Link (desktop) -->
        <a
          :href="cvPdf"
          target="_blank"
          class="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-accent transition-colors duration-300"
        >
          <Download class="w-4 h-4" />
          <span>Resume</span>
        </a>

        <!-- Contact CTA (desktop) -->
        <a
          href="#contact"
          @click.prevent="scrollTo('contact')"
          class="hidden sm:inline-flex px-5 py-2.5 text-sm font-medium bg-accent text-white rounded-full hover:bg-accent-hover transition-all duration-300"
        >
          Hubungi Saya
        </a>

        <!-- Mobile Hamburger -->
        <button
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="md:hidden w-10 h-10 flex items-center justify-center rounded-full text-text-secondary hover:text-accent hover:bg-accent-subtle transition-all duration-300"
          :aria-label="isMobileMenuOpen ? 'Tutup menu' : 'Buka menu'"
        >
          <Transition name="theme-icon" mode="out-in">
            <X v-if="isMobileMenuOpen" class="w-5 h-5" :key="'close'" />
            <Menu v-else class="w-5 h-5" :key="'menu'" />
          </Transition>
        </button>
      </div>
    </div>
  </nav>

  <!-- Mobile Drawer Overlay -->
  <Teleport to="body">
    <Transition name="drawer-overlay">
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 z-40 scrim md:hidden"
        @click="closeMobileMenu"
      ></div>
    </Transition>

    <!-- Mobile Drawer -->
    <Transition name="drawer">
      <div
        v-if="isMobileMenuOpen"
        class="fixed top-0 right-0 h-full w-72 z-50 bg-bg-card border-l border-border-default shadow-xl md:hidden flex flex-col"
      >
        <!-- Drawer Header -->
        <div class="flex items-center justify-between px-6 h-20 border-b border-border-default">
          <span class="text-sm font-medium text-text-tertiary tracking-wide uppercase">Menu</span>
          <button
            @click="closeMobileMenu"
            class="w-10 h-10 flex items-center justify-center rounded-full text-text-secondary hover:text-accent hover:bg-accent-subtle transition-all duration-300"
            aria-label="Tutup menu"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Drawer Links -->
        <nav class="flex-1 flex flex-col gap-1 px-4 py-6">
          <a
            v-for="item in navItems"
            :key="item.id"
            :href="`#${item.id}`"
            @click.prevent="scrollTo(item.id)"
            class="px-4 py-3 text-base font-medium text-text-primary hover:text-accent hover:bg-accent-subtle rounded-xl transition-all duration-200"
          >
            {{ item.label }}
          </a>
        </nav>

        <!-- Drawer Footer Actions -->
        <div class="px-4 pb-6 space-y-3 border-t border-border-default pt-4">
          <a
            :href="cvPdf"
            target="_blank"
            class="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium border border-border-default text-text-primary hover:border-accent hover:text-accent rounded-xl transition-all duration-300"
          >
            <Download class="w-4 h-4" />
            <span>Unduh Resume</span>
          </a>
          <a
            href="#contact"
            @click.prevent="scrollTo('contact')"
            class="flex items-center justify-center w-full px-4 py-3 text-sm font-medium bg-accent text-white rounded-xl hover:bg-accent-hover transition-all duration-300"
          >
            Hubungi Saya
          </a>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Theme icon transition */
.theme-icon-enter-active,
.theme-icon-leave-active {
  transition: all 0.25s ease;
}

.theme-icon-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.6);
}

.theme-icon-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.6);
}

/* Drawer overlay */
.drawer-overlay-enter-active,
.drawer-overlay-leave-active {
  transition: opacity 0.3s ease;
}

.drawer-overlay-enter-from,
.drawer-overlay-leave-to {
  opacity: 0;
}

/* Drawer slide */
.drawer-enter-active {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.drawer-leave-active {
  transition: transform 0.25s ease-in;
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(100%);
}
</style>
