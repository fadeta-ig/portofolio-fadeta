import { onMounted, onUnmounted } from 'vue';

/**
 * Scroll-reveal composable that only loads GSAP once the section is visible.
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
    triggerStart: _triggerStart = 'top 85%',
    once: _once = false
  } = options;

  let ctx;
  let observer;
  let isDisposed = false;

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

    const reveal = async () => {
      const { default: gsap } = await import('gsap');
      if (isDisposed || !elementRef.value) return;

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
          ease
        }
      );
      }, elementRef.value);
    };

    if (!('IntersectionObserver' in window)) {
      reveal();
      return;
    }

    observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer?.disconnect();
      observer = undefined;
      reveal();
    }, { rootMargin: '0px' });
    observer.observe(elementRef.value);
  });

  onUnmounted(() => {
    isDisposed = true;
    observer?.disconnect();
    ctx?.revert();
  });
}
