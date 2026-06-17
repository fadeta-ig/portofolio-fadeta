<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { ArrowDown } from 'lucide-vue-next';

const heroContainer = ref(null);
let ctx;

onMounted(() => {
  if (!heroContainer.value) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  ctx = gsap.context(() => {
    const tl = gsap.timeline({ delay: 0.15 });

    tl.fromTo('.hero-label',
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
    )
    .fromTo('.hero-name',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
      '-=0.4'
    )
    .fromTo('.hero-tagline',
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
      '-=0.5'
    )
    .fromTo('.hero-roles span',
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out' },
      '-=0.4'
    )
    .fromTo('.hero-stats > div',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' },
      '-=0.3'
    )
    .fromTo('.hero-cta',
      { y: 12, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
      '-=0.3'
    )
    .fromTo('.hero-scroll',
      { opacity: 0 },
      { opacity: 0.5, duration: 1, ease: 'power2.out' },
      '-=0.2'
    );
  }, heroContainer.value);
});

onUnmounted(() => {
  ctx?.revert();
});
</script>

<template>
  <section
    id="hero"
    ref="heroContainer"
    class="relative w-full min-h-[95vh] flex flex-col justify-center items-center overflow-hidden pt-28 pb-28"
  >
    <!-- Atmospheric Background -->
    <div class="hero-bg" aria-hidden="true">
      <!-- Ambient gradient orbs -->
      <div class="hero-orb hero-orb--top-left"></div>
      <div class="hero-orb hero-orb--bottom-right"></div>
      <!-- Grid overlay -->
      <div class="hero-grid"></div>
      <!-- Noise texture -->
      <div class="noise-overlay"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 text-center flex flex-col items-center select-none px-6 max-w-4xl">
      <!-- Subtitle -->
      <p class="hero-label section-label mb-6" style="opacity: 0;">
        Portofolio
      </p>

      <!-- Name (Serif display) -->
      <h1
        class="hero-name font-display italic text-4xl md:text-5xl lg:text-6xl font-normal text-text-primary tracking-wide leading-[1.15] mb-4"
        style="opacity: 0;"
      >
        Fadeta Ilhan Gandhi<span class="text-accent">,</span>
        <span class="text-2xl md:text-3xl lg:text-4xl text-text-tertiary"> S.T.</span>
      </h1>

      <!-- Tagline -->
      <p
        class="hero-tagline text-sm md:text-base text-text-secondary font-normal leading-relaxed max-w-xl mb-8"
        style="opacity: 0;"
      >
        Merancang infrastruktur jaringan yang tangguh dan membangun solusi digital yang berdampak.
      </p>

      <!-- Roles -->
      <div
        class="hero-roles flex flex-wrap justify-center items-center gap-x-4 gap-y-2 mb-12"
      >
        <span class="text-[11px] md:text-xs uppercase tracking-[0.2em] text-text-tertiary font-medium" style="opacity: 0;">
          Network Engineer
        </span>
        <span class="w-1 h-1 rounded-full bg-accent/40 hidden sm:block" style="opacity: 0;"></span>
        <span class="text-[11px] md:text-xs uppercase tracking-[0.2em] text-text-tertiary font-medium" style="opacity: 0;">
          IT Infrastructure
        </span>
        <span class="w-1 h-1 rounded-full bg-accent/40 hidden sm:block" style="opacity: 0;"></span>
        <span class="text-[11px] md:text-xs uppercase tracking-[0.2em] text-text-tertiary font-medium" style="opacity: 0;">
          Web Developer
        </span>
      </div>

      <!-- Stats -->
      <div class="hero-stats flex items-center gap-8 md:gap-12 mb-12">
        <div class="text-center" style="opacity: 0;">
          <span class="block text-2xl md:text-3xl font-light text-text-primary tracking-tight">3+</span>
          <span class="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-text-tertiary">Tahun</span>
        </div>
        <div class="w-px h-8 bg-border-default" style="opacity: 0;"></div>
        <div class="text-center" style="opacity: 0;">
          <span class="block text-2xl md:text-3xl font-light text-text-primary tracking-tight">7+</span>
          <span class="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-text-tertiary">Proyek</span>
        </div>
        <div class="w-px h-8 bg-border-default" style="opacity: 0;"></div>
        <div class="text-center" style="opacity: 0;">
          <span class="block text-2xl md:text-3xl font-light text-text-primary tracking-tight">2</span>
          <span class="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-text-tertiary">Sertifikasi</span>
        </div>
      </div>

      <!-- CTA -->
      <a
        class="hero-cta inline-flex items-center gap-2.5 px-7 py-3 text-[11px] uppercase tracking-[0.2em] font-medium text-white bg-accent rounded-full hover:bg-accent-hover transition-all duration-300 group"
        href="#karya"
        @click.prevent="
          document.getElementById('karya')?.scrollIntoView({ behavior: 'smooth' })
        "
        style="opacity: 0;"
      >
        <span>Lihat Karya</span>
        <ArrowDown class="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform duration-300" />
      </a>
    </div>

    <!-- Scroll Indicator -->
    <div class="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center" style="opacity: 0;">
      <span class="text-[9px] uppercase tracking-[0.3em] text-text-tertiary mb-3">Scroll</span>
      <div class="w-[1px] h-10 bg-gradient-to-b from-border-default to-transparent"></div>
    </div>
  </section>
</template>

<style scoped>
.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}

.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
}

.hero-orb--top-left {
  width: 500px;
  height: 500px;
  top: -150px;
  left: -150px;
  background: radial-gradient(circle, var(--accent) 0%, transparent 70%);
  opacity: 0.08;
  animation: orb-drift 20s ease-in-out infinite alternate;
}

.hero-orb--bottom-right {
  width: 600px;
  height: 600px;
  bottom: -200px;
  right: -200px;
  background: radial-gradient(circle, var(--accent) 0%, transparent 70%);
  opacity: 0.06;
  animation: orb-drift 25s ease-in-out infinite alternate-reverse;
}

.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--border-subtle) 1px, transparent 1px),
    linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 80%);
  opacity: 0.5;
}

@keyframes orb-drift {
  0% {
    transform: translate(0, 0) scale(1);
  }
  100% {
    transform: translate(30px, -20px) scale(1.1);
  }
}
</style>
