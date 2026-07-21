<script setup>
import { ref } from 'vue';
import { ArrowRight, CheckCircle2, MailCheck, MessagesSquare } from '@lucide/vue';
import ConsultationForm from './ConsultationForm.vue';
import { useGsapScrollReveal } from '../composables/useGsapScrollReveal';

const sectionRef = ref(null);

const benefits = [
  { icon: MailCheck, text: 'Brief masuk langsung ke email Gandiva Labs.' },
  { icon: MessagesSquare, text: 'Tidak perlu sudah punya brief atau istilah teknis.' },
  { icon: CheckCircle2, text: 'Pertanyaan difokuskan pada tujuan dan konteks bisnis.' }
];

useGsapScrollReveal(sectionRef, { y: 32, stagger: 0.08, duration: 0.75, once: true });
</script>

<template>
  <section id="brief" class="relative overflow-hidden border-y border-border-default bg-bg-secondary py-24 md:py-36">
    <div class="absolute -left-40 top-12 h-96 w-96 rounded-full bg-accent opacity-[0.08] blur-[130px]" aria-hidden="true" />
    <div class="noise-overlay" aria-hidden="true" />

    <div ref="sectionRef" class="section-shell relative z-10 grid items-start gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
      <div class="lg:sticky lg:top-28">
        <p class="section-kicker mb-6">Mulai dengan brief singkat</p>
        <h2 class="section-heading text-balance">
          Mulai dari masalahnya. Bentuk solusi bisa dibahas <span class="font-display italic text-accent">setelahnya.</span>
        </h2>
        <p class="mt-7 max-w-xl text-base leading-relaxed text-text-secondary md:text-lg">
          Form ini membantu kami membaca konteks lebih dulu, supaya pembicaraan berikutnya tidak habis untuk menebak kebutuhan dasarnya.
        </p>

        <div class="mt-8 grid gap-3">
          <div v-for="item in benefits" :key="item.text" class="flex items-start gap-3 border-t border-border-default py-3.5">
            <component :is="item.icon" class="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <span class="text-sm leading-relaxed text-text-secondary">{{ item.text }}</span>
          </div>
        </div>

        <RouterLink to="/konsultasi" class="group mt-7 inline-flex items-center gap-2 text-sm font-bold text-text-primary">
          Isi brief yang lebih lengkap
          <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </RouterLink>
      </div>

      <div class="card-surface rounded-[1.75rem] p-5 md:p-8 lg:p-10">
        <div class="mb-7 flex items-start justify-between gap-5 border-b border-border-default pb-6">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-accent">Brief awal</p>
            <h3 class="mt-2 text-xl font-bold tracking-[-0.025em] text-text-primary md:text-2xl">Apa yang sedang ingin Anda perbaiki?</h3>
          </div>
          <span class="hidden rounded-full border border-border-default bg-bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-text-tertiary sm:inline-flex">Tanpa komitmen</span>
        </div>

        <ConsultationForm variant="compact" source="homepage" />
      </div>
    </div>
  </section>
</template>
