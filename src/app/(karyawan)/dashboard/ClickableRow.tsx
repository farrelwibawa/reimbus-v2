'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

export default function ClickableRow({ 
  children, 
  href,
  className
}: { 
  children: React.ReactNode
  href: string 
  className?: string
}) {
  const router = useRouter()
  
  return (
    <tr 
      onClick={() => router.push(href)}
      className={className}
      style={{ cursor: 'pointer' }}
    >
      {children}
    </tr>
  )
}
