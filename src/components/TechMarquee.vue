<script setup>
const audiences = ['Brand yang mulai tumbuh', 'UMKM', 'Manufaktur & B2B', 'Bisnis jasa', 'Tim operasional'];
</script>

<template>
  <section class="border-y border-border-default bg-bg-secondary/70 py-6" aria-label="Jenis bisnis yang dilayani">
    <div class="section-shell flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
      <p class="shrink-0 text-[11px] font-bold uppercase tracking-[0.18em] text-text-tertiary">Bekerja baik untuk</p>
      <div class="flex flex-wrap gap-x-6 gap-y-3 md:justify-end">
        <span v-for="audience in audiences" :key="audience" class="inline-flex items-center gap-2 text-sm font-bold text-text-secondary">
          <span class="h-1.5 w-1.5 rounded-full bg-accent" />
          {{ audience }}
        </span>
      </div>
    </div>
  </section>
</template>
