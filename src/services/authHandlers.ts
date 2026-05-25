/**
 * Memproses autentikasi login karyawan ke API Payload CMS.
 * @param email Email pengguna
 * @param password Password pengguna
 * @returns Object berisi role dari user jika berhasil
 */
export async function loginEmployee(email: string, password: string): Promise<{ role: string }> {
  const res = await fetch('/api/employees/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.errors?.[0]?.message || 'Login gagal. Cek kembali email dan password.')
  }

  return { role: data.user.role }
}
