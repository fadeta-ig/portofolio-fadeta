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
      <h2 class="text-xs uppercase tracking-[0.3em] text-accent-icy mb-8 opacity-80">Education</h2>

      <p class="text-3xl md:text-5xl font-light leading-tight text-white/90 mb-10">
        Graduated <span class="text-gradient font-medium italic">Cumlaude</span> from
        Telkom University Surabaya.
      </p>

      <p class="text-xl md:text-2xl font-light text-gray-400 leading-relaxed mb-6">
        Earned a <span class="text-white">Bachelor's degree in Computer Engineering</span> (S1 Teknik Komputer)
        with a <span class="text-white">GPA of 3.8</span>, combining deep systems-level knowledge with a passion
        for crafting elegant software solutions.
      </p>

      <p class="text-xl md:text-2xl font-light text-gray-400 leading-relaxed mb-10">
        My research focused on developing a <span class="text-white">Flutter-based Android application</span> for
        diagnosing Koi fish diseases using an <span class="text-white">Expert System</span> with
        Forward &amp; Backward Chaining methods — merging mobile engineering with artificial intelligence.
      </p>

      <!-- Research Tags -->
      <div class="flex flex-wrap gap-3 mb-12">
        <span class="px-4 py-1.5 text-xs font-medium text-gray-300 bg-white/[0.04] border border-white/[0.08] rounded-full">Flutter</span>
        <span class="px-4 py-1.5 text-xs font-medium text-gray-300 bg-white/[0.04] border border-white/[0.08] rounded-full">Android</span>
        <span class="px-4 py-1.5 text-xs font-medium text-gray-300 bg-white/[0.04] border border-white/[0.08] rounded-full">Expert System</span>
        <span class="px-4 py-1.5 text-xs font-medium text-gray-300 bg-white/[0.04] border border-white/[0.08] rounded-full">Forward Chaining</span>
        <span class="px-4 py-1.5 text-xs font-medium text-gray-300 bg-white/[0.04] border border-white/[0.08] rounded-full">Backward Chaining</span>
      </div>

      <div class="flex gap-4 items-center">
        <div class="h-[1px] w-12 bg-accent-silver/30"></div>
        <p class="text-sm tracking-widest uppercase text-accent-silver/70 font-medium">GPA 3.8 · Cumlaude</p>
      </div>
    </div>
  </section>
</template>
