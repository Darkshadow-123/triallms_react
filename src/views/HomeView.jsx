import { useEffect, useState } from 'react'
import axios from '../api'
import ChapterItem from '../components/ChapterItem'

const HomeView = () => {
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
      <div className="hero is-info is-medium">
        <div className="hero-body has-text-centered">
          <h1 className="title">Welcom to VerityLMS</h1>
          <h2 className="subtitle">There is nothing to add</h2>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="columns is-multiline">
            <div className="column is-4">
              <div className="box has-text-centered">
                <h2 className="is-size-4 mt-4 mb-4">Content Management</h2>
                <p>placeholder for content Management</p>
              </div>
            </div>
            <div className="column is-4">
              <div className="box has-text-centered">
                <h2 className="is-size-4 mt-4 mb-4">Content Generation</h2>
                <p>placeholder for content generation</p>
              </div>
            </div>
            <div className="column is-4">
              <div className="box has-text-centered">
                <h2 className="is-size-4 mt-4 mb-4">Assessment Management</h2>
                <p>placeholder for Assessment Management</p>
              </div>
            </div>
            <div className="column is-4">
              <div className="box has-text-centered">
                <h2 className="is-size-4 mt-4 mb-4">Assessment Generation</h2>
                <p>placeholder for Assessment Generation</p>
              </div>
            </div>
            <div className="column is-4">
              <div className="box has-text-centered">
                <h2 className="is-size-4 mt-4 mb-4">Homework Management</h2>
                <p>placeholder for Homework Management</p>
              </div>
            </div>
            <div className="column is-4">
              <div className="box has-text-centered">
                <h2 className="is-size-4 mt-4 mb-4">Class Performance & Analytics</h2>
                <p>placeholder for Class Performance & Analytics</p>
              </div>
            </div>

            <hr />

            {chapters.map(chapter => (
              <div key={chapter.id} className="column is-4">
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
