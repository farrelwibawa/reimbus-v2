'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './login.module.css'

export default function UnifiedLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Endpoint bawaan Payload CMS untuk login koleksi Employees
      const res = await fetch('/api/employees/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.errors?.[0]?.message || 'Login gagal. Cek kembali email dan password.')
      }

      // Payload otomatis mengeset HTTP-Only Cookie untuk token.
      // Kita tinggal arahkan rute berdasarkan role user yang didapat
      const userRole = data.user.role

      if (userRole === 'admin') {
        // Menggunakan window.location.href agar halaman Admin CMS ter-load dari awal
        window.location.href = '/admin'
      } else {
        // Menggunakan router Next.js untuk karyawan agar transisinya mulus (SPA)
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      {/* Navigation Bar */}
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          Reimbu<span>S</span>
        </Link>
      </nav>

      <div className={styles.content}>
        <div className={styles.card}>
          <h1 className={styles.title}>Login ReimbuS</h1>
          <p className={styles.subtitle}>Sistem Klaim Karyawan Terpadu</p>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="nama@perusahaan.com"
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="••••••••"
              />
            </div>

            <button type="submit" disabled={loading} className={styles.button}>
              {loading ? 'Memeriksa otorisasi...' : 'Masuk'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
