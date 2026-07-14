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
      .from('.hero-device', {
        y: 58,
        opacity: 0,
        scale: 0.965,
        duration: 1.15,
        delay: 0.16
      })
      .from('.screen-meta', {
        opacity: 0,
        duration: 0.55
      }, '-=0.72')
      .from('.hero-content-item', {
        y: 18,
        opacity: 0,
        duration: 0.72,
        stagger: 0.08
      }, '-=0.58');

    gsap.to('.screen-glow', {
      xPercent: 9,
      yPercent: -7,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }, heroRef.value);

  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (!finePointer || !heroRef.value || !deviceRef.value) return;

  const rotateX = gsap.quickTo(deviceRef.value, 'rotationX', { duration: 0.85, ease: 'power3.out' });
  const rotateY = gsap.quickTo(deviceRef.value, 'rotationY', { duration: 0.85, ease: 'power3.out' });

  const handlePointerMove = (event) => {
    const bounds = heroRef.value.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    rotateX(y * -1.8);
    rotateY(x * 2.2);
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

    <div class="hero-shell">
      <div ref="deviceRef" class="hero-device">
        <div class="hero-screen">
          <div class="screen-glow" aria-hidden="true" />
          <div class="screen-grid" aria-hidden="true" />

          <div class="screen-meta screen-meta-top" aria-hidden="true">
            <span class="screen-brand"><i>G</i> Gandiva Labs</span>
            <span>Business-first web studio</span>
          </div>

          <div class="hero-content">
            <div class="hero-content-item availability-pill">
              <span class="availability-dot" aria-hidden="true"><span /></span>
              Menerima proyek website baru
            </div>

            <h1 class="hero-content-item hero-title text-balance">
              Website yang bikin
              <span>bisnis lebih mudah <em>dipercaya.</em></span>
            </h1>

            <p class="hero-content-item hero-description">
              Gandiva Labs merancang website bisnis yang jelas, meyakinkan, dan mudah digunakan—dari impresi pertama sampai calon pelanggan menghubungi Anda.
            </p>

            <div class="hero-content-item hero-actions">
              <a
                :href="whatsappLink"
                target="_blank"
                rel="noopener noreferrer"
                data-track="hero_whatsapp"
                class="hero-button hero-button-primary group"
              >
                <MessageCircle class="hero-button-icon" />
                Ceritakan kebutuhan Anda
                <ArrowUpRight class="hero-button-arrow transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <RouterLink to="/portfolio" class="hero-button hero-button-secondary group">
                Lihat portofolio
                <ArrowRight class="hero-button-arrow transition-transform group-hover:translate-x-1" />
              </RouterLink>
            </div>

            <div class="hero-content-item hero-proof" aria-label="Keunggulan layanan">
              <span><Check /> Strategi & copy</span>
              <span><Check /> Responsif di mobile</span>
              <span><Check /> Siap dikelola</span>
            </div>
          </div>

          <div class="screen-meta screen-meta-bottom" aria-hidden="true">
            <span><i class="status-dot" /> Gandiva-labs.id</span>
            <span>Crafted for clarity</span>
          </div>
        </div>

        <img
          src="/frame.webp"
          alt=""
          class="macbook-frame"
          width="1335"
          height="805"
          draggable="false"
          aria-hidden="true"
        >
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
  padding: 7rem 0 2.75rem;
}

.hero-shell {
  position: relative;
  z-index: 1;
  width: min(92vw, 83.5rem);
  margin: 0 auto;
  perspective: 1500px;
}

.hero-shell::after {
  position: absolute;
  z-index: -1;
  right: 10%;
  bottom: 0;
  left: 10%;
  height: 6%;
  border-radius: 50%;
  background: rgba(23, 21, 17, 0.18);
  filter: blur(24px);
  content: '';
}

:global([data-theme="dark"]) .hero-shell::after {
  background: rgba(0, 0, 0, 0.38);
}

.hero-device {
  position: relative;
  width: 100%;
  aspect-ratio: 1335 / 805;
  transform-style: preserve-3d;
  will-change: transform;
}

.macbook-frame {
  position: absolute;
  z-index: 3;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  -webkit-user-select: none;
  user-select: none;
}

