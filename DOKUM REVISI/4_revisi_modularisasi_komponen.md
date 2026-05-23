# Revisi 4 — Pemisahan Komponen Halaman ke Folder Khusus (Modularisasi)

## Tujuan Revisi

Pada V1, komponen UI yang seharusnya dapat digunakan bersama (seperti `LogoutButton`, `MobileNav`) disimpan tersebar di dalam subfolder halaman masing-masing — `LogoutButton` ada di `dashboard/`, `MobileNav` ada di `(karyawan)/`. V2 memindahkan semua komponen yang bersifat _shared_ ke folder `src/components/` dan menambahkan komponen komposit `Navbar` yang menggabungkan navigasi desktop dan mobile dalam satu tempat, sehingga `layout.tsx` menjadi jauh lebih bersih.

---

## Daftar File yang Berubah / Ditambah / Dihapus

| Status | File | Keterangan |
|--------|------|-----------|
| 🔴 Dihapus | `src/app/(karyawan)/MobileNav.tsx` | Dipindah ke `src/components/MobileNav.tsx` |
| 🔴 Dihapus | `src/app/(karyawan)/dashboard/LogoutButton.tsx` | Dipindah ke `src/components/LogoutButton.tsx` |
| 🔴 Dihapus | `src/app/(karyawan)/layout.module.css` | CSS module layout dihapus, diganti Tailwind inline di `Navbar.tsx` |
| 🔴 Dihapus | `src/app/(karyawan)/mobileNav.module.css` | CSS module MobileNav dihapus, diganti Tailwind inline |
| 🔴 Dihapus | `src/app/(karyawan)/dashboard/dashboard.module.css` | CSS module dashboard dihapus, diganti Tailwind inline |
| 🔴 Dihapus | `src/app/(karyawan)/dashboard/view/[id]/view.module.css` | CSS module view dihapus, diganti Tailwind inline |
| ✅ Ditambah | `src/components/Navbar.tsx` | Komponen baru yang mengkomposisikan logo, desktop nav, dan mobile hamburger |
| ✅ Ditambah | `src/components/MobileNav.tsx` | Dipindah dari `(karyawan)/MobileNav.tsx`, dikonversi ke Tailwind |
| ✅ Ditambah | `src/components/LogoutButton.tsx` | Dipindah dari `dashboard/LogoutButton.tsx`, dikonversi ke Tailwind |
| 🔄 Diubah | `src/app/(karyawan)/layout.tsx` | Import disederhanakan: gunakan `<Navbar>` menggantikan nav inline |
| 🔄 Diubah | `src/components/ClickableRow.tsx` | Ditambah prop `className` opsional untuk mendukung Tailwind hover |

---

## Penjelasan Before / After per File

### `layout.tsx` (karyawan) — Komposisi Navbar

**BEFORE (V1):** Layout merakit navigasi secara manual — import `LogoutButton` dan `MobileNav` secara terpisah, menyusun JSX navbar secara inline, mengimport CSS module `layout.module.css`.

```tsx
// V1 — src/app/(karyawan)/layout.tsx
import LogoutButton from './dashboard/LogoutButton'
import MobileNav from './MobileNav'
import styles from './layout.module.css'

// ...
return (
  <html lang="id">
    <body style={{ ... }}>
      {user && (
        <nav className={styles.nav}>
          <Link href="/dashboard" className={styles.logo}>
            Reimbu<span>S</span>
          </Link>
          <div className={styles.navRight}>
            <span className={styles.userGreeting}>Halo, <strong>{userName}</strong></span>
            <LogoutButton />
          </div>
          <MobileNav userName={userName} logoutButton={<LogoutButton />} />
        </nav>
      )}
      {children}
    </body>
  </html>
)
```

**AFTER (V2):** Layout hanya memanggil satu komponen `<Navbar>` dan mengimport `globals.css`.

