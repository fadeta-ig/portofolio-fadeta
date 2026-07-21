<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { ArrowLeft, ArrowRight, Check, MessageCircle } from '@lucide/vue';
import ContactSection from '../components/ContactSection.vue';
import { findService } from '../data/services';
import { createWhatsAppLink } from '../data/contact';

const route = useRoute();
const service = computed(() => findService(route.params.slug));
const whatsappLink = computed(() => createWhatsAppLink(`Halo Gandiva Labs, saya ingin membahas kebutuhan ${service.value?.name ?? 'website'} untuk bisnis saya.`));
</script>

<template>
  <main v-if="service" class="flex-grow bg-bg-primary pt-28 md:pt-36">
    <section class="relative overflow-hidden pb-20 md:pb-28">
      <div class="dot-grid absolute inset-0 opacity-25 [mask-image:linear-gradient(to_bottom,black,transparent_72%)]" aria-hidden="true" />
      <div class="absolute -right-36 top-0 h-[32rem] w-[32rem] rounded-full bg-accent opacity-[0.09] blur-[145px]" aria-hidden="true" />
      <div class="section-shell relative z-10">
        <RouterLink to="/#services" class="inline-flex items-center gap-2 text-sm font-bold text-text-secondary transition-colors hover:text-accent">
          <ArrowLeft class="h-4 w-4" /> Kembali ke solusi
        </RouterLink>

        <div class="mt-12 grid gap-10 lg:grid-cols-[1fr_0.46fr] lg:items-end">
          <div>
            <p class="section-kicker mb-6">Solusi {{ service.number }} · {{ service.name }}</p>
            <h1 class="max-w-5xl text-balance text-[clamp(3.2rem,7vw,7rem)] font-medium leading-[0.9] tracking-[-0.06em] text-text-primary">
              {{ service.problem }}
            </h1>
          </div>
          <div class="max-w-xl lg:pb-2">
            <p class="text-lg leading-relaxed text-text-secondary">{{ service.intro }}</p>
            <div class="mt-7 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <RouterLink to="/konsultasi" :data-track="`service_${service.slug}_brief`" class="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-text-primary px-6 text-sm font-bold text-bg-primary">
                Ceritakan masalahnya <ArrowRight class="h-4 w-4" />
              </RouterLink>
              <a :href="whatsappLink" target="_blank" rel="noopener noreferrer" :data-track="`service_${service.slug}_whatsapp`" class="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border-default px-6 text-sm font-bold text-text-primary">
                <MessageCircle class="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="border-y border-border-default bg-bg-secondary py-20 md:py-28">
      <div class="section-shell grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
        <div>
          <p class="section-kicker mb-5">Kapan ini relevan?</p>
          <h2 class="section-heading text-balance">Tandanya biasanya terlihat dari proses <span class="font-display italic text-accent">sehari-hari.</span></h2>
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          <div v-for="item in service.fits" :key="item" class="flex items-start gap-3 rounded-2xl border border-border-default bg-bg-card p-5">
            <span class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-accent"><Check class="h-3.5 w-3.5" /></span>
            <p class="text-sm leading-relaxed text-text-secondary">{{ item }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 md:py-28">
      <div class="section-shell">
        <div class="mb-12 max-w-3xl">
          <p class="section-kicker mb-5">Pendekatannya</p>
          <h2 class="section-heading text-balance">Yang dibereskan sebelum memilih <span class="font-display italic text-accent">fitur.</span></h2>
        </div>
        <div class="grid gap-4 md:grid-cols-3">
          <article v-for="(item, index) in service.approach" :key="item.title" class="card-surface p-6 md:p-8">
            <span class="text-xs font-bold tracking-[0.16em] text-accent">0{{ index + 1 }}</span>
            <h3 class="mt-7 text-xl font-bold tracking-tight text-text-primary">{{ item.title }}</h3>
            <p class="mt-4 text-sm leading-relaxed text-text-secondary">{{ item.text }}</p>
          </article>
        </div>

        <div class="mt-16 grid gap-8 rounded-[1.75rem] border border-border-default bg-bg-card p-6 md:grid-cols-2 md:p-10 lg:p-12">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-accent">Ruang lingkup umum</p>
            <h2 class="mt-3 text-2xl font-bold tracking-[-0.035em] text-text-primary md:text-3xl">Apa yang dapat masuk dalam pengerjaan</h2>
            <p class="mt-4 text-sm leading-relaxed text-text-secondary">Daftar final tetap mengikuti kebutuhan dan scope yang disepakati, bukan paket yang dipaksakan sama untuk semua bisnis.</p>
          </div>
          <ul class="grid gap-3 sm:grid-cols-2">
            <li v-for="item in service.scope" :key="item" class="flex items-start gap-3 border-t border-border-default pt-3 text-sm text-text-secondary"><Check class="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {{ item }}</li>
          </ul>
        </div>

        <div class="mt-6 rounded-[1.75rem] bg-[#171511] p-7 text-[#f5f0e7] md:flex md:items-center md:justify-between md:gap-10 md:p-10">
          <div class="max-w-3xl">
            <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-[#ee8859]">Supaya mudah berkembang</p>
            <p class="mt-3 text-lg leading-relaxed text-[#bcb4a9] md:text-xl">{{ service.scale }}</p>
          </div>
          <RouterLink to="/konsultasi" class="mt-7 inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#f5f0e7] px-6 text-sm font-bold text-[#171511] md:mt-0">
            Bahas konteks Anda <ArrowRight class="h-4 w-4" />
          </RouterLink>
        </div>
      </div>
    </section>

    <ContactSection />
  </main>
</template>
