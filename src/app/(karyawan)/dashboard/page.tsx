import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ClickableRow from './ClickableRow'

// ─────────────────────────────────────────────────────────────────
// FRONTEND PAGE: DASHBOARD UTAMA KARYAWAN
// Menggunakan Next.js Server Component (Rendering langsung di server demi kecepatan maksimal).
// ─────────────────────────────────────────────────────────────────
export default async function EmployeeDashboard(props: { searchParams: Promise<{ status?: string }> }) {
  // 1. Membaca parameter filter status pencarian dari URL (misal: ?status=paid)
  const searchParams = await props.searchParams
  const filterStatus = searchParams.status

  // 2. Menginisialisasi Payload Engine di sisi server
  const payload = await getPayload({ config: configPromise })
  const headers = await getHeaders()
  
  // 3. VALIDASI KEAMANAN FRONTEND: Memastikan user sudah login sebelum melihat dashboard
  const { user } = await payload.auth({ headers })

  // Jika belum login, otomatis tendang (redirect) karyawan ke halaman /login
  if (!user) {
    redirect('/login')
  }

  // 4. PENGAMBILAN DATA (DATABASE QUERY): Mengambil daftar klaim milik karyawan yang login
  // overrideAccess: false memastikan aturan Access Control di database tetap berjalan ketat!
  const { docs: reimbursements } = await payload.find({
    collection: 'reimbursements',
    overrideAccess: false,
    user,
    limit: 100,
  })

  // 5. LOGIKA STATISTIK (AGGREGATION): Menghitung jumlah klaim berdasarkan tiap status
  const countPending = reimbursements.filter((r) => r.status === 'pending').length
  const countApproved = reimbursements.filter((r) => r.status === 'approved').length
  const countPaid = reimbursements.filter((r) => r.status === 'paid').length
  const countRejected = reimbursements.filter((r) => r.status === 'rejected').length

  // 6. FILTER TABEL: Menyaring data yang ditampilkan berdasarkan tombol filter yang aktif
  const displayedReimbursements = filterStatus && filterStatus !== 'all' 
    ? reimbursements.filter(r => r.status === filterStatus)
    : reimbursements

  // 7. FORMAT MATA UANG: Fungsi pembantu untuk mengubah angka menjadi format Rupiah (IDR)
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Area Konten Utama Dashboard */}
      <main className="flex-1 py-6 px-4 md:py-[60px] md:px-10 max-w-[1200px] mx-auto w-full box-border">
        {/* Bagian Atas Halaman (Header) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4 md:gap-0">
          <div>
            <h1 className="text-[26px] md:text-[40px] text-slate-50 m-0 mb-3 font-extrabold tracking-tight">
              Dashboard <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">Karyawan</span>
            </h1>
            <p className="text-slate-400 m-0 text-sm md:text-base">Kelola dan pantau seluruh pengajuan klaim pengeluaran Anda di satu tempat.</p>
          </div>
          {/* Tombol Ajukan Klaim Baru */}
          <Link href="/dashboard/new" className="w-full md:w-auto text-center box-border px-7 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white no-underline rounded-lg font-semibold text-[15px] transition-all duration-300 shadow-[0_4px_14px_rgba(59,130,246,0.39)] hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(59,130,246,0.5)] active:scale-95">
            + Ajukan Klaim
          </Link>
        </div>

        {/* 📊 SEKSI 1: KARTU RINGKASAN STATISTIK (SUMMARY CARDS) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mb-[30px]">
          {/* Kartu Status Pending */}
          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-2.5 md:gap-5 shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-all duration-300 hover:scale-[1.02] hover:-translate-y-[2px] hover:shadow-[0_8px_30px_rgba(59,130,246,0.15)] hover:border-blue-500 text-center md:text-left">
            <div className="text-[18px] md:text-[28px] w-9 h-9 md:w-14 md:h-14 flex items-center justify-center bg-slate-800/50 border border-slate-700 rounded-xl">
              <svg color="#fbbf24" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] md:text-[13px] text-slate-400 font-semibold uppercase tracking-wide mb-1">Pending</span>
              <span className="text-lg md:text-2xl font-bold text-slate-50">{countPending} <span className="text-[14px] text-slate-500 font-medium">Claims</span></span>
            </div>
          </div>
          {/* Kartu Status Approved */}
          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-2.5 md:gap-5 shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-all duration-300 hover:scale-[1.02] hover:-translate-y-[2px] hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)] hover:border-emerald-500 text-center md:text-left">
            <div className="text-[18px] md:text-[28px] w-9 h-9 md:w-14 md:h-14 flex items-center justify-center bg-slate-800/50 border border-slate-700 rounded-xl">
              <svg color="#34d399" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] md:text-[13px] text-slate-400 font-semibold uppercase tracking-wide mb-1">Approved</span>
              <span className="text-lg md:text-2xl font-bold text-slate-50">{countApproved} <span className="text-[14px] text-slate-500 font-medium">Claims</span></span>
            </div>
          </div>
          {/* Kartu Status Paid (Lunas) */}
          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-2.5 md:gap-5 shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-all duration-300 hover:scale-[1.02] hover:-translate-y-[2px] hover:shadow-[0_8px_30px_rgba(59,130,246,0.15)] hover:border-blue-500 text-center md:text-left">
            <div className="text-[18px] md:text-[28px] w-9 h-9 md:w-14 md:h-14 flex items-center justify-center bg-slate-800/50 border border-slate-700 rounded-xl">
              <svg color="#60a5fa" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] md:text-[13px] text-slate-400 font-semibold uppercase tracking-wide mb-1">Paid</span>
              <span className="text-lg md:text-2xl font-bold text-slate-50">{countPaid} <span className="text-[14px] text-slate-500 font-medium">Claims</span></span>
            </div>
          </div>
          {/* Kartu Status Rejected (Ditolak) */}
          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-2.5 md:gap-5 shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-all duration-300 hover:scale-[1.02] hover:-translate-y-[2px] hover:shadow-[0_8px_30px_rgba(239,68,68,0.15)] hover:border-red-500 text-center md:text-left">
            <div className="text-[18px] md:text-[28px] w-9 h-9 md:w-14 md:h-14 flex items-center justify-center bg-slate-800/50 border border-slate-700 rounded-xl">
              <svg color="#f87171" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] md:text-[13px] text-slate-400 font-semibold uppercase tracking-wide mb-1">Rejected</span>
              <span className="text-lg md:text-2xl font-bold text-slate-50">{countRejected} <span className="text-[14px] text-slate-500 font-medium">Claims</span></span>
            </div>
          </div>
        </div>

        {/* 🔍 SEKSI 2: KONTROL FILTER TABEL */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-3 md:gap-0">
          <h2 className="text-[17px] md:text-xl font-bold text-slate-50 m-0">Riwayat Pengajuan</h2>
          <div className="flex gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 w-full md:w-auto overflow-x-auto pb-1 md:pb-1.5">
            <Link href="/dashboard" className={!filterStatus || filterStatus === 'all' ? "whitespace-nowrap px-3 md:px-4 py-1.5 md:py-2 text-[12px] md:text-[13px] font-semibold text-white no-underline rounded-md bg-blue-500 shadow-[0_2px_8px_rgba(59,130,246,0.4)]" : "whitespace-nowrap px-3 md:px-4 py-1.5 md:py-2 text-[12px] md:text-[13px] font-semibold text-slate-400 no-underline rounded-md transition-all duration-200 hover:text-slate-50 hover:bg-slate-800"}>Semua</Link>
            <Link href="/dashboard?status=pending" className={filterStatus === 'pending' ? "whitespace-nowrap px-3 md:px-4 py-1.5 md:py-2 text-[12px] md:text-[13px] font-semibold text-white no-underline rounded-md bg-blue-500 shadow-[0_2px_8px_rgba(59,130,246,0.4)]" : "whitespace-nowrap px-3 md:px-4 py-1.5 md:py-2 text-[12px] md:text-[13px] font-semibold text-slate-400 no-underline rounded-md transition-all duration-200 hover:text-slate-50 hover:bg-slate-800"}>Pending</Link>
            <Link href="/dashboard?status=approved" className={filterStatus === 'approved' ? "whitespace-nowrap px-3 md:px-4 py-1.5 md:py-2 text-[12px] md:text-[13px] font-semibold text-white no-underline rounded-md bg-blue-500 shadow-[0_2px_8px_rgba(59,130,246,0.4)]" : "whitespace-nowrap px-3 md:px-4 py-1.5 md:py-2 text-[12px] md:text-[13px] font-semibold text-slate-400 no-underline rounded-md transition-all duration-200 hover:text-slate-50 hover:bg-slate-800"}>Approved</Link>
            <Link href="/dashboard?status=paid" className={filterStatus === 'paid' ? "whitespace-nowrap px-3 md:px-4 py-1.5 md:py-2 text-[12px] md:text-[13px] font-semibold text-white no-underline rounded-md bg-blue-500 shadow-[0_2px_8px_rgba(59,130,246,0.4)]" : "whitespace-nowrap px-3 md:px-4 py-1.5 md:py-2 text-[12px] md:text-[13px] font-semibold text-slate-400 no-underline rounded-md transition-all duration-200 hover:text-slate-50 hover:bg-slate-800"}>Paid</Link>
            <Link href="/dashboard?status=rejected" className={filterStatus === 'rejected' ? "whitespace-nowrap px-3 md:px-4 py-1.5 md:py-2 text-[12px] md:text-[13px] font-semibold text-white no-underline rounded-md bg-blue-500 shadow-[0_2px_8px_rgba(59,130,246,0.4)]" : "whitespace-nowrap px-3 md:px-4 py-1.5 md:py-2 text-[12px] md:text-[13px] font-semibold text-slate-400 no-underline rounded-md transition-all duration-200 hover:text-slate-50 hover:bg-slate-800"}>Rejected</Link>
          </div>
        </div>

        {/* 📄 SEKSI 3: TABEL DAFTAR KLAIM */}
        <div className="w-full overflow-x-auto rounded-2xl shadow-none md:shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
          <table className="w-full table-fixed border-separate border-spacing-0 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden min-w-full md:min-w-[650px] text-[13px]">
            <thead>
              <tr>
                <th className="px-2.5 md:px-5 py-3 md:py-[18px] border-b border-r border-slate-800 bg-slate-950 text-center text-[11px] md:text-[13px] font-semibold text-slate-400 uppercase tracking-wide last:border-r-0" style={{ width: '16%' }}>Tanggal</th>
                <th className="px-2.5 md:px-5 py-3 md:py-[18px] border-b border-r border-slate-800 bg-slate-950 text-center text-[11px] md:text-[13px] font-semibold text-slate-400 uppercase tracking-wide last:border-r-0" style={{ width: '36%' }}>Barang</th>
                <th className="hidden md:table-cell px-2.5 md:px-5 py-3 md:py-[18px] border-b border-r border-slate-800 bg-slate-950 text-center text-[11px] md:text-[13px] font-semibold text-slate-400 uppercase tracking-wide last:border-r-0" style={{ width: '16%' }}>Kategori</th>
                <th className="hidden md:table-cell px-2.5 md:px-5 py-3 md:py-[18px] border-b border-r border-slate-800 bg-slate-950 text-center text-[11px] md:text-[13px] font-semibold text-slate-400 uppercase tracking-wide last:border-r-0" style={{ width: '16%' }}>Nominal</th>
                <th className="px-2.5 md:px-5 py-3 md:py-[18px] border-b border-r border-slate-800 bg-slate-950 text-center text-[11px] md:text-[13px] font-semibold text-slate-400 uppercase tracking-wide last:border-r-0" style={{ width: '16%' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {displayedReimbursements.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 px-5 text-center text-slate-500 text-base border-b border-slate-800 group-last:border-b-0">
                    {filterStatus 
                      ? 'Tidak ada klaim yang cocok dengan filter ini.' 
                      : 'Belum ada klaim yang diajukan. Mulai ajukan klaim pertama Anda!'}
                  </td>
                </tr>
              ) : (
                displayedReimbursements.map((item: any) => {
                  // Menentukan warna badge berdasarkan status pengajuan
                  const statusClass = item.status === 'approved' 
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                    : item.status === 'rejected' 
                      ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                      : item.status === 'paid'
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20";

                  return (
                    // Baris tabel interaktif (bisa diklik untuk navigasi detail)
                    <ClickableRow key={item.id} href={`/dashboard/view/${item.id}`} className="group hover:bg-slate-800/80 transition-all duration-300 cursor-pointer active:scale-[0.99]">
                      <td className="px-2.5 md:px-5 py-3 md:py-5 border-b border-r border-slate-800 text-center text-[13px] md:text-[15px] text-slate-300 last:border-r-0 group-last:border-b-0">
                        {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        <br/>
                        <span className="text-[12px] text-slate-500">
                          {new Date(item.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="px-2.5 md:px-5 py-3 md:py-5 border-b border-r border-slate-800 text-center capitalize font-semibold text-slate-50 last:border-r-0 group-last:border-b-0 truncate max-w-[120px] md:max-w-none" title={item.itemName}>{item.itemName || '-'}</td>
                      <td className="hidden md:table-cell px-2.5 md:px-5 py-3 md:py-5 border-b border-r border-slate-800 text-center capitalize font-semibold text-slate-50 last:border-r-0 group-last:border-b-0">{item.category}</td>
                      <td className="hidden md:table-cell px-2.5 md:px-5 py-3 md:py-5 border-b border-r border-slate-800 text-center text-[13px] md:text-[15px] text-slate-300 last:border-r-0 group-last:border-b-0">{formatRupiah(item.amount)}</td>
                      <td className="px-2.5 md:px-5 py-3 md:py-5 border-b border-r border-slate-800 text-center text-[13px] md:text-[15px] text-slate-300 last:border-r-0 group-last:border-b-0">
                        {/* Badge Status Berwarna Dinamis */}
                        <span className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide inline-block ${statusClass}`}>
                          {item.status?.toUpperCase() || 'PENDING'}
                        </span>
                      </td>
                    </ClickableRow>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
