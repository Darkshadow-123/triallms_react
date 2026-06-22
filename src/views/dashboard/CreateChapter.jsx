import { useEffect, useState, useContext } from 'react'
import axios from '../../api'
import { RoleContext } from '../../context/RoleContext'

const CreateChapter = () => {
  const { themeClass, themeHex, themeGradient, themeLightHex, activeRole } = useContext(RoleContext)
  const [form, setForm] = useState({
    chapter_name: '',
    short_description: '',
    grades: [],
    subject: '',
    status: '',
    lessons: []
  })
  const [grades, setGrades] = useState([])
  const [subjects, setSubjects] = useState([])

  useEffect(() => {
    getGrades()
  }, [])

  const getGrades = () => {
    console.log('getGrades')
    axios
      .get('content_management/get_grades/')
      .then(response => {
        console.log(response.data)
        setGrades(response.data)
      })
  }

  const getSubjects = (gradeId) => {
    console.log('getSubjects')

    if (gradeId) {
      axios
        .get(`content_management/get_subjects/?grade=${gradeId}`)
        .then(response => {
          console.log(response.data)
          setSubjects(response.data)
        })
        .catch(error => {
          console.error(error)
        })
    } else {
      setSubjects([])
    }
  }

  const handleSubmit = (status) => {
    console.log('submitForm')
    console.log(form)

    const formData = { ...form, status }

    axios
      .post('content_management/create_chapter/', formData)
      .then(response => {
        console.log(response.data)
      })
      .catch(error => {
        console.log('error:', error)
      })
  }

  const addLesson = () => {
    console.log('addlesson')
    setForm({
      ...form,
      lessons: [
        ...form.lessons,
        { title: '', short_description: '', long_description: '' }
      ]
    })
  }

  if (activeRole === 'Student') {
    return (
      <div className="content-management">
        <div className={`hero is-danger is-medium`}>
          <div className="hero-body has-text-centered">
            <h1 className="title">
              <i className="fas fa-lock" style={{ marginRight: '10px' }}></i>
              Access Denied
            </h1>
            <h2 className="subtitle" style={{ marginTop: '15px' }}>
              Student accounts do not have permission to create content.
            </h2>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="content-management">
      {/* Hero Section */}
      <div className={`hero ${themeClass} is-medium`}>
        <div className="hero-body has-text-centered">
          <h1 className="title">Create Chapter</h1>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Grades Selection */}
          <div 
            className="box" 
            style={{ 
              marginBottom: '30px',
              background: themeGradient,
              borderLeft: `5px solid ${themeHex}`,
              boxShadow: '0 2px 8px rgba(50, 115, 220, 0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <span className="icon" style={{ color: themeHex, marginRight: '10px' }}>
                <i className="fas fa-graduation-cap"></i>
              </span>
              <h2 className="subtitle is-4" style={{ margin: 0, color: '#2c3e50', fontWeight: '600' }}>
                Select Grades
              </h2>
            </div>
            <div className="field">
              <label className="label" style={{ color: '#2c3e50', fontWeight: '600' }}>
                <span className="icon is-small" style={{ marginRight: '5px' }}>
                  <i className="fas fa-layer-group"></i>
                </span>
                Grades
              </label>
              <div className="control">
                <div className="select is-multiple is-fullwidth" style={{ borderColor: themeHex, borderWidth: '1px' }}>
                  <select
                    size="6"
                    multiple
                    value={form.grades}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, option => option.value)
                      setForm(prev => ({ ...prev, grades: selected }))
                      if (selected.length > 0) {
                        getSubjects(selected[0])
                      } else {
                        setSubjects([])
                      }
                    }}
                  >
                    {grades.map(grade => (
                      <option key={grade.id} value={grade.id}>
                        Grade {grade.grade}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Chapter Information */}
          {form.grades.length > 0 && (
            <div 
              className="box" 
              style={{ 
                marginBottom: '30px',
                background: themeGradient,
                borderLeft: `5px solid ${themeHex}`,
                boxShadow: '0 2px 8px rgba(50, 115, 220, 0.1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <span className="icon" style={{ color: themeHex, marginRight: '10px' }}>
                  <i className="fas fa-book"></i>
                </span>
                <h2 className="subtitle is-4" style={{ margin: 0, color: '#2c3e50', fontWeight: '600' }}>
                  Chapter Information
                </h2>
              </div>

              <div className="columns is-multiline">
                <div className="column is-full-mobile is-half-tablet">
                  <div className="field">
                    <label className="label" style={{ color: '#2c3e50', fontWeight: '600' }}>
                      <span className="icon is-small" style={{ marginRight: '5px' }}>
                        <i className="fas fa-tag"></i>
                      </span>
                      Subject
                    </label>
                    <div className="control has-icons-left">
                      <div className="select is-fullwidth">
                        <select
                          value={form.subject}
                          onChange={(e) => setForm({ ...form, subject: e.target.value })}
                          style={{ borderColor: themeHex, borderWidth: '1px' }}
                        >
                          <option disabled value="">Select Subject</option>
                          {subjects.map(subject => (
                            <option key={subject.id} value={subject.id}>
                              {subject.subject_name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <span className="icon is-left" style={{ color: themeHex }}>
                        <i className="fas fa-tag"></i>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="column is-full-mobile is-half-tablet">
                  <div className="field">
                    <label className="label" style={{ color: '#2c3e50', fontWeight: '600' }}>
                      <span className="icon is-small" style={{ marginRight: '5px' }}>
                        <i className="fas fa-heading"></i>
                      </span>
                      Chapter Name
                    </label>
                    <div className="control has-icons-left">
                      <input
                        type="text"
                        className="input"
                        value={form.chapter_name}
                        onChange={(e) => setForm({ ...form, chapter_name: e.target.value })}
                        placeholder="e.g., Introduction to Physics"
                        style={{ borderColor: themeHex, borderWidth: '1px' }}
                      />
                      <span className="icon is-left" style={{ color: themeHex }}>
                        <i className="fas fa-book-open"></i>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="column is-full">
                  <div className="field">
                    <label className="label" style={{ color: '#2c3e50', fontWeight: '600' }}>
                      <span className="icon is-small" style={{ marginRight: '5px' }}>
                        <i className="fas fa-align-left"></i>
                      </span>
                      Short Description
                    </label>
                    <div className="control">
                      <textarea
                        className="textarea"
                        value={form.short_description}
                        onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                        placeholder="Brief description of this chapter..."
                        style={{ borderColor: themeHex, borderWidth: '1px', minHeight: '100px' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lessons */}
          {form.grades.length > 0 && (
            <div 
              className="box" 
              style={{ 
                marginBottom: '30px',
                background: themeGradient,
                borderLeft: `5px solid ${themeHex}`,
                boxShadow: '0 2px 8px rgba(50, 115, 220, 0.1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <span className="icon" style={{ color: themeHex, marginRight: '10px' }}>
                  <i className="fas fa-list-ul"></i>
                </span>
                <h2 className="subtitle is-4" style={{ margin: 0, color: '#2c3e50', fontWeight: '600' }}>
                  Lessons
                </h2>
              </div>

              {form.lessons.length > 0 && (
                <div style={{ marginBottom: '30px' }}>
                  {form.lessons.map((lesson, index) => (
                    <div 
                      key={index} 
                      style={{ 
                        marginBottom: '30px', 
                        paddingBottom: '30px', 
                        borderBottom: index < form.lessons.length - 1 ? '2px solid #d0dfe8' : 'none'
                      }}
                    >
                      <h3 className="subtitle is-5" style={{ color: '#2c3e50', fontWeight: '600', marginBottom: '15px' }}>
                        <i className="fas fa-graduation-cap" style={{ marginRight: '10px', color: themeHex }}></i>
                        Lesson {index + 1}
                      </h3>

                      <div className="columns is-multiline">
                        <div className="column is-full">
                          <div className="field">
                            <label className="label" style={{ color: '#2c3e50', fontWeight: '600' }}>
                              Title
                            </label>
                            <div className="control has-icons-left">
                              <input
                                type="text"
                                className="input"
                                value={lesson.title}
                                onChange={(e) => {
                                  const newLessons = [...form.lessons]
                                  newLessons[index].title = e.target.value
                                  setForm({ ...form, lessons: newLessons })
                                }}
                                placeholder="e.g., Newton's Laws"
                                style={{ borderColor: themeHex, borderWidth: '1px' }}
                              />
                              <span className="icon is-left" style={{ color: themeHex }}>
                                <i className="fas fa-heading"></i>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="column is-full">
                          <div className="field">
                            <label className="label" style={{ color: '#2c3e50', fontWeight: '600' }}>
                              Short Description
                            </label>
                            <div className="control">
                              <textarea
                                className="textarea"
                                value={lesson.short_description}
                                onChange={(e) => {
                                  const newLessons = [...form.lessons]
                                  newLessons[index].short_description = e.target.value
                                  setForm({ ...form, lessons: newLessons })
                                }}
                                placeholder="Brief summary..."
                                style={{ borderColor: themeHex, borderWidth: '1px', minHeight: '80px' }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="column is-full">
                          <div className="field">
                            <label className="label" style={{ color: '#2c3e50', fontWeight: '600' }}>
                              Long Description
                            </label>
                            <div className="control">
                              <textarea
                                className="textarea"
                                value={lesson.long_description}
                                onChange={(e) => {
                                  const newLessons = [...form.lessons]
                                  newLessons[index].long_description = e.target.value
                                  setForm({ ...form, lessons: newLessons })
                                }}
                                placeholder="Detailed lesson content..."
                                style={{ borderColor: themeHex, borderWidth: '1px', minHeight: '120px' }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button 
                className={`button ${themeClass} is-medium`}
                onClick={addLesson}
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
                <i className="fas fa-plus"></i>
                <span>Add Lesson</span>
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="field is-grouped" style={{ marginTop: '30px' }}>
            <div className="control">
              <button 
                className={`button ${themeClass} is-medium`}
                onClick={() => handleSubmit('draft')}
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
                <i className="fas fa-save"></i>
                <span>Save as Draft</span>
              </button>
            </div>
            <div className="control">
              <button 
                className={`button ${themeClass} is-medium`}
                onClick={() => handleSubmit('review')}
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
                <i className="fas fa-paper-plane"></i>
                <span>Submit for Review</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CreateChapter
