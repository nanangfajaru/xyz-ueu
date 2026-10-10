// Data dummy untuk prototipe Smart Public Service Jakarta.
// Seluruh data bersifat fiktif dan tidak terhubung ke sistem pemerintah.

export type CategoryId =
  | "kependudukan"
  | "kesehatan"
  | "pendidikan"
  | "bansos"
  | "transportasi"
  | "lainnya";

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  color: string; // kelas tailwind untuk aksen
}

export const categories: Category[] = [
  { id: "kependudukan", name: "Administrasi Kependudukan", description: "KTP, KK, akta, pindah domisili", color: "bg-blue-600" },
  { id: "kesehatan", name: "Kesehatan", description: "Puskesmas, rujukan, jaminan kesehatan", color: "bg-rose-600" },
  { id: "pendidikan", name: "Pendidikan", description: "KJP Plus, PPDB, beasiswa", color: "bg-amber-600" },
  { id: "bansos", name: "Bantuan Sosial", description: "Bantuan pangan, lansia, disabilitas", color: "bg-emerald-600" },
  { id: "transportasi", name: "Transportasi", description: "JakLingko, parkir, kendaraan", color: "bg-sky-600" },
  { id: "lainnya", name: "Layanan Publik Lainnya", description: "Perizinan, pengaduan, lingkungan", color: "bg-violet-600" },
];

export type ProfileField =
  | "nik"
  | "kk"
  | "name"
  | "birthPlace"
  | "birthDate"
  | "gender"
  | "address"
  | "kelurahan"
  | "kecamatan"
  | "kota"
  | "phone"
  | "email"
  | "occupation"
  | "maritalStatus"
  | "bpjs";

export const profileFieldLabels: Record<ProfileField, string> = {
  nik: "NIK",
  kk: "Nomor KK",
  name: "Nama Lengkap",
  birthPlace: "Tempat Lahir",
  birthDate: "Tanggal Lahir",
  gender: "Jenis Kelamin",
  address: "Alamat",
  kelurahan: "Kelurahan",
  kecamatan: "Kecamatan",
  kota: "Kota Administrasi",
  phone: "Nomor HP",
  email: "Email",
  occupation: "Pekerjaan",
  maritalStatus: "Status Perkawinan",
  bpjs: "Nomor BPJS Kesehatan",
};

export interface ExtraField {
  key: string;
  label: string;
  type: "text" | "textarea" | "select" | "date" | "number";
  options?: string[];
  required?: boolean;
  placeholder?: string;
}

export interface Service {
  id: string;
  name: string;
  category: CategoryId;
  agency: string; // perangkat daerah penyelenggara
  integratedAgencies: string[]; // perangkat daerah yang terintegrasi
  description: string;
  requirements: string[];
  steps: string[];
  slaDays: number;
  fee: string;
  popular?: boolean;
  profileFields: ProfileField[]; // data yang dipakai ulang dari profil (once-only)
  extraFields: ExtraField[]; // data tambahan khusus layanan
  documents: string[]; // dokumen yang diunggah (simulasi)
}

