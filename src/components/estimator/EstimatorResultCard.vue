<script setup>
import { onUnmounted, ref } from 'vue';
import {
  CheckCircle2,
  Copy,
  Check,
  MessageCircle,
  ShieldCheck,
  Clock,
  Send,
  Lock,
  ChevronRight
} from '@lucide/vue';
import { generateWhatsAppUrl, formatSummaryText } from '../../data/estimator';
import { trackEvent } from '../../lib/analytics';

const props = defineProps({
  result: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['restart']);

const copied = ref(false);
const copyError = ref('');
const showLeadForm = ref(false);
const leadSubmitted = ref(false);

const leadName = ref('');
const leadWhatsapp = ref('');
const leadError = ref('');

let copyTimer;
onUnmounted(() => {
  clearTimeout(copyTimer);
});

async function copyResult() {
  const text = formatSummaryText(props.result);
  copyError.value = '';
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      let ok = false;
      try {
        ok = document.execCommand('copy');
      } finally {
        document.body.removeChild(textarea);
      }
      if (!ok) {
        throw new Error('copy failed');
      }
    }

    copied.value = true;
    trackEvent('copy_result', {
      website_type: props.result.websiteType.id,
      estimated_price: props.result.priceFormatted
    });
  } catch {
    copied.value = false;
    copyError.value = 'Gagal menyalin ringkasan. Silakan coba lagi.';
    return;
  } finally {
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
      copied.value = false;
    }, 2500);
  }
}

function handleWhatsAppClick() {
  trackEvent('whatsapp_click', {
    website_type: props.result.websiteType.id,
    estimated_price: props.result.priceFormatted
  });
}

function normalizeWhatsapp(raw) {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('62')) {
    return digits;
  }
  if (digits.startsWith('0')) {
    return `62${digits.slice(1)}`;
  }
  return digits;
}

function submitLead() {
  const nama = leadName.value.trim();
  const whatsappRaw = leadWhatsapp.value.trim();

  if (!nama) {
    leadError.value = 'Silakan isi nama Anda.';
    return;
  }
  if (!whatsappRaw) {
    leadError.value = 'Silakan isi nomor WhatsApp Anda.';
    return;
  }

  const whatsapp = normalizeWhatsapp(whatsappRaw);
  if (!/^\d{9,15}$/.test(whatsapp)) {
    leadError.value = 'Nomor WhatsApp tidak valid (9–15 digit angka).';
    return;
  }

  leadError.value = '';
  try {
    localStorage.setItem('gandiva_estimator_lead', JSON.stringify({
      nama,
      whatsapp,
      hasil: props.result,
      timestamp: new Date().toISOString()
    }));
  } catch {
    leadError.value = 'Gagal menyimpan. Silakan coba lagi.';
    return;
  }

  leadSubmitted.value = true;

  trackEvent('lead_submitted', {
    website_type: props.result.websiteType.id,
    has_name: true,
    has_whatsapp: true
  });
}
</script>

