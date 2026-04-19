import { useEffect, useMemo, useState } from 'react'
import { adminAccountsModule } from './accounts'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
const STORAGE_TOKEN_KEY = 'imk_auth_token'

function AdminAccountsModule({ section = adminAccountsModule, viewMode = 'view' }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [feedback, setFeedback] = useState({ type: '', message: '' })
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: section.roleOptions[0]?.value ?? 'admin',
  })

  const roleLabelMap = useMemo(
    () => ({
      admin: 'Sekretaris',
      bendahara: 'Bendahara',
      ketua_divisi: 'Ketua Divisi',
    }),
    []
  )

  const filteredUsers = useMemo(() => {
    const searchValue = query.trim().toLowerCase()

    return users.filter((user) => {
      if (!searchValue) {
        return true
      }

      return [user.name, user.email, roleLabelMap[user.role] ?? user.role]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(searchValue))
    })
  }, [query, roleLabelMap, users])

  const fetchUsers = async () => {
    const token = window.localStorage.getItem(STORAGE_TOKEN_KEY)
    if (!token) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/admin/users`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Gagal mengambil data akun.')
      }

      setUsers(data)
    } catch (error) {
      setFeedback({ type: 'error', message: error.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.name.trim() || !form.email.trim() || !form.password || !form.password_confirmation) {
      setFeedback({
        type: 'error',
        message: 'Lengkapi nama, email, password, dan konfirmasi password.',
      })
      return
    }

    if (form.password !== form.password_confirmation) {
      setFeedback({
        type: 'error',
        message: 'Konfirmasi password tidak cocok.',
      })
      return
    }

    const token = window.localStorage.getItem(STORAGE_TOKEN_KEY)
    if (!token) {
      setFeedback({ type: 'error', message: 'Sesi login tidak ditemukan. Silakan login ulang.' })
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          password_confirmation: form.password_confirmation,
          role: form.role,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        const firstError = data?.errors ? Object.values(data.errors).flat()[0] : data?.message
        throw new Error(firstError || 'Gagal membuat akun.')
      }

      setFeedback({
        type: 'success',
        message: `Akun ${data.user.name} (${roleLabelMap[data.user.role] ?? data.user.role}) berhasil dibuat.`,
      })
      setForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: section.roleOptions[0]?.value ?? 'admin',
      })
      await fetchUsers()
    } catch (error) {
      setFeedback({ type: 'error', message: error.message })
    } finally {
      setLoading(false)
    }
  }

  const renderViewMode = () => (
    <section className="dashboard-block accounts-layout">
      <header className="accounts-hero">
        <div>
          <p className="overview-kicker">Modul Admin</p>
          <h2>{section.title}</h2>
          <p>{section.description}</p>
        </div>
      </header>

      <section className="accounts-stats">
        {section.overviewCards.map((card) => (
          <article key={card.label} className="accounts-stat-card">
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <small>{card.note}</small>
          </article>
        ))}
      </section>

      <article className="accounts-panel">
        <div className="block-header">
          <div>
            <p className="overview-kicker">Daftar Akun</p>
            <h3>Akun pengurus terdaftar</h3>
          </div>
          <input
            type="text"
            className="search-input"
            placeholder="Cari nama atau email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Email</th>
                <th>Role</th>
                <th>Dibuat</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="asset-name">{user.name}</td>
                  <td>{user.email}</td>
                  <td>{roleLabelMap[user.role] ?? user.role}</td>
                  <td className="text-muted">{String(user.created_at ?? '').slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && filteredUsers.length === 0 && (
          <div className="empty-state">
            <p>Tidak ada akun yang cocok.</p>
          </div>
        )}
      </article>
    </section>
  )

  const renderInputMode = () => (
    <section className="dashboard-block accounts-layout">
      <header className="accounts-hero">
        <div>
          <p className="overview-kicker">Modul Admin</p>
          <h2>Tambah Akun Pengurus</h2>
          <p>Buat akun baru untuk sekretaris, bendahara, atau ketua divisi.</p>
        </div>
      </header>

      <article className="accounts-form-card">
        <form onSubmit={handleSubmit} className="accounts-form-grid">
          <label>
            Nama Lengkap
            <input name="name" value={form.name} onChange={handleChange} placeholder="Contoh: Sekretaris IMK" />
          </label>

          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="nama@email.com" />
          </label>

          <label>
            Role Akun
            <select name="role" value={form.role} onChange={handleChange}>
              {section.roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Password
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Minimal 8 karakter" />
          </label>

          <label>
            Konfirmasi Password
            <input
              name="password_confirmation"
              type="password"
              value={form.password_confirmation}
              onChange={handleChange}
              placeholder="Ulangi password"
            />
          </label>

          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Menyimpan...' : 'Buat Akun'}
          </button>
        </form>

        {feedback.message && <p className={`feedback ${feedback.type === 'error' ? 'error' : 'success'}`}>{feedback.message}</p>}
      </article>
    </section>
  )

  return viewMode === 'input' ? renderInputMode() : renderViewMode()
}

export default AdminAccountsModule
