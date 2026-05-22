'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ViewActionButtons({ id, status }: { id: string, status: string }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  if (status !== 'pending') {
    return null // Opsi Edit dan Hapus hanya untuk pending
  }

  const handleDelete = async () => {
    if (!confirm('Yakin ingin membatalkan dan menghapus klaim ini?')) return
    
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/reimbursements/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Gagal menghapus klaim')
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      alert('Terjadi kesalahan saat menghapus.')
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-2.5 md:gap-4 mt-6 pt-6 border-t border-dashed border-slate-800">
      <Link href={`/dashboard/edit/${id}`} className="px-4 py-3 bg-slate-400/10 text-slate-300 rounded-lg no-underline text-sm font-semibold border border-slate-400/20 transition-all duration-200 flex-1 text-center hover:bg-slate-400/20 hover:text-slate-50 hover:border-slate-400/50 active:scale-95">
        Edit Klaim
      </Link>
      <button 
        onClick={handleDelete} 
        disabled={isDeleting} 
        className="px-4 py-3 bg-red-500/10 text-red-500 rounded-lg border border-red-500/20 text-sm font-semibold cursor-pointer transition-all duration-200 flex-1 text-center hover:bg-red-500/20 hover:border-red-500/40 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isDeleting ? 'Menghapus...' : 'Hapus Klaim'}
      </button>
    </div>
  )
}
