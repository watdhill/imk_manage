export const ketuaDivisiDashboard = {
  label: 'Ketua Divisi',
  menus: [
    { key: 'overview', label: 'Dashboard' },
    { key: 'division-members', label: 'Anggota Divisi' },
    { key: 'division-programs', label: 'Program Kerja Divisi' },
    { key: 'division-report', label: 'Laporan Proker' },
  ],
  overview: {
    intro: 'Kelola anggota divisi dan pantau program kerja yang sedang berjalan.',
    stats: [
      { label: 'Anggota divisi', value: '28', meta: 'aktif terdaftar' },
      { label: 'Proker divisi', value: '6', meta: '2 ongoing' },
      { label: 'Laporan masuk', value: '3', meta: 'butuh review' },
      { label: 'Dokumentasi', value: '17', meta: 'file tersimpan' },
    ],
    cash: [30, 46, 58, 49, 66, 61, 72],
    activities: [
      'Pantau agenda proker divisi',
      'Cek anggota baru yang masuk',
      'Review evaluasi kegiatan',
      'Upload dokumentasi program kerja',
    ],
    tasks: [
      'Validasi 2 anggota baru',
      'Selesaikan laporan proker aktif',
      'Tentukan PIC kegiatan berikutnya',
    ],
    quickActions: [
      { label: 'Anggota divisi', target: 'division-members' },
      { label: 'Program kerja', target: 'division-programs' },
      { label: 'Laporan proker', target: 'division-report' },
    ],
  },
  sections: {
    'division-members': {
      title: 'Anggota Divisi',
      description:
        'Ketua divisi mengelola data anggota di divisinya sendiri termasuk pemetaan akun login.',
      items: [
        { label: 'Kontrol Data', value: 'Khusus Divisi Sendiri' },
        { label: 'User Mapping', value: 'Opsional per anggota' },
      ],
    },
    'division-programs': {
      title: 'Program Kerja Divisi',
      description:
        'Proker diajukan, dipantau saat berjalan, dan ditutup dengan status completed saat kegiatan selesai.',
      items: [
        { label: 'Status', value: 'Planned / Ongoing / Completed' },
        { label: 'Anggaran', value: 'Estimasi dan realisasi' },
      ],
    },
    'division-report': {
      title: 'Laporan Proker',
      description:
        'Form selesai mencakup narasi evaluasi, upload dokumentasi, dan rincian nota pengeluaran kegiatan.',
      items: [
        { label: 'Konten Wajib', value: 'Evaluasi + Bukti' },
        { label: 'Dampak Keuangan', value: 'Kas berkurang otomatis' },
      ],
    },
  },
}