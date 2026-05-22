import type { Field } from 'payload'
import {
  claimCodeField,
  categoryField,
  itemNameField,
  descriptionField,
  amountField,
  receiptField,
} from './claimFields'
import {
  statusField,
  adminNotesField,
  requestedByField,
  printPdfField,
} from './adminFields'

// ── Struktur folder fields/ ───────────────────────────────────────
//    options.ts      → nilai pilihan select + TypeScript types
//    fieldAccess.ts  → fungsi access control level field
//    claimFields.ts  → field yang diisi karyawan
//    adminFields.ts  → field khusus admin & UI komponen
//    index.ts        → (file ini) gabungan + barrel re-export

/** Array lengkap semua field Reimbursements, siap dipasang ke CollectionConfig.fields. */
export const reimbursementFields: Field[] = [
  // ── Data klaim (diisi karyawan) ──
  claimCodeField,
  categoryField,
  itemNameField,
  descriptionField,
  amountField,
  receiptField,

  // ── Kontrol admin ──
  statusField,
  adminNotesField,

  // ── Metadata & UI ──
  requestedByField,
  printPdfField,
]

// ── Re-export individual fields ───────────────────────────────────
export {
  claimCodeField,
  categoryField,
  itemNameField,
  descriptionField,
  amountField,
  receiptField,
  statusField,
  adminNotesField,
  requestedByField,
  printPdfField,
}

// ── Re-export options, types & access control ─────────────────────
export { categoryOptions, statusOptions } from './options'
export type { CategoryValue, StatusValue } from './options'
export { adminOnlyUpdate } from './fieldAccess'
