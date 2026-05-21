import { redirect } from 'next/navigation'

export default function RedirectToCustomLogin() {
  // Tangkap semua request yang menuju /admin/login (termasuk hasil dari tombol Log out Admin Payload)
  // Dan lempar kembali ke halaman Unified Login kita di /login
  redirect('/login')
}
