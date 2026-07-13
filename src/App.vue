<script setup>
import NavBar from './components/NavBar.vue';
import HeroSection from './components/HeroSection.vue';
import TechMarquee from './components/TechMarquee.vue';
import AboutSection from './components/AboutSection.vue';
import ExpertiseSection from './components/ExpertiseSection.vue';
import CaseStudiesSection from './components/CaseStudiesSection.vue';
import InfrastructureSection from './components/InfrastructureSection.vue';
import CertificationsSection from './components/CertificationsSection.vue';
import FaqSection from './components/FaqSection.vue';
import ContactSection from './components/ContactSection.vue';
</script>

<template>
  <div class="min-h-screen bg-bg-primary text-text-primary font-sans flex flex-col relative w-full overflow-x-hidden theme-transition">
    <NavBar />

    <main class="flex-grow w-full">
      <HeroSection />
      <TechMarquee />
      <AboutSection />
      <ExpertiseSection />
      <CaseStudiesSection />
      <InfrastructureSection />
      <CertificationsSection />
      <FaqSection />
      <ContactSection />
    </main>
  </div>
</template>
