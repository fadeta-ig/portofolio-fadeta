# Gandiva Labs

Website jasa pembuatan website untuk bisnis, dibangun dengan Vue 3, Vite, Tailwind CSS 4, dan GSAP.

## Tujuan bisnis

Website ini dirancang untuk:

- Menjelaskan positioning Gandiva Labs dengan cepat.
- Mengarahkan calon klien ke layanan yang paling relevan.
- Membangun kepercayaan melalui proyek komersial yang sudah dikerjakan.
- Mengubah pengunjung menjadi brief konsultasi terstruktur atau percakapan WhatsApp.

## Struktur halaman

- `/` - homepage untuk positioning, layanan, proses, bukti kerja, dan form konsultasi singkat.
- `/portfolio` - arsip karya yang memisahkan website publik, sistem internal, dan eksperimen digital.
- `/konsultasi` - form kualifikasi kebutuhan dan target waktu proyek.
- `/terima-kasih` - konfirmasi setelah brief berhasil dikirim oleh server.

## Menjalankan proyek

```bash
npm install
npm run dev
```

Build produksi:

```bash
npm run build
```

## Konfigurasi email form

Form dikirim melalui Vercel Function di `api/contact.js` dan Resend. Salin `.env.example` menjadi `.env.local` untuk pengembangan, lalu isi variabel berikut di Vercel untuk production:

- `RESEND_API_KEY` - API key dari akun Resend.
- `CONTACT_TO_EMAIL` - tujuan brief; default `fadeta287@gmail.com`.
- `CONTACT_FROM_EMAIL` - pengirim email. Default `Gandiva Labs <onboarding@resend.dev>` hanya dapat digunakan untuk mengirim ke email pemilik akun Resend. Untuk production dengan domain sendiri, verifikasi domain di Resend lalu gunakan alamat dari domain tersebut.
- `ALLOWED_ORIGIN` - opsional. Dapat berisi daftar origin yang dipisahkan koma; jika kosong, endpoint memeriksa host request secara otomatis.

Jangan menyimpan API key di repository. Setelah environment variable production diatur, deploy ulang agar endpoint menerima konfigurasi terbaru.

## Catatan operasional

- Nomor WhatsApp dan email mengikuti kontak Fadeta yang sudah ada di proyek.
- CTA memiliki atribut `data-track` agar dapat disambungkan ke analytics setelah ID dan platform tracking ditentukan.
- Detail proyek private dibatasi pada konteks dan ruang lingkup umum; nama klien, screenshot, data, dan akses sistem tidak dipublikasikan.
- Domain produksi belum ditetapkan, sehingga canonical URL dan sitemap belum ditambahkan.
- File sumber logo beresolusi tinggi disimpan di `src/assets/brand/source`; versi ringan untuk website berada di `public`.
