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

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: 'Database connection failed' });
  }
});

const router = express.Router();
const MONGO_URI = process.env.MONGO_URI
const PORT = process.env.PORT || 5001

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
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

// Identify student's subject combination
const getSubjectCombination = (subjectNames = []) => {
  const normalizedSubjects = new Set(
    subjectNames.map(s => s.toLowerCase().trim())
  )

  const hasMath = normalizedSubjects.has('mathematics') || normalizedSubjects.has('math')
  const hasPhysics = normalizedSubjects.has('physics')
  const hasChemistry = normalizedSubjects.has('chemistry')
  const hasBiology = normalizedSubjects.has('biology')
  const hasEnglish = normalizedSubjects.has('english')

  // PCM + English
  if (hasMath && hasPhysics && hasChemistry && hasEnglish) {
    return 'pcm-english'
  }
  // PCB + Maths + English
  else if (hasMath && hasChemistry && hasBiology && hasEnglish) {
    return 'pcb-maths-english'
  }
  // Default fallback
  return 'default'
}

// Build dynamic radar data based on subjects and scores
const buildDynamicRadarData = (subjectScores = {}, combination = 'default') => {
  const clamp = (val) => Math.min(100, Math.max(20, Math.round(val)))

  if (combination === 'pcm-english') {
    // PCM + English combination
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
    // PCB + Maths + English combination
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
    // Default fallback with generic skills
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

// Legacy function for backward compatibility
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
    .filter((cat) => Object.keys(cat.subjects).length > 0) // Filter out empty categories
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

router.get('/schools', async (req, res) => {
  try {
    const schools = await School.find({}, 'schoolId').sort({ schoolId: 1 })
    res.json(schools.map(s => s.schoolId))
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/grades', async (req, res) => {
  try {
    const grades = await Grade.find({}, 'gradeId').sort({ gradeId: 1 })
    res.json(grades.map(g => g.gradeId))
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/subjects', async (req, res) => {
  try {
    const subjects = await Subject.find({}, 'subjectId subjectName').sort({ subjectName: 1 })
    res.json(subjects.map(s => ({ id: s.subjectId, name: s.subjectName })))
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/students', async (req, res) => {
  try {
    const students = await Student.find({}, 'studentId name').sort({ name: 1 })
    res.json(students.map(s => ({ id: s.studentId, name: s.name })))
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/grades/:schoolId', async (req, res) => {
  try {
    const { schoolId } = req.params

    // Find all grades for this school
    const grades = await Grade.find({ schools: schoolId }, 'gradeId').sort({ gradeId: 1 })
    res.json(grades.map(g => g.gradeId))
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/subjects/:schoolId', async (req, res) => {
  try {
    const { schoolId } = req.params

    // Find all grades for this school first
    const gradesForSchool = await Grade.find({ schools: schoolId }, 'subjects').lean()

    // Extract all subject IDs from those grades
    const subjectIds = new Set()
    gradesForSchool.forEach(grade => {
      if (grade.subjects && Array.isArray(grade.subjects)) {
        grade.subjects.forEach(subId => subjectIds.add(subId))
      }
    })

    // Find all those subjects
    const subjects = await Subject.find({
      subjectId: { $in: Array.from(subjectIds) }
    }, 'subjectId subjectName').sort({ subjectName: 1 })

    res.json(subjects.map(s => ({ id: s.subjectId, name: s.subjectName })))
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

router.get('/students/:schoolId', async (req, res) => {
  try {
    const { schoolId } = req.params

    // Find all students for this school
    const students = await Student.find({ schoolId: schoolId }, 'studentId name').sort({ name: 1 })
    res.json(students.map(s => ({ id: s.studentId, name: s.name })))
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/students/:schoolId/:gradeId', async (req, res) => {
  try {
    const { schoolId, gradeId } = req.params

    // Find all result reports for this school and grade
    const reports = await ResultReport.find({ grade: gradeId }).distinct('studentId')

    // Find all students with those IDs in this school
    const students = await Student.find({
      schoolId: schoolId,
      studentId: { $in: reports }
    }, 'studentId name').sort({ name: 1 })

    res.json(students.map(s => ({ id: s.studentId, name: s.name })))
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Backward compatible endpoint (without school parameter)
router.get('/SPA/:grade/past_performance/:identifier', async (req, res) => {
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

    // Get all reports (for this implementation, we'll aggregate from entire database)
    const allReports = await ResultReport.find({})

    const subjectReports = subject
      ? allReports.filter((report) => report.subjectId === subject.subjectId)
      : []

    const studentReports = student
      ? allReports.filter((report) => report.studentId === student.studentId)
      : []

    const effectiveReports = mode === 'subject' ? subjectReports : studentReports
    const scores = effectiveReports.map((r) => r.result || 0).filter((s) => s > 0)

    // Build analytics data
    const buildDistribution = (scores = []) => {
      const categories = [
        { name: 'A (90-100)', min: 90, max: 100, value: 0, color: '#48c774' },
        { name: 'B (80-89)', min: 80, max: 89, value: 0, color: '#3273dc' },
        { name: 'C (70-79)', min: 70, max: 79, value: 0, color: '#b86bff' },
        { name: 'D (60-69)', min: 60, max: 69, value: 0, color: '#ffdd57' },
        { name: 'F (<60)', min: 0, max: 59, value: 0, color: '#f14668' }
      ]

      scores.forEach((score) => {
        const category = categories.find((c) => score >= c.min && score <= c.max)
        if (category) category.value++
      })

      return categories
    }

    const average = (arr) => arr.length ? arr.reduce((sum, value) => sum + value, 0) / arr.length : 0
    const avgScore = average(scores)

    const analytics = {
      subjectPerformance: subject ? [{ name: subject.subjectName, avgScore }] : [],
      gradeDistribution: buildDistribution(scores),
      monthlyTrend: [{ month: 'Apr 2026', value: avgScore }],
      homeworkStatus: [
        { name: 'Submitted', value: 30, color: '#48c774' },
        { name: 'Pending', value: 15, color: '#ffdd57' }
      ],
      schoolVsGrade: [
        { name: 'School Average', value: avgScore },
        { name: 'Grade Average', value: avgScore }
      ],
      skillRadar: [
        { subject: 'Concepts', value: 86 },
        { subject: 'Application', value: 80 },
        { subject: 'Accuracy', value: 83 },
        { subject: 'Speed', value: 76 },
        { subject: 'Retention', value: 81 }
      ],
      assessmentComparison: [
        { name: 'ASN001', averageScore: 80 },
        { name: 'ASN003', averageScore: 90 },
        { name: 'ASN002', averageScore: 75 }
      ]
    }

    res.json({
      grade,
      mode,
      identifier,
      subject: subject || null,
      student: student || null,
      analytics
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// New endpoint with school parameter
router.get('/SPA/:school/:grade/past_performance/:identifier', async (req, res) => {
  try {
    const { school, grade, identifier } = req.params
    const { type, subject } = req.query

    const gradeDoc = await Grade.findOne({ gradeId: grade, schools: school })
    if (!gradeDoc) {
      return res.status(404).json({ message: 'Grade not found for this school' })
    }

    const studentPromise = type === 'subject' ? null : Student.findOne({ studentId: identifier, schoolId: school })
    const subjectPromise = type === 'student' ? null : Subject.findOne({
      $or: [
        { subjectId: identifier },
        { subjectName: new RegExp(`^${identifier}$`, 'i') }
      ]
    })

    const [student, findSubject] = await Promise.all([studentPromise, subjectPromise])
    let mode = null

    if (type === 'student') {
      if (!student) return res.status(404).json({ message: 'Student not found' })
      mode = 'student'
    } else if (type === 'subject') {
      if (!findSubject) return res.status(404).json({ message: 'Subject not found' })
      mode = 'subject'
    } else {
      if (student) mode = 'student'
      else if (findSubject) mode = 'subject'
      else return res.status(404).json({ message: 'Subject or student not found' })
    }

    const gradeReports = await ResultReport.find({ grade: gradeDoc.gradeId })
    const schoolReports = await ResultReport.find({})

    const subjectReports = findSubject
      ? gradeReports.filter((report) => report.subjectId === findSubject.subjectId)
      : []

    let studentReports = student
      ? gradeReports.filter((report) => report.studentId === student.studentId)
      : []

    // Filter by specific subject if provided in query
    if (subject) {
      studentReports = studentReports.filter((report) => report.subjectId === subject)
    }

    const subjectPerformance = []
    const gradeDistribution = []
    const monthlyTrend = []
    const homeworkStatus = []
    const schoolVsGrade = []
    const skillRadar = []
    const assessmentComparison = []

    if (mode === 'subject') {
      // Get all unique subject IDs in this grade
      const subjectIds = [...new Set(gradeReports.map((item) => item.subjectId).filter(Boolean))]
      const allSubjects = await Subject.find({ subjectId: { $in: subjectIds } })

      const subjectAverages = allSubjects.map((subjectItem) => {
        const reports = gradeReports.filter((report) => report.subjectId === subjectItem.subjectId)
        return {
          name: subjectItem.subjectName,
          avgScore: Math.round(average(reports.map((report) => report.result || 0)) * 100) / 100
        }
      })

      subjectPerformance.push(...subjectAverages)

      const subjectAvg = subjectReports.length > 0 ? Math.round(average(subjectReports.map((report) => report.result || 0)) * 100) / 100 : 0
      gradeDistribution.push(...buildDistribution(subjectReports.length > 0 ? subjectReports.map((report) => report.result || 0) : []))
      monthlyTrend.push(...buildMonthlyTrend(subjectReports))

      const homeworkReports = await HomeworkReport.find({ grade: gradeDoc.gradeId, subject: findSubject.subjectId })
      const subjectMapForHomework = new Map(allSubjects.map(s => [s.subjectId, s.subjectName]))
      homeworkStatus.push(...buildHomeworkStatusBySubject(homeworkReports, subjectMapForHomework))

      const gradeAvg = Math.round(average(gradeReports.map((report) => report.result || 0)) * 100) / 100
      const schoolAvg = Math.round(average(schoolReports.map((report) => report.result || 0)) * 100) / 100
      schoolVsGrade.push({ name: 'School Average', value: schoolAvg }, { name: 'Grade Average', value: gradeAvg })

      // Build dynamic radar based on grade's subject combination
      const subjectScoresMap = {}
      subjectAverages.forEach(avg => {
        subjectScoresMap[avg.name] = avg.avgScore
      })
      const gradeSubjects = Object.keys(subjectScoresMap)
      const gradeCombination = getSubjectCombination(gradeSubjects)
      skillRadar.push(...buildDynamicRadarData(subjectScoresMap, gradeCombination))

      const moduleGroups = new Map()
      subjectReports.forEach((report) => {
        const moduleKey = report.moduleNo || 'Unknown Module'
        const existing = moduleGroups.get(moduleKey) || { count: 0, total: 0, moduleNo: moduleKey }
        existing.count += 1
        existing.total += report.result || 0
        moduleGroups.set(moduleKey, existing)
      })

      for (const { count, total, moduleNo } of moduleGroups.values()) {
        assessmentComparison.push({
          name: moduleNo,
          averageScore: Math.round((total / count) * 100) / 100
        })
      }
    } else {
      // Get all unique subjects in grade
      const subjectIds = [...new Set(gradeReports.map((item) => item.subjectId).filter(Boolean))]
      const subjectsInGrade = await Subject.find({ subjectId: { $in: subjectIds } })
      const studentSubjectScores = subjectsInGrade.map((subjectItem) => {
        const reportsForSubject = studentReports.filter((item) => item.subjectId === subjectItem.subjectId)
        return {
          name: subjectItem.subjectName,
          avgScore: reportsForSubject.length > 0
            ? Math.round(average(reportsForSubject.map((report) => report.result || 0)) * 100) / 100
            : 0
        }
      })

      subjectPerformance.push(...studentSubjectScores)

      // Enrich student reports with subject names for grade distribution
      const subjectMap = new Map(subjectsInGrade.map(s => [s.subjectId, s.subjectName]))
      const enrichedStudentReports = studentReports.map(report => ({
        ...report.toObject(),
        subjectName: subjectMap.get(report.subjectId) || 'Unknown'
      }))

      gradeDistribution.push(...buildDistributionWithSubjects(enrichedStudentReports))
      monthlyTrend.push(...buildMonthlyTrend(studentReports))

      const homeworkQuery = { grade: gradeDoc.gradeId }
      if (subject) {
        homeworkQuery.subject = subject
      }
      const homeworkReports = await HomeworkReport.find(homeworkQuery)
      homeworkStatus.push(...buildHomeworkStatusBySubject(homeworkReports, subjectMap))

      const gradeAvg = Math.round(average(gradeReports.map((report) => report.result || 0)) * 100) / 100
      const schoolAvg = Math.round(average(schoolReports.map((report) => report.result || 0)) * 100) / 100
      schoolVsGrade.push({ name: 'School Average', value: schoolAvg }, { name: 'Grade Average', value: gradeAvg })

      const studentAvg = Math.round(average(studentReports.map((report) => report.result || 0)) * 100) / 100

      // Build dynamic radar based on student's enrolled subject combination
      const subjectScoresMap = {}
      const enrolledSubjects = student?.subjects || []
      studentSubjectScores.forEach(score => {
        // Only include subjects the student is enrolled in
        if (enrolledSubjects.some(s => s.toLowerCase() === score.name.toLowerCase())) {
          subjectScoresMap[score.name] = score.avgScore
        }
      })
      const studentSubjects = Object.keys(subjectScoresMap)
      const subjectCombination = getSubjectCombination(studentSubjects)
      skillRadar.push(...buildDynamicRadarData(subjectScoresMap, subjectCombination))

      const moduleGroups = new Map()
      studentReports.forEach((report) => {
        const moduleKey = report.moduleNo || 'Unknown Module'
        const existing = moduleGroups.get(moduleKey) || { count: 0, total: 0, moduleNo: moduleKey }
        existing.count += 1
        existing.total += report.result || 0
        moduleGroups.set(moduleKey, existing)
      })

      for (const { count, total, moduleNo } of moduleGroups.values()) {
        assessmentComparison.push({
          name: moduleNo,
          averageScore: Math.round((total / count) * 100) / 100
        })
      }
    }

    return res.json({
      grade: gradeDoc.gradeId,
      mode,
      identifier,
      subject: findSubject ? {
        subjectId: findSubject.subjectId,
        subjectName: findSubject.subjectName
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


router.get('/CPA/:school/:grade/class_analytics', async (req, res) => {
  try {
    const { school, grade } = req.params;

    const gradeDoc = await Grade.findOne({ gradeId: grade, schools: school });
    if (!gradeDoc) {
      return res.status(404).json({ message: 'Grade not found for this school' });
    }

    const gradeReports = await ResultReport.find({ grade: gradeDoc.gradeId });
    const allStudents = await Student.find({ schoolId: school });
    const studentMap = new Map(allStudents.map(s => [s.studentId, s.name]));

    const validReports = gradeReports.filter(r => studentMap.has(r.studentId));

    const subjectIds = [...new Set(validReports.map(item => item.subjectId).filter(Boolean))];
    const subjectsInGrade = await Subject.find({ subjectId: { $in: subjectIds } });
    const subjectMap = new Map(subjectsInGrade.map(s => [s.subjectId, s.subjectName]));

    const enrichedReports = validReports.map(report => ({
      ...report.toObject(),
      subjectName: subjectMap.get(report.subjectId) || 'Unknown'
    }));

    const scores = validReports.map(r => r.result || 0);
    const classAverage = scores.length > 0 ? Math.round(average(scores) * 100) / 100 : 0;

    const subjectPerformance = subjectsInGrade.map(subject => {
      const reps = validReports.filter(r => r.subjectId === subject.subjectId);
      return {
        name: subject.subjectName,
        avgScore: reps.length > 0 ? Math.round(average(reps.map(r => r.result || 0)) * 100) / 100 : 0
      };
    });

    const gradeDistribution = buildDistributionWithSubjects(enrichedReports);
    const monthlyTrend = buildMonthlyTrend(validReports);

    const homeworkReports = await HomeworkReport.find({ grade: gradeDoc.gradeId });
    const homeworkStatus = buildHomeworkStatusBySubject(homeworkReports, subjectMap);

    const skillRadarMap = {};
    subjectPerformance.forEach(sp => { skillRadarMap[sp.name] = sp.avgScore; });
    const skillRadar = buildDynamicRadarData(skillRadarMap, getSubjectCombination(Object.keys(skillRadarMap)));

    const moduleGroups = new Map();
    validReports.forEach(r => {
      const mk = r.moduleNo || 'Unknown';
      const ex = moduleGroups.get(mk) || { count: 0, total: 0 };
      ex.count++;
      ex.total += r.result || 0;
      moduleGroups.set(mk, ex);
    });
    const assessmentComparison = Array.from(moduleGroups.entries()).map(([name, data]) => ({
      name, averageScore: Math.round((data.total / data.count) * 100) / 100
    }));

    const bestPerformingStudents = {};
    const leastPerformingStudents = {};

    subjectsInGrade.forEach(subj => {
      const reps = validReports.filter(r => r.subjectId === subj.subjectId);
      const studentAvgs = new Map();
      reps.forEach(r => {
        const ex = studentAvgs.get(r.studentId) || { count: 0, total: 0 };
        ex.count++;
        ex.total += r.result || 0;
        studentAvgs.set(r.studentId, ex);
      });

      const sortedStudents = Array.from(studentAvgs.entries()).map(([sId, data]) => ({
        studentName: studentMap.get(sId) || sId,
        score: Math.round((data.total / data.count) * 100) / 100
      })).sort((a, b) => b.score - a.score);

      bestPerformingStudents[subj.subjectName] = sortedStudents.slice(0, 5);
      leastPerformingStudents[subj.subjectName] = sortedStudents.slice().reverse().slice(0, 5);
    });

    const distCategories = [
      { name: '90-100', min: 90, max: 100, count: 0 },
      { name: '80-89', min: 80, max: 89, count: 0 },
      { name: '70-79', min: 70, max: 79, count: 0 },
      { name: '60-69', min: 60, max: 69, count: 0 },
      { name: '<60', min: 0, max: 59, count: 0 }
    ];

    const allStudentAvgs = new Map();
    validReports.forEach(r => {
      const ex = allStudentAvgs.get(r.studentId) || { count: 0, total: 0 };
      ex.count++;
      ex.total += r.result || 0;
      allStudentAvgs.set(r.studentId, ex);
    });

    allStudentAvgs.forEach((data, sId) => {
      const avg = data.total / data.count;
      const cat = distCategories.find(c => avg >= c.min && avg <= c.max);
      if (cat) cat.count++;
    });

    res.json({
      analytics: {
        totalStudents: allStudentAvgs.size,
        classAverage,
        subjectPerformance,
        gradeDistribution,
        monthlyTrend,
        homeworkStatus,
        studentPerformanceDistribution: distCategories,
        skillRadar,
        bestPerformingStudents,
        leastPerformingStudents,
        assessmentComparison
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.use('/', router)
app.use('/api', router)


export default app
