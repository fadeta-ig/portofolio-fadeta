# Audit, Strategi, dan Arah Bisnis Gandiva Labs

Tanggal audit: 13 Juli 2026  
Status: implementasi fase pertama selesai

## Ringkasan eksekutif

`[VERIFIED]` Website sebelumnya berfungsi sebagai portofolio pribadi Fadeta Ilhan Gandhi dengan penekanan pada riwayat pendidikan, persentase skill, sertifikasi, proyek web, dan infrastruktur. Struktur tersebut cukup untuk memperkenalkan profil profesional, tetapi belum menjelaskan produk jasa yang dapat dibeli, target pelanggan, proses kerja, atau alasan bisnis untuk menghubungi.

`[HIGH CONFIDENCE]` Arah yang paling masuk akal adalah memosisikan Gandiva Labs sebagai studio pembuatan website yang berfokus pada kebutuhan bisnis, bukan sebagai agensi serba bisa. Dasarnya adalah tiga proyek komersial yang sudah ada pada sektor beauty, manufaktur kosmetik, serta manufaktur herbal/makanan dan minuman fungsional.

`[VERIFIED]` Fase pertama redesign sudah mengubah website menjadi funnel bisnis dengan urutan: proposisi nilai, segmen yang dilayani, masalah pelanggan, layanan, karya, proses, profil studio, FAQ, dan CTA WhatsApp.

## Metodologi dan sumber bukti

Audit dilakukan melalui:

