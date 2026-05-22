'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '../app/(karyawan)/dashboard/dashboard.module.css'

export default function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      // Memanggil endpoint logout bawaan Payload untuk menghapus HTTP-only cookie
      await fetch('/api/employees/logout', {
        method: 'POST',
      })
      
      // Kembalikan pengguna langsung ke halaman form login
      router.push('/login')
      router.refresh()
    } catch (err) {
      console.error('Gagal logout', err)
      setLoading(false)
    }
  }

  return (
    <button onClick={handleLogout} disabled={loading} className={styles.logoutBtn}>
      {loading ? 'Keluar...' : 'Keluar'}
    </button>
  )
}
