<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  PackageSearch,
  Store
} from '@lucide/vue';
import ContactSection from '../components/ContactSection.vue';
import { featuredProjects, labProjects, privateProjects } from '../data/projects';

const filters = ['Semua', 'Website Bisnis', 'Sistem Internal', 'Eksperimen'];
const activeFilter = ref('Semua');
const scrollProgress = ref(0);

const showPublic = computed(() => ['Semua', 'Website Bisnis'].includes(activeFilter.value));
const showPrivate = computed(() => ['Semua', 'Sistem Internal'].includes(activeFilter.value));
const showLab = computed(() => ['Semua', 'Eksperimen'].includes(activeFilter.value));
const resultCount = computed(() => {
  if (activeFilter.value === 'Website Bisnis') return featuredProjects.length;
  if (activeFilter.value === 'Sistem Internal') return privateProjects.length;
  if (activeFilter.value === 'Eksperimen') return labProjects.length;
  return featuredProjects.length + privateProjects.length + labProjects.length;
});

const iconMap = {
  store: Store,
  education: GraduationCap,
  warehouse: PackageSearch
};

function updateScrollProgress() {
  const height = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.value = height > 0 ? Math.min((window.scrollY / height) * 100, 100) : 0;
}

onMounted(() => {
  updateScrollProgress();
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
});

onUnmounted(() => window.removeEventListener('scroll', updateScrollProgress));
</script>

