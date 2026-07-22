<script setup>
import { ref } from 'vue';
import { ArrowDown, ArrowRight, ArrowUpRight } from '@lucide/vue';
import { useGsapScrollReveal } from '../composables/useGsapScrollReveal';
import { featuredProjects } from '../data/projects';

const sectionRef = ref(null);
const portfolioScrollRef = ref(null);
const activeProjectIndex = ref(0);

useGsapScrollReveal(sectionRef, { y: 30, stagger: 0.08, duration: 0.75, triggerStart: 'top 84%', once: true });

function updateActiveProject() {
  const container = portfolioScrollRef.value;
  if (!container) return;

  const containerTop = container.getBoundingClientRect().top;
  const cards = Array.from(container.querySelectorAll('[data-project-card]'));
  let closestIndex = 0;
  let closestDistance = Number.POSITIVE_INFINITY;

  cards.forEach((card, index) => {
    const distance = Math.abs(card.getBoundingClientRect().top - containerTop);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  activeProjectIndex.value = closestIndex;
}

function scrollToProject(index) {
  const container = portfolioScrollRef.value;
  if (!container) return;

  const cards = Array.from(container.querySelectorAll('[data-project-card]'));
  const target = cards[index];
  if (!target || !cards[0]) return;

  container.scrollTo({
    top: target.offsetTop - cards[0].offsetTop,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
  });
}
</script>

<template>
  <section id="work" class="border-y border-border-default bg-bg-secondary py-20 md:py-24">
    <div ref="sectionRef" class="section-shell">
      <div class="grid gap-6 lg:grid-cols-[1fr_0.6fr] lg:items-end">
        <div>
          <p class="section-kicker mb-5">Hasil kerja</p>
          <h2 class="section-heading text-balance">Lihat konteks dan keputusan di balik setiap <span class="font-display italic text-accent">website.</span></h2>
        </div>
        <p class="max-w-xl text-base leading-relaxed text-text-secondary lg:justify-self-end lg:text-lg">Tidak ada angka performa yang dibuat-buat. Yang ditampilkan adalah kebutuhan proyek, pendekatan, dan keluaran yang memang dikerjakan.</p>
      </div>

      <div class="mt-10">
        <div class="mb-4 flex items-center justify-between gap-5 px-1">
          <span class="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-text-tertiary">
            <ArrowDown class="h-3.5 w-3.5 text-accent" />
            Gulir untuk melihat proyek lain
          </span>

          <div class="flex shrink-0 items-center gap-3" aria-label="Navigasi proyek terpilih">
            <span class="min-w-12 text-right text-[10px] font-bold tabular-nums tracking-[0.14em] text-text-tertiary">
              {{ String(activeProjectIndex + 1).padStart(2, '0') }} / {{ String(featuredProjects.length).padStart(2, '0') }}
            </span>
            <div class="flex items-center gap-1.5">
              <button
                v-for="(project, index) in featuredProjects"
                :key="project.slug"
                type="button"
                class="h-1.5 rounded-full transition-[width,background-color] duration-300"
                :class="activeProjectIndex === index ? 'w-7 bg-accent' : 'w-1.5 bg-border-default hover:bg-text-tertiary'"
                :aria-label="`Tampilkan proyek ${project.title}`"
                :aria-current="activeProjectIndex === index ? 'true' : undefined"
                @click="scrollToProject(index)"
              />
            </div>
          </div>
        </div>

        <div
          ref="portfolioScrollRef"
          class="portfolio-scroll flex h-[35rem] snap-y snap-mandatory flex-col gap-4 overflow-y-auto scroll-smooth rounded-[1.6rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-4 focus-visible:ring-offset-bg-secondary sm:h-[38rem] md:h-[26rem] lg:h-[28rem]"
          role="region"
          aria-label="Daftar proyek pilihan. Gulir ke bawah untuk berpindah proyek."
          tabindex="0"
          @scroll.passive="updateActiveProject"
        >
          <article
            v-for="project in featuredProjects"
            :key="project.slug"
            data-project-card
            class="group grid h-full min-h-full shrink-0 snap-start snap-always overflow-hidden rounded-[1.6rem] border border-border-default bg-bg-card shadow-[var(--shadow-sm)] md:grid-cols-[1.12fr_0.88fr]"
          >
            <RouterLink :to="`/hasil/${project.slug}`" class="block aspect-[16/10] overflow-hidden bg-bg-tertiary sm:aspect-[16/9] md:aspect-auto md:h-full" :aria-label="`Baca studi kasus ${project.title}`">
              <img :src="project.image" :alt="`Tampilan website ${project.title}`" :width="project.width" :height="project.height" loading="lazy" decoding="async" class="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.025]" />
            </RouterLink>
            <div class="flex min-h-0 flex-col justify-center p-6 md:p-8 lg:p-10">
              <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-accent">{{ project.category }}</p>
              <h3 class="mt-3 text-2xl font-bold tracking-[-0.035em] text-text-primary md:text-3xl">{{ project.title }}</h3>
              <p class="mt-4 text-sm leading-relaxed text-text-secondary">{{ project.need }}</p>
              <RouterLink :to="`/hasil/${project.slug}`" :data-track="`home_case_${project.slug}`" class="mt-6 inline-flex w-fit items-center gap-2 text-sm font-bold text-text-primary transition-colors hover:text-accent">Baca ringkasan proyek <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" /></RouterLink>
            </div>
          </article>
        </div>
      </div>

      <div class="mt-5 flex flex-col gap-4 rounded-2xl border border-border-default bg-bg-primary p-5 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-sm leading-relaxed text-text-secondary">Ada juga sistem internal dan eksperimen yang tidak semuanya dapat ditampilkan secara publik.</p>
        <RouterLink to="/portfolio" data-track="home_portfolio" class="group inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-text-primary px-5 text-sm font-bold text-bg-primary">Lihat semua karya <ArrowUpRight class="h-4 w-4" /></RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.portfolio-scroll {
  scrollbar-color: color-mix(in srgb, var(--accent) 55%, transparent) transparent;
  scrollbar-width: thin;
}

.portfolio-scroll::-webkit-scrollbar {
  width: 5px;
}

.portfolio-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.portfolio-scroll::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: color-mix(in srgb, var(--accent) 55%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  .portfolio-scroll {
    scroll-behavior: auto;
  }
}
</style>
