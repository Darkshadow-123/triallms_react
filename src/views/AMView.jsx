import { useEffect, useState, useContext } from 'react'
import axios from '../api'
import AssessmentChapterItem from '../components/AssessmentChapterItem'
import { RoleContext } from '../context/RoleContext'

const AMView = () => {
  const { themeClass, themeHex, themeLightHex, themeGradient, activeRole } = useContext(RoleContext)
  const [chapters, setChapters] = useState([])
  const [grades, setGrades] = useState([])
  const [activeGrade, setActiveGrade] = useState(null)
  const [subjects, setSubjects] = useState([])
  const [activeSubject, setActiveSubject] = useState(null)

  useEffect(() => {
    document.title = 'Assessment Management | VerityLMS'
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
    getChapters()
  }, [activeGrade, activeSubject])

  const getChapters = () => {
    let url = 'content_management/'
    const queryParams = []
    if (activeGrade) queryParams.push(`grade_id=${activeGrade.id}`)
    if (activeSubject) queryParams.push(`subject_id=${activeSubject.id}`)
    if (queryParams.length > 0) url += '?' + queryParams.join('&')

    axios
      .get(url)
      .then(response => {
        setChapters(response.data)
      })
      .catch(error => {
        console.error('Error fetching chapters:', error)
        setChapters([])
      })
  }

  const handleGradeClick = (grade) => {
    setActiveGrade(grade)
  }

  const handleSubjectClick = (subject) => {
    setActiveSubject(subject)
  }

  if (activeRole !== 'Student') {
    return (
      <div className="assessment-management">
        <div className={`hero ${themeClass} is-medium`}>
          <div className="hero-body has-text-centered">
            <h1 className="title">
              <i className="fas fa-lock" style={{ marginRight: '12px' }}></i>
              Access Restricted
            </h1>
            <p className="subtitle mt-3" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              The Assessment Management component can only be viewed by Students.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="assessment-management">
      <div className={`hero ${themeClass} is-medium`}>
        <div className="hero-body has-text-centered">
          <h1 className="title">
            <i className="fas fa-chart-bar" style={{ marginRight: '12px' }}></i>
            Assessment Management
          </h1>
        </div>
      </div>
      <div className="content-management">
        <section className="section" style={{ padding: '40px 20px' }}>
          <div className="container">
            <div className="columns">
              {/* Sidebar */}
              <div className="column is-3">
                <div className="desktop-sticky" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div
                    style={{
                      background: themeGradient,
                      borderLeft: `5px solid ${themeHex}`,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                      borderRadius: '6px',
                      padding: '24px'
                    }}
                  >
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2c3e50', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <i className="fas fa-filter" style={{ color: themeHex }}></i>
                      Filter by Grade
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <button
                        onClick={() => handleGradeClick(null)}
                        style={{
                          padding: '12px 16px',
                          background: !activeGrade ? themeHex : 'transparent',
                          color: !activeGrade ? 'white' : '#2c3e50',
                          border: !activeGrade ? 'none' : `2px solid ${themeHex}`,
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: !activeGrade ? '600' : '500',
                          fontSize: '14px',
                          transition: '0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                        onMouseEnter={(e) => {
                          if (activeGrade) {
                            e.target.style.background = themeLightHex
                            e.target.style.color = themeHex
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (activeGrade) {
                            e.target.style.background = 'transparent'
                            e.target.style.color = '#2c3e50'
                          }
                        }}
                      >
                        <i className="fas fa-list"></i>
                        All Grades
                      </button>
                      {grades.map(grade => (
                        <button
                          key={grade.id}
                          onClick={() => handleGradeClick(grade)}
                          style={{
                            padding: '12px 16px',
                            background: activeGrade?.id === grade.id ? themeHex : 'transparent',
                            color: activeGrade?.id === grade.id ? 'white' : '#2c3e50',
                            border: activeGrade?.id === grade.id ? 'none' : `2px solid ${themeHex}`,
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: activeGrade?.id === grade.id ? '600' : '500',
                            fontSize: '14px',
                            transition: '0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                          onMouseEnter={(e) => {
                            if (activeGrade?.id !== grade.id) {
                              e.target.style.background = themeLightHex
                              e.target.style.color = themeHex
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (activeGrade?.id !== grade.id) {
                              e.target.style.background = 'transparent'
                              e.target.style.color = '#2c3e50'
                            }
                          }}
                        >
                          <i className="fas fa-graduation-cap"></i>
                          Grade {grade.grade}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div
                    style={{
                      background: themeGradient,
                      borderLeft: `5px solid ${themeHex}`,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                      borderRadius: '6px',
                      padding: '24px'
                    }}
                  >
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2c3e50', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fas fa-book" style={{ color: themeHex }}></i>
                    Filter by Subject
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                      onClick={() => handleSubjectClick(null)}
                      style={{
                        padding: '12px 16px',
                        background: !activeSubject ? themeHex : 'transparent',
                        color: !activeSubject ? 'white' : '#2c3e50',
                        border: !activeSubject ? 'none' : `2px solid ${themeHex}`,
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: !activeSubject ? '600' : '500',
                        fontSize: '14px',
                        transition: '0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                      onMouseEnter={(e) => {
                        if (activeSubject) {
                          e.target.style.background = themeLightHex
                          e.target.style.color = themeHex
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (activeSubject) {
                          e.target.style.background = 'transparent'
                          e.target.style.color = '#2c3e50'
                        }
                      }}
                    >
                      <i className="fas fa-list"></i>
                      All Subjects
                    </button>
                    {subjects.map(subject => (
                      <button
                        key={subject.id}
                        onClick={() => handleSubjectClick(subject)}
                        style={{
                          padding: '12px 16px',
                          background: activeSubject?.id === subject.id ? themeHex : 'transparent',
                          color: activeSubject?.id === subject.id ? 'white' : '#2c3e50',
                          border: activeSubject?.id === subject.id ? 'none' : `2px solid ${themeHex}`,
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: activeSubject?.id === subject.id ? '600' : '500',
                          fontSize: '14px',
                          transition: '0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                        onMouseEnter={(e) => {
                          if (activeSubject?.id !== subject.id) {
                            e.target.style.background = themeLightHex
                            e.target.style.color = themeHex
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (activeSubject?.id !== subject.id) {
                            e.target.style.background = 'transparent'
                            e.target.style.color = '#2c3e50'
                          }
                        }}
                      >
                        <i className="fas fa-book-open"></i>
                        {subject.subject_name}
                      </button>
                    ))}
                  </div>
                </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="column is-9">
                    <div className="columns is-multiline">
                      {chapters.length > 0 ? (
                        chapters.map(chapter => (
                          <div key={chapter.id} className="column is-4">
                            <AssessmentChapterItem chapter={chapter} />
                          </div>
                        ))
                      ) : (
                        <div className="column is-12">
                          <div
                            style={{
                              background: 'linear-gradient(135deg, #fff5f7 0%, #ffe8ec 100%)',
                              borderLeft: '5px solid #f05149',
                              boxShadow: '0 2px 8px rgba(240, 81, 73, 0.1)',
                              borderRadius: '6px',
                              padding: '40px',
                              textAlign: 'center'
                            }}
                          >
                            <i className="fas fa-inbox" style={{ fontSize: '48px', color: '#f05149', marginBottom: '16px', display: 'block' }}></i>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#2c3e50', marginBottom: '8px' }}>No Assessments Found</h3>
                            <p style={{ fontSize: '14px', color: '#666' }}>Select a grade to view available assessments</p>
                          </div>
                        </div>
                      )}
                    </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AMView
