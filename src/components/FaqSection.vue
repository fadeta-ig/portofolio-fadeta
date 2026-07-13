<script setup>
import { ref } from 'vue';
import { Plus } from '@lucide/vue';
import { useGsapScrollReveal } from '../composables/useGsapScrollReveal';

const sectionRef = ref(null);

const faqs = [
  {
    question: 'Berapa biaya pembuatan website?',
    answer: 'Biaya mengikuti jenis website, jumlah halaman, kebutuhan konten, dan fitur yang diperlukan. Setelah pembahasan awal, Anda akan menerima scope dan estimasi yang jelas sebelum pekerjaan dimulai.'
  },
  {
    question: 'Berapa lama proses pengerjaannya?',
    answer: 'Jadwal ditentukan setelah scope dan kesiapan materi dipahami. Timeline, tahap review, dan target tayang akan disepakati di awal agar prosesnya mudah dipantau.'
  },
  {
    question: 'Kalau belum punya copy atau susunan konten?',
    answer: 'Tidak masalah. Gandiva Labs dapat membantu menyusun pesan utama, struktur halaman, dan copy dasar berdasarkan informasi bisnis yang Anda berikan.'
  },
  {
    question: 'Bisa memperbaiki website yang sudah ada?',
    answer: 'Bisa. Website lama dapat diaudit untuk melihat masalah pada pesan, struktur, tampilan, performa, atau pengelolaannya sebelum menentukan apakah lebih tepat dirapikan atau dibangun ulang.'
  },
  {
    question: 'Apakah ada layanan maintenance?',
    answer: 'Ada sebagai layanan opsional. Bentuknya bisa berupa update konten, pengecekan rutin, perbaikan kecil, backup, atau dukungan teknis sesuai kebutuhan website.'
  },
  {
    question: 'Bagaimana dengan domain dan hosting?',
    answer: 'Gandiva Labs dapat membantu memilih dan menyiapkan domain serta hosting yang sesuai, lalu memastikan akses kepemilikannya tetap jelas untuk bisnis Anda.'
  }
];

useGsapScrollReveal(sectionRef, { y: 32, stagger: 0.08, duration: 0.7, once: true });
</script>

<template>
  <section id="faq" class="border-y border-border-default bg-bg-secondary py-24 md:py-36">
    <div ref="sectionRef" class="section-shell grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
      <div>
        <p class="section-kicker mb-6">Pertanyaan yang sering muncul</p>
        <h2 class="section-heading text-balance">Supaya tidak ada yang terasa <span class="font-display italic text-accent">abu-abu.</span></h2>
        <p class="mt-6 max-w-md leading-relaxed text-text-secondary">Kalau pertanyaan Anda belum terjawab di sini, kirim pesan saja. Tidak harus langsung punya brief.</p>
      </div>

      <div class="divide-y divide-border-default border-y border-border-default">
        <details v-for="item in faqs" :key="item.question" class="faq-item group">
          <summary class="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left text-base font-bold text-text-primary md:text-lg">
            {{ item.question }}
            <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-default bg-bg-card text-text-secondary transition-all group-open:rotate-45 group-open:border-accent/40 group-open:text-accent">
              <Plus class="h-4 w-4" />
            </span>
          </summary>
          <p class="max-w-2xl pb-7 pr-12 text-sm leading-relaxed text-text-secondary md:text-base">{{ item.answer }}</p>
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
