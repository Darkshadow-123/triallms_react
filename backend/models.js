import mongoose from 'mongoose'

const { Schema } = mongoose

const schoolSchema = new Schema({
  schoolId: { type: String, required: true, unique: true },
  schoolName: { type: String, required: true },
  email: String,
  address: String,
  district: String,
  city: String,
  state: String,
  pincode: Number
}, { timestamps: true })

const studentSchema = new Schema({
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  schoolId: { type: Schema.Types.ObjectId, ref: 'School' },
  rollNo: String,
  phone: Number,
  grade: { type: Schema.Types.ObjectId, ref: 'Grade' },
  subjects: [String]
}, { timestamps: true })

const teacherSchema = new Schema({
  teacherId: { type: String, required: true, unique: true },
  schoolId: { type: Schema.Types.ObjectId, ref: 'School' },
  name: { type: String, required: true },
  email: String,
  phone: Number,
  subjects: [String],
  grades: [{ type: Schema.Types.ObjectId, ref: 'Grade' }]
}, { timestamps: true })

const gradeSchema = new Schema({
  gradeId: { type: String, required: true, unique: true },
  subjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }],
  teachers: [{ type: Schema.Types.ObjectId, ref: 'Teacher' }],
  students: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
  studentCount: Number
}, { timestamps: true })

const subjectSchema = new Schema({
  subjectId: { type: String, required: true, unique: true },
  subjectName: { type: String, required: true },
  grade: { type: Schema.Types.ObjectId, ref: 'Grade' },
  teacherAssigned: { type: Schema.Types.ObjectId, ref: 'Teacher' },
  studentsAssigned: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
  chapterCount: Number,
  modulesCreated: Number
}, { timestamps: true })

const resultReportSchema = new Schema({
  reportId: { type: String, required: true, unique: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'Student' },
  studentName: String,
  grade: { type: Schema.Types.ObjectId, ref: 'Grade' },
  subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' },
  chapterNo: { type: Schema.Types.ObjectId, ref: 'Chapter' },
  moduleNo: { type: Schema.Types.ObjectId, ref: 'Module' },
  assessmentId: { type: Schema.Types.ObjectId, ref: 'Assessment' },
  createdAt: Date,
  result: Number
}, { timestamps: true })

const homeworkReportSchema = new Schema({
  reportId: { type: String, required: true, unique: true },
  chapterId: { type: Schema.Types.ObjectId, ref: 'Chapter' },
  moduleName: String,
  homeworkQuestions: Schema.Types.Mixed,
  moduleId: { type: Schema.Types.ObjectId, ref: 'Module' },
  studentId: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
  submittedCount: Number,
  pendingCount: Number,
  grade: { type: Schema.Types.ObjectId, ref: 'Grade' },
  subject: { type: Schema.Types.ObjectId, ref: 'Subject' },
  submittedBy: Date
}, { timestamps: true })

const assessmentSchema = new Schema({
  testNo: { type: String, required: true, unique: true },
  studentName: { type: Schema.Types.ObjectId, ref: 'Student' },
  subject: { type: Schema.Types.ObjectId, ref: 'Subject' },
  module: { type: Schema.Types.ObjectId, ref: 'Module' },
  mcqBatch: { type: Schema.Types.ObjectId, ref: 'MCQBatch' },
  mcqPool: Schema.Types.Mixed,
  correctAnswers: Schema.Types.Mixed,
  submittedAt: Date,
  result: Number
}, { timestamps: true })

export const School = mongoose.models.School || mongoose.model('School', schoolSchema)
export const Student = mongoose.models.Student || mongoose.model('Student', studentSchema)
export const Teacher = mongoose.models.Teacher || mongoose.model('Teacher', teacherSchema)
export const Grade = mongoose.models.Grade || mongoose.model('Grade', gradeSchema)
export const Subject = mongoose.models.Subject || mongoose.model('Subject', subjectSchema)
export const ResultReport = mongoose.models.ResultReport || mongoose.model('ResultReport', resultReportSchema)
export const HomeworkReport = mongoose.models.HomeworkReport || mongoose.model('HomeworkReport', homeworkReportSchema)
export const Assessment = mongoose.models.Assessment || mongoose.model('Assessment', assessmentSchema)
