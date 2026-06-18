import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import {
  School,
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

const MONGO_URI = process.env.MONGO_URI
const PORT = 5002  // Class Analytics server always runs on 5002

// Connect to MongoDB with retry logic
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
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

const buildDistributionWithSubjects = (reports = []) => {
  const categories = [
    { name: 'A (90-100)', min: 90, max: 100, color: '#48c774', subjects: {} },
    { name: 'B (80-89)', min: 80, max: 89, color: '#3273dc', subjects: {} },
    { name: 'C (70-79)', min: 70, max: 79, color: '#b86bff', subjects: {} },
    { name: 'D (60-69)', min: 60, max: 69, color: '#ffdd57', subjects: {} },
    { name: 'F (<60)', min: 0, max: 59, color: '#f14668', subjects: {} }
  ]

  reports.forEach((report) => {
    const score = report.result || 0
    const category = categories.find((item) => score >= item.min && score <= item.max)
    if (category) {
      const subjectName = report.subjectName || 'Unknown'
      category.subjects[subjectName] = (category.subjects[subjectName] || 0) + 1
    }
  })

  return categories
    .filter((cat) => Object.keys(cat.subjects).length > 0)
    .map((item) => {
      const subjectList = Object.entries(item.subjects)
        .map(([subject, count]) => `${subject}(${count})`)
        .join(', ')
      return {
        name: item.name,
        value: Object.values(item.subjects).reduce((sum, val) => sum + val, 0),
        subjectBreakdown: subjectList,
        color: item.color
      }
    })
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

const buildHomeworkStatusBySubject = (homeworkReports = [], subjectMap = new Map()) => {
  const statuses = [
    { name: 'Submitted', color: '#48c774', subjects: {} },
    { name: 'Pending', color: '#ffdd57', subjects: {} }
  ]

  homeworkReports.forEach((report) => {
    const subjectName = subjectMap.get(report.subject) || report.subject || 'Unknown'
    
    if (report.submittedCount > 0) {
      const submitted = statuses[0]
      submitted.subjects[subjectName] = (submitted.subjects[subjectName] || 0) + report.submittedCount
    }
    
    if (report.pendingCount > 0) {
      const pending = statuses[1]
      pending.subjects[subjectName] = (pending.subjects[subjectName] || 0) + report.pendingCount
    }
  })

  return statuses
    .filter((status) => Object.keys(status.subjects).length > 0)
    .map((item) => {
      const subjectList = Object.entries(item.subjects)
        .map(([subject, count]) => `${subject}(${count})`)
        .join(', ')
      return {
        name: item.name,
        value: Object.values(item.subjects).reduce((sum, val) => sum + val, 0),
        subjectBreakdown: subjectList,
        color: item.color
      }
    })
}

const getSubjectCombination = (subjectNames = []) => {
  const normalizedSubjects = new Set(
    subjectNames.map(s => s.toLowerCase().trim())
  )
  
  const hasMath = normalizedSubjects.has('mathematics') || normalizedSubjects.has('math')
  const hasPhysics = normalizedSubjects.has('physics')
  const hasChemistry = normalizedSubjects.has('chemistry')
  const hasBiology = normalizedSubjects.has('biology')
  const hasEnglish = normalizedSubjects.has('english')

  if (hasMath && hasPhysics && hasChemistry && hasEnglish) {
    return 'pcm-english'
  } else if (hasMath && hasChemistry && hasBiology && hasEnglish) {
    return 'pcb-maths-english'
  }
  return 'default'
}

const buildDynamicRadarData = (subjectScores = {}, combination = 'default') => {
  const clamp = (val) => Math.min(100, Math.max(20, Math.round(val)))
  
  if (combination === 'pcm-english') {
    const mathScore = subjectScores['Mathematics'] || subjectScores['Math'] || 0
    const physicsScore = subjectScores['Physics'] || 0
    const chemistryScore = subjectScores['Chemistry'] || 0
    const englishScore = subjectScores['English'] || 0

    return [
      { subject: 'Logical Reasoning', value: clamp((mathScore + physicsScore) / 2) },
      { subject: 'Analytical Thinking', value: clamp((mathScore + physicsScore) / 2 - 2) },
      { subject: 'Problem Solving', value: clamp((physicsScore + chemistryScore) / 2 + 3) },
      { subject: 'Scientific Understanding', value: clamp((physicsScore + chemistryScore) / 2) },
      { subject: 'Communication Skills', value: clamp(englishScore - 5) }
    ]
  } else if (combination === 'pcb-maths-english') {
    const mathScore = subjectScores['Mathematics'] || subjectScores['Math'] || 0
    const chemistryScore = subjectScores['Chemistry'] || 0
    const biologyScore = subjectScores['Biology'] || 0
    const englishScore = subjectScores['English'] || 0

    return [
      { subject: 'Analytical Thinking', value: clamp((mathScore + chemistryScore) / 2) },
      { subject: 'Scientific Understanding', value: clamp((chemistryScore + biologyScore) / 2) },
      { subject: 'Conceptual Clarity', value: clamp((biologyScore + chemistryScore) / 2 - 1) },
      { subject: 'Memory & Observation', value: clamp(biologyScore + 2) },
      { subject: 'Communication Skills', value: clamp(englishScore - 5) }
    ]
  } else {
    const avgScore = Object.values(subjectScores).reduce((a, b) => a + b, 0) / Math.max(1, Object.keys(subjectScores).length)
    const baseline = Math.round(avgScore)
    
    return [
      { subject: 'Logical Reasoning', value: clamp(baseline + 4) },
      { subject: 'Analytical Thinking', value: clamp(baseline - 2) },
      { subject: 'Problem Solving', value: clamp(baseline + 1) },
      { subject: 'Scientific Understanding', value: clamp(baseline - 3) },
      { subject: 'Communication Skills', value: clamp(baseline - 5) }
    ]
  }
}

// Endpoints for getting dropdown data
app.get('/schools', async (req, res) => {
  try {
    const schools = await School.find({}, 'schoolId').sort({ schoolId: 1 })
    res.json(schools.map(s => s.schoolId))
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/grades/:schoolId', async (req, res) => {
  try {
    const { schoolId } = req.params
    const grades = await Grade.find({ schools: schoolId }, 'gradeId').sort({ gradeId: 1 })
    res.json(grades.map(g => g.gradeId))
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/subjects/:schoolId', async (req, res) => {
  try {
    const { schoolId } = req.params
    const gradesForSchool = await Grade.find({ schools: schoolId }, 'subjects').lean()
    
    const subjectIds = new Set()
    gradesForSchool.forEach(grade => {
      if (grade.subjects && Array.isArray(grade.subjects)) {
        grade.subjects.forEach(subId => subjectIds.add(subId))
      }
    })
    
    const subjects = await Subject.find({ 
      subjectId: { $in: Array.from(subjectIds) } 
    }, 'subjectId subjectName').sort({ subjectName: 1 })
    
    res.json(subjects.map(s => ({ id: s.subjectId, name: s.subjectName })))
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Class Performance Analytics endpoint
app.get('/CPA/:school/:grade/class_analytics', async (req, res) => {
  try {
    const { school, grade } = req.params

    const gradeDoc = await Grade.findOne({ gradeId: grade, schools: school })
    if (!gradeDoc) {
      return res.status(404).json({ message: 'Grade not found for this school' })
    }

    // Get all students in this grade
    const studentsInGrade = await Student.find({ 
      schoolId: school,
      grade: grade 
    })

    const studentIds = studentsInGrade.map(s => s.studentId)
    const totalStudents = studentsInGrade.length

    // Get all reports for students in this grade
    const allReportsForGrade = await ResultReport.find({ 
      grade: grade,
      studentId: { $in: studentIds }
    })

    // Get all reports across school for comparison
    const allReportsForSchool = await ResultReport.find({})

    const scores = allReportsForGrade.map(r => r.result || 0).filter(s => s > 0)
    const classAverage = scores.length > 0 ? Math.round(average(scores) * 100) / 100 : 0

    // Get all unique subjects in grade
    const subjectIds = [...new Set(allReportsForGrade.map(item => item.subjectId).filter(Boolean))]
    const subjectsInGrade = await Subject.find({ subjectId: { $in: subjectIds } })

    // Build subject performance
    const subjectPerformance = subjectsInGrade.map((subjectItem) => {
      const reportsForSubject = allReportsForGrade.filter(item => item.subjectId === subjectItem.subjectId)
      return {
        name: subjectItem.subjectName,
        avgScore: reportsForSubject.length > 0 
          ? Math.round(average(reportsForSubject.map(r => r.result || 0)) * 100) / 100 
          : 0
      }
    })

    // Build grade distribution with subject breakdown
    const subjectMap = new Map(subjectsInGrade.map(s => [s.subjectId, s.subjectName]))
    const enrichedReports = allReportsForGrade.map(report => ({
      ...report.toObject(),
      subjectName: subjectMap.get(report.subjectId) || 'Unknown'
    }))
    
    const gradeDistribution = buildDistributionWithSubjects(enrichedReports)

    // Build monthly trend
    const monthlyTrend = buildMonthlyTrend(allReportsForGrade)

    // Build homework status
    const homeworkReports = await HomeworkReport.find({ grade: grade })
    const homeworkStatus = buildHomeworkStatusBySubject(homeworkReports, subjectMap)

    // Build student performance distribution
    const studentScores = {}
    allReportsForGrade.forEach(report => {
      if (!studentScores[report.studentId]) {
        studentScores[report.studentId] = []
      }
      studentScores[report.studentId].push(report.result || 0)
    })

    const studentPerformanceDistribution = [
      { name: 'A (90-100)', count: 0 },
      { name: 'B (80-89)', count: 0 },
      { name: 'C (70-79)', count: 0 },
      { name: 'D (60-69)', count: 0 },
      { name: 'F (<60)', count: 0 }
    ]

    Object.values(studentScores).forEach(studentScoreArray => {
      const avgStudentScore = average(studentScoreArray)
      let category
      
      if (avgStudentScore >= 90) {
        category = studentPerformanceDistribution[0]
      } else if (avgStudentScore >= 80) {
        category = studentPerformanceDistribution[1]
      } else if (avgStudentScore >= 70) {
        category = studentPerformanceDistribution[2]
      } else if (avgStudentScore >= 60) {
        category = studentPerformanceDistribution[3]
      } else {
        category = studentPerformanceDistribution[4]
      }
      
      if (category) category.count++
    })

    // Build skill radar based on grade's subjects
    const subjectScoresMap = {}
    subjectPerformance.forEach(perf => {
      subjectScoresMap[perf.name] = perf.avgScore
    })
    const gradeCombination = getSubjectCombination(subjectPerformance.map(p => p.name))
    const skillRadar = buildDynamicRadarData(subjectScoresMap, gradeCombination)

    // Build assessment comparison
    const moduleGroups = new Map()
    allReportsForGrade.forEach(report => {
      const moduleKey = report.moduleNo || 'Unknown Module'
      const existing = moduleGroups.get(moduleKey) || { count: 0, total: 0, moduleNo: moduleKey }
      existing.count += 1
      existing.total += report.result || 0
      moduleGroups.set(moduleKey, existing)
    })

    const assessmentComparison = []
    for (const { count, total, moduleNo } of moduleGroups.values()) {
      assessmentComparison.push({
        name: moduleNo,
        averageScore: Math.round((total / count) * 100) / 100
      })
    }

    // Calculate best and least performing students by subject
    const subjectWisePerformance = {}
    
    subjectsInGrade.forEach(subject => {
      subjectWisePerformance[subject.subjectName] = {}
    })

    // Group reports by subject
    allReportsForGrade.forEach(report => {
      const subjectName = subjectMap.get(report.subjectId) || 'Unknown'
      if (!subjectWisePerformance[subjectName]) {
        subjectWisePerformance[subjectName] = {}
      }
      
      const student = studentsInGrade.find(s => s.studentId === report.studentId)
      const studentName = student ? student.name || student.studentId : report.studentId
      
      if (!subjectWisePerformance[subjectName][studentName]) {
        subjectWisePerformance[subjectName][studentName] = {
          scores: [],
          studentId: report.studentId
        }
      }
      subjectWisePerformance[subjectName][studentName].scores.push(report.result || 0)
    })

    // Calculate average score per student per subject
    const bestPerformingStudents = {}
    const leastPerformingStudents = {}

    for (const [subject, students] of Object.entries(subjectWisePerformance)) {
      const studentList = []
      
      for (const [studentName, data] of Object.entries(students)) {
        const avgScore = average(data.scores)
        studentList.push({
          studentName,
          score: Math.round(avgScore * 100) / 100,
          avgScore
        })
      }

      // Sort by score
      studentList.sort((a, b) => b.avgScore - a.avgScore)

      // Get top 3 best and least
      bestPerformingStudents[subject] = studentList.slice(0, 3).map(s => ({
        studentName: s.studentName,
        score: s.score
      }))

      leastPerformingStudents[subject] = studentList.slice(-3).reverse().map(s => ({
        studentName: s.studentName,
        score: s.score
      }))
    }

    const analytics = {
      totalStudents,
      classAverage,
      subjectPerformance,
      gradeDistribution: gradeDistribution.length > 0 ? gradeDistribution : buildDistribution(scores),
      monthlyTrend: monthlyTrend.length > 0 ? monthlyTrend : [{ month: 'Apr 2026', value: classAverage }],
      homeworkStatus: homeworkStatus.length > 0 ? homeworkStatus : [
        { name: 'Submitted', value: 30, color: '#48c774' },
        { name: 'Pending', value: 15, color: '#ffdd57' }
      ],
      studentPerformanceDistribution,
      skillRadar,
      assessmentComparison,
      bestPerformingStudents,
      leastPerformingStudents
    }

    res.json({
      grade: grade,
      school: school,
      totalStudents,
      analytics
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
    console.log(`Class Performance Analytics backend running on http://localhost:${PORT}`)
  })
}

startServer()
