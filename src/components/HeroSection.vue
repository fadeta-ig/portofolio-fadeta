<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import gsap from 'gsap';
import { ArrowRight, ArrowUpRight, Check, MessageCircle } from '@lucide/vue';

const heroRef = ref(null);
const deviceRef = ref(null);
let ctx;
let removeTiltListeners;

const whatsapp = '6281553821808';
const message = encodeURIComponent('Halo Gandiva Labs, saya ingin konsultasi tentang pembuatan website.');
const whatsappLink = `https://wa.me/${whatsapp}?text=${message}`;

onMounted(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  ctx = gsap.context(() => {
    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

    timeline
      .from('.hero-animate', {
        y: 22,
        opacity: 0,
        duration: 0.78,
        stagger: 0.08,
        delay: 0.12
      })
      .from('.hero-device', {
        y: 54,
        opacity: 0,
        scale: 0.97,
        duration: 1.15
      }, '-=0.36')
      .from('.screen-reveal', {
        y: 16,
        opacity: 0,
        duration: 0.65,
        stagger: 0.07
      }, '-=0.68');

    gsap.to('.screen-orb', {
      xPercent: 10,
      yPercent: -8,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }, heroRef.value);

  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (!finePointer || !heroRef.value || !deviceRef.value) return;

  const rotateX = gsap.quickTo(deviceRef.value, 'rotationX', { duration: 0.8, ease: 'power3.out' });
  const rotateY = gsap.quickTo(deviceRef.value, 'rotationY', { duration: 0.8, ease: 'power3.out' });

  const handlePointerMove = (event) => {
    const bounds = heroRef.value.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    rotateX(y * -2.2);
    rotateY(x * 2.8);
  };

  const resetTilt = () => {
    rotateX(0);
    rotateY(0);
  };

  heroRef.value.addEventListener('pointermove', handlePointerMove);
  heroRef.value.addEventListener('pointerleave', resetTilt);
  removeTiltListeners = () => {
    heroRef.value?.removeEventListener('pointermove', handlePointerMove);
    heroRef.value?.removeEventListener('pointerleave', resetTilt);
  };
});

onUnmounted(() => {
  removeTiltListeners?.();
  ctx?.revert();
});
</script>

<template>
  <section id="hero" ref="heroRef" class="hero-section">
    <div class="hero-aura hero-aura-left" aria-hidden="true" />
    <div class="hero-aura hero-aura-right" aria-hidden="true" />
    <div class="dot-grid hero-grid" aria-hidden="true" />
    <div class="noise-overlay" aria-hidden="true" />

    <div class="section-shell hero-layout">
      <div class="hero-copy">
        <div class="hero-animate availability-pill">
          <span class="availability-dot" aria-hidden="true">
            <span />
          </span>
          Menerima proyek website baru
        </div>

        <h1 class="hero-animate hero-title text-balance">
          Website yang bikin bisnis
          <span>lebih mudah <em>dipercaya.</em></span>
        </h1>

        <p class="hero-animate hero-description">
          Gandiva Labs merancang website bisnis yang jelas, meyakinkan, dan terasa mudah digunakan—dari impresi pertama sampai calon pelanggan menghubungi Anda.
        </p>

        <div class="hero-animate hero-actions">
          <a
            :href="whatsappLink"
            target="_blank"
            rel="noopener noreferrer"
            data-track="hero_whatsapp"
            class="hero-button hero-button-primary group"
          >
            <MessageCircle class="h-[18px] w-[18px]" />
            Ceritakan kebutuhan Anda
            <ArrowUpRight class="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          <RouterLink to="/portfolio" class="hero-button hero-button-secondary group">
            Lihat portofolio
            <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </RouterLink>
        </div>

        <div class="hero-animate hero-proof" aria-label="Keunggulan layanan">
          <span><Check class="h-4 w-4" /> Strategi & copy</span>
          <span><Check class="h-4 w-4" /> Responsif di mobile</span>
          <span><Check class="h-4 w-4" /> Siap dikelola</span>
        </div>
      </div>

      <div class="hero-device-stage" aria-label="Preview website Gandiva Labs pada mockup MacBook">
        <div ref="deviceRef" class="hero-device">
          <div class="laptop-display">
            <div class="laptop-camera" aria-hidden="true" />

            <div class="laptop-screen">
              <div class="screen-orb" aria-hidden="true" />

              <div class="mock-nav screen-reveal">
                <div class="mock-brand">
                  <span class="mock-brand-mark" aria-hidden="true">G</span>
                  <span>Gandiva Labs</span>
                </div>
                <div class="mock-nav-links" aria-hidden="true">
                  <span>Layanan</span>
                  <span>Portofolio</span>
                  <span>Proses</span>
                </div>
                <span class="mock-nav-cta">Mulai proyek <ArrowUpRight class="h-3 w-3" /></span>
              </div>

              <div class="mock-content">
                <div class="mock-message screen-reveal">
                  <span class="mock-eyebrow">Business-first web studio</span>
                  <h2>Bukan sekadar tampil.<br><em>Harus meyakinkan.</em></h2>
                  <p>Setiap halaman dirancang agar pesan bisnis Anda terasa jelas dan mudah dipercaya.</p>
                  <span class="mock-link">Lihat cara kami bekerja <ArrowRight class="h-3 w-3" /></span>
                </div>

                <div class="mock-method screen-reveal">
                  <div class="mock-method-head">
                    <div>
                      <span>Gandiva method</span>
                      <strong>Dirancang dengan arah.</strong>
                    </div>
                    <span class="mock-method-badge">01—03</span>
                  </div>

                  <div class="mock-method-list">
                    <div class="mock-method-row">
                      <span>01</span>
                      <div><strong>Arah bisnis</strong><small>Tujuan dan audiens lebih dulu.</small></div>
                    </div>
                    <div class="mock-method-row">
                      <span>02</span>
                      <div><strong>Alur informasi</strong><small>Pesan mudah dipahami.</small></div>
                    </div>
                    <div class="mock-method-row">
                      <span>03</span>
                      <div><strong>Desain & build</strong><small>Rapi, cepat, dan responsif.</small></div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="screen-status screen-reveal" aria-hidden="true">
                <span><i /> gandiva-labs.id</span>
                <span>Crafted for clarity</span>
              </div>
            </div>
          </div>

          <div class="laptop-base" aria-hidden="true">
            <span />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  position: relative;
  isolation: isolate;
  min-height: 100vh;
  overflow: hidden;
  padding: 8.75rem 0 5.5rem;
}

