import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../api'
import { AuthContext } from '../../context/AuthContext'
import ChapterItem from '../../components/ChapterItem'

const MyAccount = () => {
  const { removeToken } = useContext(AuthContext)
  const navigate = useNavigate()
  const [chapters, setChapters] = useState([])

  useEffect(() => {
    axios
      .get('activities/get_active_chapters/')
      .then(response => {
        console.log(response.data)
        setChapters(response.data)
      })
  }, [])

  const handleLogout = async () => {
    console.log('logout')

    try {
      await axios.post('token/logout')
      console.log('logged out')
    } catch (error) {
      console.log(error)
    }

    axios.defaults.headers.common['Authorization'] = ''
    removeToken()
    navigate('/')
  }

  return (
    <div className="content-management">
      <div className="hero is-info is-medium">
        <div className="hero-body has-text-centered">
          <h1 className="title">My Account</h1>
        </div>
      </div>

      <section className="section">
        <div className="columns is-multiline">
          <div className="column is-12">
            <h2 className="subtitle is-size-3">Your active chapters</h2>
          </div>
        </div>

        {chapters.map(chapter => (
          <div key={chapter.id} className="column is-4">
            <ChapterItem chapter={chapter} />
          </div>
        ))}

        <hr />

        <button onClick={handleLogout} className="button is-danger">Log out</button>
      </section>
    </div>
  )
}

export default MyAccount
