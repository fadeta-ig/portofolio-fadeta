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
const hasError = ref(false);
const isLoading = ref(false);
let widgetId;
let isUnmounted = false;
let scriptPromise;
const LOAD_TIMEOUT_MS = 12_000;
// Client mirror of TURNSTILE_ACTION in server/contact-security.js
// (no server→client import); both strings must stay identical.
const TURNSTILE_ACTION = 'turnstile-spin-v2';

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    let existing = document.querySelector('script[data-gandiva-turnstile]');
    if (existing?.dataset.gandivaTurnstileFailed) {
      existing.remove();
      existing = null;
    }
    const script = existing ?? document.createElement('script');
    const isOwnScript = !existing;

    const cleanup = () => {
      clearTimeout(timer);
      script.removeEventListener('load', handleLoad);
      script.removeEventListener('error', handleError);
    };
    const fail = (message) => {
      cleanup();
      if (isOwnScript) {
        script.dataset.gandivaTurnstileFailed = 'true';
        script.remove();
      }
      reject(new Error(message));
    };
    const handleLoad = () => {
      cleanup();
      if (window.turnstile) resolve(window.turnstile);
      else fail('Turnstile API tidak tersedia.');
    };
    const handleError = () => fail('Turnstile gagal dimuat.');
    const timer = setTimeout(() => fail('Turnstile timeout.'), LOAD_TIMEOUT_MS);

    script.addEventListener('load', handleLoad, { once: true });
    script.addEventListener('error', handleError, { once: true });

    if (isOwnScript) {
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.dataset.gandivaTurnstile = '';
      document.head.appendChild(script);
    }
  });

  // Allow retry: a rejected load must not poison the cache forever.
  scriptPromise.catch(() => {
    scriptPromise = undefined;
  });

  return scriptPromise;
}

async function renderWidget() {
  isLoading.value = true;
  try {
    const turnstile = await loadTurnstile();
    if (isUnmounted || !container.value) return;

    widgetId = turnstile.render(container.value, {
      sitekey: props.siteKey,
      theme: 'auto',
      language: 'id',
      size: 'flexible',
      appearance: 'interaction-only',
      action: TURNSTILE_ACTION,
      callback(token) {
        status.value = '';
        hasError.value = false;
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
        hasError.value = true;
        emit('token', '');
        emit('error');
      }
    });
  } catch {
    status.value = 'Verifikasi keamanan gagal dimuat.';
    hasError.value = true;
    emit('error');
  } finally {
    isLoading.value = false;
  }
}

function reset() {
  if (widgetId !== undefined && window.turnstile) {
    window.turnstile.reset(widgetId);
    status.value = '';
    hasError.value = false;
    emit('token', '');
  }
}

async function retry() {
  if (isLoading.value) return;
  scriptPromise = undefined;
  widgetId = undefined;
  hasError.value = false;
  status.value = 'Memuat verifikasi keamanan…';
  await renderWidget();
}

defineExpose({ reset, retry });

onMounted(renderWidget);

onBeforeUnmount(() => {
  isUnmounted = true;
  if (widgetId !== undefined && window.turnstile) window.turnstile.remove(widgetId);
});
</script>

<template>
  <div class="turnstile-shell">
    <div
      ref="container"
      class="cf-turnstile turnstile-container"
      :data-sitekey="siteKey"
      :data-action="TURNSTILE_ACTION"
    />
    <p v-if="status" class="turnstile-status" role="status" aria-live="polite">{{ status }}</p>
    <button
      v-if="hasError"
      type="button"
      class="turnstile-retry"
      :disabled="isLoading"
      @click="retry"
    >
      {{ isLoading ? 'Memuat ulang…' : 'Muat ulang verifikasi' }}
    </button>
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

.turnstile-retry {
  margin-top: 0.45rem;
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--glass-border);
  border-radius: 0.6rem;
  background: transparent;
  color: var(--text-primary);
  font: inherit;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
}

.turnstile-retry:disabled {
  cursor: wait;
  opacity: 0.6;
}
</style>
