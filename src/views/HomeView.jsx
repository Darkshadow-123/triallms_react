import { useEffect, useState, useContext } from 'react'
import axios from '../api'
import ChapterItem from '../components/ChapterItem'
import { RoleContext } from '../context/RoleContext'
import { Link } from 'react-router-dom'

const HomeView = () => {
  const { themeClass, activeRole, themeHex, themeGradient, themeLightHex } = useContext(RoleContext)
  const [chapters, setChapters] = useState([])

  useEffect(() => {
    document.title = 'Home | VerityLMS'
    axios
      .get('content_management/get_latest_chapters/')
      .then(response => {
        console.log(response.data)
        setChapters(response.data)
      })
  }, [])

  return (
    <div className="home">
      <style>
        {`
          .dashboard-card {
            height: 100%;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border-radius: 8px;
          }
          .dashboard-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 24px rgba(0,0,0,0.1) !important;
          }
        `}
      </style>
      <div className={`hero ${themeClass} is-medium`}>
        <div className="hero-body has-text-centered">
          <h1 className="title">Welcome to VerityLMS</h1>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="columns is-multiline">
            <div className="column is-4">
              <Link to="/content-Management">
                <div 
                  className="box has-text-centered is-clickable dashboard-card"
                  style={{ background: themeGradient, borderTop: `5px solid ${themeHex}` }}
                >
                  <span className="icon is-large" style={{ color: themeHex, marginBottom: '15px' }}>
                    <i className="fas fa-3x fa-book-open"></i>
                  </span>
                  <h2 className="is-size-4 mt-2 mb-3" style={{ color: '#2c3e50', fontWeight: '600' }}>View Chapters</h2>
                  <p style={{ color: '#4a4a4a' }}>Access and read learning materials</p>
                </div>
              </Link>
            </div>

            <div className="column is-4">
              <Link to="/notes-Management">
                <div 
                  className="box has-text-centered is-clickable dashboard-card"
                  style={{ background: themeGradient, borderTop: `5px solid ${themeHex}` }}
                >
                  <span className="icon is-large" style={{ color: themeHex, marginBottom: '15px' }}>
                    <i className="fas fa-3x fa-sticky-note"></i>
                  </span>
                  <h2 className="is-size-4 mt-2 mb-3" style={{ color: '#2c3e50', fontWeight: '600' }}>Notes</h2>
                  <p style={{ color: '#4a4a4a' }}>View and manage saved notes</p>
                </div>
              </Link>
            </div>

            {activeRole === 'Teacher' && (
              <div className="column is-4">
                <Link to="/dashboard/create-chapter">
                  <div 
                    className="box has-text-centered is-clickable dashboard-card"
                    style={{ background: themeGradient, borderTop: `5px solid ${themeHex}` }}
                  >
                    <span className="icon is-large" style={{ color: themeHex, marginBottom: '15px' }}>
                      <i className="fas fa-3x fa-plus-circle"></i>
                    </span>
                    <h2 className="is-size-4 mt-2 mb-3" style={{ color: '#2c3e50', fontWeight: '600' }}>Create Chapters</h2>
                    <p style={{ color: '#4a4a4a' }}>Build and publish new lessons</p>
                  </div>
                </Link>
              </div>
            )}

            <div className="column is-4">
              <Link to="/homework-Management">
                <div 
                  className="box has-text-centered is-clickable dashboard-card"
                  style={{ background: themeGradient, borderTop: `5px solid ${themeHex}` }}
                >
                  <span className="icon is-large" style={{ color: themeHex, marginBottom: '15px' }}>
                    <i className={`fas fa-3x ${activeRole === 'Teacher' ? 'fa-chalkboard-teacher' : 'fa-edit'}`}></i>
                  </span>
                  <h2 className="is-size-4 mt-2 mb-3" style={{ color: '#2c3e50', fontWeight: '600' }}>Homework</h2>
                  <p style={{ color: '#4a4a4a' }}>{activeRole === 'Teacher' ? 'Assign and review homework tasks' : 'View and submit your homework'}</p>
                </div>
              </Link>
            </div>

            {activeRole === 'Teacher' && (
              <div className="column is-4">
                <Link to="/assessment-Generation">
                  <div 
                    className="box has-text-centered is-clickable dashboard-card"
                    style={{ background: themeGradient, borderTop: `5px solid ${themeHex}` }}
                  >
                    <span className="icon is-large" style={{ color: themeHex, marginBottom: '15px' }}>
                      <i className="fas fa-3x fa-magic"></i>
                    </span>
                    <h2 className="is-size-4 mt-2 mb-3" style={{ color: '#2c3e50', fontWeight: '600' }}>Generate Assessments</h2>
                    <p style={{ color: '#4a4a4a' }}>Use AI to quickly generate quizzes</p>
                  </div>
                </Link>
              </div>
            )}

            <div className="column is-4">
              <Link to="/assessment-Management">
                <div 
                  className="box has-text-centered is-clickable dashboard-card"
                  style={{ background: themeGradient, borderTop: `5px solid ${themeHex}` }}
                >
                  <span className="icon is-large" style={{ color: themeHex, marginBottom: '15px' }}>
                    <i className="fas fa-3x fa-tasks"></i>
                  </span>
                  <h2 className="is-size-4 mt-2 mb-3" style={{ color: '#2c3e50', fontWeight: '600' }}>{activeRole === 'Teacher' ? 'Manage Assessments' : 'Take Assessments'}</h2>
                  <p style={{ color: '#4a4a4a' }}>{activeRole === 'Teacher' ? 'View and manage quizzes and tests' : 'Complete your assigned quizzes'}</p>
                </div>
              </Link>
            </div>

            <div className="column is-4">
              <Link to={activeRole === 'Teacher' ? '/class-performance-analytics' : '/performance-&-analytics'}>
                <div 
                  className="box has-text-centered is-clickable dashboard-card"
                  style={{ background: themeGradient, borderTop: `5px solid ${themeHex}` }}
                >
                  <span className="icon is-large" style={{ color: themeHex, marginBottom: '15px' }}>
                    <i className={`fas fa-3x ${activeRole === 'Teacher' ? 'fa-chart-pie' : 'fa-chart-line'}`}></i>
                  </span>
                  <h2 className="is-size-4 mt-2 mb-3" style={{ color: '#2c3e50', fontWeight: '600' }}>Analytics</h2>
                  <p style={{ color: '#4a4a4a' }}>{activeRole === 'Teacher' ? 'Track class progress and metrics' : 'View your personal performance'}</p>
                </div>
              </Link>
            </div>
          </div>

          <hr />

          <h2 className="title is-4 mt-5">Latest Chapters</h2>
          <div className="columns is-multiline">
            {chapters.map(chapter => (
              <div key={chapter.id || chapter.uid} className="column is-4">
                <ChapterItem chapter={chapter} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeView
