<script setup>
import { computed, defineAsyncComponent, nextTick, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowRight, Check, LoaderCircle, LockKeyhole } from '@lucide/vue';
import { trackEvent } from '../lib/analytics';

const props = defineProps({
  variant: {
    type: String,
    default: 'full',
    validator: (value) => ['compact', 'full'].includes(value)
  },
  source: {
    type: String,
    default: 'consultation-page'
  }
});

const router = useRouter();
const isFull = computed(() => props.variant === 'full');
const isSubmitting = ref(false);
const submitError = ref('');
const errors = ref({});
const turnstileToken = ref('');
const turnstileWidget = ref(null);
const securityCheckRef = ref(null);
const turnstileSiteKey = (import.meta.env.VITE_TURNSTILE_SITE_KEY || '').trim();
const TurnstileWidget = turnstileSiteKey
  ? defineAsyncComponent(() => import('./TurnstileWidget.vue'))
  : null;
const formStartedAt = Date.now();
const submissionId = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const form = reactive({
  name: '',
  company: '',
  email: '',
  whatsapp: '',
  service: '',
  timeline: '',
  summary: '',
  consent: false,
  website: ''
});

const serviceOptions = [
  'Company profile',
  'Landing page',
  'Toko online',
  'Website custom',
  'Redesign website',
  'Belum yakin'
];

const timelineOptions = [
  'Kurang dari 1 bulan',
  '1-2 bulan',
  '2-3 bulan',
  'Lebih dari 3 bulan',
  'Belum ditentukan'
];

function clearError(field) {
  if (!errors.value[field]) return;
  const nextErrors = { ...errors.value };
  delete nextErrors[field];
  errors.value = nextErrors;
}

function validateForm() {
  const nextErrors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (form.name.trim().length < 2) nextErrors.name = 'Masukkan nama lengkap Anda.';
  if (!emailPattern.test(form.email.trim())) nextErrors.email = 'Masukkan alamat email yang valid.';
  if (form.whatsapp && form.whatsapp.replace(/\D/g, '').length < 8) nextErrors.whatsapp = 'Periksa kembali nomor WhatsApp Anda.';
  if (!form.service) nextErrors.service = 'Pilih jenis kebutuhan yang paling mendekati.';
  if (isFull.value && !form.timeline) nextErrors.timeline = 'Pilih target waktu atau “Belum ditentukan”.';
  if (form.summary.trim().length < 20) nextErrors.summary = 'Ceritakan kebutuhan Anda sedikit lebih detail, minimal 20 karakter.';
  if (!form.consent) nextErrors.consent = 'Persetujuan diperlukan agar kami dapat menghubungi Anda.';
  if (turnstileSiteKey && !turnstileToken.value) nextErrors.turnstile = 'Selesaikan verifikasi keamanan terlebih dahulu.';

  errors.value = nextErrors;
  return Object.keys(nextErrors).length === 0;
}

async function focusFirstError() {
  await nextTick();
  const firstInvalidField = document.querySelector('[data-consultation-form] [aria-invalid="true"]');
  const focusTarget = firstInvalidField
    ?? (errors.value.turnstile ? securityCheckRef.value : null);
  focusTarget?.focus();
}

function handleTurnstileToken(token) {
  turnstileToken.value = token;
  clearError('turnstile');
}

function handleTurnstileError() {
  errors.value = {
    ...errors.value,
    turnstile: 'Verifikasi keamanan tidak tersedia. Muat ulang halaman lalu coba kembali.'
  };
}

