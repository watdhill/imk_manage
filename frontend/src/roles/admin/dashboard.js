import { managementModule } from './modules/management'
import { workflowsModule } from './modules/workflows'
import { financeModule } from './modules/finance'
import { inventoryModule } from './modules/inventory'
import { adminAccountsModule } from './modules/accounts'

export const adminDashboard = {
  label: 'Administrator',
  menus: [
    { key: 'overview', label: 'Dashboard' },
    {
      key: 'management',
      label: 'Kepengurusan & Anggota',
      submenu: [
        { key: 'management.view', label: 'Lihat Data' },
        { key: 'management.input', label: 'Input Data Baru' },
      ],
    },
    {
      key: 'workflows',
      label: 'Program Kerja',
      submenu: [
        { key: 'workflows.view', label: 'Lihat Program' },
        { key: 'workflows.input', label: 'Program Baru' },
      ],
    },
    {
      key: 'finance',
      label: 'Manajemen Keuangan',
      submenu: [
        { key: 'finance.view', label: 'Lihat Laporan' },
        { key: 'finance.input', label: 'Catat Transaksi' },
      ],
    },
    {
      key: 'inventory',
      label: 'Inventaris Aset',
      submenu: [
        { key: 'inventory.view', label: 'Lihat Inventaris' },
        { key: 'inventory.input', label: 'Kelola Data Aset' },
      ],
    },
    {
      key: 'admin-users',
      label: 'Manajemen Akun',
      submenu: [
        { key: 'admin-users.view', label: 'Daftar Akun' },
        { key: 'admin-users.input', label: 'Tambah Akun' },
      ],
    },
    { key: 'settings', label: 'Pengaturan Sistem' },
  ],
  overview: {
    intro: 'Seluruh divisi, keuangan, dan aset organisasi tersinkron di sini.',
    stats: [
      { label: 'Anggota aktif', value: '124', meta: '+8 bulan ini' },
      { label: 'Proker berjalan', value: '14', meta: '4 menunggu laporan' },
      { label: 'Saldo kas', value: 'Rp 18,4 jt', meta: 'per bulan berjalan' },
      { label: 'Nota tersimpan', value: '236', meta: 'digital archive' },
    ],
    cash: [72, 54, 84, 65, 90, 58, 76],
    activities: [
      'Review laporan proker Humas',
      'Verifikasi nota sekretariat',
      'Update anggota divisi PSDM',
      'Cek saldo kas akhir minggu',
    ],
    tasks: [
      'Tinjau 3 laporan proker pending',
      'Sahkan 2 pengajuan anggaran baru',
      'Audit 5 nota yang belum diverifikasi',
    ],
    quickActions: [
      { label: 'Tambah anggota', target: 'management' },
      { label: 'Buka kas umum', target: 'finance' },
      { label: 'Lihat inventaris', target: 'inventory' },
    ],
  },
  sections: {
    management: managementModule,
    workflows: workflowsModule,
    finance: financeModule,
    inventory: inventoryModule,
    'admin-users': adminAccountsModule,
    settings: {
      title: 'Pengaturan Sistem',
      description:
        'Atur konfigurasi aplikasi, keamanan akun, dan parameter organisasi agar konsisten sebagai single source of truth.',
      items: [
        { label: 'Role Aktif', value: 'Administrator' },
        { label: 'Integrasi', value: 'Auth, Keuangan, Arsip' },
      ],
    },
  },
}