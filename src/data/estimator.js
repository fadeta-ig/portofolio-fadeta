/**
 * Gandiva Labs — Smart Website Estimator Data Matrix & Calculation Engine
 * 
 * Defines website types, business goals, complexity levels, standard inclusions,
 * paid add-ons, pricing formulas, and WhatsApp consultation message generators.
 * Fully aligned with Gandiva Labs design system and typography standards.
 */

export const ESTIMATOR_VERSION = '1.0';
export const SITE_WHATSAPP_NUMBER = '6285183042220'; // Gandiva Labs official WhatsApp

/**
 * Standard Inclusions (GRATIS / Already included in base packages)
 */
export const STANDARD_INCLUSIONS = [
  { id: 'responsive', label: 'Responsive Design (HP, Tablet & Desktop)', badge: 'GRATIS' },
  { id: 'ssl', label: 'Keamanan SSL Certificate (HTTPS)', badge: 'GRATIS' },
  { id: 'seo-basic', label: 'Basic SEO & Indexing Google Search', badge: 'GRATIS' },
  { id: 'contact-wa', label: 'Integrasi Form Kontak & Tombol WhatsApp', badge: 'GRATIS' },
  { id: 'analytics-maps', label: 'Google Analytics 4 & Google Maps', badge: 'GRATIS' },
  { id: 'server-setup', label: 'Bantuan Setup Cloud Server & Hosting', badge: 'GRATIS' },
  { id: 'free-domain', label: 'Gratis Domain (.com / .my.id / .or.id)', badge: 'BONUS PROMO', highlight: true }
];

/**
 * Website Types & Base Price Tiers (in IDR)
 */
export const WEBSITE_TYPES = [
  {
    id: 'company-profile',
    title: 'Company Profile',
    shortDesc: 'Memperkenalkan bisnis, membangun kredibilitas, dan meraih calon pelanggan.',
    icon: 'Building2',
    basePrice: {
      starter: { min: 1800000, max: 2800000, weeks: '1–2' },
      professional: { min: 2800000, max: 4500000, weeks: '2–3' },
      advanced: { min: 4500000, max: 7500000, weeks: '3–4' }
    }
  },
  {
    id: 'landing-page',
    title: 'Landing Page',
    shortDesc: 'Halaman konversi khusus untuk promosi produk atau kampanye iklan.',
    icon: 'Sparkles',
    basePrice: {
      starter: { min: 750000, max: 1500000, weeks: '3–5 hari' },
      professional: { min: 1500000, max: 2800000, weeks: '1–2' },
      advanced: { min: 2800000, max: 4500000, weeks: '2' }
    }
  },
  {
    id: 'online-store',
    title: 'Toko Online (E-commerce)',
    shortDesc: 'Menampilkan katalog produk dan memproses penjualan secara digital.',
    icon: 'ShoppingBag',
    basePrice: {
      starter: { min: 3500000, max: 5500000, weeks: '2–3' },
      professional: { min: 5500000, max: 8500000, weeks: '3–4' },
      advanced: { min: 8500000, max: 15000000, weeks: '4–6' }
    }
  },
  {
    id: 'custom-website',
    title: 'Custom Website / Web App',
    shortDesc: 'Sistem khusus, portal bisnis, atau aplikasi web terintegrasi.',
    icon: 'Code2',
    basePrice: {
      starter: { min: 2000000, max: 4500000, weeks: '2–3' },
      professional: { min: 4500000, max: 9500000, weeks: '3–5' },
      advanced: { min: 9500000, max: 18000000, weeks: '4–8' }
    }
  },
  {
    id: 'belum-yakin',
    title: 'Belum Yakin',
    shortDesc: 'Rekomendasikan jenis website berdasarkan tujuan bisnis utama.',
    icon: 'HelpCircle',
    isFallback: true
  }
];

/**
 * Primary Business Goals
 */
