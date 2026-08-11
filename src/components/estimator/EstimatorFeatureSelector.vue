<script setup>
import {
  Check,
  CheckCircle2,
  Gift,
  Globe,
  FileText,
  MessageSquare,
  Sparkles,
  ShieldCheck
} from '@lucide/vue';
import { PAID_ADDONS, STANDARD_INCLUSIONS } from '../../data/estimator';

const props = defineProps({
  selectedAddons: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['toggle-addon']);

const addonIconMap = {
  Globe,
  FileText,
  MessageSquare,
  Gift
};

function getAddonIcon(iconName) {
  return addonIconMap[iconName] || Sparkles;
}

function isSelected(addonId) {
  return props.selectedAddons.includes(addonId);
}

function toggle(addonId) {
  emit('toggle-addon', addonId);
}
</script>

<template>
  <div class="space-y-6">
    <!-- Paid Add-Ons Section -->
    <div class="space-y-3">
      <div>
        <h3 class="text-sm font-bold text-text-primary flex items-center gap-2">
          <Sparkles class="h-4 w-4 text-accent" />
          Fitur Add-On Opsional
        </h3>
        <p class="text-xs text-text-secondary mt-0.5">
          Pilih fitur khusus sesuai kebutuhan. Estimasi harga akan diperbarui secara otomatis.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          v-for="addon in PAID_ADDONS"
          :key="addon.id"
          type="button"
          @click="toggle(addon.id)"
          :aria-checked="isSelected(addon.id)"
          role="checkbox"
          :class="[
            'p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-accent/40',
            isSelected(addon.id)
              ? 'card-surface border-accent ring-1 ring-accent/30'
              : 'bg-bg-card/70 hover:bg-bg-card border-border-default hover:border-border-default'
          ]"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <span
                :class="[
                  'liquid-icon flex h-8 w-8 items-center justify-center rounded-lg shrink-0',
                  isSelected(addon.id) ? 'bg-accent text-[#f5f0e7]' : 'text-accent'
                ]"
              >
                <component :is="getAddonIcon(addon.icon)" class="h-4 w-4" />
              </span>
              <div>
                <h4 class="text-xs font-bold text-text-primary leading-tight">
                  {{ addon.title }}
                </h4>
                <span class="inline-block mt-0.5 text-[11px] font-mono font-semibold text-accent">
                  {{ addon.priceFormatted }}
                </span>
              </div>
            </div>

            <div
              :class="[
                'h-4.5 w-4.5 rounded border flex items-center justify-center shrink-0 transition-colors',
                isSelected(addon.id) ? 'bg-accent border-accent text-[#f5f0e7]' : 'border-border-default bg-bg-secondary'
              ]"
            >
              <Check v-if="isSelected(addon.id)" class="h-3 w-3 stroke-[3]" />
            </div>
          </div>

          <p class="mt-2 text-[11px] text-text-secondary leading-relaxed">
            {{ addon.description }}
          </p>
        </button>
      </div>
    </div>

    <!-- Standard Inclusions Section (Included FREE) -->
    <div class="p-5 rounded-2xl bg-bg-secondary/50 border border-border-default space-y-3">
      <div class="border-b border-border-default pb-3">
        <h4 class="text-xs font-bold text-text-primary flex items-center gap-2 uppercase tracking-wider font-mono">
          <ShieldCheck class="h-4 w-4 text-accent" />
          Fitur Standar Terdaftar (Gratis)
        </h4>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
        <div
          v-for="inclusion in STANDARD_INCLUSIONS"
          :key="inclusion.id"
          :class="[
            'p-2.5 rounded-xl flex items-center justify-between text-xs',
            inclusion.highlight ? 'bg-accent-subtle/40 border border-accent/30 text-text-primary' : 'bg-bg-card text-text-secondary border border-border-default'
          ]"
        >
          <div class="flex items-center gap-2">
            <CheckCircle2 class="h-3.5 w-3.5 text-accent shrink-0" />
            <span class="font-medium text-[11px]">{{ inclusion.label }}</span>
          </div>
          <span
            :class="[
              'px-1.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-wide shrink-0',
              inclusion.highlight ? 'bg-accent text-[#f5f0e7]' : 'bg-bg-secondary text-text-tertiary'
            ]"
          >
            {{ inclusion.badge }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
