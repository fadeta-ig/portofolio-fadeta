<script setup>
import { ref } from 'vue';
import { BarChart3, Blocks, Focus, Search } from '@lucide/vue';
import { useGsapScrollReveal } from '../composables/useGsapScrollReveal';

const sectionRef = ref(null);
const principles = [
  { number: '01', icon: Search, title: 'Pahami Titik Hambat', text: 'Cari tahu alasan utama kenapa website Anda kurang efektif sebelum menentukan solusinya.' },
  { number: '02', icon: Focus, title: 'Teks Ringkas & Menjual', text: 'Susun kalimat yang padat dan jelas agar pembaca langsung paham manfaat produk Anda.' },
  { number: '03', icon: Blocks, title: 'Kode Cepat & Ringan', text: 'Dibuat dengan standar modern agar website cepat dimuat di HP maupun laptop.' },
  { number: '04', icon: BarChart3, title: 'Evaluasi & Perkembangan', text: 'Penyesuaian fitur dilakukan berdasarkan kebutuhan nyata bisnis Anda di lapangan.' }
];

useGsapScrollReveal(sectionRef, { y: 32, stagger: 0.08, duration: 0.7, once: true });
</script>

<template>
  <section id="method" class="border-y border-border-default bg-bg-secondary py-24 md:py-32">
    <div ref="sectionRef" class="section-shell">
      <div class="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
        <div>
          <p class="section-kicker mb-6">Pendekatan Praktis</p>
          <h2 class="section-heading text-balance">Utamakan tujuan bisnis, baru pilih <span class="font-display italic text-accent">fitur.</span></h2>
        </div>
        <p class="max-w-2xl text-base leading-relaxed text-text-secondary lg:justify-self-end lg:text-lg">Kami tidak asal memasang fitur atau teknologi rumit yang justru membuat website lambat dan sulit Anda kelola sendiri.</p>
      </div>

      <div class="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <article v-for="item in principles" :key="item.number" class="card-surface p-6">
          <div class="flex items-center justify-between">
            <span class="liquid-icon flex h-11 w-11 items-center justify-center rounded-xl text-accent"><component :is="item.icon" class="h-5 w-5" stroke-width="1.7" /></span>
            <span class="text-xs font-bold tracking-[0.16em] text-text-tertiary">{{ item.number }}</span>
          </div>
          <h3 class="mt-8 text-lg font-bold text-text-primary">{{ item.title }}</h3>
          <p class="mt-3 text-sm leading-relaxed text-text-secondary">{{ item.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
