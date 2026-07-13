<script setup>
defineProps({
  size: {
    type: Number,
    default: 44
  },
  variant: {
    type: String,
    default: 'auto',
    validator: (value) => ['auto', 'light', 'dark'].includes(value)
  }
});
</script>

<template>
  <span
    class="logo-mark"
    :data-variant="variant"
    :style="{ width: `${size}px`, height: `${size}px` }"
    role="img"
    aria-label="Logo Gandiva Labs"
  >
    <img src="/gandiva-mark-dark.webp" alt="" width="320" height="246" class="mark-image mark-dark" />
    <img src="/gandiva-mark-light.webp" alt="" width="320" height="246" class="mark-image mark-light" />
  </span>
</template>

<style scoped>
.logo-mark {
  position: relative;
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s ease;
}

.logo-mark:hover {
  transform: rotate(-2deg) scale(1.04);
}

.mark-image {
  position: absolute;
  width: 95%;
  height: auto;
  object-fit: contain;
}

.mark-light {
  display: none;
}

:global([data-theme="dark"]) .logo-mark[data-variant="auto"] .mark-dark,
.logo-mark[data-variant="light"] .mark-dark {
  display: none;
}

:global([data-theme="dark"]) .logo-mark[data-variant="auto"] .mark-light,
.logo-mark[data-variant="light"] .mark-light {
  display: block;
}

.logo-mark[data-variant="dark"] .mark-dark {
  display: block;
}

.logo-mark[data-variant="dark"] .mark-light {
  display: none;
}
</style>
