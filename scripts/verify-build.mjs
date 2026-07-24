import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const dist = resolve(root, 'dist');
const sitemapFile = resolve(dist, 'sitemap.xml');
const robotsFile = resolve(dist, 'robots.txt');
const defaultSocialImageFile = resolve(dist, 'og.png');
const sourceIndexFile = resolve(root, 'index.html');
const vercelConfigFile = resolve(root, 'vercel.json');
const bookingOfferConfigFile = resolve(root, 'src/lib/bookingOffer.js');
const bookingOfferComponentFile = resolve(root, 'src/components/BookingOffer.vue');
const analyticsFile = resolve(root, 'src/lib/analytics.js');
const webVitalsFile = resolve(root, 'src/lib/webVitals.js');
const privacySourceFile = resolve(root, 'src/views/PrivacyView.vue');
const packageFile = resolve(root, 'package.json');
const expectedHost = 'www.gandivalabs.my.id';
const defaultSocialImage = `https://${expectedHost}/og.png`;
const legacyWhatsapp = ['62815', '53821808'].join('');
const legacyDisplay = ['815', '5382', '1808'].join('-');
const errors = [];

const caseStudies = new Map([
  ['/hasil/shinyoung-beauty', {
    slug: 'shinyoung-beauty',
    name: 'Shinyoung Beauty',
    image: `https://${expectedHost}/og/shinyoung-beauty.jpg`
  }],
  ['/hasil/mahakarya-kosmetika', {
    slug: 'mahakarya-kosmetika',
    name: 'Mahakarya Kosmetika',
    image: `https://${expectedHost}/og/mahakarya-kosmetika.jpg`
  }],
  ['/hasil/wijaya-inovasi', {
    slug: 'wijaya-inovasi',
    name: 'Wijaya Inovasi',
    image: `https://${expectedHost}/og/wijaya-inovasi.jpg`
  }],
  ['/hasil/karya-teknik-internusa-abadi', {
    slug: 'karya-teknik-internusa-abadi',
    name: 'Karya Teknik Internusa Abadi',
    image: `https://${expectedHost}/og/karya-teknik-internusa-abadi.jpg`
  }]
]);

function check(condition, message) {
  if (!condition) errors.push(message);
}

function collectHtmlFiles(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectHtmlFiles(path);
    return extname(entry.name) === '.html' ? [path] : [];
  });
}

function readAttributes(tag) {
  const attributes = new Map();
  for (const match of tag.matchAll(/([\w:-]+)=["']([^"']*)["']/g)) {
    attributes.set(match[1].toLowerCase(), match[2]);
  }
  return attributes;
}

function readMetaContent(html, attribute, value) {
  for (const tag of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attributes = readAttributes(tag[0]);
    if (attributes.get(attribute) === value) return attributes.get('content') ?? '';
  }
  return '';
}

function readCanonical(html) {
  for (const tag of html.matchAll(/<link\b[^>]*>/gi)) {
    const attributes = readAttributes(tag[0]);
    if (attributes.get('rel') === 'canonical') return attributes.get('href') ?? '';
  }
  return '';
}

function renderedFileForPath(pathname) {
  if (pathname === '/') return resolve(dist, 'index.html');
  const cleanUrlFile = resolve(dist, `.${pathname}.html`);
  if (existsSync(cleanUrlFile)) return cleanUrlFile;
  return resolve(dist, `.${pathname}`, 'index.html');
}

async function verifyImage(file, { format, width, height, maximumBytes, label }) {
  check(existsSync(file), `${label} tidak ditemukan.`);
  if (!existsSync(file)) return;

  const image = readFileSync(file);
  check(image.length <= maximumBytes, `${label} terlalu besar (${image.length} byte).`);
  try {
    const metadata = await sharp(image).metadata();
    check(metadata.format === format, `${label} harus berformat ${format}.`);
    check(metadata.width === width, `Lebar ${label} harus ${width} piksel.`);
    check(metadata.height === height, `Tinggi ${label} harus ${height} piksel.`);
  } catch {
    errors.push(`${label} tidak dapat dibaca sebagai gambar.`);
  }
}

