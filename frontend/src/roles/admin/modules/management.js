export const managementModule = {
  layout: 'management',
  title: 'Manajemen Kepengurusan & Anggota',
  description:
    'Pusat data kepengurusan, anggota, pemetaan akun login, dan filter divisi dalam satu tempat.',
  overviewCards: [
    { label: 'Total anggota aktif', value: '124', note: '8 belum dipetakan ke akun' },
    { label: 'Divisi terdaftar', value: '6', note: 'Humas, Rohani, PSDM, dll' },
    { label: 'Akun pengurus', value: '18', note: 'Role admin, bendahara, ketua divisi' },
    { label: 'Anggota tanpa akun', value: '43', note: 'Hanya data organisasi' },
  ],
  filters: ['Semua divisi', 'Kestari', 'Sosroh', 'PSDM', 'KPP', 'Infokom', 'Olahraga', 'Senbudpar', 'Danus'],
  divisions: [
    { name: 'Kestari', members: 12, lead: 'Andi Pratama' },
    { name: 'Sosroh', members: 15, lead: 'Dewi Sari' },
    { name: 'PSDM', members: 22, lead: 'Dimas Nugroho' },
    { name: 'KPP', members: 16, lead: 'Budi Santoso' },
    { name: 'Infokom', members: 20, lead: 'Citra Dewi' },
    { name: 'Olahraga', members: 18, lead: 'Eka Putri' },
    { name: 'Senbudpar', members: 14, lead: 'Alya Putri' },
    { name: 'Danus', members: 16, lead: 'Rina Dewi' },
  ],
  memberDirectory: [
    { name: 'Andi Saputra', nim: '2111521012', major: 'Sistem Informasi', batch: '2021', division: 'Kestari', account: 'Terhubung' },
    { name: 'Mira Lestari', nim: '2211522031', major: 'Teknik Informatika', batch: '2022', division: 'PSDM', account: 'Terhubung' },
    { name: 'Fajar Ramadhan', nim: '2211522008', major: 'Teknik Elektro', batch: '2022', division: 'KPP', account: 'Belum ada' },
    { name: 'Nabila Zahra', nim: '2311523011', major: 'Akuntansi', batch: '2023', division: 'Sosroh', account: 'Terhubung' },
  ],
}