.hero-layout {
  position: relative;
  z-index: 1;
}

.hero-copy {
  display: flex;
  max-width: 68rem;
  margin: 0 auto;
  align-items: center;
  flex-direction: column;
  text-align: center;
}

.availability-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  min-height: 2.15rem;
  padding: 0.38rem 0.9rem;
  border: 1px solid var(--border-default);
  border-radius: 999px;
  background: color-mix(in srgb, var(--bg-card) 82%, transparent);
  color: var(--text-secondary);
  font-size: 0.75rem;
  font-weight: 700;
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
}

.availability-dot {
  position: relative;
  display: inline-flex;
  width: 0.5rem;
  height: 0.5rem;
}

.availability-dot::before,
.availability-dot span {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: var(--accent);
  content: '';
}

.availability-dot::before {
  animation: availability-pulse 2.2s ease-out infinite;
}

.hero-title {
  margin-top: 1.5rem;
  color: var(--text-primary);
  font-size: clamp(3.15rem, 7.15vw, 6.75rem);
  font-weight: 500;
  letter-spacing: -0.062em;
  line-height: 0.9;
}

.hero-title span {
  display: block;
}

.hero-title em {
  color: var(--accent);
  font-family: var(--font-serif);
  font-weight: 400;
}

.hero-description {
  max-width: 43rem;
  margin-top: 1.65rem;
  color: var(--text-secondary);
  font-size: clamp(1rem, 1.45vw, 1.18rem);
  line-height: 1.65;
}

