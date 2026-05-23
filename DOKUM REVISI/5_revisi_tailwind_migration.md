# Revisi 5 — Peningkatan CSS Standar Menjadi Tailwind CSS

## Tujuan Revisi

V1 menggunakan pendekatan CSS Module (`.module.css`) untuk semua styling — dengan file CSS terpisah per halaman/komponen. V2 bermigrasi sepenuhnya ke **Tailwind CSS v4** menggunakan utility class langsung di JSX. Migrasi ini menghilangkan 6 file CSS Module, menambahkan `globals.css` minimal, dan mengkonfigurasi PostCSS untuk Tailwind. Hasilnya adalah styling yang co-located dengan markup, tidak ada dead CSS, dan konsistensi design token otomatis via Tailwind.

---

## Daftar File yang Berubah / Ditambah / Dihapus

| Status | File | Keterangan |
|--------|------|-----------|
| 🔴 Dihapus | `src/app/(frontend)/landing.module.css` | Seluruh style landing page kini inline Tailwind di `page.tsx` |
| 🔴 Dihapus | `src/app/(frontend)/login/login.module.css` | Seluruh style halaman login kini inline Tailwind di `login/page.tsx` |
| 🔴 Dihapus | `src/app/(frontend)/styles.css` | File CSS global boilerplate Payload bawaan dihapus |
| 🔴 Dihapus | `src/app/(karyawan)/layout.module.css` | Style navbar karyawan kini di `Navbar.tsx` via Tailwind |
| 🔴 Dihapus | `src/app/(karyawan)/mobileNav.module.css` | Style drawer mobile kini di `MobileNav.tsx` via Tailwind |
| 🔴 Dihapus | `src/app/(karyawan)/dashboard/dashboard.module.css` | Style seluruh dashboard kini inline Tailwind |
| 🔴 Dihapus | `src/app/(karyawan)/dashboard/view/[id]/view.module.css` | Style halaman detail kini inline Tailwind |
| ✅ Ditambah | `src/app/globals.css` | File CSS global baru — hanya berisi `@import "tailwindcss"` + style body |
| ✅ Ditambah | `postcss.config.mjs` | Konfigurasi PostCSS untuk Tailwind v4 (`@tailwindcss/postcss`) |
| 🔄 Diubah | `package.json` | Tambah dependency `tailwindcss: ^4.3.0` dan `@tailwindcss/postcss: ^4.3.0` |
| 🔄 Diubah | `src/app/(frontend)/layout.tsx` | Import berubah dari `styles.css` ke `globals.css` |
| 🔄 Diubah | `src/app/(karyawan)/layout.tsx` | Import berubah dari `layout.module.css` ke `globals.css` |
| 🔄 Diubah | Semua file `.tsx` halaman & komponen | Class `styles.*` diganti dengan Tailwind utility class |

---

## Penjelasan Before / After per File

### Setup Tailwind CSS v4

**BEFORE (V1):** Tidak ada Tailwind. `package.json` tidak memiliki dependency Tailwind. Tidak ada `postcss.config.mjs`.

**AFTER (V2):** Tailwind v4 diinstall dan dikonfigurasi.

```js
// V2 — postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

```css
/* V2 — src/app/globals.css */
@import "tailwindcss";

