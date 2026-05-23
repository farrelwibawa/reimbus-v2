# Revisi 3 — Penerapan Custom Component pada Panel Admin

## Tujuan Revisi

Pada V1, kolom "Status" di tabel list Admin Panel Payload ditampilkan sebagai teks biasa tanpa pemformatan visual. V2 menambahkan komponen `StatusCell` yang merender status sebagai badge berwarna (pill/chip), sehingga admin dapat langsung membedakan status klaim secara visual tanpa harus membaca teks. Komponen ini didaftarkan ke Payload melalui mekanisme `admin.components.Cell` dan `importMap.js`.

---

## Daftar File yang Berubah / Ditambah / Dihapus

| Status | File | Keterangan |
|--------|------|-----------|
| ✅ Ditambah | `src/components/StatusCell.tsx` | Komponen React kustom yang merender badge status berwarna |
| 🔄 Diubah | `src/collections/fields/adminFields.ts` | `statusField` ditambah `admin.components.Cell` yang menunjuk ke `StatusCell` |
| 🔄 Diubah | `src/app/(payload)/admin/importMap.js` | Entry baru `StatusCell` ditambahkan agar Payload dapat me-resolve komponen saat build |
| 🔄 Diubah | `src/collections/Reimbursements.ts` | Ditambah `defaultColumns` di konfigurasi `admin` agar kolom yang ditampilkan di list Admin konsisten |

---

## Penjelasan Before / After per File

### `StatusCell.tsx` — Komponen Baru

**BEFORE (V1):** Tidak ada komponen kustom untuk sel status. Payload menampilkan nilai field `status` sebagai teks mentah (`pending`, `approved`, `rejected`, `paid`).

**AFTER (V2):** Komponen baru yang menerima `cellData` (nilai status) dan merender badge berwarna dengan warna berbeda per status.

```tsx
// V2 — src/components/StatusCell.tsx
'use client'

import React from 'react'

export const StatusCell = ({ cellData }: { cellData: string }) => {
  if (!cellData) return null

  const getColors = (status: string) => {
    switch (status) {
      case 'approved': return { bg: '#dcfce7', color: '#166534' } // Hijau
      case 'rejected': return { bg: '#fee2e2', color: '#991b1b' } // Merah
      case 'paid':     return { bg: '#dbeafe', color: '#1e40af' } // Biru
      case 'pending':
      default:         return { bg: '#fef9c3', color: '#854d0e' } // Kuning
    }
  }

  const { bg, color } = getColors(cellData)

  return (
    <span
      style={{
        backgroundColor: bg,
        color: color,
        padding: '4px 12px',
        borderRadius: '99px',
        fontWeight: 'bold',
        fontSize: '12px',
        textTransform: 'uppercase',
        display: 'inline-block',
      }}
    >
      {cellData}
    </span>
  )
}
```

Perhatikan komponen ini menggunakan **inline `style`** (bukan Tailwind) karena dijalankan di dalam Admin Panel Payload yang memiliki CSS scope sendiri — Tailwind CSS dari aplikasi frontend tidak akan aktif di sana.

---

### `adminFields.ts` — Registrasi `StatusCell` ke Field

**BEFORE (V1):** `statusField` tidak memiliki konfigurasi komponen kustom untuk tampilan list.

```ts
// V1 — statusField (di dalam Reimbursements.ts)
{
  name: 'status',
  type: 'select',
  defaultValue: 'pending',
  access: {
    update: ({ req: { user } }) => user?.role === 'admin'
  },
  options: [ ... ],
}
```

**AFTER (V2):** Ditambahkan `admin.components.Cell` yang mendaftarkan `StatusCell`.

```ts
// V2 — src/collections/fields/adminFields.ts
export const statusField: Field = {
  name: 'status',
  type: 'select',
  defaultValue: 'pending',
  access: { update: adminOnlyUpdate },
  options: statusOptions,
  admin: {
    components: {
      Cell: '@/components/StatusCell#StatusCell',  // <-- BARU
    },
  },
}
```

Sintaks `'@/components/StatusCell#StatusCell'` adalah konvensi Payload v3 — string sebelum `#` adalah path modul, string setelah `#` adalah nama export yang digunakan.

---

### `importMap.js` — Registrasi untuk Build Payload

**BEFORE (V1):** `importMap.js` hanya mendaftarkan satu komponen kustom.

```js
// V1 — importMap.js
import { PrintPdfButton as PrintPdfButton_144116271862c6a95b5105157ec5700e } from '@/components/PrintPdfButton'
import { CollectionCards as CollectionCards_f9c02e79a4aed9a3924487c0cd4cafb1 } from '@payloadcms/next/rsc'

export const importMap = {
  "@/components/PrintPdfButton#PrintPdfButton": PrintPdfButton_144116271862c6a95b5105157ec5700e,
  "@payloadcms/next/rsc#CollectionCards": CollectionCards_f9c02e79a4aed9a3924487c0cd4cafb1
}
```

**AFTER (V2):** Entry `StatusCell` ditambahkan di baris pertama.

```js
// V2 — importMap.js
import { StatusCell as StatusCell_de67b6ed4e705b9838b8ef1a6356bbf7 } from '@/components/StatusCell'
import { PrintPdfButton as PrintPdfButton_144116271862c6a95b5105157ec5700e } from '@/components/PrintPdfButton'
import { CollectionCards as CollectionCards_f9c02e79a4aed9a3924487c0cd4cafb1 } from '@payloadcms/next/rsc'

export const importMap = {
  "@/components/StatusCell#StatusCell": StatusCell_de67b6ed4e705b9838b8ef1a6356bbf7,
  "@/components/PrintPdfButton#PrintPdfButton": PrintPdfButton_144116271862c6a95b5105157ec5700e,
  "@payloadcms/next/rsc#CollectionCards": CollectionCards_f9c02e79a4aed9a3924487c0cd4cafb1
}
```

`importMap.js` **wajib diperbarui manual** setiap kali komponen kustom baru ditambahkan ke Payload. Jika tidak, komponen tidak akan tersedia saat bundle Admin Panel dibuild.

---

### `Reimbursements.ts` — Penambahan `defaultColumns`

**BEFORE (V1):** Tidak ada konfigurasi `defaultColumns`, sehingga Payload menampilkan kolom default bawaan.

```ts
// V1
admin: {
  useAsTitle: 'claimCode',
},
```

**AFTER (V2):** Ditambahkan `defaultColumns` secara eksplisit agar tampilan list Admin konsisten.

```ts
// V2
admin: {
  useAsTitle: 'claimCode',
  defaultColumns: ['claimCode', 'category', 'itemName', 'description', 'status'],
},
```

---