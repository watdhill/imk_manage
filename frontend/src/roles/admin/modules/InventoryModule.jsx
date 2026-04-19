import { useMemo, useState } from 'react'
import { inventoryModule } from './inventory'

function InventoryModule({ section = inventoryModule, viewMode = 'view' }) {
  const [assets, setAssets] = useState(() => section.assets)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Semua kategori')
  const [condition, setCondition] = useState('Semua kondisi')
  const [form, setForm] = useState({
    name: '',
    category: section.categoryGroups[0]?.label ?? '',
    quantity: '',
    condition: section.conditions[0] ?? 'baik',
    location: section.locations[0] ?? 'Ruang Utama',
    notes: '',
  })
  const [feedback, setFeedback] = useState({ type: '', message: '' })
  const [editingId, setEditingId] = useState(null)

  const categoryOptions = ['Semua kategori', ...section.categoryGroups.map((g) => g.label)]
  const conditionOptions = ['Semua kondisi', ...section.conditions]

  const filteredAssets = useMemo(() => {
    const searchValue = query.trim().toLowerCase()

    return assets.filter((asset) => {
      const matchesQuery =
        searchValue.length === 0 ||
        [asset.name, asset.category, asset.location, asset.notes]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(searchValue))

      const matchesCategory = category === 'Semua kategori' || asset.category === category
      const matchesCondition = condition === 'Semua kondisi' || asset.condition === condition

      return matchesQuery && matchesCategory && matchesCondition
    })
  }, [category, condition, assets, query])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!form.name.trim() || !form.quantity) {
      setFeedback({
        type: 'error',
        message: 'Lengkapi nama barang dan kuantitas terlebih dahulu.',
      })
      return
    }

    const quantity = parseInt(form.quantity, 10)
    if (isNaN(quantity) || quantity < 1) {
      setFeedback({
        type: 'error',
        message: 'Kuantitas harus berupa angka positif.',
      })
      return
    }

    if (editingId) {
      setAssets((current) =>
        current.map((asset) =>
          asset.id === editingId
            ? {
                ...asset,
                name: form.name.trim(),
                category: form.category,
                quantity,
                condition: form.condition,
                location: form.location,
                notes: form.notes.trim(),
                lastUpdated: new Date().toISOString().split('T')[0],
              }
            : asset
        )
      )
      setFeedback({
        type: 'success',
        message: `"${form.name.trim()}" berhasil diperbarui.`,
      })
    } else {
      const nextAsset = {
        id: Math.max(...assets.map((a) => a.id), 0) + 1,
        name: form.name.trim(),
        category: form.category,
        quantity,
        condition: form.condition,
        location: form.location,
        notes: form.notes.trim(),
        lastUpdated: new Date().toISOString().split('T')[0],
      }

      setAssets((current) => [nextAsset, ...current])
      setFeedback({
        type: 'success',
        message: `"${nextAsset.name}" berhasil ditambahkan ke inventaris.`,
      })
    }

    resetForm()
  }

  const resetForm = () => {
    setForm({
      name: '',
      category: section.categoryGroups[0]?.label ?? '',
      quantity: '',
      condition: section.conditions[0] ?? 'baik',
      location: section.locations[0] ?? 'Ruang Utama',
      notes: '',
    })
    setEditingId(null)
  }

  const handleEdit = (asset) => {
    setForm({
      name: asset.name,
      category: asset.category,
      quantity: asset.quantity,
      condition: asset.condition,
      location: asset.location,
      notes: asset.notes,
    })
    setEditingId(asset.id)
  }

  const handleDelete = (id) => {
    const asset = assets.find((a) => a.id === id)
    if (window.confirm(`Hapus "${asset.name}" dari inventaris?`)) {
      setAssets((current) => current.filter((a) => a.id !== id))
      setFeedback({
        type: 'success',
        message: `"${asset.name}" berhasil dihapus dari inventaris.`,
      })
    }
  }

  const conditionColor = (cond) => {
    const colors = { baik: '#10b981', rusak: '#f59e0b', hilang: '#ef4444' }
    return colors[cond] || '#6b7280'
  }

  const renderViewMode = () => (
    <section className="dashboard-block inventory-layout">
      <header className="inventory-hero">
        <div>
          <p className="overview-kicker">Modul Admin</p>
          <h2>{section.title}</h2>
          <p>{section.description}</p>
        </div>
      </header>

      <section className="inventory-stats">
        {section.overviewCards.map((card) => (
          <article key={card.label} className="inventory-stat-card">
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <small>{card.note}</small>
          </article>
        ))}
      </section>

      <section className="inventory-overview">
        <article className="inventory-categories">
          <div className="block-header">
            <div>
              <p className="overview-kicker">Kategori Aset</p>
              <h3>Distribusi per kategori</h3>
            </div>
          </div>

          <div className="category-grid">
            {section.categoryGroups.map((group) => (
              <div key={group.label} className="category-card">
                <div className="category-icon">{group.icon}</div>
                <div className="category-info">
                  <strong>{group.label}</strong>
                  <small>{group.items} barang</small>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="inventory-conditions">
          <div className="block-header">
            <div>
              <p className="overview-kicker">Status Aset</p>
              <h3>Kondisi keseluruhan</h3>
            </div>
          </div>

          <div className="conditions-chart">
            {Object.entries(section.conditionStats).map(([key, stats]) => (
              <div key={key} className="condition-item">
                <div className="condition-bar">
                  <div
                    className="condition-fill"
                    style={{ width: `${stats.percentage}%`, backgroundColor: stats.color }}
                  />
                </div>
                <div className="condition-label">
                  <span className="condition-name" style={{ color: stats.color }}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                  <span className="condition-stats">{stats.count} ({stats.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="inventory-content">
        <article className="inventory-table-card">
          <div className="block-header">
            <div>
              <p className="overview-kicker">Data Inventaris</p>
              <h3>Daftar aset lengkap</h3>
            </div>

            <div className="inventory-controls">
              <input
                type="text"
                placeholder="Cari nama barang, lokasi..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input"
              />

              <select value={category} onChange={(e) => setCategory(e.target.value)} className="filter-select">
                {categoryOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>

              <select value={condition} onChange={(e) => setCondition(e.target.value)} className="filter-select">
                {conditionOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nama Barang</th>
                  <th>Kategori</th>
                  <th>Jumlah</th>
                  <th>Kondisi</th>
                  <th>Lokasi</th>
                  <th>Pembaruan</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset) => (
                  <tr key={asset.id}>
                    <td className="asset-name">{asset.name}</td>
                    <td>{asset.category}</td>
                    <td className="text-center">{asset.quantity}</td>
                    <td>
                      <span className="badge" style={{ backgroundColor: conditionColor(asset.condition) }}>
                        {asset.condition.charAt(0).toUpperCase() + asset.condition.slice(1)}
                      </span>
                    </td>
                    <td>{asset.location}</td>
                    <td className="text-muted">{asset.lastUpdated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAssets.length === 0 && (
            <div className="empty-state">
              <p>Tidak ada aset yang sesuai dengan filter Anda.</p>
            </div>
          )}
        </article>
      </section>
    </section>
  )

  const renderInputMode = () => (
    <section className="dashboard-block inventory-layout">
      <header className="inventory-hero">
        <div>
          <p className="overview-kicker">Modul Admin</p>
          <h2>{editingId ? 'Edit Aset' : 'Tambah Aset Baru'}</h2>
          <p>{editingId ? 'Perbarui informasi aset yang ada' : 'Tambahkan aset baru ke dalam inventaris'}</p>
        </div>
      </header>

      <section className="inventory-form-container">
        <article className="inventory-form-card">
          <form onSubmit={handleSubmit} className="inventory-form">
            <div className="form-group">
              <label htmlFor="name">Nama Barang *</label>
              <input
                id="name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Contoh: Laptop ASUS, Kursi Kerja..."
                className="form-input"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Kategori *</label>
                <select name="category" id="category" value={form.category} onChange={handleChange} className="form-select">
                  {section.categoryGroups.map((group) => (
                    <option key={group.label} value={group.label}>
                      {group.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="quantity">Jumlah *</label>
                <input
                  id="quantity"
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  min="1"
                  placeholder="Contoh: 5"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="condition">Kondisi *</label>
                <select name="condition" id="condition" value={form.condition} onChange={handleChange} className="form-select">
                  {section.conditions.map((cond) => (
                    <option key={cond} value={cond}>
                      {cond.charAt(0).toUpperCase() + cond.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="location">Lokasi *</label>
                <select name="location" id="location" value={form.location} onChange={handleChange} className="form-select">
                  {section.locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Catatan</label>
              <textarea
                id="notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Contoh: Untuk admin, serial number ABC123..."
                className="form-textarea"
                rows="3"
              />
            </div>

            {feedback.message && (
              <div className={`feedback feedback-${feedback.type}`}>
                <p>{feedback.message}</p>
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Simpan Perubahan' : 'Tambah Aset'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Batal Edit
                </button>
              )}
            </div>
          </form>
        </article>
      </section>

      <section className="inventory-list-container">
        <article className="inventory-list-card">
          <div className="block-header">
            <div>
              <p className="overview-kicker">Daftar Aset</p>
              <h3>Total {assets.length} aset terdaftar</h3>
            </div>

            <div className="list-controls">
              <input
                type="text"
                placeholder="Cari aset..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="asset-list">
            {filteredAssets.length > 0 ? (
              filteredAssets.map((asset) => (
                <div key={asset.id} className="asset-item">
                  <div className="asset-header">
                    <div className="asset-title">
                      <h4>{asset.name}</h4>
                      <span className="asset-category">{asset.category}</span>
                    </div>
                    <span className="badge" style={{ backgroundColor: conditionColor(asset.condition) }}>
                      {asset.condition.charAt(0).toUpperCase() + asset.condition.slice(1)}
                    </span>
                  </div>

                  <div className="asset-details">
                    <span>Qty: {asset.quantity}</span>
                    <span>Lokasi: {asset.location}</span>
                    {asset.notes && <span>Catatan: {asset.notes}</span>}
                  </div>

                  <div className="asset-actions">
                    <button onClick={() => handleEdit(asset)} className="btn btn-small btn-edit">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(asset.id)} className="btn btn-small btn-delete">
                      Hapus
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>Belum ada aset yang terdaftar.</p>
              </div>
            )}
          </div>
        </article>
      </section>
    </section>
  )

  return viewMode === 'input' ? renderInputMode() : renderViewMode()
}

export default InventoryModule