await verifyImage(defaultSocialImageFile, {
  format: 'png',
  width: 1200,
  height: 630,
  maximumBytes: 750_000,
  label: 'dist/og.png'
});

for (const project of caseStudies.values()) {
  await verifyImage(resolve(dist, 'og', `${project.slug}.jpg`), {
    format: 'jpeg',
    width: 1200,
    height: 630,
    maximumBytes: 750_000,
    label: `dist/og/${project.slug}.jpg`
  });
}

check(existsSync(sitemapFile), 'dist/sitemap.xml tidak ditemukan.');
check(existsSync(robotsFile), 'dist/robots.txt tidak ditemukan.');
check(!existsSync(resolve(root, 'public/sitemap.xml')), 'public/sitemap.xml harus dihapus; sitemap dibentuk dari hasil prerender.');
check(existsSync(bookingOfferConfigFile), 'Konfigurasi booking offer tidak ditemukan.');
check(existsSync(bookingOfferComponentFile), 'Komponen booking offer tidak ditemukan.');

const sitemap = existsSync(sitemapFile) ? readFileSync(sitemapFile, 'utf8') : '';
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1].trim());
check(urls.length > 0, 'Sitemap tidak berisi URL.');
check(new Set(urls).size === urls.length, 'Sitemap mengandung URL duplikat.');

const renderedUrls = new Set();
for (const file of collectHtmlFiles(dist)) {
  const html = readFileSync(file, 'utf8');
  if (readMetaContent(html, 'name', 'robots').toLowerCase().includes('noindex')) continue;
  const canonical = readCanonical(html);
  check(Boolean(canonical), `Halaman publik tidak memiliki canonical: ${file}`);
  if (canonical) renderedUrls.add(canonical);
}

for (const url of renderedUrls) {
  check(urls.includes(url), `Halaman publik belum tercantum di sitemap: ${url}`);
}
for (const url of urls) {
  check(renderedUrls.has(url), `URL sitemap tidak sesuai halaman publik hasil prerender: ${url}`);
}
check(
  renderedUrls.size === urls.length,
  `Jumlah halaman publik (${renderedUrls.size}) dan URL sitemap (${urls.length}) berbeda.`
);

