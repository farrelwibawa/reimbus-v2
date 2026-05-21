import type { CollectionConfig } from 'payload'

export const Employees: CollectionConfig = {
  // Nama unik collection di URL API: /api/employees
  slug: 'employees',

  // Pengaturan visual di Admin Panel Payload
  admin: {
    // Menampilkan nama karyawan sebagai judul utama baris data
    useAsTitle: 'name',
  },

  // ─────────────────────────────────────────────────────────────────
  // FITUR UTAMA: AUTHENTICATION
  // Mengaktifkan fitur login bawaan Payload CMS pada tabel ini.
  // Otomatis menambahkan field default: email dan password (hashing).
  // ─────────────────────────────────────────────────────────────────
  auth: true,

  // Kolom-kolom data (fields) untuk profil karyawan
  fields: [
    {
      // Nama Lengkap Karyawan
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      // Role / Peran Akun untuk membedakan hak akses (Admin vs Karyawan Biasa)
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

