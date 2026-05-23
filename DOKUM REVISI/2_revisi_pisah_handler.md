# Revisi 2 — Pemisahan File Handler Logika pada Form Edit

## Tujuan Revisi

Pada V1, logika API call (upload media + simpan klaim) ditulis langsung di dalam komponen UI `new/page.tsx` dan `EditForm.tsx`. Hal ini mencampur lapisan presentasi dengan lapisan logika bisnis. V2 mengekstrak seluruh logika tersebut ke sebuah _service layer_ di `src/services/claimHandlers.ts`, sehingga komponen UI hanya bertanggung jawab pada tampilan dan state management.

---

## Daftar File yang Berubah / Ditambah / Dihapus

| Status | File | Keterangan |
|--------|------|-----------|
| ✅ Ditambah | `src/services/claimHandlers.ts` | Service layer baru — berisi fungsi `uploadMedia`, `submitNewClaim`, `submitEditClaim`, beserta interface TypeScript |
| 🔄 Diubah | `src/app/(karyawan)/dashboard/edit/[id]/EditForm.tsx` | Logika `handleSubmit` diganti dengan pemanggilan `submitEditClaim()` |
| 🔄 Diubah | `src/app/(karyawan)/dashboard/new/page.tsx` | Logika `handleSubmit` diganti dengan pemanggilan `submitNewClaim()` |

---

## Penjelasan Before / After per File

### `EditForm.tsx` — Fungsi `handleSubmit`

**BEFORE (V1):** Seluruh logika fetch API (dua langkah: upload media lalu update klaim) ditulis inline di dalam `handleSubmit`. Total ±30 baris logika jaringan bercampur dengan kode UI.

```ts
// V1 — EditForm.tsx — handleSubmit (logika fetch inline)
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)

  try {
    let mediaId = typeof klaim.receipt === 'object' ? klaim.receipt.id : klaim.receipt

    // Langkah 1: Upload file baru jika ada
    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('_payload', JSON.stringify({ alt: `Nota Klaim Update - ${klaim.claimCode}` }))

      const mediaRes = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      })
      const mediaData = await mediaRes.json()
      if (!mediaRes.ok) {
        throw new Error(mediaData.errors?.[0]?.message || 'Gagal mengunggah foto nota baru.')
      }
      mediaId = mediaData.doc.id
    }

    // Langkah 2: Update data klaim
    const claimRes = await fetch(`/api/reimbursements/${klaim.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, itemName, description, amount: Number(amount), receipt: mediaId }),
    })
    const claimData = await claimRes.json()
    if (!claimRes.ok) {
      throw new Error(claimData.errors?.[0]?.message || 'Gagal memperbarui data klaim.')
    }

    setSuccess('Klaim berhasil diperbarui! Mengalihkan ke dashboard...')
    // ...
  } catch (err: any) {
    setError(err.message)
  }
}
```

**AFTER (V2):** `handleSubmit` menjadi sangat ringkas — hanya melempar parameter ke service, menangkap error, dan mengatur state UI.

```ts
// V2 — EditForm.tsx — handleSubmit (delegasi ke service)
import { submitEditClaim } from '@/services/claimHandlers'

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)

  try {
    await submitEditClaim({
      klaimId: klaim.id,
      claimCode: klaim.claimCode,
      existingReceipt: klaim.receipt,
      file,
      category,
      itemName,
      description,
      amount: Number(amount),
    })

    setSuccess('Klaim berhasil diperbarui! Mengalihkan ke dashboard...')
    setTimeout(() => {
      router.push('/dashboard')
      router.refresh()
    }, 1500)
  } catch (err: any) {
    setError(err.message)
    setLoading(false)
  }
}
```

---

### `new/page.tsx` — Fungsi `handleSubmit`

**BEFORE (V1):** Sama seperti EditForm, logika dua langkah (upload media + POST klaim) ditulis inline dengan komentar panjang.

```ts
// V1 — new/page.tsx
const handleSubmit = async (e: React.FormEvent) => {
  // ...
  // 1. Upload File ke koleksi Media via REST API Payload
  const formData = new FormData()
  formData.append('file', file)
  formData.append('_payload', JSON.stringify({ alt: `Nota Klaim ${category}` }))
  const mediaRes = await fetch('/api/media', { method: 'POST', body: formData })
  const mediaData = await mediaRes.json()
  if (!mediaRes.ok) throw new Error(...)
  const mediaId = mediaData.doc.id

  // 2. Simpan data Reimbursement
  const claimRes = await fetch('/api/reimbursements', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category, itemName, description, amount: Number(amount), receipt: mediaId }),
  })
  // ...
}
```

**AFTER (V2):** Disederhanakan menjadi satu pemanggilan fungsi.

```ts
// V2 — new/page.tsx
import { submitNewClaim } from '@/services/claimHandlers'

const handleSubmit = async (e: React.FormEvent) => {
  // ...
  try {
    await submitNewClaim({ file, category, itemName, description, amount: Number(amount) })
    setSuccess('Klaim berhasil diajukan! Mengalihkan ke dashboard...')
    // ...
  } catch (err: any) {
    setError(err.message)
  }
}
```

---

### `src/services/claimHandlers.ts` — File Baru

File ini berisi tiga fungsi dengan tanggung jawab tunggal masing-masing:

```ts
// V2 — src/services/claimHandlers.ts

// Interface TypeScript untuk type safety parameter
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

// Fungsi privat: upload gambar ke collection Media
async function uploadMedia(file: File, altText: string) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('_payload', JSON.stringify({ alt: altText }))
  const mediaRes = await fetch('/api/media', { method: 'POST', body: formData })
  const mediaData = await mediaRes.json()
  if (!mediaRes.ok) {
    throw new Error(mediaData.errors?.[0]?.message || 'Failed to upload receipt.')
  }
  return mediaData.doc.id
}

// Fungsi publik: ajukan klaim baru
export async function submitNewClaim(params: NewClaimParams) { ... }

// Fungsi publik: perbarui klaim yang sudah ada
export async function submitEditClaim(params: EditClaimParams) { ... }
```

Poin penting dari desain ini:
- `uploadMedia` adalah fungsi **privat** (tidak di-export) — hanya digunakan internal oleh `submitNewClaim` dan `submitEditClaim`, menghindari duplikasi logika upload yang ada di kedua fungsi publik.
- Semua parameter menggunakan **interface TypeScript** yang eksplisit — kompiler akan menangkap jika ada field yang terlupakan.

---