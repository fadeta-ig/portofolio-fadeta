import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    include: ['tests/components/**/*.spec.js'],
    setupFiles: ['./tests/components/setup.js'],
    restoreMocks: true,
    clearMocks: true
  }
});
