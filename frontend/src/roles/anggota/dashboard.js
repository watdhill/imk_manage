export const anggotaDashboard = {
  label: 'Anggota',
  menus: [
    { key: 'overview', label: 'Dashboard' },
    { key: 'schedule', label: 'Jadwal Proker' },
  ],
  overview: {
    intro: 'Pantau jadwal kegiatan, status proker, dan informasi umum organisasi.',
    stats: [
      { label: 'Jadwal hari ini', value: '2', meta: 'agenda aktif' },
      { label: 'Proker terbuka', value: '5', meta: 'dapat diikuti' },
      { label: 'Pengumuman', value: '8', meta: 'belum dibaca' },
      { label: 'Kehadiran', value: '92%', meta: 'bulan ini' },
    ],
    cash: [20, 36, 48, 32, 50, 57, 64],
    activities: [
      'Pengumuman rapat mingguan',
      'Jadwal latihan proker',
      'Notifikasi dokumentasi kegiatan',
      'Update absensi anggota',
    ],
    tasks: [
      'Cek jadwal proker minggu ini',
      'Baca pengumuman terbaru',
      'Konfirmasi kehadiran kegiatan',
    ],
    quickActions: [
      { label: 'Lihat jadwal', target: 'schedule' },
      { label: 'Dashboard', target: 'overview' },
    ],
  },
  sections: {
    schedule: {
      title: 'Jadwal Program Kerja',
      description:
        'Anggota melihat agenda kegiatan, timeline pelaksanaan, dan status proker tanpa akses perubahan data.',
      items: [
        { label: 'Akses', value: 'Read-only' },
        { label: 'Fokus', value: 'Informasi kegiatan aktif' },
      ],
    },
  },
}