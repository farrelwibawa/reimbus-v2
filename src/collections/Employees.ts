import type { CollectionConfig } from 'payload'

export const Employees: CollectionConfig = {
  slug: 'employees',

  admin: {
    useAsTitle: 'name',
  },

  // Enable Payload built-in authentication (auto-adds email & password fields)
  auth: true,

  fields: [
    {
      /** Full Name */
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      /** User role (admin vs employee) */
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

