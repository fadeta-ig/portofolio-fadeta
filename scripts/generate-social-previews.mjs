import { mkdir, stat, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.cwd();
const outputDirectory = resolve(root, 'public/og');
const defaultOutputFile = resolve(root, 'public/og.png');
const heroImagePath = resolve(root, 'public/gandiva-hero-editorial-v2.webp');
const logoMarkPath = resolve(root, 'public/gandiva-mark-light.webp');
const regularFontPath = resolve(root, 'scripts/assets/social-font/Manrope-Regular.ttf');
const boldFontPath = resolve(root, 'scripts/assets/social-font/Manrope-Bold.ttf');
const selectedSlug = process.argv
  .find((argument) => argument.startsWith('--project='))
  ?.split('=')[1];
const fontCacheRoot = resolve(root, 'node_modules/.cache');
const fontConfigFile = resolve(fontCacheRoot, 'fonts.conf');

await mkdir(resolve(fontCacheRoot, 'fontconfig'), { recursive: true });
await writeFile(
  fontConfigFile,
  `<?xml version="1.0"?>
  <!DOCTYPE fontconfig SYSTEM "urn:fontconfig:fonts.dtd">
  <fontconfig>
    <dir>${resolve(root, 'scripts/assets/social-font').replaceAll('\\', '/')}</dir>
    <cachedir>${resolve(fontCacheRoot, 'fontconfig').replaceAll('\\', '/')}</cachedir>
  </fontconfig>`
);
process.env.XDG_CACHE_HOME = fontCacheRoot;
process.env.FONTCONFIG_PATH = fontCacheRoot;
process.env.FONTCONFIG_FILE = 'fonts.conf';
const { default: sharp } = await import('sharp');

const projects = [
  {
    slug: 'shinyoung-beauty',
    title: 'Shinyoung Beauty',
    category: 'E-commerce · Beauty',
    summary: 'Toko online yang menyatukan katalog, halaman produk, akun pelanggan, dan alur belanja.',
    screenshot: 'shinyoung.webp',
    accent: '#d8978b'
  },
  {
    slug: 'mahakarya-kosmetika',
    title: 'Mahakarya Kosmetika',
    category: 'Company profile · B2B',
    summary: 'Website manufaktur kosmetik yang menata layanan, proses, kapabilitas, dan jalur konsultasi.',
    screenshot: 'mahakarya.webp',
    accent: '#d1aa7c'
  },
  {
    slug: 'wijaya-inovasi',
    title: 'Wijaya Inovasi',
    category: 'Company profile · Manufaktur',
    summary: 'Website bisnis pengembangan produk herbal serta makanan dan minuman fungsional.',
    screenshot: 'wijaya.webp',
    accent: '#d6654f'
  },
  {
    slug: 'karya-teknik-internusa-abadi',
    title: 'Karya Teknik Internusa Abadi',
    category: 'Company profile · Galangan kapal',
    summary: 'Website galangan kapal yang memperkenalkan layanan, fasilitas, pengalaman, dan profil perusahaan.',
    screenshot: 'ktia.webp',
    accent: '#597aa5'
  }
];

function escapeMarkup(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function wrapText(text, maxCharacters, maxLines) {
  const words = text.trim().split(/\s+/);
  const lines = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (current && candidate.length > maxCharacters) {
      lines.push(current);
      current = word;
      if (lines.length === maxLines) break;
    } else {
      current = candidate;
    }
  }

  if (current && lines.length < maxLines) lines.push(current);
  return lines;
}

async function createTextLayer({
  text,
  color,
  fontSize,
  fontFile,
  fontName,
  width,
  letterSpacing = 0,
  spacing = 0
}) {
  const spacingAttribute = letterSpacing
    ? ` letter_spacing="${Math.round(letterSpacing * 1024)}"`
    : '';
  const markup = `<span foreground="${color}"${spacingAttribute}>${escapeMarkup(text)}</span>`;
  const { data, info } = await sharp({
    text: {
      text: markup,
      font: `${fontName} ${fontSize}`,
      fontfile: fontFile,
      width,
      align: 'left',
      justify: false,
      dpi: 72,
      rgba: true,
      spacing,
      wrap: 'none'
    }
  })
    .png()
    .toBuffer({ resolveWithObject: true });

  return { data, width: info.width, height: info.height };
}

async function createPreview(project) {
  const screenshotPath = resolve(root, 'src/assets/screenshots', project.screenshot);
  const outputPath = resolve(outputDirectory, `${project.slug}.jpg`);
  const titleLines = wrapText(project.title, 15, 3);
  const summaryLines = wrapText(project.summary, 42, 4);

  const logoMark = await sharp(logoMarkPath)
    .resize(40, 31, { fit: 'contain' })
    .png()
    .toBuffer();

  const brand = await createTextLayer({
    text: 'GANDIVA LABS',
    color: '#f5f0e7',
    fontSize: 20,
    fontFile: boldFontPath,
    fontName: 'Manrope Bold',
    width: 300,
    letterSpacing: 1.8
  });
  const category = await createTextLayer({
    text: project.category.toUpperCase(),
    color: project.accent,
    fontSize: 14,
    fontFile: boldFontPath,
    fontName: 'Manrope Bold',
    width: 430,
    letterSpacing: 2.1
  });
  const titleLayers = [];
  for (const line of titleLines) {
    titleLayers.push(await createTextLayer({
      text: line,
      color: '#f5f0e7',
      fontSize: 45,
      fontFile: boldFontPath,
      fontName: 'Manrope Bold',
      width: 440
    }));
  }
  const summaryLayers = [];
  for (const line of summaryLines) {
    summaryLayers.push(await createTextLayer({
      text: line,
      color: '#b6aea3',
      fontSize: 18,
      fontFile: regularFontPath,
      fontName: 'Manrope',
      width: 440
    }));
  }

  const screenshot = await sharp(screenshotPath)
    .resize(594, 334, { fit: 'cover', position: 'top' })
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer();
  const screenshotMask = Buffer.from(
    '<svg width="594" height="334"><rect width="594" height="334" rx="16" fill="#fff"/></svg>'
  );
  const roundedScreenshot = await sharp(screenshot)
    .composite([{ input: screenshotMask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const artwork = Buffer.from(`
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#12110f"/>
          <stop offset="0.58" stop-color="#181613"/>
          <stop offset="1" stop-color="#211d18"/>
        </linearGradient>
        <radialGradient id="glow">
          <stop offset="0" stop-color="${project.accent}" stop-opacity="0.32"/>
          <stop offset="1" stop-color="${project.accent}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#background)"/>
      <circle cx="1070" cy="60" r="390" fill="url(#glow)"/>
      <rect x="44" y="44" width="1112" height="542" rx="24" fill="none" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1.5"/>
      <rect x="526" y="108" width="634" height="410" rx="26" fill="#f5f0e7"/>
      <circle cx="556" cy="133" r="5" fill="#d6654f"/>
      <circle cx="575" cy="133" r="5" fill="#d1aa7c"/>
      <circle cx="594" cy="133" r="5" fill="#8fa586"/>
      <rect x="615" y="127" width="244" height="12" rx="6" fill="#ded5c7"/>
    </svg>
  `);

  const titleTop = 168;
  const summaryTop = titleTop + (titleLayers.length * 54) + 20;
  const textComposites = [
    ...titleLayers.map((layer, index) => ({
      input: layer.data,
      left: 64,
      top: titleTop + (index * 54)
    })),
    ...summaryLayers.map((layer, index) => ({
      input: layer.data,
      left: 64,
      top: summaryTop + (index * 28)
    }))
  ];

  await sharp(artwork)
    .composite([
      { input: roundedScreenshot, left: 546, top: 158 },
      { input: logoMark, left: 64, top: 60 },
      { input: brand.data, left: 114, top: 64 },
      { input: category.data, left: 64, top: 128 },
      ...textComposites
    ])
    .jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toFile(outputPath);

  const metadata = await sharp(outputPath).metadata();
  if (metadata.width !== 1200 || metadata.height !== 630 || metadata.format !== 'jpeg') {
    throw new Error(`Social preview tidak valid: ${project.slug}`);
  }

  const file = await stat(outputPath);
  if (file.size > 750_000) {
    throw new Error(`Social preview terlalu besar: ${project.slug} (${file.size} byte)`);
  }

  return { size: file.size };
}

async function createDefaultPreview() {
  const logoMark = await sharp(logoMarkPath)
    .resize(46, 35, { fit: 'contain' })
    .png()
    .toBuffer();

  const brand = await createTextLayer({
    text: 'GANDIVA LABS',
    color: '#f5f0e7',
    fontSize: 22,
    fontFile: boldFontPath,
    fontName: 'Manrope Bold',
    width: 280,
    letterSpacing: 2.0
  });

  const category = await createTextLayer({
    text: 'WEBSITE STUDIO & DIGITAL ESTIMATOR',
    color: '#ee8859',
    fontSize: 13,
    fontFile: boldFontPath,
    fontName: 'Manrope Bold',
    width: 480,
    letterSpacing: 2.5
  });

  const titleLines = ['Partner Website Bisnis', 'dengan Standar', 'Desain Tinggi.'];
  const titleLayers = [];
  for (const line of titleLines) {
    titleLayers.push(await createTextLayer({
      text: line,
      color: line === 'Desain Tinggi.' ? '#ee8859' : '#f5f0e7',
      fontSize: 50,
      fontFile: boldFontPath,
      fontName: 'Manrope Bold',
      width: 630
    }));
  }

  const descText = 'Membangun website bisnis modern, cepat, & terpercaya. Dilengkapi Smart Estimator interaktif dan garansi maintenance.';
  const descLines = wrapText(descText, 45, 3);
  const descLayers = [];
  for (const line of descLines) {
    descLayers.push(await createTextLayer({
      text: line,
      color: '#b6aea3',
      fontSize: 17,
      fontFile: regularFontPath,
      fontName: 'Manrope',
      width: 610
    }));
  }

  // 4 Key Offerings Cards (2x2 Grid Pills on the Right side)
  const offers = [
    { title: 'ESTIMASI SEKETIKA', detail: 'Hitung Biaya 30–60 Detik', accent: '#ee8859' },
    { title: 'MAINTENANCE 6 BLN', detail: 'Garansi Technical Support', accent: '#f5f0e7' },
    { title: 'MONITORING 24/7', detail: 'Server & Keamanan Uptime', accent: '#f5f0e7' },
    { title: 'GRATIS DOMAIN', detail: 'Include .com / .my.id', accent: '#ee8859' }
  ];

  const offerLayers = [];
  for (const o of offers) {
    const titleL = await createTextLayer({
      text: o.title,
      color: o.accent,
      fontSize: 11,
      fontFile: boldFontPath,
      fontName: 'Manrope Bold',
      width: 320,
      letterSpacing: 1.5
    });
    const detailL = await createTextLayer({
      text: o.detail,
      color: '#f5f0e7',
      fontSize: 14,
      fontFile: boldFontPath,
      fontName: 'Manrope Bold',
      width: 320
    });
    offerLayers.push({ title: titleL, detail: detailL });
  }

  const backdrop = await sharp(heroImagePath)
    .resize(1200, 630, { fit: 'cover', position: 'right' })
    .modulate({ brightness: 0.35, saturation: 0.75 })
    .png()
    .toBuffer();

  const artwork = Buffer.from(`
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="darkBg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#12110f" stop-opacity="0.99"/>
          <stop offset="58%" stop-color="#181613" stop-opacity="0.94"/>
          <stop offset="100%" stop-color="#12110f" stop-opacity="0.75"/>
        </linearGradient>
        <radialGradient id="glowR" cx="85%" cy="25%" r="65%">
          <stop offset="0%" stop-color="#ee8859" stop-opacity="0.32"/>
          <stop offset="100%" stop-color="#12110f" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <rect width="1200" height="630" fill="url(#darkBg)"/>
      <rect width="1200" height="630" fill="url(#glowR)"/>

      <!-- Ambient Glass Outer Frame -->
      <rect x="44" y="44" width="1112" height="542" rx="24" fill="none" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1.5"/>

      <!-- Divider line -->
      <line x1="710" y1="110" x2="710" y2="520" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1.5" stroke-dasharray="6 6"/>

      <!-- Right Column: 4 Value Cards Containers -->
      <!-- Card 1 -->
      <rect x="740" y="130" width="370" height="85" rx="16" fill="#1b1916" fill-opacity="0.85" stroke="#ee8859" stroke-opacity="0.35" stroke-width="1.5"/>
      <!-- Card 2 -->
      <rect x="740" y="230" width="370" height="85" rx="16" fill="#1b1916" fill-opacity="0.85" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1.5"/>
      <!-- Card 3 -->
      <rect x="740" y="330" width="370" height="85" rx="16" fill="#1b1916" fill-opacity="0.85" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1.5"/>
      <!-- Card 4 -->
      <rect x="740" y="430" width="370" height="85" rx="16" fill="#1b1916" fill-opacity="0.85" stroke="#ee8859" stroke-opacity="0.35" stroke-width="1.5"/>
    </svg>
  `);

  const titleTop = 185;
  const descTop = titleTop + (titleLayers.length * 56) + 16;

  const composites = [
    { input: artwork },
    { input: logoMark, left: 74, top: 68 },
    { input: brand.data, left: 130, top: 72 },
    { input: category.data, left: 74, top: 140 },
    ...titleLayers.map((layer, index) => ({ input: layer.data, left: 74, top: titleTop + (index * 56) })),
    ...descLayers.map((layer, index) => ({ input: layer.data, left: 74, top: descTop + (index * 26) })),

    // Offer Card 1
    { input: offerLayers[0].title.data, left: 765, top: 148 },
    { input: offerLayers[0].detail.data, left: 765, top: 173 },
    // Offer Card 2
    { input: offerLayers[1].title.data, left: 765, top: 248 },
    { input: offerLayers[1].detail.data, left: 765, top: 273 },
    // Offer Card 3
    { input: offerLayers[2].title.data, left: 765, top: 348 },
    { input: offerLayers[2].detail.data, left: 765, top: 373 },
    // Offer Card 4
    { input: offerLayers[3].title.data, left: 765, top: 448 },
    { input: offerLayers[3].detail.data, left: 765, top: 473 }
  ];

  await sharp(backdrop)
    .composite(composites)
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toFile(defaultOutputFile);

  const metadata = await sharp(defaultOutputFile).metadata();
  if (metadata.width !== 1200 || metadata.height !== 630 || metadata.format !== 'png') {
    throw new Error('Social preview default tidak valid.');
  }

  const file = await stat(defaultOutputFile);
  if (file.size > 750_000) {
    throw new Error(`Social preview default terlalu besar (${file.size} byte)`);
  }

  return { size: file.size };
}

await mkdir(outputDirectory, { recursive: true });

if (!selectedSlug) {
  const scriptPath = fileURLToPath(import.meta.url);
  for (const project of projects) {
    const child = spawnSync(process.execPath, [scriptPath, `--project=${project.slug}`], {
      cwd: root,
      env: process.env,
      encoding: 'utf8'
    });
    if (child.stdout) process.stdout.write(child.stdout);
    if (child.status !== 0) {
      if (child.stderr) process.stderr.write(child.stderr);
      process.exit(child.status ?? 1);
    }
    const meaningfulWarnings = child.stderr
      ?.split(/\r?\n/)
      .filter((line) => (
        line.trim()
        && !line.includes('Fontconfig error: No writable cache directories')
        && !line.trimStart().startsWith('C:/')
      ))
      .join('\n');
    if (meaningfulWarnings) process.stderr.write(`${meaningfulWarnings}\n`);
  }
  const defaultPreview = await createDefaultPreview();
  console.log(`Social preview dibuat: gandiva-labs (${defaultPreview.size} byte)`);
} else {
  const project = projects.find((item) => item.slug === selectedSlug);
  if (!project) throw new Error(`Project social preview tidak dikenal: ${selectedSlug}`);
  const result = await createPreview(project);
  console.log(`Social preview dibuat: ${project.slug} (${result.size} byte)`);
}
