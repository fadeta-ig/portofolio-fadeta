<script setup>
import { ref } from 'vue'
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import TechMarquee from './components/TechMarquee.vue'
import AboutSection from './components/AboutSection.vue'
import ExpertiseSection from './components/ExpertiseSection.vue'
import CaseStudiesSection from './components/CaseStudiesSection.vue'
import CertificationsSection from './components/CertificationsSection.vue'
import EducationSection from './components/EducationSection.vue'
import ContactSection from './components/ContactSection.vue'
import Preloader from './components/Preloader.vue'

const isLoaded = ref(false)

const handleLoadingComplete = () => {
  isLoaded.value = true
}
</script>

<template>
  <div class="min-h-screen bg-obsidian text-white font-sans selection:bg-accent-icy selection:text-obsidian flex flex-col relative w-full overflow-x-hidden">
    
    <!-- Preloader Overlay -->
    <Preloader v-if="!isLoaded" @loading-complete="handleLoadingComplete" />

    <!-- Main Content (Hidden from layout/interaction until loaded, but allowed to mount so GSAP/ThreeJS can prepare) -->
    <div :class="{'opacity-0 pointer-events-none': !isLoaded, 'opacity-100 transition-opacity duration-1000 ease-out': isLoaded}">
      <!-- Global Navigation -->
      <NavBar />
      
      <main class="flex-grow w-full">
        <HeroSection />
        <TechMarquee />
        <AboutSection />
        <EducationSection />
        <ExpertiseSection />
        <CaseStudiesSection />
        <CertificationsSection />
        <ContactSection />
      </main>
    </div>

  </div>
</template>
