<script setup>
import { ref } from 'vue';
import { useGsapScrollReveal } from '../composables/useGsapScrollReveal';

const contentRef = ref(null);

useGsapScrollReveal(contentRef, {
  y: 60,
  stagger: 0.2,
  duration: 1.2
});
</script>

<template>
  <section id="education" class="pt-10 pb-12 relative z-10">
    <div class="max-w-5xl mx-auto px-6" ref="contentRef">

      <!-- Section Label -->
      <h2 class="text-xs uppercase tracking-[0.3em] text-accent-icy mb-10 opacity-80">Pendidikan</h2>

      <!-- Two-column layout (matching About) -->
      <div class="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-10 md:gap-16 items-start">

        <!-- Left: headline -->
        <div>
          <h3 class="text-2xl md:text-3xl font-light leading-snug text-white/90">
            Lulus <span class="text-gradient font-medium">Cumlaude</span> dari
            Telkom University Surabaya dengan
            <span class="text-gradient font-medium">IPK 3.8</span>.
          </h3>
        </div>

        <!-- Right: description + tags + tagline -->
        <div>
          <p class="text-base md:text-lg font-light text-gray-400 leading-relaxed border-l-2 border-accent-icy/20 pl-6 mb-6">
            Meraih gelar Sarjana Teknik Komputer (S1) dengan fokus penelitian pada pengembangan aplikasi mobile berbasis Flutter untuk mendiagnosis penyakit ikan koi menggunakan Sistem Pakar dengan metode Forward &amp; Backward Chaining.
          </p>

          <!-- Research Tags -->
          <div class="flex flex-wrap gap-2 mb-8 pl-6">
            <span class="px-3 py-1 text-[11px] font-medium text-gray-300 bg-white/[0.04] border border-white/[0.08] rounded-full">Flutter</span>
            <span class="px-3 py-1 text-[11px] font-medium text-gray-300 bg-white/[0.04] border border-white/[0.08] rounded-full">Android</span>
            <span class="px-3 py-1 text-[11px] font-medium text-gray-300 bg-white/[0.04] border border-white/[0.08] rounded-full">Sistem Pakar</span>
            <span class="px-3 py-1 text-[11px] font-medium text-gray-300 bg-white/[0.04] border border-white/[0.08] rounded-full">Forward Chaining</span>
            <span class="px-3 py-1 text-[11px] font-medium text-gray-300 bg-white/[0.04] border border-white/[0.08] rounded-full">Backward Chaining</span>
          </div>

          <div class="flex gap-4 items-center">
            <div class="h-[1px] w-10 bg-accent-silver/30"></div>
            <p class="text-xs tracking-widest uppercase text-accent-silver/70 font-medium">S1 Teknik Komputer · Cumlaude</p>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>
