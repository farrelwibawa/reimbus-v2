import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import styles from './view.module.css'
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
    ? styles.statusApproved 
    : klaim.status === 'rejected' 
      ? styles.statusRejected 
      : klaim.status === 'paid'
        ? styles.statusPaid
        : styles.statusPending;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Detail Klaim</h1>
        <Link href="/dashboard" className={styles.backBtn}>
          &larr; Kembali
        </Link>
      </div>

      <div className={styles.grid}>
        {/* Kolom Kiri: Informasi Teks */}
        <div className={styles.infoCard}>
          <div className={styles.infoRow}>
            <span className={styles.label}>Kode Klaim</span>
            <span className={styles.value}>{klaim.claimCode}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Tanggal Pengajuan</span>
            <span className={styles.value}>
              {new Date(klaim.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} Pukul {new Date(klaim.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          
          <div className={styles.infoRow}>
            <span className={styles.label}>Nama Barang</span>
            <span className={styles.value}>{klaim.itemName}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Kategori</span>
            <span className={styles.value} style={{ textTransform: 'capitalize' }}>{klaim.category}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Nominal</span>
            <span className={styles.valueHighlight}>{formatRupiah(klaim.amount)}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Status</span>
            <span className={`${styles.statusBadge} ${statusClass}`}>
              {klaim.status?.toUpperCase() || 'PENDING'}
            </span>
          </div>

          {klaim.description && (
            <div className={styles.infoRowCol}>
              <span className={styles.label}>Keterangan Tambahan</span>
              <p className={styles.descriptionText}>{klaim.description}</p>
            </div>
          )}

          {klaim.adminNotes && (
            <div className={styles.adminNotesBox}>
              <strong>Catatan Admin:</strong>
              <p>{klaim.adminNotes}</p>
            </div>
          )}

          <ViewActionButtons id={klaim.id} status={klaim.status} />

          {klaim.status === 'paid' && (
            <a 
              href={`/api/cetak-pdf/${klaim.id}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.printBtn}
            >
              🖨️ Unduh Bukti Pencairan (PDF)
            </a>
          )}
        </div>

        {/* Kolom Kanan: Penampil Gambar */}
        <div className={styles.mediaCard}>
          <h3 className={styles.mediaTitle}>Lampiran Struk</h3>
          {receiptUrl ? (
            <div className={styles.imageWrapper}>
              <a href={receiptUrl} target="_blank" rel="noopener noreferrer">
                {/* Menggunakan img standar agar lebih fleksibel tanpa perlu konfigurasi remotePatterns Next.js */}
                <img 
                  src={receiptUrl} 
                  alt={klaim.claimCode} 
                  className={styles.receiptImage}
                />
              </a>
              <p className={styles.imageHelp}>Klik gambar untuk melihat resolusi penuh</p>
            </div>
          ) : (
            <div className={styles.noImage}>Tidak ada lampiran gambar</div>
          )}
        </div>
      </div>
    </div>
  )
}
