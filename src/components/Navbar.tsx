import React from 'react'
import Link from 'next/link'
import LogoutButton from './LogoutButton'
import MobileNav from './MobileNav'

interface NavbarProps {
  userName: string
}

export default function Navbar({ userName }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 flex h-[76px] items-center justify-between border-b border-slate-800 bg-[#0b0f19]/90 px-5 md:px-10 backdrop-blur-md box-border">
      <Link href="/dashboard" className="text-2xl font-bold leading-none text-slate-50 no-underline">
        Reimbu<span className="text-blue-500">S</span>
      </Link>
      
      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-5">
        <span className="text-[15px] text-slate-400">
          Halo, <strong className="font-semibold text-slate-50">{userName}</strong>
        </span>
        <LogoutButton />
      </div>
      
      {/* Mobile Hamburger */}
      <MobileNav userName={userName} logoutButton={<LogoutButton />} />
    </nav>
  )
}
