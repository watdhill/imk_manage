export const inventoryModule = {
  layout: 'inventory',
  title: 'Manajemen Inventaris Aset',
  description:
    'Pusat manajemen barang, peralatan, dan aset organisasi. Pantau kondisi, lokasi, dan ketersediaan barang.',
  overviewCards: [
    { label: 'Total aset terdaftar', value: '156', note: '24 dalam kondisi baik' },
    { label: 'Aset rusak', value: '12', note: 'Perlu perbaikan atau penggantian' },
    { label: 'Aset hilang', value: '3', note: 'Perlu penyelidikan lanjutan' },
    { label: 'Lokasi penyimpanan', value: '8', note: 'Ruang utama, gudang, divisi' },
  ],
  conditions: ['baik', 'rusak', 'hilang'],
  locations: ['Ruang Utama', 'Gudang Divisi', 'Ruang PSDM', 'Ruang Acara', 'Ruang Rohani', 'Ruang Humas', 'Ruang Konsumsi', 'Lainnya'],
  categoryGroups: [
    { label: 'Elektronik', items: 45, icon: '🖥️' },
    { label: 'Furniture', items: 38, icon: '🪑' },
    { label: 'Sound System', items: 12, icon: '🎤' },
    { label: 'Perlengkapan', items: 61, icon: '📦' },
  ],
  assets: [
    { id: 1, name: 'Laptop ASUS', category: 'Elektronik', quantity: 3, condition: 'baik', location: 'Ruang Utama', notes: 'Untuk admin dan pengurus', lastUpdated: '2026-04-05' },
    { id: 2, name: 'Proyektor', category: 'Elektronik', quantity: 2, condition: 'baik', location: 'Ruang Utama', notes: 'Untuk presentasi acara', lastUpdated: '2026-04-03' },
    { id: 3, name: 'Meja Panjang', category: 'Furniture', quantity: 8, condition: 'baik', location: 'Ruang Utama', notes: 'Meja rapat', lastUpdated: '2026-03-28' },
    { id: 4, name: 'Kursi Kerja', category: 'Furniture', quantity: 12, condition: 'rusak', location: 'Ruang PSDM', notes: '2 rusak, perlu perbaikan', lastUpdated: '2026-04-02' },
    { id: 5, name: 'Speaker Aktif', category: 'Sound System', quantity: 4, condition: 'baik', location: 'Gudang Divisi', notes: 'Speaker 15 inch', lastUpdated: '2026-04-01' },
    { id: 6, name: 'Microphone', category: 'Sound System', quantity: 6, condition: 'baik', location: 'Ruang Utama', notes: 'Wireless dan kabel', lastUpdated: '2026-04-04' },
    { id: 7, name: 'Printer Canon', category: 'Elektronik', quantity: 1, condition: 'hilang', location: 'Tidak diketahui', notes: 'Hilang sejak Maret 2026', lastUpdated: '2026-03-20' },
    { id: 8, name: 'Banner Rol', category: 'Perlengkapan', quantity: 15, condition: 'baik', location: 'Gudang Divisi', notes: 'Berbagai ukuran', lastUpdated: '2026-03-15' },
  ],
  conditionStats: {
    baik: { count: 45, percentage: 70, color: '#10b981' },
    rusak: { count: 12, percentage: 20, color: '#f59e0b' },
    hilang: { count: 3, percentage: 5, color: '#ef4444' },
    lainnya: { count: 3, percentage: 5, color: '#6b7280' },
  },
}
