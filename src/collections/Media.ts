import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',

  // Hak Akses: Publik dapat membaca gambar
  access: {
    read: () => true,
  },

  fields: [
    {
      /** Teks alternatif (diisi otomatis oleh hook klaim) */
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],

  // Pengaturan upload media
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
    // Generate otomatis thumbnail 150x150
    imageSizes: [
      {
        name: 'thumbnail',
        width: 150,
        height: 150,
      },
    ],
  },
}

