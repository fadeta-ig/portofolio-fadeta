<script setup>
import { ref } from 'vue';
import { ArrowRight } from '@lucide/vue';
import { useGsapScrollReveal } from '../composables/useGsapScrollReveal';

const sectionRef = ref(null);

useGsapScrollReveal(sectionRef, { y: 30, stagger: 0.1, duration: 0.75, triggerStart: 'top 84%', once: true });
</script>

<template>
  <section id="work" class="py-20 md:py-28">
    <div class="section-shell">
      <div ref="sectionRef" class="portfolio-teaser relative overflow-hidden rounded-[2rem] border border-border-default bg-bg-card px-6 py-14 shadow-[var(--shadow-sm)] md:px-12 md:py-20 lg:px-20">
        <div class="dot-grid absolute inset-0 opacity-25 [mask-image:linear-gradient(110deg,black,transparent_72%)]" aria-hidden="true" />
        <div class="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-accent opacity-[0.09] blur-[90px]" aria-hidden="true" />

        <div class="relative z-10 mx-auto max-w-4xl text-center">
          <p class="section-kicker mb-6">Portofolio Gandiva Labs</p>
          <h2 class="section-heading text-balance">
            Bukti kerja, bukan sekadar <span class="font-display italic text-accent">janji.</span>
          </h2>
          <p class="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">
            Beberapa website yang dibangun untuk kebutuhan bisnis nyata—mulai dari memperkenalkan layanan sampai menjual produk.
          </p>

          <RouterLink
            to="/portfolio"
            data-track="home_portfolio"
            class="group mt-8 inline-flex min-h-13 items-center justify-center gap-3 rounded-full bg-text-primary px-7 text-sm font-bold text-bg-primary transition-transform hover:-translate-y-1"
          >
            Lihat portofolio
            <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.portfolio-teaser::after {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: inset 0 1px 0 color-mix(in srgb, var(--text-primary) 7%, transparent);
  content: '';
  pointer-events: none;
}
</style>
