// =========================================================================
// FILE INI ADALAH "KOKI" KITA. (Service Layer)
// Tugasnya: Menerima data dari halaman web, mengirim gambar ke database, 
// dan menyimpan teks/angka ke database.
// =========================================================================

// 1. Ini cuma "Cetakan" (Interface) supaya TypeScript tahu data apa aja yang bakal dikirim
export interface NewClaimParams {
  file: File            // File gambar struk/nota
  category: string      // Kategori (Software, Hardware, dll)
  itemName: string      // Nama barang
  description: string   // Keterangan tambahan
  amount: number        // Harga/Nominal uang
}

export interface EditClaimParams {
  klaimId: string       // ID klaim di database
  claimCode: string     // Kode klaim (contoh: REQ-2024...)
  existingReceipt: any  // Gambar struk yang lama
  file: File | null     // Gambar struk baru (kalau user ganti gambar)
  category: string
  itemName: string
  description: string
  amount: number
}

// =========================================================================
// FUNGSI 1: UPLOAD GAMBAR SAJA
// =========================================================================
/**
 * Fungsi ini tugasnya murni cuma 1: Mengunggah (Upload) file gambar ke koleksi Media.
 * Setelah berhasil, dia bakal ngasih tau "Ini loh ID gambarnya di database".
 */
async function uploadMedia(file: File, altText: string) {
  // Bikin wadah (FormData) buat nyimpen gambar biar bisa dikirim lewat internet
  const formData = new FormData()
  formData.append('file', file)
  formData.append('_payload', JSON.stringify({ alt: altText }))

  // Kirim gambar ke database Payload (Endpoint: /api/media)
  const mediaRes = await fetch('/api/media', {
    method: 'POST', // POST = Bikin baru
    body: formData,
  })

  // Baca jawaban dari database
  const mediaData = await mediaRes.json()

  // Kalau error, kasih peringatan ke layar
  if (!mediaRes.ok) {
    throw new Error(mediaData.errors?.[0]?.message || 'Gagal mengunggah foto nota.')
  }

  // Kalau sukses, kembalikan ID gambar tersebut
  return mediaData.doc.id
}


// =========================================================================
// FUNGSI 2: BIKIN KLAIM BARU
// =========================================================================
/**
 * Fungsi ini dipanggil pas user nge-klik tombol "Kirim Pengajuan Klaim" di halaman Tambah Baru.
 */
export async function submitNewClaim(params: NewClaimParams) {
  const { file, category, itemName, description, amount } = params

  if (!file) {
    throw new Error('Harap unggah foto nota (receipt).')
  }

  // LANGKAH A: Suruh fungsi uploadMedia buat nyimpen gambarnya dulu
  const mediaId = await uploadMedia(file, `Nota Klaim ${category}`)

  // LANGKAH B: Gambar udah aman, sekarang kirim teks (kategori, nama, harga) ke database
  const claimRes = await fetch('/api/reimbursements', {
    method: 'POST', // POST = Bikin data baru
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      category: category,
      itemName: itemName,
      description: description,
      amount: amount,
      receipt: mediaId, // <-- Sambungin klaim ini dengan gambar yang tadi di-upload
    }),
  })

  const claimData = await claimRes.json()

  // Kalau database nolak, kasih tau errornya
  if (!claimRes.ok) {
    throw new Error(claimData.errors?.[0]?.message || 'Gagal menyimpan data klaim.')
  }

  // Berhasil!
  return claimData
}


// =========================================================================
// FUNGSI 3: EDIT KLAIM LAMA
// =========================================================================
/**
 * Fungsi ini dipanggil pas user nge-klik tombol "Simpan Perubahan" di halaman Edit Klaim.
 */
export async function submitEditClaim(params: EditClaimParams) {
  const { klaimId, claimCode, existingReceipt, file, category, itemName, description, amount } = params

  // Anggap aja gambar struknya nggak diganti sama user (pakai gambar lama)
  let mediaId = typeof existingReceipt === 'object' ? existingReceipt?.id : existingReceipt

  // TAPI, kalau ternyata user masukin file gambar baru...
  if (file) {
    // LANGKAH A: Upload gambar barunya
    mediaId = await uploadMedia(file, `Nota Klaim Update - ${claimCode}`)
  }

  // LANGKAH B: Simpan perubahan teks-nya ke database
  // Perhatikan URL-nya ada ${klaimId}, artinya "Tolong edit klaim dengan ID ini"
  const claimRes = await fetch(`/api/reimbursements/${klaimId}`, {
    method: 'PATCH', // PATCH = Update data lama
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      category: category,
      itemName: itemName,
      description: description,
      amount: amount,
      receipt: mediaId, // <-- Update dengan gambar baru (atau tetap gambar lama)
    }),
  })

  const claimData = await claimRes.json()

  // Kalau gagal edit, kasih tau errornya
  if (!claimRes.ok) {
    throw new Error(claimData.errors?.[0]?.message || 'Gagal memperbarui data klaim.')
  }

  // Berhasil!
  return claimData
}
