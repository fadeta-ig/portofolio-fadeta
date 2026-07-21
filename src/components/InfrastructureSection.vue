<script setup>
import { ref } from 'vue';
import { Compass, MessageSquareText, PenTool, Rocket } from '@lucide/vue';
import { useGsapScrollReveal } from '../composables/useGsapScrollReveal';

const sectionRef = ref(null);

const steps = [
  {
    number: '01',
    icon: MessageSquareText,
    title: 'Kenalan & brief',
    text: 'Kita bahas bisnis, audiens, masalah saat ini, dan hasil yang ingin dicapai.'
  },
  {
    number: '02',
    icon: Compass,
    title: 'Arah & struktur',
    text: 'Kami menyusun halaman, alur informasi, serta pesan utama sebelum masuk ke visual.'
  },
  {
    number: '03',
    icon: PenTool,
    title: 'Desain & build',
    text: 'Tampilan dan website dibangun bertahap, lalu diperiksa di desktop dan mobile.'
  },
  {
    number: '04',
    icon: Rocket,
    title: 'Review & tayang',
    text: 'Setelah revisi disepakati, website disiapkan untuk launch dan serah terima.'
  }
];

useGsapScrollReveal(sectionRef, { y: 38, stagger: 0.1, duration: 0.8, once: true });
</script>

<template>
  <section id="process" class="relative overflow-hidden bg-[#171511] py-24 text-[#f5f0e7] md:py-36">
    <div class="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(#f5f0e7_1px,transparent_1px)] [background-size:24px_24px]" aria-hidden="true" />
    <div class="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#c85f32] opacity-15 blur-[130px]" aria-hidden="true" />

    <div ref="sectionRef" class="section-shell relative z-10">
      <div class="mb-14 grid gap-8 lg:grid-cols-[1fr_0.62fr] lg:items-end">
        <div>
          <p class="section-kicker mb-6 !text-[#ee8859]">Cara kerja</p>
          <h2 class="text-balance max-w-4xl text-[clamp(2.4rem,5vw,4.8rem)] font-medium leading-[0.98] tracking-[-0.045em]">Anda tahu apa yang diputuskan, kapan memberi masukan, dan <span class="font-display italic text-[#ee8859]">kenapa.</span></h2>
        </div>
        <p class="max-w-xl text-base leading-relaxed text-[#bcb4a9] lg:justify-self-end lg:text-lg">
          Proses dibuat bertahap agar keputusan penting tidak tenggelam di akhir pengerjaan. Scope, materi, review, dan target tayang dibicarakan sejak awal.
        </p>
      </div>

      <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <article v-for="step in steps" :key="step.number" class="group rounded-[1.5rem] border border-white/15 bg-white/[0.035] p-6 transition-colors hover:border-[#ee8859]/45 hover:bg-white/[0.06] md:p-7">
          <div class="flex items-start justify-between">
            <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ee8859]/12 text-[#ee8859]">
              <component :is="step.icon" class="h-5 w-5" stroke-width="1.7" />
            </div>
            <span class="text-xs font-bold tracking-[0.16em] text-[#827a70]">{{ step.number }}</span>
          </div>
          <h3 class="mt-10 text-xl font-bold tracking-tight">{{ step.title }}</h3>
          <p class="mt-4 text-sm leading-relaxed text-[#aaa298]">{{ step.text }}</p>
        </article>
      </div>

      <div class="mt-8 flex flex-col gap-3 rounded-2xl border border-white/15 bg-white/[0.045] p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
        <p class="text-sm text-[#bcb4a9]"><strong class="text-[#f5f0e7]">Scope dan estimasi disepakati di awal.</strong> Jadi arah kerja tetap terukur dari awal sampai tayang.</p>
        <span class="shrink-0 text-[10px] font-bold uppercase tracking-[0.16em] text-[#ee8859]">Transparan sejak awal</span>
      </div>
    </div>
  </section>
</template>
