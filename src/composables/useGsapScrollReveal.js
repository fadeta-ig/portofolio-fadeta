import { ref, onMounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useGsapScrollReveal(elementRef, options = {}) {
  const {
    y = 50,
    duration = 1,
    stagger = 0.1,
    ease = 'power3.out',
    triggerStart = 'top 80%',
    markers = false
  } = options;

  onMounted(() => {
    if (!elementRef.value) return;

    // Handle single element or array of elements (like children of a ref)
    const targets = elementRef.value.children ? Array.from(elementRef.value.children) : elementRef.value;

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
          markers,
          toggleActions: "play none none reverse"
        }
      }
    );
  });
}
