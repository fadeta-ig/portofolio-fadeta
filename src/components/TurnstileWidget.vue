<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps({
  siteKey: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['token', 'error']);
const container = ref(null);
const status = ref('Memuat verifikasi keamanan…');
let widgetId;
let isUnmounted = false;
let scriptPromise;

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-gandiva-turnstile]');
    const script = existing ?? document.createElement('script');

    const handleLoad = () => window.turnstile ? resolve(window.turnstile) : reject(new Error('Turnstile API tidak tersedia.'));
    const handleError = () => reject(new Error('Turnstile gagal dimuat.'));

    script.addEventListener('load', handleLoad, { once: true });
    script.addEventListener('error', handleError, { once: true });

    if (!existing) {
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.dataset.gandivaTurnstile = '';
      document.head.appendChild(script);
    }
  });

  return scriptPromise;
}

async function renderWidget() {
  try {
    const turnstile = await loadTurnstile();
    if (isUnmounted || !container.value) return;

    widgetId = turnstile.render(container.value, {
      sitekey: props.siteKey,
      theme: 'auto',
      language: 'id',
      size: 'flexible',
      appearance: 'interaction-only',
      action: 'contact_form',
      callback(token) {
        status.value = '';
        emit('token', token);
      },
      'expired-callback'() {
        status.value = 'Verifikasi kedaluwarsa. Silakan ulangi.';
        emit('token', '');
      },
      'timeout-callback'() {
        status.value = 'Verifikasi memerlukan percobaan ulang.';
        emit('token', '');
      },
      'error-callback'() {
        status.value = 'Verifikasi keamanan gagal dimuat.';
        emit('token', '');
        emit('error');
      }
    });
  } catch {
    status.value = 'Verifikasi keamanan gagal dimuat.';
    emit('error');
  }
}

function reset() {
  if (widgetId !== undefined && window.turnstile) {
    window.turnstile.reset(widgetId);
    status.value = '';
    emit('token', '');
  }
}

defineExpose({ reset });

onMounted(renderWidget);

onBeforeUnmount(() => {
  isUnmounted = true;
  if (widgetId !== undefined && window.turnstile) window.turnstile.remove(widgetId);
});
</script>

<template>
  <div class="turnstile-shell">
    <div ref="container" class="turnstile-container" />
    <p v-if="status" class="turnstile-status" aria-live="polite">{{ status }}</p>
  </div>
</template>

<style scoped>
.turnstile-shell {
  min-width: 0;
}

.turnstile-container {
  width: 100%;
  min-height: 1px;
}

.turnstile-status {
  margin: 0.45rem 0 0;
  color: var(--text-tertiary);
  font-size: 0.7rem;
  line-height: 1.45;
}
</style>