<template>
  <main class="flex-grow w-full">
    <div class="fixed left-0 top-0 z-[60] h-0.5 bg-accent transition-[width] duration-100" :style="{ width: `${scrollProgress}%` }" aria-hidden="true" />

    <section class="relative overflow-hidden pb-16 pt-32 md:pb-24 md:pt-40">
      <div class="dot-grid absolute inset-0 opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" aria-hidden="true" />
      <div class="absolute -right-24 top-8 h-80 w-80 rounded-full bg-accent opacity-[0.1] blur-[120px]" aria-hidden="true" />
      <div class="noise-overlay" aria-hidden="true" />

      <div class="section-shell relative z-10">
        <RouterLink to="/" class="mb-10 inline-flex items-center gap-2 text-sm font-bold text-text-secondary transition-colors hover:text-accent">
          <ArrowLeft class="h-4 w-4" />
          Kembali ke beranda
        </RouterLink>

        <div class="grid gap-10 lg:grid-cols-[1fr_0.46fr] lg:items-end">
          <div class="max-w-5xl">
            <p class="section-kicker mb-6">Arsip karya Gandiva Labs</p>
            <h1 class="text-balance text-[clamp(3.25rem,7.5vw,7.6rem)] font-medium leading-[0.88] tracking-[-0.06em] text-text-primary">
              Sistem digital untuk kebutuhan yang <span class="font-display italic text-accent">nyata.</span>
            </h1>
          </div>

          <div class="max-w-xl lg:pb-2">
            <p class="text-base leading-relaxed text-text-secondary md:text-lg">
              Dari website yang bertemu langsung dengan pelanggan hingga sistem yang bekerja diam-diam di balik operasional bisnis.
            </p>
            <p class="mt-4 text-sm leading-relaxed text-text-tertiary">
              Sebagian proyek dapat dilihat langsung. Sebagian lainnya hanya dijelaskan secara garis besar karena bersifat internal.
            </p>
          </div>
        </div>

        <dl class="mt-14 grid overflow-hidden rounded-2xl border border-border-default bg-bg-card/70 shadow-[var(--shadow-sm)] backdrop-blur md:grid-cols-3">
          <div class="border-b border-border-default p-5 md:border-b-0 md:border-r md:p-7">
            <dt class="text-[10px] font-bold uppercase tracking-[0.16em] text-text-tertiary">Website bisnis</dt>
            <dd class="mt-2 text-3xl font-bold tracking-tight text-text-primary">{{ featuredProjects.length }}</dd>
          </div>
          <div class="border-b border-border-default p-5 md:border-b-0 md:border-r md:p-7">
            <dt class="text-[10px] font-bold uppercase tracking-[0.16em] text-text-tertiary">Sistem private</dt>
            <dd class="mt-2 text-3xl font-bold tracking-tight text-text-primary">{{ privateProjects.length }}</dd>
          </div>
          <div class="p-5 md:p-7">
            <dt class="text-[10px] font-bold uppercase tracking-[0.16em] text-text-tertiary">Eksperimen digital</dt>
            <dd class="mt-2 text-3xl font-bold tracking-tight text-text-primary">{{ labProjects.length }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <div class="sticky top-[5.75rem] z-30 border-y border-border-default bg-bg-primary/90 py-3 backdrop-blur-xl">
      <div class="section-shell flex items-center justify-between gap-5 overflow-x-auto">
        <div class="flex min-w-max items-center gap-2" role="group" aria-label="Filter portofolio">
          <button
            v-for="filter in filters"
            :key="filter"
            type="button"
            class="min-h-10 rounded-full border px-4 text-xs font-bold transition-colors"
            :class="activeFilter === filter ? 'border-text-primary bg-text-primary text-bg-primary' : 'border-border-default bg-bg-card text-text-secondary hover:text-text-primary'"
            :aria-pressed="activeFilter === filter"
            @click="activeFilter = filter"
          >
            {{ filter }}
          </button>
        </div>
        <span class="hidden min-w-max text-xs font-medium text-text-tertiary sm:block">{{ resultCount }} karya</span>
      </div>
    </div>

    <div class="section-shell py-16 md:py-24">
      <Transition name="portfolio-fade" mode="out-in">
        <div :key="activeFilter" class="space-y-24 md:space-y-32">
          <section v-if="showPublic" aria-labelledby="public-projects">
            <div class="mb-10 grid gap-5 border-b border-border-default pb-7 md:grid-cols-[1fr_0.7fr] md:items-end">
              <div>
                <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-accent">01 · Dapat dikunjungi</p>
                <h2 id="public-projects" class="mt-3 text-3xl font-bold tracking-[-0.04em] text-text-primary md:text-5xl">Website bisnis</h2>
              </div>
              <p class="max-w-xl text-sm leading-relaxed text-text-secondary md:justify-self-end md:text-base">
                Website publik dengan peran yang berbeda: menjual produk, memperkenalkan kapabilitas, dan membuka jalur konsultasi.
              </p>
            </div>

            <div class="space-y-6">
              <article
                v-for="(project, index) in featuredProjects"
                :key="project.id"
                class="group grid overflow-hidden rounded-[1.75rem] border border-border-default bg-bg-card shadow-[var(--shadow-sm)] lg:grid-cols-[1.08fr_0.92fr]"
              >
                <a :href="project.link" target="_blank" rel="noopener noreferrer" class="relative min-h-64 overflow-hidden bg-bg-secondary lg:min-h-[30rem]" :class="index % 2 ? 'lg:order-2' : ''" :aria-label="`Kunjungi website ${project.title}`">
                  <img
                    :src="project.image"
                    :alt="`Tampilan website ${project.title}`"
                    :width="project.width"
                    :height="project.height"
                    loading="lazy"
                    decoding="async"
                    class="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.025]"
                  />
                  <span class="absolute bottom-4 left-4 rounded-full border border-white/20 bg-black/55 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur">Buka website</span>
                </a>

                <div class="flex flex-col justify-center p-7 md:p-10 lg:p-12" :class="index % 2 ? 'lg:order-1' : ''">
                  <div class="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.16em] text-text-tertiary">
                    <span class="text-accent">{{ project.id }}</span>
                    <span class="h-px w-10 bg-border-default" />
                    {{ project.category }}
                  </div>
                  <h3 class="mt-6 text-3xl font-bold tracking-[-0.04em] text-text-primary md:text-5xl">{{ project.title }}</h3>
                  <p class="mt-5 text-base leading-relaxed text-text-secondary">{{ project.description }}</p>
                  <div class="mt-7 flex flex-wrap gap-2">
                    <span v-for="item in project.contribution" :key="item" class="tag">{{ item }}</span>
                  </div>
                  <a :href="project.link" target="_blank" rel="noopener noreferrer" :data-track="`portfolio_${project.id}`" class="mt-9 inline-flex w-fit items-center gap-2 text-sm font-bold text-text-primary transition-colors hover:text-accent">
                    Lihat website
                    <ArrowUpRight class="h-4 w-4" />
                  </a>
                </div>
              </article>
            </div>
          </section>

          <section v-if="showPrivate" aria-labelledby="private-projects">
            <div class="mb-10 grid gap-5 border-b border-border-default pb-7 md:grid-cols-[1fr_0.7fr] md:items-end">
              <div>
                <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-accent">02 · Tidak dipublikasikan</p>
                <h2 id="private-projects" class="mt-3 text-3xl font-bold tracking-[-0.04em] text-text-primary md:text-5xl">Sistem internal</h2>
              </div>
              <div class="max-w-xl md:justify-self-end">
                <p class="text-sm leading-relaxed text-text-secondary md:text-base">
                  Proyek berikut digunakan dalam proses internal klien. Yang ditampilkan hanya konteks dan ruang lingkup umumnya.
                </p>
                <span class="mt-3 inline-flex items-center gap-2 text-xs font-bold text-text-tertiary"><EyeOff class="h-4 w-4" /> Tanpa nama klien, screenshot, atau akses publik</span>
              </div>
            </div>

            <div class="grid gap-5 lg:grid-cols-3">
              <article v-for="project in privateProjects" :key="project.id" class="private-card group flex min-h-[31rem] flex-col overflow-hidden rounded-[1.75rem] border border-border-default bg-bg-card shadow-[var(--shadow-sm)]">
                <div class="relative h-48 overflow-hidden border-b border-border-default bg-bg-secondary p-6">
                  <div class="dot-grid absolute inset-0 opacity-35" aria-hidden="true" />
                  <div class="absolute inset-6 rounded-2xl border border-border-default bg-bg-card/80 p-4 shadow-[var(--shadow-sm)] backdrop-blur">
                    <div class="mb-5 flex items-center justify-between">
                      <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-subtle text-accent">
                        <component :is="iconMap[project.icon]" class="h-5 w-5" />
                      </span>
                      <span class="inline-flex items-center gap-1.5 rounded-full border border-border-default bg-bg-secondary px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.13em] text-text-tertiary"><LockKeyhole class="h-3 w-3" /> Private</span>
                    </div>
                    <div class="space-y-2.5 opacity-60" aria-hidden="true">
                      <span class="block h-2.5 w-2/3 rounded-full bg-border-default" />
                      <span class="block h-2.5 w-full rounded-full bg-border-default" />
                      <span class="block h-2.5 w-5/6 rounded-full bg-border-default" />
                    </div>
                  </div>
                </div>

                <div class="flex flex-1 flex-col p-6 md:p-7">
                  <p class="text-[10px] font-bold uppercase tracking-[0.15em] text-accent">{{ project.id }} · {{ project.category }}</p>
                  <h3 class="mt-4 text-2xl font-bold tracking-[-0.035em] text-text-primary">{{ project.title }}</h3>
                  <p class="mt-4 text-sm leading-relaxed text-text-secondary">{{ project.description }}</p>
                  <div class="mt-5 flex flex-wrap gap-2">
                    <span v-for="item in project.contribution" :key="item" class="tag">{{ item }}</span>
                  </div>
                  <div class="mt-auto border-t border-border-default pt-5">
                    <p class="flex gap-3 text-xs leading-relaxed text-text-tertiary">
                      <LockKeyhole class="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      {{ project.privacy }}
                    </p>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <section v-if="showLab" aria-labelledby="lab-projects">
            <div class="mb-10 grid gap-5 border-b border-border-default pb-7 md:grid-cols-[1fr_0.7fr] md:items-end">
              <div>
                <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-accent">03 · Ruang eksplorasi</p>
                <h2 id="lab-projects" class="mt-3 text-3xl font-bold tracking-[-0.04em] text-text-primary md:text-5xl">Eksperimen digital</h2>
              </div>
              <p class="max-w-xl text-sm leading-relaxed text-text-secondary md:justify-self-end md:text-base">
                Tempat menguji ide, struktur informasi, dan interaksi dalam bentuk yang lebih ringan.
              </p>
            </div>

            <div class="divide-y divide-border-default border-y border-border-default">
              <a
                v-for="(project, index) in labProjects"
                :key="project.id"
                :href="project.link"
                target="_blank"
                rel="noopener noreferrer"
                class="group grid gap-4 py-7 transition-colors hover:bg-bg-secondary/60 md:grid-cols-[5rem_0.65fr_1fr_auto] md:items-center md:px-5"
              >
                <span class="text-xs font-bold tracking-[0.14em] text-accent">{{ String(index + 1).padStart(2, '0') }}</span>
                <div>
                  <span class="text-[10px] font-bold uppercase tracking-[0.14em] text-text-tertiary">{{ project.category }}</span>
                  <h3 class="mt-1 text-xl font-bold tracking-tight text-text-primary">{{ project.title }}</h3>
                </div>
                <p class="max-w-2xl text-sm leading-relaxed text-text-secondary">{{ project.description }}</p>
                <span class="flex h-10 w-10 items-center justify-center rounded-full border border-border-default text-text-primary transition-all group-hover:border-accent/50 group-hover:text-accent"><ArrowUpRight class="h-4 w-4" /></span>
              </a>
            </div>
          </section>

          <div class="rounded-[1.75rem] border border-border-default bg-bg-secondary/60 p-7 md:flex md:items-center md:justify-between md:gap-8 md:p-10">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-accent">Punya kebutuhan serupa?</p>
              <h2 class="mt-3 max-w-2xl text-2xl font-bold tracking-[-0.035em] text-text-primary md:text-4xl">Ceritakan konteksnya. Kita cari bentuk website atau sistem yang paling masuk akal.</h2>
            </div>
            <a href="#contact" class="group mt-7 inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-full bg-text-primary px-6 text-sm font-bold text-bg-primary md:mt-0">
              Mulai konsultasi
              <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </Transition>
    </div>

    <ContactSection />
  </main>
</template>

<style scoped>
.portfolio-fade-enter-active,
.portfolio-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.portfolio-fade-enter-from,
.portfolio-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.private-card {
  transition: border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
}

.private-card:hover {
  border-color: color-mix(in srgb, var(--accent) 45%, var(--border-default));
  box-shadow: var(--shadow-md);
  transform: translateY(-4px);
}
</style>
