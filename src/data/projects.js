import shinyoungImg from '../assets/screenshots/shinyoung.webp';
import mahakaryaImg from '../assets/screenshots/mahakarya.webp';
import wijayaImg from '../assets/screenshots/wijaya.webp';

export const featuredProjects = [
  {
    id: '01',
    slug: 'shinyoung-beauty',
    title: 'Shinyoung Beauty',
    type: 'Website Bisnis',
    category: 'E-commerce · Beauty',
    description: 'Toko online untuk brand kecantikan yang menyatukan katalog, halaman produk, akun pelanggan, dan alur belanja dalam satu website.',
    need: 'Brand membutuhkan kanal penjualan milik sendiri yang menyatukan penjelasan produk dan proses belanja dalam satu tempat.',
    approach: 'Struktur website disusun mengikuti perjalanan pelanggan: mengenal kategori, memeriksa detail produk, memilih item, lalu melanjutkan ke proses transaksi.',
    decisions: [
      { title: 'Katalog mudah dipindai', text: 'Kategori dan produk ditempatkan sebagai jalur utama agar pengunjung tidak harus membuka terlalu banyak halaman.' },
      { title: 'Detail sebelum transaksi', text: 'Informasi produk diberi ruang yang cukup sebelum pelanggan diarahkan ke keranjang dan checkout.' },
      { title: 'Pengelolaan terpusat', text: 'Produk, akun pelanggan, dan pesanan dikelola melalui satu sistem berbasis WooCommerce.' }
    ],
    result: 'Sebuah toko online publik yang menggabungkan katalog, halaman produk, akun pelanggan, keranjang, dan alur transaksi dalam satu website.',
    contribution: ['WordPress', 'WooCommerce', 'Custom AI plugin'],
    link: 'https://shinyoungbeauty.com/',
    image: shinyoungImg,
    width: 1902,
    height: 870
  },
  {
    id: '02',
    slug: 'mahakarya-kosmetika',
    title: 'Mahakarya Kosmetika',
    type: 'Website Bisnis',
    category: 'Company profile · B2B',
    description: 'Website perusahaan manufaktur kosmetik yang menata layanan, proses, kapabilitas, dan jalur konsultasi agar mudah dipahami calon mitra.',
    need: 'Sebagai bisnis B2B, perusahaan perlu menjelaskan layanan manufaktur, proses kerja, dan kapabilitasnya kepada calon mitra dalam struktur yang ringkas.',
    approach: 'Informasi disusun dari konteks perusahaan menuju layanan, proses, dan konsultasi agar calon mitra dapat menilai relevansi sebelum menghubungi tim.',
    decisions: [
      { title: 'Bahasa untuk calon mitra', text: 'Isi halaman berfokus pada kebutuhan orang yang sedang menilai partner manufaktur, bukan hanya riwayat perusahaan.' },
      { title: 'Kapabilitas terstruktur', text: 'Layanan dan proses dipisahkan dengan jelas agar pembaca mudah memahami ruang lingkup kerja.' },
      { title: 'Jalur konsultasi', text: 'Kontak ditempatkan sebagai kelanjutan dari informasi yang relevan, bukan ajakan yang muncul tanpa konteks.' }
    ],
    result: 'Website company profile B2B yang menampilkan profil perusahaan, layanan, proses, kapabilitas, dan jalur konsultasi dalam satu alur informasi.',
    contribution: ['Strategi halaman', 'WordPress', 'Pengembangan web'],
    link: 'https://mahakaryakosmetika.co.id/',
    image: mahakaryaImg,
    width: 1898,
    height: 866
  },
  {
    id: '03',
    slug: 'wijaya-inovasi',
    title: 'Wijaya Inovasi',
    type: 'Website Bisnis',
    category: 'Company profile · Manufaktur',
    description: 'Company profile untuk bisnis pengembangan produk herbal serta makanan dan minuman fungsional, dengan fokus pada layanan dan kredibilitas perusahaan.',
    need: 'Ragam layanan pengembangan produk perlu dijelaskan tanpa membuat calon klien kehilangan gambaran tentang peran dan fokus utama perusahaan.',
    approach: 'Konten dikelompokkan berdasarkan kebutuhan calon klien, lalu diperkuat dengan profil dan informasi perusahaan yang relevan untuk proses pertimbangan.',
    decisions: [
      { title: 'Proposisi lebih ringkas', text: 'Pesan utama merangkum peran perusahaan sebelum pembaca masuk ke jenis layanan yang tersedia.' },
      { title: 'Layanan dikelompokkan', text: 'Informasi herbal, makanan, dan minuman fungsional disusun agar tetap mudah dijelajahi.' },
      { title: 'Dasar pencarian organik', text: 'Judul, deskripsi, dan struktur halaman disiapkan sebagai fondasi SEO on-page dasar.' }
    ],
    result: 'Website company profile yang menyajikan profil, kelompok layanan pengembangan produk, dan informasi kontak dalam struktur yang dapat dikelola.',
    contribution: ['Arsitektur konten', 'WordPress', 'SEO on-page dasar'],
    link: 'https://wijayainovasi.co.id/',
    image: wijayaImg,
    width: 1896,
    height: 860
  }
];

