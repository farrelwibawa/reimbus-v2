import type { CollectionConfig } from 'payload'

export const Employees: CollectionConfig = {
  slug: 'employees',

  admin: {
    useAsTitle: 'name',
  },

  // Aktifkan autentikasi bawaan Payload (otomatis menambahkan field email & password)
  auth: true,

  fields: [
    {
      /** Nama Lengkap */
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      /** Peran akun (admin atau employee) */
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'employee',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Karyawan',
          value: 'employee',
        },
      ],
    },
  ],
}

