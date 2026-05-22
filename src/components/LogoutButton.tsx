'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

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
    <button 
      onClick={handleLogout} 
      disabled={loading} 
      className="px-5 py-2.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-red-500/20 hover:border-red-500/50 hover:-translate-y-[1px] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    >
      {loading ? 'Keluar...' : 'Keluar'}
    </button>
  )
}
