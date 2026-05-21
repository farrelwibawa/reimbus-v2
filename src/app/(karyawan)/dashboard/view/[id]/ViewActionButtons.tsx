'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './view.module.css'

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
    <div className={styles.actionRow}>
      <Link href={`/dashboard/edit/${id}`} className={styles.editBtn}>
        Edit Klaim
      </Link>
      <button 
        onClick={handleDelete} 
        disabled={isDeleting} 
        className={styles.deleteBtn}
      >
        {isDeleting ? 'Menghapus...' : 'Hapus Klaim'}
      </button>
    </div>
  )
}
