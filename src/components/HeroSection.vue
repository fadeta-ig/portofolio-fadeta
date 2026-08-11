<script setup>
import { computed, ref } from 'vue';
import {
  ArrowRight,
  ArrowUpRight,
  BadgeDollarSign,
  ChevronLeft,
  ChevronRight,
  Mail,
  MessageCircle,
  ShieldCheck,
  TrendingUp
} from '@lucide/vue';
import { siInstagram, siThreads, siWhatsapp } from 'simple-icons';
import { contact, createWhatsAppLink } from '../data/contact';

const whatsappLink = createWhatsAppLink(
  'Halo Gandiva Labs, saya ingin membahas masalah dan kebutuhan website bisnis saya.'
);

const socialLinks = [
  {
    label: 'WhatsApp',
    href: whatsappLink,
    brandPath: siWhatsapp.path,
    external: true
  },
  {
    label: 'Email',
    href: `mailto:${contact.email}`,
    icon: Mail,
    external: false
  },
  {
    label: 'Threads',
    href: 'https://www.threads.com/@gandivalabs',
    brandPath: siThreads.path,
    external: true
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/gandivalabs',
    brandPath: siInstagram.path,
    external: true
  }
];

const benefits = [
  {
    title: 'Konsultasi gratis 30 menit',
    text: 'Bedah kebutuhan & alur website bisnis Anda tanpa biaya.',
    icon: MessageCircle
  },
  {
    title: 'Harga transparan',
    text: 'Ruang lingkup & biaya disepakati di awal tanpa charge tersembunyi.',
    icon: BadgeDollarSign
  },
  {
    title: 'Garansi 6 bulan',
    text: 'Dukungan teknis penuh agar website selalu lancar setelah rilis.',
    icon: ShieldCheck
  },
  {
    title: 'Bisa dikembangkan kapan saja',
    text: 'Struktur rapi yang siap ditambah halaman atau fitur baru saat bisnis bertambah besar.',
    icon: TrendingUp
  }
];

const activeBenefitIndex = ref(0);
const benefitDirection = ref('next');
const activeBenefit = computed(() => benefits[activeBenefitIndex.value]);
const benefitTransitionName = computed(() => `benefit-${benefitDirection.value}`);

function showPreviousBenefit() {
  benefitDirection.value = 'previous';
  activeBenefitIndex.value = (activeBenefitIndex.value - 1 + benefits.length) % benefits.length;
}

function showNextBenefit() {
  benefitDirection.value = 'next';
  activeBenefitIndex.value = (activeBenefitIndex.value + 1) % benefits.length;
}

</script>

