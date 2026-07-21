export const services = [
  {
    number: '01',
    slug: 'company-profile',
    name: 'Company Profile',
    problem: 'Bisnis sudah berjalan, tetapi penjelasannya belum terasa meyakinkan.',
    summary: 'Website utama yang membantu calon klien memahami profil, layanan, bukti, dan cara menghubungi bisnis Anda.',
    intro: 'Company profile cocok ketika informasi bisnis tersebar di banyak tempat atau tim masih harus menjelaskan hal yang sama berulang kali. Fokusnya bukan memenuhi halaman, melainkan menyusun informasi yang memang dibutuhkan calon klien.',
    fits: [
      'Bisnis belum memiliki website resmi.',
      'Website lama tidak lagi mencerminkan layanan atau posisi bisnis saat ini.',
      'Calon klien sering meminta profil, portofolio, atau penjelasan layanan yang sama.',
      'Tim membutuhkan rujukan resmi yang mudah dibagikan.'
    ],
    approach: [
      { title: 'Menentukan pesan utama', text: 'Merangkum siapa bisnis Anda, siapa yang dilayani, dan alasan yang relevan untuk mempertimbangkannya.' },
      { title: 'Menyusun alur informasi', text: 'Menempatkan layanan, bukti, proses, dan kontak dalam urutan yang mudah diikuti.' },
      { title: 'Membuat jalur tindakan', text: 'Menghubungkan setiap halaman ke langkah berikutnya tanpa CTA yang berlebihan.' }
    ],
    scope: ['Arsitektur halaman', 'Copy dasar', 'Desain responsif', 'Pengembangan website', 'SEO on-page dasar', 'Form atau tombol kontak'],
    scale: 'Strukturnya dapat disiapkan untuk penambahan studi kasus, artikel, layanan baru, atau halaman lokasi saat bisnis membutuhkannya.',
    seoTitle: 'Jasa Website Company Profile | Gandiva Labs',
    seoDescription: 'Website company profile yang menyusun profil, layanan, bukti, dan jalur kontak agar bisnis lebih mudah dipahami calon klien.'
  },
  {
    number: '02',
    slug: 'landing-page',
    name: 'Landing Page',
    problem: 'Kampanye sudah berjalan, tetapi pesannya belum fokus pada satu tindakan.',
    summary: 'Halaman terarah untuk menjelaskan satu penawaran dan membantu pengunjung mengambil langkah yang relevan.',
    intro: 'Landing page berguna ketika satu produk, layanan, atau kampanye membutuhkan penjelasan khusus. Kontennya dibuat ringkas, tetapi tetap memberi konteks yang cukup agar pengunjung tidak diminta bertindak terlalu cepat.',
    fits: [
      'Iklan membutuhkan halaman tujuan yang lebih relevan.',
      'Satu layanan penting tenggelam di website utama.',
      'Bisnis ingin menguji penawaran atau pesan baru.',
      'Pendaftaran, konsultasi, atau peluncuran membutuhkan alur khusus.'
    ],
    approach: [
      { title: 'Memilih satu tujuan', text: 'Menetapkan tindakan utama agar isi halaman tidak menarik pengunjung ke terlalu banyak arah.' },
      { title: 'Menjawab keraguan penting', text: 'Menyusun manfaat, konteks, bukti, dan pertanyaan umum sesuai keputusan yang akan diambil pengunjung.' },
      { title: 'Menyiapkan pengukuran', text: 'Menandai interaksi penting agar keputusan berikutnya dapat melihat data, bukan asumsi saja.' }
    ],
    scope: ['Strategi satu halaman', 'Copy terarah', 'Desain responsif', 'Form atau CTA', 'Analytics dasar', 'SEO on-page dasar'],
    scale: 'Setelah tayang, pesan dan bagian halaman dapat disesuaikan berdasarkan sumber trafik, pertanyaan calon pelanggan, dan data interaksi yang tersedia.',
    seoTitle: 'Jasa Landing Page untuk Bisnis | Gandiva Labs',
    seoDescription: 'Landing page yang fokus pada satu penawaran, menjawab keraguan penting, dan mengarahkan pengunjung ke tindakan yang relevan.'
  },
  {
    number: '03',
    slug: 'toko-online',
    name: 'Toko Online',
    problem: 'Produk tersedia, tetapi proses memilih dan membelinya masih bergantung pada chat manual.',
    summary: 'Katalog dan alur belanja yang membantu pelanggan menemukan produk, memahami detailnya, lalu menyelesaikan pesanan.',
    intro: 'Toko online bukan sekadar katalog yang diberi tombol beli. Struktur kategori, informasi produk, metode pembayaran, pengiriman, dan cara mengelolanya perlu disesuaikan dengan operasi bisnis.',
    fits: [
      'Pesanan masih dicatat satu per satu melalui chat.',
      'Pelanggan kesulitan melihat variasi atau informasi produk.',
      'Brand ingin memiliki kanal penjualan yang dikelola sendiri.',
      'Tim memerlukan katalog yang dapat diperbarui tanpa mengubah kode.'
    ],
    approach: [
      { title: 'Memetakan cara orang memilih', text: 'Mengatur kategori, filter, variasi, dan detail yang membantu pelanggan membandingkan produk.' },
      { title: 'Menyederhanakan alur pesanan', text: 'Menyesuaikan keranjang, checkout, pembayaran, dan pengiriman dengan proses bisnis yang nyata.' },
      { title: 'Menyiapkan pengelolaan', text: 'Memastikan produk, stok, pesanan, dan konten dapat dikelola setelah website diserahkan.' }
    ],
    scope: ['Katalog dan kategori', 'Halaman produk', 'Keranjang dan checkout', 'Integrasi pembayaran/pengiriman sesuai scope', 'Akun pelanggan bila diperlukan', 'Pelatihan pengelolaan dasar'],
    scale: 'Fitur tambahan seperti promosi, integrasi operasional, laporan, atau otomatisasi diprioritaskan setelah alur jual-beli intinya stabil.',
    seoTitle: 'Jasa Pembuatan Toko Online | Gandiva Labs',
    seoDescription: 'Toko online dengan katalog, informasi produk, dan alur checkout yang disusun mengikuti kebutuhan pelanggan dan operasi bisnis.'
  },
  {
    number: '04',
    slug: 'website-custom',
    name: 'Website Custom',
    problem: 'Proses bisnis mulai rumit dan kebutuhan utamanya tidak cukup ditangani template.',
    summary: 'Website atau sistem berbasis web yang dibangun mengikuti alur kerja, peran pengguna, dan kebutuhan pengelolaan tertentu.',
    intro: 'Pengembangan custom dipilih ketika ada proses spesifik yang perlu dipindahkan, dirapikan, atau dihubungkan. Sebelum membangun fitur, alurnya dipetakan agar sistem tidak sekadar menyalin kerumitan lama ke layar baru.',
    fits: [
      'Ada proses berulang yang masih bergantung pada spreadsheet atau chat.',
      'Pengguna memiliki peran dan hak akses yang berbeda.',
      'Data perlu dicatat, dicari, atau dilaporkan dalam satu tempat.',
      'Website lama membutuhkan fitur yang tidak tersedia secara standar.'
    ],
    approach: [
      { title: 'Memahami alur kerja', text: 'Mencatat pelaku, langkah, data, dan pengecualian sebelum menentukan bentuk sistem.' },
      { title: 'Membatasi versi pertama', text: 'Memprioritaskan fungsi inti agar implementasi dapat diuji tanpa membawa semua ide sekaligus.' },
      { title: 'Menyiapkan pengembangan lanjut', text: 'Menyusun struktur fitur dan data agar penambahan berikutnya tetap terarah.' }
    ],
    scope: ['Pemetaan kebutuhan', 'Arsitektur fitur', 'Desain antarmuka', 'Pengembangan dan pengujian', 'Dokumentasi penggunaan dasar', 'Dukungan pascatayang sesuai kesepakatan'],
    scale: 'Pengembangan dilakukan bertahap. Fitur berikutnya dipilih berdasarkan penggunaan nyata, kebutuhan operasional, dan prioritas bisnis.',
    seoTitle: 'Jasa Website Custom & Sistem Web | Gandiva Labs',
    seoDescription: 'Website custom dan sistem berbasis web yang disusun dari alur kerja nyata, prioritas fitur, serta kebutuhan pengelolaan bisnis.'
  }
];

export function findService(slug) {
  return services.find((service) => service.slug === slug);
}
