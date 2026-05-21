// Adapter untuk koneksi ke database MongoDB
import { mongooseAdapter } from '@payloadcms/db-mongodb'

// Editor teks kaya (Rich Text) bawaan Payload
import { lexicalEditor } from '@payloadcms/richtext-lexical'

// Adapter untuk mengirim email via SMTP (Brevo)
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

import path from 'path'

// Fungsi utama untuk membangun konfigurasi Payload
import { buildConfig } from 'payload'

import { fileURLToPath } from 'url'

// Library untuk mengolah & mengoptimasi gambar (foto struk)
import sharp from 'sharp'

// Import semua Collection (tabel database) yang akan didaftarkan
import { Employees } from './collections/Employees'
import { Media } from './collections/Media'
import { Reimbursements } from './collections/Reimbursements'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // Konfigurasi Admin Panel: siapa yang bisa login ke /admin
  // Menggunakan tabel Employees sebagai sumber akun admin
  admin: {
    user: Employees.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  // Mendaftarkan semua Collection (tabel database) ke Payload.
  // Payload akan otomatis membuat API dan halaman Admin untuk masing-masing.
  collections: [Employees, Media, Reimbursements],

  // Editor teks kaya untuk field bertipe 'richText'
  editor: lexicalEditor(),

  // Konfigurasi layanan pengiriman email via Brevo SMTP.
  // Digunakan oleh afterChange Hook di Reimbursements untuk notifikasi status klaim.
  email: nodemailerAdapter({
    defaultFromAddress: 'farrelmuhammadrizkywibawa@gmail.com',
    defaultFromName: 'ReimbuS System',
    transportOptions: {
      host: 'smtp-relay.brevo.com',   // Server SMTP Brevo
      port: 587,                       // Port standar SMTP
      auth: {
        user: process.env.BREVO_USER || 'aa1f00001@smtp-brevo.com',
        pass: process.env.BREVO_API_KEY || '',
      },
    },
  }),

  // Secret key untuk enkripsi token autentikasi (JWT & Cookie)
  secret: process.env.PAYLOAD_SECRET || '',

  // Konfigurasi auto-generate TypeScript types berdasarkan Collection
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // Koneksi ke database MongoDB (URL disimpan di file .env untuk keamanan)
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),

  // Aktifkan Sharp untuk kompresi & resize otomatis gambar yang di-upload
  sharp,

  plugins: [],
})