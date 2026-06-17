<script setup>
import { ref } from 'vue';
import { useMagneticHover } from '../composables/useMagneticHover';
import { Github, Linkedin, Mail, ArrowRight, Download, MessageCircle } from 'lucide-vue-next';
import { cvPdf } from '../data/assets';

const btnRef = ref(null);
const email = 'fadeta287@gmail.com';
const whatsapp = '6281553821808';

useMagneticHover(btnRef);
</script>

<template>
  <section id="contact" class="min-h-screen relative z-10 flex flex-col justify-between pt-24 pb-8 border-t border-border-default">

    <div class="flex-grow flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto w-full">
      <h2 class="section-label mb-8">Kontak</h2>

      <h3 class="text-4xl md:text-7xl font-light text-text-primary mb-12 tracking-tight section-heading">
        Siap untuk <span class="text-gradient font-medium font-display italic">berkolaborasi</span>?
      </h3>

      <p class="text-xl md:text-2xl font-normal text-text-secondary leading-relaxed mb-16 max-w-2xl">
        Baik untuk merancang infrastruktur jaringan maupun membangun aplikasi web, saya siap membantu mewujudkan kebutuhan Anda.
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
        <!-- Primary CTA -->
        <a
          :href="'https://wa.me/' + whatsapp"
          target="_blank"
          rel="noopener noreferrer"
          ref="btnRef"
          class="group relative inline-flex items-center gap-4 px-8 py-4 rounded-full bg-accent text-white font-medium text-lg overflow-hidden transition-all duration-300 hover:bg-accent-hover hover:shadow-lg"
        >
          <span class="relative z-10">Kirim Pesan via WhatsApp</span>
          <ArrowRight class="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
        </a>

        <!-- Secondary CTA -->
        <a
          :href="cvPdf"
          target="_blank"
          class="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-transparent border border-border-default text-text-primary font-medium text-lg hover:border-accent hover:text-accent transition-all duration-300"
        >
          <span>Unduh CV</span>
          <Download class="w-5 h-5 group-hover:-translate-y-1 transition-transform duration-300" />
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-24 px-6 md:px-12 w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 border-t border-border-default pt-8">

      <div class="text-sm font-normal text-text-tertiary">
        &copy; {{ new Date().getFullYear() }} Fadeta Ilhan Gandhi. Semua hak dilindungi.
      </div>

      <div class="flex items-center gap-4">
        <a
          href="https://github.com/fadeta-ig"
          target="_blank"
          rel="noopener noreferrer"
          class="w-10 h-10 flex items-center justify-center rounded-full text-text-secondary hover:text-accent hover:bg-accent-subtle transition-all duration-300"
          aria-label="GitHub"
        >
          <Github class="w-5 h-5" />
        </a>
        <a
          href="https://linkedin.com/in/fadetaig"
          target="_blank"
          rel="noopener noreferrer"
          class="w-10 h-10 flex items-center justify-center rounded-full text-text-secondary hover:text-accent hover:bg-accent-subtle transition-all duration-300"
          aria-label="LinkedIn"
        >
          <Linkedin class="w-5 h-5" />
        </a>
        <a
          :href="'https://wa.me/' + whatsapp"
          target="_blank"
          rel="noopener noreferrer"
          class="w-10 h-10 flex items-center justify-center rounded-full text-text-secondary hover:text-accent hover:bg-accent-subtle transition-all duration-300"
          aria-label="WhatsApp"
        >
          <MessageCircle class="w-5 h-5" />
        </a>
        <a
          :href="'mailto:' + email"
          class="w-10 h-10 flex items-center justify-center rounded-full text-text-secondary hover:text-accent hover:bg-accent-subtle transition-all duration-300"
          aria-label="Email"
        >
          <Mail class="w-5 h-5" />
        </a>
      </div>

    </div>
  </section>
</template>
