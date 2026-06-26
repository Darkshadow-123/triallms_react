import { useEffect, useState, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from '../api'
import Quiz from '../components/Quiz'
import { RoleContext } from '../context/RoleContext'

const LessonViewer = ({ filterType = 'article', sidebarTitle = 'Table of Contents', mainTitle = 'Introduction', showNotes = true }) => {
  const { themeClass, themeHex, themeGradient, themeLightHex } = useContext(RoleContext)
  const { slug } = useParams()
  const [chapter, setChapter] = useState({ created_by: { id: 0 } })
  const [lessons, setLessons] = useState([])

  const [activeLesson, setActiveLesson] = useState(null)
  const [quiz, setQuiz] = useState({})
  const [activity, setActivity] = useState({})
  const [notes, setNotes] = useState([])

  useEffect(() => {
    console.log('mounted')

    axios
      .get(`content_management/${slug}/`)
      .then(response => {
        console.log('chapter:', response.data)
        setChapter(response.data.chapter)
        // Filter lessons by type
        const filteredLessons = response.data.lessons.filter(lesson => lesson.lesson_type === filterType)
        setLessons(filteredLessons)
        document.title = response.data.chapter.chapter_name + ' | VerityLMS'
      })
  }, [slug, filterType])


  const setActiveLessonHandler = (lesson) => {
    setActiveLesson(lesson)

    if (lesson.lesson_type === 'quiz') {
      getQuiz(lesson)
    }

    trackStarted(lesson)
    if (showNotes) {
      getNotes(lesson)
    } else {
      setNotes([])
    }
  }

  const getNotes = (lesson) => {
    const lessonId = lesson.id || lesson.uid;
    const digits = String(lessonId).replace(/\D/g, '');
    const numericId = parseInt(digits.substring(0, 12), 10) || 1;
    
    axios.get(`note?lesson_id=${numericId}`)
      .then(response => {
        const fetchedNotes = Array.isArray(response.data) ? response.data : [response.data].filter(Boolean);
        // Filter notes locally to ensure only the notes for this lesson are displayed
        const filteredNotes = fetchedNotes.filter(note => String(note.lesson_id) === String(numericId));
        setNotes(filteredNotes);
      })
      .catch(error => {
        setNotes([])
        if (error.response && error.response.status !== 404) {
          console.error('Error fetching notes:', error)
        }
      })
  }

  const trackStarted = (lesson) => {
    axios
      .post(`activities/track_started/${slug}/${lesson.slug}/`)
      .then(response => {
        console.log('activity:', response.data)
        setActivity(response.data)
      })
      .catch(error => {
        console.error('Error tracking started:', error)
      })
  }

  const getQuiz = (lesson) => {
    axios
      .get(`content_management/${slug}/${lesson.slug}/get-quiz/`)
      .then(response => {
        console.log('quiz:', response.data)
        setQuiz(response.data)
      })
      .catch(error => {
        console.error('Error fetching quiz:', error)
      })
  }


  const markAsDone = () => {
    axios
      .post(`activities/mark_as_done/${slug}/${activeLesson.slug}/`)
      .then(response => {
        console.log(response.data)
        setActivity(response.data)
      })
      .catch(error => {
        console.error('Error marking as done:', error)
      })
  }

  return (
    <div className="lesson-viewer">
      <div className={`hero ${themeClass} is-medium`}>
        <div className="hero-body has-text-centered">
          <h1 className="title">{chapter.chapter_name}</h1>
          <Link
            to={`/authors/${chapter.created_by.id}`}
            className="subtitle"
            style={{ color: 'rgba(255, 255, 255, 0.9)', textDecoration: 'none' }}
          >
            By {chapter.created_by.first_name} {chapter.created_by.last_name}
          </Link>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="columns">
            {/* Sidebar - Table of Contents */}
            <div className="column is-3">
              <div 
                className="box desktop-sticky" 
                style={{ 
                  background: themeGradient,
                  borderLeft: `5px solid ${themeHex}`,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                  <span className="icon" style={{ color: themeHex, marginRight: '10px' }}>
                    <i className="fas fa-list-ul"></i>
                  </span>
                  <h2 className="subtitle is-5" style={{ margin: 0, color: '#2c3e50', fontWeight: '600' }}>
                    {sidebarTitle}
                  </h2>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {lessons.map((lesson, index) => (
                    <li key={lesson.id} style={{ marginBottom: '10px' }}>
                      <a 
                        onClick={() => setActiveLessonHandler(lesson)}
                        style={{
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '12px 15px',
                          color: activeLesson?.id === lesson.id ? themeHex : '#2c3e50',
                          fontWeight: activeLesson?.id === lesson.id ? '600' : '500',
                          backgroundColor: activeLesson?.id === lesson.id ? '#eff4fb' : 'transparent',
                          borderLeft: activeLesson?.id === lesson.id ? `3px solid ${themeHex}` : 'none',
                          paddingLeft: activeLesson?.id === lesson.id ? '12px' : '15px',
                          borderRadius: '4px',
                          transition: 'all 0.3s ease',
                          hoverColor: themeHex
                        }}
                        onMouseEnter={(e) => {
                          if (activeLesson?.id !== lesson.id) {
                            e.target.style.backgroundColor = '#f0f7ff'
                            e.target.style.color = themeHex
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (activeLesson?.id !== lesson.id) {
                            e.target.style.backgroundColor = 'transparent'
                            e.target.style.color = '#2c3e50'
                          }
                        }}
                      >
                        <i 
                          className={`fas fa-${lesson.lesson_type === 'quiz' ? 'question-circle' : 'file-alt'}`}
                          style={{ color: themeHex, minWidth: '20px' }}
                        ></i>
                        <span>{lesson.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Main Content */}
            <div className="column is-9">
              {activeLesson ? (
                <>
                  {/* Lesson Header */}
                  <div 
                    className="box" 
                    style={{ 
                      marginBottom: '30px',
                      background: themeGradient,
                      borderLeft: `5px solid ${themeHex}`,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
                        <span className="icon" style={{ color: themeHex }}>
                          <i className={`fas fa-${activeLesson.lesson_type === 'quiz' ? 'question-circle' : 'book-open'}`}></i>
                        </span>
                        <div>
                          <h2 className="subtitle is-4" style={{ margin: 0, color: '#2c3e50', fontWeight: '600' }}>
                            {activeLesson.title}
                          </h2>
                          <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>
                            {activeLesson.lesson_type === 'quiz' ? '📝 Quiz' : '📖 Article'}
                          </p>
                        </div>
                      </div>
                      <div>
                        {activity.status === 'started' ? (
                          <button
                            onClick={markAsDone}
                            className="button is-warning is-light"
                            style={{
                              borderRadius: '6px',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                              padding: '10px 15px',
                              fontSize: '14px',
                              border: '2px solid #ffdd57',
                              backgroundColor: '#fffbeb',
                              color: '#997404',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.boxShadow = '0 4px 12px rgba(255, 221, 87, 0.3)'}
                            onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
                          >
                            <i className="fas fa-clock"></i>
                            <span>Mark as Done</span>
                          </button>
                        ) : (
                          <span 
                            className="tag is-success"
                            style={{
                              backgroundColor: '#48c774',
                              color: '#ffffff',
                              padding: '10px 15px',
                              fontSize: '14px',
                              fontWeight: '600',
                              borderRadius: '6px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}
                          >
                            <i className="fas fa-check-circle"></i>
                            <span>Completed</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Lesson Content */}
                  <div 
                    className="box" 
                    style={{ 
                      marginBottom: '30px',
                      padding: '30px',
                      borderLeft: `5px solid ${themeHex}`,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    <div style={{ lineHeight: '1.8', color: '#2c3e50', fontSize: '16px' }}>
                      {activeLesson.long_description}
                    </div>
                  </div>

                  {/* Notes Section */}
                  {notes.length > 0 && (
                    <div 
                      className="box" 
                      style={{ 
                        marginBottom: '30px',
                        background: themeGradient,
                        borderLeft: `5px solid ${themeHex}`,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                        <span className="icon" style={{ color: themeHex, marginRight: '10px' }}>
                          <i className="fas fa-sticky-note"></i>
                        </span>
                        <h3 className="subtitle is-5" style={{ margin: 0, color: '#2c3e50', fontWeight: '600' }}>
                          Notes
                        </h3>
                      </div>
                      <div className="content">
                        {notes.map(note => (
                          <div key={note.notes_id} style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #ddd' }}>
                            <h4 style={{ color: themeHex, marginBottom: '10px', fontWeight: '600', fontSize: '18px', marginTop: 0 }}>{note.title}</h4>
                            <div style={{ whiteSpace: 'pre-wrap', color: '#4a4a4a', fontSize: '15px' }}>{note.content}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quiz Section */}
                  {activeLesson.lesson_type === 'quiz' && (
                    <div 
                      className="box" 
                      style={{ 
                        marginBottom: '30px',
                        background: themeGradient,
                        borderLeft: `5px solid ${themeHex}`,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                        <span className="icon" style={{ color: themeHex, marginRight: '10px' }}>
                          <i className="fas fa-question-circle"></i>
                        </span>
                        <h3 className="subtitle is-5" style={{ margin: 0, color: '#2c3e50', fontWeight: '600' }}>
                          Quiz
                        </h3>
                      </div>
                      <Quiz quiz={quiz} />
                    </div>
                  )}
                </>
              ) : (
                <div 
                  className="box" 
                  style={{ 
                    background: themeGradient,
                    borderLeft: `5px solid ${themeHex}`,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                    padding: '60px 40px'
                  }}
                >
                  <div style={{ marginBottom: '20px' }}>
                    <i className="fas fa-book-open" style={{ fontSize: '48px', color: themeHex, marginBottom: '20px' }}></i>
                  </div>
                  <h2 className="subtitle is-5" style={{ color: '#2c3e50', fontWeight: '600', marginBottom: '10px' }}>
                    {mainTitle}
                  </h2>
                  <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.6' }}>
                    {chapter.short_description}
                  </p>
                  <p style={{ color: '#999', fontSize: '14px', marginTop: '20px' }}>
                    👈 Select a lesson from the sidebar to get started
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LessonViewer
