import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  // Nama unik collection di URL API: /api/media
  slug: 'media',

  // ─────────────────────────────────────────────────────────────────
  // ACCESS CONTROL: HAK AKSES MEDIA
  // Mengatur siapa saja yang boleh membaca/melihat gambar struk.
  // Diatur 'true' agar semua user (termasuk karyawan & admin) bisa memuat gambar struk di browser.
  // ─────────────────────────────────────────────────────────────────
  access: {
    read: () => true,
  },

  // Kolom metadata tambahan untuk mendeskripsikan gambar
  fields: [
    {
      // Alternatif text untuk SEO & Aksesibilitas Gambar (diisi otomatis oleh hook klaim)
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],

  // ─────────────────────────────────────────────────────────────────
  // FITUR UTAMA: UPLOAD ADAPTER (Manajemen File)
  // Mengaktifkan fitur upload file bawaan Payload CMS pada collection ini.
  // ─────────────────────────────────────────────────────────────────
  upload: {
    // Lokasi folder fisik di server tempat file struk disimpan
    staticDir: 'media',

    // Membatasi tipe file yang boleh diunggah (hanya menerima file gambar saja)
    mimeTypes: ['image/*'],

    // Otomatisasi Ukuran Gambar (Image Resizing)
    // Payload + Sharp akan otomatis memotong & mengecilkan gambar 
    // menjadi versi thumbnail kecil demi menghemat bandwidth browser.
    imageSizes: [
      {
        name: 'thumbnail',
        width: 150,
        height: 150,
      },
    ],
  },
}

