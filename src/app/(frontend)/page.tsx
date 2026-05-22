import React from 'react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-50">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center h-[76px] px-5 md:px-[60px] bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 box-border">
        <Link href="/" className="font-sans text-2xl font-bold leading-none text-slate-50 no-underline">
          Reimbu<span className="text-blue-500">S</span>
        </Link>
        <Link href="/login" className="bg-blue-500/10 text-blue-500 border border-blue-500 px-6 py-2 rounded-md text-[15px] font-semibold no-underline transition-all duration-200 hover:bg-blue-500 hover:text-white active:scale-95">
          Masuk Sistem
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-5 py-[100px] max-w-[900px] mx-auto">
        <div className="bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-[1px] mb-[30px] border border-blue-500/20">ENTERPRISE REIMBURSEMENT PLATFORM</div>
        <h1 className="text-[40px] md:text-[56px] font-extrabold leading-[1.1] m-0 mb-6 tracking-tight">
          Kelola Klaim Karyawan <span className="bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">Tanpa Hambatan.</span>
        </h1>
        <p className="text-[18px] leading-[1.6] text-slate-400 m-0 mb-10 max-w-[700px]">
          Tinggalkan proses manual. Ajukan pengeluaran, pantau persetujuan multi-level secara real-time, dan cairkan dana lebih cepat dengan infrastruktur finansial terpusat kami.
        </p>
        <Link href="/login" className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-lg text-[18px] font-semibold no-underline transition-all duration-300 hover:-translate-y-[2px] active:scale-95 shadow-[0_4px_14px_rgba(59,130,246,0.39)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.5)]">
          Mulai Pengajuan &rarr;
        </Link>
      </main>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-[30px] px-5 pb-[60px] md:px-[60px] md:pb-[100px] max-w-[1200px] mx-auto">
        <div className="bg-slate-900/80 backdrop-blur-sm p-[30px] md:p-[40px] rounded-xl border border-slate-800 transition-all duration-300 hover:-translate-y-[5px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-blue-500 group">
          {/* Document Icon SVG */}
          <svg className="w-10 h-10 text-blue-500 mb-5 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <h3 className="text-[20px] font-bold m-0 mb-3 text-slate-50">Digitalisasi Dokumen</h3>
          <p className="text-[15px] leading-[1.6] text-slate-400 m-0">Unggah nota pengeluaran secara langsung ke dalam sistem penyimpanan digital berbasis cloud yang tervalidasi.</p>
        </div>
        <div className="bg-slate-900/80 backdrop-blur-sm p-[30px] md:p-[40px] rounded-xl border border-slate-800 transition-all duration-300 hover:-translate-y-[5px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-blue-500 group">
          {/* Bolt/Fast Icon SVG */}
          <svg className="w-10 h-10 text-blue-500 mb-5 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
          <h3 className="text-[20px] font-bold m-0 mb-3 text-slate-50">Otorisasi Terpadu</h3>
          <p className="text-[15px] leading-[1.6] text-slate-400 m-0">Tim keuangan dapat meninjau, memberikan persetujuan, dan menyertakan catatan penolakan dalam satu dasbor terpusat.</p>
        </div>
        <div className="bg-slate-900/80 backdrop-blur-sm p-[30px] md:p-[40px] rounded-xl border border-slate-800 transition-all duration-300 hover:-translate-y-[5px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-blue-500 group">
          {/* Shield Lock Icon SVG */}
          <svg className="w-10 h-10 text-blue-500 mb-5 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          <h3 className="text-[20px] font-bold m-0 mb-3 text-slate-50">Keamanan Tingkat Tinggi</h3>
          <p className="text-[15px] leading-[1.6] text-slate-400 m-0">Dilengkapi dengan protokol hak akses (ACL) asimetris untuk melindungi kerahasiaan data finansial perusahaan secara absolut.</p>
        </div>
      </section>
    </div>
  )
}
