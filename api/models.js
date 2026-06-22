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
  schoolId: { type: String },
  rollNo: String,
  phone: Number,
  grade: { type: String },
  subjects: [String]
}, { timestamps: true })

const teacherSchema = new Schema({
  teacherId: { type: String, required: true, unique: true },
  schoolId: { type: String },
  name: { type: String, required: true },
  email: String,
  phone: Number,
  subjects: [String],
  grades: [String]
}, { timestamps: true })

const gradeSchema = new Schema({
  gradeId: { type: String, required: true, unique: true },
  schools: [String],
  subjects: [String],
  teachers: [String],
  students: [String],
  studentCount: Number
}, { timestamps: true })

const subjectSchema = new Schema({
  subjectId: { type: String, required: true, unique: true },
  subjectName: { type: String, required: true },
  grades: [String],
  teacherAssigned: { type: String },
  studentsAssigned: [String],
  chapterCount: Number,
  modulesCreated: Number
}, { timestamps: true })

const resultReportSchema = new Schema({
  reportId: { type: String, required: true, unique: true },
  studentId: { type: String },
  studentName: String,
  grade: { type: String },
  subjectId: { type: String },
  chapterNo: { type: String },
  moduleNo: { type: String },
  assessmentId: { type: String },
  createdAt: Date,
  result: Number
}, { timestamps: true })

const homeworkReportSchema = new Schema({
  reportId: { type: String, required: true, unique: true },
  chapterId: { type: String },
  moduleName: String,
  homeworkQuestions: Schema.Types.Mixed,
  moduleId: { type: String },
  studentId: [String],
  submittedCount: Number,
  pendingCount: Number,
  grade: { type: String },
  subject: { type: String },
  submittedBy: Date
}, { timestamps: true })

const assessmentSchema = new Schema({
  testNo: { type: String, required: true, unique: true },
  studentName: { type: String },
  subject: { type: String },
  module: { type: String },
  mcqBatch: { type: String },
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
