import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts'

const COLORS = ['#3273dc', '#48c774', '#ffdd57', '#f14668', '#b86bff', '#f14668']

const CPAView = () => {
  const [analyticsData, setAnalyticsData] = useState([])
  const [studentPerformance, setStudentPerformance] = useState([])
  const [subjectPerformance, setSubjectPerformance] = useState([])
  const [monthlyTrend, setMonthlyTrend] = useState([])
  const [homeworkOverview, setHomeworkOverview] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const mockClassAnalytics = [
      { classAnalyticsId: 'CAN001', gradeId: 'GRD001', subjectName: 'Mathematics', moduleName: 'Introduction to Algebra', studentCount: 45, avgScore: 78, topScore: 95, passRate: 85 },
      { classAnalyticsId: 'CAN002', gradeId: 'GRD001', subjectName: 'Physics', moduleName: "Newton's Laws", studentCount: 42, avgScore: 72, topScore: 92, passRate: 78 },
      { classAnalyticsId: 'CAN003', gradeId: 'GRD002', subjectName: 'Chemistry', moduleName: 'Chemical Reactions', studentCount: 38, avgScore: 81, topScore: 98, passRate: 88 },
      { classAnalyticsId: 'CAN004', gradeId: 'GRD001', subjectName: 'English', moduleName: 'Grammar Basics', studentCount: 45, avgScore: 76, topScore: 90, passRate: 82 },
      { classAnalyticsId: 'CAN005', gradeId: 'GRD002', subjectName: 'Mathematics', moduleName: 'Quadratic Equations', studentCount: 40, avgScore: 69, topScore: 88, passRate: 75 }
    ]

    const mockStudentPerformance = [
      { name: 'Arjun Mehta', rollNo: '101', math: 85, physics: 78, chemistry: 82, english: 88, avg: 83.25 },
      { name: 'Priya Patel', rollNo: '102', math: 92, physics: 85, chemistry: 79, english: 91, avg: 86.75 },
      { name: 'Rahul Singh', rollNo: '103', math: 78, physics: 88, chemistry: 85, english: 75, avg: 81.5 },
      { name: 'Sneha Gupta', rollNo: '104', math: 88, physics: 92, chemistry: 90, english: 84, avg: 88.5 },
      { name: 'Vikram Nair', rollNo: '105', math: 72, physics: 75, chemistry: 68, english: 80, avg: 73.75 },
      { name: 'Ananya Reddy', rollNo: '106', math: 95, physics: 89, chemistry: 94, english: 92, avg: 92.5 }
    ]

    const mockSubjectPerformance = [
      { name: 'Mathematics', value: 78, excellent: 15, good: 25, average: 35, poor: 5 },
      { name: 'Physics', value: 72, excellent: 12, good: 20, average: 38, poor: 10 },
      { name: 'Chemistry', value: 81, excellent: 18, good: 28, average: 30, poor: 4 },
      { name: 'English', value: 76, excellent: 14, good: 22, average: 36, poor: 8 },
      { name: 'Biology', value: 84, excellent: 20, good: 30, average: 25, poor: 5 }
    ]

    const mockMonthlyTrend = [
      { month: 'Jan', math: 72, physics: 68, chemistry: 75, english: 70 },
      { month: 'Feb', math: 75, physics: 71, chemistry: 78, english: 73 },
      { month: 'Mar', math: 78, physics: 74, chemistry: 80, english: 75 },
      { month: 'Apr', math: 82, physics: 78, chemistry: 83, english: 78 },
      { month: 'May', math: 85, physics: 80, chemistry: 86, english: 82 },
      { month: 'Jun', math: 88, physics: 83, chemistry: 89, english: 85 }
    ]

    const mockHomeworkOverview = [
      { name: 'Submitted', value: 75, color: '#48c774' },
      { name: 'Pending', value: 15, color: '#ffdd57' },
      { name: 'Late', value: 8, color: '#f14668' },
      { name: 'Not Submitted', value: 2, color: '#7a7d85' }
    ]

    setAnalyticsData(mockClassAnalytics)
    setStudentPerformance(mockStudentPerformance)
    setSubjectPerformance(mockSubjectPerformance)
    setMonthlyTrend(mockMonthlyTrend)
    setHomeworkOverview(mockHomeworkOverview)
    setLoading(false)
  }, [])

  const getGradeDistribution = () => {
    return [
      { name: 'A (90-100)', value: 15, color: '#48c774' },
      { name: 'B (80-89)', value: 28, color: '#3273dc' },
      { name: 'C (70-79)', value: 32, color: '#b86bff' },
      { name: 'D (60-69)', value: 18, color: '#ffdd57' },
      { name: 'F (<60)', value: 7, color: '#f14668' }
    ]
  }

  const getPerformanceTrend = () => {
    return [
      { week: 'Week 1', avgScore: 72, classAvg: 70 },
      { week: 'Week 2', avgScore: 75, classAvg: 73 },
      { week: 'Week 3', avgScore: 78, classAvg: 75 },
      { week: 'Week 4', avgScore: 82, classAvg: 78 },
      { week: 'Week 5', avgScore: 85, classAvg: 80 },
      { week: 'Week 6', avgScore: 88, classAvg: 82 }
    ]
  }

  const getScoreTagClass = (score) => {
    if (score >= 90) return 'is-success'
    if (score >= 75) return 'is-warning'
    return 'is-danger'
  }

  const gradeDistData = getGradeDistribution()
  const perfTrendData = getPerformanceTrend()

  if (loading) {
    return (
      <div className="performance-analytics">
        <div className="hero is-info is-medium">
          <div className="hero-body has-text-centered">
            <h1 className="title">Class Performance & Analytics</h1>
          </div>
        </div>
        <section className="section has-text-centered">
          <p className="has-text-grey">Loading analytics...</p>
        </section>
      </div>
    )
  }

  return (
    <div className="performance-analytics">
      <div className="hero is-info is-medium">
        <div className="hero-body has-text-centered">
          <h1 className="title">Class Performance & Analytics</h1>
          <p className="subtitle">Comprehensive insights into student performance</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="columns is-multiline">
            <div className="column is-3">
              <div className="box has-text-centered">
                <p className="heading">Total Students</p>
                <p className="title">245</p>
                <p className="subtitle is-7">+12 this month</p>
              </div>
            </div>
            <div className="column is-3">
              <div className="box has-text-centered">
                <p className="heading">Average Score</p>
                <p className="title">78.5%</p>
                <p className="subtitle is-7">+5.2% improvement</p>
              </div>
            </div>
            <div className="column is-3">
              <div className="box has-text-centered">
                <p className="heading">Pass Rate</p>
                <p className="title">82%</p>
                <p className="subtitle is-7">+3% from last month</p>
              </div>
            </div>
            <div className="column is-3">
              <div className="box has-text-centered">
                <p className="heading">Assessments</p>
                <p className="title">156</p>
                <p className="subtitle is-7">This semester</p>
              </div>
            </div>
          </div>

          <div className="columns is-multiline mt-4">
            <div className="column is-6">
              <div className="box">
                <h3 className="title is-5">Subject Performance Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={subjectPerformance} layout="vertical" margin={{ top: 20, right: 30, left: 80, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis type="category" dataKey="name" width={80} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3273dc" radius={[0, 4, 4, 0]} name="Avg Score %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="column is-6">
              <div className="box">
                <h3 className="title is-5">Grade Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={gradeDistData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {gradeDistData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="columns is-multiline mt-4">
            <div className="column is-12">
              <div className="box">
                <h3 className="title is-5">Monthly Performance Trend by Subject</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={monthlyTrend} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[60, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="math" stroke="#3273dc" strokeWidth={3} dot={{ r: 5 }} name="Mathematics" />
                    <Line type="monotone" dataKey="physics" stroke="#48c774" strokeWidth={3} dot={{ r: 5 }} name="Physics" />
                    <Line type="monotone" dataKey="chemistry" stroke="#ffdd57" strokeWidth={3} dot={{ r: 5 }} name="Chemistry" />
                    <Line type="monotone" dataKey="english" stroke="#b86bff" strokeWidth={3} dot={{ r: 5 }} name="English" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="columns is-multiline mt-4">
            <div className="column is-6">
              <div className="box">
                <h3 className="title is-5">Homework Submission Status</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={homeworkOverview}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {homeworkOverview.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="column is-6">
              <div className="box">
                <h3 className="title is-5">Performance Trend</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={perfTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis domain={[60, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="avgScore" stroke="#3273dc" strokeWidth={3} dot={{ r: 5 }} name="Class Average" />
                    <Line type="monotone" dataKey="classAvg" stroke="#b86bff" strokeWidth={3} dot={{ r: 5 }} name="School Average" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="columns is-multiline mt-4">
            <div className="column is-12">
              <div className="box">
                <h3 className="title is-5">Top Performing Students</h3>
                <table className="table is-fullwidth is-hoverable is-striped">
                  <thead>
                    <tr>
                      <th>Roll No</th>
                      <th>Student Name</th>
                      <th>Mathematics</th>
                      <th>Physics</th>
                      <th>Chemistry</th>
                      <th>English</th>
                      <th>Average</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentPerformance.slice(0, 6).map((student, index) => (
                      <tr key={index}>
                        <td>{student.rollNo}</td>
                        <td>{student.name}</td>
                        <td><span className={`tag ${getScoreTagClass(student.math)}`}>{student.math}%</span></td>
                        <td><span className={`tag ${getScoreTagClass(student.physics)}`}>{student.physics}%</span></td>
                        <td><span className={`tag ${getScoreTagClass(student.chemistry)}`}>{student.chemistry}%</span></td>
                        <td><span className={`tag ${getScoreTagClass(student.english)}`}>{student.english}%</span></td>
                        <td><strong>{student.avg}%</strong></td>
                        <td>
                          <span className="tag is-primary">
                            {student.avg >= 85 ? 'Excellent' : student.avg >= 75 ? 'Good' : 'Needs'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="columns is-multiline mt-4">
            <div className="column is-12">
              <div className="box">
                <h3 className="title is-5">Subject-wise Performance Breakdown</h3>
                <div className="columns is-multiline">
                  {subjectPerformance.map((subject, index) => (
                    <div className="column is-4" key={index}>
                      <div className="box" style={{ borderTop: `4px solid ${COLORS[index % COLORS.length]}` }}>
                        <h4 className="title is-6">{subject.name}</h4>
                        <div className="level">
                          <div className="level-item has-text-centered">
                            <div>
                              <p className="heading">Average</p>
                              <p className="title">{subject.value}%</p>
                            </div>
                          </div>
                        </div>
                        <div className="content">
                          <ul>
                            <li>Excellent (90+): <strong>{subject.excellent}</strong> students</li>
                            <li>Good (80-89): <strong>{subject.good}</strong> students</li>
                            <li>Average (70-79): <strong>{subject.average}</strong> students</li>
                            <li>Below Average: <strong>{subject.poor}</strong> students</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CPAView