<script setup>
import { ref } from 'vue';
import { Award, ExternalLink } from 'lucide-vue-next';
import { certPdf } from '../data/assets';
import { useGsapScrollReveal } from '../composables/useGsapScrollReveal';

const contentRef = ref(null);

useGsapScrollReveal(contentRef, {
  y: 40,
  duration: 1,
  triggerStart: 'top 78%'
});
</script>

<template>
  <section id="certifications" class="py-20 md:py-24 relative z-10">
    <div class="max-w-5xl mx-auto px-6">

      <div class="mb-16 text-center max-w-3xl mx-auto" ref="contentRef">
        <h2 class="section-label mb-4">Kredensial</h2>
        <h3 class="text-3xl md:text-5xl font-light text-text-primary leading-tight mb-12 section-heading">
          <span class="font-medium font-display italic text-gradient">Sertifikasi</span> Profesional
        </h3>

        <!-- Certificate Card -->
        <a :href="certPdf" target="_blank" rel="noopener noreferrer" class="block group w-full max-w-2xl mx-auto">
          <div class="card relative overflow-hidden transition-all duration-500 group-hover:-translate-y-2 group-hover:border-accent/40 p-8 md:p-12 text-left">

            <!-- Background Award Icon -->
            <div class="absolute top-0 right-0 p-8 opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-500">
              <Award class="w-32 h-32 text-accent" />
            </div>

            <div class="flex items-center gap-4 mb-6 relative z-10">
              <div class="p-3.5 rounded-2xl bg-accent-subtle border border-accent/15 text-accent group-hover:scale-110 transition-transform duration-500">
                <Award class="w-8 h-8" stroke-width="1.5" />
              </div>
              <div>
                <h4 class="text-2xl font-semibold tracking-tight text-text-primary group-hover:text-accent transition-colors duration-300">MTCNA</h4>
                <p class="text-sm font-medium text-text-secondary tracking-wide">MikroTik Certified Network Associate</p>
              </div>
            </div>

            <div class="space-y-4 mb-8 relative z-10">
              <p class="text-text-secondary font-normal leading-relaxed">
                Sertifikasi resmi yang memvalidasi pengetahuan mendalam tentang perangkat lunak RouterOS dan produk RouterBOARD, perancangan jaringan, implementasi, serta pemecahan masalah tingkat lanjut.
              </p>
              <div class="flex items-center gap-6 text-sm text-text-tertiary font-mono">
                <span>ID: 1911NA1056</span>
                <span>Diterbitkan: 13-11-2019</span>
              </div>
            </div>

            <div class="inline-flex items-center gap-2 text-sm font-medium tracking-wider text-accent group-hover:translate-x-2 transition-transform duration-300 relative z-10">
              <span>LIHAT SERTIFIKAT ASLI</span>
              <ExternalLink class="w-4 h-4" />
            </div>

          </div>
        </a>

      </div>

    </div>
  </section>
</template>
