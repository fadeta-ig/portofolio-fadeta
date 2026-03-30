<script setup>
import { ref } from 'vue';
import { useMagneticHover } from '../composables/useMagneticHover';
import { Github, Linkedin, Mail, ArrowRight, Download, MessageCircle } from 'lucide-vue-next';
import { certPdf } from '../data/assets';

const btnRef = ref(null);
const email = 'fadeta287@gmail.com';
const whatsapp = '6281553821808';

useMagneticHover(btnRef);
</script>

<template>
  <section id="contact" class="min-h-screen relative z-10 flex flex-col justify-between pt-24 pb-8 border-t border-glass-border">
    
    <div class="flex-grow flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto w-full">
      <h2 class="text-xs uppercase tracking-[0.3em] text-accent-icy mb-8 opacity-80">Kontak</h2>
      
      <h3 class="text-4xl md:text-7xl font-light text-white mb-12 tracking-tight">
        Siap untuk <span class="text-gradient font-medium italic">berkolaborasi</span>?
      </h3>
      
      <p class="text-xl md:text-2xl font-light text-gray-400 leading-relaxed mb-16 max-w-2xl">
        Baik untuk merancang infrastruktur jaringan maupun membangun aplikasi web, saya siap membantu mewujudkan kebutuhan Anda.
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
        <a 
          :href="'mailto:' + email"
          ref="btnRef"
          class="group relative inline-flex items-center gap-4 px-8 py-5 rounded-full bg-white text-obsidian font-medium text-lg overflow-hidden transition-transform duration-300"
        >
          <span class="relative z-10">Kirim Pesan</span>
          <ArrowRight class="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
        </a>

        <a 
          :href="certPdf" 
          target="_blank"
          class="group relative inline-flex items-center gap-3 px-8 py-5 rounded-full bg-transparent border border-white/20 text-white font-medium text-lg hover:border-accent-icy hover:text-accent-icy transition-colors duration-300"
        >
          <span>Unduh CV</span>
          <Download class="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-24 px-6 md:px-12 w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 border-t border-glass-border pt-8">
      
      <div class="text-sm font-light text-gray-500">
        &copy; {{ new Date().getFullYear() }} Fadeta Ilhan Gandhi. Semua hak dilindungi.
      </div>

      <div class="flex items-center gap-8">
        <a href="https://github.com/fadeta-ig" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white transition-colors p-2 glass-panel rounded-full hover:bg-white/10" aria-label="GitHub">
          <Github class="w-5 h-5" />
        </a>
        <a href="https://linkedin.com/in/fadetaig" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white transition-colors p-2 glass-panel rounded-full hover:bg-white/10" aria-label="LinkedIn">
          <Linkedin class="w-5 h-5" />
        </a>
        <a :href="'https://wa.me/' + whatsapp" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white transition-colors p-2 glass-panel rounded-full hover:bg-white/10" aria-label="WhatsApp">
          <MessageCircle class="w-5 h-5" />
        </a>
        <a :href="'mailto:' + email" class="text-gray-400 hover:text-white transition-colors p-2 glass-panel rounded-full hover:bg-white/10" aria-label="Email">
          <Mail class="w-5 h-5" />
        </a>
      </div>
      
    </div>
  </section>
</template>