body {
  background: radial-gradient(circle at top, #111827 0%, #0b0f19 40%, #05080f 100%);
  background-attachment: fixed;
  color: #f8fafc;
  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", ...;
  -webkit-font-smoothing: antialiased;
}
```

Tailwind v4 menggunakan `@import "tailwindcss"` (bukan `@tailwind base/components/utilities` seperti v3). File `globals.css` sengaja dibuat minimal — semua detail styling ada di utility class di JSX.

---

### Halaman Landing (`page.tsx`)

**BEFORE (V1):** Semua class mengacu ke CSS Module.

```tsx
// V1 — (frontend)/page.tsx
import styles from './landing.module.css'

<div className={styles.container}>
  <nav className={styles.nav}>
    <Link href="/" className={styles.logo}>
      Reimbu<span>S</span>
    </Link>
    <Link href="/login" className={styles.loginBtn}>
      Masuk Sistem
    </Link>
  </nav>
  <main className={styles.hero}>
    <div className={styles.badge}>ENTERPRISE REIMBURSEMENT PLATFORM</div>
    <h1 className={styles.title}>
      Kelola Klaim Karyawan <span>Tanpa Hambatan.</span>
    </h1>
    // ...
  </main>
  <section className={styles.features}>
    <div className={styles.featureCard}>
```

**AFTER (V2):** Semua class adalah Tailwind utility langsung di JSX, tidak ada import CSS.

```tsx
// V2 — (frontend)/page.tsx
// (tidak ada import CSS)

<div className="min-h-screen flex flex-col font-sans text-slate-50">
  <nav className="flex justify-between items-center h-[76px] px-5 md:px-[60px] bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 box-border">
    <Link href="/" className="font-sans text-2xl font-bold leading-none text-slate-50 no-underline">
      Reimbu<span className="text-blue-500">S</span>
    </Link>
    <Link href="/login" className="bg-blue-500/10 text-blue-500 border border-blue-500 px-6 py-2 rounded-md text-[15px] font-semibold no-underline transition-all duration-200 hover:bg-blue-500 hover:text-white active:scale-95">
      Masuk Sistem
    </Link>
  </nav>
  <main className="flex-1 flex flex-col items-center justify-center text-center px-5 py-[100px] max-w-[900px] mx-auto">
    <div className="bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-[1px] mb-[30px] border border-blue-500/20">
      ENTERPRISE REIMBURSEMENT PLATFORM
    </div>
    <h1 className="text-[40px] md:text-[56px] font-extrabold leading-[1.1] m-0 mb-6 tracking-tight">
      Kelola Klaim Karyawan <span className="bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">Tanpa Hambatan.</span>
    </h1>
```

V2 juga menambahkan **responsive prefix** (`md:`) yang tidak ada di V1 — misalnya `text-[40px] md:text-[56px]` — sehingga layout otomatis beradaptasi di layar kecil.

---

### Halaman Login (`login/page.tsx`)

**BEFORE (V1):** CSS Module dengan class `.container`, `.nav`, `.card`, `.inputGroup`, `.button`.

```tsx
// V1 — login/page.tsx
import styles from './login.module.css'

<div className={styles.container}>
  <nav className={styles.nav}>...</nav>
  <div className={styles.content}>
    <div className={styles.card}>
      <div className={styles.inputGroup}>
        <label>Email</label>
        <input type="email" ... />
      </div>
      <button className={styles.button}>Masuk</button>
    </div>
  </div>
</div>
```

**AFTER (V2):** Tailwind inline, ditambah pola `inputClass` konstanta untuk reuse.

```tsx
// V2 — login/page.tsx
// Pola reuse: class input disimpan sebagai konstanta string
const inputClass = "px-4 py-3 rounded-lg border border-slate-700 bg-slate-950 text-slate-50 text-[15px] outline-none transition-all duration-300 focus:border-blue-400 focus:ring-[3px] focus:ring-blue-500/20 shadow-inner placeholder:text-slate-500 w-full"

<div className="min-h-screen flex flex-col font-sans text-slate-50">
  <div className="flex-1 flex items-center justify-center p-6 md:p-10">
    <div className="bg-slate-900/80 backdrop-blur-md p-8 md:p-10 rounded-2xl w-full max-w-[400px] shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-slate-800">
      <input type="email" className={inputClass} />
      <button className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-3.5 rounded-lg ...">
        Masuk
      </button>
    </div>
  </div>
</div>
```

Pola `const inputClass = "..."` digunakan di `login/page.tsx`, `new/page.tsx`, dan `EditForm.tsx` untuk menghindari pengulangan string panjang.

---

### Dashboard Utama (`dashboard/page.tsx`) — Badge Status

**BEFORE (V1):** Warna badge status menggunakan class CSS Module yang didefinisikan di `dashboard.module.css`.

```tsx
// V1 — dashboard/page.tsx
const statusClass = item.status === 'approved'
  ? styles.statusApproved
  : item.status === 'rejected'
    ? styles.statusRejected
    : item.status === 'paid'
      ? styles.statusPaid
      : styles.statusPending;

<span className={`${styles.statusBadge} ${statusClass}`}>
  {item.status?.toUpperCase()}
</span>
```

**AFTER (V2):** Warna badge langsung sebagai Tailwind utility string.

```tsx
// V2 — dashboard/page.tsx
const statusClass = item.status === 'approved'
  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
  : item.status === 'rejected'
    ? "bg-red-500/10 text-red-400 border border-red-500/20"
    : item.status === 'paid'
      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
      : "bg-amber-500/10 text-amber-400 border border-amber-500/20";

<span className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide inline-block ${statusClass}`}>
  {item.status?.toUpperCase()}
</span>
```

---