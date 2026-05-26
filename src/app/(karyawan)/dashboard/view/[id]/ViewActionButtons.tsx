'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useMachine } from '@xstate/react'
import { deleteMachine } from '@/machines/deleteMachine'

export default function ViewActionButtons({ id, status }: { id: string, status: string }) {
  const router = useRouter()
  const [state, send] = useMachine(deleteMachine)

  useEffect(() => {
    if (state.matches('success')) {
      router.push('/dashboard')
      router.refresh()
    }
  }, [state.value, router])

  if (status !== 'pending') {
    return null // Opsi Edit dan Hapus hanya untuk pending
  }

  const handleDelete = () => {
    if (!confirm('Yakin ingin membatalkan dan menghapus klaim ini?')) return
    send({ type: 'DELETE_CLICKED', id })
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col md:flex-row gap-2.5 md:gap-4 mt-6 pt-6 border-t border-dashed border-slate-800">
        <Link href={`/dashboard/edit/${id}`} className="px-4 py-3 bg-slate-400/10 text-slate-300 rounded-lg no-underline text-sm font-semibold border border-slate-400/20 transition-all duration-200 flex-1 text-center hover:bg-slate-400/20 hover:text-slate-50 hover:border-slate-400/50 active:scale-95">
          Edit Klaim
        </Link>
        <button 
          onClick={handleDelete} 
          disabled={state.matches('deleting')} 
          className="px-4 py-3 bg-red-500/10 text-red-500 rounded-lg border border-red-500/20 text-sm font-semibold cursor-pointer transition-all duration-200 flex-1 text-center hover:bg-red-500/20 hover:border-red-500/40 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {state.matches('deleting') ? 'Menghapus...' : 'Hapus Klaim'}
        </button>
      </div>
      {state.context.errorMessage && (
        <div className="mt-4 p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-sm text-center font-medium">
          {state.context.errorMessage}
        </div>
      )}
    </div>
  )
}
