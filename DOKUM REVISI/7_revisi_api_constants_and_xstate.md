# Revisi 7 — Ekstraksi API Constants & Implementasi XState

## Tujuan Revisi

Berdasarkan saran lanjutan dari mentor, ada dua penyempurnaan level *Enterprise* yang diterapkan pada iterasi ini:
1. **API Constants**: Memusatkan semua *endpoint URL* ke dalam satu file "Buku Alamat" agar kode tidak rentan terhadap kesalahan ketik (*typo*) dan lebih mudah dipelihara jika URL API berubah di masa depan.
2. **XState (State Machine)**: Menggantikan manajemen *state* manual untuk proses *loading, error,* dan *success* (menggunakan `useState` bawaan React) dengan arsitektur **Finite State Machine**. Ini memastikan antarmuka aplikasi terbebas dari *Impossible States* (kondisi mustahil seperti *loading* dan *error* yang menyala bersamaan) serta mencegah eksekusi ganda (*double submit*).

---

## Daftar File yang Berubah / Ditambah / Dihapus

| Status | File | Keterangan |
|--------|------|-----------|
| ✅ Ditambah | `src/constants/api.ts` | File konfigurasi baru untuk menyimpan semua rute API terpusat |
| ✅ Ditambah | `src/machines/*.ts` | Berisi 5 file mesin (login, logout, submit, edit, delete) untuk mengatur alur logika UI |
| 🔄 Diubah | `src/services/authHandlers.ts` | Mengubah *hardcoded URL* menjadi pemanggilan ke `API_ENDPOINTS` |
| 🔄 Diubah | `src/services/claimHandlers.ts` | Mengubah *hardcoded URL* menjadi pemanggilan ke `API_ENDPOINTS` |
| 🔄 Diubah | `src/app/(frontend)/login/page.tsx` | Menghapus `useState` untuk loading/error dan menggantinya dengan `useMachine(loginMachine)` |
| 🔄 Diubah | `src/app/(karyawan)/dashboard/new/page.tsx` | Mengganti `useState` dengan `useMachine(submitMachine)` |
| 🔄 Diubah | `src/app/(karyawan)/dashboard/edit/[id]/EditForm.tsx` | Mengganti `useState` dengan `useMachine(editMachine)` |
| 🔄 Diubah | `src/app/(karyawan)/dashboard/view/[id]/ViewActionButtons.tsx` | Mengganti `useState` dengan `useMachine(deleteMachine)` |
| 🔄 Diubah | `src/components/LogoutButton.tsx` | Mengganti `useState` dengan `useMachine(logoutMachine)` |

---

## Penjelasan Before / After (Contoh Kasus: Halaman Login)

### 1. Perubahan Pemanggilan API (Constants)

**BEFORE:** Tautan API diketik secara statis dan berulang-ulang di file layanan.

```typescript
// BEFORE — src/services/authHandlers.ts
const res = await fetch('/api/employees/login', { ... })
```

**AFTER:** Tautan API dibaca dari buku alamat `API_ENDPOINTS` yang terpusat.

```typescript
// AFTER — src/constants/api.ts
export const API_ENDPOINTS = {
  LOGIN: '/api/employees/login',
  // ...
}

// AFTER — src/services/authHandlers.ts
import { API_ENDPOINTS } from '@/constants/api'
const res = await fetch(API_ENDPOINTS.LOGIN, { ... })
```

---

### 2. Implementasi Mesin Status (XState)

**BEFORE:** UI menangani *state loading/error* secara manual dan rentan jebol jika diklik berkali-kali secara brutal.

```tsx
// BEFORE — login/page.tsx
const [loading, setLoading] = useState(false)
const [error, setError] = useState('')

const handleLogin = async (e) => {
  e.preventDefault()
  setLoading(true)
  setError('')
  try {
    await loginEmployee(email, password)
    // redirect...
  } catch (err) {
    setError(err.message)
    setLoading(false)
  }
}
```

**AFTER:** UI menjadi sangat bersih karena semua penanganan logika diserahkan kepada mesin XState. Tombol tidak mungkin mengirim *request* ganda.

```tsx
// AFTER — login/page.tsx
import { useMachine } from '@xstate/react'
import { loginMachine } from '@/machines/loginMachine'

const [state, send] = useMachine(loginMachine)

// Pengalihan halaman ditangani oleh mesin saat sukses
useEffect(() => {
  if (state.matches('success')) {
    router.push('/dashboard')
  }
}, [state.value])

const handleLogin = (e) => {
  e.preventDefault()
  // UI hanya mengirim pesan, mesin yang bekerja
  send({ type: 'SUBMIT', email, password })
}

// Untuk tombol: disabled={state.matches('loading')}
// Untuk error: {state.context.errorMessage}
```
