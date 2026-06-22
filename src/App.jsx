import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { RoleProvider } from './context/RoleContext'
import Nav from './components/Nav'
import HomeView from './views/HomeView'
import CMView from './views/CMView'
import CGView from './views/CGView'
import AMView from './views/AMView'
import AGView from './views/AGView'
import HWView from './views/HWView'
import NotesView from './views/NotesView'
import CPAView from './views/CPAView'
import ClassPerformanceAnalytics from './components/ClassPerformanceAnalytics'
import LessonViewer from './views/LessonViewer'
import Author from './views/Author'
import MyAccount from './views/dashboard/MyAccount'
import CreateChapter from './views/dashboard/CreateChapter'

function App() {
  return (
    <RoleProvider>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<HomeView />} />
            <Route path="/content-Management" element={<CMView />} />
            <Route path="/content-Generation" element={<CGView />} />
            <Route path="/assessment-Management" element={<AMView />} />
            <Route path="/assessment-Generation" element={<AGView />} />
            <Route path="/homework-Management" element={<HWView />} />
            <Route path="/notes-Management" element={<NotesView />} />
            <Route path="/performance-&-analytics" element={<CPAView />} />
            <Route path="/class-performance-analytics" element={<ClassPerformanceAnalytics />} />

            <Route path="/content-Management/:slug" element={<LessonViewer filterType="article" sidebarTitle="Table of Contents" mainTitle="Introduction" />} />
            <Route path="/assessment-Management/:slug" element={<LessonViewer filterType="quiz" sidebarTitle="Quizzes" mainTitle="Assessment Overview" />} />
            <Route path="/authors/:id" element={<Author />} />
            <Route path="/dashboard/my-account" element={<MyAccount />} />
            <Route path="/dashboard/create-chapter" element={<CreateChapter />} />
          </Routes>
          <footer className="footer">
            <p className="has-text-centered">Footer</p>
          </footer>
        </Router>
    </RoleProvider>
  )
}

export default App
