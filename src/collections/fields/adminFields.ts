import type { Field } from 'payload'
import { statusOptions } from './options'
import { adminOnlyUpdate } from './fieldAccess'

// Admin-only fields & custom UI components

/** Claim status lifecycle. Admin only. */
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

/** Admin notes to employee. Required if rejected. */
export const adminNotesField: Field = {
  name: 'adminNotes',
  type: 'textarea',
  access: { update: adminOnlyUpdate },
  admin: {
    description: 'Tinggalkan pesan untuk karyawan (wajib jika klaim ditolak).',
  },
}

/** Employee who requested the claim (auto-filled by beforeChange hook). */
export const requestedByField: Field = {
  name: 'requestedBy',
  type: 'relationship',
  relationTo: 'employees',
  admin: { readOnly: true },
}

/** Custom "Download PDF" button in Admin Panel. */
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
