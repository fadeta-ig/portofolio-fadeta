<script setup>
import { ref } from 'vue';
import { ArrowRight, LayoutTemplate, MousePointer2, ShoppingBag, Wrench } from '@lucide/vue';
import { useGsapScrollReveal } from '../composables/useGsapScrollReveal';
import { services } from '../data/services';

const sectionRef = ref(null);
const iconMap = {
  'company-profile': LayoutTemplate,
  'landing-page': MousePointer2,
  'toko-online': ShoppingBag,
  'website-custom': Wrench
};

useGsapScrollReveal(sectionRef, { y: 36, stagger: 0.08, duration: 0.75, once: true });
</script>

<template>
  <section id="services" class="py-20 md:py-24">
    <div ref="sectionRef" class="section-shell">
      <div class="mb-10 grid gap-6 lg:grid-cols-[1.1fr_0.45fr] lg:items-end">
        <div>
          <p class="section-kicker mb-5">Bentuk solusi</p>
          <h2 class="section-heading max-w-4xl text-balance lg:text-[clamp(2.6rem,4.2vw,4.2rem)]">Pilih berdasarkan masalahnya, bukan nama <span class="font-display italic text-accent">paketnya.</span></h2>
        </div>
        <p class="max-w-xl text-sm leading-relaxed text-text-secondary lg:justify-self-end lg:text-base">
          Nama layanan membantu memberi gambaran awal. Scope akhirnya tetap mengikuti tujuan, kondisi, dan cara bisnis Anda bekerja.
        </p>
      </div>

      <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <article v-for="service in services" :key="service.slug" class="group relative min-w-0 overflow-hidden rounded-[1.4rem] border border-border-default bg-bg-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/45 hover:shadow-[var(--shadow-md)]">
          <RouterLink :to="`/solusi/${service.slug}`" :data-track="`service_${service.slug}`" class="relative flex h-full flex-col p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/60 lg:p-6" :aria-label="`Lihat pendekatan ${service.name}`">
            <span class="absolute inset-x-6 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100 group-focus-within:scale-x-100" aria-hidden="true" />

            <div class="flex items-center justify-between gap-5">
              <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-text-primary text-bg-primary shadow-[var(--shadow-sm)]">
                <component :is="iconMap[service.slug]" class="h-[18px] w-[18px]" stroke-width="1.7" />
              </span>
              <span class="text-[10px] font-bold tabular-nums tracking-[0.18em] text-text-tertiary">{{ service.number }}</span>
            </div>

            <div class="mt-6">
              <h3 class="text-xl font-bold tracking-[-0.035em] text-text-primary lg:text-[1.35rem]">{{ service.name }}</h3>
              <p class="mt-3 line-clamp-3 text-xs font-semibold leading-relaxed text-accent">{{ service.problem }}</p>
              <p class="mt-3 line-clamp-3 text-sm leading-relaxed text-text-secondary">{{ service.summary }}</p>
            </div>

            <div class="mb-5 mt-5 flex flex-wrap gap-1.5">
              <span v-for="item in service.scope.slice(0, 2)" :key="item" class="rounded-full border border-border-default bg-bg-secondary/70 px-2.5 py-1 text-[9px] font-bold text-text-tertiary">{{ item }}</span>
            </div>

            <div class="mt-auto flex items-center justify-between border-t border-border-subtle pt-5 text-xs font-bold text-text-primary">
              <span>Lihat pendekatan</span>
              <span class="flex h-8 w-8 items-center justify-center rounded-full border border-border-default transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white">
                <ArrowRight class="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            </div>
          </RouterLink>
        </article>
      </div>

      <div class="mt-5 flex flex-col gap-3 rounded-2xl border border-border-default bg-bg-secondary px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-sm font-medium text-text-secondary"><strong class="text-text-primary">Belum tahu bentuk yang tepat?</strong> Itu wajar. Cukup jelaskan hal yang ingin diperbaiki.</p>
        <RouterLink to="/konsultasi" data-track="services_consultation" class="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border border-text-primary px-5 text-xs font-bold text-text-primary transition-colors hover:bg-text-primary hover:text-bg-primary">Ceritakan masalah</RouterLink>
      </div>
    </div>
  </section>
</template>
