'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

export default function ClickableRow({ 
  children, 
  href 
}: { 
  children: React.ReactNode
  href: string 
}) {
  const router = useRouter()
  
  return (
    <tr 
      onClick={() => router.push(href)}
      style={{ cursor: 'pointer' }}
    >
      {children}
    </tr>
  )
}