export const services: Service[] = [
  {
    id: "ktp-el",
    name: "Pencetakan Ulang KTP-el",
    category: "kependudukan",
    agency: "Dinas Dukcapil",
    integratedAgencies: ["Kelurahan", "Kecamatan"],
    description: "Pencetakan ulang KTP elektronik karena hilang, rusak, atau perubahan data.",
    requirements: ["Fotokopi Kartu Keluarga", "Surat kehilangan dari kepolisian (jika hilang)", "KTP-el lama (jika rusak)"],
    steps: ["Ajukan permohonan daring", "Verifikasi data oleh Dukcapil", "Pencetakan KTP-el", "Pengambilan di kelurahan / dikirim"],
    slaDays: 3,
    fee: "Gratis",
    popular: true,
    profileFields: ["nik", "kk", "name", "birthPlace", "birthDate", "gender", "address", "kelurahan", "kecamatan", "phone"],
    extraFields: [
      { key: "reason", label: "Alasan Pencetakan Ulang", type: "select", options: ["Hilang", "Rusak", "Perubahan Data"], required: true },
      { key: "delivery", label: "Metode Pengambilan", type: "select", options: ["Ambil di Kelurahan", "Dikirim ke Alamat"], required: true },
    ],
    documents: ["Surat Kehilangan / Foto KTP Rusak"],
  },
  {
    id: "kartu-keluarga",
    name: "Perubahan Kartu Keluarga",
    category: "kependudukan",
    agency: "Dinas Dukcapil",
    integratedAgencies: ["Kelurahan"],
    description: "Penambahan/pengurangan anggota keluarga atau perubahan elemen data KK.",
    requirements: ["KK lama", "Akta kelahiran / akta kematian / buku nikah sesuai perubahan"],
    steps: ["Ajukan permohonan", "Verifikasi berkas", "Penerbitan KK baru (TTE)", "Unduh KK digital"],
    slaDays: 2,
    fee: "Gratis",
    profileFields: ["nik", "kk", "name", "address", "kelurahan", "kecamatan", "kota", "phone"],
    extraFields: [
      { key: "changeType", label: "Jenis Perubahan", type: "select", options: ["Tambah Anggota", "Kurangi Anggota", "Perubahan Data"], required: true },
      { key: "detail", label: "Keterangan Perubahan", type: "textarea", required: true, placeholder: "Contoh: menambahkan anak kedua, lahir 2 Agustus 2026" },
    ],
    documents: ["Dokumen Pendukung Perubahan"],
  },
  {
    id: "akta-kelahiran",
    name: "Akta Kelahiran",
    category: "kependudukan",
    agency: "Dinas Dukcapil",
    integratedAgencies: ["Dinas Kesehatan", "Kelurahan"],
    description: "Penerbitan akta kelahiran untuk anak yang baru lahir, terintegrasi dengan data kelahiran fasilitas kesehatan.",
    requirements: ["Surat keterangan lahir dari faskes", "KK orang tua", "Buku nikah orang tua"],
    steps: ["Ajukan permohonan", "Validasi surat lahir dari Dinkes", "Penerbitan akta (TTE)", "Unduh akta digital"],
    slaDays: 1,
    fee: "Gratis",
    popular: true,
    profileFields: ["nik", "kk", "name", "address", "kelurahan", "phone"],
    extraFields: [
      { key: "childName", label: "Nama Anak", type: "text", required: true },
      { key: "childBirthDate", label: "Tanggal Lahir Anak", type: "date", required: true },
      { key: "hospital", label: "Tempat Persalinan", type: "text", required: true, placeholder: "RSUD / Puskesmas / Klinik" },
    ],
    documents: ["Surat Keterangan Lahir"],
  },
  {
    id: "pindah-domisili",
    name: "Surat Pindah Domisili",
    category: "kependudukan",
    agency: "Dinas Dukcapil",
    integratedAgencies: ["Kelurahan", "Kecamatan"],
    description: "Penerbitan Surat Keterangan Pindah Warga Negara Indonesia (SKPWNI).",
    requirements: ["KK", "KTP-el", "Alamat tujuan lengkap"],
    steps: ["Ajukan permohonan", "Verifikasi kelurahan", "Penerbitan SKPWNI", "Unduh dokumen"],
    slaDays: 2,
    fee: "Gratis",
    profileFields: ["nik", "kk", "name", "address", "kelurahan", "kecamatan", "kota", "phone"],
    extraFields: [
      { key: "destination", label: "Alamat Tujuan", type: "textarea", required: true },
      { key: "moveReason", label: "Alasan Pindah", type: "select", options: ["Pekerjaan", "Pendidikan", "Keluarga", "Perumahan", "Lainnya"], required: true },
    ],
    documents: [],
  },
  {
    id: "rujukan-puskesmas",
    name: "Pendaftaran Online Puskesmas",
    category: "kesehatan",
    agency: "Dinas Kesehatan",
    integratedAgencies: ["BPJS Kesehatan", "Puskesmas Kecamatan"],
    description: "Pendaftaran antrean poli di puskesmas kecamatan/kelurahan terdekat.",
    requirements: ["KTP-el / NIK", "Kartu BPJS Kesehatan (jika ada)"],
    steps: ["Pilih puskesmas & poli", "Dapatkan nomor antrean", "Datang sesuai jadwal", "Pelayanan"],
    slaDays: 1,
    fee: "Gratis (peserta JKN)",
    popular: true,
    profileFields: ["nik", "name", "birthDate", "gender", "address", "kecamatan", "phone", "bpjs"],
    extraFields: [
      { key: "clinic", label: "Poli Tujuan", type: "select", options: ["Poli Umum", "Poli Gigi", "Poli KIA", "Poli Lansia", "Poli Anak"], required: true },
      { key: "visitDate", label: "Tanggal Kunjungan", type: "date", required: true },
      { key: "complaint", label: "Keluhan Singkat", type: "textarea", placeholder: "Opsional" },
    ],
    documents: [],
  },
  {
    id: "jaminan-kesehatan",
    name: "Pendaftaran PBI Jaminan Kesehatan",
    category: "kesehatan",
    agency: "Dinas Kesehatan",
    integratedAgencies: ["Dinas Sosial", "BPJS Kesehatan", "Dukcapil"],
    description: "Pendaftaran peserta JKN yang iurannya dibayarkan Pemprov DKI Jakarta.",
    requirements: ["KTP-el DKI Jakarta", "KK", "Terdaftar di DTKS (dicek otomatis)"],
    steps: ["Ajukan permohonan", "Pengecekan DTKS oleh Dinsos", "Verifikasi Dinkes", "Kepesertaan aktif"],
    slaDays: 14,
    fee: "Gratis",
    profileFields: ["nik", "kk", "name", "birthDate", "address", "kelurahan", "kecamatan", "phone", "occupation"],
    extraFields: [
      { key: "members", label: "Jumlah Anggota Keluarga Didaftarkan", type: "number", required: true },
      { key: "faskes", label: "Faskes Tingkat Pertama Pilihan", type: "text", required: true, placeholder: "Contoh: Puskesmas Kecamatan Tebet" },
    ],
    documents: ["Surat Keterangan Tidak Mampu (opsional)"],
  },
  {
    id: "kjp-plus",
    name: "Pendaftaran KJP Plus",
    category: "pendidikan",
    agency: "Dinas Pendidikan",
    integratedAgencies: ["Dinas Sosial", "Dukcapil", "Bank DKI"],
    description: "Kartu Jakarta Pintar Plus untuk peserta didik dari keluarga tidak mampu.",
    requirements: ["KK & KTP orang tua", "Kartu pelajar / NISN", "Terdaftar di DTKS"],
    steps: ["Ajukan permohonan", "Validasi sekolah", "Pemadanan DTKS", "Penetapan penerima", "Pencairan via Bank DKI"],
    slaDays: 30,
    fee: "Gratis",
    popular: true,
    profileFields: ["nik", "kk", "name", "address", "kelurahan", "kecamatan", "phone"],
    extraFields: [
      { key: "studentName", label: "Nama Peserta Didik", type: "text", required: true },
      { key: "nisn", label: "NISN", type: "text", required: true },
      { key: "school", label: "Nama Sekolah", type: "text", required: true },
      { key: "level", label: "Jenjang", type: "select", options: ["SD/MI", "SMP/MTs", "SMA/MA", "SMK"], required: true },
    ],
    documents: ["Kartu Pelajar"],
  },
  {
    id: "ppdb",
    name: "Pendaftaran PPDB / SPMB",
    category: "pendidikan",
    agency: "Dinas Pendidikan",
    integratedAgencies: ["Dukcapil"],
    description: "Pendaftaran peserta didik baru jalur zonasi, afirmasi, dan prestasi.",
    requirements: ["Akta kelahiran", "KK minimal 1 tahun", "Rapor / ijazah"],
    steps: ["Pilih jalur & sekolah", "Verifikasi dokumen", "Seleksi", "Pengumuman", "Daftar ulang"],
    slaDays: 21,
    fee: "Gratis",
    profileFields: ["nik", "kk", "name", "address", "kelurahan", "kecamatan", "phone", "email"],
    extraFields: [
      { key: "studentName", label: "Nama Calon Peserta Didik", type: "text", required: true },
      { key: "path", label: "Jalur", type: "select", options: ["Zonasi", "Afirmasi", "Prestasi", "Perpindahan Orang Tua"], required: true },
      { key: "schoolChoice", label: "Sekolah Pilihan", type: "text", required: true },
    ],
    documents: ["Rapor / Ijazah"],
  },
  {
    id: "bantuan-pangan",
    name: "Bantuan Pangan Bersubsidi",
    category: "bansos",
    agency: "Dinas Sosial",
    integratedAgencies: ["Dinas KPKP", "Dukcapil", "Food Station"],
    description: "Pangan bersubsidi untuk penerima KJP, lansia, disabilitas, dan PPKD.",
    requirements: ["KTP-el DKI", "Terdaftar sebagai penerima program"],
    steps: ["Ajukan permohonan", "Pemadanan data penerima", "Penjadwalan pengambilan", "Pengambilan di titik distribusi"],
    slaDays: 7,
    fee: "Harga subsidi",
    profileFields: ["nik", "kk", "name", "address", "kelurahan", "kecamatan", "phone"],
    extraFields: [
      { key: "beneficiary", label: "Kategori Penerima", type: "select", options: ["Penerima KJP Plus", "Lansia (KLJ)", "Disabilitas (KPDJ)", "Anak (KAJ)", "Pekerja (KPJ)"], required: true },
      { key: "pickup", label: "Titik Pengambilan", type: "text", required: true, placeholder: "Contoh: Pasar Jaya Tebet Barat" },
    ],
    documents: [],
  },
  {
    id: "kartu-lansia",
    name: "Kartu Lansia Jakarta (KLJ)",
    category: "bansos",
    agency: "Dinas Sosial",
    integratedAgencies: ["Dukcapil", "Bank DKI"],
    description: "Bantuan sosial bagi warga lanjut usia (60 tahun ke atas) dari keluarga tidak mampu.",
    requirements: ["KTP-el DKI (usia ≥ 60 tahun)", "Terdaftar di DTKS"],
    steps: ["Ajukan permohonan", "Survei oleh pendamping sosial", "Penetapan", "Pencairan via Bank DKI"],
    slaDays: 30,
    fee: "Gratis",
    profileFields: ["nik", "kk", "name", "birthDate", "address", "kelurahan", "kecamatan", "phone"],
    extraFields: [
      { key: "elderName", label: "Nama Lansia", type: "text", required: true },
      { key: "elderNik", label: "NIK Lansia", type: "text", required: true },
      { key: "condition", label: "Kondisi Lansia", type: "textarea", placeholder: "Opsional" },
    ],
    documents: [],
  },
  {
    id: "jaklingko",
    name: "Kartu JakLingko Gratis",
    category: "transportasi",
    agency: "Dinas Perhubungan",
    integratedAgencies: ["Transjakarta", "Dukcapil", "Bank DKI"],
    description: "Kartu layanan gratis transportasi umum untuk 15 golongan warga sasaran.",
    requirements: ["KTP-el DKI", "Bukti golongan sasaran (mis. kartu pekerja, KJP, lansia)"],
    steps: ["Ajukan permohonan", "Verifikasi golongan", "Pencetakan kartu", "Pengambilan di halte/kantor"],
    slaDays: 5,
    fee: "Gratis",
    popular: true,
    profileFields: ["nik", "name", "birthDate", "address", "kota", "phone", "email", "occupation"],
    extraFields: [
      { key: "group", label: "Golongan Sasaran", type: "select", options: ["Lansia", "Pelajar KJP", "PPSU", "Guru PAUD", "Penyandang Disabilitas", "Veteran", "Pekerja UMP"], required: true },
    ],
    documents: ["Bukti Golongan Sasaran"],
  },
  {
    id: "parkir-langganan",
    name: "Parkir Berlangganan",
    category: "transportasi",
    agency: "UP Perparkiran Dishub",
    integratedAgencies: ["Bapenda"],
    description: "Langganan parkir bulanan di lokasi parkir milik Pemprov DKI.",
    requirements: ["STNK aktif", "Pajak kendaraan lunas (dicek otomatis Bapenda)"],
    steps: ["Pilih lokasi", "Validasi pajak kendaraan", "Pembayaran", "Aktivasi langganan"],
    slaDays: 1,
    fee: "Sesuai tarif lokasi",
    profileFields: ["nik", "name", "address", "phone", "email"],
    extraFields: [
      { key: "plate", label: "Nomor Polisi", type: "text", required: true, placeholder: "B 1234 XYZ" },
      { key: "vehicle", label: "Jenis Kendaraan", type: "select", options: ["Motor", "Mobil"], required: true },
      { key: "location", label: "Lokasi Parkir", type: "text", required: true },
    ],
    documents: ["Foto STNK"],
  },
  {
    id: "pengaduan",
    name: "Pengaduan Warga (CRM)",
    category: "lainnya",
    agency: "Diskominfotik",
    integratedAgencies: ["Seluruh Perangkat Daerah"],
    description: "Laporkan masalah fasilitas umum, banjir, jalan rusak, sampah, dan lainnya.",
    requirements: ["Deskripsi masalah", "Lokasi kejadian", "Foto (opsional)"],
    steps: ["Kirim laporan", "Disposisi ke SKPD terkait", "Tindak lanjut", "Laporan selesai"],
    slaDays: 3,
    fee: "Gratis",
    popular: true,
    profileFields: ["nik", "name", "phone", "email"],
    extraFields: [
      { key: "topic", label: "Topik", type: "select", options: ["Jalan Rusak", "Banjir/Genangan", "Sampah", "Penerangan Jalan", "Fasilitas Umum", "Lainnya"], required: true },
      { key: "location", label: "Lokasi Kejadian", type: "text", required: true },
      { key: "detail", label: "Uraian Laporan", type: "textarea", required: true },
    ],
    documents: ["Foto Kejadian"],
  },
  {
    id: "izin-usaha-mikro",
    name: "Izin Usaha Mikro & Kecil (IUMK)",
    category: "lainnya",
    agency: "DPMPTSP",
    integratedAgencies: ["Dinas PPKUKM", "Kelurahan"],
    description: "Perizinan usaha mikro kecil terintegrasi OSS untuk pelaku UMKM.",
    requirements: ["KTP-el", "NPWP (opsional)", "Foto lokasi usaha"],
    steps: ["Ajukan permohonan", "Verifikasi kelurahan", "Penerbitan NIB/IUMK", "Unduh izin"],
    slaDays: 3,
    fee: "Gratis",
    profileFields: ["nik", "name", "address", "kelurahan", "kecamatan", "phone", "email"],
    extraFields: [
      { key: "businessName", label: "Nama Usaha", type: "text", required: true },
      { key: "businessType", label: "Jenis Usaha", type: "select", options: ["Kuliner", "Fesyen", "Kerajinan", "Jasa", "Perdagangan"], required: true },
      { key: "businessAddress", label: "Alamat Usaha", type: "textarea", required: true },
    ],
    documents: ["Foto Lokasi Usaha"],
  },
  {
    id: "angkut-sampah",
    name: "Pengangkutan Sampah Besar",
    category: "lainnya",
    agency: "Dinas Lingkungan Hidup",
    integratedAgencies: ["Suku Dinas LH"],
    description: "Permintaan penjemputan sampah besar (kasur, lemari, puing) ke rumah warga.",
    requirements: ["Alamat penjemputan", "Jenis & perkiraan volume sampah"],
    steps: ["Ajukan permintaan", "Penjadwalan", "Penjemputan", "Selesai"],
    slaDays: 4,
    fee: "Gratis",
    profileFields: ["name", "address", "kelurahan", "kecamatan", "phone"],
    extraFields: [
      { key: "items", label: "Jenis Sampah", type: "text", required: true, placeholder: "Contoh: kasur, lemari kayu" },
      { key: "pickupDate", label: "Tanggal Penjemputan", type: "date", required: true },
    ],
    documents: ["Foto Sampah"],
  },
];

