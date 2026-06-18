import { useState, useEffect } from 'react'
import CreateModeTabs from '../components/CreateModeTabs'

const API_BASE = 'http://localhost:8001'

const parseApiError = (detail, fallback) => {
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg
  return fallback
}

const HWView = () => {
  const [homeworks, setHomeworks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [isCreateMode, setIsCreateMode] = useState(false)
  const [creatingHomework, setCreatingHomework] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [updatingHomework, setUpdatingHomework] = useState(false)
  const [aiGoal, setAiGoal] = useState('')
  const [generatingWithAi, setGeneratingWithAi] = useState(false)
  const [createTab, setCreateTab] = useState('manual')
  const [generatedPreview, setGeneratedPreview] = useState(null)
  const [activeGenerationGoal, setActiveGenerationGoal] = useState('')

  const resetAiState = () => {
    setAiGoal('')
    setGeneratedPreview(null)
    setActiveGenerationGoal('')
    setGeneratingWithAi(false)
  }

  const resetCreateState = () => {
    setIsCreateMode(false)
    setCreateTab('manual')
    setCreateForm({
      title: '',
      chapter_id: '',
      lesson_id: '',
      published: false,
      homework_questions: [{ question: '', answer: '' }]
    })
    resetAiState()
  }
  const [editForm, setEditForm] = useState({
    title: '',
    chapter_id: '',
    lesson_id: '',
    homework_questions: []
  })
  
  // Filter states
  const [filters, setFilters] = useState({
    homework_id: '',
    title: '',
    chapter_id: '',
    lesson_id: '',
    published: ''
  })

  // Create homework form states
  const [createForm, setCreateForm] = useState({
    title: '',
    chapter_id: '',
    lesson_id: '',
    published: false,
    homework_questions: [{ question: '', answer: '' }]
  })

  useEffect(() => {
    fetchHomeworks()
  }, [])

  const fetchHomeworks = async (useFilters = false, silent = false) => {
    try {
      if (!silent) setLoading(true)
      let url = `${API_BASE}/homeworks`
      
      // If filters are being applied, use the /homework endpoint with query parameters
      if (useFilters) {
        const params = new URLSearchParams()
        
        if (filters.homework_id) params.append('homework_id', filters.homework_id)
        if (filters.title) params.append('title', filters.title)
        if (filters.chapter_id) params.append('chapter_id', filters.chapter_id)
        if (filters.lesson_id) params.append('lesson_id', filters.lesson_id)
        if (filters.published !== '') params.append('published', filters.published === 'true')
        
        if (params.toString()) {
          url = `${API_BASE}/homework?${params.toString()}`
        }
      }
      
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch homeworks: ${response.statusText}`)
      }
      const data = await response.json()
      setHomeworks(Array.isArray(data) ? data : [data])
      setError(null)
    } catch (err) {
      setError(err.message)
      setHomeworks([])
    } finally {
      if (!silent) setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters({
      ...filters,
      [name]: value
    })
  }

  const handleCreateFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setCreateForm({
      ...createForm,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...createForm.homework_questions]
    updatedQuestions[index][field] = value
    setCreateForm({
      ...createForm,
      homework_questions: updatedQuestions
    })
  }

  const addQuestion = () => {
    setCreateForm({
      ...createForm,
      homework_questions: [...createForm.homework_questions, { question: '', answer: '' }]
    })
  }

  const removeQuestion = (index) => {
    setCreateForm({
      ...createForm,
      homework_questions: createForm.homework_questions.filter((_, i) => i !== index)
    })
  }

  const handleCreateHomework = async (e) => {
    e.preventDefault()
    setCreatingHomework(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE}/create-homework`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(createForm)
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(parseApiError(err.detail, 'Failed to create homework'))
      }

      // Reset form and refresh homeworks
      setCreateForm({
        title: '',
        chapter_id: '',
        lesson_id: '',
        published: false,
        homework_questions: [{ question: '', answer: '' }]
      })
      resetAiState()
      setIsCreateMode(false)
      await fetchHomeworks()
    } catch (err) {
      setError(err.message)
    } finally {
      setCreatingHomework(false)
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

    try {
      const response = await fetch(`${API_BASE}/homework/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: aiGoal.trim() })
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(parseApiError(err.detail, 'Failed to generate homework with AI'))
      }

      const data = await response.json()
      setGeneratedPreview(data)
      if (data.homework_id) {
        handleEditHomework(data)
      }
      await fetchHomeworks(false, true)
    } catch (err) {
      setError(err.message)
      setActiveGenerationGoal('')
    } finally {
      setGeneratingWithAi(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchHomeworks(true)
  }

  const handleReset = () => {
    setFilters({
      homework_id: '',
      title: '',
      chapter_id: '',
      lesson_id: '',
      published: ''
    })
    fetchHomeworks(false)
  }


  const toggleExpand = (homeworkId) => {
    setExpandedId(expandedId === homeworkId ? null : homeworkId)
  }

  const handleDeleteHomework = async (homeworkId) => {
    if (!window.confirm('Are you sure you want to delete this homework? This action cannot be undone.')) {
      return
    }

    setDeletingId(homeworkId)
    setError(null)

    try {
      const response = await fetch(`${API_BASE}/delete-homework/${homeworkId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(parseApiError(err.detail, `Failed to delete homework: ${response.statusText}`))
      }

      // Refresh homeworks list after deletion
      await fetchHomeworks()
    } catch (err) {
      setError(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  const handleEditHomework = (homework) => {
    setEditingId(homework.homework_id)
    setEditForm({
      title: homework.title,
      chapter_id: homework.chapter_id,
      lesson_id: homework.lesson_id,
      homework_questions: homework.homework_questions ? [...homework.homework_questions] : []
    })
    setExpandedId(null)
  }

  const handleEditGeneratedHomework = (homework) => {
    if (editingId !== null || !homework.homework_id) return
    handleEditHomework(homework)
  }

  const handleEditFormChange = (e) => {
    const { name, value } = e.target
    setEditForm({
      ...editForm,
      [name]: name === 'chapter_id' || name === 'lesson_id' ? parseInt(value) : value
    })
  }

  const handleEditQuestionChange = (index, field, value) => {
    const updatedQuestions = [...editForm.homework_questions]
    updatedQuestions[index][field] = value
    setEditForm({
      ...editForm,
      homework_questions: updatedQuestions
    })
  }

  const handleUpdateHomework = async (homeworkId) => {
    setUpdatingHomework(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE}/update-homework/${homeworkId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(parseApiError(err.detail, `Failed to update homework: ${response.statusText}`))
      }

      const fallbackUpdatedHomework = {
        ...generatedPreview,
        ...editForm,
        homework_id: homeworkId
      }
      const responseData = await response.json().catch(() => null)
      const updatedHomework = responseData?.homework_id ? responseData : fallbackUpdatedHomework

      if (generatedPreview?.homework_id === homeworkId) {
        setGeneratedPreview(updatedHomework)
      }

      // Reset editing state and refresh homeworks list
      setEditingId(null)
      await fetchHomeworks(false, Boolean(generatedPreview?.homework_id === homeworkId))
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdatingHomework(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({
      title: '',
      chapter_id: '',
      lesson_id: '',
      homework_questions: []
    })
  }

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

  const isEditingGeneratedHomework = Boolean(generatedPreview?.homework_id && editingId === generatedPreview.homework_id)

  return (
    <div className="homework-management">
      <div className="hero is-info is-medium">
        <div className="hero-body has-text-centered">
          <h1 className="title">HomeWork Management</h1>
        </div>
      </div>

      <section className="section">
        {/* Filter/Search Bar */}
        <div 
          className="box" 
          style={{ 
            marginBottom: '30px', 
            background: 'linear-gradient(135deg, #f0f7ff 0%, #e8f4ff 100%)',
            borderLeft: '5px solid #3273dc',
            boxShadow: '0 2px 8px rgba(50, 115, 220, 0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <span className="icon" style={{ color: '#3273dc', marginRight: '10px' }}>
              <i className={`fas fa-${isCreateMode ? 'plus-circle' : 'filter'}`}></i>
            </span>
            <h2 className="subtitle is-4" style={{ margin: 0, color: '#2c3e50' }}>
              {isCreateMode ? 'Create Homework' : 'Search & Filter Homeworks'}
            </h2>
          </div>

          <form onSubmit={isCreateMode ? handleCreateHomework : handleSearch}>
            {!isCreateMode ? (
              // FILTER MODE
              <div className="columns is-multiline">
                <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
                  <div className="field">
                    <label className="label" style={{ color: '#2c3e50', fontWeight: '600' }}>
                      <span className="icon is-small" style={{ marginRight: '5px' }}>
                        <i className="fas fa-hashtag"></i>
                      </span>
                      Homework ID
                    </label>
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="number"
                        name="homework_id"
                        placeholder="e.g., 1"
                        value={filters.homework_id}
                        onChange={handleFilterChange}
                        style={{ borderColor: '#3273dc', borderWidth: '1px' }}
                      />
                      <span className="icon is-left" style={{ color: '#3273dc' }}>
                        <i className="fas fa-book"></i>
                      </span>
                    </div>
                  </div>
                </div>

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
                        placeholder="e.g., Electromagnetism"
                        value={filters.title}
                        onChange={handleFilterChange}
                        style={{ borderColor: '#3273dc', borderWidth: '1px' }}
                      />
                      <span className="icon is-left" style={{ color: '#3273dc' }}>
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
                      Chapter ID
                    </label>
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="number"
                        name="chapter_id"
                        placeholder="e.g., 1"
                        value={filters.chapter_id}
                        onChange={handleFilterChange}
                        style={{ borderColor: '#3273dc', borderWidth: '1px' }}
                      />
                      <span className="icon is-left" style={{ color: '#3273dc' }}>
                        <i className="fas fa-layer-group"></i>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
                  <div className="field">
                    <label className="label" style={{ color: '#2c3e50', fontWeight: '600' }}>
                      <span className="icon is-small" style={{ marginRight: '5px' }}>
                        <i className="fas fa-graduation-cap"></i>
                      </span>
                      Lesson ID
                    </label>
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="number"
                        name="lesson_id"
                        placeholder="e.g., 1"
                        value={filters.lesson_id}
                        onChange={handleFilterChange}
                        style={{ borderColor: '#3273dc', borderWidth: '1px' }}
                      />
                      <span className="icon is-left" style={{ color: '#3273dc' }}>
                        <i className="fas fa-chalkboard"></i>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
                  <div className="field">
                    <label className="label" style={{ color: '#2c3e50', fontWeight: '600' }}>
                      <span className="icon is-small" style={{ marginRight: '5px' }}>
                        <i className="fas fa-check-circle"></i>
                      </span>
                      Published Status
                    </label>
                    <div className="control has-icons-left">
                      <div className="select is-fullwidth">
                        <select
                          name="published"
                          value={filters.published}
                          onChange={handleFilterChange}
                          style={{ borderColor: '#3273dc', borderWidth: '1px', color: '#2c3e50' }}
                        >
                          <option value="">All Status</option>
                          <option value="true">Published</option>
                          <option value="false">Draft</option>
                        </select>
                      </div>
                      <span className="icon is-left" style={{ color: '#3273dc' }}>
                        <i className="fas fa-bars"></i>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="column is-full">
                  <div className="field is-grouped">
                    <div className="control">
                      <button 
                        className="button is-info is-medium" 
                        type="submit"
                        style={{ 
                          borderRadius: '6px',
                          fontWeight: '600',
                          transition: 'all 0.3s ease',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          padding: '0.75rem 1.5rem'
                        }}
                        onMouseEnter={(e) => e.target.style.boxShadow = '0 4px 12px rgba(50, 115, 220, 0.4)'}
                        onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
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
                          color: '#3273dc',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          padding: '0.75rem 1.5rem'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#3273dc'
                          e.target.style.color = '#ffffff'
                          e.target.style.boxShadow = '0 4px 12px rgba(50, 115, 220, 0.3)'
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#ffffff'
                          e.target.style.color = '#3273dc'
                          e.target.style.boxShadow = 'none'
                        }}
                      >
                        <i className="fas fa-redo"></i>
                        <span>Reset</span>
                      </button>
                    </div>
                    <div className="control">
                      <button 
                        className="button is-success is-medium" 
                        type="button"
                        onClick={() => {
                          setIsCreateMode(true)
                          setCreateTab('manual')
                          resetAiState()
                        }}
                        style={{ 
                          borderRadius: '6px',
                          fontWeight: '600',
                          transition: 'all 0.3s ease',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          padding: '0.75rem 1.5rem'
                        }}
                        onMouseEnter={(e) => e.target.style.boxShadow = '0 4px 12px rgba(72, 199, 116, 0.4)'}
                        onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
                      >
                        <i className="fas fa-plus"></i>
                        <span>Create Homework</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // CREATE MODE
              <div className="columns is-multiline">
                <div className="column is-full">
                  <CreateModeTabs activeTab={createTab} onTabChange={setCreateTab} />
                </div>

                {createTab === 'ai' ? (
                  <>
                    <div className="column is-full">
                      <div className="box" style={{ backgroundColor: '#faf5ff', borderLeft: '3px solid #7c3aed', marginBottom: '20px' }}>
                        <h4 className="subtitle is-6" style={{ color: '#2c3e50', marginBottom: '15px' }}>
                          <i className="fas fa-robot"></i> AI Generation
                        </h4>
                        <div className="field">
                          <label className="label" style={{ color: '#2c3e50', fontWeight: '600' }}>Goal</label>
                          <div className="control">
                            <textarea
                              className="textarea"
                              placeholder="Describe what you want to generate, e.g., 5 homework questions on Newton's laws..."
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
                        <div className="notification is-info">
                          <p style={{ marginBottom: '8px' }}>
                            <i className="fas fa-spinner fa-spin"></i> Generating homework content...
                          </p>
                          <p><strong>Goal:</strong> {activeGenerationGoal}</p>
                        </div>
                      </div>
                    )}

                    {generatedPreview && !generatingWithAi && (
                      <div className="column is-full">
                        <div className="box" style={{ backgroundColor: '#f0fdf4', borderLeft: '4px solid #48c774', marginBottom: '20px' }}>
                          <h4 className="subtitle is-6" style={{ color: '#2c3e50', marginBottom: '15px' }}>
                            <i className="fas fa-check-circle" style={{ color: '#48c774' }}></i> Generated Content
                          </h4>
                          {editingId === generatedPreview.homework_id ? (
                            <div className="homework-edit-form">
                              <div className="box" style={{ backgroundColor: '#f8fafc', borderLeft: '3px solid #3273dc', marginBottom: '20px' }}>
                                <h4 className="subtitle is-6" style={{ color: '#2c3e50', marginBottom: '15px' }}>
                                  <i className="fas fa-edit"></i> Edit Homework
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
                                          placeholder="e.g., Physics Homework"
                                          value={editForm.title}
                                          onChange={handleEditFormChange}
                                          required
                                          style={{ borderColor: '#3273dc', borderWidth: '1px' }}
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
                                          placeholder="e.g., 1"
                                          value={editForm.chapter_id}
                                          onChange={handleEditFormChange}
                                          required
                                          style={{ borderColor: '#3273dc', borderWidth: '1px' }}
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
                                          placeholder="e.g., 1"
                                          value={editForm.lesson_id}
                                          onChange={handleEditFormChange}
                                          required
                                          style={{ borderColor: '#3273dc', borderWidth: '1px' }}
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="column is-full">
                                    <h5 className="subtitle is-6" style={{ color: '#2c3e50', marginBottom: '15px' }}>
                                      <i className="fas fa-list-ul"></i> Questions & Answers
                                    </h5>
                                    {editForm.homework_questions.map((q, index) => (
                                      <div key={index} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: index < editForm.homework_questions.length - 1 ? '1px solid #ddd' : 'none' }}>
                                        <p style={{ marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>Question {index + 1}</p>
                                        <div className="field" style={{ marginBottom: '15px' }}>
                                          <div className="control">
                                            <textarea
                                              className="textarea"
                                              placeholder="Enter question..."
                                              value={q.question}
                                              onChange={(e) => handleEditQuestionChange(index, 'question', e.target.value)}
                                              required
                                              style={{ borderColor: '#3273dc', borderWidth: '1px', minHeight: '80px' }}
                                            />
                                          </div>
                                        </div>
                                        <div className="field" style={{ marginBottom: '15px' }}>
                                          <div className="control">
                                            <textarea
                                              className="textarea"
                                              placeholder="Enter answer (optional)..."
                                              value={q.answer}
                                              onChange={(e) => handleEditQuestionChange(index, 'answer', e.target.value)}
                                              style={{ borderColor: '#3273dc', borderWidth: '1px', minHeight: '80px' }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  <div className="column is-full">
                                    <div className="field is-grouped">
                                      <div className="control">
                                        <button
                                          className="button is-success is-medium"
                                          type="button"
                                          onClick={() => handleUpdateHomework(generatedPreview.homework_id)}
                                          disabled={updatingHomework}
                                          style={{
                                            borderRadius: '6px',
                                            fontWeight: '600',
                                            transition: 'all 0.3s ease',
                                            border: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            padding: '0.75rem 1.5rem'
                                          }}
                                        >
                                          <i className="fas fa-save"></i>
                                          <span>{updatingHomework ? 'Saving...' : 'Save Changes'}</span>
                                        </button>
                                      </div>
                                      <div className="control">
                                        <button
                                          className="button is-medium"
                                          type="button"
                                          onClick={handleCancelEdit}
                                          disabled={updatingHomework}
                                          style={{
                                            borderRadius: '6px',
                                            fontWeight: '600',
                                            backgroundColor: '#ffffff',
                                            border: '2px solid #3273dc',
                                            color: '#3273dc',
                                            transition: 'all 0.3s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
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
                              <p style={{ color: '#2c3e50', marginBottom: '15px' }}>
                                <strong>Goal:</strong> {activeGenerationGoal}
                              </p>
                              <p className="help" style={{ marginBottom: '15px', color: '#666' }}>
                                Saved automatically to the database.
                              </p>
                              <p style={{ marginBottom: '8px' }}>
                                <strong>Title:</strong> {generatedPreview.title}
                              </p>
                              <p style={{ marginBottom: '15px' }}>
                                <strong>Homework ID:</strong> {generatedPreview.homework_id ?? '-'} |{' '}
                                <strong>Chapter:</strong> {generatedPreview.chapter_id} |{' '}
                                <strong>Lesson:</strong> {generatedPreview.lesson_id}
                              </p>
                              <h5 className="subtitle is-6" style={{ color: '#2c3e50', marginBottom: '10px' }}>Questions</h5>
                              {generatedPreview.homework_questions?.map((q, index) => (
                                <div key={index} style={{ marginBottom: '12px', padding: '12px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '6px' }}>
                                  <p style={{ marginBottom: '6px' }}><strong>Q{index + 1}:</strong> {q.question}</p>
                                  {q.answer && <p style={{ color: '#48c774' }}><strong>Answer:</strong> {q.answer}</p>}
                                </div>
                              ))}
                              <button
                                type="button"
                                className="button is-large"
                                onClick={() => handleEditGeneratedHomework(generatedPreview)}
                                disabled={editingId !== null || !generatedPreview.homework_id}
                                style={{ ...getEditButtonStyle(editingId !== null || !generatedPreview.homework_id), marginTop: '15px' }}
                              >
                                <i className="fas fa-edit"></i>
                                <span>Edit</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="column is-full">
                      <button type="button" className="button is-medium" onClick={resetCreateState} style={{ borderRadius: '6px', fontWeight: '600', backgroundColor: '#ffffff', border: '2px solid #3273dc', color: '#3273dc', display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1.5rem' }}>
                        <i className="fas fa-times"></i><span>Cancel</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
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
                        placeholder="e.g., Physics Homework"
                        value={createForm.title}
                        onChange={handleCreateFormChange}
                        required
                        style={{ borderColor: '#3273dc', borderWidth: '1px' }}
                      />
                      <span className="icon is-left" style={{ color: '#3273dc' }}>
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
                      Chapter ID
                    </label>
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="number"
                        name="chapter_id"
                        placeholder="e.g., 1"
                        value={createForm.chapter_id}
                        onChange={handleCreateFormChange}
                        required
                        style={{ borderColor: '#3273dc', borderWidth: '1px' }}
                      />
                      <span className="icon is-left" style={{ color: '#3273dc' }}>
                        <i className="fas fa-layer-group"></i>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
                  <div className="field">
                    <label className="label" style={{ color: '#2c3e50', fontWeight: '600' }}>
                      <span className="icon is-small" style={{ marginRight: '5px' }}>
                        <i className="fas fa-graduation-cap"></i>
                      </span>
                      Lesson ID
                    </label>
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="number"
                        name="lesson_id"
                        placeholder="e.g., 1"
                        value={createForm.lesson_id}
                        onChange={handleCreateFormChange}
                        required
                        style={{ borderColor: '#3273dc', borderWidth: '1px' }}
                      />
                      <span className="icon is-left" style={{ color: '#3273dc' }}>
                        <i className="fas fa-chalkboard"></i>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="column is-full">
                  <div className="box" style={{ backgroundColor: '#f8fafc', borderLeft: '3px solid #3273dc', marginBottom: '20px' }}>
                    <h4 className="subtitle is-6" style={{ color: '#2c3e50', marginBottom: '15px' }}>
                      <i className="fas fa-list-ul"></i> Questions & Answers
                    </h4>
                    {createForm.homework_questions.map((q, index) => (
                      <div key={index} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: index < createForm.homework_questions.length - 1 ? '1px solid #ddd' : 'none' }}>
                        <p style={{ marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>Question {index + 1}</p>
                        <div className="field" style={{ marginBottom: '15px' }}>
                          <div className="control">
                            <textarea
                              className="textarea"
                              placeholder="Enter question..."
                              value={q.question}
                              onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                              required
                              style={{ borderColor: '#3273dc', borderWidth: '1px', minHeight: '80px' }}
                            />
                          </div>
                        </div>
                        <div className="field" style={{ marginBottom: '15px' }}>
                          <div className="control">
                            <textarea
                              className="textarea"
                              placeholder="Enter answer (optional)..."
                              value={q.answer}
                              onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                              style={{ borderColor: '#3273dc', borderWidth: '1px', minHeight: '80px' }}
                            />
                          </div>
                        </div>
                        {createForm.homework_questions.length > 1 && (
                          <button
                            type="button"
                            className="button is-danger is-small"
                            onClick={() => removeQuestion(index)}
                            style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                          >
                            <i className="fas fa-trash"></i>
                            Remove Question
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      className="button is-info is-small"
                      onClick={addQuestion}
                      style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                      <i className="fas fa-plus"></i>
                      Add Question
                    </button>
                  </div>
                </div>

                <div className="column is-full">
                  <div className="field is-grouped">
                    <div className="control">
                      <button 
                        className="button is-success is-medium" 
                        type="submit"
                        disabled={creatingHomework}
                        style={{ 
                          borderRadius: '6px',
                          fontWeight: '600',
                          transition: 'all 0.3s ease',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          padding: '0.75rem 1.5rem'
                        }}
                        onMouseEnter={(e) => !creatingHomework && (e.target.style.boxShadow = '0 4px 12px rgba(72, 199, 116, 0.4)')}
                        onMouseLeave={(e) => !creatingHomework && (e.target.style.boxShadow = 'none')}
                      >
                        <i className="fas fa-save"></i>
                        <span>{creatingHomework ? 'Creating...' : 'Create Homework'}</span>
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
                          color: '#3273dc',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          padding: '0.75rem 1.5rem'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#3273dc'
                          e.target.style.color = '#ffffff'
                          e.target.style.boxShadow = '0 4px 12px rgba(50, 115, 220, 0.3)'
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#ffffff'
                          e.target.style.color = '#3273dc'
                          e.target.style.boxShadow = 'none'
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
          <div className="notification is-info">
            <p>Loading homeworks...</p>
          </div>
        )}

        {error && (
          <div className="notification is-danger">
            <p><strong>Error:</strong> {error}</p>
          </div>
        )}

        {!loading && !error && homeworks.length === 0 && (
          <div className="notification is-warning">
            <p>No homeworks found.</p>
          </div>
        )}

        {!loading && homeworks.length > 0 && (
          <div className="homework-list">
            {homeworks.map((homework) => (
              <div 
                key={homework.homework_id}
                id={`homework-${homework.homework_id}`}
                className="box"
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  borderLeft: '4px solid #3273dc',
                  boxShadow: '0 2px 8px rgba(50, 115, 220, 0.08)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(50, 115, 220, 0.15)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(50, 115, 220, 0.08)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div
                  className="homework-header"
                  onClick={() => toggleExpand(homework.homework_id)}
                  style={{ 
                    cursor: 'pointer', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    paddingBottom: '15px',
                    borderBottom: expandedId === homework.homework_id ? '2px solid #3273dc' : 'none'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <span className="icon" style={{ color: '#3273dc', marginRight: '10px' }}>
                        <i className="fas fa-book-open"></i>
                      </span>
                      <h2 className="subtitle is-4" style={{ margin: 0, color: '#2c3e50' }}>
                        {homework.title}
                      </h2>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                      <span className="tag is-light" style={{ backgroundColor: '#eff4fb', color: '#2c3e50', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 18px', fontSize: '15px' }}>
                        Homework {homework.homework_id}
                      </span>
                      <span className="tag is-light" style={{ backgroundColor: '#eff4fb', color: '#2c3e50', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 18px', fontSize: '15px' }}>
                        Chapter {homework.chapter_id}
                      </span>
                      <span className="tag is-light" style={{ backgroundColor: '#eff4fb', color: '#2c3e50', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 18px', fontSize: '15px' }}>
                        Lesson {homework.lesson_id}
                      </span>
                      <span 
                        className={`tag ${homework.published ? 'is-success' : 'is-warning'}`}
                        style={{ 
                          fontWeight: '600',
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          padding: '12px 18px',
                          fontSize: '15px',
                          backgroundColor: homework.published ? '#48c774' : '#ffdd57',
                          color: homework.published ? '#ffffff' : '#363636'
                        }}
                      >
                        <i className={`fas fa-${homework.published ? 'check-circle' : 'clock'}`}></i>
                        {homework.published ? 'Published' : 'Draft'}
                      </span>
                      <span className="tag is-info is-light" style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 18px', fontSize: '15px' }}>
                        {homework.homework_questions?.length || 0} Questions
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      type="button"
                      className="button is-large"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditHomework(homework)
                      }}
                      disabled={editingId !== null}
                      title="Edit this homework"
                      style={getEditButtonStyle(editingId !== null)}
                      onMouseEnter={(e) => editingId === null && (e.target.style.boxShadow = '0 4px 12px rgba(72, 199, 116, 0.4)')}
                      onMouseLeave={(e) => (e.target.style.boxShadow = 'none')}
                    >
                      <i className="fas fa-edit"></i>
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      className="button is-large"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteHomework(homework.homework_id)
                      }}
                      disabled={deletingId === homework.homework_id}
                      title="Delete this homework"
                      style={{
                        borderRadius: '6px',
                        fontWeight: '600',
                        backgroundColor: '#ffffff',
                        border: '2px solid #f05149',
                        color: '#f05149',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '0.75rem 1.5rem',
                        opacity: deletingId === homework.homework_id ? 0.6 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (deletingId !== homework.homework_id) {
                          e.target.style.boxShadow = '0 4px 12px rgba(240, 81, 73, 0.4)'                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.boxShadow = 'none'
                      }}
                    >
                      <i className="fas fa-trash"></i>
                      <span>{deletingId === homework.homework_id ? 'Deleting...' : 'Delete'}</span>
                    </button>
                    <span className="icon is-large" style={{ color: '#3273dc', transition: 'transform 0.3s ease', transform: expandedId === homework.homework_id ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                      <i className="fas fa-chevron-down"></i>
                    </span>
                  </div>
                </div>

                {expandedId === homework.homework_id && editingId !== homework.homework_id && (
                  <div className="homework-content" style={{ marginTop: '20px', paddingTop: '20px' }}>
                    <h3 className="subtitle is-5" style={{ color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                      <span className="icon" style={{ color: '#3273dc' }}>
                        <i className="fas fa-list-ul"></i>
                      </span>
                      Questions & Answers
                    </h3>
                    {homework.homework_questions && homework.homework_questions.length > 0 ? (
                      <div>
                        {homework.homework_questions.map((q, index) => (
                          <div 
                            key={index} 
                            style={{ 
                              marginBottom: '20px', 
                              padding: '15px', 
                              backgroundColor: '#f8fafc',
                            }}
                          >
                            <p style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                              <span style={{ color: '#3273dc', fontWeight: 'bold', minWidth: '30px', marginTop: '2px' }}>
                                QUE:
                              </span>
                              <span className="is-size-6" style={{ color: '#2c3e50', lineHeight: '1.6' }}>
                               {q.question}
                              </span>
                            </p>
                            {q.answer && (
                              <p style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginLeft: '0px' }}>
                                <span style={{ color: '#48c774', fontWeight: 'bold', minWidth: '30px', marginTop: '2px' }}>
                                  ANS:
                                </span>
                                <span className="is-size-6" style={{ color: '#555', lineHeight: '1.6' }}>
                                 {q.answer}
                                </span>
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="is-italic" style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
                        <i className="fas fa-inbox"></i> No questions available.
                      </p>
                    )}
                  </div>
                )}

                {editingId === homework.homework_id && !isEditingGeneratedHomework && (
                  <div className="homework-edit-form" style={{ marginTop: '20px', paddingTop: '20px' }}>
                    <div className="box" style={{ backgroundColor: '#f8fafc', borderLeft: '3px solid #3273dc', marginBottom: '20px' }}>
                      <h4 className="subtitle is-6" style={{ color: '#2c3e50', marginBottom: '15px' }}>
                        <i className="fas fa-edit"></i> Edit Homework
                      </h4>
                      
                      <div className="columns is-multiline">
                        <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
                          <div className="field">
                            <label className="label" style={{ color: '#2c3e50', fontWeight: '600' }}>
                              Title
                            </label>
                            <div className="control">
                              <input
                                className="input"
                                type="text"
                                name="title"
                                placeholder="e.g., Physics Homework"
                                value={editForm.title}
                                onChange={handleEditFormChange}
                                required
                                style={{ borderColor: '#3273dc', borderWidth: '1px' }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
                          <div className="field">
                            <label className="label" style={{ color: '#2c3e50', fontWeight: '600' }}>
                              Chapter ID
                            </label>
                            <div className="control">
                              <input
                                className="input"
                                type="number"
                                name="chapter_id"
                                placeholder="e.g., 1"
                                value={editForm.chapter_id}
                                onChange={handleEditFormChange}
                                required
                                style={{ borderColor: '#3273dc', borderWidth: '1px' }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
                          <div className="field">
                            <label className="label" style={{ color: '#2c3e50', fontWeight: '600' }}>
                              Lesson ID
                            </label>
                            <div className="control">
                              <input
                                className="input"
                                type="number"
                                name="lesson_id"
                                placeholder="e.g., 1"
                                value={editForm.lesson_id}
                                onChange={handleEditFormChange}
                                required
                                style={{ borderColor: '#3273dc', borderWidth: '1px' }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="column is-full">
                          <h5 className="subtitle is-6" style={{ color: '#2c3e50', marginBottom: '15px' }}>
                            <i className="fas fa-list-ul"></i> Questions & Answers
                          </h5>
                          {editForm.homework_questions.map((q, index) => (
                            <div key={index} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: index < editForm.homework_questions.length - 1 ? '1px solid #ddd' : 'none' }}>
                              <p style={{ marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>Question {index + 1}</p>
                              <div className="field" style={{ marginBottom: '15px' }}>
                                <div className="control">
                                  <textarea
                                    className="textarea"
                                    placeholder="Enter question..."
                                    value={q.question}
                                    onChange={(e) => handleEditQuestionChange(index, 'question', e.target.value)}
                                    required
                                    style={{ borderColor: '#3273dc', borderWidth: '1px', minHeight: '80px' }}
                                  />
                                </div>
                              </div>
                              <div className="field" style={{ marginBottom: '15px' }}>
                                <div className="control">
                                  <textarea
                                    className="textarea"
                                    placeholder="Enter answer (optional)..."
                                    value={q.answer}
                                    onChange={(e) => handleEditQuestionChange(index, 'answer', e.target.value)}
                                    style={{ borderColor: '#3273dc', borderWidth: '1px', minHeight: '80px' }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="column is-full">
                          <div className="field is-grouped">
                            <div className="control">
                              <button 
                                className="button is-success is-medium" 
                                type="button"
                                onClick={() => handleUpdateHomework(homework.homework_id)}
                                disabled={updatingHomework}
                                style={{ 
                                  borderRadius: '6px',
                                  fontWeight: '600',
                                  transition: 'all 0.3s ease',
                                  border: 'none',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '8px',
                                  padding: '0.75rem 1.5rem'
                                }}
                                onMouseEnter={(e) => !updatingHomework && (e.target.style.boxShadow = '0 4px 12px rgba(72, 199, 116, 0.4)')}
                                onMouseLeave={(e) => !updatingHomework && (e.target.style.boxShadow = 'none')}
                              >
                                <i className="fas fa-save"></i>
                                <span>{updatingHomework ? 'Saving...' : 'Save Changes'}</span>
                              </button>
                            </div>
                            <div className="control">
                              <button 
                                className="button is-medium" 
                                type="button"
                                onClick={handleCancelEdit}
                                disabled={updatingHomework}
                                style={{ 
                                  borderRadius: '6px',
                                  fontWeight: '600',
                                  backgroundColor: '#ffffff',
                                  border: '2px solid #3273dc',
                                  color: '#3273dc',
                                  transition: 'all 0.3s ease',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '8px',
                                  padding: '0.75rem 1.5rem'
                                }}
                                onMouseEnter={(e) => {
                                  if (!updatingHomework) {
                                    e.target.style.boxShadow = '0 4px 12px rgba(50, 115, 220, 0.4)'
                                    e.target.style.backgroundColor = '#f0f7ff'
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.boxShadow = 'none'
                                  e.target.style.backgroundColor = '#ffffff'
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

export default HWView
