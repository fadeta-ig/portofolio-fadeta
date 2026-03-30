<script setup>
import { ref } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, ExternalLink } from 'lucide-vue-next';
import { certPdf } from '../data/assets';
import { useGsapScrollReveal } from '../composables/useGsapScrollReveal';
import GlassCard from './GlassCard.vue';

gsap.registerPlugin(ScrollTrigger);

const contentRef = ref(null);

useGsapScrollReveal(contentRef, {
  y: 50,
  duration: 1,
  triggerStart: 'top 75%'
});
</script>

<template>
  <section id="certifications" class="py-24 relative z-10">
    <div class="max-w-5xl mx-auto px-6">

      <div class="mb-16 text-center max-w-3xl mx-auto" ref="contentRef">
        <h2 class="text-xs uppercase tracking-[0.3em] text-accent-icy mb-4 opacity-80">Credentials</h2>
        <h3 class="text-3xl md:text-5xl font-light text-white leading-tight mb-12">
          Certified <span class="font-medium italic text-gradient">Expertise</span>
        </h3>

        <!-- Certificate Card -->
        <a :href="certPdf" target="_blank" rel="noopener noreferrer" class="block group w-full max-w-2xl mx-auto">
          <GlassCard class="relative overflow-hidden transition-all duration-500 group-hover:-translate-y-2 group-hover:border-accent-icy/40 shadow-2xl p-8 md:p-12 text-left">

            <div class="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
              <Award class="w-32 h-32 text-accent-icy" />
            </div>

            <div class="flex items-center gap-4 mb-6 relative z-10">
              <div class="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-accent-icy group-hover:scale-110 transition-transform duration-500">
                <Award class="w-8 h-8" stroke-width="1.5" />
              </div>
              <div>
                <h4 class="text-2xl font-semibold tracking-tight text-white group-hover:text-accent-icy transition-colors duration-300">MTCNA</h4>
                <p class="text-sm font-medium text-gray-400 tracking-wide">MikroTik Certified Network Associate</p>
              </div>
            </div>

            <div class="space-y-4 mb-8 relative z-10">
              <p class="text-gray-300 font-light leading-relaxed">
                Official certification validating extensive knowledge in RouterOS software and RouterBOARD products, network design, implementation, and advanced troubleshooting.
              </p>
              <div class="flex items-center gap-6 text-sm text-gray-500 font-mono">
                <span>ID: 1911NA1056</span>
                <span>Issued: 13-11-2019</span>
              </div>
            </div>

            <div class="inline-flex items-center gap-2 text-sm font-medium tracking-wider text-accent-icy group-hover:translate-x-2 transition-transform duration-300 relative z-10">
              <span>VIEW ORIGINAL CERTIFICATE</span>
              <ExternalLink class="w-4 h-4" />
            </div>

          </GlassCard>
        </a>

      </div>

    </div>
  </section>
</template>
