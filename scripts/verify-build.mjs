import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const dist = resolve(root, 'dist');
const sitemapFile = resolve(dist, 'sitemap.xml');
const robotsFile = resolve(dist, 'robots.txt');
const expectedHost = 'www.gandivalabs.my.id';
const legacyWhatsapp = ['62815', '53821808'].join('');
const legacyDisplay = ['815', '5382', '1808'].join('-');
const errors = [];

function check(condition, message) {
  if (!condition) errors.push(message);
}

check(existsSync(sitemapFile), 'dist/sitemap.xml tidak ditemukan.');
check(existsSync(robotsFile), 'dist/robots.txt tidak ditemukan.');

const sitemap = existsSync(sitemapFile) ? readFileSync(sitemapFile, 'utf8') : '';
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1].trim());
check(urls.length > 0, 'Sitemap tidak berisi URL.');

for (const url of urls) {
  const parsed = new URL(url);
  const file = parsed.pathname === '/'
    ? resolve(dist, 'index.html')
    : resolve(dist, `.${parsed.pathname}.html`);

  check(parsed.host === expectedHost, `Host sitemap tidak sesuai: ${url}`);
  check(existsSync(file), `Halaman pre-render tidak ditemukan untuk ${parsed.pathname}`);
  if (!existsSync(file)) continue;

  const html = readFileSync(file, 'utf8');
  const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1]
    ?? html.match(/<link[^>]+href="([^"]+)"[^>]+rel="canonical"/i)?.[1];

  check((html.match(/<title>/gi) ?? []).length === 1, `${parsed.pathname}: title harus tepat satu.`);
  check((html.match(/<h1(?:\s|>)/gi) ?? []).length === 1, `${parsed.pathname}: H1 harus tepat satu.`);
  check((html.match(/name="description"/gi) ?? []).length === 1, `${parsed.pathname}: meta description harus tepat satu.`);
  check((html.match(/rel="canonical"/gi) ?? []).length === 1, `${parsed.pathname}: canonical harus tepat satu.`);
  check(canonical === url, `${parsed.pathname}: canonical (${canonical}) tidak sama dengan sitemap (${url}).`);
  check(!html.includes(legacyWhatsapp) && !html.includes(legacyDisplay), `${parsed.pathname}: nomor WhatsApp lama masih ditemukan.`);
}

const robots = existsSync(robotsFile) ? readFileSync(robotsFile, 'utf8') : '';
check(robots.includes('https://www.gandivalabs.my.id/sitemap.xml'), 'robots.txt tidak menunjuk sitemap canonical.');

if (errors.length) {
  console.error(`Verifikasi build gagal (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Verifikasi build lolos: ${urls.length} URL pre-render, sitemap, robots, metadata, dan nomor kontak konsisten.`);
