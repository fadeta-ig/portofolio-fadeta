import { useHead } from '@unhead/vue';
import { useRoute } from 'vue-router';
import { watch } from 'vue';
import { featuredProjects } from '../data/projects';
import { findService } from '../data/services';
import { defaultDescription, defaultImage, defaultImageAlt, defaultRobots, resolveRouteSeo, siteUrl } from '../router';
import { trackPageView } from '../lib/analytics';

function breadcrumb(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

function routeSchema(route, canonicalUrl, title, description) {
  const basePage = {
    '@type': route.name === 'portfolio' ? 'CollectionPage' : route.name === 'consultation' ? 'ContactPage' : 'WebPage',
    '@id': `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: title,
    description,
    inLanguage: 'id-ID',
    isPartOf: { '@id': `${siteUrl}/#website` },
    about: { '@id': `${siteUrl}/#organization` }
  };

  if (route.name === 'service-detail') {
    const service = findService(route.params.slug);
    if (!service) return [basePage];
    return [
      basePage,
      {
        '@type': 'Service',
        '@id': `${canonicalUrl}#service`,
        name: service.name,
        description: service.summary,
        url: canonicalUrl,
        areaServed: { '@type': 'Country', name: 'Indonesia' },
        provider: { '@id': `${siteUrl}/#organization` }
      },
      breadcrumb([
        { name: 'Beranda', url: `${siteUrl}/` },
        { name: 'Solusi', url: `${siteUrl}/#services` },
        { name: service.name, url: canonicalUrl }
      ])
    ];
  }

  if (route.name === 'case-study') {
    const project = featuredProjects.find((item) => item.slug === route.params.slug);
    if (!project) return [basePage];
    return [
      basePage,
      {
        '@type': 'CreativeWork',
        '@id': `${canonicalUrl}#project`,
        name: project.title,
        description: project.description,
        url: canonicalUrl,
        inLanguage: 'id-ID',
        creator: { '@id': `${siteUrl}/#organization` }
      },
      breadcrumb([
        { name: 'Beranda', url: `${siteUrl}/` },
        { name: 'Hasil kerja', url: `${siteUrl}/portfolio` },
        { name: project.title, url: canonicalUrl }
      ])
    ];
  }

  if (route.name === 'home') return [];
  return [basePage, breadcrumb([
    { name: 'Beranda', url: `${siteUrl}/` },
    { name: title.split('|')[0].trim(), url: canonicalUrl }
  ])];
}

export function useSeo() {
  const route = useRoute();

  watch(
    () => route.fullPath,
    () => {
      const seo = resolveRouteSeo(route);
      trackPageView(route.fullPath, seo.title ?? 'Gandiva Labs');
    },
    { immediate: true }
  );

  useHead(() => {
    const seo = resolveRouteSeo(route);
    const title = seo.title ?? 'Gandiva Labs';
    const description = seo.description ?? defaultDescription;
    const image = seo.image ?? defaultImage;
    const imageAlt = seo.imageAlt ?? defaultImageAlt;
    const imageType = seo.imageType ?? 'image/png';
    const canonicalUrl = new URL(seo.canonicalPath ?? route.path, `${siteUrl}/`).href;
    const schema = routeSchema(route, canonicalUrl, title, description);

    return {
      htmlAttrs: { lang: 'id' },
      title,
      link: [{ rel: 'canonical', href: canonicalUrl, key: 'canonical' }],
      meta: [
        { name: 'description', content: description, key: 'description' },
        { name: 'robots', content: seo.robots ?? defaultRobots, key: 'robots' },
        { property: 'og:type', content: seo.openGraphType ?? 'website', key: 'og-type' },
        { property: 'og:title', content: title, key: 'og-title' },
        { property: 'og:description', content: description, key: 'og-description' },
        { property: 'og:url', content: canonicalUrl, key: 'og-url' },
        { property: 'og:image', content: image, key: 'og-image' },
        { property: 'og:image:secure_url', content: image, key: 'og-image-secure-url' },
        { property: 'og:image:type', content: imageType, key: 'og-image-type' },
        { property: 'og:image:width', content: '1200', key: 'og-image-width' },
        { property: 'og:image:height', content: '630', key: 'og-image-height' },
        { property: 'og:image:alt', content: imageAlt, key: 'og-image-alt' },
        { name: 'twitter:card', content: 'summary_large_image', key: 'twitter-card' },
        { name: 'twitter:title', content: title, key: 'twitter-title' },
        { name: 'twitter:description', content: description, key: 'twitter-description' },
        { name: 'twitter:image', content: image, key: 'twitter-image' },
        { name: 'twitter:image:alt', content: imageAlt, key: 'twitter-image-alt' }
      ],
      script: schema.length ? [{ type: 'application/ld+json', innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@graph': schema }), key: 'route-schema' }] : []
    };
  });
}
