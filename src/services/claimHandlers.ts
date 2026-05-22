// Service Layer: Handling reimbursement claims data and media uploads

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
 * Uploads receipt media to Payload Media collection.
 * @returns {string} The document ID of the uploaded media.
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
 * Submits a new reimbursement claim.
 */
export async function submitNewClaim(params: NewClaimParams) {
  const { file, category, itemName, description, amount } = params

  if (!file) {
    throw new Error('Please upload a receipt.')
  }

  // Upload receipt image first
  const mediaId = await uploadMedia(file, `Claim Receipt - ${category}`)

  // Save claim data with the associated media ID
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
 * Updates an existing reimbursement claim.
 */
export async function submitEditClaim(params: EditClaimParams) {
  const { klaimId, claimCode, existingReceipt, file, category, itemName, description, amount } = params

  let mediaId = typeof existingReceipt === 'object' ? existingReceipt?.id : existingReceipt

  // Upload new image if provided
  if (file) {
    mediaId = await uploadMedia(file, `Claim Receipt Update - ${claimCode}`)
  }

  // Update claim data
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
