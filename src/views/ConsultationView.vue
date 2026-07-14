<script setup>
import { CheckCircle2, FileSearch, Route, Send } from '@lucide/vue';
import ConsultationForm from '../components/ConsultationForm.vue';
import ContactSection from '../components/ContactSection.vue';

const process = [
  {
    icon: FileSearch,
    title: 'Konteks dibaca',
    description: 'Kami melihat tujuan, kondisi saat ini, dan batasan yang perlu dipertimbangkan.'
  },
  {
    icon: Route,
    title: 'Arah awal disusun',
    description: 'Kebutuhan dipetakan agar diskusi tidak langsung melompat ke fitur atau visual.'
  },
  {
    icon: Send,
    title: 'Langkah berikutnya dibahas',
    description: 'Kami menghubungi Anda melalui email atau WhatsApp yang dicantumkan.'
  }
];
</script>

<template>
  <main class="flex-grow bg-bg-primary pt-28 md:pt-36">
    <section class="relative overflow-hidden pb-24 md:pb-36">
      <div class="absolute -right-40 top-12 h-[34rem] w-[34rem] rounded-full bg-accent opacity-[0.09] blur-[150px]" aria-hidden="true" />
      <div class="dot-grid absolute inset-0 opacity-25 [mask-image:linear-gradient(to_bottom,black,transparent_68%)]" aria-hidden="true" />
      <div class="noise-overlay" aria-hidden="true" />

      <div class="section-shell relative z-10">
        <div class="mx-auto max-w-4xl text-center">
          <p class="section-kicker mb-6">Form konsultasi</p>
          <h1 class="text-balance text-[clamp(3.4rem,7vw,7rem)] font-medium leading-[0.9] tracking-[-0.06em] text-text-primary">
            Brief yang jelas membuat keputusan lebih <span class="font-display italic text-accent">tepat.</span>
          </h1>
          <p class="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">
            Ceritakan tujuan bisnis dan kondisi Anda sekarang. Tidak perlu menyiapkan dokumen teknis; jawaban sederhana sudah cukup untuk memulai.
          </p>
        </div>

        <div class="mt-16 grid items-start gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
          <aside class="rounded-[1.5rem] border border-border-default bg-bg-secondary/70 p-6 md:p-8 lg:sticky lg:top-28">
            <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-accent">Sesudah form dikirim</p>
            <div class="mt-6 grid gap-6">
              <div v-for="(item, index) in process" :key="item.title" class="grid grid-cols-[auto_1fr] gap-4">
                <span class="flex h-10 w-10 items-center justify-center rounded-xl border border-border-default bg-bg-card text-accent">
                  <component :is="item.icon" class="h-4 w-4" />
                </span>
                <div>
                  <span class="text-[10px] font-bold tracking-[0.14em] text-text-tertiary">0{{ index + 1 }}</span>
                  <h2 class="mt-1 text-sm font-bold text-text-primary">{{ item.title }}</h2>
                  <p class="mt-1 text-xs leading-relaxed text-text-secondary">{{ item.description }}</p>
                </div>
              </div>
            </div>

            <div class="mt-8 flex items-start gap-3 border-t border-border-default pt-6 text-xs leading-relaxed text-text-secondary">
              <CheckCircle2 class="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span>Mengisi form tidak mengikat Anda pada pembelian atau kontrak apa pun.</span>
            </div>
          </aside>

          <div class="card-surface rounded-[1.75rem] p-5 md:p-8 lg:p-10">
            <div class="mb-8 border-b border-border-default pb-7">
              <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-accent">Project brief</p>
              <h2 class="mt-2 text-2xl font-bold tracking-[-0.03em] text-text-primary md:text-3xl">Ceritakan kebutuhan Anda</h2>
              <p class="mt-3 max-w-xl text-sm leading-relaxed text-text-secondary">Semakin konkret konteksnya, semakin relevan arah awal yang dapat kami siapkan.</p>
            </div>

            <ConsultationForm variant="full" source="consultation-page" />
          </div>
        </div>
      </div>
    </section>

    <ContactSection />
  </main>
</template>
