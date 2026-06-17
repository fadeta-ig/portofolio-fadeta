<script setup>
import { ref } from 'vue';
import { useGsapScrollReveal } from '../composables/useGsapScrollReveal';

const contentRef = ref(null);

useGsapScrollReveal(contentRef, {
  y: 50,
  stagger: 0.15,
  duration: 1
});
</script>

<template>
  <section id="about" class="py-20 md:py-28 relative z-10">
    <div class="max-w-5xl mx-auto px-6" ref="contentRef">

      <!-- Section Label -->
      <h2 class="section-label mb-10">Tentang Saya</h2>

      <!-- Two-column layout -->
      <div class="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-10 md:gap-16 items-start">

        <!-- Left: headline -->
        <div>
          <h3 class="text-2xl md:text-3xl font-light leading-snug text-text-primary">
            IT Infrastructure Engineer &amp; Web Developer yang berfokus pada
            <span class="text-gradient font-medium">stabilitas</span> dan
            <span class="text-gradient font-medium">fungsionalitas</span> sistem.
          </h3>
        </div>

        <!-- Right: description + tagline -->
        <div>
          <p class="text-base md:text-lg font-normal text-text-secondary leading-relaxed accent-border-left mb-8">
            Bagi saya, pengembangan antarmuka web harus selalu sejalan dengan kesiapan infrastruktur di belakangnya. Pekerjaan saya mencakup pengelolaan jaringan yang andal hingga penulisan kode untuk antarmuka yang interaktif. Pendekatan terintegrasi ini memastikan setiap sistem yang saya bangun dapat beroperasi secara maksimal, aman, dan mudah dikelola.
          </p>

          <div class="flex gap-4 items-center">
            <div class="h-[1px] w-10 bg-border-default"></div>
            <p class="text-xs tracking-widest uppercase text-text-tertiary font-medium">Fadeta Ilhan G</p>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>