const caseStudyImages = new Set();
for (const url of urls) {
  const parsed = new URL(url);
  const file = renderedFileForPath(parsed.pathname);
  const project = caseStudies.get(parsed.pathname);
  const expectedImage = project?.image ?? defaultSocialImage;
  const expectedImageType = project ? 'image/jpeg' : 'image/png';

  check(parsed.host === expectedHost, `Host sitemap tidak sesuai: ${url}`);
  check(existsSync(file), `Halaman pre-render tidak ditemukan untuk ${parsed.pathname}`);
  if (!existsSync(file)) continue;

  const html = readFileSync(file, 'utf8');
  const canonical = readCanonical(html);
  const openGraphImage = readMetaContent(html, 'property', 'og:image');
  const openGraphImageType = readMetaContent(html, 'property', 'og:image:type');
  const openGraphImageAlt = readMetaContent(html, 'property', 'og:image:alt');
  const openGraphType = readMetaContent(html, 'property', 'og:type');
  const twitterImage = readMetaContent(html, 'name', 'twitter:image');
  const twitterImageAlt = readMetaContent(html, 'name', 'twitter:image:alt');

  check((html.match(/<title>/gi) ?? []).length === 1, `${parsed.pathname}: title harus tepat satu.`);
  check((html.match(/<h1(?:\s|>)/gi) ?? []).length === 1, `${parsed.pathname}: H1 harus tepat satu.`);
  check((html.match(/id="main-content"/gi) ?? []).length === 1, `${parsed.pathname}: target konten utama harus tepat satu.`);
  check(html.includes('href="#main-content"'), `${parsed.pathname}: skip link ke konten utama tidak ditemukan.`);
  check((html.match(/name="description"/gi) ?? []).length === 1, `${parsed.pathname}: meta description harus tepat satu.`);
  check((html.match(/rel="canonical"/gi) ?? []).length === 1, `${parsed.pathname}: canonical harus tepat satu.`);
  check(canonical === url, `${parsed.pathname}: canonical (${canonical}) tidak sama dengan sitemap (${url}).`);
  check((html.match(/property="og:image"/gi) ?? []).length === 1, `${parsed.pathname}: og:image harus tepat satu.`);
  check(openGraphImage === expectedImage, `${parsed.pathname}: og:image tidak sesuai artwork halaman.`);
  check(openGraphImageType === expectedImageType, `${parsed.pathname}: tipe og:image tidak sesuai.`);
  check(readMetaContent(html, 'property', 'og:image:width') === '1200', `${parsed.pathname}: lebar og:image harus 1200.`);
  check(readMetaContent(html, 'property', 'og:image:height') === '630', `${parsed.pathname}: tinggi og:image harus 630.`);
  check(Boolean(openGraphImageAlt), `${parsed.pathname}: og:image:alt tidak boleh kosong.`);
  check(
    readMetaContent(html, 'name', 'twitter:card') === 'summary_large_image',
    `${parsed.pathname}: Twitter Card harus memakai summary_large_image.`
  );
  check(twitterImage === expectedImage, `${parsed.pathname}: twitter:image tidak sesuai artwork halaman.`);
  check(twitterImageAlt === openGraphImageAlt, `${parsed.pathname}: alt gambar Open Graph dan Twitter harus sama.`);
  check(!html.includes(legacyWhatsapp) && !html.includes(legacyDisplay), `${parsed.pathname}: nomor WhatsApp lama masih ditemukan.`);

  if (project) {
    caseStudyImages.add(openGraphImage);
    check(openGraphType === 'article', `${parsed.pathname}: og:type harus article.`);
    check(
      openGraphImageAlt.toLowerCase().includes(project.name.toLowerCase()),
      `${parsed.pathname}: alt social preview harus menyebut nama proyek.`
    );
  } else {
    check(openGraphType === 'website', `${parsed.pathname}: og:type harus website.`);
  }
}
check(
  caseStudyImages.size === caseStudies.size,
  'Setiap studi kasus harus memiliki social preview yang unik.'
);

const robots = existsSync(robotsFile) ? readFileSync(robotsFile, 'utf8') : '';
check(
  robots.includes(`https://${expectedHost}/sitemap.xml`),
  'robots.txt tidak menunjuk sitemap canonical.'
);

if (existsSync(bookingOfferConfigFile) && existsSync(bookingOfferComponentFile)) {
  const bookingConfig = readFileSync(bookingOfferConfigFile, 'utf8');
  const bookingComponent = readFileSync(bookingOfferComponentFile, 'utf8');
  check(
    bookingConfig.includes("bookingPageUrl = 'https://calendar.app.google/uFMcEBMzzNfDbx2LA'"),
    'Link publik Google Calendar tidak sesuai konfigurasi final.'
  );
  check(
    bookingConfig.includes('calendar.google.com/calendar/appointments/schedules/'),
    'URL embed Google Calendar tidak ditemukan.'
  );
  check(bookingConfig.includes('minimumNoticeHours: 24'), 'Minimum notice booking harus 24 jam.');
  check(bookingConfig.includes('maximumPerDay: 5'), 'Batas booking harus maksimal 5 per hari.');
  check(
    bookingComponent.includes('bookingSchedule.minimumNoticeHours'),
    'Minimum notice 24 jam belum disampaikan pada UI booking.'
  );
  check(
    bookingComponent.includes(':src="bookingEmbedUrl"') && bookingComponent.includes('loading="lazy"'),
    'Google Calendar harus dimuat secara lazy setelah CTA dipilih.'
  );
}

