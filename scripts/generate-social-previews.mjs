import { mkdir, stat, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.cwd();
const outputDirectory = resolve(root, 'public/og');
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

  // Pango loads `fontfile` per render. Keep these operations sequential so
  // native font registration cannot race on Windows build runners.
  const brand = await createTextLayer({
    text: 'Gandiva Labs',
    color: '#f5f0e7',
    fontSize: 22,
    fontFile: boldFontPath,
    fontName: 'Manrope Bold',
    width: 360
  });
  const category = await createTextLayer({
    text: project.category.toUpperCase(),
    color: project.accent,
    fontSize: 15,
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
      fontSize: 47,
      fontFile: boldFontPath,
      fontName: 'Manrope Bold',
      width: 440
    }));
  }
  const summaryLayers = [];
  for (const line of summaryLines) {
    summaryLayers.push(await createTextLayer({
      text: line,
      color: '#bdb5aa',
      fontSize: 20,
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
          <stop offset="0" stop-color="#171511"/>
          <stop offset="0.58" stop-color="#211d18"/>
          <stop offset="1" stop-color="#2a211b"/>
        </linearGradient>
        <radialGradient id="glow">
          <stop offset="0" stop-color="${project.accent}" stop-opacity="0.36"/>
          <stop offset="1" stop-color="${project.accent}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#background)"/>
      <circle cx="1070" cy="60" r="390" fill="url(#glow)"/>
      <path d="M0 1H1200" stroke="${project.accent}" stroke-opacity="0.8" stroke-width="2"/>
      <rect x="526" y="108" width="634" height="410" rx="26" fill="#f5f0e7"/>
      <circle cx="556" cy="133" r="5" fill="#d6654f"/>
      <circle cx="575" cy="133" r="5" fill="#d1aa7c"/>
      <circle cx="594" cy="133" r="5" fill="#8fa586"/>
      <rect x="615" y="127" width="244" height="12" rx="6" fill="#ded5c7"/>
      <circle cx="62" cy="64" r="6" fill="${project.accent}"/>
      <rect x="62" y="557" width="54" height="2" fill="${project.accent}"/>
    </svg>
  `);

  const titleTop = 168;
  const summaryTop = titleTop + (titleLayers.length * 57) + 23;
  const textComposites = [
    ...titleLayers.map((layer, index) => ({
      input: layer.data,
      left: 62,
      top: titleTop + (index * 57)
    })),
    ...summaryLayers.map((layer, index) => ({
      input: layer.data,
      left: 62,
      top: summaryTop + (index * 31)
    }))
  ];

  await sharp(artwork)
    .composite([
      { input: roundedScreenshot, left: 546, top: 158 },
      { input: brand.data, left: 79, top: 50 },
      { input: category.data, left: 62, top: 130 },
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
} else {
  const project = projects.find((item) => item.slug === selectedSlug);
  if (!project) throw new Error(`Project social preview tidak dikenal: ${selectedSlug}`);
  const result = await createPreview(project);
  console.log(`Social preview dibuat: ${project.slug} (${result.size} byte)`);
}
