<script setup>
import { ref } from 'vue';
import { ArrowRight, ArrowUpRight } from '@lucide/vue';
import { useGsapScrollReveal } from '../composables/useGsapScrollReveal';
import { featuredProjects } from '../data/projects';

const sectionRef = ref(null);
useGsapScrollReveal(sectionRef, { y: 30, stagger: 0.08, duration: 0.75, triggerStart: 'top 84%', once: true });
</script>

<template>
  <section id="work" class="border-y border-border-default bg-bg-secondary py-24 md:py-32">
    <div ref="sectionRef" class="section-shell">
      <div class="grid gap-8 lg:grid-cols-[1fr_0.6fr] lg:items-end">
        <div>
          <p class="section-kicker mb-6">Hasil kerja</p>
          <h2 class="section-heading text-balance">Lihat konteks dan keputusan di balik setiap <span class="font-display italic text-accent">website.</span></h2>
        </div>
        <p class="max-w-xl text-base leading-relaxed text-text-secondary lg:justify-self-end lg:text-lg">Tidak ada angka performa yang dibuat-buat. Yang ditampilkan adalah kebutuhan proyek, pendekatan, dan keluaran yang memang dikerjakan.</p>
      </div>

      <div class="mt-12 grid gap-5 lg:grid-cols-3">
        <article v-for="project in featuredProjects" :key="project.slug" class="group flex flex-col overflow-hidden rounded-[1.6rem] border border-border-default bg-bg-card shadow-[var(--shadow-sm)]">
          <RouterLink :to="`/hasil/${project.slug}`" class="block aspect-[16/10] overflow-hidden bg-bg-tertiary" :aria-label="`Baca studi kasus ${project.title}`">
            <img :src="project.image" :alt="`Tampilan website ${project.title}`" :width="project.width" :height="project.height" loading="lazy" decoding="async" class="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.025]" />
          </RouterLink>
          <div class="flex flex-1 flex-col p-6">
            <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-accent">{{ project.category }}</p>
            <h3 class="mt-3 text-2xl font-bold tracking-[-0.035em] text-text-primary">{{ project.title }}</h3>
            <p class="mt-4 text-sm leading-relaxed text-text-secondary">{{ project.need }}</p>
            <RouterLink :to="`/hasil/${project.slug}`" :data-track="`home_case_${project.slug}`" class="mt-7 inline-flex w-fit items-center gap-2 text-sm font-bold text-text-primary hover:text-accent">Baca ringkasan proyek <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" /></RouterLink>
          </div>
        </article>
      </div>

      <div class="mt-8 flex flex-col gap-4 rounded-2xl border border-border-default bg-bg-primary p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
        <p class="text-sm leading-relaxed text-text-secondary">Ada juga sistem internal dan eksperimen yang tidak semuanya dapat ditampilkan secara publik.</p>
        <RouterLink to="/portfolio" data-track="home_portfolio" class="group inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-text-primary px-5 text-sm font-bold text-bg-primary">Lihat semua karya <ArrowUpRight class="h-4 w-4" /></RouterLink>
      </div>
    </div>
  </section>
</template>