export const labProjects = [
  {
    id: 'L01',
    title: 'Koi Farm',
    category: 'Katalog digital',
    type: 'Eksperimen',
    description: 'Eksplorasi katalog digital dengan tampilan yang fokus pada koleksi dan kemudahan menjelajah produk.',
    link: 'https://koifarm-six.vercel.app/'
  },
  {
    id: 'L02',
    title: 'RSLOV Digital Space',
    category: 'Aplikasi web',
    type: 'Eksperimen',
    description: 'Ruang digital eksperimental untuk menguji struktur aplikasi, interaksi, dan pengalaman penggunaan.',
    link: 'https://rspace-rho.vercel.app/'
  },
  {
    id: 'L03',
    title: 'Katalog Lelang',
    category: 'Platform interaktif',
    type: 'Eksperimen',
    description: 'Prototipe katalog interaktif yang menata banyak item agar tetap mudah dipindai dan ditemukan.',
    link: 'https://katalog-lelang-1.vercel.app/'
  },
  {
    id: 'L04',
    title: 'Kalender 2026',
    category: 'Web utility',
    type: 'Eksperimen',
    description: 'Utilitas web sederhana untuk melihat kalender dalam pengalaman yang ringan dan langsung digunakan.',
    link: 'https://kalender-2026.vercel.app/'
  }
];

export const privateProjects = [
  {
    id: 'P01',
    title: 'Sistem POS',
    category: 'Operasional retail',
    type: 'Sistem Internal',
    icon: 'store',
    description: 'Sistem operasional internal untuk membantu pencatatan transaksi, pengelolaan item, stok, dan ringkasan aktivitas toko.',
    contribution: ['Point of sale', 'Inventory', 'Reporting'],
    privacy: 'Karena digunakan dalam operasional klien, identitas, tampilan aplikasi, dan data di dalam sistem tidak ditampilkan ke publik.'
  },
  {
    id: 'P02',
    title: 'LMS + Safe Exam Browser',
    category: 'Pembelajaran & evaluasi',
    type: 'Sistem Internal',
    icon: 'education',
    description: 'Platform pembelajaran internal yang menggabungkan distribusi materi, kelas, evaluasi, dan alur ujian terintegrasi dengan Safe Exam Browser.',
    contribution: ['LMS', 'Assessment', 'Safe Exam Browser'],
    privacy: 'Identitas institusi, konfigurasi ujian, tampilan, dan akses sistem tidak dipublikasikan untuk menjaga kerahasiaan lingkungan belajar klien.'
  },
  {
    id: 'P03',
    title: 'Tracking Paket Warehouse',
    category: 'Operasional gudang',
    type: 'Sistem Internal',
    icon: 'warehouse',
    description: 'Sistem pelacakan paket internal gudang untuk memantau penerimaan, perpindahan, sortir, dan serah terima paket.',
    contribution: ['Warehouse flow', 'Package tracking', 'Internal dashboard'],
    privacy: 'Dashboard, identitas perusahaan, dan detail alur kerja disamarkan karena menjadi bagian dari proses operasional internal klien.'
  }
];
