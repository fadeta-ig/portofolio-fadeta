<script setup>
/**
 * Premium "F" monogram logo with copper accent.
 * Theme-adaptive — uses CSS variable colors via currentColor and explicit vars.
 */
defineProps({
  size: {
    type: Number,
    default: 36
  }
});
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="logo-mark"
    aria-label="Fadeta Logo"
  >
    <defs>
      <linearGradient id="logoBg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" :stop-color="'var(--accent)'" stop-opacity="0.12" />
        <stop offset="100%" :stop-color="'var(--accent)'" stop-opacity="0.04" />
      </linearGradient>

      <linearGradient id="logoLetterGrad" x1="12" y1="8" x2="28" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" :stop-color="'var(--text-primary)'" />
        <stop offset="100%" :stop-color="'var(--accent)'" />
      </linearGradient>

      <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <!-- Rounded square background -->
    <rect
      x="0.5" y="0.5" width="39" height="39" rx="10"
      fill="url(#logoBg)"
      class="logo-bg"
      stroke="var(--accent)"
      stroke-opacity="0.2"
      stroke-width="1"
    />

    <!-- Stylized "F" letterform -->
    <g filter="url(#logoGlow)">
      <rect x="12" y="9" width="17" height="3" rx="1.5" fill="url(#logoLetterGrad)" />
      <rect x="12" y="9" width="3.5" height="22" rx="1.5" fill="url(#logoLetterGrad)" />
      <rect x="12" y="18.5" width="12" height="3" rx="1.5" fill="var(--accent)" opacity="0.85" />
    </g>

    <!-- Accent dot -->
    <circle cx="32" cy="28" r="2" fill="var(--accent)" opacity="0.35" class="logo-dot" />
  </svg>
</template>

<style scoped>
.logo-mark {
  transition: transform 0.3s ease;
}

.logo-mark:hover {
  transform: scale(1.08);
}

.logo-mark:hover .logo-dot {
  opacity: 0.7;
}
</style>
