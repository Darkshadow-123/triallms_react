import { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import axios from '../api'
import { AuthContext } from '../context/AuthContext'
import ChapterItem from '../components/ChapterItem'

const Author = () => {
  const { id } = useParams()
  const { user } = useContext(AuthContext)
  const [chapters, setChapters] = useState([])
  const [createdBy, setCreatedBy] = useState({})

  useEffect(() => {
    axios
      .get(`content_management/get_author_chapters/${id}/`)
      .then(response => {
        console.log(response.data)
        setChapters(response.data.chapters)
        setCreatedBy(response.data.created_by)
      })
  }, [id])

  return (
    <div className="content-management">
      <div className="hero is-info is-medium">
        <div className="hero-body has-text-centered">
          <h1 className="title">{createdBy.first_name} {createdBy.last_name}</h1>
        </div>
      </div>

      <section className="section">
        <div className="container">
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
      </section>
    </div>
  )
}

export default Author
