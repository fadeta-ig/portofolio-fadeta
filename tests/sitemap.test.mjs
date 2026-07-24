import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildSitemap,
  collectCanonicalUrls,
  escapeXml,
  extractCanonical,
  isIndexable
} from '../scripts/sitemap-lib.mjs';

const origin = 'https://www.gandivalabs.my.id';

function page(path, { robots = 'index, follow', canonicalFirst = false } = {}) {
  const canonical = `${origin}${path}`;
  const canonicalTag = canonicalFirst
    ? `<link href="${canonical}" rel="canonical">`
    : `<link rel="canonical" href="${canonical}">`;
  return `<html><head>${canonicalTag}<meta name="robots" content="${robots}"></head></html>`;
}

test('parser sitemap membaca variasi canonical dan noindex', () => {
  assert.equal(extractCanonical(page('/portfolio')), `${origin}/portfolio`);
  assert.equal(extractCanonical(page('/privasi', { canonicalFirst: true })), `${origin}/privasi`);
  assert.equal(isIndexable(page('/terima-kasih', { robots: 'noindex, nofollow' })), false);
});

test('sitemap menghapus duplikasi, mengecualikan noindex, dan mengurutkan URL secara deterministik', () => {
  const urls = collectCanonicalUrls([
    { source: 'portfolio', html: page('/portfolio') },
    { source: 'home', html: page('/') },
    { source: 'duplicate', html: page('/portfolio') },
    { source: 'private', html: page('/terima-kasih', { robots: 'noindex' }) },
    { source: 'case-study', html: page('/hasil/shinyoung-beauty') }
  ], origin);

  assert.deepEqual(urls, [
    `${origin}/`,
    `${origin}/hasil/shinyoung-beauty`,
    `${origin}/portfolio`
  ]);

  const xml = buildSitemap(urls);
  assert.equal((xml.match(/<loc>/g) ?? []).length, 3);
  assert.ok(!xml.includes('terima-kasih'));
});

test('sitemap menolak canonical hilang dan origin eksternal', () => {
  assert.throws(
    () => collectCanonicalUrls([{ source: 'missing', html: '<html></html>' }], origin),
    /tidak memiliki canonical/
  );
  assert.throws(
    () => collectCanonicalUrls([{
      source: 'external',
      html: '<link rel="canonical" href="https://evil.example/page">'
    }], origin),
    /di luar origin produksi/
  );
});

test('XML escaping dan kondisi sitemap kosong aman', () => {
  assert.equal(escapeXml('a&b<c>"d"\''), 'a&amp;b&lt;c&gt;&quot;d&quot;&apos;');
  assert.throws(() => buildSitemap([]), /Tidak ada halaman publik/);
});
