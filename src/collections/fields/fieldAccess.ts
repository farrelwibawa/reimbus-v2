import type { FieldAccess } from 'payload'

// ── Access control di level field (berbeda dari collection-level access) ──

/**
 * Hanya user dengan role `admin` yang diizinkan memperbarui field ini.
 *
 * Digunakan di:
 * - `statusField`     → karyawan tidak bisa ubah status klaim sendiri
 * - `adminNotesField` → karyawan tidak bisa menulis catatan admin
 */
export const adminOnlyUpdate: FieldAccess = ({ req: { user } }) => {
  return user?.role === 'admin'
}
