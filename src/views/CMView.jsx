import { useEffect, useState } from 'react'
import { useContext } from 'react'
import axios from '../api'
import { AuthContext } from '../context/AuthContext'
import ChapterItem from '../components/ChapterItem'

const CMView = () => {
  const { user } = useContext(AuthContext)
  const [chapters, setChapters] = useState([])
  const [grades, setGrades] = useState([])
  const [activeGrade, setActiveGrade] = useState(null)

  useEffect(() => {
    document.title = 'Content Management - Lessons | VerityLMS'
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
  }

  const handleGradeClick = (grade) => {
    setActiveGrade(grade)
    getChapters()
  }

  return (
    <div className="content-management">
      <div className="hero is-info is-medium">
        <div className="hero-body has-text-centered">
          <h1 className="title">Content Management</h1>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column is-3">
              <div 
                className="box" 
                style={{ 
                  background: 'linear-gradient(135deg, #f0f7ff 0%, #e8f4ff 100%)',
                  borderLeft: '5px solid #3273dc',
                  boxShadow: '0 2px 8px rgba(50, 115, 220, 0.1)',
                  position: 'sticky',
                  top: '20px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                  <span className="icon" style={{ color: '#3273dc', marginRight: '10px' }}>
                    <i className="fas fa-filter"></i>
                  </span>
                  <h3 className="subtitle is-5" style={{ margin: 0, color: '#2c3e50', fontWeight: '600' }}>
                    Filter by Grade
                  </h3>
                </div>
                <aside className="menu">
                  <ul className="menu-list">
                    <li>
                      <a
                        onClick={() => handleGradeClick(null)}
                        style={{
                          cursor: 'pointer',
                          color: !activeGrade ? '#3273dc' : '#2c3e50',
                          fontWeight: !activeGrade ? '600' : '500',
                          borderLeft: !activeGrade ? '3px solid #3273dc' : 'none',
                          paddingLeft: !activeGrade ? '12px' : '15px',
                          backgroundColor: !activeGrade ? '#eff4fb' : 'transparent',
                          transition: 'all 0.3s ease',
                          borderRadius: '4px'
                        }}
                      >
                        <i className="fas fa-list" style={{ marginRight: '8px' }}></i>
                        All Grades
                      </a>
                    </li>
                    {grades.map(grade => (
                      <li key={grade.id}>
                        <a 
                          onClick={() => handleGradeClick(grade)}
                          style={{
                            cursor: 'pointer',
                            color: activeGrade?.id === grade.id ? '#3273dc' : '#2c3e50',
                            fontWeight: activeGrade?.id === grade.id ? '600' : '500',
                            borderLeft: activeGrade?.id === grade.id ? '3px solid #3273dc' : 'none',
                            paddingLeft: activeGrade?.id === grade.id ? '12px' : '15px',
                            backgroundColor: activeGrade?.id === grade.id ? '#eff4fb' : 'transparent',
                            transition: 'all 0.3s ease',
                            borderRadius: '4px'
                          }}
                        >
                          <i className="fas fa-graduation-cap" style={{ marginRight: '8px' }}></i>
                          Grade {grade.grade}
                        </a>
                      </li>
                    ))}
                  </ul>
                </aside>
              </div>
            </div>

            <div className="column is-9">
              {user.isAuthenticated ? (
                <>
                  {chapters.length > 0 ? (
                    <div className="columns is-multiline">
                      {chapters.map(chapter => (
                        <div key={chapter.id} className="column is-6-tablet is-4-widescreen">
                          <ChapterItem chapter={chapter} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div 
                      className="box" 
                      style={{ 
                        background: 'linear-gradient(135deg, #fff9e6 0%, #fff3d5 100%)',
                        borderLeft: '5px solid #ffdd57',
                        boxShadow: '0 2px 8px rgba(255, 221, 87, 0.1)',
                        textAlign: 'center',
                        padding: '40px 20px'
                      }}
                    >
                      <div style={{ marginBottom: '15px' }}>
                        <i className="fas fa-inbox" style={{ fontSize: '48px', color: '#ffdd57', marginBottom: '15px' }}></i>
                      </div>
                      <h3 className="subtitle is-5" style={{ color: '#2c3e50', fontWeight: '600', marginBottom: '10px' }}>
                        No Chapters Found
                      </h3>
                      <p style={{ color: '#666', fontSize: '14px' }}>
                        {activeGrade ? `No chapters available for Grade ${activeGrade.grade}` : 'Select a grade to view chapters'}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div 
                  className="box" 
                  style={{ 
                    background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
                    borderLeft: '5px solid #f05149',
                    boxShadow: '0 2px 8px rgba(240, 81, 73, 0.1)',
                    textAlign: 'center',
                    padding: '40px 20px'
                  }}
                >
                  <div style={{ marginBottom: '15px' }}>
                    <i className="fas fa-lock" style={{ fontSize: '48px', color: '#f05149', marginBottom: '15px' }}></i>
                  </div>
                  <h2 className="subtitle is-5" style={{ color: '#2c3e50', fontWeight: '600', marginBottom: '10px' }}>
                    Restricted Access
                  </h2>
                  <p style={{ color: '#666' }}>You need to be authenticated to view content.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CMView
