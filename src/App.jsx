import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Nav from './components/Nav'
import HomeView from './views/HomeView'
import LogIn from './views/LogIn'
import SignUp from './views/SignUp'
import CMView from './views/CMView'
import CGView from './views/CGView'
import AMView from './views/AMView'
import AGView from './views/AGView'
import HWView from './views/HWView'
import CPAView from './views/CPAView'
import Chapter from './views/Chapter'
import Author from './views/Author'
import MyAccount from './views/dashboard/MyAccount'
import CreateChapter from './views/dashboard/CreateChapter'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/content-Management" element={<CMView />} />
          <Route path="/content-Generation" element={<CGView />} />
          <Route path="/assessment-Management" element={<AMView />} />
          <Route path="/assessment-Generation" element={<AGView />} />
          <Route path="/homework-Management" element={<HWView />} />
          <Route path="/performance-&-analytics" element={<CPAView />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/log-in" element={<LogIn />} />
          <Route path="/content-Management/:slug" element={<Chapter />} />
          <Route path="/authors/:id" element={<Author />} />
          <Route path="/dashboard/my-account" element={<MyAccount />} />
          <Route path="/dashboard/create-chapter" element={<CreateChapter />} />
        </Routes>
        <footer className="footer">
          <p className="has-text-centered">Footer</p>
        </footer>
      </Router>
    </AuthProvider>
  )
}

export default App
