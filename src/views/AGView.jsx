import { useState, useEffect, useContext } from 'react'
import axios from '../api'
import CreateModeTabs from '../components/CreateModeTabs'
import { RoleContext } from '../context/RoleContext'

const API_BASE = 'http://localhost:8001'

const emptyMcq = () => ({
  question: '',
  options: ['', '', '', ''],
  correct_answer: ''
})

const emptyAnswer = () => ({
  question: '',
  answer: ''
})

const parseApiError = (detail, fallback) => {
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg
  return fallback
}

const buildMcqPoolPayload = (mcqPool = []) =>
  mcqPool.map((mcq) => ({
    question: mcq.question,
    options: mcq.options.filter((opt) => opt.trim() !== ''),
    ...(mcq.correct_answer ? { correct_answer: mcq.correct_answer } : {})
  }))

const mapMcqPoolFromApi = (mcqPool = []) => {
  if (!mcqPool.length) return [emptyMcq()]
  return mcqPool.map((mcq) => {
    const options = mcq.options?.length ? [...mcq.options] : ['', '', '', '']
    while (options.length < 4) options.push('')
    return {
      question: mcq.question || '',
      options,
      correct_answer: mcq.correct_answer || ''
    }
  })
}

const mapAnswersPoolFromApi = (answersPool = []) => {
  if (!answersPool.length) return [emptyAnswer()]
  return answersPool.map((item) => ({
    question: item.question || '',
    answer: item.answer || ''
  }))
}

