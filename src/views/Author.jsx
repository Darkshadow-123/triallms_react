import { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../api'
import ChapterItem from '../components/ChapterItem'
import { RoleContext } from '../context/RoleContext'

const Author = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { themeClass } = useContext(RoleContext)
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
    <div className="author-detail">
      <div className={`hero ${themeClass} is-medium`} style={{ position: 'relative' }}>
        <button
          onClick={() => navigate(-1)}
          className="button is-ghost"
          style={{ position: 'absolute', top: '20px', left: '20px', color: 'white', fontWeight: 'bold' }}
        >
          <span className="icon"><i className="fas fa-arrow-left"></i></span>
          <span>Go Back</span>
        </button>
        <div className="hero-body has-text-centered">
          <h1 className="title">{createdBy.first_name} {createdBy.last_name}</h1>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="columns is-multiline">
            {chapters.map(chapter => (
              <div key={chapter.id} className="column is-4">
                <ChapterItem chapter={chapter} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Author
