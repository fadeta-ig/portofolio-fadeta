<script setup>
import { ref } from 'vue';
import { Award, Code2, MessageCircle, Network } from '@lucide/vue';
import { certPdf } from '../data/assets';
import { useGsapScrollReveal } from '../composables/useGsapScrollReveal';

const sectionRef = ref(null);

const principles = [
  {
    icon: MessageCircle,
    title: 'Komunikasi langsung',
    text: 'Pembahasan dibuat ringkas dan mudah dipahami, tanpa istilah teknis yang tidak perlu.'
  },
  {
    icon: Code2,
    title: 'Business-first',
    text: 'Teknologi dipilih setelah tujuan, kebutuhan, dan kemampuan pengelolaan bisnis dipahami.'
  },
  {
    icon: Network,
    title: 'Pikir sampai belakang layar',
    text: 'Bukan hanya tampilan; struktur, hosting, keamanan dasar, dan perawatan ikut dipertimbangkan.'
  }
];

useGsapScrollReveal(sectionRef, { y: 34, stagger: 0.1, duration: 0.75, once: true });
</script>

<template>
  <section id="studio" class="py-24 md:py-36">
    <div ref="sectionRef" class="section-shell">
      <div class="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <p class="section-kicker mb-6">Tentang studio</p>
          <h2 class="section-heading text-balance">Teknisnya rapi. Komunikasinya tetap <span class="font-display italic text-accent">manusiawi.</span></h2>

          <div class="mt-9 rounded-[1.6rem] border border-border-default bg-bg-secondary p-6 md:p-7">
            <p class="text-[11px] font-bold uppercase tracking-[0.16em] text-text-tertiary">Di balik Gandiva Labs</p>
            <p class="mt-4 text-lg font-bold leading-snug text-text-primary">Fadeta Ilhan Gandhi, S.T.</p>
            <p class="mt-2 text-sm leading-relaxed text-text-secondary">Web developer dengan latar Teknik Komputer dan IT infrastructure. Kombinasi ini membantu melihat website sebagai tampilan sekaligus sistem yang perlu tetap sehat setelah tayang.</p>

            <a :href="certPdf" target="_blank" rel="noopener noreferrer" class="mt-5 inline-flex items-center gap-2 text-xs font-bold text-accent hover:underline">
              <Award class="h-4 w-4" />
              Kredensial MTCNA
            </a>
          </div>
        </div>

        <div>
          <p class="max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
            Gandiva Labs membantu menerjemahkan kebutuhan bisnis menjadi website yang dapat dipahami pengguna dan tetap masuk akal untuk dikelola. Jika solusi yang dibutuhkan lebih sederhana dari rencana awal, pembahasannya akan diarahkan ke sana.
          </p>

          <div class="mt-9 divide-y divide-border-default border-y border-border-default">
            <article v-for="item in principles" :key="item.title" class="grid gap-4 py-6 sm:grid-cols-[auto_1fr] sm:gap-5">
              <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-subtle text-accent">
                <component :is="item.icon" class="h-5 w-5" stroke-width="1.7" />
              </div>
              <div>
                <h3 class="text-lg font-bold text-text-primary">{{ item.title }}</h3>
                <p class="mt-2 max-w-xl text-sm leading-relaxed text-text-secondary md:text-base">{{ item.text }}</p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