export interface Citizen {
  id: string;
  nik: string;
  kk: string;
  name: string;
  birthPlace: string;
  birthDate: string;
  gender: string;
  address: string;
  kelurahan: string;
  kecamatan: string;
  kota: string;
  phone: string;
  email: string;
  occupation: string;
  maritalStatus: string;
  bpjs: string;
  avatarColor: string;
}

export const citizens: Citizen[] = [
  {
    id: "w1",
    nik: "3174015708900003",
    kk: "3174010203150012",
    name: "Siti Rahmawati",
    birthPlace: "Jakarta",
    birthDate: "1990-08-17",
    gender: "Perempuan",
    address: "Jl. Tebet Barat Dalam IV No. 21, RT 005/RW 003",
    kelurahan: "Tebet Barat",
    kecamatan: "Tebet",
    kota: "Jakarta Selatan",
    phone: "0812-3456-7890",
    email: "siti.rahmawati@contoh.id",
    occupation: "Karyawan Swasta",
    maritalStatus: "Kawin",
    bpjs: "0001234567890",
    avatarColor: "bg-rose-500",
  },
  {
    id: "w2",
    nik: "3172021204850007",
    kk: "3172020905110004",
    name: "Budi Santoso",
    birthPlace: "Bogor",
    birthDate: "1985-04-12",
    gender: "Laki-laki",
    address: "Jl. Kramat Jaya Baru Blok F No. 7, RT 011/RW 008",
    kelurahan: "Tugu Utara",
    kecamatan: "Koja",
    kota: "Jakarta Utara",
    phone: "0813-9876-5432",
    email: "budi.santoso@contoh.id",
    occupation: "Wiraswasta",
    maritalStatus: "Kawin",
    bpjs: "0002345678901",
    avatarColor: "bg-sky-500",
  },
  {
    id: "w3",
    nik: "3173064101020002",
    kk: "3173061508200009",
    name: "Dewi Lestari",
    birthPlace: "Jakarta",
    birthDate: "2002-01-01",
    gender: "Perempuan",
    address: "Jl. Kembangan Raya No. 45, RT 002/RW 001",
    kelurahan: "Kembangan Selatan",
    kecamatan: "Kembangan",
    kota: "Jakarta Barat",
    phone: "0857-1122-3344",
    email: "dewi.lestari@contoh.id",
    occupation: "Mahasiswa",
    maritalStatus: "Belum Kawin",
    bpjs: "0003456789012",
    avatarColor: "bg-amber-500",
  },
];

