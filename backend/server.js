import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import {
  Student,
  Grade,
  Subject,
  ResultReport,
  HomeworkReport,
  Assessment
} from './models.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://rishi:Rishi121@cluster0.uaicufx.mongodb.net/mockDB?appName=Cluster0'
const PORT = process.env.PORT || 5000

// Connect to MongoDB with retry logic
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
      socketTimeoutMS: 45000,
      maxPoolSize: 10
    })
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('MongoDB connection error:', error.message)
    console.log('Please check your MongoDB Atlas connection:')
    console.log('1. Ensure your IP is whitelisted in Atlas')
    console.log('2. Verify the connection string is correct')
    console.log('3. Check if the cluster is running')
    process.exit(1)
  }
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const average = (arr) => arr.length ? arr.reduce((sum, value) => sum + value, 0) / arr.length : 0

const buildDistribution = (scores = []) => {
  const categories = [
    { name: 'A (90-100)', min: 90, max: 100, value: 0, color: '#48c774' },
    { name: 'B (80-89)', min: 80, max: 89, value: 0, color: '#3273dc' },
    { name: 'C (70-79)', min: 70, max: 79, value: 0, color: '#b86bff' },
    { name: 'D (60-69)', min: 60, max: 69, value: 0, color: '#ffdd57' },
    { name: 'F (<60)', min: 0, max: 59, value: 0, color: '#f14668' }
  ]

  scores.forEach((score) => {
    const category = categories.find((item) => score >= item.min && score <= item.max)
    if (category) category.value += 1
  })

  return categories.map((item) => ({
    name: item.name,
    value: item.value,
    color: item.color
  }))
}

const buildRadarData = (value = 0) => {
  const baseline = Math.round(value)
  const categories = [
    { subject: 'Concepts', value: Math.min(100, Math.max(20, baseline + 4)) },
    { subject: 'Application', value: Math.min(100, Math.max(20, baseline - 2)) },
    { subject: 'Accuracy', value: Math.min(100, Math.max(20, baseline + 1)) },
    { subject: 'Speed', value: Math.min(100, Math.max(20, baseline - 6)) },
    { subject: 'Retention', value: Math.min(100, Math.max(20, baseline - 1)) }
  ]

  return categories
}

