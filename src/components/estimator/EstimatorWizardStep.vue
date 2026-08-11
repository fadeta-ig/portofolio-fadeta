<script setup>
import {
  Building2,
  Sparkles,
  ShoppingBag,
  Code2,
  HelpCircle,
  ShieldCheck,
  Target,
  Zap,
  Check,
  ChevronRight
} from '@lucide/vue';

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  selectedValue: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  stepIndex: {
    type: Number,
    default: 1
  },
  totalSteps: {
    type: Number,
    default: 3
  }
});

const emit = defineEmits(['select']);

const iconMap = {
  Building2,
  Sparkles,
  ShoppingBag,
  Code2,
  HelpCircle,
  ShieldCheck,
  Target,
  Zap
};

function getIconComponent(iconName) {
  return iconMap[iconName] || Target;
}

function handleSelect(item) {
  emit('select', item.id);
}
</script>

<template>
  <div class="space-y-5">
    <!-- Step Header -->
    <div class="space-y-1.5">
      <div class="flex items-center justify-between text-xs">
        <p class="section-kicker">
          Langkah 0{{ stepIndex }} dari 0{{ totalSteps }}
        </p>
        <span class="font-mono text-text-tertiary text-[11px]">
          {{ Math.round((stepIndex / totalSteps) * 100) }}% Selesai
        </span>
      </div>

      <h2 class="text-xl font-bold tracking-tight text-text-primary md:text-2xl">
        {{ title }}
      </h2>
      <p v-if="subtitle" class="text-xs leading-relaxed text-text-secondary md:text-sm">
        {{ subtitle }}
      </p>
    </div>

    <!-- Options Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <button
        v-for="item in items"
        :key="item.id"
        type="button"
        @click="handleSelect(item)"
        :aria-selected="selectedValue === item.id"
        role="option"
        :class="[
          'group relative text-left p-4 md:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-accent/40',
          selectedValue === item.id
            ? 'card-surface border-accent shadow-sm ring-1 ring-accent/40'
            : 'bg-bg-card/80 hover:bg-bg-card border-border-default hover:border-border-default'
        ]"
      >
        <div class="space-y-2.5">
          <div class="flex items-center justify-between">
            <span
              :class="[
                'liquid-icon flex h-9 w-9 items-center justify-center rounded-xl transition-colors',
                selectedValue === item.id ? 'bg-accent text-[#f5f0e7]' : 'text-accent'
              ]"
            >
              <component :is="getIconComponent(item.icon)" class="h-4.5 w-4.5 stroke-[1.8]" />
            </span>

            <div
              v-if="selectedValue === item.id"
              class="h-5 w-5 rounded-full bg-accent text-[#f5f0e7] flex items-center justify-center"
            >
              <Check class="h-3 w-3 stroke-[3]" />
            </div>
            <div
              v-else
              class="h-5 w-5 rounded-full border border-border-default group-hover:border-text-tertiary flex items-center justify-center transition-colors"
            >
              <ChevronRight class="h-3 w-3 text-text-tertiary group-hover:text-text-secondary" />
            </div>
          </div>

          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-bold text-text-primary group-hover:text-accent transition-colors">
                {{ item.title }}
              </h3>
              <span v-if="item.pages" class="text-[10px] px-2 py-0.5 rounded bg-bg-secondary text-accent font-mono font-semibold">
                {{ item.pages }}
              </span>
            </div>
            <p class="mt-1 text-xs leading-relaxed text-text-secondary">
              {{ item.shortDesc || item.description }}
            </p>
          </div>
        </div>
      </button>
    </div>
  </div>
</template>
