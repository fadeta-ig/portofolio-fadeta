<script setup>
import { ref } from 'vue';
import { useGsapScrollReveal } from '../composables/useGsapScrollReveal';
import { skills } from '../data/skills';
import GlassCard from './GlassCard.vue';
import SkillIcon from './SkillIcon.vue';

const sectionRef = ref(null);

useGsapScrollReveal(sectionRef, {
  y: 40,
  stagger: 0.08,
  duration: 0.8,
  triggerStart: 'top 75%'
});
</script>

<template>
  <section id="expertise" class="py-20 md:py-28 relative z-10" ref="sectionRef">
    <div class="max-w-7xl mx-auto px-6">

      <div class="mb-16 md:mb-24">
        <h2 class="section-label mb-4">Keahlian</h2>
        <h3 class="text-3xl md:text-5xl font-light text-text-primary section-heading">Kombinasi Keahlian</h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">

        <!-- Infrastructure Column -->
        <div class="space-y-5">
          <h4 class="text-lg font-medium tracking-wide text-text-secondary mb-6 border-b border-border-default pb-4">
            Infrastruktur & Jaringan
          </h4>

          <GlassCard
            v-for="(skill, index) in skills.infrastructure"
            :key="skill.name"
            :title="skill.name"
            :variant="index === 0 ? 'highlight' : 'default'"
          >
            <template #icon>
              <SkillIcon :config="skill.iconConfig" class="text-accent" />
            </template>
            <div class="w-full bg-bg-tertiary rounded-full h-1.5 mt-4 overflow-hidden mb-1">
              <div
                class="h-1.5 rounded-full transition-all duration-500"
                style="background: linear-gradient(90deg, var(--accent), var(--accent-hover));"
                :style="{ width: `${skill.level}%` }"
              ></div>
            </div>
            <div class="text-right text-xs text-text-tertiary">{{ skill.level }}%</div>
          </GlassCard>
        </div>

        <!-- Web Development Column -->
        <div class="space-y-5">
          <h4 class="text-lg font-medium tracking-wide text-text-secondary mb-6 border-b border-border-default pb-4">
            Pengembangan Web
          </h4>

          <GlassCard
            v-for="(skill, index) in skills.development"
            :key="skill.name"
            :title="skill.name"
            :variant="index === 0 ? 'highlight' : 'default'"
          >
            <template #icon>
              <SkillIcon :config="skill.iconConfig" class="text-accent" />
            </template>
            <div class="w-full bg-bg-tertiary rounded-full h-1.5 mt-4 overflow-hidden mb-1">
              <div
                class="h-1.5 rounded-full transition-all duration-500"
                style="background: linear-gradient(90deg, var(--accent), var(--accent-hover));"
                :style="{ width: `${skill.level}%` }"
              ></div>
            </div>
            <div class="text-right text-xs text-text-tertiary">{{ skill.level }}%</div>
          </GlassCard>
        </div>

      </div>
    </div>
  </section>
</template>
