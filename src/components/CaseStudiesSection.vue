<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-vue-next';
import { projects } from '../data/projects';

const sectionRef = ref(null);
const cardsRef = ref([]);
let ctx;

onMounted(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  ctx = gsap.context(() => {
    // Header reveal
    gsap.from('.section-header-elem', {
      y: 30, opacity: 0, duration: 1, stagger: 0.1,
      scrollTrigger: { trigger: sectionRef.value, start: 'top 85%' }
    });

    if (prefersReducedMotion) return;

    // Stacking Card Effect
    cardsRef.value.forEach((card, index) => {
      
      // Scale down card as the next card overlaps it
      if (index < cardsRef.value.length - 1) {
        gsap.to(card, {
          scale: 0.92,
          opacity: 0.3,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top 12%", 
            endTrigger: cardsRef.value[index + 1],
            end: `top 12%+=${index * 12}px`, // Finish when next card hits its specific sticky offset
            scrub: true,
          }
        });
      }
      
      // Content entrance animations
      const contentElements = card.querySelectorAll('.card-anim');
      gsap.from(contentElements, {
        y: 20, opacity: 0, duration: 0.6, stagger: 0.08,
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });
      
      // Browser Mockup entrance scale
      const browser = card.querySelector('.browser-mockup');
      gsap.from(browser, {
        y: 40, opacity: 0, duration: 0.8, ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });

      // Browser Image zoom effect
      const img = card.querySelector('.browser-img');
      gsap.from(img, {
        scale: 1.15,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });

    });

  }, sectionRef.value);
});

onUnmounted(() => {
  ctx?.revert();
});
</script>

<template>
  <section id="karya" class="py-24 md:py-32 relative z-10" ref="sectionRef">
    <div class="max-w-7xl mx-auto px-6">

      <!-- Section Header -->
      <div class="mb-24 text-center max-w-3xl mx-auto">
        <h2 class="section-label mb-4 section-header-elem">Karya</h2>
        <h3 class="text-4xl md:text-6xl font-light text-text-primary leading-tight mb-8 section-heading section-header-elem">
          Editorial <span class="text-gradient font-medium font-display italic">Folio</span>
        </h3>
        <p class="text-text-secondary font-normal text-lg section-header-elem">
          Kumpulan proyek web yang merepresentasikan dedikasi pada performa, estetika fungsional, dan inovasi visual.
        </p>
      </div>

      <!-- Sticky Stacking Container -->
      <!-- Added extra padding bottom to allow scrolling past the last card smoothly -->
      <div class="relative w-full pb-[15vh]">
        <div
          v-for="(project, index) in projects"
          :key="project.id"
          class="project-card sticky w-full mb-[20vh] last:mb-0 transform-gpu origin-top"
          :style="{ top: `calc(12vh + ${index * 12}px)` }"
          :ref="el => { if (el) cardsRef.push(el) }"
        >
          <!-- Card Body -->
          <div class="w-full flex flex-col lg:flex-row bg-bg-primary border border-border-default shadow-[0_30px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.4)] rounded-[2rem] overflow-hidden">
            
            <!-- Left: Text Content -->
            <div class="w-full lg:w-[45%] p-8 md:p-12 lg:p-16 flex flex-col justify-center relative z-10 bg-bg-primary">
              <div class="card-anim mb-6 flex items-center gap-4">
                <span class="text-2xl md:text-3xl font-light text-text-tertiary tracking-widest font-mono">
                  {{ project.id }}
                </span>
                <div class="w-12 h-[1px] bg-border-default"></div>
                <span class="text-[10px] uppercase tracking-[0.2em] text-accent font-medium">
                  {{ project.category }}
                </span>
              </div>

              <h4 class="card-anim text-3xl md:text-4xl lg:text-5xl font-semibold text-text-primary mb-6 tracking-tight leading-tight">
                {{ project.title }}
              </h4>

              <p class="card-anim text-text-secondary font-normal leading-relaxed mb-8 text-sm md:text-base">
                {{ project.description }}
              </p>

              <div class="card-anim flex flex-wrap gap-2 mb-12">
                <span
                  v-for="(tech, i) in project.tech.split(',')"
                  :key="i"
                  class="tag font-mono border-border-subtle"
                >
                  {{ tech.trim() }}
                </span>
              </div>

              <a
                :href="project.link"
                target="_blank"
                rel="noopener noreferrer"
                class="card-anim inline-flex items-center gap-3 w-fit text-xs uppercase tracking-widest text-text-primary group/btn hover:text-accent transition-colors duration-300"
              >
                <span>Kunjungi Website</span>
                <span class="w-8 h-8 rounded-full border border-border-default flex items-center justify-center group-hover/btn:border-accent/50 group-hover/btn:bg-accent-subtle transition-all duration-300">
                  <ArrowUpRight class="w-4 h-4 group-hover/btn:rotate-45 transition-transform duration-300" />
                </span>
              </a>
            </div>

            <!-- Right: Browser Mockup -->
            <div class="w-full lg:w-[55%] p-6 md:p-10 lg:p-12 bg-bg-secondary border-t lg:border-t-0 lg:border-l border-border-default flex items-center justify-center relative">
              
              <!-- Subtle ambient glow -->
              <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div class="w-3/4 h-3/4 bg-accent blur-[100px] opacity-[0.08] dark:opacity-[0.12] rounded-full"></div>
              </div>

              <!-- Browser Frame -->
              <div class="browser-mockup relative w-full rounded-xl overflow-hidden border border-border-default shadow-2xl bg-bg-primary group/browser transition-transform duration-700 hover:-translate-y-2">
                
                <!-- macOS Style Header -->
                <div class="h-8 md:h-10 flex items-center px-4 gap-2 bg-bg-tertiary border-b border-border-default">
                   <!-- Dots -->
                   <div class="w-2.5 h-2.5 rounded-full bg-border-default group-hover/browser:bg-red-400/90 transition-colors duration-300"></div>
                   <div class="w-2.5 h-2.5 rounded-full bg-border-default group-hover/browser:bg-amber-400/90 transition-colors duration-300"></div>
                   <div class="w-2.5 h-2.5 rounded-full bg-border-default group-hover/browser:bg-emerald-400/90 transition-colors duration-300"></div>
                   
                   <!-- Fake URL Bar -->
                   <div class="ml-3 flex-1 h-5 md:h-6 rounded-md bg-bg-primary border border-border-subtle flex items-center justify-center overflow-hidden">
                      <span class="text-[9px] md:text-[10px] text-text-tertiary font-mono tracking-wider opacity-0 group-hover/browser:opacity-100 transition-opacity duration-300 translate-y-1 group-hover/browser:translate-y-0">
                        {{ project.title.toLowerCase().replace(/\s+/g, '-') }}.com
                      </span>
                   </div>
                </div>

                <!-- Browser Image -->
                <div class="relative w-full aspect-[16/10] bg-bg-secondary overflow-hidden">
                  <!-- Dark overlay that fades on hover to draw focus to content initially -->
                  <div class="absolute inset-0 bg-gradient-to-t from-bg-primary/50 to-transparent opacity-100 group-hover/browser:opacity-0 transition-opacity duration-700 z-10 pointer-events-none"></div>
                  
                  <img
                    :src="project.image"
                    :alt="project.title"
                    class="browser-img w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

    </div>
  </section>
</template>