<template>
  <section id="hero" class="hero-section">
    <div class="hero-shell">
      <div class="hero-frame">
        <picture class="hero-visual" aria-hidden="true">
          <source media="(max-width: 767px)" :srcset="'/gandiva-hero-editorial-mobile-v1.webp'" width="640" height="960">
          <img
            :src="'/gandiva-hero-editorial-v2.webp'"
            alt=""
            width="1672"
            height="941"
            fetchpriority="high"
            loading="eager"
            decoding="sync"
          >
        </picture>
        <div class="hero-visual-overlay" aria-hidden="true" />
        <div class="hero-grain" aria-hidden="true" />

        <div class="hero-content">
          <div class="hero-reveal hero-availability">
            <span class="hero-availability-dot" aria-hidden="true">
              <span />
            </span>
            Menerima proyek website baru
          </div>

          <h1 class="hero-reveal hero-title">
            <span>Bikin bisnis Anda</span>
            <span>meyakinkan di <em>internet.</em></span>
          </h1>

          <p class="hero-reveal hero-description">
            Kami membangun website yang cepat dibuka, tampilan elegan, dan langsung menjelaskan
            nilai produk Anda agar calon pembeli tidak ragu untuk menghubungi.
          </p>

          <div class="hero-reveal hero-actions">
            <RouterLink
              to="/konsultasi"
              data-track="hero_consultation"
              class="hero-button hero-button-primary group"
            >
              <MessageCircle class="hero-button-icon" aria-hidden="true" />
              Konsultasi Proyek Gratis
              <ArrowUpRight
                class="hero-button-arrow transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </RouterLink>

            <RouterLink
              to="/kalkulator-website"
              class="hero-button hero-button-secondary group"
            >
              Hitung Estimasi Website
              <ArrowRight
                class="hero-button-arrow transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </RouterLink>

            <RouterLink
              to="/portfolio"
              class="hero-button hero-button-secondary group"
            >
              Lihat Portofolio
              <ArrowRight
                class="hero-button-arrow transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </RouterLink>
          </div>
        </div>

        <nav class="hero-floating-element hero-socials" aria-label="Kanal Gandiva Labs">
          <a
            v-for="item in socialLinks"
            :key="item.label"
            :href="item.href"
            :target="item.external ? '_blank' : undefined"
            :rel="item.external ? 'noopener noreferrer' : undefined"
            class="hero-social-link"
            :aria-label="item.external ? `Buka ${item.label} Gandiva Labs di tab baru` : `Hubungi Gandiva Labs melalui ${item.label}`"
          >
            <svg
              v-if="item.brandPath"
              viewBox="0 0 24 24"
              role="img"
              aria-hidden="true"
              class="hero-brand-icon"
            >
              <path :d="item.brandPath" fill="currentColor" />
            </svg>
            <component v-else :is="item.icon" aria-hidden="true" />
            <span class="hero-social-label">{{ item.label }}</span>
          </a>
        </nav>

        <div
          class="hero-floating-element hero-benefit-card"
          role="region"
          aria-roledescription="carousel"
          aria-label="Keunggulan layanan Gandiva Labs"
        >
          <div class="hero-benefit-icon" aria-hidden="true">
            <Transition :name="benefitTransitionName" mode="out-in">
              <component
                :is="activeBenefit.icon"
                :key="activeBenefit.title"
              />
            </Transition>
          </div>

          <div class="hero-benefit-copy" aria-live="polite">
            <Transition :name="benefitTransitionName" mode="out-in">
              <div :key="activeBenefit.title">
                <span>Keunggulan Gandiva</span>
                <strong>{{ activeBenefit.title }}</strong>
                <p>{{ activeBenefit.text }}</p>
              </div>
            </Transition>
          </div>

          <div class="hero-benefit-navigation">
            <button
              type="button"
              aria-label="Lihat keunggulan sebelumnya"
              @click="showPreviousBenefit"
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Lihat keunggulan berikutnya"
              @click="showNextBenefit"
            >
              <ChevronRight aria-hidden="true" />
            </button>
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
  min-height: 100svh;
  overflow: hidden;
  padding: 0;
  background: #08090a;
  color: #f5f0e7;
}

.hero-shell {
  width: 100%;
  min-height: 100svh;
  margin: 0;
}

.hero-frame {
  position: relative;
  width: 100%;
  min-height: 100svh;
  overflow: hidden;
  border: 0;
  border-radius: 0;
  background: #0b0c0d;
  box-shadow: none;
}

.hero-visual {
  position: absolute;
  z-index: 0;
  top: -0.75rem;
  right: -0.75rem;
  bottom: -0.75rem;
  left: -0.75rem;
  width: calc(100% + 1.5rem);
  height: calc(100% + 1.5rem);
  pointer-events: none;
}

.hero-visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 62% center;
}

.hero-visual-overlay {
  position: absolute;
  z-index: 1;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(7, 8, 9, 0.98) 0%, rgba(7, 8, 9, 0.91) 33%, rgba(7, 8, 9, 0.38) 62%, rgba(7, 8, 9, 0.08) 100%),
    linear-gradient(180deg, rgba(6, 7, 8, 0.4) 0%, transparent 30%, transparent 62%, rgba(6, 7, 8, 0.54) 100%);
}

.hero-grain {
  position: absolute;
  z-index: 3;
  inset: 0;
  opacity: 0.11;
  background-image: radial-gradient(rgba(255, 255, 255, 0.24) 0.55px, transparent 0.75px);
  background-size: 4px 4px;
  mix-blend-mode: soft-light;
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 4;
  display: flex;
  width: min(62%, 46rem);
  min-height: 100svh;
  padding: clamp(7.4rem, 12vh, 9rem) clamp(1.5rem, 4.8vw, 4rem) clamp(8.5rem, 16vh, 10rem);
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
}

.hero-availability {
  display: inline-flex;
  min-height: 2.25rem;
  padding: 0.4rem 0.85rem;
  align-items: center;
  gap: 0.65rem;
  border: 1px solid rgba(245, 240, 231, 0.18);
  border-radius: 999px;
  background: rgba(10, 11, 12, 0.36);
  color: rgba(245, 240, 231, 0.74);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
}

