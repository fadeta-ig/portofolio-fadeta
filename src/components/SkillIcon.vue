<script setup>
/**
 * Reusable icon renderer for skill items.
 * Handles both Lucide (component) and Simple Icons (SVG path) types.
 */
defineProps({
  config: {
    type: Object,
    required: true,
    validator: (val) => ['lucide', 'simple'].includes(val.type)
  },
  size: {
    type: String,
    default: 'w-5 h-5'
  }
});
</script>

<template>
  <component
    v-if="config.type === 'lucide'"
    :is="config.icon"
    :class="size"
    stroke-width="1.5"
  />
  <svg
    v-else-if="config.type === 'simple'"
    viewBox="0 0 24 24"
    fill="currentColor"
    :class="size"
  >
    <path :d="config.path" />
  </svg>
</template>
