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
  <section id="education" class="py-24 relative z-10">
    <div class="max-w-4xl mx-auto px-6" ref="contentRef">
      <h2 class="text-xs uppercase tracking-[0.3em] text-accent-icy mb-8 opacity-80">Pendidikan</h2>

      <p class="text-3xl md:text-5xl font-light leading-tight text-white/90 mb-10">
        Lulus <span class="text-gradient font-medium italic">Cumlaude</span> dari
        Telkom University Surabaya.
      </p>

      <p class="text-xl md:text-2xl font-light text-gray-400 leading-relaxed mb-6">
        Meraih gelar <span class="text-white">Sarjana Teknik Komputer</span> (S1)
        dengan <span class="text-white">IPK 3.8</span>, memadukan pemahaman mendalam tentang sistem komputer
        dengan kemampuan membangun solusi perangkat lunak yang efektif.
      </p>

      <p class="text-xl md:text-2xl font-light text-gray-400 leading-relaxed mb-10">
        Penelitian saya berfokus pada pengembangan <span class="text-white">aplikasi mobile berbasis Flutter</span> untuk
        mendiagnosis penyakit ikan koi menggunakan <span class="text-white">Sistem Pakar</span> dengan
        metode Forward &amp; Backward Chaining — menggabungkan rekayasa mobile dengan kecerdasan buatan.
      </p>

      <!-- Research Tags -->
      <div class="flex flex-wrap gap-3 mb-12">
        <span class="px-4 py-1.5 text-xs font-medium text-gray-300 bg-white/[0.04] border border-white/[0.08] rounded-full">Flutter</span>
        <span class="px-4 py-1.5 text-xs font-medium text-gray-300 bg-white/[0.04] border border-white/[0.08] rounded-full">Android</span>
        <span class="px-4 py-1.5 text-xs font-medium text-gray-300 bg-white/[0.04] border border-white/[0.08] rounded-full">Sistem Pakar</span>
        <span class="px-4 py-1.5 text-xs font-medium text-gray-300 bg-white/[0.04] border border-white/[0.08] rounded-full">Forward Chaining</span>
        <span class="px-4 py-1.5 text-xs font-medium text-gray-300 bg-white/[0.04] border border-white/[0.08] rounded-full">Backward Chaining</span>
      </div>

      <div class="flex gap-4 items-center">
        <div class="h-[1px] w-12 bg-accent-silver/30"></div>
        <p class="text-sm tracking-widest uppercase text-accent-silver/70 font-medium">IPK 3.8 · Cumlaude</p>
      </div>
    </div>
  </section>
</template>
