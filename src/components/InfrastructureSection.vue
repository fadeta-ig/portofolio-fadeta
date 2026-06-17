<script setup>
import { ref } from 'vue';
import { useGsapScrollReveal } from '../composables/useGsapScrollReveal';
import { infraProjects } from '../data/infraProjects';

const sectionRef = ref(null);

useGsapScrollReveal(sectionRef, {
  y: 40,
  stagger: 0.08,
  duration: 0.8,
  triggerStart: 'top 78%'
});
</script>

<template>
  <section id="infrastructure" class="py-24 md:py-32 relative z-10">
    <div class="max-w-7xl mx-auto px-6" ref="sectionRef">

      <!-- Section Header -->
      <div class="mb-16 md:mb-20 text-center max-w-2xl mx-auto">
        <h2 class="section-label mb-4">Infrastruktur</h2>
        <h3 class="text-4xl md:text-5xl font-light text-text-primary section-heading leading-tight">
          Arsitektur <span class="text-gradient font-medium font-display italic">Jaringan & Server</span>
        </h3>
      </div>

      <!-- Bento Box Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[minmax(250px,auto)]">
        
        <div
          v-for="project in infraProjects"
          :key="project.id"
          class="group card relative overflow-hidden flex flex-col p-6 md:p-8 transition-all duration-500 hover:-translate-y-1"
          :class="project.gridClass"
        >
          <!-- WIDE LAYOUT -->
          <template v-if="project.type === 'wide'">
            <!-- Decorative Background -->
            <div class="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
               <!-- Animated network gradient -->
               <div class="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-accent-subtle to-transparent"></div>
               <!-- Signal dot -->
               <div class="absolute right-8 top-8 flex items-center justify-center">
                 <div class="absolute w-4 h-4 rounded-full bg-accent/40 animate-ping"></div>
                 <div class="relative w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]"></div>
               </div>
            </div>

            <div class="relative z-10 flex flex-col h-full justify-between">
              <div class="flex items-start justify-between mb-8">
                <div class="w-12 h-12 rounded-2xl bg-bg-secondary border border-border-default flex items-center justify-center group-hover:border-accent/40 group-hover:bg-accent-subtle transition-all duration-500">
                  <component :is="project.icon" class="w-6 h-6 text-text-primary group-hover:text-accent transition-colors duration-500" stroke-width="1.5" />
                </div>
                <span class="text-xs font-mono text-text-tertiary tracking-widest">{{ project.id }}</span>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-end mt-auto">
                <div>
                  <h4 class="text-xl md:text-2xl font-semibold text-text-primary mb-3 group-hover:text-accent transition-colors duration-300">
                    {{ project.title }}
                  </h4>
                  <p class="text-sm md:text-base font-normal text-text-secondary leading-relaxed max-w-md">
                    {{ project.description }}
                  </p>
                </div>
                <div class="flex flex-wrap gap-2 md:flex-col md:items-end">
                  <span v-for="tag in project.tags" :key="tag" class="tag bg-bg-primary border-border-subtle group-hover:border-accent/30">
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </template>

          <!-- TALL LAYOUT -->
          <template v-else-if="project.type === 'tall'">
            <!-- Decorative Background -->
            <div class="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
               <div class="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-accent-subtle to-transparent"></div>
               <!-- Animated grid lines mimicking a server rack -->
               <div class="absolute inset-0 bg-[linear-gradient(transparent_0px,transparent_39px,var(--color-border-subtle)_39px,var(--color-border-subtle)_40px)] bg-[length:100%_40px]"></div>
            </div>

            <div class="relative z-10 flex flex-col h-full">
              <div class="flex justify-between items-start mb-auto">
                <span class="text-xs font-mono text-text-tertiary tracking-widest">{{ project.id }}</span>
                <div class="w-12 h-12 rounded-2xl bg-bg-secondary border border-border-default flex items-center justify-center group-hover:border-accent/40 group-hover:bg-accent-subtle transition-all duration-500">
                  <component :is="project.icon" class="w-6 h-6 text-text-primary group-hover:text-accent transition-colors duration-500" stroke-width="1.5" />
                </div>
              </div>
              
              <div class="mt-12">
                <h4 class="text-xl md:text-2xl font-semibold text-text-primary mb-4 group-hover:text-accent transition-colors duration-300">
                  {{ project.title }}
                </h4>
                <p class="text-sm font-normal text-text-secondary leading-relaxed mb-8">
                  {{ project.description }}
                </p>
                <div class="flex flex-wrap gap-2">
                  <span v-for="tag in project.tags" :key="tag" class="tag bg-bg-primary border-border-subtle group-hover:border-accent/30">
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </template>

          <!-- SQUARE LAYOUT -->
          <template v-else>
            <!-- Decorative Background -->
            <div class="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
               <div class="absolute -bottom-8 -right-8 w-32 h-32 bg-accent blur-[40px] opacity-[0.15]"></div>
            </div>

            <div class="relative z-10 flex flex-col h-full">
              <div class="flex items-center justify-between mb-6">
                <div class="w-10 h-10 rounded-xl bg-bg-secondary border border-border-default flex items-center justify-center group-hover:border-accent/40 group-hover:bg-accent-subtle transition-all duration-500">
                  <component :is="project.icon" class="w-5 h-5 text-text-primary group-hover:text-accent transition-colors duration-500" stroke-width="1.5" />
                </div>
                <span class="text-[10px] font-mono text-text-tertiary tracking-widest">{{ project.id }}</span>
              </div>
              
              <h4 class="text-lg font-semibold text-text-primary mb-3 group-hover:text-accent transition-colors duration-300">
                {{ project.title }}
              </h4>
              
              <p class="text-sm font-normal text-text-secondary leading-relaxed mb-auto pb-6">
                {{ project.description }}
              </p>
              
              <div class="flex flex-wrap gap-1.5 mt-auto">
                <span v-for="tag in project.tags" :key="tag" class="tag text-[10px] bg-bg-primary border-border-subtle group-hover:border-accent/30">
                  {{ tag }}
                </span>
              </div>
            </div>
          </template>

        </div>
      </div>

    </div>
  </section>
</template>
