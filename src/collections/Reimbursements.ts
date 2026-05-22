import type { CollectionConfig } from 'payload'
import { reimbursementFields } from './fields'

export const Reimbursements: CollectionConfig = {
  // Nama unik collection ini di URL API: /api/reimbursements
  slug: 'reimbursements',

  // Tampilan di Admin Panel: setiap baris klaim ditampilkan dengan kode klaimnya
  admin: {
    useAsTitle: 'claimCode',
    defaultColumns: ['claimCode', 'category', 'itemName', 'description', 'status'],
  },

  // ─────────────────────────────────────────────────────────────────
  // ACCESS CONTROL (RBAC - Role Based Access Control)
  // Mengatur siapa yang boleh melakukan apa terhadap data klaim.
  // Ini adalah lapisan keamanan di level database.
  // ─────────────────────────────────────────────────────────────────
  access: {
    // READ: Admin bisa lihat semua klaim. Karyawan hanya bisa lihat klaim miliknya sendiri.
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return {
        requestedBy: {
          equals: user.id,
        },
      }
    },

    // UPDATE: Admin bisa edit semua. Karyawan hanya bisa edit jika klaim miliknya & masih Pending.
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return {
        and: [
          {
            requestedBy: {
              equals: user.id,
            },
          },
          {
            status: {
              equals: 'pending',
            },
          },
        ],
      }
    },

    // DELETE: Admin bisa hapus semua. Karyawan hanya bisa hapus jika miliknya & masih Pending.
    // Klaim yang sudah Approved/Paid/Rejected tidak bisa dihapus oleh karyawan.
    delete: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return {
        and: [
          {
            requestedBy: {
              equals: user.id,
            },
          },
          {
            status: {
              equals: 'pending',
            },
          },
        ],
      }
    },
  },

  // ─────────────────────────────────────────────────────────────────
  // HOOKS (Otomatisasi / Sensor Data)
  // Fungsi yang berjalan otomatis sebelum atau sesudah data berubah.
  // ─────────────────────────────────────────────────────────────────
  hooks: {
    // BEFORE CHANGE: Dijalankan SEBELUM data disimpan ke database
    beforeChange: [
      ({ req, operation, data, originalDoc }) => {
        if (operation === 'create') {
          // Otomatis isi field requestedBy dengan ID karyawan yang sedang login
          if (req.user) {
            data.requestedBy = req.user.id
          }

          // Otomatis generate Kode Klaim unik berformat: REQ-YYYYMMDDHHMMSS
          const now = new Date()
          const year = now.getFullYear()
          const month = String(now.getMonth() + 1).padStart(2, '0')
          const day = String(now.getDate()).padStart(2, '0')
          const hours = String(now.getHours()).padStart(2, '0')
          const minutes = String(now.getMinutes()).padStart(2, '0')
          const seconds = String(now.getSeconds()).padStart(2, '0')
          
          data.claimCode = `REQ-${year}${month}${day}${hours}${minutes}${seconds}`

        } else if (operation === 'update') {
          // Saat update: cegah perubahan requestedBy & claimCode agar tidak bisa dimanipulasi
          if (data.requestedBy) {
            delete data.requestedBy
          }
          if (data.claimCode) {
            delete data.claimCode
          }

          // Validasi: Admin WAJIB mengisi alasan (adminNotes) jika status diubah menjadi Rejected
          const currentStatus = data.status || originalDoc?.status
          if (currentStatus === 'rejected') {
            const notes = data.adminNotes !== undefined ? data.adminNotes : originalDoc?.adminNotes
            if (!notes || notes.trim() === '') {
              throw new Error('Validasi Gagal: Anda WAJIB mengisi Admin Notes (Alasan Penolakan) untuk klaim yang direject!')
            }
          }
        }
        
        return data
      },
    ],

    // AFTER CHANGE: Dijalankan SETELAH data berhasil disimpan ke database
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        // Setelah klaim baru dibuat: perbarui nama file struk agar sesuai kode klaim
        if (operation === 'create' && doc.receipt) {
          const mediaId = typeof doc.receipt === 'object' ? doc.receipt.id : doc.receipt
          
          await req.payload.update({
            collection: 'media',
            id: mediaId,
            data: {
              alt: `Nota - ${doc.claimCode}`,
            },
          })
        }

        // Setelah status klaim BERUBAH: kirim email notifikasi ke karyawan via Brevo SMTP
        if (operation === 'update' && previousDoc && doc.status !== previousDoc.status) {
          try {
            // Ambil data karyawan (nama + email) berdasarkan ID di field requestedBy
            const employeeId = typeof doc.requestedBy === 'object' ? doc.requestedBy.id : doc.requestedBy;
            if (employeeId) {
              const employee = await req.payload.findByID({ 
                collection: 'employees', 
                id: employeeId 
              });

              if (employee && employee.email) {
                // Kirim email HTML berisi rincian klaim lengkap ke inbox karyawan
                await req.payload.sendEmail({
                  to: employee.email,
                  subject: `[ReimbuS] Status Klaim Anda: ${doc.status.toUpperCase()}`,
                  html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                      <div style="background-color: #0f172a; padding: 20px; text-align: center;">
                        <h2 style="color: #f8fafc; margin: 0;">Pemberitahuan Klaim ReimbuS</h2>
                      </div>
                      <div style="padding: 20px; background-color: #f8fafc; color: #334155;">
                        <p>Halo <strong>${employee.name}</strong>,</p>
                        <p>Status pengajuan klaim Anda telah diperbarui menjadi:</p>
                        <div style="text-align: center; margin: 30px 0;">
                          <span style="background-color: #3b82f6; color: white; padding: 10px 20px; border-radius: 6px; font-weight: bold; font-size: 16px; text-transform: uppercase;">
                            ${doc.status}
                          </span>
                        </div>

                        <div style="background-color: #f1f5f9; padding: 15px; border-radius: 6px; margin-bottom: 20px; text-align: left;">
                          <h3 style="margin-top: 0; color: #1e293b; font-size: 16px; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px;">Rincian Klaim:</h3>
                          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                            <tr>
                              <td style="padding: 6px 0; color: #64748b; width: 35%;">Kode Klaim</td>
                              <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${doc.claimCode}</td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; color: #64748b;">Tanggal Pengajuan</td>
                              <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${new Date(doc.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} - ${new Date(doc.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; color: #64748b;">Nama Barang</td>
                              <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${doc.itemName}</td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; color: #64748b;">Kategori</td>
                              <td style="padding: 6px 0; color: #0f172a; font-weight: 600; text-transform: capitalize;">${doc.category}</td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; color: #64748b;">Nominal</td>
                              <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">Rp ${doc.amount.toLocaleString('id-ID')}</td>
                            </tr>
                            ${doc.description ? `
                            <tr>
                              <td style="padding: 6px 0; color: #64748b; vertical-align: top;">Keterangan</td>
                              <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${doc.description}</td>
                            </tr>` : ''}
                          </table>
                        </div>

                        ${doc.adminNotes ? `<div style="background-color: #fee2e2; padding: 15px; border-radius: 6px; margin-bottom: 20px; text-align: left;"><strong style="color: #991b1b;">Catatan Admin:</strong><br/>${doc.adminNotes}</div>` : ''}
                        <p>Silakan login ke aplikasi untuk detail lebih lanjut.</p>
                      </div>
                      <div style="background-color: #e2e8f0; padding: 15px; text-align: center; font-size: 12px; color: #64748b;">
                        Pesan ini dibuat otomatis oleh Sistem ReimbuS. Mohon tidak membalas email ini.
                      </div>
                    </div>
                  `,
                });
                console.log(`Email berhasil dikirim ke ${employee.email}`);
              }
            }
          } catch (error) {
            console.error('Gagal mengirim email notifikasi:', error);
          }
        }
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // FIELDS (Kolom-kolom data dalam tabel klaim)
  // Payload otomatis membuat form di Admin Panel berdasarkan daftar ini.
  // ─────────────────────────────────────────────────────────────────
  fields: reimbursementFields,
}
