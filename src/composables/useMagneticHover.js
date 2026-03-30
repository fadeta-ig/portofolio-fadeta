import { onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';

export function useMagneticHover(elementRef) {
  let isHovering = false;

  onMounted(() => {
    if (!elementRef.value) return;
    
    // Depending on if the ref is a component (has $el) or basic element
    const el = elementRef.value.$el || elementRef.value;
    
    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      // Calculate cursor position relative to center of element
      const x = (e.clientX - rect.left) - rect.width / 2;
      const y = (e.clientY - rect.top) - rect.height / 2;
      
      // Move element slightly towards cursor
      gsap.to(el, {
        x: x * 0.4,
        y: y * 0.4,
        duration: 0.6,
        ease: 'power3.out'
      });
    };

    const handleMouseEnter = () => {
      isHovering = true;
    };

    const handleMouseLeave = () => {
      isHovering = false;
      // Reset position
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.3)'
      });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);

    // Store cleanup function on element
    el._cleanupMagnetic = () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
      delete el._cleanupMagnetic;
    };
  });

  onUnmounted(() => {
    if (!elementRef.value) return;
    const el = elementRef.value.$el || elementRef.value;
    if (el && el._cleanupMagnetic) {
      el._cleanupMagnetic();
    }
  });
}
