'use client'

import React from 'react'
import { useFormFields, useDocumentInfo } from '@payloadcms/ui'

export const PrintPdfButton: React.FC = () => {
  const statusField = useFormFields(([fields]) => fields.status)
  const { id } = useDocumentInfo()
  
  const status = statusField?.value

  if (status !== 'paid' || !id) {
    return null
  }

  return (
    <div style={{ margin: '20px 0' }}>
      <button 
        type="button"
        style={{ 
          width: '100%',
          padding: '12px', 
          backgroundColor: '#3b82f6', 
          color: 'white', 
          borderRadius: '4px',
          border: 'none',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)'
        }}
        onClick={(e) => {
          e.preventDefault()
          window.open(`/api/cetak-pdf/${id}`, '_blank')
        }}
      >
        🖨️ Cetak PDF Bukti Pencairan
      </button>
    </div>
  )
}
