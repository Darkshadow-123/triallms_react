import { useEffect, useState, useContext } from 'react'
import axios from '../api'
import ChapterItem from '../components/ChapterItem'
import { RoleContext } from '../context/RoleContext'
import { Link } from 'react-router-dom'

const HomeView = () => {
  const { themeClass, activeRole } = useContext(RoleContext)
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
                <div className="box has-text-centered is-clickable" style={{ height: '100%' }}>
                  <h2 className="is-size-4 mt-4 mb-4">{activeRole === 'Teacher' ? 'Manage Content' : 'View Content'}</h2>
                  <p>Access and organize learning materials</p>
                </div>
              </Link>
            </div>
            {activeRole === 'Teacher' && (
              <div className="column is-4">
                <Link to="/dashboard/create-chapter">
                  <div className="box has-text-centered is-clickable" style={{ height: '100%' }}>
                    <h2 className="is-size-4 mt-4 mb-4">Create Content</h2>
                    <p>Build and publish new lessons and chapters</p>
                  </div>
                </Link>
              </div>
            )}
            <div className="column is-4">
              <Link to="/assessment-Management">
                <div className="box has-text-centered is-clickable" style={{ height: '100%' }}>
                  <h2 className="is-size-4 mt-4 mb-4">{activeRole === 'Teacher' ? 'Manage Assessments' : 'Take Assessments'}</h2>
                  <p>View and manage quizzes and tests</p>
                </div>
              </Link>
            </div>
            {activeRole === 'Teacher' && (
              <div className="column is-4">
                <Link to="/assessment-Generation">
                  <div className="box has-text-centered is-clickable" style={{ height: '100%' }}>
                    <h2 className="is-size-4 mt-4 mb-4">Generate Assessments</h2>
                    <p>Use AI to quickly generate quizzes</p>
                  </div>
                </Link>
              </div>
            )}
            <div className="column is-4">
              <Link to="/homework-Management">
                <div className="box has-text-centered is-clickable" style={{ height: '100%' }}>
                  <h2 className="is-size-4 mt-4 mb-4">{activeRole === 'Teacher' ? 'Manage Homework' : 'View Homework'}</h2>
                  <p>Assign and review homework tasks</p>
                </div>
              </Link>
            </div>
            <div className="column is-4">
              <Link to={activeRole === 'Teacher' ? '/class-performance-analytics' : '/performance-&-analytics'}>
                <div className="box has-text-centered is-clickable" style={{ height: '100%' }}>
                  <h2 className="is-size-4 mt-4 mb-4">{activeRole === 'Teacher' ? 'Class Analytics' : 'My Performance'}</h2>
                  <p>Track progress and performance metrics</p>
                </div>
              </Link>
            </div>
            {activeRole === 'Student' && (
              <div className="column is-4">
                <Link to="/notes-Management">
                  <div className="box has-text-centered is-clickable" style={{ height: '100%' }}>
                    <h2 className="is-size-4 mt-4 mb-4">My Notes</h2>
                    <p>View and manage your personal notes</p>
                  </div>
                </Link>
              </div>
            )}

            <hr />

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
