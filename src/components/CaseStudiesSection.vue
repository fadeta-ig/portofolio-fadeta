<script setup>
import { ref } from 'vue';
import { ArrowRight, ArrowUpRight } from '@lucide/vue';
import { featuredProjects, labProjects } from '../data/projects';
import { useGsapScrollReveal } from '../composables/useGsapScrollReveal';

const sectionRef = ref(null);

useGsapScrollReveal(sectionRef, { y: 36, stagger: 0.1, duration: 0.8, triggerStart: 'top 82%', once: true });
</script>

<template>
  <section id="work" class="py-24 md:py-36">
    <div ref="sectionRef" class="section-shell">
      <div class="mb-14 grid gap-8 lg:grid-cols-[1fr_0.65fr] lg:items-end">
        <div>
          <p class="section-kicker mb-6">Karya pilihan</p>
          <h2 class="section-heading text-balance max-w-4xl">Bukti kerja, bukan sekadar <span class="font-display italic text-accent">janji.</span></h2>
        </div>
        <p class="max-w-xl text-base leading-relaxed text-text-secondary lg:justify-self-end lg:text-lg">
          Beberapa website yang dibangun untuk kebutuhan bisnis nyata—mulai dari memperkenalkan layanan sampai menjual produk.
        </p>
      </div>

      <div class="space-y-6">
        <article
          v-for="(project, index) in featuredProjects"
          :key="project.title"
          class="group grid overflow-hidden rounded-[2rem] border border-border-default bg-bg-card shadow-[var(--shadow-sm)] transition-shadow hover:shadow-[var(--shadow-md)] lg:grid-cols-2"
        >
          <div class="relative min-h-[17rem] overflow-hidden bg-bg-secondary lg:min-h-[29rem]" :class="index % 2 === 1 ? 'lg:order-2' : ''">
            <div class="absolute inset-0 z-10 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-25" />
            <img
              :src="project.image"
              :alt="`Tampilan website ${project.title}`"
              :width="project.width"
              :height="project.height"
              loading="lazy"
              decoding="async"
              class="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.025]"
            />
            <span class="absolute bottom-5 left-5 z-20 rounded-full border border-white/30 bg-black/35 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">{{ project.category }}</span>
          </div>

          <div class="flex flex-col justify-center p-7 md:p-10 lg:p-14" :class="index % 2 === 1 ? 'lg:order-1' : ''">
            <div class="mb-10 flex items-center gap-4">
              <span class="text-xs font-bold tracking-[0.18em] text-accent">PROJECT {{ project.id }}</span>
              <span class="h-px flex-1 bg-border-default" />
            </div>

            <h3 class="text-3xl font-bold tracking-[-0.04em] text-text-primary md:text-5xl">{{ project.title }}</h3>
            <p class="mt-6 text-base leading-relaxed text-text-secondary md:text-lg">{{ project.description }}</p>

            <div class="mt-8 flex flex-wrap gap-2">
              <span v-for="item in project.contribution" :key="item" class="tag">{{ item }}</span>
            </div>

            <a
              :href="project.link"
              target="_blank"
              rel="noopener noreferrer"
              :data-track="`portfolio_${project.id}`"
              class="mt-10 inline-flex w-fit items-center gap-3 text-sm font-bold text-text-primary transition-colors hover:text-accent"
            >
              Kunjungi website
              <span class="flex h-9 w-9 items-center justify-center rounded-full border border-border-default transition-colors group-hover:border-accent/40">
                <ArrowUpRight class="h-4 w-4" />
              </span>
            </a>
          </div>
        </article>
      </div>

      <div class="mt-14 border-t border-border-default pt-9">
        <div class="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-[0.16em] text-text-tertiary">Eksperimen & produk digital</p>
            <h3 class="mt-2 text-2xl font-bold tracking-tight text-text-primary">Yang juga pernah dibangun di lab.</h3>
          </div>
          <p class="text-sm text-text-secondary">Ruang untuk menguji ide, interaksi, dan solusi web.</p>
        </div>

        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <a
            v-for="project in labProjects"
            :key="project.title"
            :href="project.link"
            target="_blank"
            rel="noopener noreferrer"
            class="group flex min-h-28 flex-col justify-between rounded-2xl border border-border-default bg-bg-secondary/60 p-5 transition-all hover:-translate-y-1 hover:bg-bg-card"
          >
            <div class="flex items-start justify-between gap-4">
              <span class="text-[10px] font-bold uppercase tracking-[0.14em] text-text-tertiary">{{ project.category }}</span>
              <ArrowRight class="h-4 w-4 text-text-tertiary transition-transform group-hover:translate-x-1 group-hover:text-accent" />
            </div>
            <span class="mt-5 font-bold text-text-primary">{{ project.title }}</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
