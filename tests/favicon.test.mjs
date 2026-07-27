import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import sharp from 'sharp';

const expectedIcons = new Map([
  ['public/favicon-48.png', 48],
  ['public/favicon-96.png', 96],
  ['public/apple-touch-icon.png', 180],
  ['public/favicon-192.png', 192],
  ['public/favicon-512.png', 512],
]);

test('favicon PNGs are square and match their declared sizes', async () => {
  for (const [filename, expectedSize] of expectedIcons) {
    const metadata = await sharp(filename).metadata();
    assert.equal(metadata.width, expectedSize, filename);
    assert.equal(metadata.height, expectedSize, filename);
    assert.equal(metadata.format, 'png', filename);
  }
});

test('home page declares browser, Apple, and manifest icons', async () => {
  const html = await readFile('index.html', 'utf8');

  assert.match(html, /rel="icon" href="\/favicon\.ico"/);
  assert.match(html, /rel="icon" type="image\/png" sizes="48x48" href="\/favicon-48\.png"/);
  assert.match(html, /rel="apple-touch-icon" sizes="180x180" href="\/apple-touch-icon\.png"/);
  assert.match(html, /rel="manifest" href="\/site\.webmanifest"/);
});
