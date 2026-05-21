import React from 'react'
import './styles.css'

export const metadata = {
  description: 'Sistem Pengajuan Klaim Karyawan (ReimbuS) - Modern, Cepat, dan Efisien.',
  title: 'ReimbuS - Login',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
