<script setup>
import { Download } from 'lucide-vue-next';
import LogoMark from './LogoMark.vue';
import { certPdf } from '../data/assets';

// Smooth scroll function for Anchor links
const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<template>
  <nav class="fixed top-0 left-0 w-full z-50 glass-panel border-b border-glass-border">
    <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <a href="#" @click.prevent="scrollTo('hero')" class="focus:outline-none" aria-label="Home">
        <LogoMark :size="38" />
      </a>
      
      <div class="hidden md:flex space-x-8">
        <a href="#about" @click.prevent="scrollTo('about')" class="text-sm font-medium text-gray-300 hover:text-white transition-colors">Tentang</a>
        <a href="#education" @click.prevent="scrollTo('education')" class="text-sm font-medium text-gray-300 hover:text-white transition-colors">Pendidikan</a>
        <a href="#expertise" @click.prevent="scrollTo('expertise')" class="text-sm font-medium text-gray-300 hover:text-white transition-colors">Keahlian</a>
        <a href="#case-studies" @click.prevent="scrollTo('case-studies')" class="text-sm font-medium text-gray-300 hover:text-white transition-colors">Proyek</a>
        <a href="#certifications" @click.prevent="scrollTo('certifications')" class="text-sm font-medium text-gray-300 hover:text-white transition-colors">Sertifikasi</a>
      </div>
      
      <div class="flex items-center space-x-4">
        <a :href="certPdf" target="_blank" class="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
          <Download class="w-4 h-4" />
          <span>Resume</span>
        </a>
        <a href="#contact" @click.prevent="scrollTo('contact')" class="px-5 py-2.5 text-sm font-medium bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/10 hover:border-white/30">
          Hubungi Saya
        </a>
      </div>
    </div>
  </nav>
</template>
