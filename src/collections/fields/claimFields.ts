import type { Field } from 'payload'
import { categoryOptions } from './options'

// ── Field yang diisi karyawan saat mengajukan klaim ──────────────

/** Kode klaim unik (REQ-YYYYMMDDHHmmss). Diisi otomatis oleh beforeChange hook — read-only. */
export const claimCodeField: Field = {
  name: 'claimCode',
  type: 'text',
  admin: { readOnly: true },
}

/** Kategori pengeluaran. Pilihan dikelola terpusat di ./options.ts → categoryOptions. */
export const categoryField: Field = {
  name: 'category',
  type: 'select',
  required: true,
  options: categoryOptions,
}

/** Nama barang atau jasa yang diklaim. */
export const itemNameField: Field = {
  name: 'itemName',
  type: 'text',
  required: true,
}

/** Keterangan tambahan (opsional). */
export const descriptionField: Field = {
  name: 'description',
  type: 'textarea',
  required: false,
}

/** Nominal uang yang diklaim dalam Rupiah. */
export const amountField: Field = {
  name: 'amount',
  type: 'number',
  required: true,
}

/** Foto struk/nota pembelian. Relasinya ke collection Media. */
export const receiptField: Field = {
  name: 'receipt',
  type: 'upload',
  relationTo: 'media',
  required: true,
}