.hero-screen {
  position: absolute;
  z-index: 1;
  top: 1.25%;
  right: 8.55%;
  bottom: 5.35%;
  left: 8.55%;
  overflow: hidden;
  border-radius: 2.8% 2.8% 0.65rem 0.65rem;
  background:
    radial-gradient(circle at 50% -12%, rgba(238, 136, 89, 0.2), transparent 42%),
    linear-gradient(180deg, #2b1a12 0%, #141516 44%, #08090a 100%);
  color: #f5f0e7;
}

.hero-screen::after {
  position: absolute;
  inset: 0;
  background: linear-gradient(110deg, transparent 20%, rgba(255, 255, 255, 0.025) 44%, transparent 62%);
  content: '';
  pointer-events: none;
}

.screen-glow {
  position: absolute;
  top: -34%;
  right: -8%;
  width: 56%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #ee8859;
  filter: blur(110px);
  opacity: 0.16;
  pointer-events: none;
}

.screen-grid {
  position: absolute;
  inset: 0;
  opacity: 0.12;
  background-image: radial-gradient(rgba(245, 240, 231, 0.42) 0.7px, transparent 0.7px);
  background-size: 20px 20px;
  -webkit-mask-image: linear-gradient(to bottom, #000, transparent 72%);
  mask-image: linear-gradient(to bottom, #000, transparent 72%);
  pointer-events: none;
}

.screen-meta {
  position: absolute;
  z-index: 2;
  right: 7%;
  left: 7%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(245, 240, 231, 0.52);
  font-size: clamp(0.38rem, 0.65vw, 0.68rem);
  font-weight: 700;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.screen-meta-top {
  top: 8.5%;
}

.screen-meta-bottom {
  bottom: 6.5%;
}

.screen-brand,
.screen-meta-bottom span:first-child {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

.screen-brand i {
  display: inline-flex;
  width: clamp(1.15rem, 2vw, 1.8rem);
  aspect-ratio: 1;
  align-items: center;
  justify-content: center;
  border-radius: 38%;
  background: #f5f0e7;
  color: #171511;
  font-family: var(--font-serif);
  font-size: clamp(0.68rem, 1.1vw, 1rem);
  font-style: italic;
  letter-spacing: 0;
}

.status-dot {
  display: inline-flex;
  width: 0.42rem;
  height: 0.42rem;
  border-radius: 999px;
  background: #69bd84;
  box-shadow: 0 0 0 4px rgba(105, 189, 132, 0.12);
}

.hero-content {
  position: absolute;
  z-index: 2;
  inset: 13% 7% 10%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
}

.availability-pill {
  display: inline-flex;
  min-height: clamp(1.5rem, 2.7vw, 2.2rem);
  padding: 0.3rem clamp(0.55rem, 1.2vw, 0.95rem);
  align-items: center;
  gap: clamp(0.35rem, 0.65vw, 0.6rem);
  border: 1px solid rgba(245, 240, 231, 0.17);
  border-radius: 999px;
  background: rgba(8, 9, 10, 0.35);
  color: rgba(245, 240, 231, 0.76);
  font-size: clamp(0.42rem, 0.78vw, 0.78rem);
  font-weight: 700;
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
}

.availability-dot {
  position: relative;
  display: inline-flex;
  width: clamp(0.28rem, 0.52vw, 0.48rem);
  height: clamp(0.28rem, 0.52vw, 0.48rem);
}

.availability-dot::before,
.availability-dot span {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: #ee8859;
  content: '';
}

.availability-dot::before {
  animation: availability-pulse 2.2s ease-out infinite;
}

.hero-title {
  margin-top: clamp(0.65rem, 1.6vw, 1.45rem);
  color: #f5f0e7;
  font-size: clamp(1.55rem, 4.45vw, 4.65rem);
  font-weight: 500;
  letter-spacing: -0.058em;
  line-height: 0.91;
}

.hero-title span {
  display: block;
}

.hero-title em {
  color: #ee8859;
  font-family: var(--font-serif);
  font-weight: 400;
}

.hero-description {
  max-width: 43rem;
  margin-top: clamp(0.55rem, 1.4vw, 1.25rem);
  color: rgba(245, 240, 231, 0.66);
  font-size: clamp(0.48rem, 1.05vw, 1rem);
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  margin-top: clamp(0.72rem, 1.65vw, 1.5rem);
  align-items: center;
  justify-content: center;
  gap: clamp(0.35rem, 0.8vw, 0.75rem);
}

.hero-button {
  display: inline-flex;
  min-height: clamp(1.75rem, 3.5vw, 3.15rem);
  padding: 0.4rem clamp(0.7rem, 1.7vw, 1.4rem);
  align-items: center;
  justify-content: center;
  gap: clamp(0.3rem, 0.65vw, 0.65rem);
  border-radius: 999px;
  font-size: clamp(0.45rem, 0.88vw, 0.84rem);
  font-weight: 700;
  transition: transform 0.35s ease, border-color 0.35s ease, background-color 0.35s ease;
}

.hero-button:hover {
  transform: translateY(-3px);
}

.hero-button-primary {
  background: #f5f0e7;
  color: #171511;
}

.hero-button-secondary {
  border: 1px solid rgba(245, 240, 231, 0.2);
  background: rgba(245, 240, 231, 0.055);
  color: #f5f0e7;
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
}

.hero-button-secondary:hover {
  border-color: rgba(245, 240, 231, 0.42);
  background: rgba(245, 240, 231, 0.09);
}

.hero-button-icon {
  width: clamp(0.62rem, 1.2vw, 1.1rem);
  height: clamp(0.62rem, 1.2vw, 1.1rem);
}

.hero-button-arrow {
  width: clamp(0.55rem, 1vw, 1rem);
  height: clamp(0.55rem, 1vw, 1rem);
}

.hero-proof {
  display: flex;
  margin-top: clamp(0.55rem, 1.2vw, 1rem);
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.4rem clamp(0.65rem, 1.4vw, 1.25rem);
  color: rgba(245, 240, 231, 0.54);
  font-size: clamp(0.38rem, 0.68vw, 0.68rem);
}

.hero-proof span {
  display: inline-flex;
  align-items: center;
  gap: 0.34rem;
}

.hero-proof svg {
  width: clamp(0.48rem, 0.85vw, 0.85rem);
  height: clamp(0.48rem, 0.85vw, 0.85rem);
  color: #ee8859;
}

.hero-aura {
  position: absolute;
  z-index: -2;
  border-radius: 50%;
  background: var(--accent);
  filter: blur(130px);
  opacity: 0.1;
  pointer-events: none;
}

.hero-aura-left {
  top: 3rem;
  left: -13rem;
  width: 35rem;
  height: 35rem;
}

.hero-aura-right {
  right: -15rem;
  bottom: -5rem;
  width: 40rem;
  height: 40rem;
  opacity: 0.13;
}

.hero-grid {
  position: absolute;
  z-index: -3;
  inset: 0;
  opacity: 0.32;
  -webkit-mask-image: linear-gradient(to bottom, #000, transparent 80%);
  mask-image: linear-gradient(to bottom, #000, transparent 80%);
}

@keyframes availability-pulse {
  0% { opacity: 0.65; transform: scale(1); }
  75%, 100% { opacity: 0; transform: scale(2.45); }
}

@media (max-width: 767px) {
  .hero-section {
    min-height: auto;
    padding: 6.4rem 0 3.5rem;
  }

  .hero-shell {
    width: calc(100vw - 1rem);
  }

  .screen-meta {
    right: 6%;
    left: 6%;
  }

  .hero-content {
    inset: 10% 8% 7%;
  }

  .hero-description {
    max-width: 17rem;
    line-height: 1.45;
  }

  .hero-button:hover {
    transform: none;
  }
}

@media (max-width: 520px) {
  .screen-meta,
  .hero-proof {
    display: none;
  }

  .hero-content {
    inset: 8% 9% 6%;
  }

  .availability-pill {
    min-height: 1.2rem;
    padding: 0.18rem 0.46rem;
    font-size: 0.34rem;
  }

  .hero-title {
    margin-top: 0.42rem;
    font-size: clamp(1.18rem, 6vw, 1.65rem);
  }

  .hero-description {
    max-width: 15.5rem;
    margin-top: 0.38rem;
    font-size: clamp(0.39rem, 1.9vw, 0.52rem);
  }

  .hero-actions {
    margin-top: 0.48rem;
  }

  .hero-button {
    min-height: 1.42rem;
    padding: 0.28rem 0.58rem;
    font-size: 0.38rem;
  }

  .hero-button-icon,
  .hero-button-arrow {
    width: 0.56rem;
    height: 0.56rem;
  }
}

@media (max-width: 380px) {
  .hero-description {
    display: none;
  }

  .hero-title {
    font-size: 1.15rem;
  }
}
</style>
