<script setup>
import { ref } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsapScrollReveal } from '../composables/useGsapScrollReveal';
import { skills } from '../data/skills';
import GlassCard from './GlassCard.vue';
import SkillIcon from './SkillIcon.vue';

gsap.registerPlugin(ScrollTrigger);

const sectionRef = ref(null);
const cardsRef = ref([]);

useGsapScrollReveal(sectionRef, {
  y: 50,
  stagger: 0.1,
  duration: 0.8,
  triggerStart: 'top 70%'
});
</script>

<template>
  <section id="expertise" class="py-16 relative z-10" ref="sectionRef">
    <div class="max-w-7xl mx-auto px-6">

      <div class="mb-16 md:mb-24">
        <h2 class="text-xs uppercase tracking-[0.3em] text-accent-icy mb-4 opacity-80">Keahlian</h2>
        <h3 class="text-3xl md:text-5xl font-light text-white">Kombinasi Keahlian</h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">

        <!-- Infrastructure Column -->
        <div class="space-y-6">
          <h4 class="text-xl font-medium tracking-wide text-gray-400 mb-8 border-b border-glass-border pb-4">Infrastruktur & Jaringan</h4>

          <GlassCard
            v-for="(skill, index) in skills.infrastructure"
            :key="skill.name"
            :title="skill.name"
            :variant="index === 0 ? 'highlight' : 'default'"
          >
            <template #icon>
              <SkillIcon :config="skill.iconConfig" class="text-accent-icy" />
            </template>
            <div class="w-full bg-white/5 rounded-full h-1.5 mt-4 overflow-hidden mb-1">
              <div class="bg-gradient-to-r from-accent-silver to-accent-icy h-1.5 rounded-full" :style="{ width: `${skill.level}%` }"></div>
            </div>
            <div class="text-right text-xs text-white/50">{{ skill.level }}%</div>
          </GlassCard>
        </div>

        <!-- Web Development Column -->
        <div class="space-y-6">
          <h4 class="text-xl font-medium tracking-wide text-gray-400 mb-8 border-b border-glass-border pb-4">Pengembangan Web</h4>

          <GlassCard
            v-for="(skill, index) in skills.development"
            :key="skill.name"
            :title="skill.name"
            :variant="index === 0 ? 'highlight' : 'default'"
          >
            <template #icon>
              <SkillIcon :config="skill.iconConfig" class="text-accent-icy" />
            </template>
            <div class="w-full bg-white/5 rounded-full h-1.5 mt-4 overflow-hidden mb-1">
              <div class="bg-gradient-to-r from-accent-silver to-accent-icy h-1.5 rounded-full" :style="{ width: `${skill.level}%` }"></div>
            </div>
            <div class="text-right text-xs text-white/50">{{ skill.level }}%</div>
          </GlassCard>
        </div>

      </div>
    </div>
  </section>
</template>