.hero-actions {
  display: flex;
  margin-top: 1.9rem;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.hero-button {
  display: inline-flex;
  min-height: 3.15rem;
  padding: 0.75rem 1.35rem;
  align-items: center;
  justify-content: center;
  gap: 0.68rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 700;
  transition: transform 0.35s ease, border-color 0.35s ease, background-color 0.35s ease;
}

.hero-button:hover {
  transform: translateY(-3px);
}

.hero-button-primary {
  background: var(--text-primary);
  color: var(--bg-primary);
}

.hero-button-secondary {
  border: 1px solid var(--border-default);
  background: color-mix(in srgb, var(--bg-card) 70%, transparent);
  color: var(--text-primary);
}

.hero-button-secondary:hover {
  border-color: var(--text-tertiary);
}

.hero-proof {
  display: flex;
  margin-top: 1.35rem;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.55rem 1.2rem;
  color: var(--text-secondary);
  font-size: 0.78rem;
}

.hero-proof span {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.hero-proof svg {
  color: var(--accent);
}

.hero-device-stage {
  position: relative;
  width: min(100%, 68rem);
  margin: 4rem auto 0;
  perspective: 1400px;
}

.hero-device-stage::before {
  position: absolute;
  z-index: -1;
  right: 10%;
  bottom: -8%;
  left: 10%;
  height: 20%;
  border-radius: 50%;
  background: rgba(23, 21, 17, 0.13);
  filter: blur(32px);
  content: '';
}

:global([data-theme="dark"]) .hero-device-stage::before {
  background: rgba(0, 0, 0, 0.3);
}

.hero-device {
  width: 100%;
  transform-style: preserve-3d;
  will-change: transform;
}

.laptop-display {
  position: relative;
  aspect-ratio: 16 / 9.25;
  padding: 0.72rem;
  border: 1px solid rgba(255, 255, 255, 0.11);
  border-radius: 1.55rem 1.55rem 0.65rem 0.65rem;
  background: linear-gradient(145deg, #323234 0%, #151517 52%, #2a2a2c 100%);
  box-shadow: 0 18px 52px rgba(23, 21, 17, 0.13);
}

:global([data-theme="dark"]) .laptop-display {
  box-shadow: 0 18px 52px rgba(0, 0, 0, 0.24);
}

.laptop-camera {
  position: absolute;
  z-index: 3;
  top: 0.3rem;
  left: 50%;
  width: 0.27rem;
  height: 0.27rem;
  border-radius: 999px;
  background: #08090b;
  box-shadow: inset 0 0 0 1px rgba(102, 119, 145, 0.32);
  transform: translateX(-50%);
}

.laptop-screen {
  position: relative;
  height: 100%;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--border-default) 68%, transparent);
  border-radius: 0.95rem 0.95rem 0.28rem 0.28rem;
  background: var(--bg-card);
  color: var(--text-primary);
}

.screen-orb {
  position: absolute;
  top: -34%;
  right: -9%;
  width: 54%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--accent);
  filter: blur(90px);
  opacity: 0.13;
  pointer-events: none;
}

.mock-nav {
  position: relative;
  z-index: 1;
  display: flex;
  min-height: 12%;
  padding: 0 3.2%;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-subtle);
}

.mock-brand,
.mock-nav-links,
.mock-nav-cta {
  display: flex;
  align-items: center;
}

