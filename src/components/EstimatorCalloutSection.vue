<script setup>
import { ArrowRight, CheckCircle2 } from '@lucide/vue';
import { RouterLink } from 'vue-router';
</script>

<template>
  <section class="border-y border-border-default bg-bg-secondary py-16 md:py-24">
    <div class="section-shell">
      <div class="card-surface p-7 md:p-10 lg:p-12">
        <div class="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
          <div class="space-y-4">
            <p class="section-kicker mb-2">Smart Website Estimator</p>
            <h2 class="section-heading text-balance text-2xl font-medium tracking-tight text-text-primary sm:text-3xl md:text-4xl">
              Belum Tahu Berapa Biaya & Website yang <span class="font-display italic text-accent">Sesuai untuk Bisnis Anda?</span>
            </h2>
            <p class="max-w-2xl text-sm leading-relaxed text-text-secondary md:text-base">
              Dapatkan gambaran rekomendasi jenis website, kelengkapan fitur, serta transparansi estimasi investasi dan waktu pengerjaan dalam kurang dari 1 menit—tanpa komitmen & tanpa wajib mengisi data pribadi.
            </p>

            <div class="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-text-secondary">
              <span class="flex items-center gap-2">
                <CheckCircle2 class="h-4 w-4 text-accent" />
                Hasil instan 30–60 detik
              </span>
              <span class="flex items-center gap-2">
                <CheckCircle2 class="h-4 w-4 text-accent" />
                Tanpa wajib isi data
              </span>
              <span class="flex items-center gap-2">
                <CheckCircle2 class="h-4 w-4 text-accent" />
                Transparan & fleksibel
              </span>
            </div>
          </div>

          <div class="flex flex-col items-start lg:items-end justify-center gap-3 border-t border-border-default pt-6 lg:border-t-0 lg:pt-0">
            <RouterLink
              to="/kalkulator-website"
              class="group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-accent px-6 py-3 text-sm font-bold text-[#f5f0e7] transition-all hover:bg-accent-hover shadow-sm"
            >
              <span>Hitung Biaya Website Anda</span>
              <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </RouterLink>
            <span class="text-xs text-text-tertiary">
              Termasuk Free Maintenance 6 Bulan & Monitoring 24/7
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
