<script setup>
import { ref } from 'vue';
import { Plus } from '@lucide/vue';
import { useGsapScrollReveal } from '../composables/useGsapScrollReveal';
import { faqs } from '../data/faqs';

const sectionRef = ref(null);

useGsapScrollReveal(sectionRef, { y: 32, stagger: 0.08, duration: 0.7, once: true });
</script>

<template>
  <section id="faq" class="border-y border-border-default bg-bg-secondary py-24 md:py-36">
    <div ref="sectionRef" class="section-shell grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
      <div>
        <p class="section-kicker mb-6">Pertanyaan yang sering muncul</p>
        <h2 class="section-heading text-balance">Jawaban transparan sebelum Anda memulai <span class="font-display italic text-accent">proyek.</span></h2>
        <p class="mt-6 max-w-md leading-relaxed text-text-secondary">Kalau ada hal yang ingin ditanyakan langsung, kami siap membantu diskusi via WhatsApp.</p>
      </div>

      <div class="grid gap-3">
        <details v-for="item in faqs" :key="item.question" class="faq-item liquid-panel group rounded-2xl px-5 md:px-6">
          <summary class="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-base font-bold text-text-primary md:text-lg">
            {{ item.question }}
            <span class="liquid-button flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-text-secondary transition-all group-open:rotate-45 group-open:border-accent/40 group-open:text-accent">
              <Plus class="h-4 w-4" />
            </span>
          </summary>
          <p class="max-w-2xl pb-6 pr-12 text-sm leading-relaxed text-text-secondary md:text-base">{{ item.answer }}</p>
        </details>
      </div>
    </div>
  </section>
</template>

<style scoped>
summary::-webkit-details-marker {
  display: none;
}
</style>
