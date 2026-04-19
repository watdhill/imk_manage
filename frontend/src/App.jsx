import { useEffect, useState } from 'react'
import './App.css'
import { getDashboardByRole } from './roles'
import ManagementModule from './roles/admin/modules/ManagementModule'
import WorkflowsModule from './roles/admin/modules/WorkflowsModule'
import FinanceModule from './roles/admin/modules/FinanceModule'
import InventoryModule from './roles/admin/modules/InventoryModule'
import AdminAccountsModule from './roles/admin/modules/AdminAccountsModule'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
const STORAGE_TOKEN_KEY = 'imk_auth_token'

function App() {
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [user, setUser] = useState(null)
  const [view, setView] = useState('auth')
  const [activeMenu, setActiveMenu] = useState('overview')
  const [managementView, setManagementView] = useState('view')
  const [workflowsView, setWorkflowsView] = useState('view')
  const [financeView, setFinanceView] = useState('view')
  const [inventoryView, setInventoryView] = useState('view')
  const [adminUsersView, setAdminUsersView] = useState('view')
  const [dashboard, setDashboard] = useState(null)
  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  useEffect(() => {
    const token = window.localStorage.getItem(STORAGE_TOKEN_KEY)

    if (!token) {
      setCheckingSession(false)
      return
    }

    const loadCurrentUser = async () => {
      try {
        const response = await fetch(`${API_URL}/api/me`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Sesi login sudah berakhir.')
        }

        const data = await response.json()
        setUser(data)
        setDashboard(getDashboardByRole(data.role))
        setView('dashboard')
        setActiveMenu('overview')
        setManagementView('view')
        setWorkflowsView('view')
        setFinanceView('view')
        setInventoryView('view')
        setAdminUsersView('view')
      } catch (loadError) {
        window.localStorage.removeItem(STORAGE_TOKEN_KEY)
        setError(loadError.message)
      } finally {
        setCheckingSession(false)
      }
    }

    loadCurrentUser()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const endpoint = '/api/login'
      const payload = {
        email: form.email,
        password: form.password,
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        const firstError = data?.errors
          ? Object.values(data.errors).flat()[0]
          : data?.message

        throw new Error(firstError || 'Terjadi kesalahan saat autentikasi.')
      }

      window.localStorage.setItem(STORAGE_TOKEN_KEY, data.token)
      setUser(data.user)
      setDashboard(getDashboardByRole(data.user.role))
      setView('dashboard')
      setActiveMenu('overview')
      setManagementView('view')
      setWorkflowsView('view')
      setFinanceView('view')
      setInventoryView('view')
      setAdminUsersView('view')
      setMessage(data.message)
      setForm({
        email: '',
        password: '',
      })
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    const token = window.localStorage.getItem(STORAGE_TOKEN_KEY)

    try {
      await fetch(`${API_URL}/api/logout`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
    } finally {
      window.localStorage.removeItem(STORAGE_TOKEN_KEY)
      setUser(null)
      setDashboard(null)
      setView('auth')
      setActiveMenu('overview')
      setManagementView('view')
      setWorkflowsView('view')
      setFinanceView('view')
      setInventoryView('view')
      setAdminUsersView('view')
      setMessage('Anda telah keluar dari sistem.')
    }
  }

  const getMenusByRole = () => {
    return dashboard?.menus ?? getDashboardByRole('anggota').menus
  }

  const getRoleLabel = (role) => {
    const labels = {
      admin: 'Administrator',
      bendahara: 'Bendahara',
      ketua_divisi: 'Ketua Divisi',
      anggota: 'Anggota',
    }

    return labels[role] ?? 'Anggota'
  }

  const getCurrentRoleSection = (key) => {
    return dashboard?.sections?.[key] ?? null
  }

  const renderOverviewDashboard = () => {
    const overview = dashboard?.overview ?? getDashboardByRole('anggota').overview
    const maxCash = Math.max(...overview.cash, 1)

    return (
      <section className="dashboard-overview">
        <header className="overview-hero dashboard-block">
          <div>
            <p className="overview-kicker">Dashboard {getRoleLabel(user?.role)}</p>
            <h2>{user.name}</h2>
            <p>{overview.intro}</p>
          </div>

          <div className="overview-hero-meta">
            <div>
              <span>Status login</span>
              <strong>Aktif</strong>
            </div>
            <div>
              <span>Role</span>
              <strong>{user.role}</strong>
            </div>
            <div>
              <span>Mode akses</span>
              <strong>Sanctum token</strong>
            </div>
          </div>
        </header>

        <section className="overview-stats">
          {overview.stats.map((stat) => (
            <article key={stat.label} className="dashboard-block stat-card">
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <small>{stat.meta}</small>
            </article>
          ))}
        </section>

        <section className="overview-grid">
          <article className="dashboard-block chart-card">
            <div className="block-header">
              <div>
                <p className="overview-kicker">Kas Bulan Ini</p>
                <h3>Grafik kas masuk vs pengeluaran</h3>
              </div>
              <span>Realtime overview</span>
            </div>

            <div className="cash-chart">
              {overview.cash.map((value, index) => (
                <div key={`${value}-${index}`} className="cash-bar-wrap">
                  <div className="cash-bar" style={{ height: `${(value / maxCash) * 100}%` }} />
                </div>
              ))}
            </div>

            <div className="chart-legend">
              <span><i className="legend-income" /> Pemasukan</span>
              <span><i className="legend-expense" /> Pengeluaran</span>
              <span><i className="legend-balance" /> Saldo</span>
            </div>
          </article>

          <article className="dashboard-block activity-card">
            <div className="block-header">
              <div>
                <p className="overview-kicker">Aktivitas</p>
                <h3>Terbaru</h3>
              </div>
            </div>

            <div className="timeline-list">
              {overview.activities.map((item, index) => (
                <div key={item} className="timeline-item">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="dashboard-block task-card">
            <div className="block-header">
              <div>
                <p className="overview-kicker">Fokus Hari Ini</p>
                <h3>Checklist prioritas</h3>
              </div>
            </div>

            <ul className="task-list">
              {overview.tasks.map((task) => (
                <li key={task}>{task}</li>
              ))}
            </ul>
          </article>

          <article className="dashboard-block quick-card">
            <div className="block-header">
              <div>
                <p className="overview-kicker">Quick Actions</p>
                <h3>Menu cepat</h3>
              </div>
            </div>

            <div className="quick-actions">
              {overview.quickActions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  className="quick-action-button"
                  onClick={() => setActiveMenu(action.target)}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </article>
        </section>
      </section>
    )
  }

  const renderManagementSection = (section) => {
    return <ManagementModule section={section} viewMode={managementView} />
  }

  const renderWorkflowsSection = (section) => {
    return <WorkflowsModule section={section} viewMode={workflowsView} />
  }

  const renderFinanceSection = (section) => {
    return <FinanceModule section={section} viewMode={financeView} />
  }

  const renderInventorySection = (section) => {
    return <InventoryModule section={section} viewMode={inventoryView} />
  }

  const renderAdminUsersSection = (section) => {
    return <AdminAccountsModule section={section} viewMode={adminUsersView} />
  }

  const renderDashboardContent = () => {
    if (activeMenu === 'overview') {
      return renderOverviewDashboard()
    }
    const section = getCurrentRoleSection(activeMenu)

    if (!section) {
      return (
        <section className="dashboard-block">
          <h2>Konten belum tersedia</h2>
          <p>Menu ini belum dipetakan untuk role {getRoleLabel(user?.role)}.</p>
        </section>
      )
    }

    if (section.layout === 'management') {
      return renderManagementSection(section)
    }

    if (section.layout === 'workflows') {
      return renderWorkflowsSection(section)
    }

    if (section.layout === 'finance') {
      return renderFinanceSection(section)
    }

    if (section.layout === 'inventory') {
      return renderInventorySection(section)
    }

    if (section.layout === 'admin-users') {
      return renderAdminUsersSection(section)
    }

    return (
      <section className="dashboard-block">
        <h2>{section.title}</h2>
        <p>{section.description}</p>
        <div className="mini-grid">
          {section.items.map((item) => (
            <article key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>
      </section>
    )
  }

  if (checkingSession) {
    return (
      <main className="auth-shell">
        <div className="auth-panel auth-loading">Memeriksa sesi login...</div>
      </main>
    )
  }

  if (view === 'dashboard' && user) {
    const menus = getMenusByRole()

    return (
      <main className="dashboard-shell">
        <aside className="dashboard-menu">
          <p className="eyebrow">Dashboard</p>
          <h2>{getRoleLabel(user?.role)}</h2>
          <p className="menu-subtitle">{user.name}</p>

          <nav className="menu-list" aria-label="Menu dashboard">
            {menus.map((menu) => (
              <div key={menu.key}>
                <button
                  type="button"
                  className={activeMenu === menu.key ? 'active' : ''}
                  onClick={() => setActiveMenu(menu.key)}
                >
                  {menu.label}
                  {menu.submenu && <span className="dropdown-indicator">▼</span>}
                </button>
                {menu.submenu && activeMenu === menu.key && (
                  <div className="submenu">
                    {menu.submenu.map((submenu) => {
                      const moduleType = submenu.key.split('.')[0]
                      const modeValue = submenu.key.split('.')[1]
                      let isActive = false

                      if (moduleType === 'management') {
                        isActive = managementView === modeValue
                      } else if (moduleType === 'workflows') {
                        isActive = workflowsView === modeValue
                      } else if (moduleType === 'finance') {
                        isActive = financeView === modeValue
                      } else if (moduleType === 'inventory') {
                        isActive = inventoryView === modeValue
                      } else if (moduleType === 'admin-users') {
                        isActive = adminUsersView === modeValue
                      }

                      return (
                        <button
                          key={submenu.key}
                          type="button"
                          className={isActive ? 'active' : ''}
                          onClick={() => {
                            if (moduleType === 'management') {
                              setManagementView(modeValue)
                            } else if (moduleType === 'workflows') {
                              setWorkflowsView(modeValue)
                            } else if (moduleType === 'finance') {
                              setFinanceView(modeValue)
                            } else if (moduleType === 'inventory') {
                              setInventoryView(modeValue)
                            } else if (moduleType === 'admin-users') {
                              setAdminUsersView(modeValue)
                            }
                          }}
                        >
                          {submenu.label}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <button className="primary-button" onClick={handleLogout}>
            Logout
          </button>
        </aside>

        <section className="dashboard-content">
          <header className="dashboard-header">
            <h1>Selamat datang, {user.name}</h1>
            <p>
              Anda login sebagai{' '}
              <strong>{getRoleLabel(user?.role)}</strong>
            </p>
          </header>

          {renderDashboardContent()}
          {message ? <p className="feedback success">{message}</p> : null}
        </section>
      </main>
    )
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="login-card-title">
            <h1>Manajemen IMK UNAND</h1>
            <p>Masuk untuk mengelola data organisasi, keuangan, dan proker.</p>
          </div>

          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="nama@email.com"
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Minimal 8 karakter"
              autoComplete="current-password"
              required
            />
          </label>

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? 'Memproses...' : 'Masuk ke sistem'}
          </button>

          {error ? <p className="feedback error">{error}</p> : null}
          {message ? <p className="feedback success">{message}</p> : null}
        </form>
      </section>
    </main>
  )
}

export default App
