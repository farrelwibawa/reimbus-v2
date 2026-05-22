'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { submitNewClaim } from '@/services/claimHandlers'
import styles from './new.module.css'

export default function TambahKlaimPage() {
  const [category, setCategory] = useState('software')
  const [itemName, setItemName] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const router = useRouter()

  const formatAmount = (val: string) => {
    if (!val) return ''
    const numberStr = val.replace(/\D/g, '')
    return numberStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '')
    setAmount(rawValue)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (!file) {
      setError('Harap unggah foto nota (receipt).')
      setLoading(false)
      return
    }

    try {
      await submitNewClaim({
        file,
        category,
        itemName,
        description,
        amount: Number(amount),
      })

      setSuccess('Klaim berhasil diajukan! Mengalihkan ke dashboard...')
      
      setTimeout(() => {
        router.push('/dashboard')
        router.refresh()
      }, 1500)

    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Ajukan Klaim Baru</h1>
        <Link href="/dashboard" className={styles.backBtn}>
          &larr; Kembali
        </Link>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label>Kategori</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="software">Software (Langganan App/Hosting)</option>
            <option value="hardware">Hardware (Monitor/Keyboard)</option>
            <option value="transport">Transportasi (Tiket/Bensin)</option>
            <option value="pantry">Pantry (Konsumsi/Kopi)</option>
            <option value="others">Lain-lain</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label>Nama Barang / Pengeluaran</label>
          <input 
            type="text" 
            value={itemName} 
            onChange={(e) => setItemName(e.target.value)} 
            required 
            placeholder="Contoh: Beli Kopi, Tiket Kereta..."
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Keterangan Tambahan (Opsional)</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Tambahkan detail alasan pengeluaran..."
            rows={3}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Nominal (Rp)</label>
          <input 
            type="text" 
            value={formatAmount(amount)} 
            onChange={handleAmountChange} 
            required 
            placeholder="Contoh: 150.000"
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Foto Nota / Struk (Image Only)</label>
          <input 
            type="file" 
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const selectedFile = e.target.files[0]
                setFile(selectedFile)
                setPreviewUrl(URL.createObjectURL(selectedFile))
              } else {
                setFile(null)
                setPreviewUrl(null)
              }
            }} 
            required={!file} // Required is true only if no file is selected
          />
          {previewUrl && (
            <div className={styles.imagePreviewWrapper}>
              <img src={previewUrl} alt="Preview Nota" className={styles.imagePreview} />
              <button 
                type="button" 
                className={styles.removeImageBtn} 
                onClick={() => {
                  setFile(null)
                  setPreviewUrl(null)
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                  }
                }}
              >
                Hapus Foto
              </button>
            </div>
          )}
        </div>

        <button type="submit" disabled={loading || !!success} className={styles.button}>
          {loading ? 'Memproses pengajuan...' : 'Kirim Pengajuan Klaim'}
        </button>
      </form>
    </div>
  )
}
