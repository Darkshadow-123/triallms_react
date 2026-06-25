import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import CreateModeTabs from '../components/CreateModeTabs'
import { RoleContext } from '../context/RoleContext'

const API_BASE = '/fastapi'

const parseApiError = (detail, fallback) => {
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg
  return fallback
}

const NotesView = () => {
  const { themeClass , themeHex, activeRole } = useContext(RoleContext)
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [isCreateMode, setIsCreateMode] = useState(false)
  const [creatingNote, setCreatingNote] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [updatingNote, setUpdatingNote] = useState(false)
  const [aiGoal, setAiGoal] = useState('')
  const [generatingWithAi, setGeneratingWithAi] = useState(false)
  const [createTab, setCreateTab] = useState('manual')
  const [generatedPreview, setGeneratedPreview] = useState(null)
  const [activeGenerationGoal, setActiveGenerationGoal] = useState('')

  const [grades, setGrades] = useState([])
  const [subjects, setSubjects] = useState([])
  const [chapters, setChapters] = useState([])
  const [lessons, setLessons] = useState([])
  
  const [activeGrade, setActiveGrade] = useState('')
  const [activeSubject, setActiveSubject] = useState('')

  const resetAiState = () => {
    setAiGoal('')
    setGeneratedPreview(null)
    setActiveGenerationGoal('')
    setGeneratingWithAi(false)
  }

  const resetCreateState = () => {
    setIsCreateMode(false)
    setCreateTab('manual')
    setCreateForm({ title: '', chapter_id: '', lesson_id: '', content: '' })
    resetAiState()
  }

  const [filters, setFilters] = useState({
    title: '',
    chapter_name: ''
  })

  const [createForm, setCreateForm] = useState({
    title: '',
    chapter_id: '',
    lesson_id: '',
    content: ''
  })

  const [editForm, setEditForm] = useState({
    title: '',
    chapter_id: '',
    lesson_id: '',
    content: '',
    published: false
  })

  useEffect(() => {
    fetchNotes()
    axios
      .get('content_management/get_grades/')
      .then(response => setGrades(response.data))
      .catch(error => console.error('Error fetching grades:', error))
      
    axios
      .get('content_management/subjects/')
      .then(response => setSubjects(response.data))
      .catch(error => console.error('Error fetching subjects:', error))
  }, [])

  useEffect(() => {
    if (!activeGrade && !activeSubject) return
    let url = 'content_management/'
    const queryParams = []
    if (activeGrade) queryParams.push(`grade_id=${activeGrade}`)
    if (activeSubject) queryParams.push(`subject_id=${activeSubject}`)
    if (queryParams.length > 0) url += '?' + queryParams.join('&')

    axios
      .get(url)
      .then(response => setChapters(response.data))
      .catch(error => {
        console.error('Error fetching chapters:', error)
        setChapters([])
      })
  }, [activeGrade, activeSubject])

  useEffect(() => {
    if (createForm.chapter_id) {
      axios
        .get(`content_management/${createForm.chapter_id}/`)
        .then(response => setLessons(response.data.lessons || []))
        .catch(error => {
          console.error('Error fetching lessons:', error)
          setLessons([])
        })
    } else {
      setLessons([])
    }
  }, [createForm.chapter_id])

  const fetchNotes = async (useFilters = false, silent = false) => {
    try {
      if (!silent) setLoading(true)
      let url = `${API_BASE}/notes`

      if (useFilters) {
        const params = new URLSearchParams()

        if (filters.title) params.append('title', filters.title)
        if (filters.chapter_name) params.append('chapter_name', filters.chapter_name)

        if (params.toString()) {
          url = `${API_BASE}/note?${params.toString()}`
        }
      }

      const response = await fetch(url)
      if (!response.ok) {
        if (response.status === 404 && useFilters) {
          setNotes([])
          setError(null)
          return
        }
        const err = await response.json().catch(() => ({}))
        throw new Error(parseApiError(err.detail, `Failed to fetch notes: ${response.statusText}`))
      }

      const data = await response.json()
      setNotes(Array.isArray(data) ? data : [data].filter(Boolean))
      setError(null)
    } catch (err) {
      setError(err.message)
      setNotes([])
    } finally {
      if (!silent) setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters({ ...filters, [name]: value })
  }

  const handleCreateFormChange = (e) => {
    const { name, value } = e.target
    setCreateForm({ ...createForm, [name]: value })
  }

  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setEditForm({
      ...editForm,
      [name]:
        type === 'checkbox'
          ? checked
          : name === 'chapter_id' || name === 'lesson_id'
            ? parseInt(value, 10) || value
            : value
    })
  }

  const handleCreateNote = async (e) => {
    e.preventDefault()
    setCreatingNote(true)
    setError(null)

    const safeExtractId = (uid) => {
      const digits = String(uid).replace(/\D/g, '')
      return parseInt(digits.substring(0, 12), 10) || 1
    }

    const payload = {
      title: createForm.title,
      chapter_id: safeExtractId(createForm.chapter_id),
      lesson_id: safeExtractId(createForm.lesson_id),
      content: createForm.content
    }

    try {
      const response = await fetch(`${API_BASE}/create-note`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(parseApiError(err.detail, 'Failed to create note'))
      }

      setCreateForm({ title: '', chapter_id: '', lesson_id: '', content: '' })
      resetAiState()
      setIsCreateMode(false)
      await fetchNotes()
    } catch (err) {
      setError(err.message)
    } finally {
      setCreatingNote(false)
    }
  }

  const handleGenerateWithAi = async () => {
    if (!aiGoal.trim()) {
      setError('Please enter a goal for AI generation')
      return
    }

    setGeneratingWithAi(true)
    setError(null)
    setGeneratedPreview(null)
    setActiveGenerationGoal(aiGoal.trim())

    const safeExtractId = (uid) => {
      const digits = String(uid).replace(/\D/g, '')
      return parseInt(digits.substring(0, 12), 10) || 1
    }

    try {
      const response = await fetch(`${API_BASE}/notes/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          goal: aiGoal.trim(),
          chapter_id: safeExtractId(createForm.chapter_id),
          lesson_id: safeExtractId(createForm.lesson_id)
        })
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(parseApiError(err.detail, 'Failed to generate note with AI'))
      }

      const data = await response.json()
      const generatedNotes = Array.isArray(data) ? data : [data]
      setGeneratedPreview(generatedNotes)
      const firstEditableNote = generatedNotes.find(note => note.notes_id)
      if (firstEditableNote) {
        handleEditNote(firstEditableNote)
      }
      await fetchNotes(false, true)
    } catch (err) {
      setError(err.message)
      setActiveGenerationGoal('')
    } finally {
      setGeneratingWithAi(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchNotes(true)
  }

  const handleReset = () => {
    setFilters({ title: '', chapter_name: '' })
    fetchNotes(false)
  }

  const toggleExpand = (notesId) => {
    setExpandedId(expandedId === notesId ? null : notesId)
  }

  const handleDeleteNote = async (notesId) => {
    if (!window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      return
    }

    setDeletingId(notesId)
    setError(null)

    try {
      const response = await fetch(`${API_BASE}/delete-note/${notesId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(parseApiError(err.detail, `Failed to delete note: ${response.statusText}`))
      }

      await fetchNotes()
    } catch (err) {
      setError(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  const handleEditNote = (note) => {
    setEditingId(note.notes_id)
    setEditForm({
      title: note.title,
      chapter_id: note.chapter_id,
      lesson_id: note.lesson_id,
      content: note.content || '',
      published: note.published ?? false
    })
    setExpandedId(null)
  }

  const handleEditGeneratedNote = (note) => {
    if (editingId !== null || !note.notes_id) return
    handleEditNote(note)
  }

  const handleUpdateNote = async (notesId) => {
    setUpdatingNote(true)
    setError(null)

    const safeExtractId = (uid) => {
      const digits = String(uid).replace(/\D/g, '')
      return parseInt(digits.substring(0, 12), 10) || 1
    }

    const payload = {
      title: editForm.title,
      chapter_id: safeExtractId(editForm.chapter_id),
      lesson_id: safeExtractId(editForm.lesson_id),
      content: editForm.content,
      published: editForm.published
    }

    try {
      const response = await fetch(`${API_BASE}/update-note/${notesId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(parseApiError(err.detail, `Failed to update note: ${response.statusText}`))
      }

      const fallbackUpdatedNote = {
        ...generatedPreview?.find(note => note.notes_id === notesId),
        ...payload,
        notes_id: notesId
      }
      const responseData = await response.json().catch(() => null)
      const updatedNote = responseData?.notes_id ? responseData : fallbackUpdatedNote

      if (generatedPreview?.some(note => note.notes_id === notesId)) {
        setGeneratedPreview(generatedPreview.map(note => (
          note.notes_id === notesId ? updatedNote : note
        )))
      }

      setEditingId(null)
      await fetchNotes(false, Boolean(generatedPreview?.some(note => note.notes_id === notesId)))
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdatingNote(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({
      title: '',
      chapter_id: '',
      lesson_id: '',
      content: '',
      published: false
    })
  }

  const boxStyle = {
    marginBottom: '30px',
    background: 'linear-gradient(135deg, #f0f7ff 0%, #e8f4ff 100%)',
    borderLeft: '5px solid #3273dc',
    boxShadow: '0 2px 8px rgba(50, 115, 220, 0.1)'
  }

  const inputStyle = { borderColor: themeHex, borderWidth: '1px' }

  const aiButtonStyle = {
    borderRadius: '6px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#7c3aed',
    color: '#ffffff'
  }

  const getEditButtonStyle = (disabled) => ({
    borderRadius: '6px',
    fontWeight: '600',
    backgroundColor: '#48c774',
    border: 'none',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '0.75rem 1.5rem',
    opacity: disabled ? 0.6 : 1
  })

  const isEditingGeneratedNote = Boolean(
    generatedPreview?.some(note => note.notes_id && note.notes_id === editingId)
  )

  return (
    <div className="notes-management">
      <div className={`hero ${themeClass} is-medium`}>
        <div className="hero-body has-text-centered">
          <h1 className="title">Notes Management</h1>
        </div>
      </div>

      <section className="section">
        <div className="box" style={boxStyle}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <span className="icon" style={{ color: themeHex, marginRight: '10px' }}>
              <i className={`fas fa-${isCreateMode ? 'plus-circle' : 'filter'}`}></i>
            </span>
            <h2 className="subtitle is-4" style={{ margin: 0, color: '#2c3e50' }}>
              {isCreateMode ? 'Create Note' : 'Search & Filter Notes'}
            </h2>
          </div>

          <div className="columns is-multiline mb-4">
            <div className="column is-half">
              <div className="field">
                <label className="label" style={{ color: '#2c3e50', fontWeight: '600' }}>Select Grade (Filter Chapters)</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select value={activeGrade} onChange={e => setActiveGrade(e.target.value)} style={{ borderColor: themeHex, borderWidth: '1px', color: '#2c3e50' }}>
                      <option value="">All Grades</option>
                      {grades.map(g => <option key={g.id || g.uid} value={g.id || g.uid}>Grade {g.grade}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="column is-half">
              <div className="field">
                <label className="label" style={{ color: '#2c3e50', fontWeight: '600' }}>Select Subject (Filter Chapters)</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select value={activeSubject} onChange={e => setActiveSubject(e.target.value)} style={{ borderColor: themeHex, borderWidth: '1px', color: '#2c3e50' }}>
                      <option value="">All Subjects</option>
                      {subjects.map(s => <option key={s.id || s.uid} value={s.id || s.uid}>{s.subject_name}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={isCreateMode ? handleCreateNote : handleSearch}>
            {!isCreateMode ? (
              <div className="columns is-multiline">
                <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
                  <div className="field">
                    <label className="label" style={{ color: '#2c3e50', fontWeight: '600' }}>
                      <span className="icon is-small" style={{ marginRight: '5px' }}>
                        <i className="fas fa-heading"></i>
                      </span>
                      Title
                    </label>
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="text"
                        name="title"
                        placeholder="e.g., Chapter Summary"
                        value={filters.title}
                        onChange={handleFilterChange}
                        style={inputStyle}
                      />
                      <span className="icon is-left" style={{ color: themeHex }}>
                        <i className="fas fa-file-alt"></i>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
                  <div className="field">
                    <label className="label" style={{ color: '#2c3e50', fontWeight: '600' }}>
                      <span className="icon is-small" style={{ marginRight: '5px' }}>
                        <i className="fas fa-bookmark"></i>
                      </span>
                      Chapter Name
                    </label>
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="text"
                        name="chapter_name"
                        placeholder="e.g., Motion"
                        value={filters.chapter_name}
                        onChange={handleFilterChange}
                        style={inputStyle}
                      />
                      <span className="icon is-left" style={{ color: themeHex }}>
                        <i className="fas fa-layer-group"></i>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="column is-full">
                  <div className="field is-grouped">
                    <div className="control">
                      <button
                        className={`button ${themeClass} is-medium`}
                        type="submit"
                        style={{
                          borderRadius: '6px',
                          fontWeight: '600',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '0.75rem 1.5rem'
                        }}
                      >
                        <i className="fas fa-search"></i>
                        <span>Search</span>
                      </button>
                    </div>
                    <div className="control">
                      <button
                        className="button is-medium"
                        type="button"
                        onClick={handleReset}
                        style={{
                          borderRadius: '6px',
                          fontWeight: '600',
                          backgroundColor: '#ffffff',
                          border: '2px solid #3273dc',
                          color: themeHex,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '0.75rem 1.5rem'
                        }}
                      >
                        <i className="fas fa-redo"></i>
                        <span>Reset</span>
                      </button>
                    </div>
                    <div className="control">
                      {activeRole === 'Teacher' && (
                        <button
                          className={`button ${themeClass} is-medium`}
                          type="button"
                          onClick={() => {
                            setIsCreateMode(true)
                            setCreateTab('manual')
                            resetAiState()
                          }}
                          style={{
                            borderRadius: '6px',
                            fontWeight: '600',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '0.75rem 1.5rem'
                          }}
                        >
                          <i className="fas fa-plus"></i>
                          <span>Create Note</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="columns is-multiline">
                <div className="column is-full">
                  <CreateModeTabs activeTab={createTab} onTabChange={setCreateTab} />
                </div>

                {createTab === 'ai' ? (
                  <>
                    <div className="column is-full">
                      <div
                        className="box"
                        style={{ backgroundColor: '#faf5ff', borderLeft: '3px solid #7c3aed', marginBottom: '20px' }}
                      >
                        <h4 className="subtitle is-6" style={{ color: '#2c3e50', marginBottom: '15px' }}>
                          <i className="fas fa-robot"></i> AI Generation
                        </h4>

                        <div className="columns is-multiline">
                          <div className="column is-half">
                            <div className="field">
                              <label className="label" style={{ color: '#2c3e50', fontWeight: '600' }}>Chapter</label>
                              <div className="control has-icons-left">
                                <div className="select is-fullwidth">
                                  <select
                                    name="chapter_id"
                                    value={createForm.chapter_id}
                                    onChange={handleCreateFormChange}
                                    style={{ borderColor: '#7c3aed', borderWidth: '1px' }}
                                  >
                                    <option value="">Select Chapter</option>
                                    {chapters.map(c => <option key={c.id || c.uid} value={c.id || c.uid}>{c.chapter_name}</option>)}
                                  </select>
                                </div>
                                <span className="icon is-left" style={{ color: '#7c3aed' }}>
                                  <i className="fas fa-layer-group"></i>
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="column is-half">
                            <div className="field">
                              <label className="label" style={{ color: '#2c3e50', fontWeight: '600' }}>Lesson</label>
                              <div className="control has-icons-left">
                                <div className="select is-fullwidth">
                                  <select
                                    name="lesson_id"
                                    value={createForm.lesson_id}
                                    onChange={handleCreateFormChange}
                                    style={{ borderColor: '#7c3aed', borderWidth: '1px' }}
                                  >
                                    <option value="">Select Lesson</option>
                                    {lessons.map(l => <option key={l.id || l.uid} value={l.id || l.uid}>{l.lesson_name}</option>)}
                                  </select>
                                </div>
                                <span className="icon is-left" style={{ color: '#7c3aed' }}>
                                  <i className="fas fa-chalkboard"></i>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="field">
                          <label className="label" style={{ color: '#2c3e50', fontWeight: '600' }}>Goal</label>
                          <div className="control">
                            <textarea
                              className="textarea"
                              placeholder="Describe what you want to generate, e.g., Summary notes on photosynthesis for chapter 1..."
                              value={aiGoal}
                              onChange={(e) => setAiGoal(e.target.value)}
                              disabled={generatingWithAi}
                              style={{ borderColor: '#7c3aed', borderWidth: '1px', minHeight: '100px' }}
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          className="button is-medium"
                          onClick={handleGenerateWithAi}
                          disabled={generatingWithAi}
                          style={{ ...aiButtonStyle, opacity: generatingWithAi ? 0.7 : 1 }}
                        >
                          <i className="fas fa-magic"></i>
                          <span>{generatingWithAi ? 'Generating...' : 'Generate with AI'}</span>
                        </button>
                      </div>
                    </div>

                    {generatingWithAi && (
                      <div className="column is-full">
                        <div className={`notification ${themeClass}`}>
                          <p style={{ marginBottom: '8px' }}>
                            <i className="fas fa-spinner fa-spin"></i> Generating note content...
                          </p>
                          <p><strong>Goal:</strong> {activeGenerationGoal}</p>
                        </div>
                      </div>
                    )}

                    {generatedPreview && !generatingWithAi && (
                      <div className="column is-full">
                        <div
                          className="box"
                          style={{ backgroundColor: '#f0fdf4', borderLeft: '4px solid #48c774', marginBottom: '20px' }}
                        >
                          <h4 className="subtitle is-6" style={{ color: '#2c3e50', marginBottom: '15px' }}>
                            <i className="fas fa-check-circle" style={{ color: '#48c774' }}></i> Generated Content
                          </h4>
                          <p style={{ color: '#2c3e50', marginBottom: '15px' }}>
                            <strong>Goal:</strong> {activeGenerationGoal}
                          </p>
                          <p className="help" style={{ marginBottom: '15px', color: '#666' }}>
                            Saved automatically to the database.
                          </p>
                          {generatedPreview.map((note, index) => (
                            <div
                              key={note.notes_id ?? index}
                              style={{
                                marginBottom: '20px',
                                padding: '15px',
                                backgroundColor: '#ffffff',
                                border: '1px solid #ddd',
                                borderRadius: '6px'
                              }}
                            >
                              {editingId === note.notes_id ? (
                                <div className="note-edit-form">
                                  <div className="box" style={{ backgroundColor: '#f8fafc', borderLeft: '3px solid #3273dc' }}>
                                    <h4 className="subtitle is-6" style={{ color: '#2c3e50', marginBottom: '15px' }}>
                                      <i className="fas fa-edit"></i> Edit Note
                                    </h4>

                                    <div className="columns is-multiline">
                                      <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
                                        <div className="field">
                                          <label className="label" style={{ color: '#2c3e50', fontWeight: '600' }}>Title</label>
                                          <div className="control">
                                            <input
                                              className="input"
                                              type="text"
                                              name="title"
                                              value={editForm.title}
                                              onChange={handleEditFormChange}
                                              required
                                              style={inputStyle}
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
                                        <div className="field">
                                          <label className="label" style={{ color: '#2c3e50', fontWeight: '600' }}>Chapter ID</label>
                                          <div className="control">
                                            <input
                                              className="input"
                                              type="number"
                                              name="chapter_id"
                                              value={editForm.chapter_id}
                                              onChange={handleEditFormChange}
                                              required
                                              style={inputStyle}
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
                                        <div className="field">
                                          <label className="label" style={{ color: '#2c3e50', fontWeight: '600' }}>Lesson ID</label>
                                          <div className="control">
                                            <input
                                              className="input"
                                              type="number"
                                              name="lesson_id"
                                              value={editForm.lesson_id}
                                              onChange={handleEditFormChange}
                                              required
                                              style={inputStyle}
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
                                        <div className="field">
                                          <label className="label" style={{ color: '#2c3e50', fontWeight: '600' }}>Published</label>
                                          <div className="control">
                                            <label className="checkbox" style={{ color: '#2c3e50', fontWeight: '600' }}>
                                              <input
                                                type="checkbox"
                                                name="published"
                                                checked={editForm.published}
                                                onChange={handleEditFormChange}
                                                style={{ marginRight: '8px' }}
                                              />
                                              Mark as published
                                            </label>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="column is-full">
                                        <div className="field">
                                          <label className="label" style={{ color: '#2c3e50', fontWeight: '600' }}>Content</label>
                                          <div className="control">
                                            <textarea
                                              className="textarea"
                                              name="content"
                                              value={editForm.content}
                                              onChange={handleEditFormChange}
                                              required
                                              style={{ ...inputStyle, minHeight: '200px' }}
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      <div className="column is-full">
                                        <div className="field is-grouped">
                                          <div className="control">
                                            <button
                                              className={`button ${themeClass} is-medium`}
                                              type="button"
                                              onClick={() => handleUpdateNote(note.notes_id)}
                                              disabled={updatingNote}
                                              style={{
                                                borderRadius: '6px',
                                                fontWeight: '600',
                                                border: 'none',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                padding: '0.75rem 1.5rem'
                                              }}
                                            >
                                              <i className="fas fa-save"></i>
                                              <span>{updatingNote ? 'Saving...' : 'Save Changes'}</span>
                                            </button>
                                          </div>
                                          <div className="control">
                                            <button
                                              className="button is-medium"
                                              type="button"
                                              onClick={handleCancelEdit}
                                              disabled={updatingNote}
                                              style={{
                                                borderRadius: '6px',
                                                fontWeight: '600',
                                                backgroundColor: '#ffffff',
                                                border: '2px solid #3273dc',
                                                color: themeHex,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                padding: '0.75rem 1.5rem'
                                              }}
                                            >
                                              <i className="fas fa-times"></i>
                                              <span>Cancel</span>
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <p style={{ marginBottom: '8px' }}>
                                    <strong>Title:</strong> {note.title}
                                  </p>
                                  <p style={{ marginBottom: '8px' }}>
                                    <strong>Notes ID:</strong> {note.notes_id ?? '-'} |{' '}
                                    <strong>Chapter:</strong> {note.chapter_name || note.chapter_id} |{' '}
                                    <strong>Lesson:</strong> {note.lesson_name || note.lesson_id}
                                  </p>
                                  <p style={{ marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>Content:</p>
                                  <div
                                    style={{
                                      padding: '12px',
                                      backgroundColor: '#f8fafc',
                                      whiteSpace: 'pre-wrap',
                                      lineHeight: '1.6',
                                      color: '#2c3e50'
                                    }}
                                  >
                                    {note.content}
                                  </div>
                                  <button
                                    type="button"
                                    className="button is-large"
                                    onClick={() => handleEditGeneratedNote(note)}
                                    disabled={editingId !== null || !note.notes_id}
                                    style={{ ...getEditButtonStyle(editingId !== null || !note.notes_id), marginTop: '15px' }}
                                  >
                                    <i className="fas fa-edit"></i>
                                    <span>Edit</span>
                                  </button>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="column is-full">
                      <button
                        type="button"
                        className="button is-medium"
                        onClick={resetCreateState}
                        style={{
                          borderRadius: '6px',
                          fontWeight: '600',
                          backgroundColor: '#ffffff',
                          border: '2px solid #3273dc',
                          color: themeHex,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '0.75rem 1.5rem'
                        }}
                      >
                        <i className="fas fa-times"></i>
                        <span>Cancel</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
                  <div className="field">
                    <label className="label" style={{ color: '#2c3e50', fontWeight: '600' }}>Title</label>
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="text"
                        name="title"
                        placeholder="e.g., Chapter Summary"
                        value={createForm.title}
                        onChange={handleCreateFormChange}
                        required
                        style={inputStyle}
                      />
                      <span className="icon is-left" style={{ color: themeHex }}>
                        <i className="fas fa-file-alt"></i>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
                  <div className="field">
                    <label className="label" style={{ color: '#2c3e50', fontWeight: '600' }}>Chapter</label>
                    <div className="control has-icons-left">
                      <div className="select is-fullwidth">
                        <select
                          name="chapter_id"
                          value={createForm.chapter_id}
                          onChange={handleCreateFormChange}
                          required
                          style={inputStyle}
                        >
                          <option value="">Select Chapter</option>
                          {chapters.map(c => <option key={c.id || c.uid} value={c.id || c.uid}>{c.chapter_name}</option>)}
                        </select>
                      </div>
                      <span className="icon is-left" style={{ color: themeHex }}>
                        <i className="fas fa-layer-group"></i>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
                  <div className="field">
                    <label className="label" style={{ color: '#2c3e50', fontWeight: '600' }}>Lesson</label>
                    <div className="control has-icons-left">
                      <div className="select is-fullwidth">
                        <select
                          name="lesson_id"
                          value={createForm.lesson_id}
                          onChange={handleCreateFormChange}
                          required
                          style={inputStyle}
                        >
                          <option value="">Select Lesson</option>
                          {lessons.map(l => <option key={l.id || l.uid} value={l.id || l.uid}>{l.lesson_name}</option>)}
                        </select>
                      </div>
                      <span className="icon is-left" style={{ color: themeHex }}>
                        <i className="fas fa-chalkboard"></i>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="column is-full">
                  <div
                    className="box"
                    style={{ backgroundColor: '#f8fafc', borderLeft: '3px solid #3273dc', marginBottom: '20px' }}
                  >
                    <h4 className="subtitle is-6" style={{ color: '#2c3e50', marginBottom: '15px' }}>
                      <i className="fas fa-align-left"></i> Note Content
                    </h4>
                    <div className="field">
                      <div className="control">
                        <textarea
                          className="textarea"
                          name="content"
                          placeholder="Enter note content..."
                          value={createForm.content}
                          onChange={handleCreateFormChange}
                          required
                          style={{ ...inputStyle, minHeight: '200px' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="column is-full">
                  <div className="field is-grouped">
                    <div className="control">
                      <button
                        className={`button ${themeClass} is-medium`}
                        type="submit"
                        disabled={creatingNote}
                        style={{
                          borderRadius: '6px',
                          fontWeight: '600',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '0.75rem 1.5rem'
                        }}
                      >
                        <i className="fas fa-save"></i>
                        <span>{creatingNote ? 'Creating...' : 'Create Note'}</span>
                      </button>
                    </div>
                    <div className="control">
                      <button
                        className="button is-medium"
                        type="button"
                        onClick={resetCreateState}
                        style={{
                          borderRadius: '6px',
                          fontWeight: '600',
                          backgroundColor: '#ffffff',
                          border: '2px solid #3273dc',
                          color: themeHex,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '0.75rem 1.5rem'
                        }}
                      >
                        <i className="fas fa-times"></i>
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                </div>
                  </>
                )}
              </div>
            )}
          </form>
        </div>

        {loading && (
          <div className={`notification ${themeClass}`}>
            <p>Loading notes...</p>
          </div>
        )}

        {error && (
          <div className="notification is-danger">
            <p><strong>Error:</strong> {error}</p>
          </div>
        )}

        {!loading && !error && notes.length === 0 && (
          <div className="notification is-warning">
            <p>No notes found.</p>
          </div>
        )}

        {!loading && notes.length > 0 && (
          <div className="notes-list">
            {notes.map((note) => (
              <div
                key={note.notes_id}
                id={`note-${note.notes_id}`}
                className="box"
                style={{
                  transition: 'all 0.3s ease',
                  borderLeft: '4px solid #3273dc',
                  boxShadow: '0 2px 8px rgba(50, 115, 220, 0.08)'
                }}
              >
                <div
                  className="note-header"
                  onClick={() => toggleExpand(note.notes_id)}
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px',
                    paddingBottom: '15px',
                    borderBottom: expandedId === note.notes_id ? '2px solid #3273dc' : 'none'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <span className="icon" style={{ color: themeHex, marginRight: '10px' }}>
                        <i className="fas fa-sticky-note"></i>
                      </span>
                      <h2 className="subtitle is-4" style={{ margin: 0, color: '#2c3e50' }}>
                        {note.title}
                      </h2>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                      <span
                        className="tag is-light"
                        style={{
                          backgroundColor: '#eff4fb',
                          color: '#2c3e50',
                          fontWeight: '600',
                          padding: '12px 18px',
                          fontSize: '15px'
                        }}
                      >
                        Note {note.notes_id}
                      </span>
                      <span
                        className="tag is-light"
                        style={{
                          backgroundColor: '#eff4fb',
                          color: '#2c3e50',
                          fontWeight: '600',
                          padding: '12px 18px',
                          fontSize: '15px'
                        }}
                      >
                        {note.chapter_name || `Chapter ${note.chapter_id}`}
                      </span>
                      <span
                        className="tag is-light"
                        style={{
                          backgroundColor: '#eff4fb',
                          color: '#2c3e50',
                          fontWeight: '600',
                          padding: '12px 18px',
                          fontSize: '15px'
                        }}
                      >
                        {note.lesson_name || `Lesson ${note.lesson_id}`}
                      </span>
                      <span
                        className={`tag ${note.published ? 'is-success' : 'is-warning'}`}
                        style={{
                          fontWeight: '600',
                          padding: '12px 18px',
                          fontSize: '15px',
                          backgroundColor: note.published ? '#48c774' : '#ffdd57',
                          color: note.published ? '#ffffff' : '#363636'
                        }}
                      >
                        <i className={`fas fa-${note.published ? 'check-circle' : 'clock'}`}></i>
                        {note.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    {activeRole === 'Teacher' && (
                      <>
                        <button
                          type="button"
                          className="button is-large"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditNote(note)
                          }}
                          disabled={editingId !== null}
                          style={getEditButtonStyle(editingId !== null)}
                        >
                          <i className="fas fa-edit"></i>
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          className="button is-large"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteNote(note.notes_id)
                          }}
                          disabled={deletingId === note.notes_id}
                          style={{
                            borderRadius: '6px',
                            fontWeight: '600',
                            backgroundColor: '#ffffff',
                            border: '2px solid #f05149',
                            color: '#f05149',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '0.75rem 1.5rem',
                            opacity: deletingId === note.notes_id ? 0.6 : 1
                          }}
                        >
                          <i className="fas fa-trash"></i>
                          <span>{deletingId === note.notes_id ? 'Deleting...' : 'Delete'}</span>
                        </button>
                      </>
                    )}
                    <span
                      className="icon is-large"
                      style={{
                        color: themeHex,
                        transition: 'transform 0.3s ease',
                        transform: expandedId === note.notes_id ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}
                    >
                      <i className="fas fa-chevron-down"></i>
                    </span>
                  </div>
                </div>

                {expandedId === note.notes_id && editingId !== note.notes_id && (
                  <div className="note-content" style={{ marginTop: '20px', paddingTop: '20px' }}>
                    <h3
                      className="subtitle is-5"
                      style={{ color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}
                    >
                      <span className="icon" style={{ color: themeHex }}>
                        <i className="fas fa-align-left"></i>
                      </span>
                      Content
                    </h3>
                    {note.content ? (
                      <div
                        style={{
                          padding: '15px',
                          backgroundColor: '#f8fafc',
                          color: '#2c3e50',
                          lineHeight: '1.6',
                          whiteSpace: 'pre-wrap'
                        }}
                      >
                        {note.content}
                      </div>
                    ) : (
                      <p className="is-italic" style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
                        <i className="fas fa-inbox"></i> No content available.
                      </p>
                    )}
                  </div>
                )}

                {editingId === note.notes_id && !isEditingGeneratedNote && (
                  <div className="note-edit-form" style={{ marginTop: '20px', paddingTop: '20px' }}>
                    <div className="box" style={{ backgroundColor: '#f8fafc', borderLeft: '3px solid #3273dc' }}>
                      <h4 className="subtitle is-6" style={{ color: '#2c3e50', marginBottom: '15px' }}>
                        <i className="fas fa-edit"></i> Edit Note
                      </h4>

                      <div className="columns is-multiline">
                        <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
                          <div className="field">
                            <label className="label" style={{ color: '#2c3e50', fontWeight: '600' }}>Title</label>
                            <div className="control">
                              <input
                                className="input"
                                type="text"
                                name="title"
                                value={editForm.title}
                                onChange={handleEditFormChange}
                                required
                                style={inputStyle}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
                          <div className="field">
                            <label className="label" style={{ color: '#2c3e50', fontWeight: '600' }}>Chapter ID</label>
                            <div className="control">
                              <input
                                className="input"
                                type="number"
                                name="chapter_id"
                                value={editForm.chapter_id}
                                onChange={handleEditFormChange}
                                required
                                style={inputStyle}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
                          <div className="field">
                            <label className="label" style={{ color: '#2c3e50', fontWeight: '600' }}>Lesson ID</label>
                            <div className="control">
                              <input
                                className="input"
                                type="number"
                                name="lesson_id"
                                value={editForm.lesson_id}
                                onChange={handleEditFormChange}
                                required
                                style={inputStyle}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
                          <div className="field">
                            <label className="label" style={{ color: '#2c3e50', fontWeight: '600' }}>Published</label>
                            <div className="control">
                              <label className="checkbox" style={{ color: '#2c3e50', fontWeight: '600' }}>
                                <input
                                  type="checkbox"
                                  name="published"
                                  checked={editForm.published}
                                  onChange={handleEditFormChange}
                                  style={{ marginRight: '8px' }}
                                />
                                Mark as published
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="column is-full">
                          <div className="field">
                            <label className="label" style={{ color: '#2c3e50', fontWeight: '600' }}>Content</label>
                            <div className="control">
                              <textarea
                                className="textarea"
                                name="content"
                                value={editForm.content}
                                onChange={handleEditFormChange}
                                required
                                style={{ ...inputStyle, minHeight: '200px' }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="column is-full">
                          <div className="field is-grouped">
                            <div className="control">
                              <button
                                className={`button ${themeClass} is-medium`}
                                type="button"
                                onClick={() => handleUpdateNote(note.notes_id)}
                                disabled={updatingNote}
                                style={{
                                  borderRadius: '6px',
                                  fontWeight: '600',
                                  border: 'none',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  padding: '0.75rem 1.5rem'
                                }}
                              >
                                <i className="fas fa-save"></i>
                                <span>{updatingNote ? 'Saving...' : 'Save Changes'}</span>
                              </button>
                            </div>
                            <div className="control">
                              <button
                                className="button is-medium"
                                type="button"
                                onClick={handleCancelEdit}
                                disabled={updatingNote}
                                style={{
                                  borderRadius: '6px',
                                  fontWeight: '600',
                                  backgroundColor: '#ffffff',
                                  border: '2px solid #3273dc',
                                  color: themeHex,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  padding: '0.75rem 1.5rem'
                                }}
                              >
                                <i className="fas fa-times"></i>
                                <span>Cancel</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default NotesView
