import { onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * GSAP scroll-reveal composable using gsap.context() for proper Vue 3 cleanup.
 * Respects prefers-reduced-motion by skipping animations when active.
 *
 * @param {import('vue').Ref} elementRef - Template ref for the container element
 * @param {Object} options - Animation configuration
 */
export function useGsapScrollReveal(elementRef, options = {}) {
  const {
    y = 40,
    duration = 0.9,
    stagger = 0.1,
    ease = 'power3.out',
    triggerStart = 'top 85%',
    once = false
  } = options;

  let ctx;

  onMounted(() => {
    if (!elementRef.value) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      const targets = elementRef.value.children
        ? Array.from(elementRef.value.children)
        : [elementRef.value];
      targets.forEach((el) => {
        el.style.opacity = '1';
      });
      return;
    }

    ctx = gsap.context(() => {
      const targets = elementRef.value.children
        ? Array.from(elementRef.value.children)
        : [elementRef.value];

      gsap.fromTo(targets,
        { y, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration,
          stagger,
          ease,
          scrollTrigger: {
            trigger: elementRef.value,
            start: triggerStart,
            toggleActions: once
              ? 'play none none none'
              : 'play none none reverse'
          }
        }
      );
    }, elementRef.value);
  });

  onUnmounted(() => {
    ctx?.revert();
  });
}
