import { createRouter, createWebHistory } from 'vue-router';
const HomeView = () => import('./views/HomeView.vue');
const PortfolioView = () => import('./views/PortfolioView.vue');
const ConsultationView = () => import('./views/ConsultationView.vue');
const ThankYouView = () => import('./views/ThankYouView.vue');

const siteUrl = 'https://www.gandivalabs.my.id';
const defaultImage = `${siteUrl}/favicon.png`;
const defaultDescription = 'Gandiva Labs adalah studio website di Surabaya untuk company profile, landing page, toko online, dan website custom yang jelas, profesional, dan mudah digunakan.';
const defaultRobots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Jasa Pembuatan Website untuk Bisnis | Gandiva Labs',
        description: defaultDescription,
        canonicalPath: '/'
      }
    },
    {
      path: '/portfolio',
      name: 'portfolio',
      component: PortfolioView,
      meta: {
        title: 'Portofolio Website Bisnis & Sistem Internal | Gandiva Labs',
        description: 'Lihat portofolio website bisnis, company profile, toko online, sistem internal, dan eksperimen digital yang dibangun oleh Gandiva Labs.',
        canonicalPath: '/portfolio'
      }
    },
    {
      path: '/konsultasi',
      name: 'consultation',
      component: ConsultationView,
      meta: {
        title: 'Konsultasi Pembuatan Website | Gandiva Labs',
        description: 'Konsultasikan kebutuhan company profile, landing page, toko online, atau website custom bersama Gandiva Labs.',
        canonicalPath: '/konsultasi'
      }
    },
    {
      path: '/terima-kasih',
      name: 'thank-you',
      component: ThankYouView,
      meta: {
        title: 'Brief Berhasil Dikirim - Gandiva Labs',
        description: 'Brief konsultasi Anda telah diterima oleh Gandiva Labs.',
        robots: 'noindex, nofollow, noarchive',
        canonicalPath: '/terima-kasih'
      }
    },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash, top: 96, behavior: 'smooth' };
    return { top: 0 };
  }
});

function setMeta(selector, attribute, value) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    const [key, selectorValue] = attribute;
    element.setAttribute(key, selectorValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', value);
}

function setCanonical(url) {
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', url);
}

router.afterEach((to) => {
  const title = to.meta.title ?? 'Gandiva Labs';
  const description = to.meta.description ?? defaultDescription;
  const canonicalUrl = new URL(to.meta.canonicalPath ?? to.path, `${siteUrl}/`).href;

  document.title = title;
  setCanonical(canonicalUrl);

  setMeta('meta[name="description"]', ['name', 'description'], description);
  setMeta('meta[name="robots"]', ['name', 'robots'], to.meta.robots ?? defaultRobots);
  setMeta('meta[property="og:title"]', ['property', 'og:title'], title);
  setMeta('meta[property="og:description"]', ['property', 'og:description'], description);
  setMeta('meta[property="og:url"]', ['property', 'og:url'], canonicalUrl);
  setMeta('meta[property="og:image"]', ['property', 'og:image'], defaultImage);
  setMeta('meta[name="twitter:title"]', ['name', 'twitter:title'], title);
  setMeta('meta[name="twitter:description"]', ['name', 'twitter:description'], description);
  setMeta('meta[name="twitter:image"]', ['name', 'twitter:image'], defaultImage);
});

export default router;
