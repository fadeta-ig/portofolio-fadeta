<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from '@lucide/vue';
import ContactSection from '../components/ContactSection.vue';
import { featuredProjects } from '../data/projects';

const route = useRoute();
const project = computed(() => featuredProjects.find((item) => item.slug === route.params.slug));
</script>

<template>
  <main v-if="project" id="main-content" tabindex="-1" class="flex-grow bg-bg-primary pt-28 md:pt-36">
    <section class="pb-20 md:pb-28">
      <div class="section-shell">
        <RouterLink to="/portfolio" class="inline-flex items-center gap-2 text-sm font-bold text-text-secondary transition-colors hover:text-accent">
          <ArrowLeft class="h-4 w-4" /> Kembali ke semua karya
        </RouterLink>
        <div class="mt-12 grid gap-10 lg:grid-cols-[1fr_0.45fr] lg:items-end">
          <div>
            <p class="section-kicker mb-6">Studi kasus · {{ project.category }}</p>
            <h1 class="text-balance text-[clamp(3.6rem,8vw,8rem)] font-medium leading-[0.86] tracking-[-0.06em] text-text-primary">{{ project.title }}</h1>
          </div>
          <div class="lg:pb-2">
            <p class="text-lg leading-relaxed text-text-secondary">{{ project.description }}</p>
            <a v-if="project.link" :href="project.link" target="_blank" rel="noopener noreferrer" :data-track="`case_${project.slug}_visit`" class="mt-6 inline-flex items-center gap-2 text-sm font-bold text-text-primary hover:text-accent">Kunjungi website <ArrowUpRight class="h-4 w-4" /></a>
            <span v-else class="mt-6 inline-flex items-center text-sm font-bold text-text-tertiary">Tautan website menyusul</span>
          </div>
        </div>

        <div class="mt-14 overflow-hidden rounded-[1.75rem] border border-border-default bg-bg-secondary shadow-[var(--shadow-sm)]">
          <img :src="project.image" :alt="`Tampilan website ${project.title}`" :width="project.width" :height="project.height" class="w-full object-cover object-top" decoding="async" />
        </div>
      </div>
    </section>

    <section class="border-y border-border-default bg-bg-secondary py-20 md:py-28">
      <div class="section-shell grid gap-12 lg:grid-cols-[0.62fr_1.38fr] lg:gap-20">
        <div>
          <p class="section-kicker mb-5">Kebutuhan proyek</p>
          <h2 class="section-heading text-balance">Konteks sebelum <span class="font-display italic text-accent">solusi.</span></h2>
        </div>
        <div>
          <p class="text-xl leading-relaxed text-text-primary md:text-2xl">{{ project.need }}</p>
          <p class="mt-6 max-w-3xl text-base leading-relaxed text-text-secondary">{{ project.approach }}</p>
        </div>
      </div>
    </section>

    <section class="py-20 md:py-28">
      <div class="section-shell">
        <div class="grid gap-4 md:grid-cols-3">
          <article v-for="(decision, index) in project.decisions" :key="decision.title" class="card-surface p-6 md:p-8">
            <span class="text-xs font-bold tracking-[0.16em] text-accent">0{{ index + 1 }}</span>
            <h3 class="mt-7 text-xl font-bold text-text-primary">{{ decision.title }}</h3>
            <p class="mt-4 text-sm leading-relaxed text-text-secondary">{{ decision.text }}</p>
          </article>
        </div>

        <div class="mt-12 grid gap-8 rounded-[1.75rem] bg-[#171511] p-7 text-[#f5f0e7] md:grid-cols-[0.75fr_1.25fr] md:p-10 lg:p-12">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-[#ee8859]">Hasil yang diserahkan</p>
            <div class="mt-5 flex flex-wrap gap-2">
              <span v-for="item in project.contribution" :key="item" class="rounded-full border border-white/15 px-3 py-1.5 text-xs font-bold text-[#bcb4a9]">{{ item }}</span>
            </div>
          </div>
          <div>
            <p class="text-xl leading-relaxed text-[#f5f0e7] md:text-2xl">{{ project.result }}</p>
            <p class="mt-5 flex items-start gap-3 text-sm leading-relaxed text-[#aaa298]"><Check class="mt-0.5 h-4 w-4 shrink-0 text-[#ee8859]" /> Ringkasan ini hanya menyatakan lingkup dan keluaran proyek; tidak menggunakan angka performa yang belum diverifikasi.</p>
          </div>
        </div>

        <div class="mt-6 rounded-[1.75rem] border border-border-default bg-bg-card p-7 md:flex md:items-center md:justify-between md:gap-8 md:p-10">
          <h2 class="max-w-2xl text-2xl font-bold tracking-[-0.035em] text-text-primary md:text-3xl">Punya konteks yang mirip? Mulai dari masalahnya, lalu kita tentukan bentuk yang tepat.</h2>
          <RouterLink to="/konsultasi" class="mt-7 inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-text-primary px-6 text-sm font-bold text-bg-primary md:mt-0">Ceritakan kebutuhan <ArrowRight class="h-4 w-4" /></RouterLink>
        </div>
      </div>
    </section>
    <ContactSection />
  </main>
</template>