export const BUSINESS_GOALS = [
  {
    id: 'kredibilitas',
    title: 'Membangun Kredibilitas',
    description: 'Menyajikan identitas bisnis yang profesional agar calon klien makin percaya.',
    recommendedType: 'company-profile'
  },
  {
    id: 'leads',
    title: 'Mendapatkan Leads & Inquiry',
    description: 'Mengubah pengunjung website menjadi calon pembeli aktif via WhatsApp atau Form.',
    recommendedType: 'landing-page'
  },
  {
    id: 'jual-produk',
    title: 'Menjual Produk Online',
    description: 'Menampilkan katalog terstruktur dan menerima transaksi pemesanan.',
    recommendedType: 'online-store'
  },
  {
    id: 'otomatisasi',
    title: 'Mengotomatisasi Bisnis',
    description: 'Membangun portal pelanggan, reservasi online, atau alur kerja digital.',
    recommendedType: 'custom-website'
  },
  {
    id: 'portfolio',
    title: 'Menampilkan Karya & Portfolio',
    description: 'Menyajikan rekam jejak proyek dan karya terbaik untuk calon klien.',
    recommendedType: 'company-profile'
  }
];

/**
 * Complexity Tiers
 */
export const COMPLEXITY_LEVELS = [
  {
    id: 'starter',
    title: 'Starter',
    pages: '3–5 Halaman',
    description: 'Website esensial untuk kebutuhan dasar bisnis yang siap tayang cepat.'
  },
  {
    id: 'professional',
    title: 'Professional',
    pages: '6–12 Halaman',
    description: 'Website bisnis lengkap dengan struktur halaman dan fitur terarah.'
  },
  {
    id: 'advanced',
    title: 'Advanced / Kompleks',
    pages: '12+ Halaman',
    description: 'Website skala luas dengan kebutuhan sistem dan arsitektur mendalam.'
  },
  {
    id: 'custom',
    title: 'Custom / Belum Tahu',
    pages: 'Perlu Konsultasi',
    description: 'Diskusi bersama tim kami untuk memetakan ruang lingkup yang tepat.'
  }
];

/**
 * Paid Add-on Features (Strictly 4 Options as requested)
 */
export const PAID_ADDONS = [
  {
    id: 'multilingual',
    title: 'Multi-bahasa (ID / EN)',
    price: 200000,
    priceFormatted: '+ Rp 200rb',
    description: 'Website mendukung dua bahasa (Bahasa Indonesia dan Bahasa Inggris).',
    icon: 'Globe'
  },
  {
    id: 'cms',
    title: 'CMS (Pengelolaan Konten Mandiri)',
    price: 250000,
    priceFormatted: '+ Rp 250rb',
    description: 'Kemudahan menambah atau mengedit artikel, produk, dan portofolio.',
    icon: 'FileText'
  },
  {
    id: 'live-chat',
    title: 'Live Chat & Multi-Admin WhatsApp',
    price: 200000,
    priceFormatted: '+ Rp 200rb',
    description: 'Widget pesan langsung dengan pembagian pesan ke beberapa admin.',
    icon: 'MessageSquare'
  },
  {
    id: 'loyalty',
    title: 'Sistem Loyalty & Poin Pelanggan',
    price: 500000,
    priceFormatted: '+ Rp 500rb',
    description: 'Fitur poin reward untuk mendorong repeat order dari pelanggan.',
    icon: 'Gift'
  }
];

/**
 * Detailed Mode Optional Questions
 */
export const DETAILED_QUESTIONS = [
  {
    id: 'contentReadiness',
    title: 'Apakah materi konten (teks & gambar) sudah siap?',
    options: [
      { id: 'ready', label: 'Sudah siap sepenuhnya' },
      { id: 'partial', label: 'Sebagian sudah ada' },
      { id: 'none', label: 'Belum ada (butuh bantuan)' }
    ]
  },
  {
    id: 'designPreference',
    title: 'Bagaimana dengan arah visual / desain website?',
    options: [
      { id: 'brand', label: 'Mengikuti panduan brand yang ada' },
      { id: 'custom', label: 'Butuh desain khusus dari nol' },
      { id: 'unsure', label: 'Belum tahu (butuh saran)' }
    ]
  },
  {
    id: 'integrationNeed',
    title: 'Apakah website perlu terhubung dengan sistem eksternal?',
    options: [
      { id: 'no', label: 'Tidak perlu' },
      { id: 'yes', label: 'Ya (misal: CRM / Payment / API)' },
      { id: 'unsure', label: 'Belum yakin' }
    ]
  },
  {
    id: 'timelineUrgency',
    title: 'Kapan target website harus siap diluncurkan?',
    options: [
      { id: 'flexible', label: 'Fleksibel (alur normal)' },
      { id: 'month', label: 'Dalam 1 bulan ke depan' },
      { id: 'fast', label: 'Secepatnya (2–3 minggu)' }
    ]
  }
];

