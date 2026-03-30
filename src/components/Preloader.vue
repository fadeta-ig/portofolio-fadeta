<script setup>
import { ref, onMounted } from 'vue';
import gsap from 'gsap';

const emit = defineEmits(['loading-complete']);

const preloaderRef = ref(null);
const textRef = ref(null);
const progressRef = ref(null);
const loadingText = ref('INITIALIZING PROTOCOLS');

onMounted(() => {
  const tl = gsap.timeline();

  // Progress bar animation
  tl.to(progressRef.value, {
    scaleX: 1,
    duration: 2,
    ease: 'power2.inOut',
    onUpdate: function() {
      const progress = Math.round(this.progress() * 100);
      if (progress > 30 && progress < 70) loadingText.value = 'COMPILING SHADERS';
      if (progress >= 70) loadingText.value = 'RENDERING ENVIRONMENT';
      if (progress === 100) loadingText.value = 'SYSTEM READY';
    }
  });

  // Fade text out
  tl.to(textRef.value, {
    opacity: 0,
    y: -20,
    duration: 0.5,
    ease: 'power2.in'
  }, '+=0.2');

  // Split and slide doors up/down (or just fade out whole container)
  tl.to(preloaderRef.value, {
    opacity: 0,
    duration: 0.8,
    ease: 'power2.inOut',
    onComplete: () => {
      emit('loading-complete');
    }
  });
});
</script>

<template>
  <div 
    ref="preloaderRef" 
    class="fixed inset-0 z-[100] bg-obsidian flex flex-col items-center justify-center pointer-events-none"
  >
    <div ref="textRef" class="flex flex-col items-center">
      <div class="text-xs font-mono tracking-[0.5em] text-accent-icy mb-8">
        {{ loadingText }}
      </div>
      
      <!-- Minimalist progress line -->
      <div class="w-64 h-[1px] bg-white/10 relative overflow-hidden">
        <div 
          ref="progressRef" 
          class="absolute top-0 left-0 h-full w-full bg-accent-icy transform origin-left scale-x-0"
        ></div>
      </div>
    </div>
  </div>
</template>
