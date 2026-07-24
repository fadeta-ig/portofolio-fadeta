<script setup>
import { ArrowLeft, Mail } from '@lucide/vue';
import ContactSection from '../components/ContactSection.vue';
import { contact } from '../data/contact';

const sections = [
  {
    title: 'Data yang Anda kirim',
    text: 'Form konsultasi dapat meminta nama, nama bisnis, email, nomor WhatsApp, jenis kebutuhan, target waktu, dan ringkasan kebutuhan. Anda memilih sendiri informasi yang dicantumkan pada kolom opsional. Data teknis seperti alamat IP dapat diproses sementara untuk membatasi penyalahgunaan form.'
  },
  {
    title: 'Untuk apa data digunakan',
    text: 'Data digunakan untuk membaca brief, menilai konteks kebutuhan, menghubungi Anda, menjadwalkan konsultasi yang Anda pilih, dan melanjutkan pembicaraan terkait proyek. Data dari form tidak digunakan untuk mengirim newsletter.'
  },
  {
    title: 'Layanan yang membantu memproses data',
    text: 'Website dihosting melalui Vercel, pengiriman brief menggunakan Resend, dan booking konsultasi menggunakan Google Calendar. Jika proteksi anti-bot diaktifkan, Cloudflare Turnstile membantu memverifikasi bahwa pengiriman dilakukan oleh pengguna yang sah. Jika Anda mengizinkannya, Google Analytics digunakan untuk melihat interaksi website secara agregat. Masing-masing layanan memiliki kebijakan privasinya sendiri.'
  },
  {
    title: 'Booking konsultasi',
    text: 'Halaman Google Calendar baru dimuat setelah Anda memilih untuk melihat jadwal. Informasi yang Anda masukkan pada halaman booking diproses oleh Google untuk membuat jadwal, tautan Google Meet, serta pemberitahuan terkait konsultasi. Gandiva Labs tidak dapat membaca aktivitas lain pada kalender pribadi Anda.'
  },
  {
    title: 'Cookie dan analytics',
    text: 'Google Analytics tidak diaktifkan sebelum Anda memberi izin. Jika diizinkan, website juga mengukur LCP, INP, dan CLS untuk memahami kecepatan muat, respons interaksi, dan kestabilan tampilan secara agregat. Pengukuran ini tidak mengirim isi form atau teks yang Anda masukkan. Pilihan consent disimpan pada browser dan dapat diubah melalui Pengaturan cookie di footer.'
  },
  {
    title: 'Akses dan penghapusan',
    text: 'Data yang telah dikirim dapat tersimpan pada layanan email yang digunakan Gandiva Labs. Anda dapat meminta penjelasan, koreksi, atau penghapusan data yang Anda kirim dengan menghubungi email di bawah.'
  }
];
</script>

<template>
  <main id="main-content" tabindex="-1" class="flex-grow bg-bg-primary pt-28 md:pt-36">
    <section class="pb-20 md:pb-28">
      <div class="section-shell max-w-5xl">
        <RouterLink to="/" class="inline-flex items-center gap-2 text-sm font-bold text-text-secondary hover:text-accent"><ArrowLeft class="h-4 w-4" /> Kembali ke beranda</RouterLink>
        <p class="section-kicker mb-6 mt-12">Privasi data</p>
        <h1 class="max-w-4xl text-balance text-[clamp(3.4rem,7vw,7rem)] font-medium leading-[0.9] tracking-[-0.06em] text-text-primary">Informasi Anda dipakai untuk menindaklanjuti <span class="font-display italic text-accent">percakapan.</span></h1>
        <p class="mt-7 max-w-2xl text-lg leading-relaxed text-text-secondary">Ringkasan ini menjelaskan data yang diproses saat Anda menggunakan website atau mengirim form konsultasi Gandiva Labs.</p>

        <div class="mt-14 divide-y divide-border-default border-y border-border-default">
          <article v-for="(section, index) in sections" :key="section.title" class="grid gap-4 py-7 md:grid-cols-[4rem_0.55fr_1fr] md:gap-8">
            <span class="text-xs font-bold tracking-[0.16em] text-accent">0{{ index + 1 }}</span>
            <h2 class="text-lg font-bold text-text-primary">{{ section.title }}</h2>
            <p class="text-sm leading-relaxed text-text-secondary md:text-base">{{ section.text }}</p>
          </article>
        </div>

        <div class="mt-10 rounded-2xl border border-border-default bg-bg-secondary p-6 md:flex md:items-center md:justify-between md:gap-8">
          <p class="max-w-2xl text-sm leading-relaxed text-text-secondary">Jika ada pertanyaan tentang data yang pernah Anda kirim, sertakan alamat email yang digunakan agar permintaan dapat diperiksa.</p>
          <a :href="`mailto:${contact.email}`" class="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-text-primary px-5 text-sm font-bold text-bg-primary md:mt-0"><Mail class="h-4 w-4" /> {{ contact.email }}</a>
        </div>
        <p class="mt-6 text-xs text-text-tertiary">Terakhir diperbarui: 23 Juli 2026.</p>
      </div>
    </section>
    <ContactSection />
  </main>
</template>
