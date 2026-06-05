import { useState, useEffect } from 'react'

const HWView = () => {
  const [homeworks, setHomeworks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  
  // Filter states
  const [filters, setFilters] = useState({
    homework_id: '',
    title: '',
    chapter_id: '',
    lesson_id: '',
    published: ''
  })

  useEffect(() => {
    fetchHomeworks()
  }, [])

  const fetchHomeworks = async (useFilters = false) => {
    try {
      setLoading(true)
      let url = 'http://localhost:8001/homeworks'
      
      // If filters are being applied, use the /homework endpoint with query parameters
      if (useFilters) {
        const params = new URLSearchParams()
        
        if (filters.homework_id) params.append('homework_id', filters.homework_id)
        if (filters.title) params.append('title', filters.title)
        if (filters.chapter_id) params.append('chapter_id', filters.chapter_id)
        if (filters.lesson_id) params.append('lesson_id', filters.lesson_id)
        if (filters.published !== '') params.append('published', filters.published === 'true')
        
        if (params.toString()) {
          url = `http://localhost:8001/homework?${params.toString()}`
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
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters({
      ...filters,
      [name]: value
    })
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
              <i className="fas fa-filter"></i>
            </span>
            <h2 className="subtitle is-4" style={{ margin: 0, color: '#2c3e50' }}>
              Search & Filter Homeworks
            </h2>
          </div>

          <form onSubmit={handleSearch}>
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
                </div>
              </div>
            </div>
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
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      <span className="tag is-light" style={{ backgroundColor: '#eff4fb', color: '#2c3e50', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <i className="fas fa-layer-group"></i>
                        Homework {homework.homework_id}
                      </span>
                      <span className="tag is-light" style={{ backgroundColor: '#eff4fb', color: '#2c3e50', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <i className="fas fa-layer-group"></i>
                        Chapter {homework.chapter_id}
                      </span>
                      <span className="tag is-light" style={{ backgroundColor: '#eff4fb', color: '#2c3e50', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <i className="fas fa-chalkboard"></i>
                        Lesson {homework.lesson_id}
                      </span>
                      <span 
                        className={`tag ${homework.published ? 'is-success' : 'is-warning'}`}
                        style={{ 
                          fontWeight: '500',
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '5px',
                          backgroundColor: homework.published ? '#48c774' : '#ffdd57',
                          color: homework.published ? '#ffffff' : '#363636'
                        }}
                      >
                        <i className={`fas fa-${homework.published ? 'check-circle' : 'clock'}`}></i>
                        {homework.published ? 'Published' : 'Draft'}
                      </span>
                      <span className="tag is-info is-light" style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <i className="fas fa-question-circle"></i>
                        {homework.homework_questions?.length || 0} Questions
                      </span>
                    </div>
                  </div>
                  <span className="icon is-large" style={{ color: '#3273dc', transition: 'transform 0.3s ease', transform: expandedId === homework.homework_id ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    <i className="fas fa-chevron-down"></i>
                  </span>
                </div>

                {expandedId === homework.homework_id && (
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
                                <i className="fas fa-question-circle">QUE:</i>
                              </span>
                              <span className="is-size-6" style={{ color: '#2c3e50', lineHeight: '1.6' }}>
                               {q.question}
                              </span>
                            </p>
                            {q.answer && (
                              <p style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginLeft: '0px' }}>
                                <span style={{ color: '#48c774', fontWeight: 'bold', minWidth: '30px', marginTop: '2px' }}>
                                  <i className="fas fa-lightbulb">ANS:</i>
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
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default HWView
