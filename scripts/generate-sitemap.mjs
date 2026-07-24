import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { buildSitemap, collectCanonicalUrls } from './sitemap-lib.mjs';

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

const records = collectHtmlFiles(dist).map((file) => ({
  source: file,
  html: readFileSync(file, 'utf8')
}));
const sortedUrls = collectCanonicalUrls(records, expectedOrigin);
const sitemap = buildSitemap(sortedUrls);

writeFileSync(sitemapFile, sitemap, 'utf8');
console.log(`Sitemap dibuat dari ${sortedUrls.length} halaman publik hasil prerender.`);
