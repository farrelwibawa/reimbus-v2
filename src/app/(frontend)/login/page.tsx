'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useMachine } from '@xstate/react'
import { loginMachine } from '@/machines/loginMachine'

export default function UnifiedLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const [state, send] = useMachine(loginMachine)

  useEffect(() => {
    if (state.matches('success')) {
      if (state.context.role === 'admin') {
        window.location.href = '/admin'
      } else {
        router.push('/dashboard')
      }
    }
  }, [state.value, state.context.role, router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    send({ type: 'SUBMIT', email, password })
  }

  const inputClass = "px-4 py-3 rounded-lg border border-slate-700 bg-slate-950 text-slate-50 text-[15px] outline-none transition-all duration-300 focus:border-blue-400 focus:ring-[3px] focus:ring-blue-500/20 shadow-inner placeholder:text-slate-500 w-full"

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-50">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center h-[76px] px-6 md:px-10 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 box-border">
        <Link href="/" className="font-sans text-2xl font-bold leading-none text-slate-50 no-underline">
          Reimbu<span className="text-blue-500">S</span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="bg-slate-900/80 backdrop-blur-md p-8 md:p-10 rounded-2xl w-full max-w-[400px] shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-slate-800">
          <h1 className="m-0 mb-2.5 text-[28px] text-slate-50 text-center font-extrabold tracking-tight">Login ReimbuS</h1>
          <p className="m-0 mb-[30px] text-slate-400 text-sm text-center font-medium">Sistem Klaim Karyawan Terpadu</p>

          {state.context.errorMessage && <div className="bg-red-500/10 text-red-400 border border-red-500/20 p-3 rounded-lg mb-5 text-sm text-center font-medium">{state.context.errorMessage}</div>}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-300">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="nama@perusahaan.com"
                className={inputClass}
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-300">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="••••••••"
                className={inputClass}
              />
            </div>

            <button 
              type="submit" 
              disabled={state.matches('loading')} 
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-3.5 rounded-lg border-none text-[15px] font-semibold cursor-pointer transition-all duration-200 mt-2.5 hover:shadow-[0_6px_20px_rgba(59,130,246,0.5)] active:scale-95 disabled:bg-slate-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed disabled:opacity-70 disabled:transform-none disabled:shadow-none"
            >
              {state.matches('loading') ? 'Memeriksa otorisasi...' : 'Masuk'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
