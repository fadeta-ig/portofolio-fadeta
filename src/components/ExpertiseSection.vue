<script setup>
import { nextTick, ref } from 'vue';
import { ArrowRight, ChevronDown, LayoutTemplate, MousePointer2, ShoppingBag, Wrench } from '@lucide/vue';
import { useGsapScrollReveal } from '../composables/useGsapScrollReveal';
import { services } from '../data/services';

const sectionRef = ref(null);
const activeServiceIndex = ref(0);
const serviceButtonRefs = ref([]);

const iconMap = {
  'company-profile': LayoutTemplate,
  'landing-page': MousePointer2,
  'toko-online': ShoppingBag,
  'website-custom': Wrench
};

useGsapScrollReveal(sectionRef, { y: 36, stagger: 0.08, duration: 0.75, once: true });

function setServiceButtonRef(element, index) {
  if (element) serviceButtonRefs.value[index] = element;
}

function selectService(index, moveFocus = false) {
  activeServiceIndex.value = index;

  if (moveFocus) {
    nextTick(() => serviceButtonRefs.value[index]?.focus());
  }
}

function handleServiceKeydown(event, index) {
  const lastIndex = services.length - 1;

  if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
    event.preventDefault();
    selectService(index === lastIndex ? 0 : index + 1, true);
  } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
    event.preventDefault();
    selectService(index === 0 ? lastIndex : index - 1, true);
  } else if (event.key === 'Home') {
    event.preventDefault();
    selectService(0, true);
  } else if (event.key === 'End') {
    event.preventDefault();
    selectService(lastIndex, true);
  }
}
</script>

