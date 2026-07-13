<script setup>
import { ArrowUpRight, BriefcaseBusiness, GitBranch, Mail, MessageCircle } from '@lucide/vue';
import LogoMark from './LogoMark.vue';

const whatsapp = '6281553821808';
const email = 'fadeta287@gmail.com';
const message = encodeURIComponent('Halo Gandiva Labs, saya ingin cerita tentang kebutuhan website bisnis saya.');
const whatsappLink = `https://wa.me/${whatsapp}?text=${message}`;
</script>

<template>
  <footer id="contact" class="relative overflow-hidden bg-[#171511] text-[#f5f0e7]">
    <div class="absolute -bottom-48 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[#c85f32] opacity-[0.16] blur-[150px]" aria-hidden="true" />
    <div class="noise-overlay opacity-[0.06]" aria-hidden="true" />

    <div class="section-shell relative z-10 pb-9 pt-24 md:pt-36">
      <div class="mx-auto max-w-5xl text-center">
        <p class="mb-7 text-[11px] font-bold uppercase tracking-[0.2em] text-[#ee8859]">Mulai dari obrolan sederhana</p>
        <h2 class="text-balance text-[clamp(3rem,7vw,7rem)] font-medium leading-[0.9] tracking-[-0.06em]">
          Sudah punya ide?<br />Kita bikin arahnya <span class="font-display italic text-[#ee8859]">jelas.</span>
        </h2>
        <p class="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-[#bcb4a9] md:text-xl">
          Ceritakan bisnis, masalah, atau website yang Anda bayangkan. Kami bantu melihat langkah yang paling masuk akal—tanpa harus langsung punya brief lengkap.
        </p>

        <div class="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            :href="whatsappLink"
            target="_blank"
            rel="noopener noreferrer"
            data-track="footer_whatsapp"
            class="group inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-[#f5f0e7] px-7 text-sm font-bold text-[#171511] transition-transform hover:-translate-y-1 sm:w-auto"
          >
            <MessageCircle class="h-[18px] w-[18px]" />
            Chat via WhatsApp
            <ArrowUpRight class="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <a
            :href="`mailto:${email}`"
            data-track="footer_email"
            class="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full border border-white/20 px-7 text-sm font-bold text-[#f5f0e7] transition-colors hover:border-white/45 sm:w-auto"
          >
            <Mail class="h-[18px] w-[18px]" />
            Kirim email
          </a>
        </div>

        <p class="mt-6 text-xs text-[#827a70]">Balasan mengikuti jam operasional · Surabaya, Indonesia</p>
      </div>

      <div class="mt-24 flex flex-col gap-8 border-t border-white/15 pt-8 md:flex-row md:items-end md:justify-between">
        <div class="flex items-center gap-3">
          <LogoMark :size="48" variant="light" />
          <div>
            <p class="text-sm font-bold">Gandiva Labs</p>
            <p class="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#827a70]">Website studio</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <a href="https://github.com/fadeta-ig" target="_blank" rel="noopener noreferrer" class="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-[#aaa298] transition-colors hover:border-[#ee8859]/50 hover:text-[#ee8859]" aria-label="GitHub">
            <GitBranch class="h-5 w-5" />
          </a>
          <a href="https://linkedin.com/in/fadetaig" target="_blank" rel="noopener noreferrer" class="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-[#aaa298] transition-colors hover:border-[#ee8859]/50 hover:text-[#ee8859]" aria-label="LinkedIn">
            <BriefcaseBusiness class="h-5 w-5" />
          </a>
          <a :href="whatsappLink" target="_blank" rel="noopener noreferrer" class="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-[#aaa298] transition-colors hover:border-[#ee8859]/50 hover:text-[#ee8859]" aria-label="WhatsApp">
            <MessageCircle class="h-5 w-5" />
          </a>
          <a :href="`mailto:${email}`" class="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-[#aaa298] transition-colors hover:border-[#ee8859]/50 hover:text-[#ee8859]" aria-label="Email">
            <Mail class="h-5 w-5" />
          </a>
        </div>

        <p class="text-xs text-[#827a70]">© {{ new Date().getFullYear() }} Gandiva Labs. Semua hak dilindungi.</p>
      </div>
    </div>
  </footer>
</template>
