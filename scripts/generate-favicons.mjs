import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const scriptsDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptsDirectory, '..');
const publicDirectory = path.join(projectRoot, 'public');
const sourceMark = path.join(
  projectRoot,
  'src',
  'assets',
  'brand',
  'source',
  'gandiva-mark-light-source.png',
);

const backgroundColor = '#181612';
const pngSizes = [32, 48, 96, 180, 192, 512];
const generatedPngs = new Map();

await mkdir(publicDirectory, { recursive: true });

for (const size of pngSizes) {
  const cornerRadius = Math.round(size * 0.22);
  const markWidth = Math.round(size * 0.65);
  const background = Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" rx="${cornerRadius}" fill="${backgroundColor}" />
    </svg>`,
  );
  const mark = await sharp(sourceMark)
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .resize({ width: markWidth, withoutEnlargement: true })
    .png()
    .toBuffer();
  const markMetadata = await sharp(mark).metadata();

  const icon = await sharp(background)
    .composite([
      {
        input: mark,
        left: Math.round((size - markMetadata.width) / 2),
        top: Math.round((size - markMetadata.height) / 2),
      },
    ])
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();

  generatedPngs.set(size, icon);
}

const outputNames = new Map([
  [48, 'favicon-48.png'],
  [96, 'favicon-96.png'],
  [180, 'apple-touch-icon.png'],
  [192, 'favicon-192.png'],
  [512, 'favicon-512.png'],
]);

await Promise.all(
  [...outputNames].map(([size, filename]) =>
    writeFile(path.join(publicDirectory, filename), generatedPngs.get(size)),
  ),
);

// ICO files can contain PNG frames. Including both 32 px and 48 px keeps the
// conventional /favicon.ico fallback sharp in browser tabs and search surfaces.
const icoSizes = [32, 48];
const directorySize = 6 + icoSizes.length * 16;
let imageOffset = directorySize;
const header = Buffer.alloc(directorySize);

header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(icoSizes.length, 4);

icoSizes.forEach((size, index) => {
  const image = generatedPngs.get(size);
  const entryOffset = 6 + index * 16;

  header.writeUInt8(size, entryOffset);
  header.writeUInt8(size, entryOffset + 1);
  header.writeUInt8(0, entryOffset + 2);
  header.writeUInt8(0, entryOffset + 3);
  header.writeUInt16LE(1, entryOffset + 4);
  header.writeUInt16LE(32, entryOffset + 6);
  header.writeUInt32LE(image.length, entryOffset + 8);
  header.writeUInt32LE(imageOffset, entryOffset + 12);
  imageOffset += image.length;
});

await writeFile(
  path.join(publicDirectory, 'favicon.ico'),
  Buffer.concat([header, ...icoSizes.map((size) => generatedPngs.get(size))]),
);

console.log('Generated Gandiva Labs favicon package.');
