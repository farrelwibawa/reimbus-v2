# Revisi 6 — Pemisahan Logika API (Separation of Concerns)

## Tujuan Revisi

V2 awal masih menyisakan beberapa komponen antarmuka (UI/Pelayan) yang melakukan pemanggilan API ke *database* (`fetch`) secara langsung. Sesuai dengan arahan revisi, logika pemrosesan data (Koki) harus dipisahkan sepenuhnya dari komponen tampilan. Revisi ini memindahkan seluruh sisa logika `fetch` dari komponen UI React ke fungsi-fungsi yang dapat diekspor di dalam layer layanan (*Service Layer*). Hasilnya adalah kode yang lebih modular, rapi, dapat digunakan ulang (*reusable*), dan mematuhi prinsip *Separation of Concerns*.

---

## Daftar File yang Berubah / Ditambah / Dihapus

| Status | File | Keterangan |
|--------|------|-----------|
| ✅ Ditambah | `src/services/authHandlers.ts` | File service baru untuk mengelola logika autentikasi (login) |
| 🔄 Diubah | `src/services/claimHandlers.ts` | Penambahan fungsi `deleteClaim` untuk menghapus klaim |
| 🔄 Diubah | `src/app/(frontend)/login/page.tsx` | Menghapus blok `fetch` API dan diganti dengan pemanggilan `loginEmployee` dari service |
| 🔄 Diubah | `src/app/(karyawan)/dashboard/view/[id]/ViewActionButtons.tsx` | Menghapus blok `fetch DELETE` API dan diganti dengan pemanggilan `deleteClaim` dari service |

---

## Penjelasan Before / After per File

### Halaman Login Karyawan (`login/page.tsx`)

**BEFORE:** Komponen UI melakukan inisiasi `fetch` secara mandiri dan menangani ekstraksi *response* dari Payload CMS.

```tsx
// BEFORE — login/page.tsx
try {
  // Komponen UI memanggil API secara langsung
  const res = await fetch('/api/employees/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.errors?.[0]?.message || 'Login gagal.')
  }

  const userRole = data.user.role
  // Lanjut routing...
```

**AFTER:** Logika `fetch` dipindahkan seluruhnya ke `src/services/authHandlers.ts`. Komponen UI hanya memanggil fungsinya saja.

```tsx
// AFTER — src/services/authHandlers.ts
export async function loginEmployee(email: string, password: string): Promise<{ role: string }> {
  const res = await fetch('/api/employees/login', { /* ... */ })
  const data = await res.json()
  if (!res.ok) throw new Error(data.errors?.[0]?.message || 'Login gagal.')
  return { role: data.user.role }
}

// AFTER — login/page.tsx
import { loginEmployee } from '@/services/authHandlers'

try {
  // Kode UI menjadi jauh lebih bersih dan terpusat
  const { role } = await loginEmployee(email, password)
  const userRole = role
  // Lanjut routing...
```

---

### Tombol Aksi Halaman Detail (`ViewActionButtons.tsx`)

**BEFORE:** Komponen UI yang bertanggung jawab menampilkan tombol Edit dan Hapus, juga mengeksekusi penghapusan data secara langsung.

```tsx
// BEFORE — ViewActionButtons.tsx
try {
  const res = await fetch(`/api/reimbursements/${id}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    throw new Error('Gagal menghapus klaim')
  }

  router.push('/dashboard')
  router.refresh()
} catch (err) {
  // ...
```

**AFTER:** Logika `fetch DELETE` dipindahkan ke `src/services/claimHandlers.ts`. Komponen tombol hanya bertugas menginisiasi eksekusi dan menangani transisi UI.

```typescript
// AFTER — src/services/claimHandlers.ts
export async function deleteClaim(id: string) {
  const res = await fetch(`/api/reimbursements/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Gagal menghapus klaim')
  return res.json()
}

// AFTER — ViewActionButtons.tsx
import { deleteClaim } from '@/services/claimHandlers'

try {
  // Hanya perlu memanggil nama fungsi
  await deleteClaim(id)

  router.push('/dashboard')
  router.refresh()
} catch (err) {
  // ...
```
