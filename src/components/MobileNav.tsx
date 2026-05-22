'use client'

import React, { useState } from 'react'
import styles from '../app/(karyawan)/mobileNav.module.css'

interface MobileNavProps {
  userName: string
  logoutButton: React.ReactNode
}

export default function MobileNav({ userName, logoutButton }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Hamburger Button */}
      <button
        className={styles.hamburger}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <span className={`${styles.bar} ${isOpen ? styles.bar1Open : ''}`} />
        <span className={`${styles.bar} ${isOpen ? styles.bar2Open : ''}`} />
        <span className={`${styles.bar} ${isOpen ? styles.bar3Open : ''}`} />
      </button>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)} />
      )}
      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.drawerBody}>
          <p className={styles.drawerGreeting}>
            Halo, <strong>{userName}</strong>
          </p>
          <div className={styles.drawerLogout} onClick={() => setIsOpen(false)}>
            {logoutButton}
          </div>
        </div>
      </div>
    </>
  )
}
