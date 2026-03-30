<script setup>
const props = defineProps({
  title: {
    type: String,
    required: false,
    default: ''
  },
  variant: {
    type: String,
    default: 'default', // 'default' | 'highlight'
    validator: (val) => ['default', 'highlight'].includes(val)
  }
});
</script>

<template>
  <div 
    class="glass-panel rounded-2xl p-6 md:p-8 transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 hover:bg-glass-200 border"
    :class="[
      variant === 'highlight' ? 'border-accent-icy/30 shadow-[0_0_20px_rgba(160,240,255,0.1)]' : 'border-glass-border'
    ]"
  >
    <h3 v-if="title" class="text-xl font-medium tracking-tight text-white mb-4 flex items-center gap-3">
      <slot name="icon"></slot>
      {{ title }}
    </h3>
    <div class="text-gray-400 font-light leading-relaxed">
      <slot></slot>
    </div>
  </div>
</template>
