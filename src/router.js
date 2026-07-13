import { createRouter, createWebHistory } from 'vue-router';
const HomeView = () => import('./views/HomeView.vue');
const PortfolioView = () => import('./views/PortfolioView.vue');

const defaultDescription = 'Gandiva Labs membantu bisnis membangun website yang jelas, mudah dipercaya, dan siap dipakai untuk bertumbuh.';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Gandiva Labs — Website untuk bisnis yang ingin lebih dipercaya',
        description: defaultDescription
      }
    },
    {
      path: '/portfolio',
      name: 'portfolio',
      component: PortfolioView,
      meta: {
        title: 'Portofolio — Gandiva Labs',
        description: 'Kumpulan website bisnis, sistem internal, dan eksperimen digital yang pernah dibangun oleh Gandiva Labs.'
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

router.afterEach((to) => {
  document.title = to.meta.title ?? 'Gandiva Labs';

  let description = document.querySelector('meta[name="description"]');
  if (!description) {
    description = document.createElement('meta');
    description.setAttribute('name', 'description');
    document.head.appendChild(description);
  }
  description.setAttribute('content', to.meta.description ?? defaultDescription);
});

export default router;
