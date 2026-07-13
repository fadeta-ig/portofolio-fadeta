<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import gsap from 'gsap';
import { ArrowDown, ArrowUpRight, Check, MessageCircle } from '@lucide/vue';

const heroRef = ref(null);
let ctx;

const whatsapp = '6281553821808';
const message = encodeURIComponent('Halo Gandiva Labs, saya ingin konsultasi tentang pembuatan website.');
const whatsappLink = `https://wa.me/${whatsapp}?text=${message}`;

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  ctx = gsap.context(() => {
    gsap.from('.hero-animate', {
      y: 24,
      opacity: 0,
      duration: 0.8,
      stagger: 0.09,
      ease: 'power3.out',
      delay: 0.15
    });

    gsap.from('.hero-preview', {
      x: 34,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: 0.35
    });
  }, heroRef.value);
});

onUnmounted(() => ctx?.revert());
</script>

<template>
  <section id="hero" ref="heroRef" class="relative overflow-hidden pb-20 pt-32 md:pb-28 md:pt-40 lg:min-h-[92vh] lg:flex lg:items-center">
    <div class="hero-glow hero-glow-one" aria-hidden="true" />
    <div class="hero-glow hero-glow-two" aria-hidden="true" />
    <div class="dot-grid absolute inset-0 opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" aria-hidden="true" />
    <div class="noise-overlay" aria-hidden="true" />

    <div class="section-shell relative z-10 grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
      <div class="max-w-3xl">
        <div class="hero-animate mb-7 inline-flex items-center gap-3 rounded-full border border-border-default bg-bg-card/80 px-4 py-2 text-xs font-bold text-text-secondary shadow-sm">
          <span class="relative flex h-2 w-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-50" />
            <span class="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          Menerima proyek website baru
        </div>

        <p class="hero-animate section-kicker mb-6">Website studio untuk bisnis</p>

        <h1 class="hero-animate text-balance max-w-4xl text-[clamp(3.35rem,7.6vw,7.25rem)] font-medium leading-[0.88] tracking-[-0.065em] text-text-primary">
          Website yang bikin bisnis lebih mudah
          <span class="font-display italic text-accent">dipercaya.</span>
        </h1>

        <p class="hero-animate mt-8 max-w-2xl text-base leading-relaxed text-text-secondary md:text-xl">
          Gandiva Labs membantu bisnis membangun company profile, landing page, dan toko online yang enak dilihat, mudah dipahami, dan punya arah yang jelas.
        </p>

        <div class="hero-animate mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            :href="whatsappLink"
            target="_blank"
            rel="noopener noreferrer"
            data-track="hero_whatsapp"
            class="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-text-primary px-7 text-sm font-bold text-bg-primary transition-transform hover:-translate-y-1"
          >
            <MessageCircle class="h-[18px] w-[18px]" />
            Ceritakan kebutuhan Anda
            <ArrowUpRight class="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          <a
            href="#work"
            class="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-border-default bg-bg-card/70 px-7 text-sm font-bold text-text-primary transition-colors hover:border-text-tertiary"
          >
            Lihat karya pilihan
            <ArrowDown class="h-4 w-4 transition-transform group-hover:translate-y-1" />
          </a>
        </div>

        <div class="hero-animate mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-text-secondary">
          <span class="inline-flex items-center gap-2"><Check class="h-4 w-4 text-accent" /> Strategi & copy</span>
          <span class="inline-flex items-center gap-2"><Check class="h-4 w-4 text-accent" /> Responsif di mobile</span>
          <span class="inline-flex items-center gap-2"><Check class="h-4 w-4 text-accent" /> Siap dikelola</span>
        </div>
      </div>

      <div class="hero-preview relative mx-auto w-full max-w-xl lg:mx-0">
        <div class="absolute -inset-5 -rotate-2 rounded-[2.2rem] border border-accent/20 bg-accent-subtle" aria-hidden="true" />

        <div class="card-surface relative overflow-hidden rounded-[2rem] shadow-[var(--shadow-lg)]">
          <div class="flex h-12 items-center gap-2 border-b border-border-default bg-bg-secondary px-5">
            <span class="h-2.5 w-2.5 rounded-full bg-accent/70" />
            <span class="h-2.5 w-2.5 rounded-full bg-text-tertiary/35" />
            <span class="h-2.5 w-2.5 rounded-full bg-text-tertiary/25" />
            <div class="ml-3 h-6 flex-1 rounded-md border border-border-default bg-bg-card" />
          </div>

          <div class="relative p-6 sm:p-8">
            <div class="mb-8 flex items-start justify-between gap-5">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">Gandiva method</span>
                <h2 class="mt-2 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">Bukan sekadar jadi.</h2>
              </div>
              <span class="rounded-full border border-border-default px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Business-first</span>
            </div>

            <div class="space-y-3">
              <div class="preview-row">
                <span class="preview-number">01</span>
                <div><strong>Arah bisnis</strong><small>Tujuan dan audiens dibuat jelas lebih dulu.</small></div>
              </div>
              <div class="preview-row">
                <span class="preview-number">02</span>
                <div><strong>Alur informasi</strong><small>Pengunjung tidak dibuat menebak-nebak.</small></div>
              </div>
              <div class="preview-row">
                <span class="preview-number">03</span>
                <div><strong>Desain & build</strong><small>Tampilan rapi, cepat, dan nyaman dipakai.</small></div>
              </div>
            </div>

            <div class="mt-6 flex items-center justify-between rounded-2xl bg-text-primary p-4 text-bg-primary">
              <span class="text-sm font-bold">Siap jadi rumah digital bisnis Anda.</span>
              <ArrowUpRight class="h-5 w-5" />
            </div>
          </div>
        </div>

        <div class="absolute -bottom-5 -left-3 rounded-2xl border border-border-default bg-bg-card px-4 py-3 shadow-[var(--shadow-md)] sm:-left-7">
          <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-text-tertiary">Fokus utama</p>
          <p class="mt-1 text-sm font-bold text-text-primary">Jelas. Rapi. Siap dipakai.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-glow {
  position: absolute;
  border-radius: 999px;
  background: var(--accent);
  filter: blur(130px);
  opacity: 0.1;
  pointer-events: none;
}

.hero-glow-one {
  width: 28rem;
  height: 28rem;
  top: 5rem;
  right: -9rem;
}

.hero-glow-two {
  width: 22rem;
  height: 22rem;
  bottom: -8rem;
  left: -8rem;
  opacity: 0.07;
}

.preview-row {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--border-default);
  border-radius: 1rem;
  background: var(--bg-primary);
}

.preview-number {
  display: inline-flex;
  width: 2.5rem;
  height: 2.5rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.85rem;
  background: var(--accent-subtle);
  color: var(--accent);
  font-size: 0.72rem;
  font-weight: 700;
}

.preview-row strong,
.preview-row small {
  display: block;
}

.preview-row strong {
  color: var(--text-primary);
  font-size: 0.9rem;
}

.preview-row small {
  margin-top: 0.15rem;
  color: var(--text-secondary);
  font-size: 0.72rem;
  line-height: 1.4;
}
</style>
