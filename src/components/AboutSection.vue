<script setup>
import { ref } from 'vue';
import { Eye, MousePointerClick, ShieldCheck } from '@lucide/vue';
import { useGsapScrollReveal } from '../composables/useGsapScrollReveal';

const sectionRef = ref(null);

const outcomes = [
  {
    icon: Eye,
    title: 'Profil Resmi & Kredibel',
    text: 'Punya rujukan resmi di internet yang langsung membangun kepercayaan calon pembeli.'
  },
  {
    icon: ShieldCheck,
    title: 'Alur Pesanan Otomatis',
    text: 'Mempermudah pembeli memahami produk dan bertindak tanpa bergantung pada chat manual.'
  },
  {
    icon: MousePointerClick,
    title: 'Sistem Rapi & Terpusat',
    text: 'Data produk, pesanan, dan informasi bisnis tersusun rapi dalam satu wadah.'
  }
];

useGsapScrollReveal(sectionRef, { y: 34, stagger: 0.1, duration: 0.75, once: true });
</script>

<template>
  <section id="approach" class="section-glow overflow-hidden py-24 md:py-36">
    <div ref="sectionRef" class="section-shell">
      <div class="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
        <div>
          <p class="section-kicker mb-6">Solusi Digital Bisnis</p>
          <h2 class="section-heading text-balance">Bisnis jalan, tapi belum punya website & sistem <span class="font-display italic text-accent">resmi?</span></h2>
        </div>

        <div class="lg:pt-3">
          <p class="max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
            Tanpa website dan sistem yang rapi, calon pembeli sering ragu dan tim Anda harus menjelaskan hal yang sama berulang kali secara manual.
          </p>

          <div class="mt-10 grid gap-4 sm:grid-cols-3">
            <article v-for="item in outcomes" :key="item.title" class="card-surface p-5 transition-transform duration-300 hover:-translate-y-1 md:p-6">
              <div class="liquid-icon mb-5 flex h-11 w-11 items-center justify-center rounded-xl text-accent">
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
