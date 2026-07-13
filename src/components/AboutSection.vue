<script setup>
import { ref } from 'vue';
import { Eye, MousePointerClick, ShieldCheck } from '@lucide/vue';
import { useGsapScrollReveal } from '../composables/useGsapScrollReveal';

const sectionRef = ref(null);

const outcomes = [
  {
    icon: Eye,
    title: 'Mudah dipahami',
    text: 'Orang langsung tahu bisnis Anda menawarkan apa, untuk siapa, dan kenapa layak dipertimbangkan.'
  },
  {
    icon: ShieldCheck,
    title: 'Terlihat meyakinkan',
    text: 'Pesan, visual, dan detail penting disusun rapi supaya bisnis tampil lebih siap dan profesional.'
  },
  {
    icon: MousePointerClick,
    title: 'Punya arah tindakan',
    text: 'Setiap halaman mengarahkan pengunjung ke langkah berikutnya tanpa terasa memaksa.'
  }
];

useGsapScrollReveal(sectionRef, { y: 34, stagger: 0.1, duration: 0.75, once: true });
</script>

<template>
  <section id="approach" class="py-24 md:py-36">
    <div ref="sectionRef" class="section-shell">
      <div class="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
        <div>
          <p class="section-kicker mb-6">Yang sebenarnya dibutuhkan</p>
          <h2 class="section-heading text-balance">Calon pelanggan tidak punya waktu untuk <span class="font-display italic text-accent">menebak.</span></h2>
        </div>

        <div class="lg:pt-3">
          <p class="max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
            Website yang bagus bukan yang paling ramai. Yang dibutuhkan adalah pesan yang cepat dipahami, bukti yang cukup, dan jalur kontak yang terasa mudah.
          </p>

          <div class="mt-10 grid gap-4 sm:grid-cols-3">
            <article v-for="item in outcomes" :key="item.title" class="card-surface p-5 transition-transform duration-300 hover:-translate-y-1 md:p-6">
              <div class="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-accent-subtle text-accent">
                <component :is="item.icon" class="h-5 w-5" stroke-width="1.7" />
              </div>
              <h3 class="text-base font-bold text-text-primary">{{ item.title }}</h3>
              <p class="mt-3 text-sm leading-relaxed text-text-secondary">{{ item.text }}</p>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
