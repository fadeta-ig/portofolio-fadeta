<script setup>
import { ArrowRight, Check, CheckCircle2, MessageCircle } from '@lucide/vue';
import { createWhatsAppLink } from '../data/contact';

const whatsappLink = createWhatsAppLink('Halo Gandiva Labs, saya baru saja mengirim brief melalui website.');

const nextSteps = [
  'Brief diperiksa untuk memahami tujuan dan konteks bisnis.',
  'Kebutuhan utama dipetakan sebelum membahas solusi.',
  'Anda dihubungi melalui email atau WhatsApp yang dicantumkan.'
];
</script>

<template>
  <main id="main-content" tabindex="-1" class="relative flex min-h-screen flex-grow items-center overflow-hidden bg-bg-primary px-6 pb-20 pt-32">
    <div class="absolute -left-48 top-16 h-[34rem] w-[34rem] rounded-full bg-accent opacity-[0.1] blur-[150px]" aria-hidden="true" />
    <div class="dot-grid absolute inset-0 opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" aria-hidden="true" />
    <div class="noise-overlay" aria-hidden="true" />

    <section class="relative z-10 mx-auto w-full max-w-4xl text-center" aria-labelledby="thank-you-title">
      <span class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-accent/30 bg-accent-subtle text-accent">
        <CheckCircle2 class="h-7 w-7" />
      </span>

      <p class="mt-7 text-[11px] font-bold uppercase tracking-[0.2em] text-accent">Brief berhasil dikirim</p>
      <h1 id="thank-you-title" class="mt-5 text-balance text-[clamp(3.4rem,7vw,6.8rem)] font-medium leading-[0.9] tracking-[-0.06em] text-text-primary">
        Terima kasih. Kami akan melihat <span class="font-display italic text-accent">konteksnya.</span>
      </h1>
      <p class="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">
        Pesan Anda sudah masuk. Kami akan membaca kebutuhan tersebut terlebih dahulu agar pembicaraan berikutnya langsung membahas hal yang relevan.
      </p>

      <div class="mx-auto mt-10 grid max-w-2xl gap-3 text-left">
        <div v-for="item in nextSteps" :key="item" class="flex items-start gap-3 rounded-xl border border-border-default bg-bg-card/70 px-4 py-3.5">
          <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-accent">
            <Check class="h-3 w-3" />
          </span>
          <span class="text-sm leading-relaxed text-text-secondary">{{ item }}</span>
        </div>
      </div>

      <div class="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <RouterLink to="/portfolio" class="group inline-flex min-h-13 w-full items-center justify-center gap-3 rounded-full bg-text-primary px-7 text-sm font-bold text-bg-primary transition-transform hover:-translate-y-1 sm:w-auto">
          Lihat portofolio
          <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </RouterLink>
        <a :href="whatsappLink" target="_blank" rel="noopener noreferrer" class="inline-flex min-h-13 w-full items-center justify-center gap-3 rounded-full border border-border-default bg-bg-card/70 px-7 text-sm font-bold text-text-primary transition-colors hover:border-text-tertiary sm:w-auto">
          <MessageCircle class="h-4 w-4" />
          Tambahkan pesan via WhatsApp
        </a>
      </div>

      <RouterLink to="/" class="mt-7 inline-flex text-xs font-bold text-text-tertiary transition-colors hover:text-text-primary">
        Kembali ke beranda
      </RouterLink>
    </section>
  </main>
</template>