export type Status = "Diajukan" | "Diverifikasi" | "Diproses" | "Selesai" | "Ditolak";

export const statusFlow: Status[] = ["Diajukan", "Diverifikasi", "Diproses", "Selesai"];

export const statusStyle: Record<Status, string> = {
  Diajukan: "bg-slate-100 text-slate-700 ring-slate-300",
  Diverifikasi: "bg-blue-50 text-blue-700 ring-blue-300",
  Diproses: "bg-amber-50 text-amber-700 ring-amber-300",
  Selesai: "bg-emerald-50 text-emerald-700 ring-emerald-300",
  Ditolak: "bg-rose-50 text-rose-700 ring-rose-300",
};

export interface HistoryItem {
  status: Status;
  at: string; // ISO
  note: string;
  by: string;
}

export interface Application {
  id: string; // nomor tiket
  serviceId: string;
  citizenId: string;
  citizenName: string;
  createdAt: string;
  status: Status;
  data: Record<string, string>;
  documents: string[];
  history: HistoryItem[];
  rating?: number;
  feedback?: string;
}

export function getService(id: string) {
  return services.find((s) => s.id === id);
}

export function getCategory(id: CategoryId) {
  return categories.find((c) => c.id === id)!;
}

export function makeTicket(serviceId: string, seq: number) {
  const code = serviceId.replace(/[^a-z]/g, "").slice(0, 3).toUpperCase();
  return `JKT-${code}-${String(seq).padStart(5, "0")}`;
}

