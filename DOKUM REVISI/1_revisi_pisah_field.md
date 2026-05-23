# Revisi 1 — Pemisahan Import dan Export Komponen Field Database

## Tujuan Revisi

Pada V1, seluruh definisi field collection `Reimbursements` ditulis secara _inline_ di dalam `Reimbursements.ts`. File ini menjadi sangat panjang karena mencampur logika akses, konfigurasi UI, opsi dropdown, dan definisi field dalam satu tempat. V2 memecah tanggung jawab tersebut ke dalam folder `src/collections/fields/` yang modular, dengan barrel export melalui `index.ts`.

---

## Daftar File yang Berubah / Ditambah / Dihapus

| Status | File | Keterangan |
|--------|------|-----------|
| 🔄 Diubah | `src/collections/Reimbursements.ts` | Field inline dihapus, diganti dengan `import { reimbursementFields } from './fields'` |
| ✅ Ditambah | `src/collections/fields/index.ts` | Barrel export — menggabungkan semua field ke satu array `reimbursementFields` |
| ✅ Ditambah | `src/collections/fields/claimFields.ts` | 6 field yang diisi karyawan (`claimCode`, `category`, `itemName`, `description`, `amount`, `receipt`) |
| ✅ Ditambah | `src/collections/fields/adminFields.ts` | 4 field khusus admin & UI (`status`, `adminNotes`, `requestedBy`, `printPdf`) |
| ✅ Ditambah | `src/collections/fields/fieldAccess.ts` | Fungsi `adminOnlyUpdate` — access control level field yang dapat digunakan ulang |
| ✅ Ditambah | `src/collections/fields/options.ts` | Single source of truth untuk nilai dropdown: `categoryOptions`, `statusOptions`, beserta TypeScript types `CategoryValue` dan `StatusValue` |

---

## Penjelasan Before / After per File

### `Reimbursements.ts` — Bagian `fields`

**BEFORE (V1):** Field didefinisikan inline sebagai array literal sepanjang ±80 baris langsung di dalam `CollectionConfig`.

```ts
// V1 — src/collections/Reimbursements.ts
fields: [
  {
    name: 'claimCode',
    type: 'text',
    admin: { readOnly: true },
  },
  {
    name: 'category',
    type: 'select',
    required: true,
    options: [
      { label: 'Software', value: 'software' },
      { label: 'Hardware', value: 'hardware' },
      { label: 'Transport', value: 'transport' },
      { label: 'Pantry', value: 'pantry' },
      { label: 'Others', value: 'others' },
    ],
  },
  {
    name: 'status',
    type: 'select',
    defaultValue: 'pending',
    access: {
      update: ({ req: { user } }) => {
        return user?.role === 'admin'
      },
    },
    // ... dst
  },
  // ... 6 field lainnya inline di sini
],
```

**AFTER (V2):** Seluruh array field didelegasikan ke modul terpisah.

```ts
// V2 — src/collections/Reimbursements.ts
import { reimbursementFields } from './fields'

// ...
fields: reimbursementFields,
```

---

### `src/collections/fields/options.ts` — Single Source of Truth Opsi

**BEFORE (V1):** Opsi kategori didefinisikan 2 kali — sekali di `Reimbursements.ts` dan sekali hardcode di form frontend (`new/page.tsx`, `EditForm.tsx`). Jika ada perubahan opsi, developer harus mengubah 3 tempat.

```ts
// V1 — hardcode di Reimbursements.ts
options: [
  { label: 'Software', value: 'software' },
  { label: 'Hardware', value: 'hardware' },
  // ...
],

// V1 — hardcode LAGI di new/page.tsx
<option value="software">Software (Langganan App/Hosting)</option>
<option value="hardware">Hardware (Monitor/Keyboard)</option>
// ...
```

**AFTER (V2):** Didefinisikan sekali di `options.ts` dan diimport di semua tempat yang membutuhkan.

```ts
// V2 — src/collections/fields/options.ts
export const categoryOptions = [
  { label: 'Software (Langganan App/Hosting)', value: 'software' },
  { label: 'Hardware (Monitor/Keyboard)', value: 'hardware' },
  { label: 'Transportasi (Tiket/Bensin)', value: 'transport' },
  { label: 'Pantry (Konsumsi/Kopi)', value: 'pantry' },
  { label: 'Lain-lain', value: 'others' },
]

export type CategoryValue = 'software' | 'hardware' | 'transport' | 'pantry' | 'others'

export const statusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'Approved (Disetujui)', value: 'approved' },
  { label: 'Paid (Lunas)', value: 'paid' },
  { label: 'Rejected (Ditolak)', value: 'rejected' },
]

export type StatusValue = 'pending' | 'approved' | 'paid' | 'rejected'
```

---

### `src/collections/fields/fieldAccess.ts` — Access Control Reusable

**BEFORE (V1):** Fungsi access control ditulis dua kali sebagai inline arrow function, satu untuk `statusField` dan satu untuk `adminNotesField`.

```ts
// V1 — duplikasi di dua tempat dalam Reimbursements.ts
access: {
  update: ({ req: { user } }) => {
    return user?.role === 'admin'
  },
},
```

**AFTER (V2):** Diekstrak ke satu fungsi bernama dengan dokumentasi JSDoc.

```ts
// V2 — src/collections/fields/fieldAccess.ts
import type { FieldAccess } from 'payload'

/**
 * Hanya user dengan role `admin` yang diizinkan memperbarui field ini.
 * Digunakan di: statusField, adminNotesField
 */
export const adminOnlyUpdate: FieldAccess = ({ req: { user } }) => {
  return user?.role === 'admin'
}
```

---

### `src/collections/fields/index.ts` — Barrel Export

File ini berperan sebagai pintu masuk tunggal (`index.ts`) untuk semua yang ada di folder `fields/`. Konsumen luar (seperti `Reimbursements.ts`) hanya perlu mengimport dari satu titik.

```ts
// V2 — src/collections/fields/index.ts
export const reimbursementFields: Field[] = [
  // Data klaim (diisi karyawan)
  claimCodeField,
  categoryField,
  itemNameField,
  descriptionField,
  amountField,
  receiptField,

  // Kontrol admin
  statusField,
  adminNotesField,

  // Metadata & UI
  requestedByField,
  printPdfField,
]

// Re-export individual fields, options, types, dan access control
export { categoryOptions, statusOptions } from './options'
export type { CategoryValue, StatusValue } from './options'
export { adminOnlyUpdate } from './fieldAccess'
```

---