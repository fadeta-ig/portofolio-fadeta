<script setup>
import { ref, onMounted } from 'vue';
import gsap from 'gsap';
import { ArrowDown } from 'lucide-vue-next';

const heroContainer = ref(null);
const subtitleRef = ref(null);
const nameRef = ref(null);
const taglineRef = ref(null);
const rolesRef = ref(null);
const statsRef = ref(null);
const ctaRef = ref(null);
const scrollRef = ref(null);

onMounted(() => {
  const tl = gsap.timeline({ delay: 0.3 });

  tl.fromTo(heroContainer.value,
    { opacity: 0 },
    { opacity: 1, duration: 1, ease: 'power2.out' }
  )
  .fromTo(subtitleRef.value,
    { y: 12, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
    '-=0.3'
  )
  .fromTo(nameRef.value,
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
    '-=0.4'
  )
  .fromTo(taglineRef.value,
    { y: 12, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
    '-=0.5'
  )
  .fromTo(rolesRef.value,
    { y: 10, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
    '-=0.4'
  )
  .fromTo(statsRef.value,
    { y: 15, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
    '-=0.3'
  )
  .fromTo(ctaRef.value,
    { y: 10, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
    '-=0.3'
  )
  .fromTo(scrollRef.value,
    { opacity: 0 },
    { opacity: 0.4, duration: 1, ease: 'power2.out' },
    '-=0.2'
  );
});
</script>

<template>
  <section
    id="hero"
    class="relative w-full h-[90vh] min-h-[600px] flex flex-col justify-center items-center overflow-hidden"
    ref="heroContainer"
  >
    <!-- CSS Atmospheric Background -->
    <div class="hero-bg" aria-hidden="true">
      <!-- Ambient Gradient Orbs (positioned at edges, NOT center) -->
      <div class="hero-orb hero-orb--top-left"></div>
      <div class="hero-orb hero-orb--bottom-right"></div>
      <div class="hero-orb hero-orb--mid-right"></div>
      <!-- Subtle Grid Overlay -->
      <div class="hero-grid"></div>
      <!-- Noise Texture -->
      <div class="hero-noise"></div>
    </div>

    <!-- Foreground Content -->
    <div class="relative z-10 text-center flex flex-col items-center select-none px-6 max-w-4xl">

      <!-- Subtitle Label -->
      <p
        ref="subtitleRef"
        class="text-[10px] md:text-xs uppercase tracking-[0.35em] text-accent-icy/70 mb-5"
      >
        Portofolio
      </p>

      <!-- Name (Aesthetic Latin Font + Degree) -->
      <h1
        ref="nameRef"
        class="font-aesthetic italic text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-wide leading-[1.15] mb-4"
      >
        Fadeta Ilhan Gandhi<span class="text-accent-icy/60">,</span>
        <span class="text-2xl md:text-3xl lg:text-4xl text-white/70"> S.T.</span>
      </h1>

      <!-- Tagline -->
      <p
        ref="taglineRef"
        class="text-sm md:text-base text-gray-400/80 font-light leading-relaxed max-w-xl mb-6"
      >
        Merancang infrastruktur jaringan yang tangguh dan membangun solusi digital yang berdampak.
      </p>

      <!-- Roles (Static, separated by dots) -->
      <div
        ref="rolesRef"
        class="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 mb-10"
      >
        <span class="text-[11px] md:text-xs uppercase tracking-[0.25em] text-gray-400 font-light">Network Engineer</span>
        <span class="w-1 h-1 rounded-full bg-accent-icy/40 hidden sm:block"></span>
        <span class="text-[11px] md:text-xs uppercase tracking-[0.25em] text-gray-400 font-light">IT Infrastructure</span>
        <span class="w-1 h-1 rounded-full bg-accent-icy/40 hidden sm:block"></span>
        <span class="text-[11px] md:text-xs uppercase tracking-[0.25em] text-gray-400 font-light">Web Developer</span>
      </div>

      <!-- Micro Stats -->
      <div
        ref="statsRef"
        class="flex items-center gap-8 md:gap-12 mb-10"
      >
        <div class="text-center">
          <span class="block text-2xl md:text-3xl font-light text-white tracking-tight">3+</span>
          <span class="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-gray-500">Tahun</span>
        </div>
        <div class="w-px h-8 bg-white/10"></div>
        <div class="text-center">
          <span class="block text-2xl md:text-3xl font-light text-white tracking-tight">7+</span>
          <span class="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-gray-500">Proyek</span>
        </div>
        <div class="w-px h-8 bg-white/10"></div>
        <div class="text-center">
          <span class="block text-2xl md:text-3xl font-light text-white tracking-tight">2</span>
          <span class="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-gray-500">Sertifikasi</span>
        </div>
      </div>

      <!-- CTA Button -->
      <a
        ref="ctaRef"
        href="#karya"
        class="pointer-events-auto inline-flex items-center gap-2.5 px-6 py-2.5 text-[11px] uppercase tracking-[0.2em] text-white border border-white/15 rounded-full hover:border-accent-icy/40 hover:text-accent-icy transition-all duration-400 group"
      >
        <span>Lihat Karya</span>
        <ArrowDown class="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform duration-300" />
      </a>
    </div>

    <!-- Scroll Indicator -->
    <div
      ref="scrollRef"
      class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center opacity-0"
    >
      <span class="text-[9px] uppercase tracking-[0.3em] text-gray-500 mb-3">Scroll</span>
      <div class="w-[1px] h-10 bg-gradient-to-b from-white/30 to-transparent"></div>
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

/* Ambient gradient orbs — soft, large, positioned at EDGES to frame content */
.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.15;
  pointer-events: none;
}

.hero-orb--top-left {
  width: 500px;
  height: 500px;
  top: -150px;
  left: -150px;
  background: radial-gradient(circle, #a0f0ff 0%, transparent 70%);
  animation: orb-drift 20s ease-in-out infinite alternate;
}

.hero-orb--bottom-right {
  width: 600px;
  height: 600px;
  bottom: -200px;
  right: -200px;
  background: radial-gradient(circle, #a0f0ff 0%, transparent 70%);
  opacity: 0.1;
  animation: orb-drift 25s ease-in-out infinite alternate-reverse;
}

.hero-orb--mid-right {
  width: 300px;
  height: 300px;
  top: 30%;
  right: -80px;
  background: radial-gradient(circle, #e0e0e0 0%, transparent 70%);
  opacity: 0.06;
  animation: orb-drift 18s ease-in-out infinite alternate;
}

/* Subtle grid pattern — masked to fade at edges */
.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 80%);
}

/* Film grain noise overlay for texture depth */
.hero-noise {
  position: absolute;
  inset: 0;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 128px 128px;
  pointer-events: none;
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
