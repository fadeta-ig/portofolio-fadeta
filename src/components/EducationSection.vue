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
  <section id="education" class="py-16 md:py-20 relative z-10">
    <div class="max-w-5xl mx-auto px-6" ref="contentRef">

      <!-- Section Label -->
      <h2 class="section-label mb-10">Pendidikan</h2>

      <!-- Two-column layout (matching About) -->
      <div class="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-10 md:gap-16 items-start">

        <!-- Left: headline -->
        <div>
          <h3 class="text-2xl md:text-3xl font-light leading-snug text-text-primary">
            Lulus <span class="text-gradient font-medium">Cumlaude</span> dari
            Telkom University Surabaya dengan
            <span class="text-gradient font-medium">IPK 3.8</span>.
          </h3>
        </div>

        <!-- Right: description + tags + tagline -->
        <div>
          <p class="text-base md:text-lg font-normal text-text-secondary leading-relaxed accent-border-left mb-6">
            Meraih gelar Sarjana Teknik Komputer (S1) dengan fokus penelitian pada pengembangan aplikasi mobile berbasis Flutter untuk mendiagnosis penyakit ikan koi menggunakan Sistem Pakar dengan metode Forward &amp; Backward Chaining.
          </p>

          <!-- Research Tags -->
          <div class="flex flex-wrap gap-2 mb-8 pl-6">
            <span class="tag">Flutter</span>
            <span class="tag">Android</span>
            <span class="tag">Sistem Pakar</span>
            <span class="tag">Forward Chaining</span>
            <span class="tag">Backward Chaining</span>
          </div>

          <div class="flex gap-4 items-center">
            <div class="h-[1px] w-10 bg-border-default"></div>
            <p class="text-xs tracking-widest uppercase text-text-tertiary font-medium">S1 Teknik Komputer · Cumlaude</p>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>
