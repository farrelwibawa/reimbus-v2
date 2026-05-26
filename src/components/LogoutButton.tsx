'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMachine } from '@xstate/react'
import { logoutMachine } from '@/machines/logoutMachine'

export default function LogoutButton() {
  const router = useRouter()
  const [state, send] = useMachine(logoutMachine)

  useEffect(() => {
    if (state.matches('success')) {
      router.push('/login')
      router.refresh()
    }
  }, [state.value, router])

  const handleLogout = () => {
    send({ type: 'LOGOUT_CLICKED' })
  }

  return (
    <button 
      onClick={handleLogout} 
      disabled={state.matches('loggingOut')} 
      className="px-5 py-2.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-red-500/20 hover:border-red-500/50 hover:-translate-y-[1px] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    >
      {state.matches('loggingOut') ? 'Keluar...' : 'Keluar'}
    </button>
  )
}
