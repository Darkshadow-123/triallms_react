import { useEffect, useState } from 'react'
import { useContext } from 'react'
import axios from '../api'
import { AuthContext } from '../context/AuthContext'
import AssessmentChapterItem from '../components/AssessmentChapterItem'
const AMView = () => {
  const { user } = useContext(AuthContext)
  const [chapters, setChapters] = useState([])
  const [grades, setGrades] = useState([])
  const [activeGrade, setActiveGrade] = useState(null)

  useEffect(() => {
    document.title = 'Assessment Management | VerityLMS'
    axios
      .get('content_management/get_grades/')
      .then(response => {
        console.log(response.data)
        setGrades(response.data)
      })
      .catch(error => {
        console.error('Error fetching grades:', error)
      })

    getChapters()
  }, [])

  const getChapters = () => {
    // Fetch chapters for assessment management (same endpoint as CMView)
    let url = 'content_management/'

    if (activeGrade) {
      url += `?grade_id=${activeGrade.id}`
    }

    axios
      .get(url)
      .then(response => {
        console.log(response.data)
        setChapters(response.data)
      })
      .catch(error => {
        console.error('Error fetching chapters:', error)
        setChapters([])
      })
  }

  const handleGradeClick = (grade) => {
    setActiveGrade(grade)
    getChapters()
  }
  return (
    <div className="assessment-management">
      <div className="hero is-primary is-medium">
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
                <div
                  style={{
                    background: 'linear-gradient(135deg, #f0f7ff 0%, #e8f4ff 100%)',
                    borderLeft: '5px solid #3273dc',
                    boxShadow: '0 2px 8px rgba(50, 115, 220, 0.1)',
                    borderRadius: '6px',
                    padding: '24px',
                    position: 'sticky',
                    top: '20px'
                  }}
                >
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2c3e50', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fas fa-filter" style={{ color: '#3273dc' }}></i>
                    Filter by Grade
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                      onClick={() => handleGradeClick(null)}
                      style={{
                        padding: '12px 16px',
                        background: !activeGrade ? '#3273dc' : 'transparent',
                        color: !activeGrade ? 'white' : '#2c3e50',
                        border: !activeGrade ? 'none' : '2px solid #3273dc',
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
                          e.target.style.background = '#f0f7ff'
                          e.target.style.color = '#3273dc'
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
                          background: activeGrade?.id === grade.id ? '#3273dc' : 'transparent',
                          color: activeGrade?.id === grade.id ? 'white' : '#2c3e50',
                          border: activeGrade?.id === grade.id ? 'none' : '2px solid #3273dc',
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
                            e.target.style.background = '#f0f7ff'
                            e.target.style.color = '#3273dc'
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
              </div>

              {/* Main Content */}
              <div className="column is-9">
                {user.isAuthenticated ? (
                  <>
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
                  </>
                ) : (
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
                    <i className="fas fa-lock" style={{ fontSize: '48px', color: '#f05149', marginBottom: '16px', display: 'block' }}></i>
                    <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#2c3e50', marginBottom: '8px' }}>Restricted Access</h2>
                    <p style={{ fontSize: '14px', color: '#666' }}>You need to have access or log in to view assessments</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AMView
