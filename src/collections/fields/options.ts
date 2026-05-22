// ── Single source of truth untuk semua nilai pilihan field select ─
//    Import dari sini — jangan hardcode ulang di tempat lain.

// ── Kategori Klaim ────────────────────────────────────────────────
// Digunakan di: categoryField (claimFields.ts), new/page.tsx, EditForm.tsx

/** Pilihan kategori pengeluaran yang valid. */
export const categoryOptions = [
  { label: 'Software', value: 'software' },
  { label: 'Hardware', value: 'hardware' },
  { label: 'Transport', value: 'transport' },
  { label: 'Pantry', value: 'pantry' },
  { label: 'Others', value: 'others' },
]

/** Union type dari semua nilai kategori yang valid. */
export type CategoryValue = 'software' | 'hardware' | 'transport' | 'pantry' | 'others'

// ── Status Klaim ──────────────────────────────────────────────────
// Digunakan di: statusField (adminFields.ts)

/** Pilihan status klaim yang valid. */
export const statusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'Approved (Disetujui)', value: 'approved' },
  { label: 'Paid (Lunas)', value: 'paid' },
  { label: 'Rejected (Ditolak)', value: 'rejected' },
]

/** Union type dari semua nilai status yang valid. */
export type StatusValue = 'pending' | 'approved' | 'paid' | 'rejected'
