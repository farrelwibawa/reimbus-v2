import type { Field } from 'payload'
import { statusOptions } from './options'
import { adminOnlyUpdate } from './fieldAccess'

// ── Field yang hanya bisa diubah admin + komponen UI kustom ──────

/** Status siklus klaim: pending → approved/rejected → paid. Hanya admin yang dapat mengubah. */
export const statusField: Field = {
  name: 'status',
  type: 'select',
  defaultValue: 'pending',
  access: { update: adminOnlyUpdate },
  options: statusOptions,
  admin: {
    components: {
      Cell: '@/components/StatusCell#StatusCell',
    },
  },
}

/** Catatan admin ke karyawan. Wajib diisi saat status = rejected. Hanya admin yang dapat mengubah. */
export const adminNotesField: Field = {
  name: 'adminNotes',
  type: 'textarea',
  access: { update: adminOnlyUpdate },
  admin: {
    description: 'Tinggalkan pesan untuk karyawan (wajib jika klaim ditolak).',
  },
}

/** ID karyawan yang mengajukan klaim. Diisi otomatis oleh beforeChange hook — read-only. */
export const requestedByField: Field = {
  name: 'requestedBy',
  type: 'relationship',
  relationTo: 'employees',
  admin: { readOnly: true },
}

/** Tombol "Unduh PDF" kustom di sidebar Admin Panel. Hanya UI, tidak menyimpan data ke database. */
export const printPdfField: Field = {
  name: 'printPdf',
  type: 'ui',
  admin: {
    position: 'sidebar',
    components: {
      Field: '@/components/PrintPdfButton#PrintPdfButton',
    },
  },
}
