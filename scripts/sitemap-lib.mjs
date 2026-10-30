function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function readAttribute(tag, attribute) {
  return tag.match(new RegExp(`\\b${escapeRegExp(attribute)}=["']([^"']+)["']`, 'i'))?.[1] ?? '';
}

export function extractCanonical(html) {
  const tag = html.match(/<link\b[^>]*\brel=["']canonical["'][^>]*>/i)?.[0]
    ?? html.match(/<link\b[^>]*\bhref=["'][^"']+["'][^>]*\brel=["']canonical["'][^>]*>/i)?.[0];
  return tag ? readAttribute(tag, 'href') : '';
}

export function isIndexable(html) {
  const robotsTags = html.match(/<meta\b[^>]*\bname=["']robots["'][^>]*>/gi) ?? [];
  return !robotsTags.some((tag) => readAttribute(tag, 'content').toLowerCase().includes('noindex'));
}

export function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function collectCanonicalUrls(records, expectedOrigin) {
  const urls = new Set();

  for (const { html, source = 'unknown' } of records) {
    if (!isIndexable(html)) continue;

    const canonical = extractCanonical(html);
    if (!canonical) throw new Error(`Halaman publik tidak memiliki canonical: ${source}`);

    const parsed = new URL(canonical);
    if (parsed.origin !== expectedOrigin) {
      throw new Error(`Canonical di luar origin produksi: ${canonical}`);
    }

    urls.add(parsed.href);
  }

  return [...urls].sort((left, right) => {
    const leftPath = new URL(left).pathname;
    const rightPath = new URL(right).pathname;
    if (leftPath === '/') return -1;
    if (rightPath === '/') return 1;
    return leftPath.localeCompare(rightPath, 'id');
  });
}

export function getUrlPriorityAndFrequency(url) {
  const pathname = new URL(url).pathname;
  if (pathname === '/') return { priority: '1.0', changefreq: 'weekly' };
  if (pathname === '/kalkulator-website' || pathname === '/portfolio' || pathname === '/konsultasi') {
    return { priority: '0.9', changefreq: 'weekly' };
  }
  if (pathname.startsWith('/solusi/') || pathname.startsWith('/hasil/')) {
    return { priority: '0.8', changefreq: 'monthly' };
  }
  return { priority: '0.3', changefreq: 'yearly' };
}

export function buildSitemap(urls, lastmodDate = new Date().toISOString().split('T')[0]) {
  if (!urls.length) throw new Error('Tidak ada halaman publik untuk dimasukkan ke sitemap.');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((url) => {
      const { priority, changefreq } = getUrlPriorityAndFrequency(url);
      return [
        '  <url>',
        `    <loc>${escapeXml(url)}</loc>`,
        `    <lastmod>${lastmodDate}</lastmod>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        '  </url>'
      ].join('\n');
    }),
    '</urlset>',
    ''
  ].join('\n');
}
