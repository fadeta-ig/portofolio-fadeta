# Gandiva Labs

Website jasa pembuatan website untuk bisnis, dibangun dengan Vue 3, Vite, Tailwind CSS 4, dan GSAP.

## Tujuan bisnis

Website ini dirancang untuk:

- Menjelaskan positioning Gandiva Labs dengan cepat.
- Mengarahkan calon klien ke layanan yang paling relevan.
- Membangun kepercayaan melalui proyek komersial yang sudah dikerjakan.
- Mengubah kunjungan menjadi percakapan WhatsApp yang lebih terarah.

## Struktur halaman

1. Hero dan proposisi nilai
2. Segmen bisnis yang dilayani
3. Masalah dan pendekatan
4. Layanan
5. Karya pilihan
6. Proses kerja
7. Tentang studio
8. FAQ
9. Kontak

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
- Domain produksi belum ditetapkan, sehingga canonical URL dan sitemap belum ditambahkan.
- File sumber logo beresolusi tinggi disimpan di `src/assets/brand/source`; versi ringan untuk website berada di `public`.
