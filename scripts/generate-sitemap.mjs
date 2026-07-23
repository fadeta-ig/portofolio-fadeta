import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';

const dist = resolve(process.cwd(), 'dist');
const sitemapFile = resolve(dist, 'sitemap.xml');
const expectedOrigin = 'https://www.gandivalabs.my.id';

function collectHtmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectHtmlFiles(path);
    return extname(entry.name) === '.html' ? [path] : [];
  });
}

function readAttribute(tag, attribute) {
  return tag.match(new RegExp(`\\b${attribute}=["']([^"']+)["']`, 'i'))?.[1] ?? '';
}

function extractCanonical(html) {
  const tag = html.match(/<link\b[^>]*\brel=["']canonical["'][^>]*>/i)?.[0]
    ?? html.match(/<link\b[^>]*\bhref=["'][^"']+["'][^>]*\brel=["']canonical["'][^>]*>/i)?.[0];
  return tag ? readAttribute(tag, 'href') : '';
}

function isIndexable(html) {
  const robotsTag = html.match(/<meta\b[^>]*\bname=["']robots["'][^>]*>/i)?.[0];
  return !robotsTag || !readAttribute(robotsTag, 'content').toLowerCase().includes('noindex');
}

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

const urls = new Set();

for (const file of collectHtmlFiles(dist)) {
  const html = readFileSync(file, 'utf8');
  if (!isIndexable(html)) continue;

  const canonical = extractCanonical(html);
  if (!canonical) {
    throw new Error(`Halaman publik tidak memiliki canonical: ${file}`);
  }

  const parsed = new URL(canonical);
  if (parsed.origin !== expectedOrigin) {
    throw new Error(`Canonical di luar origin produksi: ${canonical}`);
  }

  urls.add(parsed.href);
}

const sortedUrls = [...urls].sort((left, right) => {
  const leftPath = new URL(left).pathname;
  const rightPath = new URL(right).pathname;
  if (leftPath === '/') return -1;
  if (rightPath === '/') return 1;
  return leftPath.localeCompare(rightPath, 'id');
});

if (!sortedUrls.length) throw new Error('Tidak ada halaman publik untuk dimasukkan ke sitemap.');

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...sortedUrls.map((url) => `  <url>\n    <loc>${escapeXml(url)}</loc>\n  </url>`),
  '</urlset>',
  ''
].join('\n');

writeFileSync(sitemapFile, sitemap, 'utf8');
console.log(`Sitemap dibuat dari ${sortedUrls.length} halaman publik hasil prerender.`);