1. Pembacaan seluruh source code aktif, data proyek, aset, dependency, metadata, dan struktur build.
2. Pemeriksaan visual pada viewport desktop 1.440 × 900 px dan mobile 390 × 844 px.
3. Pengujian menu mobile, penutupan dengan tombol Escape, tema terang/gelap, FAQ, anchor navigation, serta console browser.
4. Pemeriksaan build produksi dan dependency security audit.
5. Pemeriksaan URL proyek komersial dan proyek eksperimen pada 13 Juli 2026.
6. Cross-reference terhadap kerangka dan standar berikut:
   - [ISO 9241-210:2019](https://www.iso.org/cms/%20render/live/en/sites/isoorg/contents/data/standard/07/75/77520.html?browse=tc) untuk pendekatan human-centred design.
   - [Strategyzer Value Proposition Canvas](https://www.strategyzer.com/library/the-value-proposition-canvas) untuk pemetaan customer jobs, pains, dan gains.
   - [WCAG 2.2](https://www.w3.org/TR/WCAG22/) untuk aksesibilitas dasar.
   - [Google Web Vitals](https://web.dev/articles/vitals) untuk acuan performa.
   - [Google Search Central](https://developers.google.com/search/docs/appearance/snippet) untuk metadata deskriptif.

## Audit kondisi awal

| Area | Temuan | Status | Dampak bisnis |
|---|---|---:|---|
| Identitas | Judul, logo, hero, footer, dan metadata masih memakai nama pribadi | `[VERIFIED]` | Brand Gandiva Labs belum terbentuk |
| Positioning | Hero menggabungkan network engineer, IT infrastructure, dan web developer | `[VERIFIED]` | Penawaran jasa web tidak menjadi fokus utama |
| Target pasar | Tidak ada penjelasan siapa yang cocok menjadi klien | `[VERIFIED]` | Pengunjung sulit menilai relevansi |
| Penawaran | Tidak ada paket kategori layanan yang bisa dipahami sebagai produk | `[VERIFIED]` | Percakapan penjualan dimulai tanpa konteks |
| Copy | Copy lebih banyak menjelaskan kompetensi pemilik daripada hasil yang dicari pelanggan | `[VERIFIED]` | Manfaat bisnis kurang terlihat |
| CTA | CTA utama berpindah antara karya, CV, resume, dan kontak | `[VERIFIED]` | Tujuan konversi terpecah |
| Karya | Tujuh proyek ditampilkan dengan sticky stacking yang membuat halaman sangat panjang | `[VERIFIED]` | Bukti kerja ada, tetapi sulit dipindai cepat |
| Kredibilitas | Skill memakai persentase 75–95% tanpa metodologi pengukuran | `[VERIFIED]` | Klaim sulit diverifikasi dan kurang relevan untuk pembeli |
| SEO | Title dan description memosisikan portofolio pribadi | `[VERIFIED]` | Tidak sesuai intent jasa pembuatan website |
| Performa | Build awal mengeluarkan tujuh PNG portofolio dengan total 8.113,66 kB | `[VERIFIED]` | Payload deployment besar, walau sebagian gambar memakai lazy loading |
| Dependency | Audit menemukan advisory pada Vite 7.3.1 sebelum upgrade | `[VERIFIED]` | Risiko terutama berada pada development server |

## Strategi bisnis yang dipakai

### Target audiens

- `[ESTIMATED]` Utama: pemilik bisnis lokal, brand, tim marketing, dan perusahaan B2B yang perlu company profile, landing page, atau toko online.
- `[ESTIMATED]` Prioritas awal: beauty, manufaktur, bisnis jasa, dan UKM berkembang karena paling dekat dengan bukti kerja yang tersedia.
- `[ESTIMATED]` Sekunder: bisnis yang sudah punya website tetapi perlu redesign, perapian struktur, atau maintenance.

Asumsi target ini perlu divalidasi dari data lead nyata. Belum ada analytics, CRM, atau riwayat penjualan terstruktur di repository.

### Positioning

> Gandiva Labs membantu bisnis membuat website yang mudah dipahami, terlihat profesional, dan punya arah tindakan yang jelas.

Positioning sengaja tidak memakai klaim seperti “meningkatkan penjualan” atau “menaikkan conversion rate” karena belum ada data before/after klien yang mendukung klaim tersebut.

### Tujuan website

1. Menghasilkan percakapan WhatsApp dari calon klien yang relevan.
2. Membantu pengunjung memilih kategori layanan.
3. Membangun kepercayaan melalui karya komersial yang dapat dikunjungi.
4. Mengurangi pertanyaan berulang melalui penjelasan proses dan FAQ.

### Arsitektur penawaran

1. **Company Profile** — untuk membangun kejelasan dan kredibilitas bisnis.
2. **Landing Page** — untuk kampanye, produk, atau layanan khusus.
3. **Toko Online** — untuk katalog dan alur penjualan milik brand sendiri.
4. **Web Custom & Care** — untuk fitur khusus, redesign, dan maintenance opsional.

Harga tidak ditampilkan karena repository tidak memuat data biaya, margin, kapasitas, atau aturan revisi. Membuat angka tanpa data tersebut akan berisiko salah secara bisnis.

### Funnel konten

1. **Relevansi:** hero menjelaskan manfaat utama.
2. **Kecocokan:** strip audiens membantu pengunjung mengenali dirinya.
3. **Masalah:** menjelaskan kenapa kejelasan, kredibilitas, dan CTA penting.
4. **Solusi:** layanan dikelompokkan berdasarkan kebutuhan.
5. **Bukti:** tiga proyek komersial menjadi karya utama.
6. **Pengurangan risiko:** proses, profil teknis, dan FAQ menjawab keraguan.
7. **Konversi:** CTA WhatsApp memakai pesan awal yang sudah terisi.

### KPI yang disarankan

Belum ada target angka karena belum tersedia baseline. Setelah analytics dipasang, pantau:

- Klik CTA WhatsApp per sumber CTA.
- Persentase pengunjung yang mencapai section karya dan kontak.
- Jumlah percakapan yang memenuhi kriteria calon klien.
- Rasio lead menjadi proposal.
- Rasio proposal menjadi proyek.
- Nilai proyek rata-rata dan waktu penutupan.

Semua CTA utama sudah memiliki atribut `data-track` agar event dapat dipasang setelah platform analytics dipilih.

## Perubahan yang sudah diterapkan

### Brand dan copy

- Mengganti identitas menjadi Gandiva Labs pada title, metadata, navbar, isi halaman, footer, dan README.
- Memakai aset logo resmi versi terang dan gelap yang tersedia di folder `public` pada saat audit.
- Menyimpan source logo resolusi tinggi di `src/assets/brand/source` dan membuat versi WebP ringan untuk website.
- Mengubah headline dari profil personal menjadi proposisi nilai yang berorientasi bisnis.
- Menghapus persentase skill dan CV dari funnel utama.
- Menambahkan kategori layanan, proses kerja, prinsip studio, FAQ, serta CTA WhatsApp dengan pesan terisi.

### Struktur dan UX

- Mengganti sticky portfolio dengan tiga case study yang dapat dipindai cepat.
- Mempertahankan empat proyek eksperimen sebagai link ringkas tanpa mengganggu fokus komersial.
- Menambahkan mobile drawer dengan status `aria-expanded`, body scroll lock, overlay, dan dukungan tombol Escape.
- Mempertahankan light/dark mode dan mengganti storage key menjadi `gandiva-theme`.
- Menggunakan target interaksi utama minimal 44 px pada navigasi dan CTA. Ini mendukung aksesibilitas, tetapi bukan klaim kepatuhan WCAG penuh.

### SEO dan performa

- Mengganti title, meta description, author, robots, theme color, dan Open Graph dasar.
- Menggunakan alt text, width, height, lazy loading, dan async decoding pada gambar karya.
- Mengubah tiga screenshot komersial dari PNG menjadi WebP.
- Mengurangi aset gambar portofolio yang dihasilkan build dari 8.113,66 kB menjadi 213,28 kB; selisih 7.900,38 kB atau 97,37% setelah dibulatkan ke dua desimal.
- Mengurangi JavaScript build dari 255,95 kB menjadi 230,74 kB; selisih 25,21 kB atau 9,85% setelah dibulatkan ke dua desimal.
- Meng-upgrade Vite 7.3.1 ke 8.1.4 dan dependency kompatibel.

## Hasil verifikasi

- `[VERIFIED]` `npm run build` berhasil dengan Vite 8.1.4.
- `[VERIFIED]` Hasil final: JavaScript 230,74 kB (gzip 86,34 kB) dan CSS 44,02 kB (gzip 8,94 kB).
- `[VERIFIED]` `npm audit --audit-level=high` menghasilkan `found 0 vulnerabilities`.
- `[VERIFIED]` Desktop 1.440 × 900 px dan mobile 390 × 844 px tidak menunjukkan horizontal overflow.
- `[VERIFIED]` Menu mobile, Escape, tema, FAQ, anchor, dan CTA bekerja pada QA browser.
- `[VERIFIED]` Console browser tidak menampilkan warning atau error pada QA terakhir sebelum integrasi logo; build setelah integrasi logo tetap berhasil.
- `[VERIFIED]` Tiga website komersial dan empat URL eksperimen dapat dijangkau pada tanggal audit. Empat URL eksperimen mengembalikan HTTP 200 pada pemeriksaan HEAD.

## Caveat dan data yang masih dibutuhkan

1. `[UNCERTAIN]` Belum ada domain produksi Gandiva Labs. Karena itu canonical URL, sitemap final, structured data dengan URL resmi, dan email brand belum ditambahkan.
2. `[UNCERTAIN]` Belum ada data biaya, margin, kapasitas bulanan, dan aturan revisi untuk merancang paket harga.
3. `[UNCERTAIN]` Belum ada testimonial yang terkonfirmasi boleh dipublikasikan.
4. `[UNCERTAIN]` Belum ada metrik hasil proyek seperti leads, conversion rate, kecepatan sebelum/sesudah, atau kenaikan penjualan. Website tidak membuat klaim hasil tersebut.
5. `[UNCERTAIN]` Core Web Vitals lapangan belum dapat dinilai tanpa deployment dan data pengguna nyata. Acuan “good” Google saat ini adalah LCP ≤ 2,5 detik, INP ≤ 200 ms, dan CLS ≤ 0,1 pada persentil ke-75, tetapi website ini belum diklaim mencapai nilai tersebut.
6. `[HIGH CONFIDENCE]` Accessibility dasar sudah lebih baik, tetapi audit WCAG penuh tetap memerlukan automated scan dan pengujian manual yang lebih luas, termasuk contrast matrix, keyboard-only flow lengkap, dan screen reader.

## Next step yang disarankan

1. Tentukan domain, email bisnis, dan identitas legal/publik Gandiva Labs.
2. Tetapkan model harga: fixed package, custom quote, atau kombinasi.
3. Kumpulkan minimal tiga testimonial dengan izin publikasi.
4. Dokumentasikan hasil bisnis proyek yang bisa diverifikasi untuk memperkuat case study.
5. Pasang analytics yang privacy-conscious dan event tracking pada atribut `data-track`.
6. Tambahkan canonical, sitemap, WebSite/Organization structured data, dan OG image setelah domain final tersedia.
7. Jalankan Lighthouse dan pengukuran Core Web Vitals setelah deployment.

