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

const ClassPerformanceAnalytics = () => {
  const [school, setSchool] = useState('')
  const [grade, setGrade] = useState('')
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [schools, setSchools] = useState([])
  const [grades, setGrades] = useState([])
  const [loadingOptions, setLoadingOptions] = useState(true)
  const [selectedSubject, setSelectedSubject] = useState('')
  const [availableSubjects, setAvailableSubjects] = useState([])

  const backendUrl = 'http://127.0.0.1:5002'

  const fetchAnalytics = async () => {
    setLoading(true)
    setError(null)
    setAnalytics(null)

    try {
      const url = `${backendUrl}/CPA/${school}/${grade}/class_analytics`
      const response = await fetch(url)
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.message || 'Unable to load class analytics')
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
        }
        setLoadingOptions(false)
      } catch (err) {
        setError('Failed to load schools: ' + err.message)
        setLoadingOptions(false)
      }
    }

    fetchSchools()
  }, [])

  // Fetch grades when school changes
  useEffect(() => {
    if (!school) return

    const fetchOptions = async () => {
      try {
        setLoadingOptions(true)
        const gradesRes = await fetch(`${backendUrl}/grades/${school}`)

        if (!gradesRes.ok) {
          throw new Error('Failed to load grades for selected school')
        }

        const gradesData = await gradesRes.json()
        setGrades(gradesData)

        // Set default grade to GRD001
        setGrade('GRD001')
      } catch (err) {
        setError('Failed to load grades: ' + err.message)
      } finally {
        setLoadingOptions(false)
      }
    }

    fetchOptions()
  }, [school])

  useEffect(() => {
    if (school && grade && !loadingOptions) {
      fetchAnalytics()
    }
  }, [school, grade, loadingOptions])

  // Update available subjects when analytics changes
  useEffect(() => {
    if (analytics && analytics.bestPerformingStudents) {
      const subjects = Object.keys(analytics.bestPerformingStudents)
      setAvailableSubjects(subjects)
      if (subjects.length > 0) {
        setSelectedSubject(subjects[0])
      }
    }
  }, [analytics])

  const handleRefresh = (event) => {
    event.preventDefault()
    fetchAnalytics()
  }

  return (
    <div className="performance-analytics">
      <div className="hero is-info is-medium">
        <div className="hero-body has-text-centered">
          <h1 className="title">Class Performance Analytics</h1>
          <p className="subtitle">Aggregated metrics for all students in the grade</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <form onSubmit={handleRefresh} className="box">
            <div className="columns is-multiline">
              <div className="column is-4">
                <label className="label">School</label>
                <div className="select is-fullwidth">
                  <select value={school} onChange={(e) => setSchool(e.target.value)} disabled={loadingOptions}>
                    {schools.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="column is-4">
                <label className="label">Grade</label>
                <div className="select is-fullwidth">
                  <select value={grade} onChange={(e) => setGrade(e.target.value)} disabled={loadingOptions || !school}>
                    {grades.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="column is-4 is-flex is-align-items-flex-end">
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
            <div className="notification is-info">Loading class analytics data...</div>
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
                  No assessment data found for the selected grade. Please check if data exists in the database.
                </div>
              ) : (
                <>
                <div className="columns is-multiline mt-4">
                <div className="column is-3">
                  <div className="box has-text-centered">
                    <p className="heading">Grade</p>
                    <p className="title">{grade}</p>
                  </div>
                </div>
                <div className="column is-3">
                  <div className="box has-text-centered">
                    <p className="heading">Total Students</p>
                    <p className="title">{analytics.totalStudents || 0}</p>
                  </div>
                </div>
                <div className="column is-3">
                  <div className="box has-text-centered">
                    <p className="heading">Subjects</p>
                    <p className="title">{analytics.subjectPerformance?.length || 0}</p>
                  </div>
                </div>
                <div className="column is-3">
                  <div className="box has-text-centered">
                    <p className="heading">Class Average</p>
                    <p className="title">{analytics.classAverage || 0}%</p>
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
                    <h3 className="title is-5">Student Performance Distribution</h3>
                    <ResponsiveContainer width="100%" height={340}>
                      <BarChart data={analytics.studentPerformanceDistribution || []} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#b86bff" name="Student Count" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="column is-6">
                  <div className="box">
                    <h3 className="title is-5">Class Skill Analysis</h3>
                    <ResponsiveContainer width="100%" height={340}>
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analytics.skillRadar || []}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar name="Class Skill" dataKey="value" stroke="#f14668" fill="#f14668" fillOpacity={0.4} />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div className="notification is-info">
              {analytics.bestPerformingStudents && Object.keys(analytics.bestPerformingStudents).length > 0 && (
                <>
                  <div className="box mt-5">
                    <h3 className="title is-4">Student Performance by Subject</h3>
                    <div className="field is-grouped is-grouped-multiline">
                      <div className="control">
                        <label className="label">Select Subject:</label>
                      </div>
                      {availableSubjects.map((subject) => (
                        <div className="control" key={subject}>
                          <button
                            className={`button ${selectedSubject === subject ? 'is-info' : 'is-light'}`}
                            onClick={() => setSelectedSubject(subject)}
                          >
                            {subject}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <h3 className="title is-4 mt-5">Best Performing Students - {selectedSubject}</h3>
                  <div className="columns is-multiline">
                    {selectedSubject && analytics.bestPerformingStudents[selectedSubject] && (
                      <div className="column is-12">
                        <div className="box">
                          <ResponsiveContainer width="100%" height={340}>
                            <BarChart 
                              data={analytics.bestPerformingStudents[selectedSubject] || []} 
                              margin={{ top: 20, right: 20, left: 0, bottom: 60 }}
                              layout="vertical"
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis type="number" domain={[0, 100]} />
                              <YAxis type="category" dataKey="studentName" width={150} />
                              <Tooltip />
                              <Bar dataKey="score" fill="#48c774" name="Score" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {analytics.leastPerformingStudents && Object.keys(analytics.leastPerformingStudents).length > 0 && (
                <>
                  <h3 className="title is-4 mt-5">Least Performing Students - {selectedSubject}</h3>
                  <div className="columns is-multiline">
                    {selectedSubject && analytics.leastPerformingStudents[selectedSubject] && (
                      <div className="column is-12">
                        <div className="box">
                          <ResponsiveContainer width="100%" height={340}>
                            <BarChart 
                              data={analytics.leastPerformingStudents[selectedSubject] || []} 
                              margin={{ top: 20, right: 20, left: 0, bottom: 60 }}
                              layout="vertical"
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis type="number" domain={[0, 100]} />
                              <YAxis type="category" dataKey="studentName" width={150} />
                              <Tooltip />
                              <Bar dataKey="score" fill="#f14668" name="Score" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
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
              </div>              </>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default ClassPerformanceAnalytics
