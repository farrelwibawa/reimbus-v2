import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  // Access Control: Public read access for images
  access: {
    read: () => true,
  },

  fields: [
    {
      /** Alt text (auto-filled by claim hook) */
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],

  // Media upload settings
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
    // Auto-generate 150x150 thumbnails
    imageSizes: [
      {
        name: 'thumbnail',
        width: 150,
        height: 150,
      },
    ],
  },
}