async function submitForm() {
  submitError.value = '';

  if (!validateForm()) {
    await focusFirstError();
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        variant: props.variant,
        source: props.source,
        submissionId,
        formStartedAt,
        turnstileToken: turnstileToken.value
      })
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok && result.errors) {
      errors.value = result.errors;
      await focusFirstError();
      throw new Error(result.message || 'Periksa kembali informasi yang dimasukkan.');
    }
    if (!response.ok) throw new Error(result.message || 'Form belum berhasil dikirim. Silakan coba kembali.');

    try {
      sessionStorage.setItem('gandiva-consultation-sent', 'true');
    } catch {
      // The thank-you route remains accessible when browser storage is unavailable.
    }

    trackEvent('generate_lead', { form_source: props.source, form_variant: props.variant, service: form.service });
    await router.push({ name: 'thank-you' });
  } catch (error) {
    if (turnstileSiteKey) {
      turnstileToken.value = '';
      turnstileWidget.value?.reset();
    }
    submitError.value = error.message || 'Terjadi kendala saat mengirim form. Silakan coba kembali.';
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <form data-consultation-form novalidate class="consultation-form" @submit.prevent="submitForm">
    <p class="mb-6 text-xs leading-relaxed text-text-tertiary">
      Kolom bertanda <span class="font-bold text-accent">*</span> wajib diisi. Informasi Anda hanya digunakan untuk menindaklanjuti kebutuhan ini.
    </p>

    <div class="grid gap-5 md:grid-cols-2">
      <div class="form-field">
        <label for="consultation-name">Nama lengkap <span aria-hidden="true">*</span></label>
        <input
          id="consultation-name"
          v-model="form.name"
          name="name"
          type="text"
          required
          autocomplete="name"
          placeholder="Nama Anda"
          :aria-invalid="Boolean(errors.name)"
          :aria-describedby="errors.name ? 'consultation-name-error' : undefined"
          @input="clearError('name')"
        >
        <span v-if="errors.name" id="consultation-name-error" class="field-error">{{ errors.name }}</span>
      </div>

      <div v-if="isFull" class="form-field">
        <label for="consultation-company">Nama bisnis <span class="font-normal text-text-tertiary">(opsional)</span></label>
        <input
          id="consultation-company"
          v-model="form.company"
          name="company"
          type="text"
          autocomplete="organization"
          placeholder="Nama brand atau perusahaan"
        >
      </div>

      <div class="form-field">
        <label for="consultation-email">Email aktif <span aria-hidden="true">*</span></label>
        <input
          id="consultation-email"
          v-model="form.email"
          name="email"
          type="email"
          required
          inputmode="email"
          autocomplete="email"
          placeholder="nama@perusahaan.com"
          :aria-invalid="Boolean(errors.email)"
          :aria-describedby="errors.email ? 'consultation-email-error' : undefined"
          @input="clearError('email')"
        >
        <span v-if="errors.email" id="consultation-email-error" class="field-error">{{ errors.email }}</span>
      </div>

      <div class="form-field">
        <label for="consultation-whatsapp">WhatsApp <span class="font-normal text-text-tertiary">(opsional)</span></label>
        <input
          id="consultation-whatsapp"
          v-model="form.whatsapp"
          name="whatsapp"
          type="tel"
          inputmode="tel"
          autocomplete="tel"
          placeholder="Contoh: 0812 3456 7890"
          :aria-invalid="Boolean(errors.whatsapp)"
          :aria-describedby="errors.whatsapp ? 'consultation-whatsapp-error' : undefined"
          @input="clearError('whatsapp')"
        >
        <span v-if="errors.whatsapp" id="consultation-whatsapp-error" class="field-error">{{ errors.whatsapp }}</span>
      </div>

      <div class="form-field" :class="isFull ? '' : 'md:col-span-2'">
        <label for="consultation-service">Kebutuhan utama <span aria-hidden="true">*</span></label>
        <select
          id="consultation-service"
          v-model="form.service"
          name="service"
          required
          :aria-invalid="Boolean(errors.service)"
          :aria-describedby="errors.service ? 'consultation-service-error' : undefined"
          @change="clearError('service')"
        >
          <option value="" disabled>Pilih jenis website</option>
          <option v-for="option in serviceOptions" :key="option" :value="option">{{ option }}</option>
        </select>
        <span v-if="errors.service" id="consultation-service-error" class="field-error">{{ errors.service }}</span>
      </div>

      <div v-if="isFull" class="form-field md:col-span-2">
        <label for="consultation-timeline">Target waktu <span aria-hidden="true">*</span></label>
        <select
          id="consultation-timeline"
          v-model="form.timeline"
          name="timeline"
          required
          :aria-invalid="Boolean(errors.timeline)"
          :aria-describedby="errors.timeline ? 'consultation-timeline-error' : undefined"
          @change="clearError('timeline')"
        >
          <option value="" disabled>Pilih target waktu</option>
          <option v-for="option in timelineOptions" :key="option" :value="option">{{ option }}</option>
        </select>
        <span v-if="errors.timeline" id="consultation-timeline-error" class="field-error">{{ errors.timeline }}</span>
      </div>

      <div class="form-field md:col-span-2">
        <label for="consultation-summary">Apa yang ingin Anda capai? <span aria-hidden="true">*</span></label>
        <textarea
          id="consultation-summary"
          v-model="form.summary"
          name="summary"
          rows="5"
          maxlength="2000"
          required
          placeholder="Contoh: Kami ingin memperbarui company profile agar calon klien lebih mudah memahami layanan dan menghubungi tim sales."
          :aria-invalid="Boolean(errors.summary)"
          :aria-describedby="errors.summary ? 'consultation-summary-error' : 'consultation-summary-hint'"
          @input="clearError('summary')"
        />
        <div class="flex items-start justify-between gap-4">
          <span v-if="errors.summary" id="consultation-summary-error" class="field-error">{{ errors.summary }}</span>
          <span v-else id="consultation-summary-hint" class="field-hint">Tidak perlu memakai istilah teknis.</span>
          <span class="ml-auto text-[10px] text-text-tertiary">{{ form.summary.length }}/2000</span>
        </div>
      </div>
    </div>

    <div class="honeypot" aria-hidden="true">
      <label for="consultation-website">Website perusahaan</label>
      <input id="consultation-website" v-model="form.website" name="website" type="text" tabindex="-1" autocomplete="off">
    </div>

    <div class="mt-5">
      <label class="consent-row" :class="errors.consent ? 'consent-row-error' : ''">
        <input
          v-model="form.consent"
          name="consent"
          type="checkbox"
          required
          :aria-invalid="Boolean(errors.consent)"
          :aria-describedby="errors.consent ? 'consultation-consent-error' : undefined"
          @change="clearError('consent')"
        >
        <span class="consent-box" aria-hidden="true"><Check /></span>
        <span>Saya setuju Gandiva Labs menghubungi saya terkait kebutuhan yang dikirimkan. Baca <RouterLink to="/privasi" class="font-bold text-text-primary underline decoration-border-default underline-offset-2">privasi data</RouterLink>.</span>
      </label>
      <span v-if="errors.consent" id="consultation-consent-error" class="field-error mt-2 block">{{ errors.consent }}</span>
    </div>

    <div
      v-if="turnstileSiteKey"
      ref="securityCheckRef"
      class="security-check"
      :class="errors.turnstile ? 'security-check-error' : ''"
      tabindex="-1"
      :aria-invalid="Boolean(errors.turnstile)"
      :aria-describedby="errors.turnstile ? 'consultation-turnstile-error' : undefined"
    >
      <TurnstileWidget
        ref="turnstileWidget"
        :site-key="turnstileSiteKey"
        @token="handleTurnstileToken"
        @error="handleTurnstileError"
      />
      <span v-if="errors.turnstile" id="consultation-turnstile-error" class="field-error mt-2 block" role="alert">{{ errors.turnstile }}</span>
    </div>

    <div v-if="submitError" class="form-alert" role="alert">
      {{ submitError }}
    </div>

    <button type="submit" class="submit-button group" :disabled="isSubmitting" :aria-busy="isSubmitting">
      <LoaderCircle v-if="isSubmitting" class="h-4 w-4 animate-spin" />
      <span>{{ isSubmitting ? 'Mengirim brief...' : 'Kirim brief untuk direview' }}</span>
      <ArrowRight v-if="!isSubmitting" class="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </button>

    <p class="mt-4 flex items-center justify-center gap-2 text-center text-[11px] leading-relaxed text-text-tertiary">
      <LockKeyhole class="h-3.5 w-3.5 shrink-0" />
      Data dikirim melalui koneksi terenkripsi dan tidak digunakan untuk newsletter.
    </p>
  </form>
</template>

<style scoped>
.consultation-form {
  width: 100%;
}

.form-field {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.5rem;
}

.form-field label {
  color: var(--text-primary);
  font-size: 0.78rem;
  font-weight: 700;
}

.form-field label > span[aria-hidden="true"] {
  color: var(--accent);
}

.form-field input,
.form-field select,
.form-field textarea {
  width: 100%;
  border: 1px solid var(--border-default);
  border-radius: 0.9rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  font: inherit;
  font-size: 0.9rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.35s ease;
}

.form-field input,
.form-field select {
  min-height: 3.25rem;
  padding: 0.75rem 0.95rem;
}

.form-field textarea {
  min-height: 8.5rem;
  resize: vertical;
  padding: 0.9rem 0.95rem;
  line-height: 1.55;
}

.form-field input::placeholder,
.form-field textarea::placeholder {
  color: var(--text-tertiary);
  opacity: 0.75;
}

.form-field input:focus,
.form-field select:focus,
.form-field textarea:focus {
  border-color: var(--accent);
  outline: none;
  box-shadow: 0 0 0 3px var(--accent-subtle);
}

.form-field [aria-invalid="true"] {
  border-color: var(--accent);
}

.field-error {
  color: var(--accent);
  font-size: 0.7rem;
  font-weight: 600;
  line-height: 1.45;
}

.field-hint {
  color: var(--text-tertiary);
  font-size: 0.7rem;
  line-height: 1.45;
}

.honeypot {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.consent-row {
  display: grid;
  cursor: pointer;
  align-items: flex-start;
  grid-template-columns: auto 1fr;
  gap: 0.7rem;
  color: var(--text-secondary);
  font-size: 0.78rem;
  line-height: 1.55;
}

.consent-row input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.consent-box {
  display: inline-flex;
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 0.05rem;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-default);
  border-radius: 0.38rem;
  background: var(--bg-primary);
  color: transparent;
  transition: all 0.2s ease;
}

.consent-box svg {
  width: 0.8rem;
  height: 0.8rem;
  stroke-width: 3;
}

.consent-row input:focus-visible + .consent-box {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

.consent-row input:checked + .consent-box {
  border-color: var(--accent);
  background: var(--accent);
  color: #fff;
}

.consent-row-error .consent-box {
  border-color: var(--accent);
}

.form-alert {
  margin-top: 1rem;
  padding: 0.8rem 0.9rem;
  border: 1px solid color-mix(in srgb, var(--accent) 42%, transparent);
  border-radius: 0.8rem;
  background: var(--accent-subtle);
  color: var(--text-primary);
  font-size: 0.78rem;
  line-height: 1.5;
}

.security-check {
  margin-top: 1rem;
  padding: 0.8rem;
  border: 1px solid var(--border-default);
  border-radius: 0.9rem;
  background: color-mix(in srgb, var(--bg-primary) 74%, transparent);
  transition: border-color 0.2s ease, background-color 0.35s ease;
}

.security-check-error {
  border-color: var(--accent);
}

.submit-button {
  display: flex;
  width: 100%;
  min-height: 3.5rem;
  margin-top: 1.35rem;
  padding: 0.8rem 1.4rem;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  border: 0;
  border-radius: 999px;
  background: var(--text-primary);
  color: var(--bg-primary);
  font-size: 0.875rem;
  font-weight: 700;
  transition: transform 0.3s ease, opacity 0.2s ease;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
}

.submit-button:disabled {
  cursor: wait;
  opacity: 0.68;
}
</style>
