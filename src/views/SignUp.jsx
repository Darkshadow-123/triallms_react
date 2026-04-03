import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from '../api'

const SignUp = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [errors, setErrors] = useState([])
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('submitForm')

    setErrors([])

    if (username === '') {
      setErrors(['The Username is Missing!'])
      return
    }
    if (password === '') {
      setErrors(['The Password is Missing!'])
      return
    }
    if (password !== password2) {
      setErrors(['The Password is not the same'])
      return
    }

    const formData = {
      username,
      password
    }

    axios
      .post('users/', formData)
      .then(() => {
        navigate('/log-in')
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

  return (
    <div className="signup">
      <div className="hero is-info is-medium">
        <div className="hero-body has-text-centered">
          <h1 className="title">Sign Up</h1>
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
                      type="email"
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

                <div className="field">
                  <label>Repeat Password</label>
                  <div className="control">
                    <input
                      type="password"
                      className="input"
                      value={password2}
                      onChange={(e) => setPassword2(e.target.value)}
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
                    <button className="button is-dark">Sign Up</button>
                  </div>
                </div>
              </form>

              <hr />
              Or <Link to="/log-in"> Click Here!</Link> to Log in
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SignUp
