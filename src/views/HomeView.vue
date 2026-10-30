<script setup>
import { defineAsyncComponent } from 'vue';
import HeroSection from '../components/HeroSection.vue';
import TechMarquee from '../components/TechMarquee.vue';
import AboutSection from '../components/AboutSection.vue';

const MethodSection = defineAsyncComponent(() => import('../components/MethodSection.vue'));
const ExpertiseSection = defineAsyncComponent(() => import('../components/ExpertiseSection.vue'));
const EstimatorCalloutSection = defineAsyncComponent(() => import('../components/EstimatorCalloutSection.vue'));
const CaseStudiesSection = defineAsyncComponent(() => import('../components/CaseStudiesSection.vue'));
const InfrastructureSection = defineAsyncComponent(() => import('../components/InfrastructureSection.vue'));
const CertificationsSection = defineAsyncComponent(() => import('../components/CertificationsSection.vue'));
const LeadFormSection = defineAsyncComponent(() => import('../components/LeadFormSection.vue'));
const FaqSection = defineAsyncComponent(() => import('../components/FaqSection.vue'));
const ContactSection = defineAsyncComponent(() => import('../components/ContactSection.vue'));
</script>

<template>
  <main id="main-content" tabindex="-1" class="flex-grow w-full">
    <HeroSection />
    <TechMarquee />
    <AboutSection />
    <MethodSection />
    <ExpertiseSection />
    <EstimatorCalloutSection />
    <CaseStudiesSection />
    <InfrastructureSection />
    <CertificationsSection />
    <LeadFormSection />
    <FaqSection />
    <ContactSection />
  </main>
</template>
