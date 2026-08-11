<script setup>
import { computed, ref } from 'vue';
import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  CheckCircle2,
  Gift,
  RotateCcw,
  Sparkles,
  Sliders,
  ShieldCheck
} from '@lucide/vue';
import { useSeo } from '../composables/useSeo';
import {
  WEBSITE_TYPES,
  BUSINESS_GOALS,
  COMPLEXITY_LEVELS,
  DETAILED_QUESTIONS,
  calculateEstimate
} from '../data/estimator';
import { trackEvent } from '../lib/analytics';

import EstimatorWizardStep from '../components/estimator/EstimatorWizardStep.vue';
import EstimatorFeatureSelector from '../components/estimator/EstimatorFeatureSelector.vue';
import EstimatorResultCard from '../components/estimator/EstimatorResultCard.vue';
import EstimatorRestartModal from '../components/estimator/EstimatorRestartModal.vue';

// Initialize SEO metadata
useSeo();

// State management
const currentStage = ref('landing'); // 'landing' | 'wizard' | 'recommendation' | 'detailed' | 'result'
const wizardStep = ref(1); // 1: Type, 2: Goal, 3: Complexity

const selectedType = ref('company-profile');
const selectedGoal = ref('kredibilitas');
const selectedComplexity = ref('professional');
const selectedAddons = ref([]);
const detailedAnswers = ref({
  contentReadiness: 'partial',
  designPreference: 'brand',
  integrationNeed: 'no',
  timelineUrgency: 'flexible'
});

const isShowRestartModal = ref(false);

// Calculated Estimate Result
const estimateResult = computed(() => {
  return calculateEstimate({
    websiteType: selectedType.value,
    businessGoal: selectedGoal.value,
    complexity: selectedComplexity.value,
    selectedAddons: selectedAddons.value,
    detailedAnswers: detailedAnswers.value
  });
});

// Navigation handlers
function startEstimator() {
  currentStage.value = 'wizard';
  wizardStep.value = 1;
  trackEvent('estimator_start');
}

function handleTypeSelect(typeId) {
  selectedType.value = typeId;
  trackEvent('website_type_selected', { type: typeId });
  wizardStep.value = 2;
}

function handleGoalSelect(goalId) {
  selectedGoal.value = goalId;
  trackEvent('goal_selected', { goal: goalId });
  wizardStep.value = 3;
}

function handleComplexitySelect(complexityId) {
  selectedComplexity.value = complexityId;
  trackEvent('complexity_selected', { complexity: complexityId });
  currentStage.value = 'recommendation';
  trackEvent('recommendation_view', {
    type: selectedType.value,
    estimated_price: estimateResult.value.priceFormatted
  });
}

function prevStep() {
  if (currentStage.value === 'result') {
    currentStage.value = 'recommendation';
    return;
  }
  if (currentStage.value === 'detailed') {
    currentStage.value = 'recommendation';
    return;
  }
  if (currentStage.value === 'recommendation') {
    currentStage.value = 'wizard';
    wizardStep.value = 3;
    return;
  }
  if (currentStage.value === 'wizard') {
    if (wizardStep.value > 1) {
      wizardStep.value -= 1;
    } else {
      currentStage.value = 'landing';
    }
  }
}

function toggleAddon(addonId) {
  const index = selectedAddons.value.indexOf(addonId);
  if (index >= 0) {
    selectedAddons.value.splice(index, 1);
    trackEvent('feature_removed', { feature: addonId });
  } else {
    selectedAddons.value.push(addonId);
    trackEvent('feature_selected', { feature: addonId });
  }
}

function goToResult() {
  currentStage.value = 'result';
  trackEvent('estimate_view', {
    type: selectedType.value,
    estimated_price: estimateResult.value.priceFormatted,
    addons_count: selectedAddons.value.length
  });
}

function toggleDetailedMode() {
  if (currentStage.value === 'detailed') {
    currentStage.value = 'recommendation';
  } else {
    currentStage.value = 'detailed';
  }
}

function confirmRestart() {
  selectedType.value = 'company-profile';
  selectedGoal.value = 'kredibilitas';
  selectedComplexity.value = 'professional';
  selectedAddons.value = [];
  wizardStep.value = 1;
  currentStage.value = 'landing';
  isShowRestartModal.value = false;
  trackEvent('estimator_restart');
}
</script>

