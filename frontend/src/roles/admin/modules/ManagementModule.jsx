import { useMemo, useState } from 'react'
import { managementModule } from './management'

function ManagementModule({ section = managementModule, viewMode = 'view' }) {
  const [members, setMembers] = useState(() => section.memberDirectory)
  const [query, setQuery] = useState('')
  const [division, setDivision] = useState('Semua divisi')
  const [form, setForm] = useState(() => ({
    name: '',
    nim: '',
    major: '',
    batch: '',
    division: section.filters.find((item) => item !== 'Semua divisi') ?? 'Humas',
  }))
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  const divisionOptions = section.filters.filter((filter) => filter !== 'Semua divisi')

  const filteredMembers = useMemo(() => {
    const searchValue = query.trim().toLowerCase()

    return members.filter((member) => {
      const matchesQuery =
        searchValue.length === 0 ||
        [member.name, member.nim, member.major, member.batch, member.division]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(searchValue))

      const matchesDivision = division === 'Semua divisi' || member.division === division

      return matchesQuery && matchesDivision
    })
  }, [division, members, query])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextMember = {
      name: form.name.trim(),
      nim: form.nim.trim(),
      major: form.major.trim(),
      batch: form.batch.trim(),
      division: form.division,
      account: 'Belum ada',
    }

    if (!nextMember.name || !nextMember.nim || !nextMember.major || !nextMember.batch) {
      setFeedback({
        type: 'error',
        message: 'Lengkapi nama, NIM, jurusan, dan angkatan terlebih dahulu.',
      })
      return
    }

    if (members.some((member) => member.nim === nextMember.nim)) {
      setFeedback({
        type: 'error',
        message: 'NIM sudah terdaftar di database anggota.',
      })
      return
    }

    setMembers((current) => [nextMember, ...current])
    setForm((current) => ({
      name: '',
      nim: '',
      major: '',
      batch: '',
      division: current.division,
    }))
    setFeedback({
      type: 'success',
      message: `${nextMember.name} berhasil ditambahkan ke database anggota.`,
    })
  }

  const renderViewMode = () => (
    <section className="dashboard-block management-layout">
      <header className="management-hero">
        <div>
          <p className="overview-kicker">Modul Admin</p>
          <h2>{section.title}</h2>
          <p>{section.description}</p>
        </div>

        <div className="management-filters">
          {section.filters.map((filter) => (
            <span key={filter}>{filter}</span>
          ))}
        </div>
      </header>

      <section className="management-stats">
        {section.overviewCards.map((card) => (
          <article key={card.label} className="management-stat-card">
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <small>{card.note}</small>
          </article>
        ))}
      </section>

      <section className="management-tools">
        <div className="management-search-card">
          <div className="block-header">
            <div>
              <p className="overview-kicker">Cari data</p>
              <h3>Search & filter anggota</h3>
            </div>
            <span>{filteredMembers.length} hasil</span>
          </div>

          <div className="management-toolbar">
            <label>
              Pencarian
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari nama, NIM, jurusan, angkatan"
              />
            </label>

            <label>
              Filter divisi
              <select value={division} onChange={(event) => setDivision(event.target.value)}>
                <option value="Semua divisi">Semua divisi</option>
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

      <section className="management-grid">
        <article className="management-panel">
          <div className="block-header">
            <div>
              <p className="overview-kicker">Divisi</p>
              <h3>Struktur kepengurusan</h3>
            </div>
          </div>

          <div className="division-list">
            {section.divisions.map((item) => (
              <div key={item.name} className="division-item">
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.lead}</span>
                </div>
                <em>{item.members} anggota</em>
              </div>
            ))}
          </div>
        </article>

        <article className="management-panel">
          <div className="block-header">
            <div>
              <p className="overview-kicker">Anggota</p>
              <h3>Database anggota</h3>
            </div>
          </div>

          <div className="member-table">
            <div className="member-table-head">
              <span>Nama</span>
              <span>NIM</span>
              <span>Divisi</span>
              <span>Akun</span>
            </div>
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <div key={member.nim} className="member-table-row">
                  <span>
                    <strong>{member.name}</strong>
                    <small>
                      {member.major} • {member.batch}
                    </small>
                  </span>
                  <span>{member.nim}</span>
                  <span>{member.division}</span>
                  <span>{member.account}</span>
                </div>
              ))
            ) : (
              <div className="empty-state">
                Tidak ada data yang cocok dengan pencarian atau filter saat ini.
              </div>
            )}
          </div>
        </article>
      </section>
    </section>
  )

  const renderInputMode = () => (
    <section className="dashboard-block management-layout">
      <header className="management-hero">
        <div>
          <p className="overview-kicker">Modul Admin</p>
          <h2>Tambah Anggota Baru</h2>
          <p>Masukkan data anggota baru ke dalam database organisasi dengan lengkap.</p>
        </div>
      </header>

      <form className="management-form-fullwidth" onSubmit={handleSubmit}>
        <div className="management-form-grid-large">
          <label>
            Nama Lengkap
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Nama anggota"
            />
          </label>
          <label>
            NIM
            <input
              name="nim"
              type="text"
              value={form.nim}
              onChange={handleChange}
              placeholder="211152xxxx"
            />
          </label>
          <label>
            Jurusan
            <input
              name="major"
              type="text"
              value={form.major}
              onChange={handleChange}
              placeholder="Sistem Informasi"
            />
          </label>
          <label>
            Angkatan
            <input
              name="batch"
              type="text"
              value={form.batch}
              onChange={handleChange}
              placeholder="2023"
            />
          </label>
          <label>
            Divisi
            <select name="division" value={form.division} onChange={handleChange}>
              {divisionOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="form-actions">
          <button className="primary-button" type="submit">
            Simpan Anggota
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

export default ManagementModule