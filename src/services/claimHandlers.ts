// Service Layer: Menangani pengajuan klaim dan upload media

export interface NewClaimParams {
  file: File
  category: string
  itemName: string
  description: string
  amount: number
}

export interface EditClaimParams {
  klaimId: string
  claimCode: string
  existingReceipt: any
  file: File | null
  category: string
  itemName: string
  description: string
  amount: number
}

/**
 * Mengupload struk/media ke collection Media Payload.
 * @returns {string} ID dokumen media yang berhasil diupload.
 */
async function uploadMedia(file: File, altText: string) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('_payload', JSON.stringify({ alt: altText }))

  const mediaRes = await fetch('/api/media', {
    method: 'POST',
    body: formData,
  })

  const mediaData = await mediaRes.json()

  if (!mediaRes.ok) {
    throw new Error(mediaData.errors?.[0]?.message || 'Failed to upload receipt.')
  }

  return mediaData.doc.id
}

/**
 * Mengajukan klaim reimbursement baru.
 */
export async function submitNewClaim(params: NewClaimParams) {
  const { file, category, itemName, description, amount } = params

  if (!file) {
    throw new Error('Please upload a receipt.')
  }

  // Upload gambar struk terlebih dahulu
  const mediaId = await uploadMedia(file, `Claim Receipt - ${category}`)

  // Simpan data klaim beserta ID media yang terkait
  const claimRes = await fetch('/api/reimbursements', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      category,
      itemName,
      description,
      amount,
      receipt: mediaId,
    }),
  })

  const claimData = await claimRes.json()

  if (!claimRes.ok) {
    throw new Error(claimData.errors?.[0]?.message || 'Failed to save claim data.')
  }

  return claimData
}

/**
 * Memperbarui data klaim reimbursement yang sudah ada.
 */
export async function submitEditClaim(params: EditClaimParams) {
  const { klaimId, claimCode, existingReceipt, file, category, itemName, description, amount } = params

  let mediaId = typeof existingReceipt === 'object' ? existingReceipt?.id : existingReceipt

  // Upload gambar baru jika ada
  if (file) {
    mediaId = await uploadMedia(file, `Claim Receipt Update - ${claimCode}`)
  }

  // Perbarui data klaim
  const claimRes = await fetch(`/api/reimbursements/${klaimId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      category,
      itemName,
      description,
      amount,
      receipt: mediaId,
    }),
  })

  const claimData = await claimRes.json()

  if (!claimRes.ok) {
    throw new Error(claimData.errors?.[0]?.message || 'Failed to update claim data.')
  }

  return claimData
}

/**
 * Menghapus data klaim reimbursement berdasarkan ID.
 */
export async function deleteClaim(id: string) {
  const res = await fetch(`/api/reimbursements/${id}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    throw new Error('Gagal menghapus klaim')
  }

  return res.json()
}

