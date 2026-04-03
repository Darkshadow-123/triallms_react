import { useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from '../api'

const AddComment = ({ activeLesson, onSubmitComment }) => {
  const { slug } = useParams()
  const [comment, setComment] = useState({
    name: '',
    content: ''
  })
  const [errors, setErrors] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrors([])

    if (comment.name === '') {
      setErrors(['The name must be filled out!'])
      return
    }

    if (comment.content === '') {
      setErrors(['The content must be filled out!'])
      return
    }

    axios
      .post(`content_management/${slug}/${activeLesson.slug}/`, comment)
      .then(response => {
        setComment({ name: '', content: '' })
        onSubmitComment(response.data)
      })
      .catch(error => {
        console.log(error)
      })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <label className="label">Name</label>
        <div className="control">
          <input
            type="text"
            className="input"
            value={comment.name}
            onChange={(e) => setComment({ ...comment, name: e.target.value })}
          />
        </div>
      </div>

      <div className="field">
        <label className="label">Content</label>
        <div className="control">
          <textarea
            className="textarea"
            value={comment.content}
            onChange={(e) => setComment({ ...comment, content: e.target.value })}
          />
        </div>
      </div>

      {errors.map((error, index) => (
        <div key={index} className="notification is-danger">{error}</div>
      ))}

      <div className="field">
        <div className="control">
          <button className="button is-link">Submit</button>
        </div>
      </div>
    </form>
  )
}

export default AddComment