<template>
  <main id="main-content" tabindex="-1" class="flex-grow bg-bg-primary pt-28 pb-20 md:pt-36">
    <div class="section-shell max-w-5xl mx-auto space-y-6">
      
      <!-- Top Navigation & Restart Header -->
      <div class="flex items-center justify-between border-b border-border-default pb-4 text-xs">
        <div class="flex items-center gap-3">
          <button
            v-if="currentStage !== 'landing'"
            type="button"
            @click="prevStep"
            class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-semibold text-text-primary bg-bg-secondary hover:bg-bg-card border border-border-default transition-colors"
          >
            <ArrowLeft class="h-3.5 w-3.5" />
            <span>Kembali</span>
          </button>

          <p class="section-kicker">Smart Website Estimator</p>
        </div>

        <button
          v-if="currentStage !== 'landing'"
          type="button"
          @click="isShowRestartModal = true"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium text-text-tertiary hover:text-text-primary hover:bg-bg-secondary transition-colors"
        >
          <RotateCcw class="h-3.5 w-3.5" />
          <span class="hidden sm:inline">Mulai Ulang</span>
        </button>
      </div>

      <!-- STAGE 1: LANDING SCREEN -->
      <section v-if="currentStage === 'landing'" class="text-center py-8 md:py-14 space-y-8">
        <div class="space-y-4 max-w-3xl mx-auto">
          <p class="section-kicker mb-3">Estimasi Biaya Transparan</p>
          <h1 class="text-balance text-[clamp(2.5rem,5vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.04em] text-text-primary">
            Berapa estimasi <span class="font-display italic text-accent">investasi website Anda?</span>
          </h1>
          <p class="mx-auto max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">
            Pilih kebutuhan bisnis Anda dan dapatkan gambaran jenis website, fitur rekomendasi, serta estimasi investasinya dalam kurang dari 1 menit.
          </p>
        </div>

        <!-- Call to action button -->
        <div class="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            @click="startEstimator"
            class="w-full sm:w-auto inline-flex min-h-12 items-center justify-center gap-3 px-8 py-3.5 rounded-full text-sm font-bold text-[#f5f0e7] bg-accent hover:bg-accent-hover transition-colors shadow-sm"
          >
            <span>Mulai Hitung Estimasi</span>
            <ArrowRight class="h-4 w-4" />
          </button>
        </div>

        <!-- Trust Badges -->
        <div class="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-text-secondary max-w-xl mx-auto">
          <div class="card-surface p-3.5 flex items-center justify-center gap-2">
            <CheckCircle2 class="h-4 w-4 text-accent" />
            <span>Gratis • Tanpa Komitmen</span>
          </div>
          <div class="card-surface p-3.5 flex items-center justify-center gap-2">
            <CheckCircle2 class="h-4 w-4 text-accent" />
            <span>Hasil 30–60 Detik</span>
          </div>
          <div class="card-surface p-3.5 flex items-center justify-center gap-2">
            <CheckCircle2 class="h-4 w-4 text-accent" />
            <span>Tanpa Wajib Isi Form</span>
          </div>
        </div>
      </section>

      <!-- STAGE 2: QUICK ESTIMATE WIZARD (STEPS 1–3) -->
      <section v-else-if="currentStage === 'wizard'" class="py-2">
        <EstimatorWizardStep
          v-if="wizardStep === 1"
          :items="WEBSITE_TYPES"
          :selected-value="selectedType"
          title="Website seperti apa yang Anda butuhkan?"
          subtitle="Pilih kategori yang paling menggambarkan gambaran website bisnis Anda."
          :step-index="1"
          :total-steps="3"
          @select="handleTypeSelect"
        />

        <EstimatorWizardStep
          v-else-if="wizardStep === 2"
          :items="BUSINESS_GOALS"
          :selected-value="selectedGoal"
          title="Apa tujuan utama website Anda?"
          subtitle="Gandiva Labs akan menyesuaikan arsitektur fitur terbaik untuk mencapai tujuan ini."
          :step-index="2"
          :total-steps="3"
          @select="handleGoalSelect"
        />

        <EstimatorWizardStep
          v-else-if="wizardStep === 3"
          :items="COMPLEXITY_LEVELS"
          :selected-value="selectedComplexity"
          title="Seberapa lengkap website yang Anda bayangkan?"
          subtitle="Pilih estimasi kedalaman halaman dan kelengkapan konten website Anda."
          :step-index="3"
          :total-steps="3"
          @select="handleComplexitySelect"
        />
      </section>

      <!-- STAGE 3: SMART RECOMMENDATION & ADD-ONS SELECTOR (COMPACT TWO-COLUMN LAYOUT) -->
      <section v-else-if="currentStage === 'recommendation'" class="py-2">
        <div class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          
          <!-- Left Column: Add-on Picker & Rationale -->
          <div class="space-y-6">
            <div class="card-surface p-6 space-y-4">
              <div class="flex items-center justify-between text-xs">
                <p class="section-kicker">Rekomendasi Utama</p>
                <span class="font-mono text-text-tertiary">
                  {{ estimateResult.websiteType.title }}
                </span>
              </div>

              <div class="space-y-1">
                <h2 class="text-xl font-bold tracking-tight text-text-primary">
                  {{ estimateResult.websiteType.title }} — Tier <span class="font-display italic text-accent">{{ estimateResult.complexity.toUpperCase() }}</span>
                </h2>
                <p class="text-xs leading-relaxed text-text-secondary">
                  {{ estimateResult.rationale }}
                </p>
              </div>
            </div>

            <!-- Add-on Feature Picker -->
            <EstimatorFeatureSelector
              :selected-addons="selectedAddons"
              @toggle-addon="toggleAddon"
            />
          </div>

          <!-- Right Column: Sticky Summary Panel -->
          <div class="lg:sticky lg:top-28 space-y-4">
            <div class="card-surface p-6 space-y-5">
              <div class="border-b border-border-default pb-3">
                <p class="section-kicker mb-1">Ringkasan Estimasi</p>
                <h3 class="text-sm font-bold text-text-primary">Investasi & Pengerjaan</h3>
              </div>

              <div class="space-y-3">
                <div>
                  <span class="text-[10px] font-mono uppercase text-text-tertiary">Estimasi Investasi Awal</span>
                  <div class="text-3xl font-medium tracking-tight text-text-primary">
                    {{ estimateResult.priceFormatted }}
                  </div>
                </div>

                <div class="flex items-center justify-between text-xs border-t border-border-default pt-3">
                  <span class="text-text-tertiary">Waktu Pengerjaan:</span>
                  <span class="font-bold text-text-primary">{{ estimateResult.timelineText }}</span>
                </div>

                <div class="flex items-center justify-between text-xs border-t border-border-default pt-3">
                  <span class="text-text-tertiary">Fitur Add-On:</span>
                  <span class="font-mono font-semibold text-accent">{{ selectedAddons.length }} Terpilih</span>
                </div>
              </div>

              <div class="pt-2 space-y-2.5">
                <button
                  type="button"
                  @click="goToResult"
                  class="w-full inline-flex min-h-12 items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-[#f5f0e7] bg-accent hover:bg-accent-hover transition-colors shadow-sm"
                >
                  <span>Lihat Hasil Akhir Estimasi</span>
                  <ArrowRight class="h-4 w-4" />
                </button>

                <button
                  type="button"
                  @click="toggleDetailedMode"
                  class="w-full inline-flex items-center justify-center gap-2 text-xs text-text-secondary hover:text-text-primary transition-colors py-1.5"
                >
                  <Sliders class="h-3.5 w-3.5 text-accent" />
                  <span>Mode Detail Spesifik</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- STAGE 4: DETAILED MODE (OPTIONAL SPECIFIC QUESTIONS) -->
      <section v-else-if="currentStage === 'detailed'" class="py-2 space-y-6">
        <div class="space-y-1">
          <h2 class="text-xl font-bold text-text-primary">
            Detail Tambahan Kebutuhan Proyek
          </h2>
          <p class="text-xs text-text-secondary">
            Jawab pertanyaan di bawah ini untuk memperjelas alur pengerjaan.
          </p>
        </div>

        <div class="space-y-4">
          <div v-for="q in DETAILED_QUESTIONS" :key="q.id" class="card-surface p-5 space-y-3">
            <h3 class="text-xs font-bold text-text-primary">
              {{ q.title }}
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                v-for="opt in q.options"
                :key="opt.id"
                type="button"
                @click="detailedAnswers[q.id] = opt.id"
                :class="[
                  'p-3 rounded-xl border text-xs text-left transition-all',
                  detailedAnswers[q.id] === opt.id
                    ? 'bg-bg-secondary border-accent text-text-primary font-semibold ring-1 ring-accent/20'
                    : 'bg-bg-secondary/40 border-border-default text-text-secondary hover:border-border-default'
                ]"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>
        </div>

        <div class="pt-2 flex items-center justify-between">
          <button
            type="button"
            @click="currentStage = 'recommendation'"
            class="text-xs text-text-secondary hover:text-text-primary"
          >
            Selesai Detail
          </button>

          <button
            type="button"
            @click="goToResult"
            class="px-6 py-3 rounded-full text-xs font-bold text-[#f5f0e7] bg-accent hover:bg-accent-hover"
          >
            Lihat Hasil Akhir →
          </button>
        </div>
      </section>

      <!-- STAGE 5: RESULT SCREEN & CONVERSION -->
      <section v-else-if="currentStage === 'result'" class="py-2">
        <EstimatorResultCard
          :result="estimateResult"
          @restart="isShowRestartModal = true"
        />
      </section>

    </div>

    <!-- Restart Modal Confirmation -->
    <EstimatorRestartModal
      :is-open="isShowRestartModal"
      @confirm="confirmRestart"
      @cancel="isShowRestartModal = false"
    />
  </main>
</template>