.hero-availability-dot {
  position: relative;
  display: inline-flex;
  width: 0.48rem;
  height: 0.48rem;
}

.hero-availability-dot::before,
.hero-availability-dot span {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: #ee8859;
  content: '';
}

.hero-availability-dot::before {
  animation: hero-status-pulse 2.2s ease-out infinite;
}

.hero-title {
  max-width: 44rem;
  margin-top: clamp(1.1rem, 2.4vh, 1.75rem);
  color: #f7f3ec;
  font-size: clamp(3.15rem, 5.25vw, 5.35rem);
  font-weight: 520;
  letter-spacing: -0.062em;
  line-height: 0.93;
  text-wrap: balance;
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
  max-width: 36rem;
  margin-top: clamp(1.15rem, 2.6vh, 1.7rem);
  color: rgba(245, 240, 231, 0.7);
  font-size: clamp(0.98rem, 1.25vw, 1.08rem);
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  margin-top: clamp(1.45rem, 3.2vh, 2rem);
  align-items: center;
  gap: 0.75rem;
}

.hero-button {
  display: inline-flex;
  min-height: 3.25rem;
  padding: 0.75rem 1.25rem;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  border-radius: 999px;
  font-size: 0.84rem;
  font-weight: 750;
  transition:
    transform 0.32s ease,
    border-color 0.32s ease,
    background-color 0.32s ease,
    color 0.32s ease;
}

.hero-button:hover {
  transform: translateY(-2px);
}

.hero-button-primary {
  background: #f5f0e7;
  color: #171511;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
}

.hero-button-primary:hover {
  background: #fffaf2;
}

.hero-button-secondary {
  border: 1px solid rgba(245, 240, 231, 0.22);
  background: rgba(10, 11, 12, 0.32);
  color: #f5f0e7;
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
}

.hero-button-secondary:hover {
  border-color: rgba(245, 240, 231, 0.48);
  background: rgba(245, 240, 231, 0.08);
}

.hero-button-icon,
.hero-button-arrow {
  width: 1rem;
  height: 1rem;
  flex: 0 0 auto;
}

.hero-socials {
  position: absolute;
  z-index: 6;
  bottom: 1.35rem;
  left: 1.35rem;
  display: flex;
  padding: 0.35rem;
  gap: 0.2rem;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  background:
    radial-gradient(circle at 22% 0%, rgba(255, 255, 255, 0.2), transparent 42%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.055));
  box-shadow:
    0 16px 40px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.22),
    inset 0 -1px 0 rgba(255, 255, 255, 0.05);
  -webkit-backdrop-filter: blur(24px) saturate(170%);
  backdrop-filter: blur(24px) saturate(170%);
}

.hero-social-link {
  position: relative;
  display: inline-flex;
  width: 2.5rem;
  height: 2.5rem;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: 999px;
  background: transparent;
  color: rgba(255, 255, 255, 0.82);
  transition:
    transform 0.3s ease,
    border-color 0.3s ease,
    background-color 0.3s ease,
    color 0.3s ease;
}

.hero-social-link:hover {
  border-color: rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.16);
  color: #ffffff;
  transform: translateY(-2px);
}

.hero-social-link svg {
  width: 1.05rem;
  height: 1.05rem;
  stroke-width: 1.8;
}

.hero-brand-icon {
  display: block;
  fill: currentcolor;
}

.hero-social-label {
  position: absolute;
  bottom: calc(100% + 0.55rem);
  left: 50%;
  padding: 0.32rem 0.5rem;
  border: 1px solid rgba(245, 240, 231, 0.14);
  border-radius: 0.45rem;
  background: rgba(8, 9, 10, 0.9);
  color: #f5f0e7;
  font-size: 0.67rem;
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, 0.25rem);
  transition: opacity 0.22s ease, transform 0.22s ease;
  white-space: nowrap;
}

.hero-social-link:hover .hero-social-label,
.hero-social-link:focus-visible .hero-social-label {
  opacity: 1;
  transform: translate(-50%, 0);
}

