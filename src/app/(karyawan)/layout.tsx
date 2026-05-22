import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import Navbar from '@/components/Navbar'
import '@/app/globals.css'

export const metadata = {
  title: 'Dashboard Karyawan - ReimbuS',
  description: 'Portal karyawan untuk pengajuan reimburse.',
}

export default async function KaryawanLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const payload = await getPayload({ config: configPromise })
  const headersList = await getHeaders()
  const { user } = await payload.auth({ headers: headersList })

  const userName = (user as any)?.name || user?.email || ''

  return (
    <html lang="id">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#0b0f19', color: '#f8fafc', fontFamily: "'Inter', system-ui, sans-serif", overflowX: 'hidden' }}>
        {user && <Navbar userName={userName} />}
        {children}
      </body>
    </html>
  )
}
