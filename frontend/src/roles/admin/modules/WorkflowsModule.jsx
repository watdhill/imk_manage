import { useMemo, useState } from 'react'
import { workflowsModule } from './workflows'

function WorkflowsModule({ section = workflowsModule, viewMode = 'view' }) {
  const [programs, setPrograms] = useState(() => section.programList)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('Semua status')
  const [division, setDivision] = useState('Semua divisi')
  const [form, setForm] = useState({
    name: '',
    division: section.divisions[0] ?? 'Humas',
    status: 'Planned',
    date: '',
    lead: '',
    budget: '',
  })
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  const statusOptions = section.statusOptions.filter((s) => s !== 'Semua status')
  const divisionOptions = ['Semua divisi', ...section.divisions]

  const filteredPrograms = useMemo(() => {
    const searchValue = query.trim().toLowerCase()

    return programs.filter((program) => {
      const matchesQuery =
        searchValue.length === 0 ||
        [program.name, program.lead, program.division]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(searchValue))

      const matchesStatus = status === 'Semua status' || program.status === status
      const matchesDivision = division === 'Semua divisi' || program.division === division

      return matchesQuery && matchesStatus && matchesDivision
    })
  }, [division, programs, query, status])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!form.name.trim() || !form.lead.trim() || !form.date || !form.budget.trim()) {
      setFeedback({
        type: 'error',
        message: 'Lengkapi nama program, ketua divisi, tanggal, dan budget terlebih dahulu.',
      })
      return
    }

    const nextProgram = {
      id: Math.max(...programs.map((p) => p.id), 0) + 1,
      name: form.name.trim(),
      division: form.division,
      status: form.status,
      date: form.date,
      lead: form.lead.trim(),
      budget: form.budget.trim(),
      progress: 10,
    }

    setPrograms((current) => [nextProgram, ...current])
    setForm({
      name: '',
      division: form.division,
      status: 'Planned',
      date: '',
      lead: '',
      budget: '',
    })
    setFeedback({
      type: 'success',
      message: `Program kerja "${nextProgram.name}" berhasil ditambahkan.`,
    })
  }

  const renderViewMode = () => (
    <section className="dashboard-block workflows-layout">
      <header className="workflows-hero">
        <div>
          <p className="overview-kicker">Modul Admin</p>
          <h2>{section.title}</h2>
          <p>{section.description}</p>
        </div>
      </header>

      <section className="workflows-stats">
        {section.overviewCards.map((card) => (
          <article key={card.label} className="workflow-stat-card">
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <small>{card.note}</small>
          </article>
        ))}
      </section>

      <section className="workflows-tools">
        <div className="workflows-search-card">
          <div className="block-header">
            <div>
              <p className="overview-kicker">Cari program</p>
              <h3>Search & filter</h3>
            </div>
            <span>{filteredPrograms.length} hasil</span>
          </div>

          <div className="workflows-toolbar">
            <label>
              Pencarian
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari nama program, ketua, divisi"
              />
            </label>

            <label>
              Status
              <select value={status} onChange={(event) => setStatus(event.target.value)}>
                <option value="Semua status">Semua status</option>
                {statusOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Divisi
              <select value={division} onChange={(event) => setDivision(event.target.value)}>
                {divisionOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      <section className="workflows-grid">
        <article className="workflow-panel full-width">
          <div className="block-header">
            <div>
              <p className="overview-kicker">Daftar Program Kerja</p>
              <h3>Status & Progress</h3>
            </div>
          </div>

          <div className="program-list">
            {filteredPrograms.length > 0 ? (
              filteredPrograms.map((program) => (
                <div key={program.id} className="program-item">
                  <div className="program-header">
                    <div>
                      <strong>{program.name}</strong>
                      <span>{program.division} • {program.lead}</span>
                    </div>
                    <span
                      className="status-badge"
                      style={{
                        backgroundColor: `${section.statuses[program.status]?.color}20`,
                        color: section.statuses[program.status]?.color,
                      }}
                    >
                      {section.statuses[program.status]?.label}
                    </span>
                  </div>

                  <div className="program-meta">
                    <div>
                      <span>Tanggal</span>
                      <strong>{new Date(program.date).toLocaleDateString('id-ID')}</strong>
                    </div>
                    <div>
                      <span>Budget</span>
                      <strong>{program.budget}</strong>
                    </div>
                    <div>
                      <span>Progress</span>
                      <strong>{program.progress}%</strong>
                    </div>
                  </div>

                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${program.progress}%` }} />
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                Tidak ada program kerja yang cocok dengan pencarian atau filter saat ini.
              </div>
            )}
          </div>
        </article>
      </section>
    </section>
  )

  const renderInputMode = () => (
    <section className="dashboard-block workflows-layout">
      <header className="workflows-hero">
        <div>
          <p className="overview-kicker">Modul Admin</p>
          <h2>Program Kerja Baru</h2>
          <p>Tambahkan program kerja baru ke dalam sistem dengan detail lengkap.</p>
        </div>
      </header>

      <form className="workflow-form-fullwidth" onSubmit={handleSubmit}>
        <div className="workflow-form-grid">
          <label>
            Nama Program Kerja
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Contoh: Gathering Keluarga Besar IMK"
            />
          </label>
          <label>
            Ketua Divisi
            <input
              name="lead"
              type="text"
              value={form.lead}
              onChange={handleChange}
              placeholder="Nama ketua divisi"
            />
          </label>
          <label>
            Divisi
            <select name="division" value={form.division} onChange={handleChange}>
              {section.divisions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label>
            Status
            <select name="status" value={form.status} onChange={handleChange}>
              {statusOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label>
            Tanggal
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
            />
          </label>
          <label>
            Budget
            <input
              name="budget"
              type="text"
              value={form.budget}
              onChange={handleChange}
              placeholder="Rp 5.000.000"
            />
          </label>
        </div>

        <div className="form-actions">
          <button className="primary-button" type="submit">
            Simpan Program Kerja
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

export default WorkflowsModule
