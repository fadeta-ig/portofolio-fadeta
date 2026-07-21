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
  <section id="services" class="py-24 md:py-36">
    <div ref="sectionRef" class="section-shell">
      <div class="mb-14 grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
        <div>
          <p class="section-kicker mb-6">Bentuk solusi</p>
          <h2 class="section-heading text-balance max-w-4xl">Pilih berdasarkan masalahnya, bukan nama <span class="font-display italic text-accent">paketnya.</span></h2>
        </div>
        <p class="max-w-xl text-base leading-relaxed text-text-secondary lg:justify-self-end lg:text-lg">
          Nama layanan membantu memberi gambaran awal. Scope akhirnya tetap mengikuti tujuan, kondisi, dan cara bisnis Anda bekerja.
        </p>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <article v-for="service in services" :key="service.slug" class="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-border-default bg-bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[var(--shadow-md)] md:p-8">
          <div class="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-accent-subtle opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
          <div class="relative flex items-start justify-between gap-5">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-text-primary text-bg-primary"><component :is="iconMap[service.slug]" class="h-5 w-5" stroke-width="1.7" /></div>
            <span class="text-xs font-bold tracking-[0.16em] text-text-tertiary">{{ service.number }}</span>
          </div>

          <div class="relative mt-9 flex flex-1 flex-col">
            <p class="max-w-lg text-[11px] font-bold uppercase leading-relaxed tracking-[0.12em] text-accent">{{ service.problem }}</p>
            <h3 class="mt-4 text-2xl font-bold tracking-[-0.03em] text-text-primary md:text-3xl">{{ service.name }}</h3>
            <p class="mt-4 max-w-xl leading-relaxed text-text-secondary">{{ service.summary }}</p>
            <div class="mt-7 flex flex-wrap gap-2">
              <span v-for="item in service.scope.slice(0, 3)" :key="item" class="tag">{{ item }}</span>
            </div>
            <RouterLink :to="`/solusi/${service.slug}`" :data-track="`service_${service.slug}`" class="mt-8 inline-flex w-fit items-center gap-2 text-sm font-bold text-text-primary transition-colors hover:text-accent">
              Lihat pendekatannya <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </RouterLink>
          </div>
        </article>
      </div>

      <div class="mt-8 flex flex-col gap-4 rounded-2xl border border-border-default bg-bg-secondary p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
        <p class="text-sm font-medium text-text-secondary"><strong class="text-text-primary">Belum tahu bentuk yang tepat?</strong> Itu wajar. Cukup jelaskan hal yang ingin diperbaiki.</p>
        <RouterLink to="/konsultasi" data-track="services_consultation" class="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-text-primary px-5 text-sm font-bold text-text-primary transition-colors hover:bg-text-primary hover:text-bg-primary">Ceritakan masalah</RouterLink>
      </div>
    </div>
  </section>
</template>
