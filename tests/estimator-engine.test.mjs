import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateEstimate,
  formatPriceRange,
  generateWhatsAppUrl,
  formatSummaryText,
  WEBSITE_TYPES,
  BUSINESS_GOALS,
  PAID_ADDONS
} from '../src/data/estimator.js';

test('calculateEstimate defaults to company-profile and professional tier', () => {
  const result = calculateEstimate();
  assert.equal(result.websiteType.id, 'company-profile');
  assert.equal(result.complexity, 'professional');
  assert.equal(result.estimatedMin, 2800000);
  assert.equal(result.estimatedMax, 4500000);
  assert.equal(result.priceFormatted, 'Rp 2.8 – 4.5 juta');
});

test('calculateEstimate handles Landing Page starter tier correctly', () => {
  const result = calculateEstimate({
    websiteType: 'landing-page',
    businessGoal: 'leads',
    complexity: 'starter'
  });
  assert.equal(result.websiteType.id, 'landing-page');
  assert.equal(result.complexity, 'starter');
  assert.equal(result.estimatedMin, 750000);
  assert.equal(result.estimatedMax, 1500000);
  assert.equal(result.priceFormatted, 'Rp 750rb – 1.5 juta');
});

test('calculateEstimate adds paid add-on prices correctly', () => {
  // Add Multilingual (200k) + CMS (250k) = +450k
  const result = calculateEstimate({
    websiteType: 'company-profile',
    complexity: 'starter', // base 1.8M - 2.8M
    selectedAddons: ['multilingual', 'cms']
  });

  assert.equal(result.selectedAddons.length, 2);
  assert.equal(result.estimatedMin, 1800000 + 450000); // 2.25M
  assert.equal(result.estimatedMax, 2800000 + 450000); // 3.25M
  assert.equal(result.priceFormatted, 'Rp 2.3 – 3.3 juta');
});

test('calculateEstimate resolves "belum-yakin" using business goal recommendation', () => {
  const result = calculateEstimate({
    websiteType: 'belum-yakin',
    businessGoal: 'jual-produk',
    complexity: 'starter'
  });

  assert.equal(result.resolvedTypeId, 'online-store');
  assert.equal(result.websiteType.id, 'online-store');
  assert.equal(result.estimatedMin, 3500000);
  assert.equal(result.estimatedMax, 5500000);
});

test('generateWhatsAppUrl outputs valid encoded WhatsApp link', () => {
  const result = calculateEstimate({
    websiteType: 'company-profile',
    selectedAddons: ['multilingual']
  });

  const url = generateWhatsAppUrl(result, 'Tolong beri diskon');
  assert.match(url, /^https:\/\/wa\.me\/6285117148742\?text=/);
  assert.ok(url.includes(encodeURIComponent('Company Profile')));
  assert.ok(url.includes(encodeURIComponent('Multi-bahasa')));
  assert.ok(url.includes(encodeURIComponent('Tolong beri diskon')));
});

test('formatSummaryText formats clean text for clipboard copy', () => {
  const result = calculateEstimate({
    websiteType: 'custom-website',
    complexity: 'starter'
  });

  const summary = formatSummaryText(result);
  assert.ok(summary.includes('Gandiva Labs — Estimasi Website'));
  assert.ok(summary.includes('Custom Website / Web App'));
  assert.ok(summary.includes('Gratis Domain (.com / .my.id)'));
});

test('formatPriceRange renders human readable Rupiah strings', () => {
  assert.equal(formatPriceRange(750000, 1500000), 'Rp 750rb – 1.5 juta');
  assert.equal(formatPriceRange(1800000, 2800000), 'Rp 1.8 – 2.8 juta');
  assert.equal(formatPriceRange(5000000, 5000000), 'Rp 5 juta');
  assert.equal(formatPriceRange(2000000, 4500000, true), 'Mulai dari Rp 2 juta');
});
