<template>
  <main id="main-content" tabindex="-1" class="flex-grow bg-bg-primary pt-28 md:pt-36">
    <section class="section-glow overflow-hidden pb-20 md:pb-28">
      <div class="section-shell">
        <p class="section-kicker mb-6">Kesalahan 404</p>
        <h1 class="max-w-4xl text-balance text-[clamp(2.8rem,6vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.05em] text-text-primary">Halaman tidak ditemukan.</h1>
        <p class="mt-6 max-w-xl text-lg leading-relaxed text-text-secondary">Alamat yang Anda buka tidak cocok dengan halaman mana pun. Mungkin tautannya berubah atau halamannya belum diterbitkan.</p>
        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
          <RouterLink to="/" class="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-text-primary px-6 text-sm font-bold text-bg-primary">Kembali ke beranda</RouterLink>
          <RouterLink to="/konsultasi" class="liquid-button inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold text-text-primary">Hubungi Gandiva Labs</RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>
