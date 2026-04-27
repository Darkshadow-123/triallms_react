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

const buildPieLabel = ({ name, value }) => `${name}: ${value}`

const StudentPerformanceAnalytics = () => {
  const [grade, setGrade] = useState('')
  const [identifier, setIdentifier] = useState('')
  const [mode, setMode] = useState('subject')
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [grades, setGrades] = useState([])
  const [subjects, setSubjects] = useState([])
  const [students, setStudents] = useState([])
  const [loadingOptions, setLoadingOptions] = useState(true)

  const backendUrl = 'http://127.0.0.1:5000'

  const fetchAnalytics = async () => {
    setLoading(true)
    setError(null)
    setAnalytics(null)

    try {
      const params = new URLSearchParams({ type: mode })
      const url = `${backendUrl}/SPA/${grade}/past_performance/${encodeURIComponent(identifier)}?${params}`
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

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [gradesRes, subjectsRes, studentsRes] = await Promise.all([
          fetch(`${backendUrl}/grades`),
          fetch(`${backendUrl}/subjects`),
          fetch(`${backendUrl}/students`)
        ])

        if (!gradesRes.ok || !subjectsRes.ok || !studentsRes.ok) {
          throw new Error('Failed to load options')
        }

        const gradesData = await gradesRes.json()
        const subjectsData = await subjectsRes.json()
        const studentsData = await studentsRes.json()

        setGrades(gradesData)
        setSubjects(subjectsData)
        setStudents(studentsData)

        // Set defaults
        if (gradesData.length > 0) setGrade(gradesData[0])
        if (subjectsData.length > 0) setIdentifier(subjectsData[0].id)
      } catch (err) {
        setError('Failed to load dropdown options: ' + err.message)
      } finally {
        setLoadingOptions(false)
      }
    }

    fetchOptions()
  }, [])

  useEffect(() => {
    // Update identifier when mode changes
    if (mode === 'subject' && subjects.length > 0) {
      setIdentifier(subjects[0].id)
    } else if (mode === 'student' && students.length > 0) {
      setIdentifier(students[0].id)
    }
  }, [mode, subjects, students])

  useEffect(() => {
    if (grade && identifier && !loadingOptions) {
      fetchAnalytics()
    }
  }, [grade, identifier, mode, loadingOptions])

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
                <label className="label">Grade</label>
                <div className="select is-fullwidth">
                  <select value={grade} onChange={(e) => setGrade(e.target.value)} disabled={loadingOptions}>
                    {grades.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="column is-3">
                <label className="label">Mode</label>
                <div className="select is-fullwidth">
                  <select value={mode} onChange={(e) => setMode(e.target.value)} disabled={loadingOptions}>
                    <option value="subject">Subject</option>
                    <option value="student">Student ID</option>
                  </select>
                </div>
              </div>

              <div className="column is-4">
                <label className="label">{mode === 'subject' ? 'Subject' : 'Student'}</label>
                <div className="select is-fullwidth">
                  <select value={identifier} onChange={(e) => setIdentifier(e.target.value)} disabled={loadingOptions}>
                    {(mode === 'subject' ? subjects : students).map(item => (
                      <option key={item.id} value={item.id}>
                        {mode === 'subject' ? item.name : `${item.name} (${item.id})`}
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
                    <p className="heading">Analytics Mode</p>
                    <p className="title">{mode === 'subject' ? 'Subject' : 'Student'}</p>
                    <p className="subtitle is-7">{identifier}</p>
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
                            <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
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
                        <Tooltip />
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
