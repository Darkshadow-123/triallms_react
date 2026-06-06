import { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'

const COLORS = ['#3273dc', '#48c774', '#ffdd57', '#f14668', '#b86bff', '#7a7d85']

const buildPieLabel = (entry) => {
  if (entry.subjectBreakdown) {
    return `${entry.name}: ${entry.value}`
  }
  return `${entry.name}: ${entry.value}`
}

const StudentPerformanceAnalytics = () => {
  const [school, setSchool] = useState('')
  const [grade, setGrade] = useState('')
  const [studentId, setStudentId] = useState('')
  const [studentName, setStudentName] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [schools, setSchools] = useState([])
  const [grades, setGrades] = useState([])
  const [subjects, setSubjects] = useState([])
  const [students, setStudents] = useState([])
  const [loadingOptions, setLoadingOptions] = useState(true)

  const backendUrl = 'http://127.0.0.1:5001'

  const fetchAnalytics = async () => {
    setLoading(true)
    setError(null)
    setAnalytics(null)

    try {
      const params = new URLSearchParams({ type: 'student' })
      if (subjectId) {
        params.append('subject', subjectId)
      }
      const url = `${backendUrl}/SPA/${school}/${grade}/past_performance/${encodeURIComponent(studentId)}?${params}`
      const response = await fetch(url)
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.message || 'Unable to load analytics')
      }
      const data = await response.json()
      setAnalytics(data.analytics)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Fetch schools on component mount
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const schoolsRes = await fetch(`${backendUrl}/schools`)

        if (!schoolsRes.ok) {
          throw new Error('Failed to load schools')
        }

        const schoolsData = await schoolsRes.json()
        setSchools(schoolsData)

        // Set default school
        if (schoolsData.length > 0) {
          setSchool(schoolsData[0])
          setGrade('GRD001')
          setStudentId('')
          setStudentName('')
          setSubjectId('')
        }
        setLoadingOptions(false)
      } catch (err) {
        setError('Failed to load schools: ' + err.message)
        setLoadingOptions(false)
      }
    }

    fetchSchools()
  }, [])

  // Fetch grades and subjects when school changes
  useEffect(() => {
    if (!school) return

    const fetchOptions = async () => {
      try {
        setLoadingOptions(true)
        const [gradesRes, subjectsRes] = await Promise.all([
          fetch(`${backendUrl}/grades/${school}`),
          fetch(`${backendUrl}/subjects/${school}`)
        ])

        if (!gradesRes.ok || !subjectsRes.ok) {
          throw new Error('Failed to load options for selected school')
        }

        const gradesData = await gradesRes.json()
        const subjectsData = await subjectsRes.json()

        setGrades(gradesData)
        setSubjects(subjectsData)

        // Set default grade to GRD001
        setGrade('GRD001')
        setStudentId('')
        setStudentName('')
        setSubjectId('')
      } catch (err) {
        setError('Failed to load options: ' + err.message)
      } finally {
        setLoadingOptions(false)
      }
    }

    fetchOptions()
  }, [school])

  // Fetch students when grade changes
  useEffect(() => {
    if (!school || !grade) return

    const fetchStudents = async () => {
      try {
        setLoadingOptions(true)
        const studentsRes = await fetch(`${backendUrl}/students/${school}/${grade}`)

        if (!studentsRes.ok) {
          throw new Error('Failed to load students for selected grade')
        }

        const studentsData = await studentsRes.json()
        setStudents(studentsData)

        // Set default student and subject
        if (studentsData.length > 0) {
          setStudentId(studentsData[0].id)
          setStudentName(studentsData[0].name)
        }
        setSubjectId('')
      } catch (err) {
        setError('Failed to load students: ' + err.message)
      } finally {
        setLoadingOptions(false)
      }
    }

    fetchStudents()
  }, [school, grade])

  useEffect(() => {
    if (school && grade && studentId && !loadingOptions) {
      fetchAnalytics()
    }
  }, [school, grade, studentId, subjectId, loadingOptions])

  const handleRefresh = (event) => {
    event.preventDefault()
    fetchAnalytics()
  }

  return (
    <div className="performance-analytics">
      <div className="hero is-info is-medium">
        <div className="hero-body has-text-centered">
          <h1 className="title">Student Performance Analytics</h1>
          <p className="subtitle">Live metrics powered by MongoDB analytics</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <form onSubmit={handleRefresh} className="box">
            <div className="columns is-multiline">
              <div className="column is-3">
                <label className="label">School</label>
                <div className="select is-fullwidth">
                  <select value={school} onChange={(e) => setSchool(e.target.value)} disabled={loadingOptions}>
                    {schools.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="column is-3">
                <label className="label">Grade</label>
                <div className="select is-fullwidth">
                  <select value={grade} onChange={(e) => setGrade(e.target.value)} disabled={loadingOptions || !school}>
                    {grades.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="column is-3">
                <label className="label">Student ID</label>
                <div className="select is-fullwidth">
                  <select 
                    value={studentId} 
                    onChange={(e) => {
                      setStudentId(e.target.value)
                      const selectedStudent = students.find(s => s.id === e.target.value)
                      setStudentName(selectedStudent?.name || '')
                    }} 
                    disabled={loadingOptions || !school}
                  >
                    {students.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.name} ({student.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="column is-3">
                <label className="label">Subject</label>
                <div className="select is-fullwidth">
                  <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} disabled={loadingOptions || !school}>
                    <option value="">All Subjects</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="column is-2 is-flex is-align-items-flex-end">
                <button type="submit" className="button is-primary is-fullwidth">
                  Refresh
                </button>
              </div>
            </div>
          </form>

          {loadingOptions && (
            <div className="notification is-info">Loading dropdown options...</div>
          )}

          {loading && (
            <div className="notification is-info">Loading analytics data...</div>
          )}

          {error && (
            <div className="notification is-danger">{error}</div>
          )}

          {analytics && (
            <>
              {(!analytics.subjectPerformance || analytics.subjectPerformance.length === 0) &&
               (!analytics.gradeDistribution || analytics.gradeDistribution.every(item => item.value === 0)) &&
               (!analytics.monthlyTrend || analytics.monthlyTrend.length === 0) ? (
                <div className="notification is-warning">
                  <strong>No Data Available</strong><br/>
                  No assessment data found for the selected grade and subject/student. Please try selecting "Mathematics" or check if data exists in the database.
                </div>
              ) : (
                <>
                <div className="columns is-multiline mt-4">
                <div className="column is-3">
                  <div className="box has-text-centered">
                    <p className="heading">Student</p>
                    <p className="title">{students.find(s => s.id === studentId)?.name || studentName || 'N/A'}</p>
                  </div>
                </div>
                <div className="column is-3">
                  <div className="box has-text-centered">
                    <p className="heading">Grade</p>
                    <p className="title">{grade}</p>
                  </div>
                </div>
                <div className="column is-3">
                  <div className="box has-text-centered">
                    <p className="heading">Subject Charts</p>
                    <p className="title">{analytics.subjectPerformance?.length || 0}</p>
                  </div>
                </div>
                <div className="column is-3">
                  <div className="box has-text-centered">
                    <p className="heading">Assessment Sets</p>
                    <p className="title">{analytics.assessmentComparison?.length || 0}</p>
                  </div>
                </div>
              </div>

              <div className="columns is-multiline">
                <div className="column is-6">
                  <div className="box">
                    <h3 className="title is-5">Subject Performance Comparison</h3>
                    <ResponsiveContainer width="100%" height={340}>
                      <BarChart data={analytics.subjectPerformance || []} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="avgScore" fill="#3273dc" name="Average Score" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="column is-6">
                  <div className="box">
                    <h3 className="title is-5">Grade Distribution</h3>
                    <ResponsiveContainer width="100%" height={340}>
                      <PieChart>
                        <Pie
                          data={analytics.gradeDistribution || []}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          outerRadius={110}
                          innerRadius={55}
                          paddingAngle={3}
                          label={buildPieLabel}
                        >
                          {(analytics.gradeDistribution || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name, props) => [
                          value, 
                          `${props.payload.name} - ${props.payload.subjectBreakdown}`
                        ]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="columns is-multiline">
                <div className="column is-6">
                  <div className="box">
                    <h3 className="title is-5">Monthly Performance Trend</h3>
                    <ResponsiveContainer width="100%" height={340}>
                      <LineChart data={analytics.monthlyTrend || []} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke="#48c774" strokeWidth={3} name="Avg Score" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="column is-6">
                  <div className="box">
                    <h3 className="title is-5">Homework Submission Status</h3>
                    <ResponsiveContainer width="100%" height={340}>
                      <PieChart>
                        <Pie
                          data={analytics.homeworkStatus || []}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          outerRadius={110}
                          innerRadius={55}
                          paddingAngle={3}
                          label={buildPieLabel}
                        >
                          {(analytics.homeworkStatus || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name, props) => {
                          if (props.payload.subjectBreakdown) {
                            return [value, `${props.payload.name} - ${props.payload.subjectBreakdown}`]
                          }
                          return [value, props.payload.name]
                        }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="columns is-multiline">
                <div className="column is-6">
                  <div className="box">
                    <h3 className="title is-5">School vs Grade Average</h3>
                    <ResponsiveContainer width="100%" height={340}>
                      <LineChart data={analytics.schoolVsGrade || []} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#3273dc" strokeWidth={3} name="Average" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="column is-6">
                  <div className="box">
                    <h3 className="title is-5">Radar Skill Analysis</h3>
                    <ResponsiveContainer width="100%" height={340}>
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analytics.skillRadar || []}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar name="Skill" dataKey="value" stroke="#f14668" fill="#f14668" fillOpacity={0.4} />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="columns is-multiline">
                <div className="column is-12">
                  <div className="box">
                    <h3 className="title is-5">Assessment Comparison</h3>
                    <ResponsiveContainer width="100%" height={340}>
                      <BarChart data={analytics.assessmentComparison || []} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="averageScore" fill="#b86bff" name="Avg Score" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              </>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default StudentPerformanceAnalytics
