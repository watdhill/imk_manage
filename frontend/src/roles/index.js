import { adminDashboard } from './admin/dashboard'
import { bendaharaDashboard } from './bendahara/dashboard'
import { ketuaDivisiDashboard } from './ketua-divisi/dashboard'
import { anggotaDashboard } from './anggota/dashboard'

export const roleDashboards = {
  admin: adminDashboard,
  bendahara: bendaharaDashboard,
  ketua_divisi: ketuaDivisiDashboard,
  anggota: anggotaDashboard,
}

export const getDashboardByRole = (role) => {
  return roleDashboards[role] ?? anggotaDashboard
}