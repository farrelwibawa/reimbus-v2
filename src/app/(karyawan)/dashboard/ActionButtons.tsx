import React from 'react'
import Link from 'next/link'

export default function ActionButtons({ id, status }: { id: string, status?: string }) {
  // Hanya menampilkan tombol Detail, aksi Edit dan Hapus dipindahkan ke halaman Detail
  return (
    <Link 
      href={`/dashboard/view/${id}`} 
      className="inline-block bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 text-sm font-medium transition-colors"
    >
      Detail
    </Link>
  )
}
