# Gandiva Labs

Website jasa pembuatan website untuk bisnis, dibangun dengan Vue 3, Vite, Tailwind CSS 4, dan GSAP.

## Tujuan bisnis

Website ini dirancang untuk:

- Menjelaskan positioning Gandiva Labs dengan cepat.
- Mengarahkan calon klien ke layanan yang paling relevan.
- Membangun kepercayaan melalui proyek komersial yang sudah dikerjakan.
- Mengubah kunjungan menjadi percakapan WhatsApp yang lebih terarah.

## Struktur halaman

- `/` — homepage untuk menjelaskan positioning, layanan, proses, dan mengarahkan pengunjung ke konsultasi.
- `/portfolio` — arsip karya yang memisahkan website publik, sistem internal, dan eksperimen digital.

Homepage hanya menampilkan pengantar portofolio dan satu CTA. Detail proyek ditempatkan di halaman khusus agar halaman utama tetap ringkas dan alur membaca lebih fokus.

## Menjalankan proyek

```bash
npm install
npm run dev
```

Build produksi:

```bash
npm run build
```

## Catatan operasional

- Nomor WhatsApp dan email saat ini mengikuti kontak Fadeta yang sudah ada di proyek.
- CTA memiliki atribut `data-track` agar dapat disambungkan ke analytics setelah ID dan platform tracking ditentukan.
- Detail proyek private dibatasi pada konteks dan ruang lingkup umum; nama klien, screenshot, data, dan akses sistem tidak dipublikasikan.
- Domain produksi belum ditetapkan, sehingga canonical URL dan sitemap belum ditambahkan.
- File sumber logo beresolusi tinggi disimpan di `src/assets/brand/source`; versi ringan untuk website berada di `public`.
