import { useHead } from '@unhead/vue';
import { useRoute } from 'vue-router';
import { watch } from 'vue';
import { featuredProjects } from '../data/projects';
import { findService } from '../data/services';
import { faqs } from '../data/faqs';
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

function faqSchema(canonicalUrl) {
  return {
    '@type': 'FAQPage',
    '@id': `${canonicalUrl}#faq`,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
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
        areaServed: [
          { '@type': 'City', name: 'Blitar' },
          { '@type': 'City', name: 'Surabaya' },
          { '@type': 'State', name: 'Jawa Timur' },
          { '@type': 'Country', name: 'Indonesia' }
        ],
        provider: { '@id': `${siteUrl}/#localbusiness` }
      },
      breadcrumb([
        { name: 'Beranda', url: `${siteUrl}/` },
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
        '@type': 'Article',
        '@id': `${canonicalUrl}#project`,
        headline: project.title,
        name: project.title,
        description: project.description,
        url: canonicalUrl,
        inLanguage: 'id-ID',
        author: { '@id': `${siteUrl}/#organization` },
        creator: { '@id': `${siteUrl}/#organization` }
      },
      breadcrumb([
        { name: 'Beranda', url: `${siteUrl}/` },
        { name: 'Hasil kerja', url: `${siteUrl}/portfolio` },
        { name: project.title, url: canonicalUrl }
      ])
    ];
  }

  if (route.name === 'estimator') {
    return [
      basePage,
      {
        '@type': 'WebApplication',
        '@id': `${canonicalUrl}#app`,
        name: 'Smart Website Estimator — Gandiva Labs',
        description,
        url: canonicalUrl,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'IDR'
        },
        provider: { '@id': `${siteUrl}/#organization` }
      },
      breadcrumb([
        { name: 'Beranda', url: `${siteUrl}/` },
        { name: 'Kalkulator Website', url: canonicalUrl }
      ])
    ];
  }

  if (route.name === 'home') {
    return [basePage, faqSchema(canonicalUrl)];
  }

  return [basePage, breadcrumb([
    { name: 'Beranda', url: `${siteUrl}/` },
    { name: title.split('|')[0].trim(), url: canonicalUrl }
  ])];
}

export function useSeo() {
  const route = useRoute();

  watch(
    () => route.path,
    () => {
      const seo = resolveRouteSeo(route);
      trackPageView(seo.canonicalPath ?? route.path, seo.title ?? 'Gandiva Labs');
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
    // Canonical source #2 of 4: router canonicalPath/meta, this tag, vercel.json
    // Link headers, sitemap-lib extractCanonical. Kept separate on purpose;
    // keep all four in sync per route.
    const canonicalUrl = new URL(seo.canonicalPath ?? route.path, `${siteUrl}/`).href;
    const schema = routeSchema(route, canonicalUrl, title, description);
    const links = [{ rel: 'canonical', href: canonicalUrl, key: 'canonical' }];

    if (route.name === 'home') {
      links.push({
        rel: 'preload',
        href: '/gandiva-hero-editorial-v2.webp',
        as: 'image',
        type: 'image/webp',
        media: '(min-width: 768px)',
        fetchpriority: 'high',
        key: 'hero-desktop-preload'
      });
      links.push({
        rel: 'preload',
        href: '/gandiva-hero-editorial-mobile-v1.webp',
        as: 'image',
        type: 'image/webp',
        media: '(max-width: 767px)',
        fetchpriority: 'high',
        key: 'hero-mobile-preload'
      });
    }

    if (route.name === 'case-study') {
      const project = featuredProjects.find((item) => item.slug === route.params.slug);
      if (project?.image) {
        links.push({
          rel: 'preload',
          href: project.image,
          as: 'image',
          type: 'image/webp',
          media: '(min-width: 768px)',
          fetchpriority: 'high',
          key: 'case-desktop-preload'
        });
        if (project.imageMobile) {
          links.push({
            rel: 'preload',
            href: project.imageMobile,
            as: 'image',
            type: 'image/webp',
            media: '(max-width: 767px)',
            fetchpriority: 'high',
            key: 'case-mobile-preload'
          });
        }
      }
    }

    return {
      htmlAttrs: { lang: 'id' },
      title,
      link: links,
      meta: [
        { name: 'description', content: description, key: 'description' },
        { name: 'robots', content: seo.robots ?? defaultRobots, key: 'robots' },
        { name: 'geo.region', content: 'ID-JI', key: 'geo-region' },
        { name: 'geo.placename', content: 'Surabaya, Jawa Timur', key: 'geo-placename' },
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
        { name: 'twitter:image:alt', content: imageAlt, key: 'twitter-image-alt' },
        { name: 'twitter:site', content: '@gandivalabs', key: 'twitter-site' }
      ],
      script: schema.length ? [{ type: 'application/ld+json', innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@graph': schema }).replace(/</g, '\\u003c'), key: 'route-schema' }] : []
    };
  });
}