.mock-brand {
  gap: 0.48rem;
  font-size: clamp(0.48rem, 1vw, 0.82rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.mock-brand-mark {
  display: inline-flex;
  width: clamp(1.1rem, 2.2vw, 1.7rem);
  height: clamp(1.1rem, 2.2vw, 1.7rem);
  align-items: center;
  justify-content: center;
  border-radius: 40%;
  background: var(--text-primary);
  color: var(--bg-card);
  font-family: var(--font-serif);
  font-size: clamp(0.65rem, 1.25vw, 1rem);
  font-style: italic;
}

.mock-nav-links {
  gap: clamp(0.8rem, 2.2vw, 2rem);
  color: var(--text-secondary);
  font-size: clamp(0.4rem, 0.72vw, 0.65rem);
  font-weight: 500;
}

.mock-nav-cta {
  min-height: clamp(1.2rem, 2.6vw, 2rem);
  padding: 0.25rem clamp(0.45rem, 1.2vw, 0.85rem);
  gap: 0.25rem;
  border-radius: 999px;
  background: var(--text-primary);
  color: var(--bg-card);
  font-size: clamp(0.38rem, 0.66vw, 0.6rem);
  font-weight: 700;
}

.mock-content {
  position: relative;
  z-index: 1;
  display: grid;
  height: 76%;
  padding: 4.5% 5.3%;
  align-items: center;
  grid-template-columns: 0.92fr 1.08fr;
  gap: 6%;
}

.mock-eyebrow,
.mock-method-head > div > span {
  color: var(--accent);
  font-size: clamp(0.37rem, 0.68vw, 0.6rem);
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.mock-message h2 {
  margin-top: 3%;
  color: var(--text-primary);
  font-size: clamp(1.15rem, 3.25vw, 2.85rem);
  font-weight: 500;
  letter-spacing: -0.05em;
  line-height: 0.95;
}

.mock-message h2 em {
  color: var(--accent);
  font-family: var(--font-serif);
  font-weight: 400;
}

.mock-message p {
  max-width: 25rem;
  margin-top: 4%;
  color: var(--text-secondary);
  font-size: clamp(0.45rem, 0.9vw, 0.76rem);
  line-height: 1.55;
}

.mock-link {
  display: inline-flex;
  margin-top: 5%;
  padding-bottom: 0.18rem;
  align-items: center;
  gap: 0.3rem;
  border-bottom: 1px solid var(--text-primary);
  color: var(--text-primary);
  font-size: clamp(0.42rem, 0.78vw, 0.68rem);
  font-weight: 700;
}

.mock-method {
  padding: 6%;
  border: 1px solid var(--border-default);
  border-radius: clamp(0.8rem, 2vw, 1.5rem);
  background: color-mix(in srgb, var(--bg-primary) 88%, transparent);
}

.mock-method-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.mock-method-head > div > strong {
  display: block;
  margin-top: 2%;
  color: var(--text-primary);
  font-size: clamp(0.62rem, 1.45vw, 1.2rem);
  line-height: 1.2;
}

.mock-method-badge {
  display: inline-flex;
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--border-default);
  border-radius: 999px;
  color: var(--text-tertiary);
  font-size: clamp(0.35rem, 0.6vw, 0.52rem);
  font-weight: 700;
}

.mock-method-list {
  display: grid;
  margin-top: 5%;
  gap: clamp(0.22rem, 0.72vw, 0.55rem);
}

.mock-method-row {
  display: grid;
  padding: 3.1% 3.5%;
  align-items: center;
  grid-template-columns: auto 1fr;
  gap: 4%;
  border: 1px solid var(--border-subtle);
  border-radius: clamp(0.45rem, 1vw, 0.8rem);
  background: var(--bg-card);
}

.mock-method-row > span {
  display: inline-flex;
  width: clamp(1rem, 2.35vw, 1.8rem);
  aspect-ratio: 1;
  align-items: center;
  justify-content: center;
  border-radius: 34%;
  background: var(--accent-subtle);
  color: var(--accent);
  font-size: clamp(0.32rem, 0.58vw, 0.5rem);
  font-weight: 700;
}

.mock-method-row strong,
.mock-method-row small {
  display: block;
}

.mock-method-row strong {
  color: var(--text-primary);
  font-size: clamp(0.45rem, 0.9vw, 0.75rem);
}

.mock-method-row small {
  margin-top: 0.05rem;
  color: var(--text-secondary);
  font-size: clamp(0.35rem, 0.64vw, 0.55rem);
  line-height: 1.25;
}

.screen-status {
  position: relative;
  z-index: 1;
  display: flex;
  height: 12%;
  padding: 0 3.2%;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--border-subtle);
  color: var(--text-tertiary);
  font-size: clamp(0.32rem, 0.6vw, 0.52rem);
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.screen-status span:first-child {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.screen-status i {
  width: 0.34rem;
  height: 0.34rem;
  border-radius: 999px;
  background: #4ca66b;
  box-shadow: 0 0 0 3px rgba(76, 166, 107, 0.12);
}

.laptop-base {
  position: relative;
  width: 108%;
  height: clamp(0.8rem, 2.2vw, 1.55rem);
  margin-left: -4%;
  background: linear-gradient(180deg, #d4d4d4 0%, #9e9e9f 58%, #6d6d6f 100%);
  clip-path: polygon(3.5% 0, 96.5% 0, 100% 62%, 98.5% 100%, 1.5% 100%, 0 62%);
}

.laptop-base span {
  position: absolute;
  top: 0;
  left: 43%;
  width: 14%;
  height: 38%;
  border-radius: 0 0 0.45rem 0.45rem;
  background: rgba(70, 70, 72, 0.42);
}

.hero-aura {
  position: absolute;
  z-index: -2;
  border-radius: 50%;
  background: var(--accent);
  filter: blur(130px);
  opacity: 0.09;
  pointer-events: none;
}

.hero-aura-left {
  top: 21rem;
  left: -14rem;
  width: 34rem;
  height: 34rem;
}

.hero-aura-right {
  right: -13rem;
  bottom: 4rem;
  width: 38rem;
  height: 38rem;
  opacity: 0.12;
}

.hero-grid {
  position: absolute;
  z-index: -3;
  inset: 0;
  opacity: 0.33;
  -webkit-mask-image: linear-gradient(to bottom, #000 0%, transparent 74%);
  mask-image: linear-gradient(to bottom, #000 0%, transparent 74%);
}

@keyframes availability-pulse {
  0% { opacity: 0.65; transform: scale(1); }
  75%, 100% { opacity: 0; transform: scale(2.45); }
}

@media (max-width: 767px) {
  .hero-section {
    min-height: auto;
    padding: 7.25rem 0 4.5rem;
  }

  .hero-title {
    margin-top: 1.2rem;
    font-size: clamp(3rem, 14vw, 4.35rem);
    line-height: 0.94;
  }

  .hero-description {
    max-width: 35rem;
    margin-top: 1.35rem;
    font-size: 0.98rem;
  }

  .hero-device-stage {
    margin-top: 3rem;
  }

  .laptop-display {
    padding: 0.38rem;
    border-radius: 0.9rem 0.9rem 0.35rem 0.35rem;
  }

  .laptop-camera {
    top: 0.13rem;
    width: 0.17rem;
    height: 0.17rem;
  }
}

@media (max-width: 540px) {
  .hero-actions {
    width: 100%;
    flex-direction: column;
  }

  .hero-button {
    width: 100%;
    max-width: 22rem;
  }

  .hero-proof {
    gap: 0.45rem 0.8rem;
    font-size: 0.7rem;
  }

  .mock-nav-links,
  .mock-message p,
  .mock-link,
  .screen-status span:last-child {
    display: none;
  }

  .mock-content {
    grid-template-columns: 0.82fr 1.18fr;
    gap: 4%;
  }

  .mock-method-row {
    padding-block: 2.8%;
  }
}
</style>