const AGView = () => {
  const { themeClass , themeHex, activeRole } = useContext(RoleContext)
  const [assessments, setAssessments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [isCreateMode, setIsCreateMode] = useState(false)
  const [creatingAssessment, setCreatingAssessment] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [updatingAssessment, setUpdatingAssessment] = useState(false)
  const [aiGoal, setAiGoal] = useState('')
  const [generatingWithAi, setGeneratingWithAi] = useState(false)
  const [createTab, setCreateTab] = useState('manual')
  const [generatedPreview, setGeneratedPreview] = useState(null)
  const [activeGenerationGoal, setActiveGenerationGoal] = useState('')
  const [grades, setGrades] = useState([])
  const [subjects, setSubjects] = useState([])
  const [activeGrade, setActiveGrade] = useState('')
  const [activeSubject, setActiveSubject] = useState('')
  const [chapters, setChapters] = useState([])
  const [lessons, setLessons] = useState([])

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
      mcq_batch: '',
      mcq_pool: [emptyMcq()],
      answers_pool: [emptyAnswer()]
    })
    resetAiState()
  }
  const [editForm, setEditForm] = useState({
    title: '',
    chapter_id: '',
    lesson_id: '',
    mcq_batch: '',
    published: false,
    mcq_pool: [],
    answers_pool: []
  })

  const [filters, setFilters] = useState({
    assessment_id: '',
    title: '',
    chapter_id: '',
    lesson_id: '',
    published: '',
    mcq_batch: ''
  })

  const [createForm, setCreateForm] = useState({
    title: '',
    chapter_id: '',
    lesson_id: '',
    mcq_batch: '',
    mcq_pool: [emptyMcq()],
    answers_pool: [emptyAnswer()]
  })

  useEffect(() => {
    fetchAssessments()
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

  const fetchAssessments = async (useFilters = false, silent = false) => {
    try {
      if (!silent) setLoading(true)
      let url = `${API_BASE}/assessments`

      if (useFilters) {
        const params = new URLSearchParams()

        if (filters.assessment_id) params.append('assessment_id', filters.assessment_id)
        if (filters.title) params.append('title', filters.title)
        if (filters.chapter_id) params.append('chapter_id', filters.chapter_id)
        if (filters.lesson_id) params.append('lesson_id', filters.lesson_id)
        if (filters.published !== '') params.append('published', filters.published === 'true')
        if (filters.mcq_batch) params.append('mcq_batch', filters.mcq_batch)

        if (params.toString()) {
          url = `${API_BASE}/assessment?${params.toString()}`
        }
      }

      const response = await fetch(url)
      if (!response.ok) {
        if (response.status === 404 && useFilters) {
          setAssessments([])
          setError(null)
          return
        }
        const err = await response.json().catch(() => ({}))
        throw new Error(
          parseApiError(err.detail, `Failed to fetch assessments: ${response.statusText}`)
        )
      }
      const data = await response.json()
      setAssessments(Array.isArray(data) ? data : [data].filter(Boolean))
      setError(null)
    } catch (err) {
      setError(err.message)
      setAssessments([])
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
    const { name, value } = e.target
    setCreateForm({
      ...createForm,
      [name]: value
    })
  }

  const handleCreateMcqChange = (index, field, value) => {
    const updated = [...createForm.mcq_pool]
    updated[index][field] = value
    setCreateForm({ ...createForm, mcq_pool: updated })
  }

  const handleCreateMcqOptionChange = (mcqIndex, optionIndex, value) => {
    const updated = [...createForm.mcq_pool]
    updated[mcqIndex].options[optionIndex] = value
    setCreateForm({ ...createForm, mcq_pool: updated })
  }

  const handleCreateAnswerChange = (index, field, value) => {
    const updated = [...createForm.answers_pool]
    updated[index][field] = value
    setCreateForm({ ...createForm, answers_pool: updated })
  }

  const addMcq = () => {
    setCreateForm({
      ...createForm,
      mcq_pool: [...createForm.mcq_pool, emptyMcq()]
    })
  }

  const removeMcq = (index) => {
    setCreateForm({
      ...createForm,
      mcq_pool: createForm.mcq_pool.filter((_, i) => i !== index)
    })
  }

  const addAnswer = () => {
    setCreateForm({
      ...createForm,
      answers_pool: [...createForm.answers_pool, emptyAnswer()]
    })
  }

  const removeAnswer = (index) => {
    setCreateForm({
      ...createForm,
      answers_pool: createForm.answers_pool.filter((_, i) => i !== index)
    })
  }

  const handleCreateAssessment = async (e) => {
    e.preventDefault()
    setCreatingAssessment(true)
    setError(null)

    const safeExtractId = (uid) => {
      const digits = String(uid).replace(/\D/g, '')
      return parseInt(digits.substring(0, 12), 10) || 1
    }

    const payload = {
      title: createForm.title,
      chapter_id: safeExtractId(createForm.chapter_id),
      lesson_id: safeExtractId(createForm.lesson_id),
      mcq_batch: parseInt(createForm.mcq_batch, 10) || 1,
      mcq_pool: buildMcqPoolPayload(createForm.mcq_pool),
      answers_pool: createForm.answers_pool
    }

    try {
      const response = await fetch(`${API_BASE}/create-assessment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(parseApiError(err.detail, 'Failed to create assessment'))
      }

      setCreateForm({
        title: '',
        chapter_id: '',
        lesson_id: '',
        mcq_batch: '',
        mcq_pool: [emptyMcq()],
        answers_pool: [emptyAnswer()]
      })
      resetAiState()
      setIsCreateMode(false)
      await fetchAssessments()
    } catch (err) {
      setError(err.message)
    } finally {
      setCreatingAssessment(false)
    }
  }

  const handleGenerateWithAi = async () => {
    if (!aiGoal.trim()) {
      setError('Please enter a goal for AI generation')
      return
    }

    if (!createForm.chapter_id || !createForm.lesson_id) {
      setError("Please select a Chapter and Lesson before generating.")
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
      const response = await fetch(`${API_BASE}/assessment/generate`, {
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
        throw new Error(parseApiError(err.detail, 'Failed to generate assessment with AI'))
      }

      const data = await response.json()
      setGeneratedPreview(data)
      await fetchAssessments(false, true)
    } catch (err) {
      setError(err.message)
      setActiveGenerationGoal('')
    } finally {
      setGeneratingWithAi(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchAssessments(true)
  }

  const handleReset = () => {
    setFilters({
      assessment_id: '',
      title: '',
      chapter_id: '',
      lesson_id: '',
      published: '',
      mcq_batch: ''
    })
    fetchAssessments(false)
  }

  const toggleExpand = (assessmentId) => {
    setExpandedId(expandedId === assessmentId ? null : assessmentId)
  }

  const handleDeleteAssessment = async (assessmentId) => {
    if (!window.confirm('Are you sure you want to delete this assessment? This action cannot be undone.')) {
      return
    }

    setDeletingId(assessmentId)
    setError(null)

    try {
      const response = await fetch(`${API_BASE}/delete-assessment/${assessmentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(
          parseApiError(err.detail, `Failed to delete assessment: ${response.statusText}`)
        )
      }

      await fetchAssessments()
    } catch (err) {
      setError(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  const normalizeMcqPool = (mcqPool = []) => mapMcqPoolFromApi(mcqPool)

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

  const handleEditAssessment = (assessment) => {
    setEditingId(assessment.assessment_id)
    setEditForm({
      title: assessment.title,
      chapter_id: assessment.chapter_id,
      lesson_id: assessment.lesson_id,
      mcq_batch: assessment.mcq_batch,
      published: assessment.published ?? false,
      mcq_pool: normalizeMcqPool(assessment.mcq_pool),
      answers_pool: assessment.answers_pool ? [...assessment.answers_pool] : []
    })
    setExpandedId(null)
  }

  const handleEditGeneratedAssessment = (assessment) => {
    if (editingId !== null || !assessment.assessment_id) return
    setGeneratedPreview(null)
    setAiGoal('')
    setActiveGenerationGoal('')
    setIsCreateMode(false)
    setCreateTab('manual')
    handleEditAssessment(assessment)
    window.setTimeout(() => {
      document.getElementById(`assessment-${assessment.assessment_id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 150)
  }

  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setEditForm({
      ...editForm,
      [name]:
        type === 'checkbox'
          ? checked
          : name === 'chapter_id' || name === 'lesson_id' || name === 'mcq_batch'
            ? parseInt(value, 10) || value
            : value
    })
  }

  const handleEditMcqChange = (index, field, value) => {
    const updated = [...editForm.mcq_pool]
    updated[index][field] = value
    setEditForm({ ...editForm, mcq_pool: updated })
  }

  const handleEditMcqOptionChange = (mcqIndex, optionIndex, value) => {
    const updated = [...editForm.mcq_pool]
    updated[mcqIndex].options[optionIndex] = value
    setEditForm({ ...editForm, mcq_pool: updated })
  }

  const handleEditAnswerChange = (index, field, value) => {
    const updated = [...editForm.answers_pool]
    updated[index][field] = value
    setEditForm({ ...editForm, answers_pool: updated })
  }

  const handleUpdateAssessment = async (assessmentId) => {
    setUpdatingAssessment(true)
    setError(null)

    const safeExtractId = (uid) => {
      const digits = String(uid).replace(/\D/g, '')
      return parseInt(digits.substring(0, 12), 10) || 1
    }

    const payload = {
      title: editForm.title,
      chapter_id: safeExtractId(editForm.chapter_id),
      lesson_id: safeExtractId(editForm.lesson_id),
      mcq_batch: parseInt(editForm.mcq_batch, 10) || 1,
      published: editForm.published,
      mcq_pool: buildMcqPoolPayload(editForm.mcq_pool),
      answers_pool: editForm.answers_pool
    }

    try {
      const response = await fetch(`${API_BASE}/update-assessment/${assessmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(
          parseApiError(err.detail, `Failed to update assessment: ${response.statusText}`)
        )
      }

      setEditingId(null)
      await fetchAssessments()
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdatingAssessment(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({
      title: '',
      chapter_id: '',
      lesson_id: '',
      mcq_batch: '',
      published: false,
      mcq_pool: [],
      answers_pool: []
    })
  }

  const getCorrectAnswer = (mcq, answersPool = []) => {
    if (mcq.correct_answer) return mcq.correct_answer
    const match = answersPool.find((a) => a.question === mcq.question)
    return match?.answer || null
  }

  const renderMcqEditor = (mcqPool, onMcqChange, onOptionChange, onRemove, allowRemove) =>
    mcqPool.map((mcq, index) => (
      <div
        key={index}
        style={{
          marginBottom: '20px',
          paddingBottom: '20px',
          borderBottom: index < mcqPool.length - 1 ? '1px solid #ddd' : 'none'
        }}
      >
        <p style={{ marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>MCQ {index + 1}</p>
        <div className="field" style={{ marginBottom: '15px' }}>
          <div className="control">
            <textarea
              className="textarea"
              placeholder="Enter question..."
              value={mcq.question}
              onChange={(e) => onMcqChange(index, 'question', e.target.value)}
              required
              style={{ borderColor: themeHex, borderWidth: '1px', minHeight: '80px' }}
            />
          </div>
        </div>
        {mcq.options.map((option, optIndex) => (
          <div className="field" key={optIndex} style={{ marginBottom: '10px' }}>
            <label className="label is-small" style={{ color: '#2c3e50' }}>
              Option {optIndex + 1}
            </label>
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder={`Option ${optIndex + 1}`}
                value={option}
                onChange={(e) => onOptionChange(index, optIndex, e.target.value)}
                style={{ borderColor: themeHex, borderWidth: '1px' }}
              />
            </div>
          </div>
        ))}
        <div className="field" style={{ marginBottom: '15px' }}>
          <label className="label is-small" style={{ color: '#2c3e50' }}>
            Correct Answer (optional)
          </label>
          <div className="control">
            <input
              className="input"
              type="text"
              placeholder="Enter correct answer..."
              value={mcq.correct_answer || ''}
              onChange={(e) => onMcqChange(index, 'correct_answer', e.target.value)}
              style={{ borderColor: themeHex, borderWidth: '1px' }}
            />
          </div>
        </div>
        {allowRemove && mcqPool.length > 1 && (
          <button
            type="button"
            className="button is-danger is-small"
            onClick={() => onRemove(index)}
            style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <i className="fas fa-trash"></i>
            Remove MCQ
          </button>
        )}
      </div>
    ))

  const renderAnswerEditor = (answersPool, onAnswerChange, onRemove, allowRemove) =>
    answersPool.map((item, index) => (
      <div
        key={index}
        style={{
          marginBottom: '20px',
          paddingBottom: '20px',
          borderBottom: index < answersPool.length - 1 ? '1px solid #ddd' : 'none'
        }}
      >
        <p style={{ marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>Answer {index + 1}</p>
        <div className="field" style={{ marginBottom: '15px' }}>
          <div className="control">
            <textarea
              className="textarea"
              placeholder="Enter question..."
              value={item.question}
              onChange={(e) => onAnswerChange(index, 'question', e.target.value)}
              required
              style={{ borderColor: themeHex, borderWidth: '1px', minHeight: '80px' }}
            />
          </div>
        </div>
        <div className="field" style={{ marginBottom: '15px' }}>
          <div className="control">
            <textarea
              className="textarea"
              placeholder="Enter answer..."
              value={item.answer}
              onChange={(e) => onAnswerChange(index, 'answer', e.target.value)}
              required
              style={{ borderColor: themeHex, borderWidth: '1px', minHeight: '80px' }}
            />
          </div>
        </div>
        {allowRemove && answersPool.length > 1 && (
          <button
            type="button"
            className="button is-danger is-small"
            onClick={() => onRemove(index)}
            style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <i className="fas fa-trash"></i>
            Remove Answer
          </button>
        )}
      </div>
    ))

  return (
    <div className="assessment-generation">
      <div className={`hero ${themeClass} is-medium`}>
        <div className="hero-body has-text-centered">
          <h1 className="title">Assessment Generation</h1>
        </div>
      </div>

      <section className="section">
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
            <span className="icon" style={{ color: themeHex, marginRight: '10px' }}>
              <i className={`fas fa-${isCreateMode ? 'plus-circle' : 'filter'}`}></i>
            </span>
            <h2 className="subtitle is-4" style={{ margin: 0, color: '#2c3e50' }}>
              {isCreateMode ? 'Create Assessment' : 'Search & Filter Assessments'}
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

          <form onSubmit={isCreateMode ? handleCreateAssessment : handleSearch}>
            {!isCreateMode ? (
              <div className="columns is-multiline">
                <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
                  <div className="field">
                    <label className="label" style={{ color: '#2c3e50', fontWeight: '600' }}>
                      <span className="icon is-small" style={{ marginRight: '5px' }}>
                        <i className="fas fa-hashtag"></i>
                      </span>
                      Assessment ID
                    </label>
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="number"
                        name="assessment_id"
                        placeholder="e.g., 1"
                        value={filters.assessment_id}
                        onChange={handleFilterChange}
                        style={{ borderColor: themeHex, borderWidth: '1px' }}
                      />
                      <span className="icon is-left" style={{ color: themeHex }}>
                        <i className="fas fa-clipboard-list"></i>
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
                        placeholder="e.g., World War 1 Assessment"
                        value={filters.title}
                        onChange={handleFilterChange}
                        style={{ borderColor: themeHex, borderWidth: '1px' }}
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
                        style={{ borderColor: themeHex, borderWidth: '1px' }}
                      />
                      <span className="icon is-left" style={{ color: themeHex }}>
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
                        style={{ borderColor: themeHex, borderWidth: '1px' }}
                      />
                      <span className="icon is-left" style={{ color: themeHex }}>
                        <i className="fas fa-chalkboard"></i>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
                  <div className="field">
                    <label className="label" style={{ color: '#2c3e50', fontWeight: '600' }}>
                      <span className="icon is-small" style={{ marginRight: '5px' }}>
                        <i className="fas fa-list-ol"></i>
                      </span>
                      MCQ Batch
                    </label>
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="number"
                        name="mcq_batch"
                        placeholder="e.g., 5"
                        value={filters.mcq_batch}
                        onChange={handleFilterChange}
                        style={{ borderColor: themeHex, borderWidth: '1px' }}
                      />
                      <span className="icon is-left" style={{ color: themeHex }}>
                        <i className="fas fa-tasks"></i>
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
                          style={{ borderColor: themeHex, borderWidth: '1px', color: '#2c3e50' }}
                        >
                          <option value="">All Status</option>
                          <option value="true">Published</option>
                          <option value="false">Draft</option>
                        </select>
                      </div>
                      <span className="icon is-left" style={{ color: themeHex }}>
                        <i className="fas fa-bars"></i>
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
                          transition: 'all 0.3s ease',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
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
                          justifyContent: 'center',
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
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '0.75rem 1.5rem'
                          }}
                        >
                          <i className="fas fa-plus"></i>
                          <span>Create Assessment</span>
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
                      <div className="box" style={{ backgroundColor: '#faf5ff', borderLeft: '3px solid #7c3aed', marginBottom: '20px' }}>
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
                                    style={{ borderColor: themeHex, borderWidth: '1px', color: '#2c3e50' }}
                                  >
                                    <option value="">Select a Chapter</option>
                                    {chapters.map(chapter => (
                                      <option key={chapter.id || chapter.uid} value={chapter.id || chapter.uid}>{chapter.chapter_name}</option>
                                    ))}
                                  </select>
                                </div>
                                <span className="icon is-left" style={{ color: themeHex }}>
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
                                    style={{ borderColor: themeHex, borderWidth: '1px', color: '#2c3e50' }}
                                  >
                                    <option value="">Select a Lesson</option>
                                    {lessons.map(lesson => (
                                      <option key={lesson.id || lesson.uid} value={lesson.id || lesson.uid}>{lesson.title || lesson.lesson_name}</option>
                                    ))}
                                  </select>
                                </div>
                                <span className="icon is-left" style={{ color: themeHex }}>
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
                              placeholder="Describe what you want to generate, e.g., Create 5 MCQs on World War 1..."
                              value={aiGoal}
                              onChange={(e) => setAiGoal(e.target.value)}
                              disabled={generatingWithAi}
                              style={{ borderColor: '#7c3aed', borderWidth: '1px', minHeight: '100px' }}
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          className={`button ${themeClass} is-medium`}
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
                            <i className="fas fa-spinner fa-spin"></i> Generating assessment content...
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
                            <strong>Assessment ID:</strong> {generatedPreview.assessment_id ?? '—'} ·{' '}
                            <strong>Chapter:</strong> {generatedPreview.chapter_id} ·{' '}
                            <strong>Lesson:</strong> {generatedPreview.lesson_id} ·{' '}
                            <strong>Batch:</strong> {generatedPreview.mcq_batch}
                          </p>
                          <h5 className="subtitle is-6" style={{ color: '#2c3e50', marginBottom: '10px' }}>MCQ Pool</h5>
                          {generatedPreview.mcq_pool?.map((mcq, index) => {
                            const correctAnswer = getCorrectAnswer(mcq, generatedPreview.answers_pool)
                            return (
                              <div key={index} style={{ marginBottom: '15px', padding: '12px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '6px' }}>
                                <p><strong>Q{index + 1}:</strong> {mcq.question}</p>
                                {mcq.options?.map((opt, i) => (
                                  <p key={i} style={{ marginLeft: '20px', color: '#555' }}>{String.fromCharCode(65 + i)}. {opt}</p>
                                ))}
                                {correctAnswer && <p style={{ marginTop: '8px', color: '#48c774' }}><strong>Answer:</strong> {correctAnswer}</p>}
                              </div>
                            )
                          })}
                          <h5 className="subtitle is-6" style={{ color: '#2c3e50', marginTop: '15px', marginBottom: '10px' }}>Answers Pool</h5>
                          {generatedPreview.answers_pool?.map((item, index) => (
                            <div key={index} style={{ marginBottom: '10px', padding: '12px', backgroundColor: '#f0fff4', borderRadius: '6px' }}>
                              <p><strong>Q:</strong> {item.question}</p>
                              <p><strong>A:</strong> {item.answer}</p>
                            </div>
                          ))}
                          <button
                            type="button"
                            className="button is-large"
                            onClick={() => handleEditGeneratedAssessment(generatedPreview)}
                            disabled={editingId !== null || !generatedPreview.assessment_id}
                            style={{ ...getEditButtonStyle(editingId !== null || !generatedPreview.assessment_id), marginTop: '15px' }}
                          >
                            <i className="fas fa-edit"></i>
                            <span>Edit</span>
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="column is-full">
                      <button type="button" className="button is-medium" onClick={resetCreateState} style={{ borderRadius: '6px', fontWeight: '600', backgroundColor: '#ffffff', border: '2px solid #3273dc', color: themeHex, display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1.5rem' }}>
                        <i className="fas fa-times"></i><span>Cancel</span>
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
                        placeholder="e.g., World War 1 Assessment"
                        value={createForm.title}
                        onChange={handleCreateFormChange}
                        required
                        style={{ borderColor: themeHex, borderWidth: '1px' }}
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
                          style={{ borderColor: themeHex, borderWidth: '1px', color: '#2c3e50' }}
                        >
                          <option value="">Select a Chapter</option>
                          {chapters.map(chapter => (
                            <option key={chapter.id || chapter.uid} value={chapter.id || chapter.uid}>{chapter.chapter_name}</option>
                          ))}
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
                          style={{ borderColor: themeHex, borderWidth: '1px', color: '#2c3e50' }}
                        >
                          <option value="">Select a Lesson</option>
                          {lessons.map(lesson => (
                            <option key={lesson.id || lesson.uid} value={lesson.id || lesson.uid}>{lesson.title || lesson.lesson_name}</option>
                          ))}
                        </select>
                      </div>
                      <span className="icon is-left" style={{ color: themeHex }}>
                        <i className="fas fa-chalkboard"></i>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
                  <div className="field">
                    <label className="label" style={{ color: '#2c3e50', fontWeight: '600' }}>MCQ Batch</label>
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="number"
                        name="mcq_batch"
                        placeholder="e.g., 5"
                        value={createForm.mcq_batch}
                        onChange={handleCreateFormChange}
                        required
                        style={{ borderColor: themeHex, borderWidth: '1px' }}
                      />
                      <span className="icon is-left" style={{ color: themeHex }}>
                        <i className="fas fa-tasks"></i>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="column is-full">
                  <div className="box" style={{ backgroundColor: '#f8fafc', borderLeft: '3px solid #3273dc', marginBottom: '20px' }}>
                    <h4 className="subtitle is-6" style={{ color: '#2c3e50', marginBottom: '15px' }}>
                      <i className="fas fa-list-ul"></i> MCQ Pool
                    </h4>
                    {renderMcqEditor(
                      createForm.mcq_pool,
                      handleCreateMcqChange,
                      handleCreateMcqOptionChange,
                      removeMcq,
                      true
                    )}
                    <button
                      className={`button ${themeClass} is-small`}
                      onClick={addMcq}
                      style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                      <i className="fas fa-plus"></i>
                      Add MCQ
                    </button>
                  </div>
                </div>

                <div className="column is-full">
                  <div className="box" style={{ backgroundColor: '#f8fafc', borderLeft: '3px solid #48c774', marginBottom: '20px' }}>
                    <h4 className="subtitle is-6" style={{ color: '#2c3e50', marginBottom: '15px' }}>
                      <i className="fas fa-check-double"></i> Answers Pool
                    </h4>
                    {renderAnswerEditor(
                      createForm.answers_pool,
                      handleCreateAnswerChange,
                      removeAnswer,
                      true
                    )}
                    <button
                      type="button"
                      className="button is-success is-small"
                      onClick={addAnswer}
                      style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                      <i className="fas fa-plus"></i>
                      Add Answer
                    </button>
                  </div>
                </div>

                <div className="column is-full">
                  <div className="field is-grouped">
                    <div className="control">
                      <button
                        className={`button ${themeClass} is-medium`}
                        type="submit"
                        disabled={creatingAssessment}
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
                        <span>{creatingAssessment ? 'Creating...' : 'Create Assessment'}</span>
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
            <p>Loading assessments...</p>
          </div>
        )}

        {error && (
          <div className="notification is-danger">
            <p><strong>Error:</strong> {error}</p>
          </div>
        )}

        {!loading && !error && assessments.length === 0 && (
          <div className="notification is-warning">
            <p>No assessments found.</p>
          </div>
        )}

        {!loading && assessments.length > 0 && (
          <div className="assessment-list">
            {assessments.map((assessment) => (
              <div
                key={assessment.assessment_id}
                id={`assessment-${assessment.assessment_id}`}
                className="box"
                style={{
                  transition: 'all 0.3s ease',
                  borderLeft: '4px solid #3273dc',
                  boxShadow: '0 2px 8px rgba(50, 115, 220, 0.08)'
                }}
              >
                <div
                  className="assessment-header"
                  onClick={() => toggleExpand(assessment.assessment_id)}
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: '15px',
                    borderBottom: expandedId === assessment.assessment_id ? '2px solid #3273dc' : 'none'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <span className="icon" style={{ color: themeHex, marginRight: '10px' }}>
                        <i className="fas fa-clipboard-list"></i>
                      </span>
                      <h2 className="subtitle is-4" style={{ margin: 0, color: '#2c3e50' }}>
                        {assessment.title}
                      </h2>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                      <span className="tag is-light" style={{ backgroundColor: '#eff4fb', color: '#2c3e50', fontWeight: '600', padding: '12px 18px', fontSize: '15px' }}>
                        Assessment {assessment.assessment_id}
                      </span>
                      <span className="tag is-light" style={{ backgroundColor: '#eff4fb', color: '#2c3e50', fontWeight: '600', padding: '12px 18px', fontSize: '15px' }}>
                        Chapter: {assessment.chapter_name || assessment.chapter_id}
                      </span>
                      <span className="tag is-light" style={{ backgroundColor: '#eff4fb', color: '#2c3e50', fontWeight: '600', padding: '12px 18px', fontSize: '15px' }}>
                        Lesson: {assessment.lesson_name || assessment.lesson_id}
                      </span>
                      <span className="tag is-light" style={{ backgroundColor: '#eff4fb', color: '#2c3e50', fontWeight: '600', padding: '12px 18px', fontSize: '15px' }}>
                        Batch {assessment.mcq_batch}
                      </span>
                      <span
                        className={`tag ${assessment.published ? 'is-success' : 'is-warning'}`}
                        style={{
                          fontWeight: '600',
                          padding: '12px 18px',
                          fontSize: '15px',
                          backgroundColor: assessment.published ? '#48c774' : '#ffdd57',
                          color: assessment.published ? '#ffffff' : '#363636'
                        }}
                      >
                        <i className={`fas fa-${assessment.published ? 'check-circle' : 'clock'}`}></i>
                        {assessment.published ? 'Published' : 'Draft'}
                      </span>
                      <div className="tags" style={{ display: 'flex', gap: '10px' }}>
                        <span className={`tag ${themeClass} is-light`} style={{ fontWeight: '600', padding: '12px 18px', fontSize: '15px' }}>
                          <i className="fas fa-graduation-cap" style={{ marginRight: '8px' }}></i> {assessment.mcq_pool?.length || 0} MCQs
                        </span>
                        <span className="tag is-success is-light" style={{ fontWeight: '600', padding: '12px 18px', fontSize: '15px' }}>
                          {assessment.answers_pool?.length || 0} Answers
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {activeRole === 'Teacher' && (
                      <>
                        <button
                          type="button"
                          className="button is-large"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditAssessment(assessment)
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
                            handleDeleteAssessment(assessment.assessment_id)
                          }}
                          disabled={deletingId === assessment.assessment_id}
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
                            opacity: deletingId === assessment.assessment_id ? 0.6 : 1
                          }}
                        >
                          <i className="fas fa-trash"></i>
                          <span>{deletingId === assessment.assessment_id ? 'Deleting...' : 'Delete'}</span>
                        </button>
                      </>
                    )}
                    <span
                      className="icon is-large"
                      style={{
                        color: themeHex,
                        transition: 'transform 0.3s ease',
                        transform: expandedId === assessment.assessment_id ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}
                    >
                      <i className="fas fa-chevron-down"></i>
                    </span>
                  </div>
                </div>

                {expandedId === assessment.assessment_id && editingId !== assessment.assessment_id && (
                  <div className="assessment-content" style={{ marginTop: '20px', paddingTop: '20px' }}>
                    <h3 className="subtitle is-5" style={{ color: '#2c3e50', marginBottom: '15px' }}>
                      <i className="fas fa-list-ul"></i> MCQ Pool
                    </h3>
                    {assessment.mcq_pool?.length > 0 ? (
                      assessment.mcq_pool.map((mcq, index) => {
                        const correctAnswer = getCorrectAnswer(mcq, assessment.answers_pool)
                        return (
                          <div key={index} style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8fafc' }}>
                            <p style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                              <span style={{ color: themeHex, fontWeight: 'bold', minWidth: '40px' }}>Q{index + 1}:</span>
                              <span style={{ color: '#2c3e50', lineHeight: '1.6' }}>{mcq.question}</span>
                            </p>
                            {mcq.options?.map((opt, optIndex) => (
                              <p key={optIndex} style={{ marginLeft: '50px', color: '#555', marginBottom: '4px' }}>
                                {String.fromCharCode(65 + optIndex)}. {opt}
                              </p>
                            ))}
                            {correctAnswer && (
                              <p style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '10px' }}>
                                <span style={{ color: '#48c774', fontWeight: 'bold', minWidth: '40px' }}>ANS:</span>
                                <span style={{ color: '#555', lineHeight: '1.6' }}>{correctAnswer}</span>
                              </p>
                            )}
                          </div>
                        )
                      })
                    ) : (
                      <p className="is-italic" style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
                        <i className="fas fa-inbox"></i> No MCQs available.
                      </p>
                    )}

                    <h3 className="subtitle is-5" style={{ color: '#2c3e50', marginTop: '25px', marginBottom: '15px' }}>
                      <i className="fas fa-check-double"></i> Answers Pool
                    </h3>
                    {assessment.answers_pool?.length > 0 ? (
                      assessment.answers_pool.map((item, index) => (
                        <div key={index} style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#f0fff4' }}>
                          <p style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
                            <span style={{ color: themeHex, fontWeight: 'bold', minWidth: '40px' }}>QUE:</span>
                            <span style={{ color: '#2c3e50', lineHeight: '1.6' }}>{item.question}</span>
                          </p>
                          <p style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                            <span style={{ color: '#48c774', fontWeight: 'bold', minWidth: '40px' }}>ANS:</span>
                            <span style={{ color: '#555', lineHeight: '1.6' }}>{item.answer}</span>
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="is-italic" style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
                        <i className="fas fa-inbox"></i> No answers available.
                      </p>
                    )}
                  </div>
                )}

                {editingId === assessment.assessment_id && (
                  <div className="assessment-edit-form" style={{ marginTop: '20px', paddingTop: '20px' }}>
                    <div className="box" style={{ backgroundColor: '#f8fafc', borderLeft: '3px solid #3273dc' }}>
                      <h4 className="subtitle is-6" style={{ color: '#2c3e50', marginBottom: '15px' }}>
                        <i className="fas fa-edit"></i> Edit Assessment
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
                                style={{ borderColor: themeHex, borderWidth: '1px' }}
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
                                style={{ borderColor: themeHex, borderWidth: '1px' }}
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
                                style={{ borderColor: themeHex, borderWidth: '1px' }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
                          <div className="field">
                            <label className="label" style={{ color: '#2c3e50', fontWeight: '600' }}>MCQ Batch</label>
                            <div className="control">
                              <input
                                className="input"
                                type="number"
                                name="mcq_batch"
                                value={editForm.mcq_batch}
                                onChange={handleEditFormChange}
                                required
                                style={{ borderColor: themeHex, borderWidth: '1px' }}
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
                          <h5 className="subtitle is-6" style={{ color: '#2c3e50', marginBottom: '15px' }}>
                            <i className="fas fa-list-ul"></i> MCQ Pool
                          </h5>
                          {renderMcqEditor(
                            editForm.mcq_pool,
                            handleEditMcqChange,
                            handleEditMcqOptionChange,
                            null,
                            false
                          )}
                        </div>

                        <div className="column is-full">
                          <h5 className="subtitle is-6" style={{ color: '#2c3e50', marginBottom: '15px' }}>
                            <i className="fas fa-check-double"></i> Answers Pool
                          </h5>
                          {renderAnswerEditor(
                            editForm.answers_pool,
                            handleEditAnswerChange,
                            null,
                            false
                          )}
                        </div>

                        <div className="column is-full">
                          <div className="field is-grouped">
                            <div className="control">
                              <button
                                className="button is-success is-medium"
                                type="button"
                                onClick={() => handleUpdateAssessment(assessment.assessment_id)}
                                disabled={updatingAssessment}
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
                                <span>{updatingAssessment ? 'Saving...' : 'Save Changes'}</span>
                              </button>
                            </div>
                            <div className="control">
                              <button
                                className="button is-medium"
                                type="button"
                                onClick={handleCancelEdit}
                                disabled={updatingAssessment}
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

export default AGView
