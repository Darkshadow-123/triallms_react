import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from '../api'
import ChapterComment from '../components/ChapterComment'
import AddComment from '../components/AddComment'
import Quiz from '../components/Quiz'

const LessonViewer = ({ filterType = 'article', heroColor = 'is-info', sidebarTitle = 'Table of Contents', mainTitle = 'Introduction' }) => {
  const { slug } = useParams()
  const [chapter, setChapter] = useState({ created_by: { id: 0 } })
  const [lessons, setLessons] = useState([])
  const [comments, setComments] = useState([])
  const [activeLesson, setActiveLesson] = useState(null)
  const [quiz, setQuiz] = useState({})
  const [activity, setActivity] = useState({})

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

  const handleSubmitComment = (comment) => {
    setComments([...comments, comment])
  }

  const setActiveLessonHandler = (lesson) => {
    setActiveLesson(lesson)

    if (lesson.lesson_type === 'quiz') {
      getQuiz(lesson)
    } else {
      getComments(lesson)
    }

    trackStarted(lesson)
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

  const getComments = (lesson) => {
    axios
      .get(`content_management/${slug}/${lesson.slug}/get-comments/`)
      .then(response => {
        console.log(response.data)
        setComments(response.data)
      })
      .catch(error => {
        console.error('Error fetching comments:', error)
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
      <div className={`hero ${heroColor} is-medium`}>
        <div className="hero-body has-text-centered">
          <h1 className="title">{chapter.chapter_name}</h1>
          <Link
            to={`/authors/${chapter.created_by.id}`}
            className="subtitle"
          >
            By {chapter.created_by.first_name} {chapter.created_by.last_name}
          </Link>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="columns has-text-centered content">
            <div className="column is-2">
              <h2>{sidebarTitle}</h2>
              <ul>
                {lessons.map(lesson => (
                  <li key={lesson.id}>
                    <a onClick={() => setActiveLessonHandler(lesson)}>{lesson.title}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="column is-10">
              <h2>{mainTitle}</h2>
              {activeLesson ? (
                <>
                  <h2>{activeLesson.title}</h2>

                  {activity.status === 'started' ? (
                    <span className="tag is-warning" onClick={markAsDone}>Started</span>
                  ) : (
                    <span className="tag is-success">Done</span>
                  )}
                  <hr />

                  {activeLesson.long_description}

                  <hr />

                  {activeLesson.lesson_type === 'quiz' && (
                    <Quiz quiz={quiz} />
                  )}

                  {activeLesson.lesson_type === 'article' && (
                    <>
                      {comments.map(comment => (
                        <ChapterComment key={comment.id} comment={comment} />
                      ))}

                      <AddComment
                        chapter={chapter}
                        activeLesson={activeLesson}
                        onSubmitComment={handleSubmitComment}
                      />
                    </>
                  )}
                </>
              ) : (
                <p>{chapter.short_description}</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LessonViewer
