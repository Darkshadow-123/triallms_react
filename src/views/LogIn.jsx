import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from '../api'
import { AuthContext } from '../context/AuthContext'

const LogIn = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState([])
  const navigate = useNavigate()
  const { setToken } = useContext(AuthContext)

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('submitForm')

    axios.defaults.headers.common['Authorization'] = ''
    localStorage.removeItem('token')

    setErrors([])

    if (username === '') {
      errors.push('The Username is Missing!')
    }
    if (password === '') {
      errors.push('The Password is Missing!')
    }

    if (errors.length === 0) {
      const formData = {
        username,
        password
      }

      axios
        .post('token/login', formData)
        .then(response => {
          const token = response.data.auth_token
          setToken(token)
          navigate('/dashboard/my-account')
        })
        .catch(error => {
          if (error.response) {
            const newErrors = []
            for (const property in error.response.data) {
              newErrors.push(`${property}: ${error.response.data[property]}`)
            }
            setErrors(newErrors)
          } else if (error.message) {
            setErrors(['Something Went Wrong. Please try again'])
          }
        })
    }
  }

  return (
    <div className="login">
      <div className="hero is-info is-medium">
        <div className="hero-body has-text-centered">
          <h1 className="title">Login</h1>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column is-4 is-offset-3">
              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label>Email</label>
                  <div className="control">
                    <input
                      type="text"
                      className="input"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>

                <div className="field">
                  <label>Password</label>
                  <div className="control">
                    <input
                      type="password"
                      className="input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                {errors.length > 0 && (
                  <div className="notification is-danger">
                    {errors.map((error, index) => (
                      <p key={index}>{error}</p>
                    ))}
                  </div>
                )}

                <div className="field">
                  <div className="control">
                    <button className="button is-dark">Login</button>
                  </div>
                </div>
              </form>

              <hr />
              Or <Link to="/sign-up"> Click Here!</Link> to Sign Up
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LogIn