<template>
  <section id="services" class="py-20 md:py-24">
    <div ref="sectionRef" class="section-shell grid gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:grid-rows-[1fr_auto] lg:gap-x-10 lg:gap-y-6 xl:grid-cols-[minmax(0,0.68fr)_minmax(0,1.32fr)] xl:gap-x-14">
      <div class="lg:pr-2">
        <p class="section-kicker mb-5">Bentuk solusi</p>
        <h2 class="services-heading section-heading max-w-4xl text-balance">Pilih berdasarkan masalahnya, bukan nama <span class="font-display italic text-accent">paketnya.</span></h2>
        <p class="mt-6 max-w-lg text-sm leading-relaxed text-text-secondary lg:text-base">
          Nama layanan membantu memberi gambaran awal. Scope akhirnya tetap mengikuti tujuan, kondisi, dan cara bisnis Anda bekerja.
        </p>
      </div>

      <div class="service-accordion self-start overflow-hidden rounded-[1.6rem] border border-border-default bg-bg-card shadow-[var(--shadow-sm)] lg:col-start-2 lg:row-span-2 lg:row-start-1">
        <article
          v-for="(service, index) in services"
          :key="service.slug"
          class="relative border-b border-border-default last:border-b-0"
          :class="activeServiceIndex === index ? 'bg-bg-card' : 'bg-bg-primary/35'"
        >
          <span
            class="absolute bottom-0 left-0 top-0 z-10 w-[3px] origin-center bg-accent transition-transform duration-500"
            :class="activeServiceIndex === index ? 'scale-y-100' : 'scale-y-0'"
            aria-hidden="true"
          />

          <button
            :id="`service-trigger-${service.slug}`"
            :ref="(element) => setServiceButtonRef(element, index)"
            type="button"
            class="group grid min-h-[4.5rem] w-full grid-cols-[2rem_2.5rem_minmax(0,1fr)_2.25rem] items-center gap-3 px-5 py-3 text-left transition-colors duration-300 hover:bg-bg-secondary/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/60 md:grid-cols-[2rem_2.5rem_minmax(10rem,0.62fr)_minmax(14rem,1fr)_2.25rem] md:gap-4 md:px-6 lg:grid-cols-[2rem_2.5rem_minmax(0,1fr)_2.25rem] lg:px-5 xl:grid-cols-[2rem_2.5rem_minmax(9rem,0.62fr)_minmax(12rem,1fr)_2.25rem] xl:px-6"
            :aria-expanded="activeServiceIndex === index"
            :aria-controls="`service-panel-${service.slug}`"
            @click="selectService(index)"
            @keydown="handleServiceKeydown($event, index)"
          >
            <span class="text-[10px] font-bold tabular-nums tracking-[0.17em] transition-colors" :class="activeServiceIndex === index ? 'text-accent' : 'text-text-tertiary'">{{ service.number }}</span>
            <span class="flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-300" :class="activeServiceIndex === index ? 'bg-text-primary text-bg-primary' : 'bg-bg-secondary text-text-secondary group-hover:text-text-primary'">
              <component :is="iconMap[service.slug]" class="h-[17px] w-[17px]" stroke-width="1.7" />
            </span>
            <span class="truncate text-base font-bold tracking-[-0.025em] text-text-primary md:text-lg">{{ service.name }}</span>
            <span class="hidden line-clamp-2 text-xs leading-relaxed transition-colors md:block lg:hidden xl:block" :class="activeServiceIndex === index ? 'text-text-secondary' : 'text-text-tertiary'">{{ service.problem }}</span>
            <span class="flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-300" :class="activeServiceIndex === index ? 'border-text-primary bg-text-primary text-bg-primary' : 'border-border-default text-text-tertiary group-hover:border-text-tertiary group-hover:text-text-primary'">
              <ChevronDown class="h-4 w-4 transition-transform duration-500" :class="activeServiceIndex === index ? 'rotate-180' : ''" />
            </span>
          </button>

          <div
            :id="`service-panel-${service.slug}`"
            class="accordion-content"
            :class="activeServiceIndex === index ? 'is-open' : ''"
            role="region"
            :aria-labelledby="`service-trigger-${service.slug}`"
            :aria-hidden="activeServiceIndex !== index"
            :inert="activeServiceIndex !== index"
          >
            <div>
              <div class="border-t border-border-subtle bg-bg-secondary/45 px-5 py-6 md:px-[6.5rem] md:py-7 lg:px-6 lg:py-6 xl:px-7">
                <div class="grid gap-7 md:grid-cols-[1.15fr_0.85fr] md:items-start lg:gap-7 xl:gap-9">
                  <div>
                    <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-accent">Pendekatan yang disesuaikan</p>
                    <p class="mt-3 max-w-2xl text-base leading-relaxed text-text-primary md:text-lg">{{ service.summary }}</p>
                  </div>

                  <div>
                    <p class="text-[10px] font-bold uppercase tracking-[0.15em] text-text-tertiary">Cakupan awal</p>
                    <div class="mt-3 flex flex-wrap gap-2">
                      <span v-for="item in service.scope.slice(0, 3)" :key="item" class="rounded-full border border-border-default bg-bg-card px-3 py-1.5 text-[10px] font-bold text-text-secondary">{{ item }}</span>
                    </div>
                    <RouterLink
                      :to="`/solusi/${service.slug}`"
                      :data-track="`service_${service.slug}`"
                      class="group/link mt-5 inline-flex items-center gap-2 text-sm font-bold text-text-primary transition-colors hover:text-accent"
                      :tabindex="activeServiceIndex === index ? undefined : -1"
                    >
                      Lihat pendekatan lengkap
                      <ArrowRight class="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                    </RouterLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div class="rounded-[1.35rem] border border-border-default bg-bg-secondary px-5 py-5 lg:col-start-1 lg:row-start-2">
        <p class="text-sm font-medium leading-relaxed text-text-secondary"><strong class="text-text-primary">Belum tahu bentuk yang tepat?</strong> Itu wajar. Cukup jelaskan hal yang ingin diperbaiki.</p>
        <RouterLink to="/konsultasi" data-track="services_consultation" class="mt-4 inline-flex min-h-10 items-center justify-center rounded-full border border-text-primary px-5 text-xs font-bold text-text-primary transition-colors hover:bg-text-primary hover:text-bg-primary">Ceritakan masalah</RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.services-heading {
  font-size: clamp(2.25rem, 6vw, 3rem);
  letter-spacing: -0.035em;
  line-height: 1.03;
}

@media (min-width: 64rem) {
  .services-heading {
    font-size: clamp(2.4rem, 3.2vw, 3.1rem);
  }
}

.accordion-content {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition:
    grid-template-rows 0.5s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.24s ease;
}

.accordion-content.is-open {
  grid-template-rows: 1fr;
  opacity: 1;
}

.accordion-content > div {
  min-height: 0;
  overflow: hidden;
}

@media (prefers-reduced-motion: reduce) {
  .accordion-content {
    transition: none;
  }
}
</style>
