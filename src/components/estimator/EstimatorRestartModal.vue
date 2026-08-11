<script setup>
import { AlertCircle, X } from '@lucide/vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['confirm', 'cancel']);
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="restart-dialog-title"
    >
      <div class="relative w-full max-w-sm p-6 rounded-[1.5rem] bg-bg-card border border-border-default shadow-xl space-y-4">
        <button
          type="button"
          @click="emit('cancel')"
          class="absolute top-4 right-4 p-1.5 text-text-tertiary hover:text-text-primary rounded-full hover:bg-bg-secondary transition-colors"
          aria-label="Tutup dialog"
        >
          <X class="h-4 w-4" />
        </button>

        <div class="flex items-start gap-3">
          <div class="h-9 w-9 rounded-xl bg-accent-subtle text-accent flex items-center justify-center shrink-0">
            <AlertCircle class="h-4 w-4" />
          </div>
          <div>
            <h3 id="restart-dialog-title" class="text-sm font-bold text-text-primary">
              Mulai Ulang Estimasi?
            </h3>
            <p class="text-xs text-text-secondary mt-1">
              Seluruh opsi kebutuhan yang telah Anda tentukan akan direset dari awal.
            </p>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            @click="emit('cancel')"
            class="px-4 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
          >
            Batal
          </button>

          <button
            type="button"
            @click="emit('confirm')"
            class="px-4 py-2 rounded-xl text-xs font-bold text-neutral-950 bg-accent hover:opacity-90 transition-opacity"
          >
            Mulai Dari Awal
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
