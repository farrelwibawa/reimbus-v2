/**
 * File Konstanta untuk menyimpan semua endpoint API yang digunakan di aplikasi.
 * Sesuai prinsip DRY (Don't Repeat Yourself), pemusatan URL ini mempermudah
 * pemeliharaan jika terjadi perubahan rute API di masa depan.
 */

export const API_ENDPOINTS = {
  LOGIN: '/api/employees/login',
  LOGOUT: '/api/employees/logout',
  REIMBURSEMENTS: '/api/reimbursements',
  MEDIA: '/api/media',
}
