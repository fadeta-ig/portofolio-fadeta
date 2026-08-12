import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@lucide/vue') || id.includes('simple-icons')) {
              return 'icons';
            }
            if (id.includes('vue') || id.includes('vue-router') || id.includes('@unhead')) {
              return 'vendor-vue';
            }
            if (id.includes('gsap')) {
              return 'vendor-gsap';
            }
          }
        }
      }
    }
  }
})
