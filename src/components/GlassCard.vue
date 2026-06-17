<script setup>
const props = defineProps({
  title: {
    type: String,
    required: false,
    default: ''
  },
  variant: {
    type: String,
    default: 'default',
    validator: (val) => ['default', 'highlight'].includes(val)
  }
});
</script>

<template>
  <div
    class="card p-6 md:p-8 transition-all duration-300 transform hover:scale-[1.01] hover:-translate-y-1"
    :class="[
      variant === 'highlight'
        ? 'border-accent/25 shadow-[0_0_16px_var(--accent-subtle)]'
        : ''
    ]"
  >
    <h3 v-if="title" class="text-lg font-medium tracking-tight text-text-primary mb-4 flex items-center gap-3">
      <slot name="icon"></slot>
      {{ title }}
    </h3>
    <div class="text-text-secondary font-normal leading-relaxed">
      <slot></slot>
    </div>
  </div>
</template>
