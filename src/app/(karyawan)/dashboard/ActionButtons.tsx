import React from 'react'
import Link from 'next/link'
import styles from './dashboard.module.css'

export default function ActionButtons({ id, status }: { id: string, status?: string }) {
  // Hanya menampilkan tombol Detail, aksi Edit dan Hapus dipindahkan ke halaman Detail
  return (
    <Link href={`/dashboard/view/${id}`} className={styles.detailBtn}>
      Detail
    </Link>
  )
}
