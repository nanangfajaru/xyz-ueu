# Smart Public Service Jakarta

Prototipe aplikasi pelayanan publik terintegrasi Pemprov DKI Jakarta (konsep **One Access Public Service**), dibangun dengan Next.js + Tailwind CSS.

## Fitur
- **Identifikasi pengguna layanan** dengan foto wajah (kamera / unggah / mode demo) — simulasi, foto hanya diproses lokal dan tidak disimpan.
- **Beranda layanan publik**, pencarian, dan 6 kategori: administrasi kependudukan, kesehatan, pendidikan, bantuan sosial, transportasi, layanan lainnya.
- **Detail layanan**: persyaratan, alur, SLA, biaya, data once-only, dan instansi terintegrasi.
- **Formulir digital** yang terisi otomatis dari profil terverifikasi (Once-Only Administration).
- **Pemantauan status permohonan** dengan nomor tiket, linimasa, dan penilaian layanan.
- **Dashboard admin** (`/admin`): KPI, tren harian, distribusi status, penggunaan per kategori/layanan/perangkat daerah, dan pembaruan status permohonan.

## Smart Governance
| Prioritas | Implementasi di prototipe |
|---|---|
| One Access Public Service | Satu portal & satu kali identifikasi untuk semua layanan |
| Integrated Government Service | Permohonan diteruskan ke perangkat daerah terkait (simulasi) |
| Once-Only Administration | Data profil dipakai ulang di setiap formulir |
| Data-Driven Governance | Dashboard admin untuk evaluasi |
| Transparent & Participatory | Pelacakan status real-time & rating warga |

## Menjalankan
```bash
npm install
npm run dev
```

Seluruh data adalah data dummy dan disimpan di `localStorage` browser; tidak ada koneksi ke sistem pemerintah.