.hero-benefit-card {
  position: absolute;
  z-index: 6;
  right: clamp(1.15rem, 3.1vw, 2.6rem);
  bottom: 1.35rem;
  display: grid;
  width: min(27rem, 38vw);
  min-height: 8rem;
  padding: 0.75rem;
  grid-template-columns: 5.75rem minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1.35rem;
  background:
    radial-gradient(circle at 12% -15%, rgba(255, 255, 255, 0.24), transparent 38%),
    radial-gradient(circle at 92% 112%, rgba(238, 136, 89, 0.13), transparent 34%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.155), rgba(255, 255, 255, 0.065) 52%, rgba(255, 255, 255, 0.1));
  color: #f5f0e7;
  box-shadow:
    0 24px 64px rgba(0, 0, 0, 0.38),
    inset 0 1px 0 rgba(255, 255, 255, 0.28),
    inset 0 -1px 0 rgba(255, 255, 255, 0.055),
    inset 1px 0 0 rgba(255, 255, 255, 0.08);
  -webkit-backdrop-filter: blur(30px) saturate(175%);
  backdrop-filter: blur(30px) saturate(175%);
}

.hero-benefit-icon {
  position: relative;
  display: flex;
  width: 5.75rem;
  height: 6.45rem;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.38);
  border-radius: 1rem;
  background:
    radial-gradient(circle at 68% 18%, rgba(255, 255, 255, 0.74), transparent 34%),
    linear-gradient(145deg, rgba(255, 225, 201, 0.82), rgba(226, 125, 73, 0.7));
  color: #2b160e;
  box-shadow:
    0 12px 30px rgba(24, 10, 4, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.56),
    inset 0 -1px 0 rgba(106, 49, 25, 0.12);
  -webkit-backdrop-filter: blur(16px) saturate(150%);
  backdrop-filter: blur(16px) saturate(150%);
}

.hero-benefit-icon svg {
  width: 2.25rem;
  height: 2.25rem;
  stroke-width: 1.45;
}

.hero-benefit-copy {
  min-width: 0;
}

.hero-benefit-copy > div {
  display: flex;
  min-height: 5.4rem;
  justify-content: center;
  flex-direction: column;
}

.hero-benefit-copy span {
  margin-bottom: 0.38rem;
  color: rgba(245, 240, 231, 0.5);
  font-size: 0.61rem;
  font-weight: 750;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.hero-benefit-copy strong {
  color: #fffaf4;
  font-size: 1rem;
  font-weight: 750;
  letter-spacing: -0.025em;
  line-height: 1.2;
}

.hero-benefit-copy p {
  max-width: 15rem;
  margin-top: 0.4rem;
  color: rgba(245, 240, 231, 0.62);
  font-size: 0.7rem;
  line-height: 1.45;
}

.hero-benefit-navigation {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.hero-benefit-navigation button {
  display: inline-flex;
  width: 2.35rem;
  height: 2.35rem;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 999px;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.13));
  color: #ffffff;
  box-shadow:
    0 8px 22px rgba(0, 0, 0, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.32);
  -webkit-backdrop-filter: blur(16px) saturate(165%);
  backdrop-filter: blur(16px) saturate(165%);
  transition: transform 0.26s ease, background-color 0.26s ease, border-color 0.26s ease;
}

.hero-benefit-navigation button:hover {
  border-color: rgba(255, 255, 255, 0.42);
  background: rgba(255, 255, 255, 0.26);
  transform: translateY(-2px);
}

.hero-benefit-navigation button:focus-visible {
  outline: 2px solid #ee8859;
  outline-offset: 2px;
}

.hero-benefit-navigation svg {
  width: 0.95rem;
  height: 0.95rem;
  stroke-width: 2;
}

.benefit-next-enter-active,
.benefit-next-leave-active,
.benefit-previous-enter-active,
.benefit-previous-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.benefit-next-enter-from {
  opacity: 0;
  transform: translateX(0.6rem);
}

.benefit-next-leave-to {
  opacity: 0;
  transform: translateX(-0.5rem);
}

.benefit-previous-enter-from {
  opacity: 0;
  transform: translateX(-0.6rem);
}

.benefit-previous-leave-to {
  opacity: 0;
  transform: translateX(0.5rem);
}

@keyframes hero-status-pulse {
  0% {
    opacity: 0.6;
    transform: scale(1);
  }
  75%,
  100% {
    opacity: 0;
    transform: scale(2.45);
  }
}

