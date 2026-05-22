# 🚀 ReimbuS - Versi 2 (Modernized & Refactored)

Repositori ini berisi kode sumber **Versi Ke-2** dari aplikasi Reimbursement Karyawan (ReimbuS). Proyek ini merupakan hasil *major refactor* dan penyempurnaan dari versi purwarupa (V1), yang dikembangkan selama masa magang di **PT Data Andalan Utama**.

Pada versi ini, fokus utama pengembangan adalah pada **kebersihan arsitektur kode (Clean Code)**, **performa rendering**, dan **kualitas Antarmuka Pengguna (UI/UX)** kelas premium.

---

## 🌟 Apa yang Baru di Versi 2?

Versi 2 membawa perubahan masif secara fundamental dibandingkan pendahulunya, di antaranya:

### 1. 🎨 UI/UX Premium dengan Tailwind CSS v4
- **Migrasi Total:** Meninggalkan ratusan baris kode *Plain CSS* dan beralih sepenuhnya ke **Tailwind CSS v4** (Zero Configuration) yang lebih ringan dan cepat.
- **Modern Aesthetics:** Implementasi gaya *Glassmorphism* (efek kaca transparan), latar belakang *radial-gradient*, dan palet warna *dark mode* yang elegan.
- **Micro-Animations:** Tambahan efek visual interaktif seperti animasi *hover*, bayangan pendar (*glow shadow*), hingga efek mekanis (tactile `active:scale-95`) pada tombol untuk pengalaman pengguna yang dinamis.
- **Fully Responsive:** Layout cerdas yang beradaptasi sempurna dari layar *desktop* lebar hingga perangkat *mobile* berukuran kecil, tanpa elemen yang terpotong.

### 2. 🏗️ Arsitektur Kode (Clean Architecture)
- **Separation of Concerns:** Memisahkan secara ketat antara tampilan (UI) dan logika bisnis (*Handlers*). File komponen kini jauh lebih bersih dan mudah dibaca.
- **Modul Pengumpulan (Collections):** Konfigurasi Payload CMS dibuat modular. Definisi field dan akses data kini dipecah ke dalam file-file spesifik demi kemudahan *maintenance* di masa depan.
- **Optimasi Bundle:** Penghapusan *dead code* dan *file CSS* usang yang membuat bobot aplikasi menjadi sangat efisien.

---

## 🛠️ Spesifikasi Teknis (V2)
* **Framework:** Next.js 15 (App Router, React 19)
* **CMS & Backend:** Payload CMS v3
* **Styling Engine:** Tailwind CSS v4 (via `@tailwindcss/postcss`)
* **Database:** MongoDB (melalui Mongoose Adapter)
* **Bahasa:** TypeScript (100% Type-Safe)

---

## 🚀 Cara Menjalankan Proyek (Local Development)

1. Pastikan Anda sudah menginstal **Node.js** (v18+) dan memiliki URI **MongoDB** yang aktif.
2. *Clone* repositori ini dan masuk ke direktorinya.
3. Instal semua dependensi:
   ```bash
   npm install
   ```
4. Buat file `.env` dan sesuaikan nilainya (kunci enkripsi & URI Database).
5. Jalankan *server development*:
   ```bash
   npm run dev
   ```
6. Buka `http://localhost:3000` di browser untuk mengakses portal Karyawan, atau `http://localhost:3000/admin` untuk panel Payload CMS.

---

## 📁 Dokumentasi Revisi
Seluruh catatan perjalanan pengembangan (changelog), proses migrasi dari V1 ke V2, serta rincian *refactoring* kode tersimpan rapi di dalam folder **`DOKUM REVISI/`**. Folder ini berisi dokumen Markdown yang merangkum setiap tahap penyempurnaan aplikasi.

---

## 📈 Status Repositori: ACTIVE (STABLE)
> Proyek ini adalah versi paling optimal dan stabil saat ini, siap untuk digunakan sebagai basis pengembangan fitur lanjutan.


*Dibuat oleh **Farrel Muhammad Rizky Wibawa** - SMK N 7 Semarang | Magang PT Data Andalan Utama*