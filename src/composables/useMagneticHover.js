import { onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';

/**
 * Magnetic hover effect composable.
 * Moves element subtly toward cursor on hover, springs back on leave.
 * Automatically cleans up event listeners on unmount.
 *
 * @param {import('vue').Ref} elementRef - Template ref for the target element
 * @param {Object} options - Configuration
 */
export function useMagneticHover(elementRef, options = {}) {
  const { strength = 0.35, resetEase = 'elastic.out(1, 0.3)' } = options;
  let cleanup = null;

  onMounted(() => {
    if (!elementRef.value) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const el = elementRef.value.$el || elementRef.value;

    const handleMouseMove = (event) => {
      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left) - rect.width / 2;
      const y = (event.clientY - rect.top) - rect.height / 2;

      gsap.to(el, {
        x: x * strength,
        y: y * strength,
        duration: 0.5,
        ease: 'power3.out'
      });
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: resetEase
      });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    cleanup = () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      gsap.killTweensOf(el);
    };
  });

  onUnmounted(() => {
    cleanup?.();
  });
}
