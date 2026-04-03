import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

const Nav = () => {
  const { user } = useContext(AuthContext)

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation" style={{ minHeight: '5rem' }}>
      <div className="navbar-brand">
        <Link className="navbar-item is-size-4" to="/">TrialLMS</Link>
      </div>

      <div id="navbar-item" className="navbar-menu">
        <div className="navbar-start">
          <Link to="/" className="navbar-item">Home</Link>
          <Link to="/content-Generation" className="navbar-item">Content Generation</Link>
          <Link to="/content-Management" className="navbar-item">Content Management</Link>
          <Link to="/assessment-Generation" className="navbar-item">Assessment Generation</Link>
          <Link to="/assessment-Management" className="navbar-item">Assessment Management</Link>
          <Link to="/homework-Management" className="navbar-item">Homework Management</Link>
          <Link to="/performance-&-analytics" className="navbar-item">Class Performance & Analytics</Link>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              {user.isAuthenticated ? (
                <>
                  <Link to="/dashboard/create-chapter" className="button is-primary">Create Chapter</Link>
                  <Link to="/dashboard/my-account" className="button is-info">My Account</Link>
                </>
              ) : (
                <>
                  <Link to="/sign-up" className="button is-primary"><strong>Sign Up</strong></Link>
                  <Link to="/log-in" className="button is-light">Log in</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Nav
