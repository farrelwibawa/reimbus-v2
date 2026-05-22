import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ViewActionButtons from './ViewActionButtons'

export default async function ViewKlaimPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const id = resolvedParams.id

  const payload = await getPayload({ config: configPromise })
  const headers = await getHeaders()
  
  const { user } = await payload.auth({ headers })

  if (!user) {
    redirect('/login')
  }

  let klaim;
  try {
    klaim = await payload.findByID({
      collection: 'reimbursements',
      id: id,
      overrideAccess: false,
      user,
    })
  } catch (err) {
    // Jika data tidak ditemukan atau bukan milik user ini
    redirect('/dashboard')
  }

  // Ekstrak URL gambar dari relasi
  const receiptUrl = typeof klaim.receipt === 'object' && klaim.receipt?.url 
    ? klaim.receipt.url 
    : null;
    
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka)
  }

  const statusClass = klaim.status === 'approved' 
    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
    : klaim.status === 'rejected' 
      ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
      : klaim.status === 'paid'
        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20';

  return (
    <div className="max-w-[900px] mx-auto my-4 md:my-10 px-4 md:px-0 font-sans text-slate-50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-[30px] border-b border-slate-800 pb-5 gap-3 md:gap-0">
        <h1 className="m-0 text-[22px] md:text-[28px] font-bold tracking-tight">Detail Klaim</h1>
        <Link href="/dashboard" className="no-underline text-slate-400 text-[13px] md:text-sm font-medium transition-all duration-200 px-3 md:px-4 py-1.5 md:py-2 bg-slate-800 rounded-md border border-slate-700 hover:text-slate-50 hover:bg-slate-700">
          &larr; Kembali
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Kolom Kiri: Informasi Teks */}
        <div className="bg-slate-900/80 backdrop-blur-sm p-5 md:p-[30px] rounded-2xl border border-slate-800 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-3 md:py-4 border-b border-slate-800 gap-1 md:gap-0">
            <span className="text-slate-400 text-sm font-medium">Kode Klaim</span>
            <span className="text-slate-50 text-[15px] font-semibold">{klaim.claimCode}</span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-3 md:py-4 border-b border-slate-800 gap-1 md:gap-0">
            <span className="text-slate-400 text-sm font-medium">Tanggal Pengajuan</span>
            <span className="text-slate-50 text-[15px] font-semibold">
              {new Date(klaim.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} Pukul {new Date(klaim.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-3 md:py-4 border-b border-slate-800 gap-1 md:gap-0">
            <span className="text-slate-400 text-sm font-medium">Nama Barang</span>
            <span className="text-slate-50 text-[15px] font-semibold">{klaim.itemName}</span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-3 md:py-4 border-b border-slate-800 gap-1 md:gap-0">
            <span className="text-slate-400 text-sm font-medium">Kategori</span>
            <span className="text-slate-50 text-[15px] font-semibold" style={{ textTransform: 'capitalize' }}>{klaim.category}</span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-3 md:py-4 border-b border-slate-800 gap-1 md:gap-0">
            <span className="text-slate-400 text-sm font-medium">Nominal</span>
            <span className="text-emerald-400 text-lg font-bold">{formatRupiah(klaim.amount)}</span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-3 md:py-4 gap-1 md:gap-0">
            <span className="text-slate-400 text-sm font-medium">Status</span>
            <span className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide inline-block ${statusClass}`}>
              {klaim.status?.toUpperCase() || 'PENDING'}
            </span>
          </div>

          {klaim.description && (
            <div className="flex flex-col pt-4">
              <span className="text-slate-400 text-sm font-medium">Keterangan Tambahan</span>
              <p className="mt-3 text-slate-300 text-sm leading-[1.6] bg-slate-950 p-3 rounded-lg border border-slate-800">{klaim.description}</p>
            </div>
          )}

          {klaim.adminNotes && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
              <strong>Catatan Admin:</strong>
              <p className="mt-2 text-slate-300 text-sm">{klaim.adminNotes}</p>
            </div>
          )}

          <ViewActionButtons id={klaim.id} status={klaim.status} />

          {klaim.status === 'paid' && (
            <a 
              href={`/api/cetak-pdf/${klaim.id}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block mt-6 px-5 py-3.5 bg-emerald-500 text-white rounded-lg no-underline font-semibold text-center transition-all duration-200 shadow-[0_4px_14px_rgba(16,185,129,0.39)] hover:bg-emerald-600 hover:-translate-y-[2px] active:scale-95 text-sm md:text-base"
            >
              🖨️ Unduh Bukti Pencairan (PDF)
            </a>
          )}
        </div>

        {/* Kolom Kanan: Penampil Gambar */}
        <div className="bg-slate-900/80 backdrop-blur-sm p-5 md:p-[30px] rounded-2xl border border-slate-800 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
          <h3 className="m-0 mb-5 text-lg text-slate-50 font-semibold">Lampiran Struk</h3>
          {receiptUrl ? (
            <div className="flex flex-col items-center">
              <a href={receiptUrl} target="_blank" rel="noopener noreferrer">
                {/* Menggunakan img standar agar lebih fleksibel tanpa perlu konfigurasi remotePatterns Next.js */}
                <img 
                  src={receiptUrl} 
                  alt={klaim.claimCode} 
                  className="w-full max-w-[400px] rounded-lg border border-slate-700 transition-transform duration-200 hover:scale-[1.02] object-cover"
                />
              </a>
              <p className="mt-3 text-slate-400 text-[13px]">Klik gambar untuk melihat resolusi penuh</p>
            </div>
          ) : (
            <div className="text-center p-10 text-slate-500 bg-slate-950 rounded-lg border border-dashed border-slate-700">Tidak ada lampiran gambar</div>
          )}
        </div>
      </div>
    </div>
  )
}
