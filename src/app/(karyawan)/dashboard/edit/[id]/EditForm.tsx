'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { submitEditClaim } from '@/services/claimHandlers'

export default function EditForm({ klaim }: { klaim: any }) {
  const [category, setCategory] = useState(klaim.category || 'software')
  const [itemName, setItemName] = useState(klaim.itemName || '')
  const [description, setDescription] = useState(klaim.description || '')
  const [amount, setAmount] = useState(klaim.amount?.toString() || '')
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentReceiptUrl = typeof klaim.receipt === 'object' && klaim.receipt?.url 
    ? klaim.receipt.url 
    : null;
  
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

    try {
      await submitEditClaim({
        klaimId: klaim.id,
        claimCode: klaim.claimCode,
        existingReceipt: klaim.receipt,
        file,
        category,
        itemName,
        description,
        amount: Number(amount),
      })

      setSuccess('Klaim berhasil diperbarui! Mengalihkan ke dashboard...')
      
      setTimeout(() => {
        router.push('/dashboard')
        router.refresh() 
      }, 1500)

    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const inputClass = "px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-50 font-sans text-[15px] transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-500 w-full"

  return (
    <div className="max-w-[600px] mx-auto my-5 md:my-10 p-5 md:p-[30px] bg-slate-900 rounded-2xl border border-slate-800 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
      <div className="flex justify-between items-center mb-[30px] border-b border-slate-800 pb-[15px]">
        <h1 className="text-2xl font-extrabold text-slate-50 m-0 tracking-tight">Edit Klaim</h1>
        <Link href="/dashboard" className="text-slate-400 no-underline text-sm font-semibold transition-colors duration-200 hover:text-slate-300">
          &larr; Batal
        </Link>
      </div>

      {error && <div className="bg-red-500/10 text-red-400 px-4 py-3 rounded-lg border border-red-500/20 mb-6 text-sm">{error}</div>}
      {success && <div className="bg-emerald-500/10 text-emerald-400 px-4 py-3 rounded-lg border border-emerald-500/20 mb-6 text-sm">{success}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-300">Kategori</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} required className={inputClass}>
            <option value="software">Software (Langganan App/Hosting)</option>
            <option value="hardware">Hardware (Monitor/Keyboard)</option>
            <option value="transport">Transportasi (Tiket/Bensin)</option>
            <option value="pantry">Pantry (Konsumsi/Kopi)</option>
            <option value="others">Lain-lain</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-300">Nama Barang / Pengeluaran</label>
          <input 
            type="text" 
            value={itemName} 
            onChange={(e) => setItemName(e.target.value)} 
            required 
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-300">Keterangan Tambahan (Opsional)</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            rows={3}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-300">Nominal (Rp)</label>
          <input 
            type="text" 
            value={formatAmount(amount)} 
            onChange={handleAmountChange} 
            required 
            placeholder="Contoh: 150.000"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-300">Foto Nota (Struk)</label>
          <div className="bg-slate-950 border border-dashed border-slate-700 p-[15px] rounded-lg text-center flex flex-col items-center gap-3 mt-0">
            <img 
              src={previewUrl || currentReceiptUrl || ''} 
              alt="Preview Nota" 
              className="max-w-full max-h-[250px] rounded-md object-contain" 
            />
            <div className="flex gap-3">
              <button 
                type="button" 
                className="bg-amber-500/10 text-amber-500 px-4 py-2 border border-amber-500/20 rounded-md cursor-pointer text-[13px] font-semibold transition-colors duration-200 hover:bg-amber-500/20"
                onClick={() => fileInputRef.current?.click()}
              >
                {previewUrl ? 'Pilih Gambar Lain' : 'Ganti Foto Nota'}
              </button>

              {previewUrl && (
                <button 
                  type="button" 
                  className="bg-red-500/10 text-red-500 px-4 py-2 border border-red-500/20 rounded-md cursor-pointer text-[13px] font-semibold transition-colors duration-200 hover:bg-red-500/20" 
                  onClick={() => {
                    setFile(null)
                    setPreviewUrl(null)
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ''
                    }
                  }}
                >
                  Batal Ganti
                </button>
              )}
            </div>

            <input 
              type="file" 
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
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
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading || !!success} 
          className="bg-blue-500 text-white p-3.5 border-none rounded-lg font-semibold text-[15px] cursor-pointer mt-2.5 transition-all duration-200 shadow-[0_4px_14px_rgba(59,130,246,0.39)] hover:-translate-y-[2px] hover:bg-blue-600 hover:shadow-[0_6px_20px_rgba(59,130,246,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          {loading ? 'Menyimpan Perubahan...' : 'Simpan Perubahan'}
        </button>
      </form>
    </div>
  )
}
