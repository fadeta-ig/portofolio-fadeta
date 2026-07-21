import { ViteSSG } from 'vite-ssg';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './assets/css/main.css';
import App from './App.vue';
import { prerenderRoutes, routes, scrollBehavior } from './router';
import { initializeAnalytics, trackEvent } from './lib/analytics';

if (!import.meta.env.SSR) {
  gsap.registerPlugin(ScrollTrigger);
  initializeAnalytics();

  document.addEventListener('click', (event) => {
    const target = event.target.closest?.('[data-track]');
    if (!target) return;
    trackEvent('cta_click', {
      cta_id: target.dataset.track,
      link_url: target.href || undefined,
      link_text: target.textContent?.trim().replace(/\s+/g, ' ').slice(0, 120)
    });
  });
}

export const createApp = ViteSSG(App, { routes, scrollBehavior });

export function includedRoutes() {
  return prerenderRoutes;
}
