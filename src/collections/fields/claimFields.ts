import type { Field } from 'payload'
import { categoryOptions } from './options'

// Field klaim karyawan

/** Kode klaim unik (diisi otomatis oleh hook beforeChange). */
export const claimCodeField: Field = {
  name: 'claimCode',
  type: 'text',
  admin: { readOnly: true },
}

/** Kategori pengeluaran. */
export const categoryField: Field = {
  name: 'category',
  type: 'select',
  required: true,
  options: categoryOptions,
}

/** Nama barang atau jasa. */
export const itemNameField: Field = {
  name: 'itemName',
  type: 'text',
  required: true,
}

/** Deskripsi tambahan (opsional). */
export const descriptionField: Field = {
  name: 'description',
  type: 'textarea',
  required: false,
}

/** Nominal klaim dalam IDR. */
export const amountField: Field = {
  name: 'amount',
  type: 'number',
  required: true,
}

/** Upload foto struk/nota. */
export const receiptField: Field = {
  name: 'receipt',
  type: 'upload',
  relationTo: 'media',
  required: true,
}
