import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../api'
import ChapterItem from '../../components/ChapterItem'
import { RoleContext } from '../../context/RoleContext'

const MyAccount = () => {
  const navigate = useNavigate()
  const [chapters, setChapters] = useState([])
  const { themeClass, activeRole, themeHex } = useContext(RoleContext)

  // Teacher Dashboard State
  const [teachers, setTeachers] = useState([])
  const [selectedTeacher, setSelectedTeacher] = useState('')
  
  const [grades, setGrades] = useState([])
  const [selectedGrade, setSelectedGrade] = useState('')
  
  const [subjects, setSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState('')
  
  const [contentData, setContentData] = useState([])

  // Student Dashboard State
  const [studentsList, setStudentsList] = useState([])
  const [selectedStudent, setSelectedStudent] = useState('')
  const [studentInfo, setStudentInfo] = useState({ grade: null, subjects: [] })
  const [selectedStudentSubject, setSelectedStudentSubject] = useState('')
  const [studentContentData, setStudentContentData] = useState([])

  useEffect(() => {
    // Original behavior for active chapters
    axios
      .get('activities/get_active_chapters/')
      .then(response => {
        setChapters(response.data)
      })

    // Fetch teachers if role is Teacher, students otherwise
    if (activeRole === 'Teacher') {
      axios.get('teachers/').then(response => setTeachers(response.data))
    } else {
      axios.get('students/').then(response => setStudentsList(response.data))
    }
  }, [activeRole])

  // Fetch Grades when Teacher is selected
  useEffect(() => {
    if (selectedTeacher) {
      axios.get(`teachers/${selectedTeacher}/grades`).then(response => {
        setGrades(response.data)
        setSelectedGrade('')
        setSubjects([])
        setSelectedSubject('')
        setContentData([])
      })
    } else {
      setGrades([])
    }
  }, [selectedTeacher])

  // Fetch Subjects when Grade is selected
  useEffect(() => {
    if (selectedTeacher && selectedGrade) {
      axios.get(`teachers/${selectedTeacher}/grades/${selectedGrade}/subjects`).then(response => {
        setSubjects(response.data)
        setSelectedSubject('')
        setContentData([])
      })
    } else {
      setSubjects([])
    }
  }, [selectedTeacher, selectedGrade])

  // Fetch Content when Subject is selected
  useEffect(() => {
    if (selectedTeacher && selectedGrade && selectedSubject) {
      axios.get(`teachers/${selectedTeacher}/content?grade_id=${selectedGrade}&subject_id=${selectedSubject}`).then(response => {
        setContentData(response.data)
      })
    } else {
      setContentData([])
    }
  }, [selectedTeacher, selectedGrade, selectedSubject])

  // Student Dashboard Effects
  useEffect(() => {
    if (selectedStudent) {
      axios.get(`students/${selectedStudent}/info`).then(response => {
        setStudentInfo(response.data)
        setSelectedStudentSubject('')
        setStudentContentData([])
      })
    } else {
      setStudentInfo({ grade: null, subjects: [] })
      setSelectedStudentSubject('')
      setStudentContentData([])
    }
  }, [selectedStudent])

  useEffect(() => {
    if (selectedStudent && selectedStudentSubject) {
      axios.get(`students/${selectedStudent}/content?subject_id=${selectedStudentSubject}`).then(response => {
        setStudentContentData(response.data)
      })
    } else {
      setStudentContentData([])
    }
  }, [selectedStudent, selectedStudentSubject])

  return (
    <div className="my-account">
      {/* Hero Section */}
      <div className={`hero ${themeClass} is-medium`} style={{ position: 'relative' }}>
        <button 
          onClick={() => navigate(-1)} 
          className="button is-ghost" 
          style={{ position: 'absolute', top: '20px', left: '20px', color: 'white', fontWeight: 'bold' }}
        >
          <span className="icon"><i className="fas fa-arrow-left"></i></span>
          <span>Go Back</span>
        </button>
        <div className="hero-body has-text-centered">
          <h1 className="title">My Account</h1>
        </div>
      </div>

      <section className="section">
        {activeRole === 'Teacher' && (
          <div className="box" style={{ marginBottom: '40px', borderLeft: `5px solid ${themeHex}` }}>
            <h2 className="subtitle is-4" style={{ color: '#2c3e50', marginBottom: '20px' }}>
              <i className="fas fa-chalkboard-teacher" style={{ marginRight: '10px' }}></i>
              Teacher Dashboard
            </h2>

            <div className="columns is-multiline mb-4">
              <div className="column is-one-third">
                <div className="field">
                  <label className="label">Select Teacher</label>
                  <div className="control">
                    <div className="select is-fullwidth">
                      <select value={selectedTeacher} onChange={e => setSelectedTeacher(e.target.value)} style={{ borderColor: themeHex, borderWidth: '1px' }}>
                        <option value="">-- Choose Teacher --</option>
                        {teachers.map(t => (
                          <option key={t.uid} value={t.uid}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {selectedTeacher && (
                <div className="column is-one-third">
                  <div className="field">
                    <label className="label">Select Grade</label>
                    <div className="control">
                      <div className="select is-fullwidth">
                        <select value={selectedGrade} onChange={e => setSelectedGrade(e.target.value)} style={{ borderColor: themeHex, borderWidth: '1px' }}>
                          <option value="">-- Choose Grade --</option>
                          {grades.map(g => (
                            <option key={g.id || g.uid} value={g.id || g.uid}>Grade {g.grade}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedGrade && (
                <div className="column is-one-third">
                  <div className="field">
                    <label className="label">Select Subject</label>
                    <div className="control">
                      <div className="select is-fullwidth">
                        <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} style={{ borderColor: themeHex, borderWidth: '1px' }}>
                          <option value="">-- Choose Subject --</option>
                          {subjects.map(s => (
                            <option key={s.id || s.uid} value={s.id || s.uid}>{s.subject_name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {selectedSubject && (
              <div className="content-hierarchy mt-5">
                <h3 className="title is-5" style={{ color: themeHex }}>Assigned Content</h3>
                {contentData.length === 0 ? (
                  <p>No content found for this selection.</p>
                ) : (
                  contentData.map(chapter => (
                    <div key={chapter.chapter_id} className="box mb-4" style={{ backgroundColor: '#f8fafc', borderLeft: `3px solid ${themeHex}` }}>
                      <h4 className="title is-5 mb-3" style={{ color: '#2c3e50' }}>
                        <i className="fas fa-layer-group" style={{ marginRight: '8px', color: themeHex }}></i>
                        Chapter: {chapter.chapter_name}
                      </h4>
                      
                      {chapter.lessons.length === 0 ? (
                        <p className="has-text-grey ml-5">No lessons in this chapter.</p>
                      ) : (
                        <div className="ml-5">
                          {chapter.lessons.map(lesson => (
                            <div key={lesson.lesson_id} className="mb-4 pl-4 pb-2" style={{ borderLeft: '2px solid #ddd' }}>
                              <h5 className="title is-6 mb-2">
                                <i className="fas fa-chalkboard" style={{ marginRight: '8px', color: '#666' }}></i>
                                Lesson: {lesson.lesson_name}
                              </h5>
                              
                              <div className="tags ml-4">
                                {lesson.assessments.map(a => (
                                  <span key={a.id} className="tag" style={{ backgroundColor: '#eef2ff', color: '#4f46e5', fontWeight: '600' }}>
                                    <i className="fas fa-tasks mr-1"></i> Assessment: {a.title}
                                  </span>
                                ))}
                                {lesson.homeworks.map(h => (
                                  <span key={h.id} className="tag" style={{ backgroundColor: '#fdf4ff', color: '#c026d3', fontWeight: '600' }}>
                                    <i className="fas fa-book-reader mr-1"></i> Homework: {h.title}
                                  </span>
                                ))}
                                {lesson.notes.map(n => (
                                  <span key={n.id} className="tag" style={{ backgroundColor: '#fffbeb', color: '#d97706', fontWeight: '600' }}>
                                    <i className="fas fa-sticky-note mr-1"></i> Note: {n.title}
                                  </span>
                                ))}
                              </div>
                              
                              {lesson.assessments.length === 0 && lesson.homeworks.length === 0 && lesson.notes.length === 0 && (
                                <p className="is-size-7 has-text-grey ml-4">No assessments, homework, or notes.</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {activeRole !== 'Teacher' && (
          <>
            <div className="box" style={{ marginBottom: '40px', borderLeft: `5px solid ${themeHex}` }}>
              <h2 className="subtitle is-4" style={{ color: '#2c3e50', marginBottom: '20px' }}>
                <i className="fas fa-user-graduate" style={{ marginRight: '10px' }}></i>
                Student Dashboard
              </h2>

              <div className="columns is-multiline mb-4">
                <div className="column is-one-third">
                  <div className="field">
                    <label className="label">Select Student</label>
                    <div className="control">
                      <div className="select is-fullwidth">
                        <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} style={{ borderColor: themeHex, borderWidth: '1px' }}>
                          <option value="">-- Choose Student --</option>
                          {studentsList.map(s => (
                            <option key={s.uid} value={s.uid}>{s.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedStudent && studentInfo.grade && (
                  <div className="column is-one-third">
                    <div className="field">
                      <label className="label">Assigned Grade</label>
                      <div className="control">
                        <input className="input" type="text" value={`Grade ${studentInfo.grade.grade}`} readOnly style={{ backgroundColor: '#f5f5f5', color: '#7a7a7a', borderColor: themeHex }} />
                      </div>
                    </div>
                  </div>
                )}

                {selectedStudent && studentInfo.subjects.length > 0 && (
                  <div className="column is-one-third">
                    <div className="field">
                      <label className="label">Select Subject</label>
                      <div className="control">
                        <div className="select is-fullwidth">
                          <select value={selectedStudentSubject} onChange={e => setSelectedStudentSubject(e.target.value)} style={{ borderColor: themeHex, borderWidth: '1px' }}>
                            <option value="">-- Choose Subject --</option>
                            {studentInfo.subjects.map(s => (
                              <option key={s.uid} value={s.uid}>{s.subject_name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {selectedStudentSubject && (
                <div className="content-hierarchy mt-5">
                  <h3 className="title is-5" style={{ color: themeHex }}>Subject Content</h3>
                  {studentContentData.length === 0 ? (
                    <p>No content found for this subject.</p>
                  ) : (
                    studentContentData.map(chapter => (
                      <div key={chapter.chapter_id} className="box mb-4" style={{ backgroundColor: '#f8fafc', borderLeft: `3px solid ${themeHex}` }}>
                        <h4 className="title is-5 mb-3" style={{ color: '#2c3e50' }}>
                          <i className="fas fa-layer-group" style={{ marginRight: '8px', color: themeHex }}></i>
                          Chapter: {chapter.chapter_name}
                        </h4>
                        
                        {chapter.lessons.length === 0 ? (
                          <p className="has-text-grey ml-5">No lessons in this chapter.</p>
                        ) : (
                          <div className="ml-5">
                            {chapter.lessons.map(lesson => (
                              <div key={lesson.lesson_id} className="mb-4 pl-4 pb-2" style={{ borderLeft: '2px solid #ddd' }}>
                                <h5 className="title is-6 mb-2">
                                  <i className="fas fa-chalkboard" style={{ marginRight: '8px', color: '#666' }}></i>
                                  Lesson: {lesson.lesson_name}
                                </h5>
                                
                                <div className="tags ml-4">
                                  {lesson.assessments.map(a => (
                                    <span key={a.id} className="tag" style={{ backgroundColor: '#eef2ff', color: '#4f46e5', fontWeight: '600' }}>
                                      <i className="fas fa-tasks mr-1"></i> Assessment: {a.title}
                                    </span>
                                  ))}
                                  {lesson.homeworks.map(h => (
                                    <span key={h.id} className="tag" style={{ backgroundColor: '#fdf4ff', color: '#c026d3', fontWeight: '600' }}>
                                      <i className="fas fa-book-reader mr-1"></i> Homework: {h.title}
                                    </span>
                                  ))}
                                  {lesson.notes.map(n => (
                                    <span key={n.id} className="tag" style={{ backgroundColor: '#fffbeb', color: '#d97706', fontWeight: '600' }}>
                                      <i className="fas fa-sticky-note mr-1"></i> Note: {n.title}
                                    </span>
                                  ))}
                                </div>
                                
                                {lesson.assessments.length === 0 && lesson.homeworks.length === 0 && lesson.notes.length === 0 && (
                                  <p className="is-size-7 has-text-grey ml-4">No assessments, homework, or notes.</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="columns is-multiline mt-6">
              <div className="column is-12">
                <h2 className="subtitle is-size-3" style={{ borderBottom: `2px solid ${themeHex}`, paddingBottom: '10px' }}>Your active chapters</h2>
              </div>
            </div>

            <div className="columns is-multiline">
              {chapters.map(chapter => (
                <div key={chapter.id} className="column is-4">
                  <ChapterItem chapter={chapter} />
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  )
}

export default MyAccount