const normalizeMonth = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${monthNames[d.getMonth()]} ${d.getFullYear()}`
}

const buildMonthlyTrend = (reports = []) => {
  const grouped = {}

  reports.forEach((report) => {
    const monthKey = normalizeMonth(report.createdAt || report.updatedAt || report.createdAt)
    if (!monthKey) return
    if (!grouped[monthKey]) grouped[monthKey] = []
    grouped[monthKey].push(report.result || 0)
  })

  return Object.entries(grouped)
    .map(([month, values]) => ({ month, value: Math.round(average(values) * 100) / 100 }))
    .sort((a, b) => monthNames.indexOf(a.month.split(' ')[0]) - monthNames.indexOf(b.month.split(' ')[0]))
}

app.get('/grades', async (req, res) => {
  try {
    const grades = await Grade.find({}, 'gradeId').sort({ gradeId: 1 })
    res.json(grades.map(g => g.gradeId))
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/subjects', async (req, res) => {
  try {
    const subjects = await Subject.find({}, 'subjectId subjectName').sort({ subjectName: 1 })
    res.json(subjects.map(s => ({ id: s.subjectId, name: s.subjectName })))
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/students', async (req, res) => {
  try {
    const students = await Student.find({}, 'studentId name').sort({ name: 1 })
    res.json(students.map(s => ({ id: s.studentId, name: s.name })))
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/SPA/:grade/past_performance/:identifier', async (req, res) => {
  try {
    const { grade, identifier } = req.params
    const { type } = req.query

    const gradeDoc = await Grade.findOne({ gradeId: grade })
    if (!gradeDoc) {
      return res.status(404).json({ message: 'Grade not found' })
    }

    const studentPromise = type === 'subject' ? null : Student.findOne({ studentId: identifier })
    const subjectPromise = type === 'student' ? null : Subject.findOne({
      $or: [
        { subjectId: identifier },
        { subjectName: new RegExp(`^${identifier}$`, 'i') }
      ]
    })

    const [student, subject] = await Promise.all([studentPromise, subjectPromise])
    let mode = null

    if (type === 'student') {
      if (!student) return res.status(404).json({ message: 'Student not found' })
      mode = 'student'
    } else if (type === 'subject') {
      if (!subject) return res.status(404).json({ message: 'Subject not found' })
      mode = 'subject'
    } else {
      if (student) mode = 'student'
      else if (subject) mode = 'subject'
      else return res.status(404).json({ message: 'Subject or student not found' })
    }

    const gradeReports = await ResultReport.find({ grade: gradeDoc._id }).populate('subjectId studentId')
    const schoolReports = await ResultReport.find({}).populate('subjectId studentId')

    const subjectReports = subject
      ? gradeReports.filter((report) => report.subjectId?._id?.toString() === subject._id.toString())
      : []

    const studentReports = student
      ? gradeReports.filter((report) => report.studentId?._id?.toString() === student._id.toString())
      : []

    const subjectPerformance = []
    const gradeDistribution = []
    const monthlyTrend = []
    const homeworkStatus = []
    const schoolVsGrade = []
    const skillRadar = []
    const assessmentComparison = []

    if (mode === 'subject') {
      const allSubjects = [...new Map(gradeReports.map((item) => [item.subjectId?._id?.toString(), item.subjectId])).values()].filter(Boolean)
      const subjectAverages = allSubjects.map((item) => {
        const reports = gradeReports.filter((report) => report.subjectId?._id?.toString() === item._id.toString())
        return {
          name: item.subjectName,
          avgScore: Math.round(average(reports.map((report) => report.result || 0)) * 100) / 100
        }
      })

      subjectPerformance.push(...subjectAverages)

      const subjectAvg = subjectReports.length > 0 ? Math.round(average(subjectReports.map((report) => report.result || 0)) * 100) / 100 : 0
      gradeDistribution.push(...buildDistribution(subjectReports.length > 0 ? subjectReports.map((report) => report.result || 0) : []))
      monthlyTrend.push(...buildMonthlyTrend(subjectReports))

      const homeworkReports = await HomeworkReport.find({ grade: gradeDoc._id, subject: subject._id })
      const aggregatedHomework = homeworkReports.reduce(
        (acc, item) => {
          acc.submitted += item.submittedCount || 0
          acc.pending += item.pendingCount || 0
          return acc
        },
        { submitted: 0, pending: 0 }
      )

      homeworkStatus.push(
        { name: 'Submitted', value: aggregatedHomework.submitted, color: '#48c774' },
        { name: 'Pending', value: aggregatedHomework.pending, color: '#ffdd57' }
      )

      const gradeAvg = Math.round(average(gradeReports.map((report) => report.result || 0)) * 100) / 100
      const schoolAvg = Math.round(average(schoolReports.map((report) => report.result || 0)) * 100) / 100
      schoolVsGrade.push({ name: 'School Average', value: schoolAvg }, { name: 'Grade Average', value: gradeAvg })

      skillRadar.push(...buildRadarData(subjectAvg))

      const assessmentGroups = new Map()
      subjectReports.forEach((report) => {
        if (!report.assessmentId) return
        const key = report.assessmentId.toString()
        const existing = assessmentGroups.get(key) || { count: 0, total: 0, assessmentId: report.assessmentId }
        existing.count += 1
        existing.total += report.result || 0
        assessmentGroups.set(key, existing)
      })

      for (const { assessmentId, count, total } of assessmentGroups.values()) {
        const assessment = await Assessment.findById(assessmentId)
        assessmentComparison.push({
          name: assessment?.testNo || 'Assessment',
          averageScore: Math.round((total / count) * 100) / 100
        })
      }
    } else {
      const subjectsInGrade = [...new Map(gradeReports.map((item) => [item.subjectId?._id?.toString(), item.subjectId])).values()].filter(Boolean)
      const studentSubjectScores = subjectsInGrade.map((subjectItem) => {
        const report = studentReports.find((item) => item.subjectId?._id?.toString() === subjectItem._id.toString())
        return {
          name: subjectItem.subjectName,
          avgScore: report?.result || 0
        }
      })

      subjectPerformance.push(...studentSubjectScores)
      gradeDistribution.push(...buildDistribution(studentReports.map((report) => report.result || 0)))
      monthlyTrend.push(...buildMonthlyTrend(studentReports))

      const homeworkReports = await HomeworkReport.find({ grade: gradeDoc._id }).populate('subject')
      const homeworkForStudent = homeworkReports.reduce(
        (acc, item) => {
          acc.submitted += item.submittedCount || 0
          acc.pending += item.pendingCount || 0
          return acc
        },
        { submitted: 0, pending: 0 }
      )

      homeworkStatus.push(
        { name: 'Submitted', value: homeworkForStudent.submitted, color: '#48c774' },
        { name: 'Pending', value: homeworkForStudent.pending, color: '#ffdd57' }
      )

      const gradeAvg = Math.round(average(gradeReports.map((report) => report.result || 0)) * 100) / 100
      const schoolAvg = Math.round(average(schoolReports.map((report) => report.result || 0)) * 100) / 100
      schoolVsGrade.push({ name: 'School Average', value: schoolAvg }, { name: 'Grade Average', value: gradeAvg })

      const studentAvg = Math.round(average(studentReports.map((report) => report.result || 0)) * 100) / 100
      skillRadar.push(...buildRadarData(studentAvg))

      const assessmentGroups = new Map()
      studentReports.forEach((report) => {
        if (!report.assessmentId) return
        const key = report.assessmentId.toString()
        const existing = assessmentGroups.get(key) || { count: 0, total: 0, assessmentId: report.assessmentId }
        existing.count += 1
        existing.total += report.result || 0
        assessmentGroups.set(key, existing)
      })

      for (const { assessmentId, count, total } of assessmentGroups.values()) {
        const assessment = await Assessment.findById(assessmentId)
        assessmentComparison.push({
          name: assessment?.testNo || 'Assessment',
          averageScore: Math.round((total / count) * 100) / 100
        })
      }
    }

    return res.json({
      grade: gradeDoc.gradeId,
      mode,
      identifier,
      subject: subject ? {
        subjectId: subject.subjectId,
        subjectName: subject.subjectName
      } : null,
      student: student ? {
        studentId: student.studentId,
        name: student.name
      } : null,
      analytics: {
        subjectPerformance,
        gradeDistribution,
        monthlyTrend,
        homeworkStatus,
        schoolVsGrade,
        skillRadar,
        assessmentComparison
      }
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Start server after connecting to DB
const startServer = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`Student Performance Analytics backend running on http://localhost:${PORT}`)
  })
}

startServer()
