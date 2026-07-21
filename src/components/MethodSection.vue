<script setup>
import { ref } from 'vue';
import { BarChart3, Blocks, Focus, Search } from '@lucide/vue';
import { useGsapScrollReveal } from '../composables/useGsapScrollReveal';

const sectionRef = ref(null);
const principles = [
  { number: '01', icon: Search, title: 'Masalah sebelum fitur', text: 'Kami mulai dari hambatan yang ingin dibereskan, bukan daftar teknologi yang ingin dipasang.' },
  { number: '02', icon: Focus, title: 'Kejelasan sebelum visual', text: 'Pesan dan urutan informasi dipastikan lebih dulu supaya desain punya tugas yang jelas.' },
  { number: '03', icon: Blocks, title: 'Sistem sebelum skala', text: 'Struktur inti dibuat rapi agar halaman, konten, atau fitur baru bisa ditambahkan dengan alasan yang tepat.' },
  { number: '04', icon: BarChart3, title: 'Data sebelum penambahan', text: 'Setelah tayang, perubahan berikutnya melihat penggunaan dan kebutuhan nyata, bukan sekadar menambah ramai.' }
];

useGsapScrollReveal(sectionRef, { y: 32, stagger: 0.08, duration: 0.7, once: true });
</script>

<template>
  <section id="method" class="border-y border-border-default bg-bg-secondary py-24 md:py-32">
    <div ref="sectionRef" class="section-shell">
      <div class="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
        <div>
          <p class="section-kicker mb-6">Pendekatan masuk akal</p>
          <h2 class="section-heading text-balance">Tidak mulai dari “mau pakai teknologi <span class="font-display italic text-accent">apa?”</span></h2>
        </div>
        <p class="max-w-2xl text-base leading-relaxed text-text-secondary lg:justify-self-end lg:text-lg">Teknologi tetap penting, tetapi dipilih setelah tujuan, pengguna, cara kerja, dan kemampuan pengelolaannya dipahami.</p>
      </div>

      <div class="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <article v-for="item in principles" :key="item.number" class="rounded-[1.5rem] border border-border-default bg-bg-card p-6">
          <div class="flex items-center justify-between">
            <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-subtle text-accent"><component :is="item.icon" class="h-5 w-5" stroke-width="1.7" /></span>
            <span class="text-xs font-bold tracking-[0.16em] text-text-tertiary">{{ item.number }}</span>
          </div>
          <h3 class="mt-8 text-lg font-bold text-text-primary">{{ item.title }}</h3>
          <p class="mt-3 text-sm leading-relaxed text-text-secondary">{{ item.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
