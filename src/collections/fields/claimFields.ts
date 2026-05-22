import type { Field } from 'payload'
import { categoryOptions } from './options'

// Employee claim fields

/** Unique claim code (auto-filled by beforeChange hook). */
export const claimCodeField: Field = {
  name: 'claimCode',
  type: 'text',
  admin: { readOnly: true },
}

/** Expense category. */
export const categoryField: Field = {
  name: 'category',
  type: 'select',
  required: true,
  options: categoryOptions,
}

/** Name of the item or service. */
export const itemNameField: Field = {
  name: 'itemName',
  type: 'text',
  required: true,
}

/** Additional description (optional). */
export const descriptionField: Field = {
  name: 'description',
  type: 'textarea',
  required: false,
}

/** Claim amount in IDR. */
export const amountField: Field = {
  name: 'amount',
  type: 'number',
  required: true,
}

/** Receipt/invoice photo upload. */
export const receiptField: Field = {
  name: 'receipt',
  type: 'upload',
  relationTo: 'media',
  required: true,
}
