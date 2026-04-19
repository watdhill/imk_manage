export const bendaharaDashboard = {
  label: 'Bendahara',
  menus: [
    { key: 'overview', label: 'Dashboard' },
    { key: 'finance', label: 'Kas Umum' },
    { key: 'receipts', label: 'Arsip Nota' },
    { key: 'monthly-report', label: 'Laporan Bulanan' },
  ],
  overview: {
    intro: 'Fokus pada pemasukan, pengeluaran, arsip nota, dan laporan bulanan.',
    stats: [
      { label: 'Pemasukan', value: 'Rp 12,7 jt', meta: 'bulan berjalan' },
      { label: 'Pengeluaran', value: 'Rp 7,9 jt', meta: 'dari 18 transaksi' },
      { label: 'Nota diverifikasi', value: '48', meta: 'siap arsip' },
      { label: 'Saldo kas', value: 'Rp 4,8 jt', meta: 'sisa periode ini' },
    ],
    cash: [42, 60, 55, 75, 48, 82, 68],
    activities: [
      'Verifikasi nota kegiatan kemarin',
      'Input transaksi iuran rutin',
      'Rekap kas mingguan',
      'Siapkan laporan bulan ini',
    ],
    tasks: [
      'Cek 5 nota belum diarsip',
      'Validasi pengeluaran proker',
      'Ekspor rekap bulanan',
    ],
    quickActions: [
      { label: 'Masuk kas', target: 'finance' },
      { label: 'Arsip nota', target: 'receipts' },
      { label: 'Laporan bulanan', target: 'monthly-report' },
    ],
  },
  sections: {
    finance: {
      title: 'Manajemen Keuangan',
      description:
        'Rekap pemasukan dan pengeluaran kas, arsip transaksi, dan kontrol aliran dana organisasi dari satu tempat.',
      items: [
        { label: 'Grafik Kas', value: 'Pemasukan vs Pengeluaran' },
        { label: 'Kas Umum', value: 'Di luar program kerja' },
      ],
    },
    receipts: {
      title: 'Arsip Nota',
      description:
        'Seluruh bukti pengeluaran tersimpan digital untuk mencegah kehilangan nota fisik dan mempermudah audit.',
      items: [
        { label: 'Status Arsip', value: 'Terverifikasi' },
        { label: 'Sumber', value: 'Kas Umum + Proker' },
      ],
    },
    'monthly-report': {
      title: 'Laporan Bulanan',
      description:
        'Rekap kas bulanan dapat diekspor ke PDF atau Excel untuk pelaporan resmi organisasi.',
      items: [
        { label: 'Format', value: 'PDF / Excel' },
        { label: 'Periode', value: 'Bulanan' },
      ],
    },
  },
}