@media (max-width: 1100px) {
  .hero-content {
    width: 68%;
    padding-right: 2rem;
  }

  .hero-title {
    font-size: clamp(3.25rem, 7vw, 4.8rem);
  }

  .hero-visual img {
    object-position: 66% center;
  }

  .hero-visual-overlay {
    background:
      linear-gradient(90deg, rgba(7, 8, 9, 0.98) 0%, rgba(7, 8, 9, 0.9) 42%, rgba(7, 8, 9, 0.34) 75%, rgba(7, 8, 9, 0.12) 100%),
      linear-gradient(180deg, rgba(6, 7, 8, 0.44) 0%, transparent 30%, transparent 65%, rgba(6, 7, 8, 0.88) 100%);
  }

  .hero-grain {
    display: none;
  }

  .hero-benefit-card {
    width: min(25rem, 48vw);
  }
}

@media (max-width: 767px) {
  .hero-section {
    padding: 0;
  }

  .hero-shell,
  .hero-frame {
    min-height: 100svh;
  }

  .hero-frame {
    display: flex;
    border: 0;
    border-radius: 0;
    flex-direction: column;
  }

  .hero-visual {
    top: -0.5rem;
    right: -0.5rem;
    bottom: -0.5rem;
    left: -0.5rem;
    width: calc(100% + 1rem);
    height: calc(100% + 1rem);
  }

  .hero-visual img {
    object-position: 69% center;
  }

  .hero-visual-overlay {
    background:
      linear-gradient(90deg, rgba(7, 8, 9, 0.96) 0%, rgba(7, 8, 9, 0.84) 62%, rgba(7, 8, 9, 0.4) 100%),
      linear-gradient(180deg, rgba(6, 7, 8, 0.58) 0%, rgba(6, 7, 8, 0.08) 36%, rgba(6, 7, 8, 0.32) 58%, rgba(6, 7, 8, 0.96) 82%);
  }

  .hero-content {
    width: 100%;
    min-height: auto;
    padding: 7.25rem 1.2rem 0;
    justify-content: flex-start;
  }

  .hero-availability {
    min-height: 2.15rem;
    padding-inline: 0.75rem;
    font-size: 0.69rem;
  }

  .hero-title {
    max-width: 35rem;
    margin-top: 1.15rem;
    font-size: clamp(3rem, 13.2vw, 4.35rem);
    line-height: 0.94;
  }

  .hero-description {
    max-width: 33rem;
    margin-top: 1.2rem;
    font-size: 0.96rem;
    line-height: 1.62;
  }

  .hero-actions {
    width: 100%;
    max-width: 23rem;
    margin-top: 1.45rem;
    align-items: stretch;
    flex-direction: column;
    gap: 0.6rem;
  }

  .hero-button {
    width: 100%;
    min-height: 3.2rem;
  }

  .hero-button:hover,
  .hero-social-link:hover,
  .hero-benefit-navigation button:hover {
    transform: none;
  }

  .hero-socials {
    position: relative;
    right: auto;
    bottom: auto;
    left: auto;
    order: 3;
    align-self: flex-start;
    margin: 0.75rem 1rem 1.15rem;
    padding: 0.3rem;
  }

  .hero-social-link {
    width: 2.5rem;
    height: 2.5rem;
  }

  .hero-benefit-card {
    position: relative;
    right: auto;
    bottom: auto;
    left: auto;
    width: calc(100% - 1.8rem);
    min-height: 8rem;
    order: 2;
    margin: 1rem 0.9rem 0;
    grid-template-columns: 4.6rem minmax(0, 1fr);
    gap: 0.75rem;
  }

  .hero-benefit-icon {
    width: 4.6rem;
    height: 6.4rem;
  }

  .hero-benefit-copy {
    padding-right: 4.85rem;
  }

  .hero-benefit-copy p {
    max-width: none;
  }

  .hero-benefit-navigation {
    position: absolute;
    right: 0.75rem;
    bottom: 0.72rem;
  }

}

@media (max-width: 390px) {
  .hero-content {
    padding-inline: 1rem;
  }

  .hero-title {
    font-size: 2.65rem;
  }

  .hero-description {
    font-size: 0.91rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-availability-dot::before {
    animation: none;
  }

  .hero-button,
  .hero-social-link,
  .hero-social-label,
  .hero-benefit-navigation button,
  .benefit-next-enter-active,
  .benefit-next-leave-active,
  .benefit-previous-enter-active,
  .benefit-previous-leave-active {
    transition: none;
  }
}
</style>
