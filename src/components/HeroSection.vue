<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import LiquidGlassOrb from './LiquidGlassOrb.vue';

const roles = ["IT Infrastructure", "Network Engineer", "Web Developer"];
const roleText = ref(roles[0]);
let currentRoleIndex = 0;
let animationTimeout;

const nameLabel = ref(null);
const roleLabel = ref(null);
const heroContainer = ref(null);

onMounted(() => {
  // Initial entrance animation
  const tl = gsap.timeline();
  
  tl.fromTo(heroContainer.value, 
    { opacity: 0 }, 
    { opacity: 1, duration: 1.5, ease: 'power2.out' }
  )
  .fromTo(nameLabel.value,
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
    "-=0.5"
  )
  .fromTo(roleLabel.value,
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
    "-=0.7"
  );

  // Role Cycling Animation
  const cycleRoles = () => {
    gsap.to(roleLabel.value, {
      y: -20,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => {
        currentRoleIndex = (currentRoleIndex + 1) % roles.length;
        roleText.value = roles[currentRoleIndex];
        
        gsap.fromTo(roleLabel.value,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
        );
      }
    });

    animationTimeout = setTimeout(cycleRoles, 3000);
  };

  animationTimeout = setTimeout(cycleRoles, 3000);
});

onUnmounted(() => {
  if (animationTimeout) clearTimeout(animationTimeout);
});
</script>

<template>
  <section id="hero" class="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden" ref="heroContainer">
    
    <!-- 3D Background Orb -->
    <div class="absolute inset-0 z-0 flex items-center justify-center">
      <LiquidGlassOrb />
    </div>
    
    <!-- Foreground Content -->
    <div class="relative z-10 text-center flex flex-col items-center select-none pointer-events-none">
      <h2 class="text-xs uppercase tracking-[0.3em] text-accent-icy mb-4 opacity-80">Portofolio</h2>
      
      <h1 ref="nameLabel" class="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-6">
        Fadeta Ilhan Gandhi
      </h1>
      
      <div class="h-10 overflow-hidden flex items-center justify-center">
        <p ref="roleLabel" class="text-xl md:text-2xl text-gray-400 font-light tracking-wide text-gradient">
          {{ roleText }}
        </p>
      </div>
    </div>
    
    <!-- Scroll indicator -->
    <div class="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center opacity-50 animate-pulse">
      <span class="text-xs uppercase tracking-widest mb-2">Gulir ke Bawah</span>
      <div class="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
    </div>
  </section>
</template>
