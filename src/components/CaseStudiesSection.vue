<script setup>
import { ref, onMounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-vue-next';
import { projects } from '../data/projects';
import { useGsapScrollReveal } from '../composables/useGsapScrollReveal';

gsap.registerPlugin(ScrollTrigger);

const sectionRef = ref(null);
const headerRef = ref(null);
const projectsRef = ref([]);

useGsapScrollReveal(headerRef, {
  y: 30,
  duration: 1,
  triggerStart: 'top 80%'
});

onMounted(() => {
  projectsRef.value.forEach((el, index) => {
    if (!el) return;
    
    // Elements to animate
    const imageContainer = el.querySelector('.project-image-container');
    const image = el.querySelector('.project-image');
    const content = el.querySelector('.project-content');
    const number = el.querySelector('.project-number');
    const details = el.querySelectorAll('.anim-detail');
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      }
    });
    
    // Clip path reveal for image container
    tl.fromTo(imageContainer,
      { clipPath: 'inset(0% 100% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power3.inOut' }
    )
    // Slight scale down for image inside
    .fromTo(image,
      { scale: 1.2 },
      { scale: 1, duration: 1.2, ease: 'power3.inOut' },
      "<" // Start at same time as container
    )
    // Fade in content block
    .fromTo(content,
      { opacity: 0, x: index % 2 === 0 ? 30 : -30 },
      { opacity: 1, x: 0, duration: 1, ease: 'power2.out' },
      "-=0.6"
    )
    // Stagger details (number, category, title, description, tags, link)
    .fromTo([number, ...details],
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
      "-=0.6"
    );
  });
});
</script>

<template>
  <section id="karya" class="py-24 md:py-32 relative z-10" ref="sectionRef">
    <div class="max-w-7xl mx-auto px-6">

      <!-- Section Header -->
      <div class="mb-32 text-center max-w-3xl mx-auto" ref="headerRef">
        <h2 class="text-xs uppercase tracking-[0.3em] text-accent-icy mb-4 opacity-80">Karya</h2>
        <h3 class="text-4xl md:text-6xl font-light text-white leading-tight mb-8">
          Editorial <span class="text-gradient">Folio</span>
        </h3>
        <p class="text-gray-400 font-light text-lg">
          Kumpulan proyek yang merepresentasikan dedikasi pada performa, estetika fungsional, dan inovasi arsitektur digital.
        </p>
      </div>

      <!-- Projects Stack -->
      <div class="flex flex-col space-y-24 md:space-y-32 max-w-6xl mx-auto">
        <div 
          v-for="(project, index) in projects" 
          :key="project.id"
          class="project-row group flex flex-col md:flex-row items-center gap-10 lg:gap-16"
          :class="{ 'md:flex-row-reverse': index % 2 !== 0 }"
          :ref="el => { if (el) projectsRef.push(el) }"
        >
          <!-- Image Side (50%) -->
          <div class="w-full md:w-[50%] lg:w-[55%] relative">
            <a :href="project.link" target="_blank" rel="noopener noreferrer" class="block relative overflow-hidden rounded-xl project-image-container bg-obsidian border border-white/5">
              <img 
                :src="project.image" 
                :alt="project.title"
                class="w-full h-auto aspect-[16/10] object-cover project-image transition-transform duration-1000 group-hover:scale-105"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-obsidian/20 group-hover:bg-transparent transition-colors duration-700"></div>
            </a>
          </div>

          <!-- Content Side (50%) -->
          <div class="w-full md:w-[50%] lg:w-[45%] flex flex-col relative project-content">
            <div class="relative z-10 pt-4 md:pt-0">
              <!-- Neat & Elegant Top Detail -->
              <div class="anim-detail mb-6 flex items-center gap-4">
                <span class="project-number text-2xl md:text-3xl font-light text-white/30 tracking-widest font-mono">
                  {{ project.id }}
                </span>
                <div class="w-12 h-[1px] bg-white/10"></div>
                <span class="text-[10px] uppercase tracking-[0.2em] text-accent-icy font-medium">
                  {{ project.category }}
                </span>
              </div>
              
              <h4 class="anim-detail text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-6 tracking-tight leading-tight group-hover:text-accent-icy transition-colors duration-500">
                {{ project.title }}
              </h4>
              
              <p class="anim-detail text-gray-400 font-light leading-relaxed mb-8 text-sm md:text-base">
                {{ project.description }}
              </p>
              
              <!-- Tech Tags -->
              <div class="anim-detail flex flex-wrap gap-2 mb-10">
                <span 
                  v-for="(tech, i) in project.tech.split(',')" 
                  :key="i"
                  class="px-3 py-1 text-[10px] font-mono tracking-wider text-gray-300 border border-white/10 rounded-full"
                >
                  {{ tech.trim() }}
                </span>
              </div>
              
              <!-- Link -->
              <a 
                :href="project.link" 
                target="_blank" 
                rel="noopener noreferrer"
                class="anim-detail inline-flex items-center gap-3 text-xs uppercase tracking-widest text-white group-hover:text-accent-icy transition-colors duration-300"
              >
                <span>Lihat Proyek</span>
                <span class="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-accent-icy/50 transition-colors duration-300">
                  <ArrowUpRight class="w-4 h-4" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.project-image-container {
  clip-path: inset(0% 0% 0% 0%);
}
</style>