/**
 * Core Pricing Engine Calculation
 */
export function calculateEstimate(selections = {}) {
  const {
    websiteType: selectedTypeId = 'company-profile',
    businessGoal: selectedGoalId = 'kredibilitas',
    complexity: selectedComplexityId = 'professional',
    selectedAddons = [],
    detailedAnswers = {}
  } = selections;

  let activeTypeId = selectedTypeId;
  if (activeTypeId === 'belum-yakin') {
    const matchedGoal = BUSINESS_GOALS.find((g) => g.id === selectedGoalId);
    activeTypeId = matchedGoal ? matchedGoal.recommendedType : 'company-profile';
  }

  const typeConfig = WEBSITE_TYPES.find((t) => t.id === activeTypeId) || WEBSITE_TYPES[0];
  const goalConfig = BUSINESS_GOALS.find((g) => g.id === selectedGoalId) || BUSINESS_GOALS[0];

  let activeComplexity = selectedComplexityId;
  if (activeComplexity === 'custom') {
    activeComplexity = 'professional';
  }

  const baseTier = typeConfig.basePrice?.[activeComplexity] || typeConfig.basePrice?.professional || { min: 1800000, max: 2800000, weeks: '1–2' };

  let addonsMinSum = 0;
  let addonsMaxSum = 0;
  const activeAddonObjects = [];

  selectedAddons.forEach((addonId) => {
    const addon = PAID_ADDONS.find((a) => a.id === addonId);
    if (addon) {
      addonsMinSum += addon.price;
      addonsMaxSum += addon.price;
      activeAddonObjects.push(addon);
    }
  });

  let timelineAdjustNote = '';
  if (detailedAnswers.timelineUrgency === 'fast') {
    timelineAdjustNote = 'Prioritas Pengerjaan Cepat';
  }

  const estimatedMin = baseTier.min + addonsMinSum;
  const estimatedMax = baseTier.max + addonsMaxSum;
  const estimatedWeeks = baseTier.weeks;

  const isCustomTriggered = selectedComplexityId === 'custom' || activeTypeId === 'custom-website';

  let rationale = `Berdasarkan tujuan utama untuk "${goalConfig.title.toLowerCase()}", rekomendasi paket ${typeConfig.title} tier ${activeComplexity.toUpperCase()} ini paling efektif memberikan hasil optimal dengan investasi terukur.`;

  if (activeAddonObjects.length > 0) {
    rationale += ` Dilengkapi dengan ${activeAddonObjects.length} fitur tambahan pilihan Anda.`;
  }

  return {
    websiteType: typeConfig,
    resolvedTypeId: activeTypeId,
    businessGoal: goalConfig,
    complexity: activeComplexity,
    rawComplexity: selectedComplexityId,
    isCustomTriggered,
    estimatedMin,
    estimatedMax,
    priceFormatted: formatPriceRange(estimatedMin, estimatedMax, isCustomTriggered),
    estimatedWeeks,
    timelineText: `${estimatedWeeks} minggu${timelineAdjustNote ? ` (${timelineAdjustNote})` : ''}`,
    selectedAddons: activeAddonObjects,
    rationale,
    inclusions: STANDARD_INCLUSIONS
  };
}

/**
 * Format currency range into human-readable Indonesian Rupiah
 */
export function formatPriceRange(min, max, isCustom = false) {
  if (isCustom) {
    const minFormatted = formatRupiahShort(min);
    return `Mulai dari ${minFormatted}`;
  }

  const minFormatted = formatRupiahShort(min);
  const maxFormatted = formatRupiahShort(max);

  if (minFormatted === maxFormatted) {
    return minFormatted;
  }

  if (minFormatted.startsWith('Rp ') && minFormatted.endsWith(' juta') &&
      maxFormatted.startsWith('Rp ') && maxFormatted.endsWith(' juta')) {
    const cleanMin = minFormatted.replace('Rp ', '').replace(' juta', '');
    const cleanMax = maxFormatted.replace('Rp ', '');
    return `Rp ${cleanMin} – ${cleanMax}`;
  }

  if (minFormatted.startsWith('Rp ') && maxFormatted.startsWith('Rp ')) {
    return `Rp ${minFormatted.replace('Rp ', '')} – ${maxFormatted.replace('Rp ', '')}`;
  }

  return `${minFormatted} – ${maxFormatted}`;
}

