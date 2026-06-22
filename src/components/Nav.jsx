import { Link } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import { RoleContext } from '../context/RoleContext'

const Nav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { activeRole, setActiveRole, themeClass } = useContext(RoleContext)

  // Close mobile menu when window is resized to desktop width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <nav className="navbar premium-navbar is-fixed-top" role="navigation" aria-label="main navigation" style={{ minHeight: '5rem' }}>
      <div className="navbar-brand">
        <Link className="navbar-item is-size-4" to="/" onClick={() => setIsMobileMenuOpen(false)}>TrialLMS</Link>
        
        <a 
          role="button" 
          className={`navbar-burger ${isMobileMenuOpen ? 'is-active' : ''}`} 
          aria-label="menu" 
          aria-expanded="false" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbar-item" className={`navbar-menu ${isMobileMenuOpen ? 'is-active' : ''}`}>
        <div className="navbar-start">
          <Link to="/" className="navbar-item" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          
          <div className="navbar-item has-dropdown is-hoverable">
            <a className="navbar-link">Content</a>
            <div className="navbar-dropdown">
              <Link to="/content-Generation" className="navbar-item" onClick={() => setIsMobileMenuOpen(false)}>Generation</Link>
              <Link to="/content-Management" className="navbar-item" onClick={() => setIsMobileMenuOpen(false)}>View Content</Link>
              {activeRole === 'Teacher' && (
                <Link to="/dashboard/create-chapter" className="navbar-item" onClick={() => setIsMobileMenuOpen(false)}>Create Content</Link>
              )}
            </div>
          </div>

          <div className="navbar-item has-dropdown is-hoverable">
            <a className="navbar-link">Assessments</a>
            <div className="navbar-dropdown">
              <Link to="/assessment-Generation" className="navbar-item" onClick={() => setIsMobileMenuOpen(false)}>Generation</Link>
              <Link to="/assessment-Management" className="navbar-item" onClick={() => setIsMobileMenuOpen(false)}>Management</Link>
            </div>
          </div>

          <Link to="/performance-&-analytics" className="navbar-item" onClick={() => setIsMobileMenuOpen(false)}>Analytics</Link>

          <Link to="/homework-Management" className="navbar-item" onClick={() => setIsMobileMenuOpen(false)}>Homework</Link>
          <Link to="/notes-Management" className="navbar-item" onClick={() => setIsMobileMenuOpen(false)}>Notes</Link>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              {/* Role Switch */}
              <button 
                className={`button ${themeClass} ${activeRole === 'Student' ? '' : 'is-light'}`}
                onClick={() => setActiveRole('Student')}
              >
                <span className="icon is-small"><i className="fas fa-user-graduate"></i></span>
                <span>Student</span>
              </button>
              
              <button 
                className={`button ${themeClass} ${activeRole === 'Teacher' ? '' : 'is-light'}`}
                onClick={() => setActiveRole('Teacher')}
              >
                <span className="icon is-small"><i className="fas fa-chalkboard-teacher"></i></span>
                <span>Teacher</span>
              </button>

              {/* Existing Account Button */}
              <Link to="/dashboard/my-account" className={`button ${themeClass}`} onClick={() => setIsMobileMenuOpen(false)}>My Account</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Nav
