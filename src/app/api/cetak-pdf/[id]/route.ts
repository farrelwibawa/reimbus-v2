import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
/**
 * API Endpoint: /api/cetak-pdf/[id]
 * Generates a PDF receipt for a paid reimbursement claim using Playwright.
 */
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { chromium } from 'playwright'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const { id } = resolvedParams

  try {
    const payload = await getPayload({ config: configPromise })
    
    // Validate authentication
    const { user } = await payload.auth({ headers: await headers() })
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Anda harus login terlebih dahulu.' }, { status: 401 })
    }
    
    // Fetch the reimbursement
    const klaim = await payload.findByID({
      collection: 'reimbursements',
      id: id,
      depth: 2, // to get employee data
    })

    if (!klaim) {
      return NextResponse.json({ error: 'Klaim tidak ditemukan' }, { status: 404 })
    }

    // Validate ownership
    const isOwner = typeof klaim.requestedBy === 'object' 
      ? (klaim.requestedBy as any).id === user.id 
      : klaim.requestedBy === user.id
      
    if (user.role !== 'admin' && !isOwner) {
      return NextResponse.json({ error: 'Forbidden: Anda tidak berhak mengunduh dokumen milik karyawan lain.' }, { status: 403 })
    }

    if (klaim.status !== 'paid') {
      return NextResponse.json({ error: 'Klaim belum berstatus PAID' }, { status: 400 })
    }

    // Prepare HTML content
    const formatRupiah = (angka: number) => {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka)
    }

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Bukti Pencairan - ${klaim.claimCode}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 40px; color: #333; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 32px; font-weight: bold; color: #0b0f19; }
        .logo span { color: #3b82f6; }
        .title { text-align: right; }
        .title h1 { margin: 0; color: #3b82f6; font-size: 24px; text-transform: uppercase; letter-spacing: 2px; }
        .title p { margin: 5px 0 0; color: #666; }
        
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px; }
        .info-box { background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; }
        .info-row { margin-bottom: 10px; }
        .info-label { font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; }
        .info-value { font-size: 16px; font-weight: 600; color: #0f172a; margin-top: 4px; }
        
        .table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
        .table th { background: #3b82f6; color: white; text-align: left; padding: 12px; font-size: 14px; }
        .table td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
        .table .total-row td { font-weight: bold; font-size: 18px; border-top: 2px solid #3b82f6; background: #eff6ff; }
        
        .footer { display: flex; justify-content: space-between; margin-top: 50px; }
        .signature { text-align: center; width: 200px; }
        .signature-line { border-bottom: 1px solid #333; height: 80px; margin-bottom: 10px; }
        
        .status-stamp {
          position: absolute;
          top: 150px;
          right: 50px;
          border: 4px solid #10b981;
          color: #10b981;
          font-size: 48px;
          font-weight: bold;
          padding: 10px 20px;
          border-radius: 10px;
          transform: rotate(-15deg);
          opacity: 0.3;
          letter-spacing: 5px;
        }
      </style>
    </head>
    <body>
      <div class="status-stamp">PAID / LUNAS</div>
      
      <div class="header">
        <div class="logo">Reimbu<span>S</span></div>
        <div class="title">
          <h1>Bukti Pencairan</h1>
          <p>Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}</p>
        </div>
      </div>

      <div class="info-grid">
        <div class="info-box">
          <div class="info-row">
            <div class="info-label">Kode Klaim</div>
            <div class="info-value">${klaim.claimCode}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Karyawan</div>
            <div class="info-value">${typeof klaim.requestedBy === 'object' ? (klaim.requestedBy as any).name : klaim.requestedBy}</div>
          </div>
        </div>
        <div class="info-box">
          <div class="info-row">
            <div class="info-label">Tanggal Pengajuan</div>
            <div class="info-value">${new Date(klaim.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Status Terakhir</div>
            <div class="info-value" style="color: #10b981;">LUNAS (PAID)</div>
          </div>
        </div>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>Deskripsi Barang / Pengeluaran</th>
            <th>Kategori</th>
            <th style="text-align: right;">Nominal</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>${klaim.itemName}</strong>
              <div style="font-size: 12px; color: #64748b; margin-top: 4px;">${klaim.description || '-'}</div>
            </td>
            <td style="text-transform: capitalize;">${klaim.category}</td>
            <td style="text-align: right;">${formatRupiah(klaim.amount)}</td>
          </tr>
          <tr class="total-row">
            <td colspan="2" style="text-align: right;">TOTAL DICAIRKAN</td>
            <td style="text-align: right; color: #3b82f6;">${formatRupiah(klaim.amount)}</td>
          </tr>
        </tbody>
      </table>

      ${klaim.adminNotes ? `
        <div style="background: #fef2f2; padding: 15px; border-left: 4px solid #ef4444; border-radius: 4px;">
          <div style="font-size: 12px; font-weight: bold; color: #ef4444; margin-bottom: 5px;">CATATAN ADMIN / FINANCE:</div>
          <div style="font-size: 14px; color: #7f1d1d;">${klaim.adminNotes}</div>
        </div>
      ` : ''}

      <div class="footer">
        <div class="signature">
          <div class="info-label">Diterima Oleh</div>
          <div class="signature-line"></div>
          <div class="info-value">${typeof klaim.requestedBy === 'object' ? (klaim.requestedBy as any).name : klaim.requestedBy}</div>
        </div>
        <div class="signature">
          <div class="info-label">Disetujui Oleh (Finance)</div>
          <div class="signature-line"></div>
          <div class="info-value">Admin PT ReimbuS</div>
        </div>
      </div>
    </body>
    </html>
    `

    // Start Playwright
    const browser = await chromium.launch({ headless: true })
    const page = await browser.newPage()
    
    await page.setContent(htmlContent, { waitUntil: 'networkidle' })
    
    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    })

    await browser.close()

    // Return the PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Bukti_Pencairan_${klaim.claimCode}.pdf"`,
      },
    })

  } catch (error: any) {
    console.error('Error generating PDF:', error)
    return NextResponse.json({ error: 'Gagal membuat PDF: ' + error.message }, { status: 500 })
  }
}
