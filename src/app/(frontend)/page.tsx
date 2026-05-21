import React from 'react'
import Link from 'next/link'
import styles from './landing.module.css'

export default function LandingPage() {
  return (
    <div className={styles.container}>
      {/* Navigation Bar */}
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          Reimbu<span>S</span>
        </Link>
        <Link href="/login" className={styles.loginBtn}>
          Masuk Sistem
        </Link>
      </nav>

      {/* Hero Section */}
      <main className={styles.hero}>
        <div className={styles.badge}>ENTERPRISE REIMBURSEMENT PLATFORM</div>
        <h1 className={styles.title}>
          Kelola Klaim Karyawan <span>Tanpa Hambatan.</span>
        </h1>
        <p className={styles.subtitle}>
          Tinggalkan proses manual. Ajukan pengeluaran, pantau persetujuan multi-level secara real-time, dan cairkan dana lebih cepat dengan infrastruktur finansial terpusat kami.
        </p>
        <Link href="/login" className={styles.ctaBtn}>
          Mulai Pengajuan &rarr;
        </Link>
      </main>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featureCard}>
          {/* Document Icon SVG */}
          <svg className={styles.featureIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <h3 className={styles.featureTitle}>Digitalisasi Dokumen</h3>
          <p className={styles.featureDesc}>Unggah nota pengeluaran secara langsung ke dalam sistem penyimpanan digital berbasis cloud yang tervalidasi.</p>
        </div>
        <div className={styles.featureCard}>
          {/* Bolt/Fast Icon SVG */}
          <svg className={styles.featureIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
          <h3 className={styles.featureTitle}>Otorisasi Terpadu</h3>
          <p className={styles.featureDesc}>Tim keuangan dapat meninjau, memberikan persetujuan, dan menyertakan catatan penolakan dalam satu dasbor terpusat.</p>
        </div>
        <div className={styles.featureCard}>
          {/* Shield Lock Icon SVG */}
          <svg className={styles.featureIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          <h3 className={styles.featureTitle}>Keamanan Tingkat Tinggi</h3>
          <p className={styles.featureDesc}>Dilengkapi dengan protokol hak akses (ACL) asimetris untuk melindungi kerahasiaan data finansial perusahaan secara absolut.</p>
        </div>
      </section>
    </div>
  )
}