function formatRupiahShort(amount) {
  if (amount >= 1000000000) {
    const milyar = (amount / 1000000000).toFixed(1).replace('.0', '');
    return `Rp ${milyar} miliar`;
  }
  if (amount >= 1000000) {
    const juta = (amount / 1000000).toFixed(1).replace('.0', '');
    return `Rp ${juta} juta`;
  }
  if (amount >= 1000) {
    const ribu = Math.round(amount / 1000);
    return `Rp ${ribu}rb`;
  }
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

/**
 * Generate encoded WhatsApp URL without emojis
 */
export function generateWhatsAppUrl(result, customNote = '') {
  const {
    websiteType,
    businessGoal,
    complexity,
    priceFormatted,
    timelineText,
    selectedAddons = []
  } = result;

  const addonsList = selectedAddons.length > 0
    ? selectedAddons.map((a) => `- ${a.title} (${a.priceFormatted})`).join('\n')
    : '- Tidak ada (Paket standar)';

  const textPayload = [
    'Halo Gandiva Labs,',
    '',
    'Saya baru saja menggunakan Smart Website Estimator di website Anda dan ingin berkonsultasi mengenai proyek ini:',
    '',
    `[ ringkasan proyek ]`,
    `Jenis Website      : ${websiteType.title}`,
    `Tujuan Utama       : ${businessGoal.title}`,
    `Skala Kebutuhan    : Tier ${complexity.toUpperCase()}`,
    `Estimasi Investasi : ${priceFormatted}`,
    `Estimasi Waktu     : ${timelineText}`,
    'Bonus Promo        : Gratis Domain (.com / .my.id)',
    '',
    '[ fitur add-on ]',
    addonsList,
    customNote ? `\n[ catatan tambahan ]\n${customNote}` : '',
    '',
    'Saya ingin mendiskusikan kebutuhan proyek ini lebih lanjut dengan tim Gandiva Labs. Terima kasih.'
  ].filter(Boolean).join('\n');

  return `https://wa.me/${SITE_WHATSAPP_NUMBER}?text=${encodeURIComponent(textPayload)}`;
}

/**
 * Format raw text for Clipboard Copy action without emojis
 */
export function formatSummaryText(result) {
  const {
    websiteType,
    businessGoal,
    complexity,
    priceFormatted,
    timelineText,
    selectedAddons = []
  } = result;

  const addonsList = selectedAddons.length > 0
    ? selectedAddons.map((a) => `- ${a.title} (${a.priceFormatted})`).join('\n')
    : '- Tidak ada (Paket Standar)';

  return [
    'Gandiva Labs — Estimasi Website',
    '----------------------------------------',
    `Jenis Website      : ${websiteType.title}`,
    `Tujuan Utama       : ${businessGoal.title}`,
    `Skala Kebutuhan    : Tier ${complexity.toUpperCase()}`,
    `Estimasi Investasi : ${priceFormatted}`,
    `Estimasi Pengerjaan: ${timelineText}`,
    'Bonus Promo        : Gratis Domain (.com / .my.id)',
    '',
    'Fitur Standar Gratis:',
    '- Responsive Design (HP & Desktop)',
    '- Keamanan SSL Certificate (HTTPS)',
    '- Basic SEO & Indexing Google Search',
    '- Integrasi WhatsApp & Form Kontak',
    '- Google Analytics 4 & Google Maps',
    '- Bantuan Setup Cloud Server & Hosting',
    '',
    'Fitur Add-On Pilihan:',
    addonsList,
    '',
    'Catatan:',
    'Estimasi awal transparan berdasarkan preferensi Anda. Harga final dikonfirmasi setelah sesi diskusi detail.',
    'Tautan: https://www.gandivalabs.my.id/kalkulator-website'
  ].join('\n');
}
