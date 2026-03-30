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
  <section id="about" class="min-h-screen py-24 flex items-center justify-center relative z-10">
    <div class="max-w-4xl mx-auto px-6" ref="contentRef">
      <h2 class="text-xs uppercase tracking-[0.3em] text-accent-icy mb-8 opacity-80">About Me</h2>
      
      <p class="text-3xl md:text-5xl font-light leading-tight text-white/90 mb-10">
        I believe that a truly premium digital experience requires more than just beautiful frontend code.
      </p>
      
      <p class="text-xl md:text-2xl font-light text-gray-400 leading-relaxed mb-10">
        It demands a robust, flawlessly architected backbone. As a hybrid <span class="text-white">IT Infrastructure Engineer</span> and <span class="text-white">Web Developer</span>, I bridge the gap between heavy-duty network architectures and pixel-perfect, liquid-smooth user interfaces.
      </p>

      <div class="flex gap-4 items-center mt-12">
        <div class="h-[1px] w-12 bg-accent-silver/30"></div>
        <p class="text-sm tracking-widest uppercase text-accent-silver/70 font-medium">Zero-Gravity Code</p>
      </div>
    </div>
  </section>
</template>
