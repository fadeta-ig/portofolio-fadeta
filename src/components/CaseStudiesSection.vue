<script setup>
import { ref, onMounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-vue-next';
import { projects } from '../data/projects';
import { useGsapScrollReveal } from '../composables/useGsapScrollReveal';

gsap.registerPlugin(ScrollTrigger);

const sectionRef = ref(null);
const headerRef = ref(null);
const cardsRef = ref([]);

useGsapScrollReveal(headerRef, {
  y: 30,
  duration: 1,
  triggerStart: 'top 80%'
});

onMounted(() => {
  gsap.fromTo(cardsRef.value,
    { y: 60, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.9,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 60%',
      }
    }
  );
});
</script>

<template>
  <section id="case-studies" class="py-32 relative z-10" ref="sectionRef">
    <div class="max-w-7xl mx-auto px-6">

      <!-- Section Header -->
      <div class="mb-20 text-center max-w-3xl mx-auto" ref="headerRef">
        <h2 class="text-xs uppercase tracking-[0.3em] text-accent-icy mb-4 opacity-80">Case Studies</h2>
        <h3 class="text-3xl md:text-5xl font-light text-white leading-tight mb-8">
          Architected for <span class="text-gradient">Performance</span>
        </h3>
        <p class="text-gray-400 font-light text-lg">
          A selection of recent engineering work, blending robust backend logic with premium, liquid-smooth frontend interfaces.
        </p>
      </div>

      <!-- Projects Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
        <a
          v-for="(project, index) in projects"
          :key="project.id"
          :href="project.link"
          target="_blank"
          rel="noopener noreferrer"
          class="case-card group block relative rounded-2xl overflow-hidden border border-glass-border bg-glass-50 transition-all duration-500 hover:-translate-y-2 hover:border-accent-icy/30 hover:shadow-[0_8px_40px_rgba(160,240,255,0.08)]"
          :ref="el => { if (el) cardsRef.push(el) }"
        >
          <!-- Image Region -->
          <div class="relative h-52 sm:h-56 overflow-hidden">
            <img
              :src="project.image"
              :alt="project.title"
              class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              loading="lazy"
            />
            <!-- Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent"></div>

            <!-- Category Badge (floating on image) -->
            <span class="absolute top-4 left-4 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-accent-icy bg-obsidian/70 backdrop-blur-md border border-accent-icy/20 rounded-full">
              {{ project.category }}
            </span>

            <!-- Project Number (floating on image) -->
            <span class="absolute top-4 right-4 text-xs font-mono text-white/30 tracking-wider">
              {{ project.id }}
            </span>
          </div>

          <!-- Content Region -->
          <div class="p-6 pt-4 flex flex-col gap-4">
            <!-- Title Row -->
            <div class="flex items-start justify-between gap-3">
              <h4 class="text-xl font-semibold text-white leading-snug group-hover:text-accent-icy transition-colors duration-300">
                {{ project.title }}
              </h4>
              <div class="flex-shrink-0 mt-0.5 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-accent-icy/15 group-hover:border-accent-icy/30 transition-all duration-300">
                <ArrowUpRight class="w-4 h-4 text-gray-400 group-hover:text-accent-icy transition-colors duration-300" stroke-width="2" />
              </div>
            </div>

            <!-- Description -->
            <p class="text-sm text-gray-400 font-light leading-relaxed line-clamp-2">
              {{ project.description }}
            </p>

            <!-- Divider -->
            <div class="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            <!-- Footer: Tech Stack + CTA -->
            <div class="flex items-center justify-between gap-3">
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="(tech, i) in project.tech.split(',')"
                  :key="i"
                  class="px-2.5 py-0.5 text-[11px] font-medium text-gray-300 bg-white/[0.04] border border-white/[0.06] rounded-full group-hover:border-accent-icy/15 group-hover:text-gray-200 transition-all duration-300"
                >
                  {{ tech.trim() }}
                </span>
              </div>

              <span class="hidden sm:flex items-center gap-1.5 text-[11px] font-medium tracking-wider text-gray-500 group-hover:text-accent-icy transition-all duration-300 whitespace-nowrap">
                <span class="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">VIEW</span>
                <ArrowUpRight class="w-3.5 h-3.5" stroke-width="2" />
              </span>
            </div>
          </div>

          <!-- Subtle top accent line on hover -->
          <div class="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-accent-icy/0 via-accent-icy/60 to-accent-icy/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </a>
      </div>

    </div>
  </section>
</template>

<style scoped>
.case-card {
  will-change: transform;
}
</style>
