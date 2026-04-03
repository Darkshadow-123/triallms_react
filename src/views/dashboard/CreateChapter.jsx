import { useEffect, useState } from 'react'
import axios from '../../api'

const CreateChapter = () => {
  const [form, setForm] = useState({
    chapter_name: '',
    short_description: '',
    grades: [],
    subject: '',
    status: '',
    lessons: []
  })
  const [grades, setGrades] = useState([])
  const [subjects, setSubjects] = useState([])

  useEffect(() => {
    getGrades()
  }, [])

  const getGrades = () => {
    console.log('getGrades')
    axios
      .get('content_management/get_grades/')
      .then(response => {
        console.log(response.data)
        setGrades(response.data)
      })
  }

  const getSubjects = (gradeId) => {
    console.log('getSubjects')

    if (gradeId) {
      axios
        .get(`content_management/get_subjects/?grade=${gradeId}`)
        .then(response => {
          console.log(response.data)
          setSubjects(response.data)
        })
        .catch(error => {
          console.error(error)
        })
    } else {
      setSubjects([])
    }
  }

  const handleSubmit = (status) => {
    console.log('submitForm')
    console.log(form)

    const formData = { ...form, status }

    axios
      .post('content_management/create_chapter/', formData)
      .then(response => {
        console.log(response.data)
      })
      .catch(error => {
        console.log('error:', error)
      })
  }

  const addLesson = () => {
    console.log('addlesson')
    setForm({
      ...form,
      lessons: [
        ...form.lessons,
        { title: '', short_description: '', long_description: '' }
      ]
    })
  }

  return (
    <div className="content-management">
      <div className="hero is-info is-medium">
        <div className="hero-body has-text-centered">
          <h1 className="title">Create Chapter</h1>
        </div>
      </div>

      <section className="section">
        <div className="has-text-black mb-6 px-6 py-4 has-background-grey-lighter">
          <h2 className="subtitle">Chapter Information</h2>
          <div className="field">
            <label className="label">Subject</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                >
                  <option disabled value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.subject_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="field">
            <label>Chapter Name</label>
            <input
              type="text"
              className="input"
              value={form.chapter_name}
              onChange={(e) => setForm({ ...form, chapter_name: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Short Description</label>
            <textarea
              className="textarea"
              value={form.short_description}
              onChange={(e) => setForm({ ...form, short_description: e.target.value })}
            />
          </div>

          <div className="field">
            <label className="label">Grades</label>
            <div className="control">
              <div className="select is-multiple is-fullwidth">
                <select
                  size="8"
                  multiple
                  value={form.grades}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value)
                    setForm(prev => ({ ...prev, grades: selected }))
                    if (selected.length > 0) {
                      getSubjects(selected[0])
                    } else {
                      setSubjects([])
                    }
                  }}
                >
                  {grades.map(grade => (
                    <option key={grade.id} value={grade.id}>
                      Grade {grade.grade}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="has-text-black mb-6 px-6 py-4 has-background-grey-lighter">
          <h2 className="subtitle">Lessons</h2>
          {form.lessons.map((lesson, index) => (
            <div key={index} className="mb-4">
              <h3 className="subtitle is-size-5">Lesson</h3>
              <div className="field">
                <label>Title</label>
                <input
                  type="text"
                  className="input"
                  value={lesson.title}
                  onChange={(e) => {
                    const newLessons = [...form.lessons]
                    newLessons[index].title = e.target.value
                    setForm({ ...form, lessons: newLessons })
                  }}
                />
              </div>

              <div className="field">
                <label>Short Description</label>
                <textarea
                  className="textarea"
                  value={lesson.short_description}
                  onChange={(e) => {
                    const newLessons = [...form.lessons]
                    newLessons[index].short_description = e.target.value
                    setForm({ ...form, lessons: newLessons })
                  }}
                />
              </div>

              <div className="field">
                <label>Long Description</label>
                <textarea
                  className="textarea"
                  value={lesson.long_description}
                  onChange={(e) => {
                    const newLessons = [...form.lessons]
                    newLessons[index].long_description = e.target.value
                    setForm({ ...form, lessons: newLessons })
                  }}
                />
              </div>

              <hr />
            </div>
          ))}

          <button className="button is-primary" onClick={addLesson}>Add Lesson</button>
        </div>

        <div className="field buttons">
          <button className="button is-success" onClick={() => handleSubmit('draft')}>
            Save as Draft
          </button>
          <button className="button is-info" onClick={() => handleSubmit('review')}>
            Submit for review
          </button>
        </div>
      </section>
    </div>
  )
}

export default CreateChapter
