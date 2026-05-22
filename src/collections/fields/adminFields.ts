import type { Field } from 'payload'
import { statusOptions } from './options'
import { adminOnlyUpdate } from './fieldAccess'

// Field khusus admin & komponen UI kustom

/** Siklus status klaim. Hanya admin. */
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

/** Catatan admin ke karyawan. Wajib jika ditolak. */
export const adminNotesField: Field = {
  name: 'adminNotes',
  type: 'textarea',
  access: { update: adminOnlyUpdate },
  admin: {
    description: 'Tinggalkan pesan untuk karyawan (wajib jika klaim ditolak).',
  },
}

/** Karyawan yang mengajukan klaim (diisi otomatis oleh hook beforeChange). */
export const requestedByField: Field = {
  name: 'requestedBy',
  type: 'relationship',
  relationTo: 'employees',
  admin: { readOnly: true },
}

/** Tombol kustom "Unduh PDF" di Admin Panel. */
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