// Generator deterministik agar data dashboard konsisten antar render.
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const dummyNames = [
  "Ahmad Fauzi", "Rina Marlina", "Joko Widodo Saputra", "Maria Ulfa", "Hendra Gunawan", "Nur Aini",
  "Agus Salim", "Yuliana Putri", "Rizky Pratama", "Lina Kartika", "Dedi Kurniawan", "Fitri Handayani",
  "Andi Wijaya", "Sri Wahyuni", "Bambang Hartono", "Indah Permata", "Teguh Prakoso", "Wulan Sari",
];

const agentNames = ["Petugas Dukcapil", "Verifikator Kelurahan", "Petugas Dinas", "Sistem Otomatis"];

export function seedApplications(now = Date.now()): Application[] {
  const rand = rng(20261010);
  const out: Application[] = [];
  const weights = services.map((s) => (s.popular ? 3 : 1));
  const total = weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < 140; i++) {
    let r = rand() * total;
    let idx = 0;
    while (r > weights[idx]) {
      r -= weights[idx];
      idx++;
    }
    const svc = services[idx];
    const daysAgo = Math.floor(rand() * 30);
    const created = new Date(now - daysAgo * 86400000 - Math.floor(rand() * 36000000));
    const progress = rand();
    let status: Status;
    if (daysAgo < 1) status = progress < 0.6 ? "Diajukan" : "Diverifikasi";
    else if (progress < 0.08) status = "Ditolak";
    else if (progress < 0.2) status = "Diajukan";
    else if (progress < 0.35) status = "Diverifikasi";
    else if (progress < 0.55) status = "Diproses";
    else status = "Selesai";
    const history: HistoryItem[] = [
      { status: "Diajukan", at: created.toISOString(), note: "Permohonan diterima sistem", by: "Sistem Otomatis" },
    ];
    const reach = status === "Ditolak" ? 1 : statusFlow.indexOf(status);
    for (let k = 1; k <= reach; k++) {
      history.push({
        status: statusFlow[k],
        at: new Date(created.getTime() + k * Math.max(1, daysAgo / 4) * 3600000 * 6).toISOString(),
        note: k === 3 ? "Layanan selesai, dokumen dapat diunduh" : k === 2 ? `Diproses oleh ${svc.agency}` : "Data terverifikasi otomatis via integrasi Dukcapil",
        by: agentNames[Math.floor(rand() * agentNames.length)],
      });
    }
    if (status === "Ditolak") {
      history.push({ status: "Ditolak", at: new Date(created.getTime() + 86400000).toISOString(), note: "Dokumen pendukung tidak sesuai", by: "Petugas Dinas" });
    }
    out.push({
      id: makeTicket(svc.id, 10000 + i),
      serviceId: svc.id,
      citizenId: `d${i}`,
      citizenName: dummyNames[Math.floor(rand() * dummyNames.length)],
      createdAt: created.toISOString(),
      status,
      data: {},
      documents: [],
      history,
      rating: status === "Selesai" && rand() < 0.75 ? 3 + Math.round(rand() * 2) : undefined,
    });
  }
  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export const smartGovPriorities = [
  { title: "One Access Public Service", desc: "Satu pintu masuk digital untuk seluruh layanan lintas perangkat daerah." },
  { title: "Integrated Government Service", desc: "Permohonan diteruskan otomatis ke instansi terkait (simulasi integrasi)." },
  { title: "Once-Only Administration", desc: "Identitas cukup diverifikasi sekali, data profil dipakai ulang di setiap formulir." },
  { title: "Data-Driven Governance", desc: "Dashboard admin menyajikan statistik layanan sebagai bahan evaluasi." },
  { title: "Transparent & Participatory", desc: "Status permohonan dapat dilacak real-time dan warga memberi penilaian." },
];
