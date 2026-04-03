import axios from 'axios'
import { createContext, useState, useEffect } from 'react'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    token: '',
    isAuthenticated: false
  })

  useEffect(() => {
    initializeStore()
  }, [])

  const initializeStore = () => {
    const token = localStorage.getItem('token')
    if (token) {
      setUser({ token, isAuthenticated: true })
      axios.defaults.headers.common['Authorization'] = `Token ${token}`
    } else {
      setUser({ token: '', isAuthenticated: false })
    }
  }

  const setToken = (token) => {
    setUser({ token, isAuthenticated: true })
    axios.defaults.headers.common['Authorization'] = `Token ${token}`
    localStorage.setItem('token', token)
  }

  const removeToken = () => {
    setUser({ token: '', isAuthenticated: false })
    axios.defaults.headers.common['Authorization'] = ''
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, setToken, removeToken, initializeStore }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
