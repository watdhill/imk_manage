export const adminAccountsModule = {
  layout: 'admin-users',
  title: 'Manajemen Akun Pengurus',
  description:
    'Administrator dapat membuat akun untuk sekretaris, bendahara, dan ketua divisi dalam satu panel.',
  overviewCards: [
    { label: 'Role tersedia', value: '3', note: 'Sekre, Bendahara, Ketua Divisi' },
    { label: 'Akses pembuatan', value: 'Admin only', note: 'Dilindungi role middleware' },
  ],
  roleOptions: [
    { value: 'admin', label: 'Sekretaris (Akses Admin)' },
    { value: 'bendahara', label: 'Bendahara' },
    { value: 'ketua_divisi', label: 'Ketua Divisi' },
  ],
}