const indexHtmlFile = resolve(dist, 'index.html');
if (existsSync(indexHtmlFile)) {
  const indexHtml = readFileSync(indexHtmlFile, 'utf8');
  check(
    !indexHtml.includes('calendar.google.com/calendar/appointments/schedules/'),
    'Embed Google Calendar tidak boleh masuk ke HTML awal.'
  );
}

const privacyHtmlFile = renderedFileForPath('/privasi');
if (existsSync(privacyHtmlFile)) {
  const privacyHtml = readFileSync(privacyHtmlFile, 'utf8');
  check(privacyHtml.includes('Google Calendar'), 'Halaman privasi belum menjelaskan Google Calendar.');
  for (const metric of ['LCP', 'INP', 'CLS']) {
    check(privacyHtml.includes(metric), `Halaman privasi belum menjelaskan metrik ${metric}.`);
  }
}

const distAssetsDirectory = resolve(dist, 'assets');
if (existsSync(distAssetsDirectory)) {
  const assetFiles = readdirSync(distAssetsDirectory);
  check(
    assetFiles.some((file) => /^BookingOffer-.*\.js$/.test(file)),
    'Booking offer belum dipisahkan ke chunk JavaScript async.'
  );
}

const instrumentFontDirectory = resolve(root, 'public/fonts/instrument-serif');
for (const fileName of [
  'instrument-serif-regular-latin-v5.woff2',
  'instrument-serif-italic-latin-v5.woff2'
]) {
  const fontFile = resolve(instrumentFontDirectory, fileName);
  check(existsSync(fontFile), `Font Instrument Serif tidak ditemukan: ${fileName}`);
  if (existsSync(fontFile)) {
    check(
      readFileSync(fontFile).subarray(0, 4).toString('ascii') === 'wOF2',
      `${fileName} bukan WOFF2 yang valid.`
    );
  }
}
check(existsSync(resolve(instrumentFontDirectory, 'OFL.txt')), 'Lisensi OFL Instrument Serif tidak ditemukan.');
check(existsSync(resolve(root, 'scripts/assets/social-font/OFL.txt')), 'Lisensi OFL font social preview tidak ditemukan.');

const sourceIndex = existsSync(sourceIndexFile) ? readFileSync(sourceIndexFile, 'utf8') : '';
check(!sourceIndex.includes('fonts.googleapis.com'), 'index.html masih bergantung pada Google Fonts stylesheet.');
check(!sourceIndex.includes('fonts.gstatic.com'), 'index.html masih bergantung pada Google Fonts CDN.');
check(sourceIndex.includes('api.fontshare.com'), 'Fontshare untuk Satoshi tidak ditemukan.');
check(
  sourceIndex.includes('/fonts/instrument-serif/instrument-serif-italic-latin-v5.woff2'),
  'Instrument Serif italic belum dipreload.'
);

const themeScriptMatch = sourceIndex.match(/<script>([\s\S]*?)<\/script>/);
check(Boolean(themeScriptMatch), 'Theme boot script sebelum Vue tidak ditemukan.');
const themeScript = themeScriptMatch?.[1] ?? '';
const themeHash = `sha256-${createHash('sha256').update(themeScript).digest('base64')}`;
check(themeScript.includes('gandiva-theme'), 'Theme boot script tidak membaca preferensi tersimpan.');
check(themeScript.includes('prefers-color-scheme: dark'), 'Theme boot script tidak mengikuti preferensi OS.');
check(
  sourceIndex.indexOf('<script>') < sourceIndex.indexOf('<script type="module"'),
  'Theme boot script harus berjalan sebelum Vue.'
);
check(
  sourceIndex.indexOf('<script>') < sourceIndex.indexOf('api.fontshare.com/v2/css'),
  'Theme boot script harus berjalan sebelum stylesheet eksternal.'
);

