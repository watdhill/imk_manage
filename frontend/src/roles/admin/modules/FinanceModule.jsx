import { useMemo, useState } from 'react'
import { financeModule } from './finance'

function FinanceModule({ section = financeModule, viewMode = 'view' }) {
  const [transactions, setTransactions] = useState(() => section.transactionHistory)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Semua kategori')
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: section.categories[1] ?? 'Dana Masuk',
    amount: '',
    source: '',
  })
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  const categoryOptions = section.categories.filter((c) => c !== 'Semua kategori')

  const filteredTransactions = useMemo(() => {
    const searchValue = query.trim().toLowerCase()

    return transactions.filter((transaction) => {
      const matchesQuery =
        searchValue.length === 0 ||
        [transaction.description, transaction.source]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(searchValue))

      const matchesCategory = category === 'Semua kategori' || transaction.category === category

      return matchesQuery && matchesCategory
    })
  }, [category, transactions, query])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!form.description.trim() || !form.amount || !form.source.trim()) {
      setFeedback({
        type: 'error',
        message: 'Lengkapi deskripsi transaksi, jumlah, dan sumber dana terlebih dahulu.',
      })
      return
    }

    const numAmount = parseFloat(form.amount.replace(/\D/g, ''))
    if (isNaN(numAmount) || numAmount <= 0) {
      setFeedback({
        type: 'error',
        message: 'Jumlah harus berupa angka positif.',
      })
      return
    }

    const nextTransaction = {
      id: Math.max(...transactions.map((t) => t.id), 0) + 1,
      date: form.date,
      description: form.description.trim(),
      category: form.category,
      amount: numAmount,
      type: section.categoryTypes[form.category] ?? 'expense',
      source: form.source.trim(),
      status: 'pending',
    }

    setTransactions((current) => [nextTransaction, ...current])
    setForm({
      date: new Date().toISOString().split('T')[0],
      description: '',
      category: form.category,
      amount: '',
      source: '',
    })
    setFeedback({
      type: 'success',
      message: `Transaksi "${nextTransaction.description}" berhasil dicatat.`,
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const renderViewMode = () => (
    <section className="dashboard-block finance-layout">
      <header className="finance-hero">
        <div>
          <p className="overview-kicker">Modul Admin</p>
          <h2>{section.title}</h2>
          <p>{section.description}</p>
        </div>
      </header>

      <section className="finance-stats">
        {section.overviewCards.map((card) => (
          <article key={card.label} className="finance-stat-card">
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <small>{card.note}</small>
          </article>
        ))}
      </section>

      <section className="finance-overview">
        <article className="finance-chart-card">
          <div className="block-header">
            <div>
              <p className="overview-kicker">Tren Bulanan</p>
              <h3>Pemasukan vs Pengeluaran</h3>
            </div>
          </div>

          <div className="finance-chart">
            {section.monthlyTrend.map((item) => (
              <div key={item.month} className="chart-group">
                <div className="chart-label">{item.month}</div>
                <div className="chart-bars">
                  <div
                    className="chart-bar income"
                    style={{ height: `${(item.income / 45000000) * 100}%` }}
                    title={formatCurrency(item.income)}
                  />
                  <div
                    className="chart-bar expense"
                    style={{ height: `${(item.expense / 45000000) * 100}%` }}
                    title={formatCurrency(item.expense)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="chart-legend">
            <span>
              <i style={{ backgroundColor: '#10b981' }} /> Pemasukan
            </span>
            <span>
              <i style={{ backgroundColor: '#ef4444' }} /> Pengeluaran
            </span>
          </div>
        </article>

        <div className="finance-tools">
          <div className="finance-search-card">
            <div className="block-header">
              <div>
                <p className="overview-kicker">Cari transaksi</p>
                <h3>Search & filter</h3>
              </div>
              <span>{filteredTransactions.length} hasil</span>
            </div>

            <div className="finance-toolbar">
              <label>
                Pencarian
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Cari deskripsi, sumber dana"
                />
              </label>

              <label>
                Kategori
                <select value={category} onChange={(event) => setCategory(event.target.value)}>
                  {section.categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>
      </section>

      <section className="finance-grid">
        <article className="finance-panel full-width">
          <div className="block-header">
            <div>
              <p className="overview-kicker">Riwayat Transaksi</p>
              <h3>Daftar Lengkap</h3>
            </div>
          </div>

          <div className="transaction-list">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((trx) => (
                <div key={trx.id} className="transaction-item">
                  <div className="transaction-header">
                    <div>
                      <strong>{trx.description}</strong>
                      <span>{trx.source}</span>
                    </div>
                    <span className={`status-badge ${trx.status}`}>
                      {trx.status === 'verified' ? 'Terverifikasi' : 'Menunggu'}
                    </span>
                  </div>

                  <div className="transaction-meta">
                    <div>
                      <span>Tanggal</span>
                      <strong>{new Date(trx.date).toLocaleDateString('id-ID')}</strong>
                    </div>
                    <div>
                      <span>Kategori</span>
                      <strong>{trx.category}</strong>
                    </div>
                    <div>
                      <span>Jumlah</span>
                      <strong className={trx.type === 'income' ? 'income-text' : 'expense-text'}>
                        {trx.type === 'income' ? '+' : '-'} {formatCurrency(trx.amount)}
                      </strong>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">Tidak ada transaksi yang cocok dengan pencarian atau filter saat ini.</div>
            )}
          </div>
        </article>
      </section>
    </section>
  )

  const renderInputMode = () => (
    <section className="dashboard-block finance-layout">
      <header className="finance-hero">
        <div>
          <p className="overview-kicker">Modul Admin</p>
          <h2>Catat Transaksi Baru</h2>
          <p>Masukkan data transaksi keuangan baru ke dalam sistem pencatatan.</p>
        </div>
      </header>

      <form className="finance-form-fullwidth" onSubmit={handleSubmit}>
        <div className="finance-form-grid">
          <label>
            Tanggal
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Kategori
            <select name="category" value={form.category} onChange={handleChange}>
              {categoryOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label>
            Deskripsi Transaksi
            <input
              name="description"
              type="text"
              value={form.description}
              onChange={handleChange}
              placeholder="Contoh: Pemasukan Dana Kas Divisi"
            />
          </label>
          <label>
            Sumber Dana
            <input
              name="source"
              type="text"
              value={form.source}
              onChange={handleChange}
              placeholder="Divisi/Sekretariat/Lainnya"
            />
          </label>
          <label>
            Jumlah (Rp)
            <input
              name="amount"
              type="text"
              value={form.amount}
              onChange={handleChange}
              placeholder="5000000"
            />
          </label>
        </div>

        <div className="form-actions">
          <button className="primary-button" type="submit">
            Simpan Transaksi
          </button>
        </div>

        {feedback.message ? (
          <p className={`feedback ${feedback.type}`}>{feedback.message}</p>
        ) : null}
      </form>
    </section>
  )

  return viewMode === 'input' ? renderInputMode() : renderViewMode()
}

export default FinanceModule
