<script setup>
import { ref } from 'vue';
import { useGsapScrollReveal } from '../composables/useGsapScrollReveal';
import { infraProjects } from '../data/infraProjects';

const sectionRef = ref(null);

useGsapScrollReveal(sectionRef, {
  y: 40,
  stagger: 0.1,
  duration: 0.8,
  triggerStart: 'top 75%'
});
</script>

<template>
  <section id="infrastructure" class="py-16 relative z-10">
    <div class="max-w-7xl mx-auto px-6" ref="sectionRef">

      <!-- Section Header -->
      <div class="mb-12">
        <h2 class="text-xs uppercase tracking-[0.3em] text-accent-icy mb-4 opacity-80">Infrastruktur</h2>
        <h3 class="text-3xl md:text-4xl font-light text-white">Proyek <span class="text-gradient font-medium">Infrastruktur</span></h3>
      </div>

      <!-- Project Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="project in infraProjects"
          :key="project.id"
          class="group relative rounded-xl border border-glass-border bg-glass-50 p-6 transition-all duration-300 hover:border-accent-icy/30 hover:-translate-y-1"
        >
          <!-- Top row: number + icon -->
          <div class="flex items-center justify-between mb-4">
            <span class="text-xs font-mono text-gray-600">{{ project.id }}</span>
            <div class="w-9 h-9 rounded-lg bg-accent-icy/10 border border-accent-icy/15 flex items-center justify-center group-hover:bg-accent-icy/15 transition-colors duration-300">
              <component :is="project.icon" class="w-4 h-4 text-accent-icy" stroke-width="1.5" />
            </div>
          </div>

          <!-- Title -->
          <h4 class="text-base font-semibold text-white mb-2 group-hover:text-accent-icy transition-colors duration-300">
            {{ project.title }}
          </h4>

          <!-- Description -->
          <p class="text-sm font-light text-gray-400 leading-relaxed mb-4">
            {{ project.description }}
          </p>

          <!-- Tags -->
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="tag in project.tags"
              :key="tag"
              class="px-2.5 py-0.5 text-[10px] font-medium text-gray-400 bg-white/[0.03] border border-white/[0.06] rounded-full group-hover:border-accent-icy/15 transition-colors duration-300"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
