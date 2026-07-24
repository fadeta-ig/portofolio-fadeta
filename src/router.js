import { findService, services } from './data/services';
import { featuredProjects } from './data/projects';

const HomeView = () => import('./views/HomeView.vue');
const PortfolioView = () => import('./views/PortfolioView.vue');
const ServiceView = () => import('./views/ServiceView.vue');
const CaseStudyView = () => import('./views/CaseStudyView.vue');
const ConsultationView = () => import('./views/ConsultationView.vue');
const PrivacyView = () => import('./views/PrivacyView.vue');
const ThankYouView = () => import('./views/ThankYouView.vue');

export const siteUrl = 'https://www.gandivalabs.my.id';
export const defaultImage = `${siteUrl}/og.png`;
export const defaultImageAlt = 'Gandiva Labs — Website yang masuk akal untuk bisnis.';
export const defaultDescription = 'Gandiva Labs membantu bisnis menyusun dan membangun website yang mudah dipahami, dipercaya, dan dikembangkan.';
export const defaultRobots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

export const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Website yang Masuk Akal untuk Bisnis | Gandiva Labs',
      description: defaultDescription,
      canonicalPath: '/'
    }
  },
  {
    path: '/solusi/:slug',
    name: 'service-detail',
    component: ServiceView,
    beforeEnter: (to) => findService(to.params.slug) ? true : { name: 'home' }
  },
  {
    path: '/portfolio',
    name: 'portfolio',
    component: PortfolioView,
    meta: {
      title: 'Hasil Kerja & Portofolio Website | Gandiva Labs',
      description: 'Lihat website bisnis, sistem internal, dan eksperimen digital yang dikerjakan Gandiva Labs beserta konteks kebutuhannya.',
      canonicalPath: '/portfolio'
    }
  },
  {
    path: '/hasil/:slug',
    name: 'case-study',
    component: CaseStudyView,
    beforeEnter: (to) => featuredProjects.some((project) => project.slug === to.params.slug) ? true : { name: 'portfolio' }
  },
  {
    path: '/konsultasi',
    name: 'consultation',
    component: ConsultationView,
    meta: {
      title: 'Ceritakan Kebutuhan Website Anda | Gandiva Labs',
      description: 'Ceritakan masalah, tujuan, dan konteks bisnis Anda. Gandiva Labs akan memetakan kebutuhan sebelum membahas fitur atau visual.',
      canonicalPath: '/konsultasi'
    }
  },
  {
    path: '/privasi',
    name: 'privacy',
    component: PrivacyView,
    meta: {
      title: 'Privasi Data | Gandiva Labs',
      description: 'Informasi tentang data yang dikumpulkan melalui website Gandiva Labs dan bagaimana data tersebut digunakan.',
      canonicalPath: '/privasi'
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
];

export function scrollBehavior(to, from, savedPosition) {
  if (savedPosition) return savedPosition;
  if (to.hash) return { el: to.hash, top: 96, behavior: 'smooth' };
  return { top: 0 };
}

export function resolveRouteSeo(to) {
  if (to.name === 'service-detail') {
    const service = findService(to.params.slug);
    return service ? { title: service.seoTitle, description: service.seoDescription, canonicalPath: to.path } : {};
  }

  if (to.name === 'case-study') {
    const project = featuredProjects.find((item) => item.slug === to.params.slug);
    return project ? {
      title: `${project.title} — Studi Kasus Website | Gandiva Labs`,
      description: `${project.description} Baca kebutuhan, pendekatan, dan ruang lingkup proyeknya.`,
      canonicalPath: to.path,
      image: `${siteUrl}${project.socialImage}`,
      imageAlt: project.socialImageAlt,
      imageType: 'image/jpeg',
      openGraphType: 'article'
    } : {};
  }

  return to.meta;
}

export const prerenderRoutes = [
  '/',
  '/portfolio',
  ...services.map((service) => `/solusi/${service.slug}`),
  ...featuredProjects.map((project) => `/hasil/${project.slug}`),
  '/konsultasi',
  '/privasi'
];
