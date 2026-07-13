<script setup>
import { ref } from 'vue';
import { ArrowUpRight, LayoutTemplate, MousePointer2, ShoppingBag, Wrench } from '@lucide/vue';
import { useGsapScrollReveal } from '../composables/useGsapScrollReveal';

const sectionRef = ref(null);
const whatsapp = '6281553821808';

const services = [
  {
    number: '01',
    icon: LayoutTemplate,
    title: 'Company Profile',
    fit: 'Untuk bisnis yang perlu tampil lebih profesional',
    text: 'Website utama untuk menjelaskan profil, layanan, keunggulan, dan cara menghubungi bisnis Anda dengan lebih rapi.',
    includes: ['Strategi konten', 'Desain responsif', 'SEO dasar']
  },
  {
    number: '02',
    icon: MousePointer2,
    title: 'Landing Page',
    fit: 'Untuk kampanye, produk, atau layanan khusus',
    text: 'Satu halaman fokus yang membawa pengunjung dari rasa penasaran menuju tindakan yang Anda inginkan.',
    includes: ['Copy terarah', 'Struktur konversi', 'CTA yang jelas']
  },
  {
    number: '03',
    icon: ShoppingBag,
    title: 'Toko Online',
    fit: 'Untuk brand yang ingin punya kanal penjualan sendiri',
    text: 'Katalog dan alur belanja yang dibuat mudah digunakan, tanpa menghilangkan karakter visual brand.',
    includes: ['Katalog produk', 'Alur checkout', 'Integrasi kebutuhan toko']
  },
  {
    number: '04',
    icon: Wrench,
    title: 'Web Custom & Care',
    fit: 'Untuk kebutuhan yang tidak cukup dengan template',
    text: 'Pengembangan fitur khusus, perapian website lama, hingga dukungan teknis setelah website tayang.',
    includes: ['Fitur custom', 'Redesign', 'Maintenance opsional']
  }
];

function serviceLink(title) {
  const message = encodeURIComponent(`Halo Gandiva Labs, saya ingin konsultasi layanan ${title}.`);
  return `https://wa.me/${whatsapp}?text=${message}`;
}

useGsapScrollReveal(sectionRef, { y: 36, stagger: 0.08, duration: 0.75, once: true });
</script>

<template>
  <section id="services" class="border-y border-border-default bg-bg-secondary py-24 md:py-36">
    <div ref="sectionRef" class="section-shell">
      <div class="mb-14 grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
        <div>
          <p class="section-kicker mb-6">Layanan Gandiva Labs</p>
          <h2 class="section-heading text-balance max-w-4xl">Pilih yang bisnis Anda <span class="font-display italic text-accent">butuhkan.</span></h2>
        </div>
        <p class="max-w-xl text-base leading-relaxed text-text-secondary lg:justify-self-end lg:text-lg">
          Tidak perlu datang dengan brief yang sempurna. Ceritakan kondisi bisnis Anda, lalu kita tentukan bentuk website yang paling masuk akal.
        </p>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <article
          v-for="service in services"
          :key="service.title"
          class="group relative overflow-hidden rounded-[1.75rem] border border-border-default bg-bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[var(--shadow-md)] md:p-8"
        >
          <div class="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-accent-subtle opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />

          <div class="relative flex items-start justify-between gap-5">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-text-primary text-bg-primary">
              <component :is="service.icon" class="h-5 w-5" stroke-width="1.7" />
            </div>
            <span class="text-xs font-bold tracking-[0.16em] text-text-tertiary">{{ service.number }}</span>
          </div>

          <div class="relative mt-10">
            <p class="text-[11px] font-bold uppercase tracking-[0.13em] text-accent">{{ service.fit }}</p>
            <h3 class="mt-3 text-2xl font-bold tracking-[-0.03em] text-text-primary md:text-3xl">{{ service.title }}</h3>
            <p class="mt-4 max-w-xl leading-relaxed text-text-secondary">{{ service.text }}</p>

            <div class="mt-7 flex flex-wrap gap-2">
              <span v-for="item in service.includes" :key="item" class="tag">{{ item }}</span>
            </div>

            <a
              :href="serviceLink(service.title)"
              target="_blank"
              rel="noopener noreferrer"
              :data-track="`service_${service.number}`"
              class="mt-8 inline-flex items-center gap-2 text-sm font-bold text-text-primary transition-colors hover:text-accent"
            >
              Diskusikan layanan ini
              <ArrowUpRight class="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </article>
      </div>

      <div class="mt-8 flex flex-col gap-4 rounded-2xl border border-border-default bg-bg-primary p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
        <p class="text-sm font-medium text-text-secondary"><strong class="text-text-primary">Belum tahu pilih yang mana?</strong> Mulai dari masalah yang ingin dibereskan, bukan dari nama layanannya.</p>
        <a
          :href="serviceLink('konsultasi awal')"
          target="_blank"
          rel="noopener noreferrer"
          data-track="services_consultation"
          class="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-text-primary px-5 text-sm font-bold text-text-primary transition-colors hover:bg-text-primary hover:text-bg-primary"
        >
          Konsultasi singkat
        </a>
      </div>
    </div>
  </section>
</template>
