import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import EditForm from './EditForm'

// Di Next.js 15, params adalah sebuah Promise
export default async function EditKlaimPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const id = resolvedParams.id

  const payload = await getPayload({ config: configPromise })
  const headers = await getHeaders()
  
  const { user } = await payload.auth({ headers })

  if (!user) {
    redirect('/admin/login')
  }

  try {
    // Ambil data klaim spesifik berdasarkan ID dengan overrideAccess: false
    // agar memastikan user hanya bisa mengambil dokumen miliknya sendiri
    const klaim = await payload.findByID({
      collection: 'reimbursements',
      id: id,
      overrideAccess: false,
      user,
    })

    // Keamanan lapis dua: pastikan status masih pending
    // Jika tidak pending, lemparkan kembali ke dashboard
    if (klaim.status !== 'pending') {
      redirect('/dashboard')
    }

    return <EditForm klaim={klaim} />
  } catch (err) {
    // Jika dokumen tidak ditemukan atau user mencoba akses dokumen orang lain
    redirect('/dashboard')
  }
}
