import React from 'react'
import Link from 'next/link'
import LogoutButton from './LogoutButton'
import MobileNav from './MobileNav'
import styles from '../app/(karyawan)/layout.module.css'

interface NavbarProps {
  userName: string
}

export default function Navbar({ userName }: NavbarProps) {
  return (
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
  )
}
