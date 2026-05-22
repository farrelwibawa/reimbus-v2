'use client'

import React, { useState } from 'react'

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
        className="flex md:hidden flex-col justify-center items-center gap-[5px] bg-transparent border-none cursor-pointer p-2 z-[100]"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <span className={`w-6 h-[2px] bg-slate-50 transition-all duration-300 ease-in-out ${isOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
        <span className={`w-6 h-[2px] bg-slate-50 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-0' : ''}`} />
        <span className={`w-6 h-[2px] bg-slate-50 transition-all duration-300 ease-in-out ${isOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
      </button>

      {/* Mobile Drawer */}
      {isOpen && (
        <div 
          className="fixed top-0 left-0 w-screen h-screen bg-black/80 z-40" 
          onClick={() => setIsOpen(false)} 
        />
      )}
      <div className={`fixed top-0 right-0 w-[250px] h-screen bg-slate-800 shadow-[-5px_0_15px_rgba(0,0,0,0.5)] z-50 transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="pt-[80px] p-5 flex flex-col gap-5 h-full">
          <p className="m-0 text-base text-slate-400 border-b border-slate-700 pb-[10px]">
            Halo, <strong className="text-slate-50 block mt-1 text-lg">{userName}</strong>
          </p>
          <div className="mt-auto" onClick={() => setIsOpen(false)}>
            {logoutButton}
          </div>
        </div>
      </div>
    </>
  )
}
