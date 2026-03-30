<script setup>
import { skills } from '../data/skills';
import SkillIcon from './SkillIcon.vue';

/** Combine all skills into a flat array, tripled for seamless CSS loop on wide screens */
const allSkills = [...skills.infrastructure, ...skills.development];
const duplicatedSkills = [...allSkills, ...allSkills, ...allSkills];
</script>

<template>
  <div class="w-full relative overflow-hidden py-10 bg-obsidian border-y border-glass-border">
    <!-- Fade overlays -->
    <div class="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-obsidian to-transparent z-10 pointer-events-none"></div>
    <div class="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-obsidian to-transparent z-10 pointer-events-none"></div>

    <!-- Scrolling container -->
    <div class="flex animate-marquee hover:[animation-play-state:paused] items-center">
      <div
        v-for="(skill, index) in duplicatedSkills"
        :key="index"
        class="flex-shrink-0 mx-8 flex items-center gap-3 text-gray-500 hover:text-white transition-colors duration-300"
      >
        <SkillIcon :config="skill.iconConfig" size="w-6 h-6" />
        <span class="text-sm font-medium tracking-wide whitespace-nowrap">{{ skill.name }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-33.3333%); }
}

.animate-marquee {
  width: max-content;
  animation: marquee 30s linear infinite;
}
</style>
