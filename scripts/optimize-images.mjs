import { existsSync, promises as fs } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';

const workspaceRoot = process.cwd();

async function readMetadata(filePath) {
  try {
    return await sharp(filePath).metadata();
  } catch {
    return null;
  }
}

async function isOutputFresh(outputPath, sourcePath) {
  try {
    const [outputStat, sourceStat] = await Promise.all([fs.stat(outputPath), fs.stat(sourcePath)]);
    return outputStat.mtimeMs >= sourceStat.mtimeMs;
  } catch {
    return false;
  }
}

async function optimizeImages() {
  console.log('🚀 Initiating Image Optimization...');

  const screenshots = [
    { path: 'src/assets/screenshots/ktia.webp', mobilePath: 'src/assets/screenshots/ktia-mobile.webp', quality: 78 },
    { path: 'src/assets/screenshots/mahakarya.webp', mobilePath: 'src/assets/screenshots/mahakarya-mobile.webp', quality: 78 },
    { path: 'src/assets/screenshots/wijaya.webp', mobilePath: 'src/assets/screenshots/wijaya-mobile.webp', quality: 78 },
    { path: 'src/assets/screenshots/shinyoung.webp', mobilePath: 'src/assets/screenshots/shinyoung-mobile.webp', quality: 78 },
    { path: 'src/assets/screenshots/nusamitra.webp', mobilePath: 'src/assets/screenshots/nusamitra-mobile.webp', quality: 78 },
    { path: 'src/assets/screenshots/sastro.webp', mobilePath: 'src/assets/screenshots/sastro-mobile.webp', quality: 78 },
  ];

  for (const img of screenshots) {
    const fullPath = resolve(workspaceRoot, img.path);
    const mobileFullPath = resolve(workspaceRoot, img.mobilePath);
    if (!existsSync(fullPath)) {
      console.warn(`File not found: ${fullPath}`);
      continue;
    }

    const inputBuffer = await fs.readFile(fullPath);
    const metadata = await sharp(inputBuffer).metadata();
    console.log(`Optimizing ${img.path}: Original ${metadata.width}x${metadata.height} (${(inputBuffer.length / 1024).toFixed(1)} KiB)`);

    // Desktop 960w variant (skip when already optimized to keep builds idempotent)
    if (metadata.format === 'webp' && (metadata.width ?? 0) <= 960) {
      console.log(`  ○ Skipping desktop ${img.path}: already optimized (${metadata.width}w webp).`);
    } else {
      const desktopBuffer = await sharp(inputBuffer)
        .resize({ width: 960, withoutEnlargement: true })
        .webp({ quality: img.quality, effort: 6 })
        .toBuffer();

      await fs.writeFile(fullPath, desktopBuffer);
      console.log(`  ✓ Updated desktop ${img.path}: 960w (${(desktopBuffer.length / 1024).toFixed(1)} KiB)`);
    }

    // Mobile 640w variant (regenerate only when missing, stale, or oversized)
    let mobileFresh = false;
    if (existsSync(mobileFullPath)) {
      const mobileMeta = await readMetadata(mobileFullPath);
      mobileFresh = mobileMeta?.format === 'webp'
        && (mobileMeta.width ?? 0) <= 640
        && await isOutputFresh(mobileFullPath, fullPath);
    }

    if (mobileFresh) {
      console.log(`  ○ Skipping mobile ${img.mobilePath}: output is newer than source.`);
    } else {
      const mobileBuffer = await sharp(inputBuffer)
        .resize({ width: 640, withoutEnlargement: true })
        .webp({ quality: img.quality, effort: 6 })
        .toBuffer();

      await fs.writeFile(mobileFullPath, mobileBuffer);
      console.log(`  ✓ Generated mobile ${img.mobilePath}: 640w (${(mobileBuffer.length / 1024).toFixed(1)} KiB)`);
    }
  }

  // Optimize logo mark in public
  const logos = [
    { path: 'public/gandiva-mark-light.webp', targetWidth: 120, quality: 85 },
    { path: 'public/gandiva-mark-dark.webp', targetWidth: 120, quality: 85 }
  ];

  for (const logo of logos) {
    const fullPath = resolve(workspaceRoot, logo.path);
    if (!existsSync(fullPath)) continue;

    const logoMeta = await readMetadata(fullPath);
    if (logoMeta?.format === 'webp' && (logoMeta.width ?? 0) <= logo.targetWidth) {
      console.log(`  ○ Skipping logo ${logo.path}: already optimized (${logoMeta.width}w webp).`);
      continue;
    }

    const inputBuffer = await fs.readFile(fullPath);
    const outputBuffer = await sharp(inputBuffer)
      .resize({ width: logo.targetWidth, withoutEnlargement: true })
      .webp({ quality: logo.quality, effort: 6 })
      .toBuffer();

    await fs.writeFile(fullPath, outputBuffer);
    console.log(`  ✓ Optimized logo ${logo.path} (${(outputBuffer.length / 1024).toFixed(1)} KiB)`);
  }

  console.log('✅ Image optimization complete.');
}

optimizeImages().catch((err) => {
  console.error('Error optimizing images:', err);
  process.exit(1);
});