<template>
  <div class="space-y-6">
    <!-- Result Card Header & Price Panel -->
    <div class="card-surface p-6 md:p-8 space-y-6">
      <!-- Top Status Header -->
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-border-default pb-4 text-xs">
        <div class="flex items-center gap-2">
          <span class="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <h2 class="font-mono font-bold tracking-wider text-accent uppercase">
            Hasil Estimasi Terhitung
          </h2>
        </div>
        <span class="font-mono text-text-tertiary bg-bg-secondary px-3 py-1 rounded-full border border-border-default">
          {{ result.websiteType.title }} • Tier {{ result.complexityLabel ?? result.complexity.toUpperCase() }}
        </span>
      </div>

      <!-- Price & Timeline Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div class="space-y-1">
          <span class="text-[11px] font-mono uppercase tracking-wider text-text-tertiary">
            Estimasi Investasi Awal
          </span>
          <div class="text-3xl sm:text-4xl font-medium tracking-tight text-text-primary">
            {{ result.priceFormatted }}
          </div>
          <p class="text-[11px] text-text-secondary pt-0.5">
            Estimasi awal transparan sebelum diskusi final.
          </p>
        </div>

        <div class="p-4 rounded-xl bg-bg-secondary/60 border border-border-default flex items-center gap-3.5">
          <span class="liquid-icon flex h-10 w-10 items-center justify-center rounded-xl text-accent shrink-0">
            <Clock class="h-5 w-5" />
          </span>
          <div>
            <span class="text-[10px] font-mono uppercase text-text-tertiary">Waktu Pengerjaan</span>
            <div class="text-sm font-bold text-text-primary">
              {{ result.timelineText }}
            </div>
          </div>
        </div>
      </div>

      <!-- Rationale Box -->
      <div class="p-4 rounded-xl bg-bg-secondary/40 border border-border-default text-xs leading-relaxed text-text-secondary">
        <strong class="text-accent font-semibold">Alasan Rekomendasi:</strong> {{ result.rationale }}
      </div>

      <!-- Free Domain, Maintenance & Monitoring Guarantee Card -->
      <div class="p-4.5 rounded-xl bg-bg-secondary/70 border border-border-default space-y-2">
        <div class="flex items-center gap-2.5">
          <ShieldCheck class="h-4 w-4 text-accent shrink-0" />
          <h3 class="text-xs font-bold text-text-primary">
            Garansi Maintenance 6 Bulan & Infrastructure Support
          </h3>
        </div>
        <p class="text-xs text-text-secondary leading-relaxed pl-6">
          <strong>Free Maintenance & Bug Fixes 6 Bulan</strong> serta <strong>Monitoring Uptime & Keamanan 24/7</strong> disertakan tanpa biaya tambahan. <strong>Gratis Domain (.com / .my.id)</strong> & Cloud Server 100% dibantu setup gratis dengan kepemilikan akun penuh atas nama Anda.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <a
          :href="generateWhatsAppUrl(result)"
          target="_blank"
          rel="noopener noreferrer"
          @click="handleWhatsAppClick"
          class="inline-flex min-h-12 items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-[#f5f0e7] bg-accent hover:bg-accent-hover transition-colors shadow-sm"
        >
          <MessageCircle class="h-4 w-4" />
          <span>Konsultasi via WhatsApp</span>
        </a>

        <button
          type="button"
          @click="copyResult"
          class="inline-flex min-h-12 items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-text-primary bg-bg-secondary hover:bg-bg-card border border-border-default transition-colors"
        >
          <component :is="copied ? Check : Copy" class="h-4 w-4 text-accent" />
          <span>{{ copied ? 'Berhasil Disalin' : 'Salin Ringkasan Hasil' }}</span>
        </button>
      </div>
      <p v-if="copyError" class="text-[11px] text-rose-500 font-mono">{{ copyError }}</p>
    </div>

    <!-- Summary Details Breakdown Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Included Inclusions -->
      <div class="p-5 rounded-2xl bg-bg-card border border-border-default space-y-3">
        <h3 class="text-xs font-bold text-text-tertiary uppercase tracking-wider font-mono">
          Fitur Standar Termasuk
        </h3>
        <ul class="space-y-2 text-xs text-text-secondary">
          <li v-for="inc in result.inclusions" :key="inc.id" class="flex items-center justify-between">
            <span class="flex items-center gap-2 text-[11px]">
              <CheckCircle2 class="h-3.5 w-3.5 text-accent shrink-0" />
              {{ inc.label }}
            </span>
            <span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-bg-secondary text-text-tertiary">
              {{ inc.badge }}
            </span>
          </li>
        </ul>
      </div>

      <!-- Selected Addons -->
      <div class="p-5 rounded-2xl bg-bg-card border border-border-default space-y-3">
        <h3 class="text-xs font-bold text-text-tertiary uppercase tracking-wider font-mono">
          Fitur Add-On Pilihan
        </h3>
        <div v-if="result.selectedAddons.length === 0" class="text-xs text-text-tertiary py-3 text-center border border-dashed border-border-default rounded-xl">
          Tidak ada add-on berbayar (Paket Standar)
        </div>
        <ul v-else class="space-y-2 text-xs text-text-secondary">
          <li v-for="addon in result.selectedAddons" :key="addon.id" class="flex items-center justify-between p-2 rounded-lg bg-bg-secondary/60 border border-border-default">
            <span class="font-medium text-text-primary text-[11px]">{{ addon.title }}</span>
            <span class="font-mono text-accent font-semibold text-[11px]">{{ addon.priceFormatted }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Optional Lead Capture Card -->
    <div class="p-5 rounded-2xl bg-bg-card border border-border-default space-y-3">
      <div class="flex items-center justify-between cursor-pointer" @click="showLeadForm = !showLeadForm">
        <div class="space-y-0.5">
          <h3 class="text-xs font-bold text-text-primary flex items-center gap-2">
            <Lock class="h-3.5 w-3.5 text-accent" />
            Simpan Hasil Estimasi ke Kontak Anda (Opsional)
          </h3>
          <p class="text-[11px] text-text-tertiary">
            Hasil estimasi tetap bisa langsung digunakan via WhatsApp tanpa mengikat.
          </p>
        </div>
        <ChevronRight :class="['h-4 w-4 text-text-tertiary transition-transform', showLeadForm ? 'rotate-90' : '']" />
      </div>

      <div v-if="showLeadForm" class="pt-3 border-t border-border-default space-y-2.5">
        <div v-if="leadSubmitted" class="p-3 rounded-lg bg-accent-subtle/50 text-xs text-text-primary flex items-center gap-2">
          <CheckCircle2 class="h-4 w-4 text-accent shrink-0" />
          <span>Terima kasih. Informasi estimasi Anda telah tersimpan secara aman.</span>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <input
            v-model="leadName"
            type="text"
            placeholder="Nama Anda"
            class="px-3.5 py-2.5 rounded-xl bg-bg-secondary border border-border-default text-xs text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent"
          />
          <input
            v-model="leadWhatsapp"
            type="tel"
            placeholder="Nomor WhatsApp"
            class="px-3.5 py-2.5 rounded-xl bg-bg-secondary border border-border-default text-xs text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent"
          />
          <button
            type="button"
            @click="submitLead"
            class="px-4 py-2.5 rounded-xl bg-bg-secondary hover:bg-bg-card text-xs font-semibold text-text-primary border border-border-default flex items-center justify-center gap-2 transition-colors"
          >
            <Send class="h-3.5 w-3.5 text-accent" />
            <span>Simpan</span>
          </button>
        </div>
        <p v-if="leadError" class="text-[11px] text-rose-500 font-mono">{{ leadError }}</p>
      </div>
    </div>

    <!-- Restart CTA -->
    <div class="text-center pt-1">
      <button
        type="button"
        @click="emit('restart')"
        class="text-xs text-text-tertiary hover:text-text-primary underline underline-offset-4 transition-colors"
      >
        Mulai hitung ulang estimasi dari awal
      </button>
    </div>
  </div>
</template>
