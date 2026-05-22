'use client'

import React from 'react'

export const StatusCell = ({ cellData }: { cellData: string }) => {
  if (!cellData) return null

  const getColors = (status: string) => {
    switch (status) {
      case 'approved':
        return { bg: '#dcfce7', color: '#166534' } // Hijau
      case 'rejected':
        return { bg: '#fee2e2', color: '#991b1b' } // Merah
      case 'paid':
        return { bg: '#dbeafe', color: '#1e40af' } // Biru
      case 'pending':
      default:
        return { bg: '#fef9c3', color: '#854d0e' } // Kuning
    }
  }

  const { bg, color } = getColors(cellData)

  return (
    <span
      style={{
        backgroundColor: bg,
        color: color,
        padding: '4px 12px',
        borderRadius: '99px',
        fontWeight: 'bold',
        fontSize: '12px',
        textTransform: 'uppercase',
        display: 'inline-block',
      }}
    >
      {cellData}
    </span>
  )
}
