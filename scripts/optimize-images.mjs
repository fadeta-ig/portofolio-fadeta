import { existsSync, promises as fs } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';

const workspaceRoot = process.cwd();

async function optimizeImages() {
  console.log('🚀 Initiating Image Optimization...');

  const screenshots = [
    { path: 'src/assets/screenshots/ktia.webp', targetWidth: 960, quality: 78 },
    { path: 'src/assets/screenshots/mahakarya.webp', targetWidth: 960, quality: 78 },
    { path: 'src/assets/screenshots/wijaya.webp', targetWidth: 960, quality: 78 },
    { path: 'src/assets/screenshots/shinyoung.webp', targetWidth: 960, quality: 78 },
  ];

  for (const img of screenshots) {
    const fullPath = resolve(workspaceRoot, img.path);
    if (!existsSync(fullPath)) {
      console.warn(`File not found: ${fullPath}`);
      continue;
    }

    const inputBuffer = await fs.readFile(fullPath);
    const metadata = await sharp(inputBuffer).metadata();
    console.log(`Optimizing ${img.path}: Original ${metadata.width}x${metadata.height} (${(inputBuffer.length / 1024).toFixed(1)} KiB)`);

    const outputBuffer = await sharp(inputBuffer)
      .resize({ width: img.targetWidth, withoutEnlargement: true })
      .webp({ quality: img.quality, effort: 6 })
      .toBuffer();

    await fs.writeFile(fullPath, outputBuffer);
    const newMetadata = await sharp(outputBuffer).metadata();
    console.log(`  ✓ Updated ${img.path}: ${newMetadata.width}x${newMetadata.height} (${(outputBuffer.length / 1024).toFixed(1)} KiB)`);
  }

  // Optimize logo mark in public
  const logos = [
    { path: 'public/gandiva-mark-light.webp', targetWidth: 120, quality: 85 },
    { path: 'public/gandiva-mark-dark.webp', targetWidth: 120, quality: 85 }
  ];

  for (const logo of logos) {
    const fullPath = resolve(workspaceRoot, logo.path);
    if (!existsSync(fullPath)) continue;

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
