import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import Link from 'next/link'
import LogoutButton from './dashboard/LogoutButton'
import MobileNav from './MobileNav'
import styles from './layout.module.css'

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
      <body style={{ margin: 0, padding: 0, backgroundColor: '#0b0f19', color: '#f8fafc', fontFamily: "'Inter', system-ui, sans-serif" }}>
        {user && (
          <nav className={styles.nav}>
            <Link href="/dashboard" className={styles.logo}>
              Reimbu<span>S</span>
            </Link>
            {/* Desktop Nav */}
            <div className={styles.navRight}>
              <span className={styles.userGreeting}>
                Halo, <strong>{userName}</strong>
              </span>
              <LogoutButton />
            </div>
            {/* Mobile Hamburger */}
            <MobileNav userName={userName} logoutButton={<LogoutButton />} />
          </nav>
        )}
        {children}
      </body>
    </html>
  )
}
