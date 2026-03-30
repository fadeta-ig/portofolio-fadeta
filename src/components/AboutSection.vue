<script setup>
import { ref, onMounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsapScrollReveal } from '../composables/useGsapScrollReveal';

gsap.registerPlugin(ScrollTrigger);

const contentRef = ref(null);

useGsapScrollReveal(contentRef, {
  y: 60,
  stagger: 0.2,
  duration: 1.2
});
</script>

<template>
  <section id="about" class="pt-16 pb-10 relative z-10">
    <div class="max-w-5xl mx-auto px-6" ref="contentRef">

      <!-- Section Label -->
      <h2 class="text-xs uppercase tracking-[0.3em] text-accent-icy mb-10 opacity-80">Tentang Saya</h2>

      <!-- Two-column layout -->
      <div class="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-10 md:gap-16 items-start">

        <!-- Left: headline -->
        <div>
          <h3 class="text-2xl md:text-3xl font-light leading-snug text-white/90">
            IT Infrastructure Engineer &amp; Web Developer yang berfokus pada
            <span class="text-gradient font-medium">stabilitas</span> dan
            <span class="text-gradient font-medium">fungsionalitas</span> sistem.
          </h3>
        </div>

        <!-- Right: description + tagline -->
        <div>
          <p class="text-base md:text-lg font-light text-gray-400 leading-relaxed border-l-2 border-accent-icy/20 pl-6 mb-8">
            Bagi saya, pengembangan antarmuka web harus selalu sejalan dengan kesiapan infrastruktur di belakangnya. Pekerjaan saya mencakup pengelolaan jaringan yang andal hingga penulisan kode untuk antarmuka yang interaktif. Pendekatan terintegrasi ini memastikan setiap sistem yang saya bangun dapat beroperasi secara maksimal, aman, dan mudah dikelola.
          </p>

          <div class="flex gap-4 items-center">
            <div class="h-[1px] w-10 bg-accent-silver/30"></div>
            <p class="text-xs tracking-widest uppercase text-accent-silver/70 font-medium">Fadeta Ilhan G</p>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>
