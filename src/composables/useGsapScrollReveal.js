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
    triggerStart = 'top 85%',
    once = false
  } = options;

  let ctx;
  let observer;
  let isDisposed = false;

  function toRootMargin(value) {
    const match = /top\s+(\d+(?:\.\d+)?)%/.exec(value ?? '');
    if (!match) return '0px';
    const visible = Math.min(Math.max(parseFloat(match[1]), 0), 100);
    return `0px 0px -${(100 - visible).toFixed(2)}% 0px`;
  }

  function showFallback(targets) {
    targets.forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = '';
    });
  }

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

    const targets = elementRef.value.children
      ? Array.from(elementRef.value.children)
      : [elementRef.value];
    targets.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = `translateY(${y}px)`;
    });

    const reveal = async () => {
      let gsap;
      try {
        ({ default: gsap } = await import('gsap'));
      } catch {
        if (!isDisposed) showFallback(targets);
        return;
      }
      if (isDisposed || !elementRef.value) return;

      ctx?.revert();
      ctx = gsap.context(() => {
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
      if (once) {
        observer?.disconnect();
        observer = undefined;
      }
      reveal();
    }, { rootMargin: toRootMargin(triggerStart) });
    observer.observe(elementRef.value);
  });

  onUnmounted(() => {
    isDisposed = true;
    observer?.disconnect();
    ctx?.revert();
  });
}