const packageJson = existsSync(packageFile)
  ? JSON.parse(readFileSync(packageFile, 'utf8'))
  : {};
check(Boolean(packageJson.dependencies?.['web-vitals']), 'Dependensi web-vitals belum terpasang.');
if (existsSync(webVitalsFile) && existsSync(analyticsFile) && existsSync(privacySourceFile)) {
  const webVitalsSource = readFileSync(webVitalsFile, 'utf8');
  const analyticsSource = readFileSync(analyticsFile, 'utf8');
  const privacySource = readFileSync(privacySourceFile, 'utf8');
  check(
    webVitalsSource.includes("import('web-vitals/attribution')"),
    'Web Vitals attribution belum dimuat secara dinamis.'
  );
  check(
    ['onLCP', 'onINP', 'onCLS'].every((metric) => webVitalsSource.includes(metric)),
    'Pengukuran LCP, INP, dan CLS belum lengkap.'
  );
  check(
    webVitalsSource.includes('hasAnalyticsConsent'),
    'Web Vitals belum dibatasi oleh consent analytics.'
  );
  check(
    analyticsSource.includes('analyticsConsentChangedEvent'),
    'Perubahan consent analytics belum memiliki event sinkronisasi.'
  );
  check(
    ['LCP', 'INP', 'CLS'].every((metric) => privacySource.includes(metric)),
    'Disclosure Web Vitals pada halaman privasi belum lengkap.'
  );
}

check(existsSync(vercelConfigFile), 'vercel.json tidak ditemukan.');
if (existsSync(vercelConfigFile)) {
  try {
    const vercelConfig = JSON.parse(readFileSync(vercelConfigFile, 'utf8'));
    const globalHeaders = vercelConfig.headers
      ?.find((entry) => entry.source === '/(.*)')
      ?.headers ?? [];
    const headerMap = new Map(globalHeaders.map(({ key, value }) => [key.toLowerCase(), value]));
    for (const header of [
      'content-security-policy-report-only',
      'x-content-type-options',
      'x-frame-options',
      'referrer-policy',
      'permissions-policy'
    ]) {
      check(headerMap.has(header), `Security header belum dikonfigurasi: ${header}`);
    }

    const csp = headerMap.get('content-security-policy-report-only') ?? '';
    check(csp.includes("default-src 'self'"), 'CSP belum membatasi default-src ke origin sendiri.');
    check(csp.includes(`'${themeHash}'`), `CSP belum mengizinkan theme boot script (${themeHash}).`);
    check(csp.includes('challenges.cloudflare.com'), 'CSP belum mengizinkan Turnstile.');
    check(csp.includes('calendar.google.com'), 'CSP belum mengizinkan Google Calendar.');
    check(csp.includes('googletagmanager.com'), 'CSP belum mengizinkan analytics yang digunakan.');
    check(!csp.includes('fonts.googleapis.com'), 'CSP masih mengizinkan Google Fonts stylesheet.');
    check(!csp.includes('fonts.gstatic.com'), 'CSP masih mengizinkan Google Fonts CDN.');

    const fontHeaders = vercelConfig.headers
      ?.find((entry) => entry.source === '/fonts/(.*)')
      ?.headers ?? [];
    const fontCache = fontHeaders
      .find(({ key }) => key.toLowerCase() === 'cache-control')
      ?.value ?? '';
    check(
      fontCache.includes('max-age=31536000') && fontCache.includes('immutable'),
      'Font lokal belum memakai cache immutable satu tahun.'
    );
  } catch {
    errors.push('vercel.json bukan JSON yang valid.');
  }
}

if (errors.length) {
  console.error(`Verifikasi build gagal (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Verifikasi build lolos: ${urls.length} URL prerender, metadata per studi kasus, font lokal, theme boot, RUM consent, sitemap, booking, privasi, dan security headers konsisten.`
);
