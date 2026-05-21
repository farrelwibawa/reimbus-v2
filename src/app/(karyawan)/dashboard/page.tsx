import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import styles from './dashboard.module.css'
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
    <div className={styles.pageWrapper}>
      {/* Area Konten Utama Dashboard */}
      <main className={styles.mainContent}>
        {/* Bagian Atas Halaman (Header) */}
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Dashboard <span>Karyawan</span></h1>
            <p className={styles.pageSubtitle}>Kelola dan pantau seluruh pengajuan klaim pengeluaran Anda di satu tempat.</p>
          </div>
          {/* Tombol Ajukan Klaim Baru */}
          <Link href="/dashboard/new" className={styles.addBtn}>
            + Ajukan Klaim
          </Link>
        </div>

        {/* 📊 SEKSI 1: KARTU RINGKASAN STATISTIK (SUMMARY CARDS) */}
        <div className={styles.summaryGrid}>
          {/* Kartu Status Pending */}
          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>
              <svg color="#fbbf24" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <div className={styles.summaryInfo}>
              <span className={styles.summaryLabel}>Pending</span>
              <span className={styles.summaryValue}>{countPending} <span>Claims</span></span>
            </div>
          </div>
          {/* Kartu Status Approved */}
          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>
              <svg color="#34d399" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <div className={styles.summaryInfo}>
              <span className={styles.summaryLabel}>Approved</span>
              <span className={styles.summaryValue}>{countApproved} <span>Claims</span></span>
            </div>
          </div>
          {/* Kartu Status Paid (Lunas) */}
          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>
              <svg color="#60a5fa" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
            <div className={styles.summaryInfo}>
              <span className={styles.summaryLabel}>Paid</span>
              <span className={styles.summaryValue}>{countPaid} <span>Claims</span></span>
            </div>
          </div>
          {/* Kartu Status Rejected (Ditolak) */}
          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>
              <svg color="#f87171" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
            </div>
            <div className={styles.summaryInfo}>
              <span className={styles.summaryLabel}>Rejected</span>
              <span className={styles.summaryValue}>{countRejected} <span>Claims</span></span>
            </div>
          </div>
        </div>

        {/* 🔍 SEKSI 2: KONTROL FILTER TABEL */}
        <div className={styles.tableControls}>
          <h2 className={styles.tableTitle}>Riwayat Pengajuan</h2>
          <div className={styles.filterGroup}>
            <Link href="/dashboard" className={!filterStatus || filterStatus === 'all' ? styles.activeFilter : styles.filterBtn}>Semua</Link>
            <Link href="/dashboard?status=pending" className={filterStatus === 'pending' ? styles.activeFilter : styles.filterBtn}>Pending</Link>
            <Link href="/dashboard?status=approved" className={filterStatus === 'approved' ? styles.activeFilter : styles.filterBtn}>Approved</Link>
            <Link href="/dashboard?status=paid" className={filterStatus === 'paid' ? styles.activeFilter : styles.filterBtn}>Paid</Link>
            <Link href="/dashboard?status=rejected" className={filterStatus === 'rejected' ? styles.activeFilter : styles.filterBtn}>Rejected</Link>
          </div>
        </div>

        {/* 📄 SEKSI 3: TABEL DAFTAR KLAIM */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th} style={{ width: '16%' }}>Tanggal</th>
                <th className={styles.th} style={{ width: '36%' }}>Barang</th>
                <th className={styles.th} style={{ width: '16%' }}>Kategori</th>
                <th className={styles.th} style={{ width: '16%' }}>Nominal</th>
                <th className={styles.th} style={{ width: '16%' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {displayedReimbursements.length === 0 ? (
                <tr>
                  <td colSpan={5} className={styles.tdEmpty}>
                    {filterStatus 
                      ? 'Tidak ada klaim yang cocok dengan filter ini.' 
                      : 'Belum ada klaim yang diajukan. Mulai ajukan klaim pertama Anda!'}
                  </td>
                </tr>
              ) : (
                displayedReimbursements.map((item: any) => {
                  // Menentukan warna badge berdasarkan status pengajuan
                  const statusClass = item.status === 'approved' 
                    ? styles.statusApproved 
                    : item.status === 'rejected' 
                      ? styles.statusRejected 
                      : item.status === 'paid'
                        ? styles.statusPaid
                        : styles.statusPending;

                  return (
                    // Baris tabel interaktif (bisa diklik untuk navigasi detail)
                    <ClickableRow key={item.id} href={`/dashboard/view/${item.id}`}>
                      <td className={styles.td}>
                        {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        <br/>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>
                          {new Date(item.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className={styles.tdCategory}>{item.itemName || '-'}</td>
                      <td className={styles.tdCategory}>{item.category}</td>
                      <td className={styles.td}>{formatRupiah(item.amount)}</td>
                      <td className={styles.td}>
                        {/* Badge Status Berwarna Dinamis */}
                        <span className={`${styles.statusBadge} ${statusClass}`}>
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