```tsx
// V2 — src/app/(karyawan)/layout.tsx
import Navbar from '@/components/Navbar'
import '@/app/globals.css'

// ...
return (
  <html lang="id">
    <body style={{ margin: 0, padding: 0, backgroundColor: '#0b0f19', color: '#f8fafc', fontFamily: "...", overflowX: 'hidden' }}>
      {user && <Navbar userName={userName} />}
      {children}
    </body>
  </html>
)
```

---

### `Navbar.tsx` — Komponen Baru

Komponen komposit yang merangkum seluruh logika navigasi. Ini adalah pola _Compound Component_ sederhana.

```tsx
// V2 — src/components/Navbar.tsx
import React from 'react'
import Link from 'next/link'
import LogoutButton from './LogoutButton'
import MobileNav from './MobileNav'

interface NavbarProps {
  userName: string
}

export default function Navbar({ userName }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 flex h-[76px] items-center justify-between border-b border-slate-800 bg-[#0b0f19]/90 px-5 md:px-10 backdrop-blur-md box-border">
      <Link href="/dashboard" className="text-2xl font-bold leading-none text-slate-50 no-underline">
        Reimbu<span className="text-blue-500">S</span>
      </Link>
      
      {/* Desktop Nav — tersembunyi di mobile */}
      <div className="hidden md:flex items-center gap-5">
        <span className="text-[15px] text-slate-400">
          Halo, <strong className="font-semibold text-slate-50">{userName}</strong>
        </span>
        <LogoutButton />
      </div>
      
      {/* Mobile Hamburger — tersembunyi di desktop */}
      <MobileNav userName={userName} logoutButton={<LogoutButton />} />
    </nav>
  )
}
```

---

### `MobileNav.tsx` — Konversi CSS Module ke Tailwind

**BEFORE (V1):** Mengimport `mobileNav.module.css` dan menggunakan class seperti `styles.hamburger`, `styles.bar`, `styles.overlay`, `styles.drawer`.

```tsx
// V1 — src/app/(karyawan)/MobileNav.tsx
import styles from './mobileNav.module.css'

<button className={styles.hamburger} ...>
  <span className={`${styles.bar} ${isOpen ? styles.bar1Open : ''}`} />
  <span className={`${styles.bar} ${isOpen ? styles.bar2Open : ''}`} />
  <span className={`${styles.bar} ${isOpen ? styles.bar3Open : ''}`} />
</button>
<div className={styles.overlay} onClick={() => setIsOpen(false)} />
<div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}>
```

**AFTER (V2):** Semua class CSS module diganti dengan Tailwind, animasi hamburger menggunakan `translate` dan `rotate` utility.

```tsx
// V2 — src/components/MobileNav.tsx
<button
  className="flex md:hidden flex-col justify-center items-center gap-[5px] bg-transparent border-none cursor-pointer p-2 z-[100]"
  ...
>
  <span className={`w-6 h-[2px] bg-slate-50 transition-all duration-300 ease-in-out ${isOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
  <span className={`w-6 h-[2px] bg-slate-50 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-0' : ''}`} />
  <span className={`w-6 h-[2px] bg-slate-50 transition-all duration-300 ease-in-out ${isOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
</button>

<div className={`fixed top-0 right-0 w-[250px] h-screen bg-slate-800 ... transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
```

---

### `LogoutButton.tsx` — Pindah Lokasi + Konversi

**BEFORE (V1):** Berada di `dashboard/LogoutButton.tsx`, mengimport `dashboard.module.css` dan menggunakan `styles.logoutBtn`.

```tsx
// V1 — src/app/(karyawan)/dashboard/LogoutButton.tsx
import styles from './dashboard.module.css'
<button onClick={handleLogout} disabled={loading} className={styles.logoutBtn}>
```

**AFTER (V2):** Dipindah ke `src/components/LogoutButton.tsx`, menggunakan Tailwind tanpa CSS module dependency.

```tsx
// V2 — src/components/LogoutButton.tsx
<button 
  onClick={handleLogout} 
  disabled={loading} 
  className="px-5 py-2.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-red-500/20 hover:border-red-500/50 hover:-translate-y-[1px] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
>
```

---