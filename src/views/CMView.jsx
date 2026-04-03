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
    document.title = 'Content Management | VerityLMS'
    axios
      .get('content_management/get_grades/')
      .then(response => {
        console.log(response.data)
        setGrades(response.data)
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
          <div className="columns has-text-centered">
            <div className="columns is-2">
              <aside className="menu">
                <p className="menu-label">Grades</p>
                <ul className="menu-list">
                  <li>
                    <a
                      className={!activeGrade ? 'is-active' : ''}
                      onClick={() => handleGradeClick(null)}
                    >
                      All Grades
                    </a>
                  </li>
                  {grades.map(grade => (
                    <li key={grade.id}>
                      <a onClick={() => handleGradeClick(grade)}>Grade {grade.grade}</a>
                    </li>
                  ))}
                </ul>
              </aside>
            </div>

            <div className="column is-10">
              <div className="columns is-multiline">
                {user.isAuthenticated ? (
                  chapters.map(chapter => (
                    <div key={chapter.id} className="column is-4">
                      <ChapterItem chapter={chapter} />
                    </div>
                  ))
                ) : (
                  <>
                    <h2>Restricted Access</h2>
                    <p>You need to have access or log in !!</p>
                  </>
                )}

                <div className="column is-12">
                  <nav className="pagination">
                    <a className="pagination-previous">Previous</a>
                    <a className="pagination-next">Next</a>
                    <ul className="pagination-list">
                      <li>
                        <a className="pagination-link is-current">1</a>
                      </li>
                      <li>
                        <a className="pagination-link">2</a>
                      </li>
                      <li>
                        <a className="pagination-link">3</a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CMView
