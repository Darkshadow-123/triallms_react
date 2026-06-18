import mongoose from 'mongoose';
import dotenv from 'dotenv'

// ============================================================
// EXPANDED MOCK SEED DATA — Realistic, consistent, comprehensive
// ============================================================

const schoolSchema = new mongoose.Schema({
  schoolId: { type: String, required: true, unique: true },
  schoolName: { type: String, required: true },
  email: String,
  address: String,
  district: String,
  city: String,
  state: String,
  pincode: Number
}, { timestamps: true });

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  schoolId: { type: String },
  rollNo: String,
  phone: Number,
  grade: { type: String },
  subjects: [String]
}, { timestamps: true });

const teacherSchema = new mongoose.Schema({
  teacherId: { type: String, required: true, unique: true },
  schoolId: { type: String },
  name: { type: String, required: true },
  email: String,
  phone: Number,
  subjects: [String],
  grades: [String]
}, { timestamps: true });

const gradeSchema = new mongoose.Schema({
  gradeId: { type: String, required: true, unique: true },
  schools: [String],
  subjects: [String],
  teachers: [String],
  students: [String],
  studentCount: Number
}, { timestamps: true });

const subjectSchema = new mongoose.Schema({
  subjectId: { type: String, required: true, unique: true },
  subjectName: { type: String, required: true },
  grades: [String],
  teacherAssigned: { type: String },
  studentsAssigned: [String],
  chapterCount: Number,
  modulesCreated: Number
}, { timestamps: true });

const chapterSchema = new mongoose.Schema({
  chapterId: { type: String, required: true, unique: true },
  chapterName: { type: String, required: true },
  moduleId: { type: String },
  gradeId: { type: String },
  subjectId: { type: String },
  completedBy: { type: String }
}, { timestamps: true });

const moduleSchema = new mongoose.Schema({
  moduleId: { type: String, required: true, unique: true },
  moduleName: { type: String, required: true },
  chapterId: { type: String },
  moduleContent: mongoose.Schema.Types.Mixed,
  extraTips: mongoose.Schema.Types.Mixed,
  mcqPool: { type: String },
  homeworkModuleId: { type: String },
  grade: { type: String },
  subject: { type: String },
  createdBy: { type: String }
}, { timestamps: true });

const homeworkRepoSchema = new mongoose.Schema({
  homeworkId: { type: String, required: true, unique: true },
  moduleName: String,
  homeworkQuestions: mongoose.Schema.Types.Mixed,
  extraTips: mongoose.Schema.Types.Mixed,
  moduleId: { type: String },
  moduleExtraTips: String,
  grade: { type: String },
  subject: { type: String },
  createdBy: { type: String }
}, { timestamps: true });

const homeworkReportSchema = new mongoose.Schema({
  reportId: { type: String, required: true, unique: true },
  chapterId: { type: String },
  moduleName: String,
  homeworkQuestions: mongoose.Schema.Types.Mixed,
  moduleId: { type: String },
  studentId: [String],
  submittedCount: Number,
  pendingCount: Number,
  grade: { type: String },
  subject: { type: String },
  submittedBy: Date
}, { timestamps: true });

const mcqPoolSchema = new mongoose.Schema({
  poolId: { type: String, required: true, unique: true },
  moduleMcq: mongoose.Schema.Types.Mixed,
  studentAssigned: [String],
  grade: { type: String },
  mcqBatchId: Number,
  result: mongoose.Schema.Types.Mixed
}, { timestamps: true });

const mcqBatchSchema = new mongoose.Schema({
  batchId: { type: String, required: true, unique: true },
  moduleId: { type: String },
  assessmentId: { type: String },
  mcqQuestions: mongoose.Schema.Types.Mixed,
  mcqAnswers: mongoose.Schema.Types.Mixed
}, { timestamps: true });

const assessmentSchema = new mongoose.Schema({
  testNo: { type: String, required: true, unique: true },
  studentName: { type: String },
  subject: { type: String },
  module: { type: String },
  mcqBatch: { type: String },
  mcqPool: mongoose.Schema.Types.Mixed,
  correctAnswers: mongoose.Schema.Types.Mixed,
  submittedAt: Date,
  result: Number
}, { timestamps: true });

const resultReportSchema = new mongoose.Schema({
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
}, { timestamps: true });

const performanceHistorySchema = new mongoose.Schema({
  performanceId: { type: String, required: true, unique: true },
  studentId: { type: String },
  subjectId: { type: String },
  moduleId: { type: String },
  assessmentId: { type: String },
  submittedBy: Date,
  reportId: { type: String },
  result: Number
}, { timestamps: true });

const pastPerformanceHistorySchema = new mongoose.Schema({
  pastPerformanceId: { type: String, required: true, unique: true },
  studentId: { type: String },
  gradeId: { type: String },
  subjectId: { type: String },
  chapterId: { type: String },
  moduleId: { type: String },
  assessmentId: { type: String },
  reportId: { type: String },
  performanceId: { type: String },
  result: Number
}, { timestamps: true });

const studentAnalyticsSchema = new mongoose.Schema({
  analyticsId: { type: String, required: true, unique: true },
  studentId: { type: String },
  gradeId: { type: String },
  subjectId: { type: String },
  chaptersId: { type: String },
  modulesId: { type: String },
  testNo: { type: String },
  performanceId: { type: String },
  submittedAt: Date,
  timePeriod: Date,
  pastPerformances: mongoose.Schema.Types.Mixed
}, { timestamps: true });

const classAnalyticsSchema = new mongoose.Schema({
  classAnalyticsId: { type: String, required: true, unique: true },
  gradeId: { type: String },
  subjectId: { type: String },
  moduleId: { type: String },
  studentId: [String],
  assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment' },
  performanceId: { type: mongoose.Schema.Types.ObjectId, ref: 'PerformanceHistory' },
  timePeriod: Date,
  reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'ResultReport' }
}, { timestamps: true });

// Create models from schemas
const School = mongoose.model('School', schoolSchema);
const Student = mongoose.model('Student', studentSchema);
const Teacher = mongoose.model('Teacher', teacherSchema);
const Grade = mongoose.model('Grade', gradeSchema);
const Subject = mongoose.model('Subject', subjectSchema);
const Chapter = mongoose.model('Chapter', chapterSchema);
const Module = mongoose.model('Module', moduleSchema);
const HomeworkRepo = mongoose.model('HomeworkRepo', homeworkRepoSchema);
const HomeworkReport = mongoose.model('HomeworkReport', homeworkReportSchema);
const MCQPool = mongoose.model('MCQPool', mcqPoolSchema);
const MCQBatch = mongoose.model('MCQBatch', mcqBatchSchema);
const Assessment = mongoose.model('Assessment', assessmentSchema);
const ResultReport = mongoose.model('ResultReport', resultReportSchema);
const PerformanceHistory = mongoose.model('PerformanceHistory', performanceHistorySchema);
const PastPerformanceHistory = mongoose.model('PastPerformanceHistory', pastPerformanceHistorySchema);
const StudentAnalytics = mongoose.model('StudentAnalytics', studentAnalyticsSchema);
const ClassAnalytics = mongoose.model('ClassAnalytics', classAnalyticsSchema);

const MONGO_URI = process.env.MONGO_URI

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Promise.all([
      School.deleteMany({}), Student.deleteMany({}), Teacher.deleteMany({}),
      Grade.deleteMany({}), Subject.deleteMany({}), Chapter.deleteMany({}),
      Module.deleteMany({}), HomeworkRepo.deleteMany({}), HomeworkReport.deleteMany({}),
      MCQPool.deleteMany({}), MCQBatch.deleteMany({}), Assessment.deleteMany({}),
      ResultReport.deleteMany({}), PerformanceHistory.deleteMany({}),
      PastPerformanceHistory.deleteMany({}), StudentAnalytics.deleteMany({}),
      ClassAnalytics.deleteMany({})
    ]);
    console.log('All collections cleared');

    // ─────────────────────────────────────────
    // SCHOOLS  (2 schools across 2 states)
    // ─────────────────────────────────────────
    const schools = await School.insertMany([
      { schoolId: 'SCH001', schoolName: 'Greenfield High School',        email: 'info@greenfield.edu',            address: '123 Education Lane',    district: 'Central',    city: 'Mumbai',     state: 'Maharashtra', pincode: 400001 },
      { schoolId: 'SCH002', schoolName: 'Sunrise International School',  email: 'admin@sunrise.edu',              address: '45 Academy Road',       district: 'North',      city: 'Delhi',      state: 'Delhi',       pincode: 110001 },
    ]);

    // ─────────────────────────────────────────
    // GRADES  (Grade 9, 10, 11 — real Indian school labels)
    // ─────────────────────────────────────────
    const grades = await Grade.insertMany([
      { gradeId: 'GRD001', studentCount: 45 },   // Grade 9
      { gradeId: 'GRD002', studentCount: 50 },   // Grade 10
      { gradeId: 'GRD003', studentCount: 40 },   // Grade 11 (Science stream)
    ]);

    // ─────────────────────────────────────────
    // SUBJECTS  (consistent chapterCount/modulesCreated per grade)
    // ─────────────────────────────────────────
    const subjects = await Subject.insertMany([
      { subjectId: 'SUB001', subjectName: 'Mathematics', chapterCount: 5,  modulesCreated: 10 },
      { subjectId: 'SUB002', subjectName: 'Physics',      chapterCount: 4,  modulesCreated: 8  },
      { subjectId: 'SUB003', subjectName: 'Chemistry',    chapterCount: 4,  modulesCreated: 8  },
      { subjectId: 'SUB004', subjectName: 'Biology',      chapterCount: 5,  modulesCreated: 9  },
      { subjectId: 'SUB005', subjectName: 'English',      chapterCount: 6,  modulesCreated: 12 },
    ]);

    // ─────────────────────────────────────────
    // TEACHERS  (2–3 per school, assigned to correct subjects only)
    // ─────────────────────────────────────────
    const teachers = await Teacher.insertMany([
      // SCH001 — Greenfield High School, Mumbai
      { teacherId: 'TCH001', name: 'Rajesh Kumar',    email: 'rajesh@greenfield.edu',          phone: 9876543210, subjects: ['Mathematics'],           schoolId: schools[0].schoolId, grades: [grades[0].gradeId, grades[1].gradeId, grades[2].gradeId] },
      { teacherId: 'TCH002', name: 'Priya Sharma',    email: 'priya@greenfield.edu',            phone: 9876543211, subjects: ['Physics'],   schoolId: schools[0].schoolId, grades: [grades[0].gradeId, grades[1].gradeId, grades[2].gradeId] },
      { teacherId: 'TCH003', name: 'Neha Joshi',      email: 'neha@greenfield.edu',             phone: 9876543219, subjects: ['Chemistry'],     schoolId: schools[0].schoolId, grades: [grades[0].gradeId, grades[1].gradeId, grades[2].gradeId] },
      { teacherId: 'TCH004', name: 'Vikram Singh',    email: 'vikram@greenfieldacademy.edu',    phone: 9876543214, subjects: ['Biology'],   schoolId: schools[0].schoolId, grades: [grades[0].gradeId, grades[1].gradeId, grades[2].gradeId] },
      { teacherId: 'TCH005', name: 'Anita Rao',       email: 'anita@greenfieldacademy.edu',     phone: 9876543221, subjects: ['English'],           schoolId: schools[0].schoolId, grades: [grades[0].gradeId, grades[1].gradeId, grades[2].gradeId] },

      // SCH002 — Sunrise International School, Delhi
      { teacherId: 'TCH006', name: 'Amit Verma',      email: 'amit@sunrise.edu',                phone: 9876543212, subjects: ['Mathematics'],           schoolId: schools[1].schoolId, grades: [grades[0].gradeId, grades[1].gradeId, grades[2].gradeId] },
      { teacherId: 'TCH007', name: 'Sneha Patel',     email: 'sneha@sunrise.edu',               phone: 9876543213, subjects: ['Physics'],     schoolId: schools[1].schoolId, grades: [grades[0].gradeId, grades[1].gradeId, grades[2].gradeId] },
      { teacherId: 'TCH008', name: 'Rohit Desai',     email: 'rohit@sunrise.edu',               phone: 9876543220, subjects: ['Chemistry'],   schoolId: schools[1].schoolId, grades: [grades[0].gradeId, grades[1].gradeId, grades[2].gradeId] },
      { teacherId: 'TCH009', name: 'Suresh Mehta',    email: 'suresh@dps.edu',                  phone: 9876543215, subjects: ['Biology'], schoolId: schools[1].schoolId, grades: [grades[0].gradeId, grades[1].gradeId, grades[2].gradeId] },
      { teacherId: 'TCH010', name: 'Kavita Bose',     email: 'kavita@dps.edu',                  phone: 9876543222, subjects: ['English'],   schoolId: schools[1].schoolId, grades: [grades[0].gradeId, grades[1].gradeId, grades[2].gradeId] },
    ]);

    // ─────────────────────────────────────────
    // STUDENTS  (6 per school × 3 grades = realistic ~18 sample rows)
    // Humanities students: English, History, Geography, Biology only
    // Science students: Mathematics, Physics, Chemistry, Biology/English
    // ─────────────────────────────────────────
    const students = await Student.insertMany([
      // SCH001 Grade 9 (GRD001)
      { studentId: 'STU001', name: 'Arjun Mehta',      rollNo: '101', phone: 9876540001, subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],  schoolId: schools[0].schoolId, grade: grades[0].gradeId },
      { studentId: 'STU002', name: 'Priya Patel',      rollNo: '102', phone: 9876540002, subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],  schoolId: schools[0].schoolId, grade: grades[0].gradeId },
      { studentId: 'STU003', name: 'Rahul Singh',      rollNo: '103', phone: 9876540003, subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],      schoolId: schools[0].schoolId, grade: grades[0].gradeId },
      { studentId: 'STU004', name: 'Sneha Gupta',      rollNo: '104', phone: 9876540004, subjects: ['Mathematics', 'Chemistry', 'Biology', 'English'],    schoolId: schools[0].schoolId, grade: grades[0].gradeId },
      { studentId: 'STU005', name: 'Rohan Das',        rollNo: '105', phone: 9876540005, subjects: ['Mathematics', 'Chemistry', 'Biology', 'English'],      schoolId: schools[0].schoolId, grade: grades[0].gradeId },
      { studentId: 'STU006', name: 'Isha Kapoor',      rollNo: '106', phone: 9876540006, subjects: ['Mathematics', 'Chemistry', 'Biology', 'English'],  schoolId: schools[0].schoolId, grade: grades[0].gradeId },

      // SCH001 Grade 10 (GRD002)
      { studentId: 'STU007', name: 'Ananya Nair',      rollNo: '201', phone: 9876540007, subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],  schoolId: schools[0].schoolId, grade: grades[1].gradeId },
      { studentId: 'STU008', name: 'Kunal Shah',       rollNo: '202', phone: 9876540008, subjects: ['Mathematics', 'Chemistry', 'Biology', 'English'],  schoolId: schools[0].schoolId, grade: grades[1].gradeId },
      { studentId: 'STU009', name: 'Meera Reddy',      rollNo: '203', phone: 9876540009, subjects: ['Mathematics', 'Chemistry', 'Biology', 'English'],      schoolId: schools[0].schoolId, grade: grades[1].gradeId },

      // SCH002 Grade 9 (GRD001)
      { studentId: 'STU010', name: 'Vikram Nair',      rollNo: '101', phone: 9876540010, subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],  schoolId: schools[1].schoolId, grade: grades[0].gradeId },
      { studentId: 'STU011', name: 'Ananya Reddy',     rollNo: '102', phone: 9876540011, subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],  schoolId: schools[1].schoolId, grade: grades[0].gradeId },
      { studentId: 'STU012', name: 'Karan Joshi',      rollNo: '103', phone: 9876540012, subjects: ['Mathematics', 'Chemistry', 'Biology', 'English'],      schoolId: schools[1].schoolId, grade: grades[0].gradeId },

      // SCH002 Grade 9 (GRD001)
      { studentId: 'STU013', name: 'Pooja Malhotra',   rollNo: '104', phone: 9876540013, subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],  schoolId: schools[1].schoolId, grade: grades[0].gradeId },
      { studentId: 'STU014', name: 'Aditya Kumar',     rollNo: '105', phone: 9876540014, subjects: ['Mathematics', 'Chemistry', 'Biology', 'English'],      schoolId: schools[1].schoolId, grade: grades[0].gradeId },
      { studentId: 'STU015', name: 'Simran Kaur',      rollNo: '106', phone: 9876540015, subjects: ['Mathematics', 'Chemistry', 'Biology', 'English'],  schoolId: schools[1].schoolId, grade: grades[0].gradeId },

      // SCH002 Grade 10 (GRD002)
      { studentId: 'STU016', name: 'Meera Iyer',       rollNo: '201', phone: 9876540016, subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],  schoolId: schools[1].schoolId, grade: grades[1].gradeId },
      { studentId: 'STU017', name: 'Suresh Nambiar',   rollNo: '202', phone: 9876540017, subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],    schoolId: schools[1].schoolId, grade: grades[1].gradeId },
      { studentId: 'STU018', name: 'Divya Menon',      rollNo: '203', phone: 9876540018, subjects: ['Mathematics', 'Chemistry', 'Biology', 'English'],      schoolId: schools[1].schoolId, grade: grades[1].gradeId },

      // SCH002 Grade 10 (GRD002)
      { studentId: 'STU019', name: 'Arjun Krishnan',   rollNo: '204', phone: 9876540019, subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],  schoolId: schools[1].schoolId, grade: grades[1].gradeId },
      { studentId: 'STU020', name: 'Lakshmi Pillai',   rollNo: '205', phone: 9876540020, subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],  schoolId: schools[1].schoolId, grade: grades[1].gradeId },

      // SCH002 Grade 11 (GRD001)
      { studentId: 'STU021', name: 'Nikhil Sharma',    rollNo: '301', phone: 9876540021, subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],  schoolId: schools[1].schoolId, grade: grades[2].gradeId },
      { studentId: 'STU022', name: 'Riya Gupta',       rollNo: '302', phone: 9876540022, subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'], schoolId: schools[1].schoolId, grade: grades[2].gradeId },

      // SCH002 Grade 11 (GRD002)
      { studentId: 'STU023', name: 'Sourav Chatterjee', rollNo: '303', phone: 9876540023, subjects: ['Mathematics', 'Chemistry', 'Biology', 'English'],  schoolId: schools[1].schoolId, grade: grades[2].gradeId },
      { studentId: 'STU024', name: 'Tanisha Bose',     rollNo: '304', phone: 9876540024, subjects: ['Mathematics', 'Chemistry', 'Biology', 'English'],   schoolId: schools[1].schoolId, grade: grades[2].gradeId },
      { studentId: 'STU025', name: 'Tanisha Khare',     rollNo: '305', phone: 9876540024, subjects: ['Mathematics', 'Chemistry', 'Biology', 'English'],  schoolId: schools[1].schoolId, grade: grades[2].gradeId },
    ]);

    // ─────────────────────────────────────────
    // UPDATE GRADES WITH SUBJECTS AND TEACHERS
    // ─────────────────────────────────────────
    // Grade 9 (GRD001) — All students take 7 subjects with various combinations
    await Grade.updateOne(
      { gradeId: 'GRD001' },
      {
        schools: [schools[0].schoolId, schools[1].schoolId],
        subjects: [subjects[0].subjectId, subjects[1].subjectId, subjects[2].subjectId, subjects[3].subjectId, subjects[4].subjectId],
        teachers: [teachers[0].teacherId, teachers[1].teacherId, teachers[2].teacherId, teachers[3].teacherId, teachers[4].teacherId, teachers[5].teacherId, teachers[6].teacherId, teachers[7].teacherId, teachers[8].teacherId, teachers[9].teacherId],
        students: students.filter(s => s.grade === 'GRD001').map(s => s.studentId)
      }
    );

    // Grade 10 (GRD002) — All students take 7 subjects
    await Grade.updateOne(
      { gradeId: 'GRD002' },
      {
        schools: [schools[0].schoolId, schools[1].schoolId],
        subjects: [subjects[0].subjectId, subjects[1].subjectId, subjects[2].subjectId, subjects[3].subjectId, subjects[4].subjectId],
        teachers: [teachers[0].teacherId, teachers[1].teacherId, teachers[2].teacherId, teachers[3].teacherId, teachers[4].teacherId, teachers[5].teacherId, teachers[6].teacherId, teachers[7].teacherId, teachers[8].teacherId, teachers[9].teacherId],
        students: students.filter(s => s.grade === 'GRD002').map(s => s.studentId)
      }
    );

    // Grade 11 (GRD003) — Science stream: Mathematics, Physics, Chemistry, Biology, English
    await Grade.updateOne(
      { gradeId: 'GRD003' },
      {
        schools: [schools[0].schoolId, schools[1].schoolId],
        subjects: [subjects[0].subjectId, subjects[1].subjectId, subjects[2].subjectId, subjects[3].subjectId, subjects[4].subjectId],
        teachers: [teachers[0].teacherId, teachers[1].teacherId, teachers[2].teacherId, teachers[3].teacherId, teachers[4].teacherId, teachers[5].teacherId, teachers[6].teacherId, teachers[7].teacherId, teachers[8].teacherId, teachers[9].teacherId],
        students: students.filter(s => s.grade === 'GRD003').map(s => s.studentId)
      }
    );

    console.log('Updated grades with subjects and teachers');

    // ─────────────────────────────────────────
    // For now, we'll associate each subject with all relevant grades through the grade updates above
    // In a real system, you might want separate subject docs per grade or a many-to-many relationship table
    
    console.log('Grades updated successfully with all subjects and teachers');

    // ─────────────────────────────────────────
    // CHAPTERS  (realistic syllabus-style names, spread across grades & subjects)
    // ─────────────────────────────────────────
   const chapters = await Chapter.insertMany([
 
  // ═══════════════════════════════════════════════════════════════════════════
  // SCH001 — Greenfield High School, Mumbai  (teachers[0]–[4])
  // ═══════════════════════════════════════════════════════════════════════════
 
  // ── SUB001 Mathematics | teachers[0] = Rajesh Kumar ──────────────────────
  // Grade 9
  { chapterId: 'CHP11101', chapterName: 'Algebra Fundamentals',              moduleId: 'MODGRP11101', subjectId: subjects[0].subjectId, gradeId: grades[0].gradeId, completedBy: teachers[0].teacherId },
  { chapterId: 'CHP11102', chapterName: 'Linear Equations in One Variable',  moduleId: 'MODGRP11102', subjectId: subjects[0].subjectId, gradeId: grades[0].gradeId, completedBy: teachers[0].teacherId },
  // Grade 10
  { chapterId: 'CHP11201', chapterName: 'Quadratic Equations',               moduleId: 'MODGRP11201', subjectId: subjects[0].subjectId, gradeId: grades[1].gradeId, completedBy: teachers[0].teacherId },
  { chapterId: 'CHP11202', chapterName: 'Trigonometry Basics',               moduleId: 'MODGRP11202', subjectId: subjects[0].subjectId, gradeId: grades[1].gradeId, completedBy: teachers[0].teacherId },
  // Grade 11
  { chapterId: 'CHP11301', chapterName: 'Sets and Functions',                moduleId: 'MODGRP11301', subjectId: subjects[0].subjectId, gradeId: grades[2].gradeId, completedBy: teachers[0].teacherId },
  { chapterId: 'CHP11302', chapterName: 'Permutations and Combinations',     moduleId: 'MODGRP11302', subjectId: subjects[0].subjectId, gradeId: grades[2].gradeId, completedBy: teachers[0].teacherId },
 
  // ── SUB002 Physics | teachers[1] = Priya Sharma ──────────────────────────
  // Grade 9
  { chapterId: 'CHP12101', chapterName: 'Motion and Its Description',        moduleId: 'MODGRP12101', subjectId: subjects[1].subjectId, gradeId: grades[0].gradeId, completedBy: teachers[1].teacherId },
  { chapterId: 'CHP12102', chapterName: 'Laws of Motion',                    moduleId: 'MODGRP12102', subjectId: subjects[1].subjectId, gradeId: grades[0].gradeId, completedBy: teachers[1].teacherId },
  // Grade 10
  { chapterId: 'CHP12201', chapterName: 'Light — Reflection and Refraction', moduleId: 'MODGRP12201', subjectId: subjects[1].subjectId, gradeId: grades[1].gradeId, completedBy: teachers[1].teacherId },
  { chapterId: 'CHP12202', chapterName: 'Electricity',                       moduleId: 'MODGRP12202', subjectId: subjects[1].subjectId, gradeId: grades[1].gradeId, completedBy: teachers[1].teacherId },
  // Grade 11
  { chapterId: 'CHP12301', chapterName: 'Units and Measurements',            moduleId: 'MODGRP12301', subjectId: subjects[1].subjectId, gradeId: grades[2].gradeId, completedBy: teachers[1].teacherId },
  { chapterId: 'CHP12302', chapterName: 'Kinematics',                        moduleId: 'MODGRP12302', subjectId: subjects[1].subjectId, gradeId: grades[2].gradeId, completedBy: teachers[1].teacherId },
 
  // ── SUB003 Chemistry | teachers[2] = Neha Joshi ──────────────────────────
  // Grade 9
  { chapterId: 'CHP13101', chapterName: 'Chemical Reactions and Equations',  moduleId: 'MODGRP13101', subjectId: subjects[2].subjectId, gradeId: grades[0].gradeId, completedBy: teachers[2].teacherId },
  { chapterId: 'CHP13102', chapterName: 'Acids, Bases and Salts',            moduleId: 'MODGRP13102', subjectId: subjects[2].subjectId, gradeId: grades[0].gradeId, completedBy: teachers[2].teacherId },
  // Grade 10
  { chapterId: 'CHP13201', chapterName: 'Periodic Classification of Elements', moduleId: 'MODGRP13201', subjectId: subjects[2].subjectId, gradeId: grades[1].gradeId, completedBy: teachers[2].teacherId },
  { chapterId: 'CHP13202', chapterName: 'Carbon and Its Compounds',          moduleId: 'MODGRP13202', subjectId: subjects[2].subjectId, gradeId: grades[1].gradeId, completedBy: teachers[2].teacherId },
  // Grade 11
  { chapterId: 'CHP13301', chapterName: 'Structure of the Atom',             moduleId: 'MODGRP13301', subjectId: subjects[2].subjectId, gradeId: grades[2].gradeId, completedBy: teachers[2].teacherId },
  { chapterId: 'CHP13302', chapterName: 'Chemical Bonding and Molecular Structure', moduleId: 'MODGRP13302', subjectId: subjects[2].subjectId, gradeId: grades[2].gradeId, completedBy: teachers[2].teacherId },
 
  // ── SUB004 Biology | teachers[3] = Vikram Singh ──────────────────────────
  // Grade 9
  { chapterId: 'CHP14101', chapterName: 'The Fundamental Unit of Life',      moduleId: 'MODGRP14101', subjectId: subjects[3].subjectId, gradeId: grades[0].gradeId, completedBy: teachers[3].teacherId },
  { chapterId: 'CHP14102', chapterName: 'Tissues and Their Functions',       moduleId: 'MODGRP14102', subjectId: subjects[3].subjectId, gradeId: grades[0].gradeId, completedBy: teachers[3].teacherId },
  // Grade 10
  { chapterId: 'CHP14201', chapterName: 'Life Processes',                    moduleId: 'MODGRP14201', subjectId: subjects[3].subjectId, gradeId: grades[1].gradeId, completedBy: teachers[3].teacherId },
  { chapterId: 'CHP14202', chapterName: 'Control and Coordination',          moduleId: 'MODGRP14202', subjectId: subjects[3].subjectId, gradeId: grades[1].gradeId, completedBy: teachers[3].teacherId },
  // Grade 11
  { chapterId: 'CHP14301', chapterName: 'Cell: The Unit of Life',            moduleId: 'MODGRP14301', subjectId: subjects[3].subjectId, gradeId: grades[2].gradeId, completedBy: teachers[3].teacherId },
  { chapterId: 'CHP14302', chapterName: 'Photosynthesis in Higher Plants',   moduleId: 'MODGRP14302', subjectId: subjects[3].subjectId, gradeId: grades[2].gradeId, completedBy: teachers[3].teacherId },
 
  // ── SUB005 English | teachers[4] = Anita Rao ─────────────────────────────
  // Grade 9
  { chapterId: 'CHP15101', chapterName: 'Reading Comprehension',             moduleId: 'MODGRP15101', subjectId: subjects[4].subjectId, gradeId: grades[0].gradeId, completedBy: teachers[4].teacherId },
  { chapterId: 'CHP15102', chapterName: 'Grammar and Composition',           moduleId: 'MODGRP15102', subjectId: subjects[4].subjectId, gradeId: grades[0].gradeId, completedBy: teachers[4].teacherId },
  // Grade 10
  { chapterId: 'CHP15201', chapterName: 'Prose and Poetry Analysis',         moduleId: 'MODGRP15201', subjectId: subjects[4].subjectId, gradeId: grades[1].gradeId, completedBy: teachers[4].teacherId },
  { chapterId: 'CHP15202', chapterName: 'Writing Skills — Letters and Essays', moduleId: 'MODGRP15202', subjectId: subjects[4].subjectId, gradeId: grades[1].gradeId, completedBy: teachers[4].teacherId },
  // Grade 11
  { chapterId: 'CHP15301', chapterName: 'Advanced Reading and Inference',    moduleId: 'MODGRP15301', subjectId: subjects[4].subjectId, gradeId: grades[2].gradeId, completedBy: teachers[4].teacherId },
  { chapterId: 'CHP15302', chapterName: 'Creative and Argumentative Writing', moduleId: 'MODGRP15302', subjectId: subjects[4].subjectId, gradeId: grades[2].gradeId, completedBy: teachers[4].teacherId },
 
  // ═══════════════════════════════════════════════════════════════════════════
  // SCH002 — Sunrise International School, Delhi  (teachers[5]–[9])
  // ═══════════════════════════════════════════════════════════════════════════
 
  // ── SUB001 Mathematics | teachers[5] = Amit Verma ────────────────────────
  // Grade 9
  { chapterId: 'CHP21101', chapterName: 'Algebra Fundamentals',              moduleId: 'MODGRP21101', subjectId: subjects[0].subjectId, gradeId: grades[0].gradeId, completedBy: teachers[5].teacherId },
  { chapterId: 'CHP21102', chapterName: 'Linear Equations in One Variable',  moduleId: 'MODGRP21102', subjectId: subjects[0].subjectId, gradeId: grades[0].gradeId, completedBy: teachers[5].teacherId },
  // Grade 10
  { chapterId: 'CHP21201', chapterName: 'Quadratic Equations',               moduleId: 'MODGRP21201', subjectId: subjects[0].subjectId, gradeId: grades[1].gradeId, completedBy: teachers[5].teacherId },
  { chapterId: 'CHP21202', chapterName: 'Trigonometry Basics',               moduleId: 'MODGRP21202', subjectId: subjects[0].subjectId, gradeId: grades[1].gradeId, completedBy: teachers[5].teacherId },
  // Grade 11
  { chapterId: 'CHP21301', chapterName: 'Sets and Functions',                moduleId: 'MODGRP21301', subjectId: subjects[0].subjectId, gradeId: grades[2].gradeId, completedBy: teachers[5].teacherId },
  { chapterId: 'CHP21302', chapterName: 'Permutations and Combinations',     moduleId: 'MODGRP21302', subjectId: subjects[0].subjectId, gradeId: grades[2].gradeId, completedBy: teachers[5].teacherId },
 
  // ── SUB002 Physics | teachers[6] = Sneha Patel ───────────────────────────
  // Grade 9
  { chapterId: 'CHP22101', chapterName: 'Motion and Its Description',        moduleId: 'MODGRP22101', subjectId: subjects[1].subjectId, gradeId: grades[0].gradeId, completedBy: teachers[6].teacherId },
  { chapterId: 'CHP22102', chapterName: 'Laws of Motion',                    moduleId: 'MODGRP22102', subjectId: subjects[1].subjectId, gradeId: grades[0].gradeId, completedBy: teachers[6].teacherId },
  // Grade 10
  { chapterId: 'CHP22201', chapterName: 'Light — Reflection and Refraction', moduleId: 'MODGRP22201', subjectId: subjects[1].subjectId, gradeId: grades[1].gradeId, completedBy: teachers[6].teacherId },
  { chapterId: 'CHP22202', chapterName: 'Electricity',                       moduleId: 'MODGRP22202', subjectId: subjects[1].subjectId, gradeId: grades[1].gradeId, completedBy: teachers[6].teacherId },
  // Grade 11
  { chapterId: 'CHP22301', chapterName: 'Units and Measurements',            moduleId: 'MODGRP22301', subjectId: subjects[1].subjectId, gradeId: grades[2].gradeId, completedBy: teachers[6].teacherId },
  { chapterId: 'CHP22302', chapterName: 'Kinematics',                        moduleId: 'MODGRP22302', subjectId: subjects[1].subjectId, gradeId: grades[2].gradeId, completedBy: teachers[6].teacherId },
 
  // ── SUB003 Chemistry | teachers[7] = Rohit Desai ─────────────────────────
  // Grade 9
  { chapterId: 'CHP23101', chapterName: 'Chemical Reactions and Equations',  moduleId: 'MODGRP23101', subjectId: subjects[2].subjectId, gradeId: grades[0].gradeId, completedBy: teachers[7].teacherId },
  { chapterId: 'CHP23102', chapterName: 'Acids, Bases and Salts',            moduleId: 'MODGRP23102', subjectId: subjects[2].subjectId, gradeId: grades[0].gradeId, completedBy: teachers[7].teacherId },
  // Grade 10
  { chapterId: 'CHP23201', chapterName: 'Periodic Classification of Elements', moduleId: 'MODGRP23201', subjectId: subjects[2].subjectId, gradeId: grades[1].gradeId, completedBy: teachers[7].teacherId },
  { chapterId: 'CHP23202', chapterName: 'Carbon and Its Compounds',          moduleId: 'MODGRP23202', subjectId: subjects[2].subjectId, gradeId: grades[1].gradeId, completedBy: teachers[7].teacherId },
  // Grade 11
  { chapterId: 'CHP23301', chapterName: 'Structure of the Atom',             moduleId: 'MODGRP23301', subjectId: subjects[2].subjectId, gradeId: grades[2].gradeId, completedBy: teachers[7].teacherId },
  { chapterId: 'CHP23302', chapterName: 'Chemical Bonding and Molecular Structure', moduleId: 'MODGRP23302', subjectId: subjects[2].subjectId, gradeId: grades[2].gradeId, completedBy: teachers[7].teacherId },
 
  // ── SUB004 Biology | teachers[8] = Suresh Mehta ──────────────────────────
  // Grade 9
  { chapterId: 'CHP24101', chapterName: 'The Fundamental Unit of Life',      moduleId: 'MODGRP24101', subjectId: subjects[3].subjectId, gradeId: grades[0].gradeId, completedBy: teachers[8].teacherId },
  { chapterId: 'CHP24102', chapterName: 'Tissues and Their Functions',       moduleId: 'MODGRP24102', subjectId: subjects[3].subjectId, gradeId: grades[0].gradeId, completedBy: teachers[8].teacherId },
  // Grade 10
  { chapterId: 'CHP24201', chapterName: 'Life Processes',                    moduleId: 'MODGRP24201', subjectId: subjects[3].subjectId, gradeId: grades[1].gradeId, completedBy: teachers[8].teacherId },
  { chapterId: 'CHP24202', chapterName: 'Control and Coordination',          moduleId: 'MODGRP24202', subjectId: subjects[3].subjectId, gradeId: grades[1].gradeId, completedBy: teachers[8].teacherId },
  // Grade 11
  { chapterId: 'CHP24301', chapterName: 'Cell: The Unit of Life',            moduleId: 'MODGRP24301', subjectId: subjects[3].subjectId, gradeId: grades[2].gradeId, completedBy: teachers[8].teacherId },
  { chapterId: 'CHP24302', chapterName: 'Photosynthesis in Higher Plants',   moduleId: 'MODGRP24302', subjectId: subjects[3].subjectId, gradeId: grades[2].gradeId, completedBy: teachers[8].teacherId },
 
  // ── SUB005 English | teachers[9] = Kavita Bose ───────────────────────────
  // Grade 9
  { chapterId: 'CHP25101', chapterName: 'Reading Comprehension',             moduleId: 'MODGRP25101', subjectId: subjects[4].subjectId, gradeId: grades[0].gradeId, completedBy: teachers[9].teacherId },
  { chapterId: 'CHP25102', chapterName: 'Grammar and Composition',           moduleId: 'MODGRP25102', subjectId: subjects[4].subjectId, gradeId: grades[0].gradeId, completedBy: teachers[9].teacherId },
  // Grade 10
  { chapterId: 'CHP25201', chapterName: 'Prose and Poetry Analysis',         moduleId: 'MODGRP25201', subjectId: subjects[4].subjectId, gradeId: grades[1].gradeId, completedBy: teachers[9].teacherId },
  { chapterId: 'CHP25202', chapterName: 'Writing Skills — Letters and Essays', moduleId: 'MODGRP25202', subjectId: subjects[4].subjectId, gradeId: grades[1].gradeId, completedBy: teachers[9].teacherId },
  // Grade 11
  { chapterId: 'CHP25301', chapterName: 'Advanced Reading and Inference',    moduleId: 'MODGRP25301', subjectId: subjects[4].subjectId, gradeId: grades[2].gradeId, completedBy: teachers[9].teacherId },
  { chapterId: 'CHP25302', chapterName: 'Creative and Argumentative Writing', moduleId: 'MODGRP25302', subjectId: subjects[4].subjectId, gradeId: grades[2].gradeId, completedBy: teachers[9].teacherId },
]);
// Total: 60 chapters ✓ (2 schools × 5 subjects × 3 grades × 2 chapters)

 /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
// ─────────────────────────────────────────────────────────────────────────────
// MODULES  (2 per chapter = 120 total)
// Index map for chapters array (insertion order above, 0-based):
//   SCH001:  0–29   (chapters[0]  – chapters[29])
//   SCH002:  30–59  (chapters[30] – chapters[59])
//
// Within each school block, order is:
//   Math-G9, Math-G9, Math-G10, Math-G10, Math-G11, Math-G11,
//   Phys-G9, Phys-G9, Phys-G10, Phys-G10, Phys-G11, Phys-G11,
//   Chem-G9 … Biol-G9 … Eng-G9 …  (same 6-per-subject pattern)
// ─────────────────────────────────────────────────────────────────────────────

    // ─────────────────────────────────────────
    // MODULES  (2 per chapter minimum; content JSON realistic)
    // ─────────────────────────────────────────
   const modules = await Module.insertMany([
 
  // ═══════════════════════════════════════════════════════════════════════════
  // SCH001 — Greenfield High School
  // ═══════════════════════════════════════════════════════════════════════════
 
  // ── Mathematics G9 | chapters[0] Algebra Fundamentals ────────────────────
  { moduleId: 'MOD11101A', moduleName: 'Introduction to Algebra',
    chapterId: chapters[0].chapterId, grade: grades[0].gradeId, subject: subjects[0].subjectId,
    moduleContent: { text: 'Constants, variables, and algebraic expressions with worked examples', videoUrl: 'https://learn.example.com/s1/math/g9/algebra-intro' },
    extraTips: { tip1: 'Substitute numbers into expressions to verify simplifications', tip2: 'Write terms in descending powers of the variable' },
    createdBy: teachers[0].teacherId },
 
  { moduleId: 'MOD11101B', moduleName: 'Variables, Expressions and Simplification',
    chapterId: chapters[0].chapterId, grade: grades[0].gradeId, subject: subjects[0].subjectId,
    moduleContent: { text: 'Collecting like terms, expanding brackets, and BODMAS order of operations', videoUrl: 'https://learn.example.com/s1/math/g9/algebra-simplify' },
    extraTips: { tip1: 'Always expand brackets before collecting like terms', tip2: 'Use colour-coding to identify like terms quickly' },
    createdBy: teachers[0].teacherId },
 
  // ── Mathematics G9 | chapters[1] Linear Equations ────────────────────────
  { moduleId: 'MOD11102A', moduleName: 'Solving One-Variable Linear Equations',
    chapterId: chapters[1].chapterId, grade: grades[0].gradeId, subject: subjects[0].subjectId,
    moduleContent: { text: 'Balancing method, inverse operations, and verification of solutions', videoUrl: 'https://learn.example.com/s1/math/g9/linear-eq' },
    extraTips: { tip1: 'Always substitute your answer back to check it satisfies the original equation' },
    createdBy: teachers[0].teacherId },
 
  { moduleId: 'MOD11102B', moduleName: 'Word Problems — Linear Equations',
    chapterId: chapters[1].chapterId, grade: grades[0].gradeId, subject: subjects[0].subjectId,
    moduleContent: { text: 'Translating real-life scenarios into linear equations and solving them', videoUrl: 'https://learn.example.com/s1/math/g9/linear-word' },
    extraTips: { tip1: 'Define the variable clearly before forming the equation', tip2: 'Re-read the question to confirm your answer makes sense in context' },
    createdBy: teachers[0].teacherId },
 
  // ── Mathematics G10 | chapters[2] Quadratic Equations ────────────────────
  { moduleId: 'MOD11201A', moduleName: 'Factorisation Method for Quadratics',
    chapterId: chapters[2].chapterId, grade: grades[1].gradeId, subject: subjects[0].subjectId,
    moduleContent: { text: 'Splitting the middle term, grouping, and identifying roots by factorisation', videoUrl: 'https://learn.example.com/s1/math/g10/quad-factor' },
    extraTips: { tip1: 'Find two numbers whose product = ac and sum = b', tip2: 'Practice at least 15 problems for speed in exams' },
    createdBy: teachers[0].teacherId },
 
  { moduleId: 'MOD11201B', moduleName: 'Quadratic Formula and the Discriminant',
    chapterId: chapters[2].chapterId, grade: grades[1].gradeId, subject: subjects[0].subjectId,
    moduleContent: { text: 'Deriving and applying the quadratic formula; interpreting discriminant values', videoUrl: 'https://learn.example.com/s1/math/g10/quad-formula' },
    extraTips: { tip1: 'D > 0 → two distinct real roots; D = 0 → equal roots; D < 0 → no real roots', tip2: 'Memorise the formula: x = (−b ± √D) / 2a' },
    createdBy: teachers[0].teacherId },
 
  // ── Mathematics G10 | chapters[3] Trigonometry Basics ────────────────────
  { moduleId: 'MOD11202A', moduleName: 'Trigonometric Ratios',
    chapterId: chapters[3].chapterId, grade: grades[1].gradeId, subject: subjects[0].subjectId,
    moduleContent: { text: 'Defining sin, cos, tan and their reciprocals using right-angled triangles', videoUrl: 'https://learn.example.com/s1/math/g10/trig-ratios' },
    extraTips: { tip1: 'Use SOH-CAH-TOA as a memory aid', tip2: 'Label opposite, adjacent and hypotenuse before writing any ratio' },
    createdBy: teachers[0].teacherId },
 
  { moduleId: 'MOD11202B', moduleName: 'Trigonometric Identities and Standard Angles',
    chapterId: chapters[3].chapterId, grade: grades[1].gradeId, subject: subjects[0].subjectId,
    moduleContent: { text: 'Proving sin²θ + cos²θ = 1 and applying standard angle values (0°, 30°, 45°, 60°, 90°)', videoUrl: 'https://learn.example.com/s1/math/g10/trig-identity' },
    extraTips: { tip1: 'Start proofs from the more complex side', tip2: 'Memorise the standard angle table — it saves time in every exam' },
    createdBy: teachers[0].teacherId },
 
  // ── Mathematics G11 | chapters[4] Sets and Functions ─────────────────────
  { moduleId: 'MOD11301A', moduleName: 'Introduction to Sets',
    chapterId: chapters[4].chapterId, grade: grades[2].gradeId, subject: subjects[0].subjectId,
    moduleContent: { text: 'Set notation, Venn diagrams, union, intersection, complement and power sets', videoUrl: 'https://learn.example.com/s1/math/g11/sets-intro' },
    extraTips: { tip1: 'Always draw a Venn diagram for three-set problems', tip2: 'The empty set ∅ is a subset of every set' },
    createdBy: teachers[0].teacherId },
 
  { moduleId: 'MOD11301B', moduleName: 'Functions — Domain, Range and Types',
    chapterId: chapters[4].chapterId, grade: grades[2].gradeId, subject: subjects[0].subjectId,
    moduleContent: { text: 'One-one, onto and bijective functions; finding domain and range; composition and inverse', videoUrl: 'https://learn.example.com/s1/math/g11/functions' },
    extraTips: { tip1: 'Apply the horizontal line test to check if a function is one-one', tip2: 'For inverse functions, swap x and y, then solve for y' },
    createdBy: teachers[0].teacherId },
 
  // ── Mathematics G11 | chapters[5] Permutations and Combinations ──────────
  { moduleId: 'MOD11302A', moduleName: 'Fundamental Principle of Counting',
    chapterId: chapters[5].chapterId, grade: grades[2].gradeId, subject: subjects[0].subjectId,
    moduleContent: { text: 'Multiplication and addition principles with real-life examples and tree diagrams', videoUrl: 'https://learn.example.com/s1/math/g11/counting' },
    extraTips: { tip1: 'Use multiplication when events happen together; addition when they are alternatives' },
    createdBy: teachers[0].teacherId },
 
  { moduleId: 'MOD11302B', moduleName: 'Permutations and Combinations — Formulas and Applications',
    chapterId: chapters[5].chapterId, grade: grades[2].gradeId, subject: subjects[0].subjectId,
    moduleContent: { text: 'nPr and nCr formulas, factorial notation, and problem-solving strategies', videoUrl: 'https://learn.example.com/s1/math/g11/perm-comb' },
    extraTips: { tip1: 'Permutation = order matters; Combination = order does not matter', tip2: 'Always check whether repetition is allowed in the problem' },
    createdBy: teachers[0].teacherId },
 
  // ── Physics G9 | chapters[6] Motion and Its Description ──────────────────
  { moduleId: 'MOD12101A', moduleName: 'Distance, Displacement and Speed',
    chapterId: chapters[6].chapterId, grade: grades[0].gradeId, subject: subjects[1].subjectId,
    moduleContent: { text: 'Scalar vs vector quantities; uniform and non-uniform motion; distance-time graphs', videoUrl: 'https://learn.example.com/s1/phys/g9/motion-basics' },
    extraTips: { tip1: 'Distance is always positive; displacement can be negative — direction matters', tip2: 'Slope of a distance-time graph gives speed' },
    createdBy: teachers[1].teacherId },
 
  { moduleId: 'MOD12101B', moduleName: 'Velocity, Acceleration and Motion Graphs',
    chapterId: chapters[6].chapterId, grade: grades[0].gradeId, subject: subjects[1].subjectId,
    moduleContent: { text: 'Velocity-time graphs; equations of uniformly accelerated motion (v = u + at, s = ut + ½at²)', videoUrl: 'https://learn.example.com/s1/phys/g9/motion-graphs' },
    extraTips: { tip1: 'Slope of velocity-time graph = acceleration; area under it = displacement', tip2: 'Write all three equations of motion at the top of your solution' },
    createdBy: teachers[1].teacherId },
 
  // ── Physics G9 | chapters[7] Laws of Motion ──────────────────────────────
  { moduleId: 'MOD12102A', moduleName: "Newton's Three Laws of Motion",
    chapterId: chapters[7].chapterId, grade: grades[0].gradeId, subject: subjects[1].subjectId,
    moduleContent: { text: 'Inertia, F = ma, and action-reaction pairs with everyday examples', videoUrl: 'https://learn.example.com/s1/phys/g9/newtons-laws' },
    extraTips: { tip1: 'Draw a free-body diagram before applying Newton\'s second law', tip2: 'Third law pairs act on different objects — never cancel each other' },
    createdBy: teachers[1].teacherId },
 
  { moduleId: 'MOD12102B', moduleName: 'Friction and Momentum',
    chapterId: chapters[7].chapterId, grade: grades[0].gradeId, subject: subjects[1].subjectId,
    moduleContent: { text: 'Types of friction, factors affecting it; momentum, impulse and conservation principle', videoUrl: 'https://learn.example.com/s1/phys/g9/friction-momentum' },
    extraTips: { tip1: 'Momentum is conserved only when no external force acts', tip2: 'Friction always opposes the direction of relative motion' },
    createdBy: teachers[1].teacherId },
 
  // ── Physics G10 | chapters[8] Light — Reflection & Refraction ────────────
  { moduleId: 'MOD12201A', moduleName: 'Reflection of Light and Spherical Mirrors',
    chapterId: chapters[8].chapterId, grade: grades[1].gradeId, subject: subjects[1].subjectId,
    moduleContent: { text: 'Laws of reflection; ray diagrams for concave and convex mirrors; mirror formula and magnification', videoUrl: 'https://learn.example.com/s1/phys/g10/reflection' },
    extraTips: { tip1: 'Use the New Cartesian sign convention consistently throughout', tip2: 'Verify mirror formula: 1/v + 1/u = 1/f' },
    createdBy: teachers[1].teacherId },
 
  { moduleId: 'MOD12201B', moduleName: 'Refraction of Light and Lenses',
    chapterId: chapters[8].chapterId, grade: grades[1].gradeId, subject: subjects[1].subjectId,
    moduleContent: { text: "Snell's law, refractive index, total internal reflection; convex and concave lens ray diagrams and lens formula", videoUrl: 'https://learn.example.com/s1/phys/g10/refraction' },
    extraTips: { tip1: 'Power of a lens P = 1/f (f in metres); convex lens has positive power', tip2: 'Draw two rays to locate the image; the third is a check' },
    createdBy: teachers[1].teacherId },
 
  // ── Physics G10 | chapters[9] Electricity ────────────────────────────────
  { moduleId: 'MOD12202A', moduleName: "Ohm's Law and Electrical Resistance",
    chapterId: chapters[9].chapterId, grade: grades[1].gradeId, subject: subjects[1].subjectId,
    moduleContent: { text: "Ohm's law; resistance and resistivity; factors affecting resistance; series and parallel combinations", videoUrl: 'https://learn.example.com/s1/phys/g10/ohms-law' },
    extraTips: { tip1: 'In series: R_total = R1 + R2; in parallel: 1/R_total = 1/R1 + 1/R2', tip2: 'Always draw the circuit diagram before solving' },
    createdBy: teachers[1].teacherId },
 
  { moduleId: 'MOD12202B', moduleName: 'Electric Power and Heating Effect',
    chapterId: chapters[9].chapterId, grade: grades[1].gradeId, subject: subjects[1].subjectId,
    moduleContent: { text: 'Power P = VI = I²R; commercial unit of energy (kWh); heating effect and its applications', videoUrl: 'https://learn.example.com/s1/phys/g10/electric-power' },
    extraTips: { tip1: '1 kWh = 3.6 × 10⁶ J — memorise this for numerical problems', tip2: 'Higher resistance → more heat produced for same current' },
    createdBy: teachers[1].teacherId },
 
  // ── Physics G11 | chapters[10] Units and Measurements ────────────────────
  { moduleId: 'MOD12301A', moduleName: 'SI Units and Dimensional Analysis',
    chapterId: chapters[10].chapterId, grade: grades[2].gradeId, subject: subjects[1].subjectId,
    moduleContent: { text: 'Seven base SI units; derived units; dimensional formula and its applications in verification and derivation', videoUrl: 'https://learn.example.com/s1/phys/g11/si-units' },
    extraTips: { tip1: 'Dimensions of a quantity must be the same on both sides of any equation', tip2: 'Always state units in every numerical answer' },
    createdBy: teachers[1].teacherId },
 
  { moduleId: 'MOD12301B', moduleName: 'Errors and Significant Figures',
    chapterId: chapters[10].chapterId, grade: grades[2].gradeId, subject: subjects[1].subjectId,
    moduleContent: { text: 'Systematic vs random errors; absolute, relative and percentage error; rules for significant figures', videoUrl: 'https://learn.example.com/s1/phys/g11/errors' },
    extraTips: { tip1: 'Percentage error = (absolute error / true value) × 100', tip2: 'Round final answers to the least number of significant figures in the given data' },
    createdBy: teachers[1].teacherId },
 
  // ── Physics G11 | chapters[11] Kinematics ────────────────────────────────
  { moduleId: 'MOD12302A', moduleName: 'Motion in a Straight Line',
    chapterId: chapters[11].chapterId, grade: grades[2].gradeId, subject: subjects[1].subjectId,
    moduleContent: { text: 'Position-time and velocity-time graphs; equations of motion; free fall and acceleration due to gravity', videoUrl: 'https://learn.example.com/s1/phys/g11/straight-line' },
    extraTips: { tip1: 'Take downward direction as positive when analysing free fall', tip2: 'At maximum height during projectile motion, vertical velocity = 0' },
    createdBy: teachers[1].teacherId },
 
  { moduleId: 'MOD12302B', moduleName: 'Projectile Motion and Relative Motion',
    chapterId: chapters[11].chapterId, grade: grades[2].gradeId, subject: subjects[1].subjectId,
    moduleContent: { text: 'Horizontal and vertical components of projectile motion; range, time of flight; relative velocity in 1D and 2D', videoUrl: 'https://learn.example.com/s1/phys/g11/projectile' },
    extraTips: { tip1: 'Horizontal and vertical motions are independent — analyse them separately', tip2: 'Maximum range is achieved at 45° launch angle' },
    createdBy: teachers[1].teacherId },
 
  // ── Chemistry G9 | chapters[12] Chemical Reactions and Equations ──────────
  { moduleId: 'MOD13101A', moduleName: 'Types of Chemical Reactions',
    chapterId: chapters[12].chapterId, grade: grades[0].gradeId, subject: subjects[2].subjectId,
    moduleContent: { text: 'Combination, decomposition, displacement, double-displacement and redox reactions with real examples', videoUrl: 'https://learn.example.com/s1/chem/g9/rxn-types' },
    extraTips: { tip1: 'Memorise the activity series to predict displacement reactions', tip2: 'Exothermic reactions release heat; endothermic absorb heat' },
    createdBy: teachers[2].teacherId },
 
  { moduleId: 'MOD13101B', moduleName: 'Balancing Chemical Equations',
    chapterId: chapters[12].chapterId, grade: grades[0].gradeId, subject: subjects[2].subjectId,
    moduleContent: { text: 'Law of conservation of mass; hit-and-trial and algebraic methods for balancing', videoUrl: 'https://learn.example.com/s1/chem/g9/balancing' },
    extraTips: { tip1: 'Balance metals first, then non-metals, and leave hydrogen and oxygen for last', tip2: 'Use fractional coefficients if needed, then multiply through' },
    createdBy: teachers[2].teacherId },
 
  // ── Chemistry G9 | chapters[13] Acids, Bases and Salts ───────────────────
  { moduleId: 'MOD13102A', moduleName: 'Properties of Acids and Bases',
    chapterId: chapters[13].chapterId, grade: grades[0].gradeId, subject: subjects[2].subjectId,
    moduleContent: { text: 'Physical and chemical properties; natural indicators; neutralisation reactions; strength and concentration', videoUrl: 'https://learn.example.com/s1/chem/g9/acid-base' },
    extraTips: { tip1: 'Dilute acid + metal → salt + hydrogen; acid + base → salt + water', tip2: 'Blue litmus turns red in acid; red litmus turns blue in base' },
    createdBy: teachers[2].teacherId },
 
  { moduleId: 'MOD13102B', moduleName: 'pH Scale, Salts and Their Uses',
    chapterId: chapters[13].chapterId, grade: grades[0].gradeId, subject: subjects[2].subjectId,
    moduleContent: { text: 'pH concept; importance of pH in everyday life; preparation, properties and uses of NaOH, baking soda, bleach', videoUrl: 'https://learn.example.com/s1/chem/g9/ph-salts' },
    extraTips: { tip1: 'pH < 7 = acidic, pH 7 = neutral, pH > 7 = basic', tip2: 'Baking soda (NaHCO₃) is used in cooking and as an antacid' },
    createdBy: teachers[2].teacherId },
 
  // ── Chemistry G10 | chapters[14] Periodic Classification ─────────────────
  { moduleId: 'MOD13201A', moduleName: 'Historical Classification — Döbereiner to Mendeleev',
    chapterId: chapters[14].chapterId, grade: grades[1].gradeId, subject: subjects[2].subjectId,
    moduleContent: { text: "Döbereiner's triads, Newlands' octaves, Mendeleev's periodic law and limitations", videoUrl: 'https://learn.example.com/s1/chem/g10/periodic-history' },
    extraTips: { tip1: 'Mendeleev left gaps for undiscovered elements — a key strength of his table', tip2: 'Create a comparison table of the three historical classification systems' },
    createdBy: teachers[2].teacherId },
 
  { moduleId: 'MOD13201B', moduleName: 'The Modern Periodic Table',
    chapterId: chapters[14].chapterId, grade: grades[1].gradeId, subject: subjects[2].subjectId,
    moduleContent: { text: 'Modern periodic law; periods and groups; trends in atomic size, metallic character, valency, and electronegativity', videoUrl: 'https://learn.example.com/s1/chem/g10/modern-periodic' },
    extraTips: { tip1: 'Atomic size decreases across a period but increases down a group', tip2: 'Memorise the first 20 elements in order for quick reference' },
    createdBy: teachers[2].teacherId },
 
  // ── Chemistry G10 | chapters[15] Carbon and Its Compounds ────────────────
  { moduleId: 'MOD13202A', moduleName: 'Bonding in Carbon Compounds',
    chapterId: chapters[15].chapterId, grade: grades[1].gradeId, subject: subjects[2].subjectId,
    moduleContent: { text: 'Covalent bonding; tetravalency of carbon; catenation; homologous series; functional groups', videoUrl: 'https://learn.example.com/s1/chem/g10/carbon-bonding' },
    extraTips: { tip1: 'Each functional group determines chemical properties — learn them first', tip2: 'Draw structural formulas for the first five alkanes and alkenes' },
    createdBy: teachers[2].teacherId },
 
  { moduleId: 'MOD13202B', moduleName: 'Chemical Properties and Uses of Carbon Compounds',
    chapterId: chapters[15].chapterId, grade: grades[1].gradeId, subject: subjects[2].subjectId,
    moduleContent: { text: 'Combustion, oxidation, addition, substitution reactions; ethanol and ethanoic acid properties and uses; soaps and detergents', videoUrl: 'https://learn.example.com/s1/chem/g10/carbon-reactions' },
    extraTips: { tip1: 'Soaps form scum with hard water; detergents do not', tip2: 'Fermentation: C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂ — memorise this equation' },
    createdBy: teachers[2].teacherId },
 
  // ── Chemistry G11 | chapters[16] Structure of the Atom ───────────────────
  { moduleId: 'MOD13301A', moduleName: 'Atomic Models — Thomson to Bohr',
    chapterId: chapters[16].chapterId, grade: grades[2].gradeId, subject: subjects[2].subjectId,
    moduleContent: { text: "Thomson's plum-pudding, Rutherford's nuclear, and Bohr's planetary models; evidence from cathode-ray and alpha-scattering experiments", videoUrl: 'https://learn.example.com/s1/chem/g11/atomic-models' },
    extraTips: { tip1: 'Each model was refined because it could not explain certain experimental observations', tip2: 'Draw and annotate all three models for visual revision' },
    createdBy: teachers[2].teacherId },
 
  { moduleId: 'MOD13301B', moduleName: 'Quantum Numbers and Electronic Configuration',
    chapterId: chapters[16].chapterId, grade: grades[2].gradeId, subject: subjects[2].subjectId,
    moduleContent: { text: 'Four quantum numbers (n, l, m, s); Aufbau principle, Hund\'s rule, Pauli exclusion principle; writing electronic configurations', videoUrl: 'https://learn.example.com/s1/chem/g11/quantum-numbers' },
    extraTips: { tip1: 'Fill orbitals in order of increasing energy: 1s 2s 2p 3s 3p 4s 3d …', tip2: 'Half-filled and fully-filled sub-shells are extra stable (Cr, Cu exceptions)' },
    createdBy: teachers[2].teacherId },
 
  // ── Chemistry G11 | chapters[17] Chemical Bonding ────────────────────────
  { moduleId: 'MOD13302A', moduleName: 'Ionic and Covalent Bonding',
    chapterId: chapters[17].chapterId, grade: grades[2].gradeId, subject: subjects[2].subjectId,
    moduleContent: { text: 'Formation of ionic and covalent bonds; Lewis dot structures; formal charge; polar vs non-polar bonds', videoUrl: 'https://learn.example.com/s1/chem/g11/bonding' },
    extraTips: { tip1: 'Electronegativity difference > 1.7 → ionic; < 0.4 → non-polar covalent', tip2: 'Draw Lewis structures before predicting shape' },
    createdBy: teachers[2].teacherId },
 
  { moduleId: 'MOD13302B', moduleName: 'VSEPR Theory and Molecular Geometry',
    chapterId: chapters[17].chapterId, grade: grades[2].gradeId, subject: subjects[2].subjectId,
    moduleContent: { text: 'VSEPR model for predicting shapes; bond angles; hybridisation (sp, sp², sp³); polarity of molecules', videoUrl: 'https://learn.example.com/s1/chem/g11/vsepr' },
    extraTips: { tip1: 'Lone pairs repel more than bonding pairs — they compress bond angles', tip2: 'Count electron domains (bonds + lone pairs) to apply VSEPR' },
    createdBy: teachers[2].teacherId },
 
  // ── Biology G9 | chapters[18] The Fundamental Unit of Life ───────────────
  { moduleId: 'MOD14101A', moduleName: 'Cell Structure — Prokaryotic and Eukaryotic',
    chapterId: chapters[18].chapterId, grade: grades[0].gradeId, subject: subjects[3].subjectId,
    moduleContent: { text: 'Cell theory; prokaryotic vs eukaryotic cells; plant vs animal cell; roles of cell wall, membrane, nucleus', videoUrl: 'https://learn.example.com/s1/bio/g9/cell-structure' },
    extraTips: { tip1: 'Draw and label a plant cell and an animal cell from memory — it is worth marks', tip2: 'Remember: prokaryotes have no membrane-bound nucleus' },
    createdBy: teachers[3].teacherId },
 
  { moduleId: 'MOD14101B', moduleName: 'Cell Organelles and Their Functions',
    chapterId: chapters[18].chapterId, grade: grades[0].gradeId, subject: subjects[3].subjectId,
    moduleContent: { text: 'Mitochondria, chloroplasts, ribosomes, ER, Golgi apparatus, lysosomes, vacuoles — structure and function', videoUrl: 'https://learn.example.com/s1/bio/g9/organelles' },
    extraTips: { tip1: 'Mitochondria = powerhouse (ATP); Chloroplast = food factory (glucose)', tip2: 'Create a function table for each organelle for quick revision' },
    createdBy: teachers[3].teacherId },
 
  // ── Biology G9 | chapters[19] Tissues and Their Functions ────────────────
  { moduleId: 'MOD14102A', moduleName: 'Plant Tissues',
    chapterId: chapters[19].chapterId, grade: grades[0].gradeId, subject: subjects[3].subjectId,
    moduleContent: { text: 'Meristematic and permanent tissues (simple and complex); xylem and phloem structure and function', videoUrl: 'https://learn.example.com/s1/bio/g9/plant-tissue' },
    extraTips: { tip1: 'Xylem = water transport (upward); Phloem = food transport (bidirectional)', tip2: 'Collenchyma provides flexibility; sclerenchyma provides rigidity' },
    createdBy: teachers[3].teacherId },
 
  { moduleId: 'MOD14102B', moduleName: 'Animal Tissues',
    chapterId: chapters[19].chapterId, grade: grades[0].gradeId, subject: subjects[3].subjectId,
    moduleContent: { text: 'Epithelial, connective, muscular and nervous tissues — types, location and function', videoUrl: 'https://learn.example.com/s1/bio/g9/animal-tissue' },
    extraTips: { tip1: 'Smooth muscle is involuntary; skeletal is voluntary; cardiac is involuntary but striated', tip2: 'Neurons are the structural and functional unit of nervous tissue' },
    createdBy: teachers[3].teacherId },
 
  // ── Biology G10 | chapters[20] Life Processes ─────────────────────────────
  { moduleId: 'MOD14201A', moduleName: 'Nutrition and Photosynthesis',
    chapterId: chapters[20].chapterId, grade: grades[1].gradeId, subject: subjects[3].subjectId,
    moduleContent: { text: 'Autotrophic vs heterotrophic nutrition; photosynthesis equation; role of stomata; human digestive system', videoUrl: 'https://learn.example.com/s1/bio/g10/nutrition' },
    extraTips: { tip1: '6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂ — memorise and understand each component', tip2: 'Draw and label the human digestive system for diagram questions' },
    createdBy: teachers[3].teacherId },
 
  { moduleId: 'MOD14201B', moduleName: 'Respiration, Transportation and Excretion',
    chapterId: chapters[20].chapterId, grade: grades[1].gradeId, subject: subjects[3].subjectId,
    moduleContent: { text: 'Aerobic vs anaerobic respiration; double circulation; blood components; nephron structure and urine formation', videoUrl: 'https://learn.example.com/s1/bio/g10/resp-transport' },
    extraTips: { tip1: 'Aerobic: 38 ATP per glucose; anaerobic: only 2 ATP — efficiency matters', tip2: 'The nephron is the functional unit of the kidney — learn its structure' },
    createdBy: teachers[3].teacherId },
 
  // ── Biology G10 | chapters[21] Control and Coordination ──────────────────
  { moduleId: 'MOD14202A', moduleName: 'The Nervous System',
    chapterId: chapters[21].chapterId, grade: grades[1].gradeId, subject: subjects[3].subjectId,
    moduleContent: { text: 'Neurons; central and peripheral nervous system; reflex arc; brain regions and their functions', videoUrl: 'https://learn.example.com/s1/bio/g10/nervous-system' },
    extraTips: { tip1: 'A reflex arc bypasses the brain — it goes: receptor → sensory neuron → spinal cord → motor neuron → effector', tip2: 'Draw and label a neuron for diagram questions' },
    createdBy: teachers[3].teacherId },
 
  { moduleId: 'MOD14202B', moduleName: 'The Endocrine System',
    chapterId: chapters[21].chapterId, grade: grades[1].gradeId, subject: subjects[3].subjectId,
    moduleContent: { text: 'Endocrine glands; major hormones (insulin, thyroxin, adrenaline, testosterone, oestrogen) and their roles', videoUrl: 'https://learn.example.com/s1/bio/g10/endocrine' },
    extraTips: { tip1: 'Hormones are chemical messengers — slow but long-lasting; nerves are fast but short-lasting', tip2: 'Create a hormone → gland → function table for revision' },
    createdBy: teachers[3].teacherId },
 
  // ── Biology G11 | chapters[22] Cell: The Unit of Life ────────────────────
  { moduleId: 'MOD14301A', moduleName: 'Biomolecules — Carbohydrates, Proteins and Lipids',
    chapterId: chapters[22].chapterId, grade: grades[2].gradeId, subject: subjects[3].subjectId,
    moduleContent: { text: 'Monomers and polymers; glycosidic, peptide and ester bonds; primary to quaternary protein structure', videoUrl: 'https://learn.example.com/s1/bio/g11/biomolecules' },
    extraTips: { tip1: 'Enzymes are proteins — denature above optimal temperature', tip2: 'Lipids are energy stores; carbohydrates are quick energy sources' },
    createdBy: teachers[3].teacherId },
 
  { moduleId: 'MOD14301B', moduleName: 'Cell Cycle, Mitosis and Meiosis',
    chapterId: chapters[22].chapterId, grade: grades[2].gradeId, subject: subjects[3].subjectId,
    moduleContent: { text: 'Phases of the cell cycle (G1, S, G2, M); mitosis stages (PMAT); meiosis I and II; significance of each', videoUrl: 'https://learn.example.com/s1/bio/g11/cell-division' },
    extraTips: { tip1: 'Mitosis = 2 identical daughter cells (growth, repair); Meiosis = 4 haploid cells (reproduction)', tip2: 'Use PMAT — Prophase, Metaphase, Anaphase, Telophase — to remember stages' },
    createdBy: teachers[3].teacherId },
 
  // ── Biology G11 | chapters[23] Photosynthesis in Higher Plants ───────────
  { moduleId: 'MOD14302A', moduleName: 'Light Reactions — The Hill Reaction',
    chapterId: chapters[23].chapterId, grade: grades[2].gradeId, subject: subjects[3].subjectId,
    moduleContent: { text: 'Photosystems I and II; electron transport chain; photophosphorylation; role of water splitting; production of NADPH and ATP', videoUrl: 'https://learn.example.com/s1/bio/g11/light-reactions' },
    extraTips: { tip1: 'PS II comes first in the sequence despite its number — water is split here', tip2: 'ATP and NADPH from light reactions are used in the Calvin cycle' },
    createdBy: teachers[3].teacherId },
 
  { moduleId: 'MOD14302B', moduleName: 'Dark Reactions — The Calvin Cycle',
    chapterId: chapters[23].chapterId, grade: grades[2].gradeId, subject: subjects[3].subjectId,
    moduleContent: { text: 'CO₂ fixation by RuBisCO; C3, C4 and CAM pathways; regeneration of RuBP; net output of the cycle', videoUrl: 'https://learn.example.com/s1/bio/g11/calvin-cycle' },
    extraTips: { tip1: 'C4 plants (maize, sugarcane) minimise photorespiration — key adaptation', tip2: 'Remember: 3 CO₂ → 1 G3P → (eventually) 1 glucose' },
    createdBy: teachers[3].teacherId },
 
  // ── English G9 | chapters[24] Reading Comprehension ──────────────────────
  { moduleId: 'MOD15101A', moduleName: 'Identifying Main Idea and Supporting Details',
    chapterId: chapters[24].chapterId, grade: grades[0].gradeId, subject: subjects[4].subjectId,
    moduleContent: { text: 'Strategies for locating topic sentences, distinguishing main idea from details, skimming and scanning techniques', videoUrl: 'https://learn.example.com/s1/eng/g9/reading-main-idea' },
    extraTips: { tip1: 'Read the questions before reading the passage — it focuses your attention', tip2: 'The main idea is often stated in the first or last sentence of a paragraph' },
    createdBy: teachers[4].teacherId },
 
  { moduleId: 'MOD15101B', moduleName: 'Inference, Vocabulary in Context and Author\'s Purpose',
    chapterId: chapters[24].chapterId, grade: grades[0].gradeId, subject: subjects[4].subjectId,
    moduleContent: { text: 'Making inferences; using context clues to determine word meaning; identifying tone, mood and author\'s intent', videoUrl: 'https://learn.example.com/s1/eng/g9/inference' },
    extraTips: { tip1: 'Inference = fact + reasoning — never guess without textual evidence', tip2: 'Eliminate extreme answer choices ("always", "never") in inference questions' },
    createdBy: teachers[4].teacherId },
 
  // ── English G9 | chapters[25] Grammar and Composition ────────────────────
  { moduleId: 'MOD15102A', moduleName: 'Tenses and Voice',
    chapterId: chapters[25].chapterId, grade: grades[0].gradeId, subject: subjects[4].subjectId,
    moduleContent: { text: 'All 12 tense forms with signal words; active-to-passive and passive-to-active transformations', videoUrl: 'https://learn.example.com/s1/eng/g9/tenses-voice' },
    extraTips: { tip1: 'Passive voice: object + be-verb (past participle) + by + subject', tip2: 'Practice converting 10 sentences daily between active and passive' },
    createdBy: teachers[4].teacherId },
 
  { moduleId: 'MOD15102B', moduleName: 'Reported Speech and Clause Work',
    chapterId: chapters[25].chapterId, grade: grades[0].gradeId, subject: subjects[4].subjectId,
    moduleContent: { text: 'Direct to indirect speech; tense backshift rules; adjective, adverb and noun clauses with examples', videoUrl: 'https://learn.example.com/s1/eng/g9/reported-speech' },
    extraTips: { tip1: 'In reported speech, present tense shifts to past (say → said)', tip2: 'Identify the reporting verb first — it determines the transformation rule' },
    createdBy: teachers[4].teacherId },
 
  // ── English G10 | chapters[26] Prose and Poetry Analysis ─────────────────
  { moduleId: 'MOD15201A', moduleName: 'Analysing Prose — Character and Theme',
    chapterId: chapters[26].chapterId, grade: grades[1].gradeId, subject: subjects[4].subjectId,
    moduleContent: { text: 'Character analysis (direct vs indirect characterisation); central themes; plot structure; narrative point of view', videoUrl: 'https://learn.example.com/s1/eng/g10/prose-analysis' },
    extraTips: { tip1: 'Support every analysis point with a direct quote and page reference', tip2: 'Ask: what does the author want the reader to feel and why?' },
    createdBy: teachers[4].teacherId },
 
  { moduleId: 'MOD15201B', moduleName: 'Analysing Poetry — Devices and Meaning',
    chapterId: chapters[26].chapterId, grade: grades[1].gradeId, subject: subjects[4].subjectId,
    moduleContent: { text: 'Figures of speech (simile, metaphor, alliteration, onomatopoeia); rhyme scheme; rhythm; imagery; theme interpretation', videoUrl: 'https://learn.example.com/s1/eng/g10/poetry-analysis' },
    extraTips: { tip1: 'Read poetry aloud to feel the rhythm and identify sound devices', tip2: 'Use SLIMS: Structure, Language, Imagery, Mood, Summary for analysis' },
    createdBy: teachers[4].teacherId },
 
  // ── English G10 | chapters[27] Writing Skills ─────────────────────────────
  { moduleId: 'MOD15202A', moduleName: 'Formal Letters and Applications',
    chapterId: chapters[27].chapterId, grade: grades[1].gradeId, subject: subjects[4].subjectId,
    moduleContent: { text: 'Format of formal letters; tone and register; complaint, request and application letters with model answers', videoUrl: 'https://learn.example.com/s1/eng/g10/formal-letters' },
    extraTips: { tip1: 'Never use contractions or informal language in formal letters', tip2: 'Follow the format strictly — examiners award marks for layout too' },
    createdBy: teachers[4].teacherId },
 
  { moduleId: 'MOD15202B', moduleName: 'Essay Writing — Descriptive and Argumentative',
    chapterId: chapters[27].chapterId, grade: grades[1].gradeId, subject: subjects[4].subjectId,
    moduleContent: { text: 'Essay structure (intro–body–conclusion); descriptive techniques; constructing arguments with evidence and counter-arguments', videoUrl: 'https://learn.example.com/s1/eng/g10/essays' },
    extraTips: { tip1: 'Plan your essay for 5 minutes before writing — it prevents rambling', tip2: 'Each body paragraph should have one main idea, evidence, and explanation' },
    createdBy: teachers[4].teacherId },
 
  // ── English G11 | chapters[28] Advanced Reading and Inference ────────────
  { moduleId: 'MOD15301A', moduleName: 'Critical Reading and Evaluating Arguments',
    chapterId: chapters[28].chapterId, grade: grades[2].gradeId, subject: subjects[4].subjectId,
    moduleContent: { text: 'Identifying logical fallacies; evaluating evidence; distinguishing fact from opinion; bias and perspective analysis', videoUrl: 'https://learn.example.com/s1/eng/g11/critical-reading' },
    extraTips: { tip1: 'Ask: Is the evidence reliable? Is the reasoning valid? Is there another perspective?', tip2: 'Underline hedging language ("suggests", "may") — it indicates uncertainty' },
    createdBy: teachers[4].teacherId },
 
  { moduleId: 'MOD15301B', moduleName: 'Unseen Passage Analysis — Timed Practice',
    chapterId: chapters[28].chapterId, grade: grades[2].gradeId, subject: subjects[4].subjectId,
    moduleContent: { text: 'Exam strategy for unseen passages; answering in full sentences; note-making and summary writing techniques', videoUrl: 'https://learn.example.com/s1/eng/g11/unseen-practice' },
    extraTips: { tip1: 'Allocate 1 minute per mark as a rough time guide', tip2: 'For summary questions, use your own words — direct lifting loses marks' },
    createdBy: teachers[4].teacherId },
 
  // ── English G11 | chapters[29] Creative and Argumentative Writing ─────────
  { moduleId: 'MOD15302A', moduleName: 'Narrative and Creative Writing',
    chapterId: chapters[29].chapterId, grade: grades[2].gradeId, subject: subjects[4].subjectId,
    moduleContent: { text: 'Techniques for engaging openings; showing vs telling; dialogue punctuation; building suspense and climax', videoUrl: 'https://learn.example.com/s1/eng/g11/creative-writing' },
    extraTips: { tip1: 'Start in the middle of action (in medias res) to hook the reader immediately', tip2: 'Vary sentence length — short sentences create tension; long ones build atmosphere' },
    createdBy: teachers[4].teacherId },
 
  { moduleId: 'MOD15302B', moduleName: 'Argumentative and Discursive Writing',
    chapterId: chapters[29].chapterId, grade: grades[2].gradeId, subject: subjects[4].subjectId,
    moduleContent: { text: 'Thesis statement; PEEL paragraph structure; rhetorical devices; addressing counter-arguments; persuasive conclusion', videoUrl: 'https://learn.example.com/s1/eng/g11/argumentative' },
    extraTips: { tip1: 'PEEL: Point, Evidence, Explanation, Link back to the thesis', tip2: 'Acknowledge the opposing view and refute it — it strengthens your argument' },
    createdBy: teachers[4].teacherId },
 
  // ═══════════════════════════════════════════════════════════════════════════
  // SCH002 — Sunrise International School, Delhi  (teachers[5]–[9])
  // ═══════════════════════════════════════════════════════════════════════════
 
  // ── Mathematics G9 | chapters[30] Algebra Fundamentals ───────────────────
  { moduleId: 'MOD21101A', moduleName: 'Introduction to Algebra',
    chapterId: chapters[30].chapterId, grade: grades[0].gradeId, subject: subjects[0].subjectId,
    moduleContent: { text: 'Constants, variables, and algebraic expressions with worked examples', videoUrl: 'https://learn.example.com/s2/math/g9/algebra-intro' },
    extraTips: { tip1: 'Substitute numbers into expressions to verify simplifications', tip2: 'Write terms in descending powers of the variable' },
    createdBy: teachers[5].teacherId },
 
  { moduleId: 'MOD21101B', moduleName: 'Variables, Expressions and Simplification',
    chapterId: chapters[30].chapterId, grade: grades[0].gradeId, subject: subjects[0].subjectId,
    moduleContent: { text: 'Collecting like terms, expanding brackets, and BODMAS order of operations', videoUrl: 'https://learn.example.com/s2/math/g9/algebra-simplify' },
    extraTips: { tip1: 'Always expand brackets before collecting like terms', tip2: 'Use colour-coding to identify like terms quickly' },
    createdBy: teachers[5].teacherId },
 
  // ── Mathematics G9 | chapters[31] Linear Equations ───────────────────────
  { moduleId: 'MOD21102A', moduleName: 'Solving One-Variable Linear Equations',
    chapterId: chapters[31].chapterId, grade: grades[0].gradeId, subject: subjects[0].subjectId,
    moduleContent: { text: 'Balancing method, inverse operations, and verification of solutions', videoUrl: 'https://learn.example.com/s2/math/g9/linear-eq' },
    extraTips: { tip1: 'Always substitute your answer back to check it satisfies the original equation' },
    createdBy: teachers[5].teacherId },
 
  { moduleId: 'MOD21102B', moduleName: 'Word Problems — Linear Equations',
    chapterId: chapters[31].chapterId, grade: grades[0].gradeId, subject: subjects[0].subjectId,
    moduleContent: { text: 'Translating real-life scenarios into linear equations and solving them', videoUrl: 'https://learn.example.com/s2/math/g9/linear-word' },
    extraTips: { tip1: 'Define the variable clearly before forming the equation', tip2: 'Re-read the question to confirm your answer makes sense in context' },
    createdBy: teachers[5].teacherId },
 
  // ── Mathematics G10 | chapters[32] Quadratic Equations ───────────────────
  { moduleId: 'MOD21201A', moduleName: 'Factorisation Method for Quadratics',
    chapterId: chapters[32].chapterId, grade: grades[1].gradeId, subject: subjects[0].subjectId,
    moduleContent: { text: 'Splitting the middle term, grouping, and identifying roots by factorisation', videoUrl: 'https://learn.example.com/s2/math/g10/quad-factor' },
    extraTips: { tip1: 'Find two numbers whose product = ac and sum = b', tip2: 'Practice at least 15 problems for speed in exams' },
    createdBy: teachers[5].teacherId },
 
  { moduleId: 'MOD21201B', moduleName: 'Quadratic Formula and the Discriminant',
    chapterId: chapters[32].chapterId, grade: grades[1].gradeId, subject: subjects[0].subjectId,
    moduleContent: { text: 'Deriving and applying the quadratic formula; interpreting discriminant values', videoUrl: 'https://learn.example.com/s2/math/g10/quad-formula' },
    extraTips: { tip1: 'D > 0 → two distinct real roots; D = 0 → equal roots; D < 0 → no real roots', tip2: 'Memorise the formula: x = (−b ± √D) / 2a' },
    createdBy: teachers[5].teacherId },
 
  // ── Mathematics G10 | chapters[33] Trigonometry Basics ───────────────────
  { moduleId: 'MOD21202A', moduleName: 'Trigonometric Ratios',
    chapterId: chapters[33].chapterId, grade: grades[1].gradeId, subject: subjects[0].subjectId,
    moduleContent: { text: 'Defining sin, cos, tan and their reciprocals using right-angled triangles', videoUrl: 'https://learn.example.com/s2/math/g10/trig-ratios' },
    extraTips: { tip1: 'Use SOH-CAH-TOA as a memory aid', tip2: 'Label opposite, adjacent and hypotenuse before writing any ratio' },
    createdBy: teachers[5].teacherId },
 
  { moduleId: 'MOD21202B', moduleName: 'Trigonometric Identities and Standard Angles',
    chapterId: chapters[33].chapterId, grade: grades[1].gradeId, subject: subjects[0].subjectId,
    moduleContent: { text: 'Proving sin²θ + cos²θ = 1 and applying standard angle values (0°, 30°, 45°, 60°, 90°)', videoUrl: 'https://learn.example.com/s2/math/g10/trig-identity' },
    extraTips: { tip1: 'Start proofs from the more complex side', tip2: 'Memorise the standard angle table — it saves time in every exam' },
    createdBy: teachers[5].teacherId },
 
  // ── Mathematics G11 | chapters[34] Sets and Functions ────────────────────
  { moduleId: 'MOD21301A', moduleName: 'Introduction to Sets',
    chapterId: chapters[34].chapterId, grade: grades[2].gradeId, subject: subjects[0].subjectId,
    moduleContent: { text: 'Set notation, Venn diagrams, union, intersection, complement and power sets', videoUrl: 'https://learn.example.com/s2/math/g11/sets-intro' },
    extraTips: { tip1: 'Always draw a Venn diagram for three-set problems', tip2: 'The empty set ∅ is a subset of every set' },
    createdBy: teachers[5].teacherId },
 
  { moduleId: 'MOD21301B', moduleName: 'Functions — Domain, Range and Types',
    chapterId: chapters[34].chapterId, grade: grades[2].gradeId, subject: subjects[0].subjectId,
    moduleContent: { text: 'One-one, onto and bijective functions; finding domain and range; composition and inverse', videoUrl: 'https://learn.example.com/s2/math/g11/functions' },
    extraTips: { tip1: 'Apply the horizontal line test to check if a function is one-one', tip2: 'For inverse functions, swap x and y, then solve for y' },
    createdBy: teachers[5].teacherId },
 
  // ── Mathematics G11 | chapters[35] Permutations and Combinations ──────────
  { moduleId: 'MOD21302A', moduleName: 'Fundamental Principle of Counting',
    chapterId: chapters[35].chapterId, grade: grades[2].gradeId, subject: subjects[0].subjectId,
    moduleContent: { text: 'Multiplication and addition principles with real-life examples and tree diagrams', videoUrl: 'https://learn.example.com/s2/math/g11/counting' },
    extraTips: { tip1: 'Use multiplication when events happen together; addition when they are alternatives' },
    createdBy: teachers[5].teacherId },
 
  { moduleId: 'MOD21302B', moduleName: 'Permutations and Combinations — Formulas and Applications',
    chapterId: chapters[35].chapterId, grade: grades[2].gradeId, subject: subjects[0].subjectId,
    moduleContent: { text: 'nPr and nCr formulas, factorial notation, and problem-solving strategies', videoUrl: 'https://learn.example.com/s2/math/g11/perm-comb' },
    extraTips: { tip1: 'Permutation = order matters; Combination = order does not matter', tip2: 'Always check whether repetition is allowed in the problem' },
    createdBy: teachers[5].teacherId },
 
  // ── Physics G9 | chapters[36] Motion ─────────────────────────────────────
  { moduleId: 'MOD22101A', moduleName: 'Distance, Displacement and Speed',
    chapterId: chapters[36].chapterId, grade: grades[0].gradeId, subject: subjects[1].subjectId,
    moduleContent: { text: 'Scalar vs vector quantities; uniform and non-uniform motion; distance-time graphs', videoUrl: 'https://learn.example.com/s2/phys/g9/motion-basics' },
    extraTips: { tip1: 'Distance is always positive; displacement can be negative', tip2: 'Slope of a distance-time graph gives speed' },
    createdBy: teachers[6].teacherId },
 
  { moduleId: 'MOD22101B', moduleName: 'Velocity, Acceleration and Motion Graphs',
    chapterId: chapters[36].chapterId, grade: grades[0].gradeId, subject: subjects[1].subjectId,
    moduleContent: { text: 'Velocity-time graphs; equations of uniformly accelerated motion', videoUrl: 'https://learn.example.com/s2/phys/g9/motion-graphs' },
    extraTips: { tip1: 'Slope of velocity-time graph = acceleration; area under it = displacement', tip2: 'Write all three equations of motion at the top of your solution' },
    createdBy: teachers[6].teacherId },
 
  // ── Physics G9 | chapters[37] Laws of Motion ─────────────────────────────
  { moduleId: 'MOD22102A', moduleName: "Newton's Three Laws of Motion",
    chapterId: chapters[37].chapterId, grade: grades[0].gradeId, subject: subjects[1].subjectId,
    moduleContent: { text: 'Inertia, F = ma, and action-reaction pairs with everyday examples', videoUrl: 'https://learn.example.com/s2/phys/g9/newtons-laws' },
    extraTips: { tip1: 'Draw a free-body diagram before applying Newton\'s second law', tip2: 'Third law pairs act on different objects — never cancel each other' },
    createdBy: teachers[6].teacherId },
 
  { moduleId: 'MOD22102B', moduleName: 'Friction and Momentum',
    chapterId: chapters[37].chapterId, grade: grades[0].gradeId, subject: subjects[1].subjectId,
    moduleContent: { text: 'Types of friction, factors affecting it; momentum, impulse and conservation principle', videoUrl: 'https://learn.example.com/s2/phys/g9/friction-momentum' },
    extraTips: { tip1: 'Momentum is conserved only when no external force acts', tip2: 'Friction always opposes the direction of relative motion' },
    createdBy: teachers[6].teacherId },
 
  // ── Physics G10 | chapters[38] Light ─────────────────────────────────────
  { moduleId: 'MOD22201A', moduleName: 'Reflection of Light and Spherical Mirrors',
    chapterId: chapters[38].chapterId, grade: grades[1].gradeId, subject: subjects[1].subjectId,
    moduleContent: { text: 'Laws of reflection; ray diagrams for concave and convex mirrors; mirror formula', videoUrl: 'https://learn.example.com/s2/phys/g10/reflection' },
    extraTips: { tip1: 'Use the New Cartesian sign convention consistently', tip2: 'Verify mirror formula: 1/v + 1/u = 1/f' },
    createdBy: teachers[6].teacherId },
 
  { moduleId: 'MOD22201B', moduleName: 'Refraction of Light and Lenses',
    chapterId: chapters[38].chapterId, grade: grades[1].gradeId, subject: subjects[1].subjectId,
    moduleContent: { text: "Snell's law, refractive index, total internal reflection; convex and concave lens ray diagrams and lens formula", videoUrl: 'https://learn.example.com/s2/phys/g10/refraction' },
    extraTips: { tip1: 'Power of a lens P = 1/f (f in metres); convex lens has positive power', tip2: 'Draw two rays to locate the image; the third is a check' },
    createdBy: teachers[6].teacherId },
 
  // ── Physics G10 | chapters[39] Electricity ───────────────────────────────
  { moduleId: 'MOD22202A', moduleName: "Ohm's Law and Electrical Resistance",
    chapterId: chapters[39].chapterId, grade: grades[1].gradeId, subject: subjects[1].subjectId,
    moduleContent: { text: "Ohm's law; resistance and resistivity; series and parallel combinations", videoUrl: 'https://learn.example.com/s2/phys/g10/ohms-law' },
    extraTips: { tip1: 'In series: R_total = R1 + R2; in parallel: 1/R_total = 1/R1 + 1/R2', tip2: 'Always draw the circuit diagram before solving' },
    createdBy: teachers[6].teacherId },
 
  { moduleId: 'MOD22202B', moduleName: 'Electric Power and Heating Effect',
    chapterId: chapters[39].chapterId, grade: grades[1].gradeId, subject: subjects[1].subjectId,
    moduleContent: { text: 'Power P = VI = I²R; commercial unit of energy (kWh); heating effect and applications', videoUrl: 'https://learn.example.com/s2/phys/g10/electric-power' },
    extraTips: { tip1: '1 kWh = 3.6 × 10⁶ J — memorise this', tip2: 'Higher resistance → more heat produced for same current' },
    createdBy: teachers[6].teacherId },
 
  // ── Physics G11 | chapters[40] Units and Measurements ────────────────────
  { moduleId: 'MOD22301A', moduleName: 'SI Units and Dimensional Analysis',
    chapterId: chapters[40].chapterId, grade: grades[2].gradeId, subject: subjects[1].subjectId,
    moduleContent: { text: 'Seven base SI units; derived units; dimensional formula and its applications', videoUrl: 'https://learn.example.com/s2/phys/g11/si-units' },
    extraTips: { tip1: 'Dimensions must be the same on both sides of any physical equation', tip2: 'Always state units in every numerical answer' },
    createdBy: teachers[6].teacherId },
 
  { moduleId: 'MOD22301B', moduleName: 'Errors and Significant Figures',
    chapterId: chapters[40].chapterId, grade: grades[2].gradeId, subject: subjects[1].subjectId,
    moduleContent: { text: 'Systematic vs random errors; absolute, relative and percentage error; significant figures rules', videoUrl: 'https://learn.example.com/s2/phys/g11/errors' },
    extraTips: { tip1: 'Percentage error = (absolute error / true value) × 100', tip2: 'Round final answers to the least number of significant figures in the given data' },
    createdBy: teachers[6].teacherId },
 
  // ── Physics G11 | chapters[41] Kinematics ────────────────────────────────
  { moduleId: 'MOD22302A', moduleName: 'Motion in a Straight Line',
    chapterId: chapters[41].chapterId, grade: grades[2].gradeId, subject: subjects[1].subjectId,
    moduleContent: { text: 'Position-time and velocity-time graphs; equations of motion; free fall', videoUrl: 'https://learn.example.com/s2/phys/g11/straight-line' },
    extraTips: { tip1: 'Take downward direction as positive when analysing free fall', tip2: 'At maximum height, vertical velocity = 0' },
    createdBy: teachers[6].teacherId },
 
  { moduleId: 'MOD22302B', moduleName: 'Projectile Motion and Relative Motion',
    chapterId: chapters[41].chapterId, grade: grades[2].gradeId, subject: subjects[1].subjectId,
    moduleContent: { text: 'Horizontal and vertical components; range, time of flight; relative velocity in 1D and 2D', videoUrl: 'https://learn.example.com/s2/phys/g11/projectile' },
    extraTips: { tip1: 'Horizontal and vertical motions are independent — analyse them separately', tip2: 'Maximum range at 45° launch angle' },
    createdBy: teachers[6].teacherId },
 
  // ── Chemistry G9 | chapters[42] Chemical Reactions ───────────────────────
  { moduleId: 'MOD23101A', moduleName: 'Types of Chemical Reactions',
    chapterId: chapters[42].chapterId, grade: grades[0].gradeId, subject: subjects[2].subjectId,
    moduleContent: { text: 'Combination, decomposition, displacement, double-displacement and redox reactions', videoUrl: 'https://learn.example.com/s2/chem/g9/rxn-types' },
    extraTips: { tip1: 'Memorise the activity series for displacement reactions', tip2: 'Exothermic reactions release heat; endothermic absorb heat' },
    createdBy: teachers[7].teacherId },
 
  { moduleId: 'MOD23101B', moduleName: 'Balancing Chemical Equations',
    chapterId: chapters[42].chapterId, grade: grades[0].gradeId, subject: subjects[2].subjectId,
    moduleContent: { text: 'Law of conservation of mass; hit-and-trial and algebraic balancing methods', videoUrl: 'https://learn.example.com/s2/chem/g9/balancing' },
    extraTips: { tip1: 'Balance metals first, then non-metals, leave H and O for last', tip2: 'Use fractional coefficients if needed, then multiply through' },
    createdBy: teachers[7].teacherId },
 
  // ── Chemistry G9 | chapters[43] Acids, Bases and Salts ───────────────────
  { moduleId: 'MOD23102A', moduleName: 'Properties of Acids and Bases',
    chapterId: chapters[43].chapterId, grade: grades[0].gradeId, subject: subjects[2].subjectId,
    moduleContent: { text: 'Physical and chemical properties; indicators; neutralisation; strength vs concentration', videoUrl: 'https://learn.example.com/s2/chem/g9/acid-base' },
    extraTips: { tip1: 'Acid + metal → salt + hydrogen; acid + base → salt + water', tip2: 'Blue litmus → red in acid; red litmus → blue in base' },
    createdBy: teachers[7].teacherId },
 
  { moduleId: 'MOD23102B', moduleName: 'pH Scale, Salts and Their Uses',
    chapterId: chapters[43].chapterId, grade: grades[0].gradeId, subject: subjects[2].subjectId,
    moduleContent: { text: 'pH concept; everyday pH applications; NaOH, baking soda, bleaching powder', videoUrl: 'https://learn.example.com/s2/chem/g9/ph-salts' },
    extraTips: { tip1: 'pH < 7 = acidic, pH 7 = neutral, pH > 7 = basic', tip2: 'Baking soda (NaHCO₃) is used in cooking and as an antacid' },
    createdBy: teachers[7].teacherId },
 
  // ── Chemistry G10 | chapters[44] Periodic Classification ─────────────────
  { moduleId: 'MOD23201A', moduleName: 'Historical Classification — Döbereiner to Mendeleev',
    chapterId: chapters[44].chapterId, grade: grades[1].gradeId, subject: subjects[2].subjectId,
    moduleContent: { text: "Döbereiner's triads, Newlands' octaves, Mendeleev's periodic law and limitations", videoUrl: 'https://learn.example.com/s2/chem/g10/periodic-history' },
    extraTips: { tip1: 'Mendeleev left gaps for undiscovered elements', tip2: 'Create a comparison table of all three classification systems' },
    createdBy: teachers[7].teacherId },
 
  { moduleId: 'MOD23201B', moduleName: 'The Modern Periodic Table',
    chapterId: chapters[44].chapterId, grade: grades[1].gradeId, subject: subjects[2].subjectId,
    moduleContent: { text: 'Modern periodic law; trends in atomic size, metallic character, valency and electronegativity', videoUrl: 'https://learn.example.com/s2/chem/g10/modern-periodic' },
    extraTips: { tip1: 'Atomic size decreases across a period but increases down a group', tip2: 'Memorise the first 20 elements in order' },
    createdBy: teachers[7].teacherId },
 
  // ── Chemistry G10 | chapters[45] Carbon and Its Compounds ────────────────
  { moduleId: 'MOD23202A', moduleName: 'Bonding in Carbon Compounds',
    chapterId: chapters[45].chapterId, grade: grades[1].gradeId, subject: subjects[2].subjectId,
    moduleContent: { text: 'Covalent bonding; tetravalency; catenation; homologous series; functional groups', videoUrl: 'https://learn.example.com/s2/chem/g10/carbon-bonding' },
    extraTips: { tip1: 'Each functional group determines chemical properties — learn them first', tip2: 'Draw structural formulas for the first five alkanes and alkenes' },
    createdBy: teachers[7].teacherId },
 
  { moduleId: 'MOD23202B', moduleName: 'Chemical Properties and Uses of Carbon Compounds',
    chapterId: chapters[45].chapterId, grade: grades[1].gradeId, subject: subjects[2].subjectId,
    moduleContent: { text: 'Combustion, oxidation, addition, substitution; ethanol and ethanoic acid; soaps and detergents', videoUrl: 'https://learn.example.com/s2/chem/g10/carbon-reactions' },
    extraTips: { tip1: 'Soaps form scum with hard water; detergents do not', tip2: 'Fermentation: C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂' },
    createdBy: teachers[7].teacherId },
 
  // ── Chemistry G11 | chapters[46] Structure of the Atom ───────────────────
  { moduleId: 'MOD23301A', moduleName: 'Atomic Models — Thomson to Bohr',
    chapterId: chapters[46].chapterId, grade: grades[2].gradeId, subject: subjects[2].subjectId,
    moduleContent: { text: "Thomson's, Rutherford's, and Bohr's models; evidence from experiments", videoUrl: 'https://learn.example.com/s2/chem/g11/atomic-models' },
    extraTips: { tip1: 'Each model was refined because of experimental limitations', tip2: 'Draw and annotate all three models' },
    createdBy: teachers[7].teacherId },
 
  { moduleId: 'MOD23301B', moduleName: 'Quantum Numbers and Electronic Configuration',
    chapterId: chapters[46].chapterId, grade: grades[2].gradeId, subject: subjects[2].subjectId,
    moduleContent: { text: 'Four quantum numbers; Aufbau, Hund\'s rule, Pauli exclusion; writing configurations', videoUrl: 'https://learn.example.com/s2/chem/g11/quantum-numbers' },
    extraTips: { tip1: 'Fill orbitals in order: 1s 2s 2p 3s 3p 4s 3d …', tip2: 'Half-filled and fully-filled sub-shells are extra stable (Cr, Cu exceptions)' },
    createdBy: teachers[7].teacherId },
 
  // ── Chemistry G11 | chapters[47] Chemical Bonding ────────────────────────
  { moduleId: 'MOD23302A', moduleName: 'Ionic and Covalent Bonding',
    chapterId: chapters[47].chapterId, grade: grades[2].gradeId, subject: subjects[2].subjectId,
    moduleContent: { text: 'Formation of ionic and covalent bonds; Lewis dot structures; formal charge; polarity', videoUrl: 'https://learn.example.com/s2/chem/g11/bonding' },
    extraTips: { tip1: 'Electronegativity difference > 1.7 → ionic; < 0.4 → non-polar covalent', tip2: 'Draw Lewis structures before predicting shape' },
    createdBy: teachers[7].teacherId },
 
  { moduleId: 'MOD23302B', moduleName: 'VSEPR Theory and Molecular Geometry',
    chapterId: chapters[47].chapterId, grade: grades[2].gradeId, subject: subjects[2].subjectId,
    moduleContent: { text: 'VSEPR model; bond angles; hybridisation (sp, sp², sp³); polarity of molecules', videoUrl: 'https://learn.example.com/s2/chem/g11/vsepr' },
    extraTips: { tip1: 'Lone pairs repel more than bonding pairs — they compress bond angles', tip2: 'Count electron domains to apply VSEPR' },
    createdBy: teachers[7].teacherId },
 
  // ── Biology G9 | chapters[48] The Fundamental Unit of Life ───────────────
  { moduleId: 'MOD24101A', moduleName: 'Cell Structure — Prokaryotic and Eukaryotic',
    chapterId: chapters[48].chapterId, grade: grades[0].gradeId, subject: subjects[3].subjectId,
    moduleContent: { text: 'Cell theory; prokaryotic vs eukaryotic; plant vs animal cell; cell wall and membrane', videoUrl: 'https://learn.example.com/s2/bio/g9/cell-structure' },
    extraTips: { tip1: 'Draw and label plant and animal cells from memory', tip2: 'Prokaryotes have no membrane-bound nucleus' },
    createdBy: teachers[8].teacherId },
 
  { moduleId: 'MOD24101B', moduleName: 'Cell Organelles and Their Functions',
    chapterId: chapters[48].chapterId, grade: grades[0].gradeId, subject: subjects[3].subjectId,
    moduleContent: { text: 'Mitochondria, chloroplasts, ribosomes, ER, Golgi apparatus, lysosomes, vacuoles', videoUrl: 'https://learn.example.com/s2/bio/g9/organelles' },
    extraTips: { tip1: 'Mitochondria = powerhouse (ATP); Chloroplast = food factory (glucose)', tip2: 'Create a function table for each organelle' },
    createdBy: teachers[8].teacherId },
 
  // ── Biology G9 | chapters[49] Tissues ────────────────────────────────────
  { moduleId: 'MOD24102A', moduleName: 'Plant Tissues',
    chapterId: chapters[49].chapterId, grade: grades[0].gradeId, subject: subjects[3].subjectId,
    moduleContent: { text: 'Meristematic and permanent tissues; xylem and phloem structure and function', videoUrl: 'https://learn.example.com/s2/bio/g9/plant-tissue' },
    extraTips: { tip1: 'Xylem = water transport (upward); Phloem = food transport (bidirectional)', tip2: 'Collenchyma provides flexibility; sclerenchyma provides rigidity' },
    createdBy: teachers[8].teacherId },
 
  { moduleId: 'MOD24102B', moduleName: 'Animal Tissues',
    chapterId: chapters[49].chapterId, grade: grades[0].gradeId, subject: subjects[3].subjectId,
    moduleContent: { text: 'Epithelial, connective, muscular and nervous tissues — types, location and function', videoUrl: 'https://learn.example.com/s2/bio/g9/animal-tissue' },
    extraTips: { tip1: 'Smooth muscle = involuntary; skeletal = voluntary; cardiac = involuntary but striated', tip2: 'Neurons are the structural and functional unit of nervous tissue' },
    createdBy: teachers[8].teacherId },
 
  // ── Biology G10 | chapters[50] Life Processes ────────────────────────────
  { moduleId: 'MOD24201A', moduleName: 'Nutrition and Photosynthesis',
    chapterId: chapters[50].chapterId, grade: grades[1].gradeId, subject: subjects[3].subjectId,
    moduleContent: { text: 'Autotrophic vs heterotrophic nutrition; photosynthesis; human digestive system', videoUrl: 'https://learn.example.com/s2/bio/g10/nutrition' },
    extraTips: { tip1: '6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂ — memorise and understand each component', tip2: 'Draw and label the human digestive system' },
    createdBy: teachers[8].teacherId },
 
  { moduleId: 'MOD24201B', moduleName: 'Respiration, Transportation and Excretion',
    chapterId: chapters[50].chapterId, grade: grades[1].gradeId, subject: subjects[3].subjectId,
    moduleContent: { text: 'Aerobic vs anaerobic respiration; double circulation; blood components; nephron', videoUrl: 'https://learn.example.com/s2/bio/g10/resp-transport' },
    extraTips: { tip1: 'Aerobic: 38 ATP; anaerobic: 2 ATP per glucose', tip2: 'Nephron is the functional unit of the kidney' },
    createdBy: teachers[8].teacherId },
 
  // ── Biology G10 | chapters[51] Control and Coordination ──────────────────
  { moduleId: 'MOD24202A', moduleName: 'The Nervous System',
    chapterId: chapters[51].chapterId, grade: grades[1].gradeId, subject: subjects[3].subjectId,
    moduleContent: { text: 'Neurons; CNS and PNS; reflex arc; brain regions and functions', videoUrl: 'https://learn.example.com/s2/bio/g10/nervous-system' },
    extraTips: { tip1: 'Reflex arc: receptor → sensory neuron → spinal cord → motor neuron → effector', tip2: 'Draw and label a neuron' },
    createdBy: teachers[8].teacherId },
 
  { moduleId: 'MOD24202B', moduleName: 'The Endocrine System',
    chapterId: chapters[51].chapterId, grade: grades[1].gradeId, subject: subjects[3].subjectId,
    moduleContent: { text: 'Endocrine glands; insulin, thyroxin, adrenaline, testosterone, oestrogen and their roles', videoUrl: 'https://learn.example.com/s2/bio/g10/endocrine' },
    extraTips: { tip1: 'Hormones are slow but long-lasting; nerve signals are fast but short-lasting', tip2: 'Create a hormone → gland → function table' },
    createdBy: teachers[8].teacherId },
 
  // ── Biology G11 | chapters[52] Cell: The Unit of Life ────────────────────
  { moduleId: 'MOD24301A', moduleName: 'Biomolecules — Carbohydrates, Proteins and Lipids',
    chapterId: chapters[52].chapterId, grade: grades[2].gradeId, subject: subjects[3].subjectId,
    moduleContent: { text: 'Monomers and polymers; glycosidic, peptide and ester bonds; protein structure levels', videoUrl: 'https://learn.example.com/s2/bio/g11/biomolecules' },
    extraTips: { tip1: 'Enzymes are proteins — denature above optimal temperature', tip2: 'Lipids = energy stores; carbohydrates = quick energy sources' },
    createdBy: teachers[8].teacherId },
 
  { moduleId: 'MOD24301B', moduleName: 'Cell Cycle, Mitosis and Meiosis',
    chapterId: chapters[52].chapterId, grade: grades[2].gradeId, subject: subjects[3].subjectId,
    moduleContent: { text: 'Cell cycle phases; mitosis (PMAT); meiosis I and II; biological significance', videoUrl: 'https://learn.example.com/s2/bio/g11/cell-division' },
    extraTips: { tip1: 'Mitosis = 2 identical daughter cells; Meiosis = 4 haploid cells', tip2: 'PMAT: Prophase, Metaphase, Anaphase, Telophase' },
    createdBy: teachers[8].teacherId },
 
  // ── Biology G11 | chapters[53] Photosynthesis in Higher Plants ───────────
  { moduleId: 'MOD24302A', moduleName: 'Light Reactions — The Hill Reaction',
    chapterId: chapters[53].chapterId, grade: grades[2].gradeId, subject: subjects[3].subjectId,
    moduleContent: { text: 'Photosystems I and II; electron transport chain; photophosphorylation; NADPH and ATP production', videoUrl: 'https://learn.example.com/s2/bio/g11/light-reactions' },
    extraTips: { tip1: 'PS II comes first in the sequence — water is split here', tip2: 'ATP and NADPH from light reactions are used in the Calvin cycle' },
    createdBy: teachers[8].teacherId },
 
  { moduleId: 'MOD24302B', moduleName: 'Dark Reactions — The Calvin Cycle',
    chapterId: chapters[53].chapterId, grade: grades[2].gradeId, subject: subjects[3].subjectId,
    moduleContent: { text: 'CO₂ fixation by RuBisCO; C3, C4 and CAM pathways; regeneration of RuBP', videoUrl: 'https://learn.example.com/s2/bio/g11/calvin-cycle' },
    extraTips: { tip1: 'C4 plants (maize, sugarcane) minimise photorespiration', tip2: '3 CO₂ → 1 G3P → (eventually) 1 glucose' },
    createdBy: teachers[8].teacherId },
 
  // ── English G9 | chapters[54] Reading Comprehension ──────────────────────
  { moduleId: 'MOD25101A', moduleName: 'Identifying Main Idea and Supporting Details',
    chapterId: chapters[54].chapterId, grade: grades[0].gradeId, subject: subjects[4].subjectId,
    moduleContent: { text: 'Topic sentences, skimming and scanning, distinguishing main idea from details', videoUrl: 'https://learn.example.com/s2/eng/g9/reading-main-idea' },
    extraTips: { tip1: 'Read the questions before reading the passage', tip2: 'Main idea is often in the first or last sentence of a paragraph' },
    createdBy: teachers[9].teacherId },
 
  { moduleId: 'MOD25101B', moduleName: 'Inference, Vocabulary in Context and Author\'s Purpose',
    chapterId: chapters[54].chapterId, grade: grades[0].gradeId, subject: subjects[4].subjectId,
    moduleContent: { text: 'Making inferences; context clues; identifying tone, mood and author\'s intent', videoUrl: 'https://learn.example.com/s2/eng/g9/inference' },
    extraTips: { tip1: 'Inference = fact + reasoning — never guess without textual evidence', tip2: 'Eliminate extreme answer choices in inference questions' },
    createdBy: teachers[9].teacherId },
 
  // ── English G9 | chapters[55] Grammar and Composition ────────────────────
  { moduleId: 'MOD25102A', moduleName: 'Tenses and Voice',
    chapterId: chapters[55].chapterId, grade: grades[0].gradeId, subject: subjects[4].subjectId,
    moduleContent: { text: 'All 12 tense forms with signal words; active-to-passive transformations', videoUrl: 'https://learn.example.com/s2/eng/g9/tenses-voice' },
    extraTips: { tip1: 'Passive voice: object + be-verb (past participle) + by + subject', tip2: 'Practice converting 10 sentences daily' },
    createdBy: teachers[9].teacherId },
 
  { moduleId: 'MOD25102B', moduleName: 'Reported Speech and Clause Work',
    chapterId: chapters[55].chapterId, grade: grades[0].gradeId, subject: subjects[4].subjectId,
    moduleContent: { text: 'Direct to indirect speech; tense backshift; adjective, adverb and noun clauses', videoUrl: 'https://learn.example.com/s2/eng/g9/reported-speech' },
    extraTips: { tip1: 'Present tense shifts to past in reported speech', tip2: 'Identify the reporting verb first' },
    createdBy: teachers[9].teacherId },
 
  // ── English G10 | chapters[56] Prose and Poetry Analysis ─────────────────
  { moduleId: 'MOD25201A', moduleName: 'Analysing Prose — Character and Theme',
    chapterId: chapters[56].chapterId, grade: grades[1].gradeId, subject: subjects[4].subjectId,
    moduleContent: { text: 'Character analysis; central themes; plot structure; narrative point of view', videoUrl: 'https://learn.example.com/s2/eng/g10/prose-analysis' },
    extraTips: { tip1: 'Support every analysis point with a direct quote', tip2: 'Ask: what does the author want the reader to feel and why?' },
    createdBy: teachers[9].teacherId },
 
  { moduleId: 'MOD25201B', moduleName: 'Analysing Poetry — Devices and Meaning',
    chapterId: chapters[56].chapterId, grade: grades[1].gradeId, subject: subjects[4].subjectId,
    moduleContent: { text: 'Figures of speech; rhyme scheme; rhythm; imagery; theme interpretation', videoUrl: 'https://learn.example.com/s2/eng/g10/poetry-analysis' },
    extraTips: { tip1: 'Read poetry aloud to feel the rhythm', tip2: 'Use SLIMS: Structure, Language, Imagery, Mood, Summary' },
    createdBy: teachers[9].teacherId },
 
  // ── English G10 | chapters[57] Writing Skills ─────────────────────────────
  { moduleId: 'MOD25202A', moduleName: 'Formal Letters and Applications',
    chapterId: chapters[57].chapterId, grade: grades[1].gradeId, subject: subjects[4].subjectId,
    moduleContent: { text: 'Format of formal letters; tone and register; complaint, request and application letters', videoUrl: 'https://learn.example.com/s2/eng/g10/formal-letters' },
    extraTips: { tip1: 'Never use contractions in formal letters', tip2: 'Follow the format strictly — examiners award marks for layout' },
    createdBy: teachers[9].teacherId },
 
  { moduleId: 'MOD25202B', moduleName: 'Essay Writing — Descriptive and Argumentative',
    chapterId: chapters[57].chapterId, grade: grades[1].gradeId, subject: subjects[4].subjectId,
    moduleContent: { text: 'Essay structure; descriptive techniques; constructing arguments with evidence and counter-arguments', videoUrl: 'https://learn.example.com/s2/eng/g10/essays' },
    extraTips: { tip1: 'Plan your essay for 5 minutes before writing', tip2: 'Each body paragraph: one main idea, evidence, explanation' },
    createdBy: teachers[9].teacherId },
 
  // ── English G11 | chapters[58] Advanced Reading ───────────────────────────
  { moduleId: 'MOD25301A', moduleName: 'Critical Reading and Evaluating Arguments',
    chapterId: chapters[58].chapterId, grade: grades[2].gradeId, subject: subjects[4].subjectId,
    moduleContent: { text: 'Logical fallacies; evaluating evidence; fact vs opinion; bias and perspective', videoUrl: 'https://learn.example.com/s2/eng/g11/critical-reading' },
    extraTips: { tip1: 'Ask: Is the evidence reliable? Is the reasoning valid? Is there another perspective?', tip2: 'Underline hedging language — it indicates uncertainty' },
    createdBy: teachers[9].teacherId },
 
  { moduleId: 'MOD25301B', moduleName: 'Unseen Passage Analysis — Timed Practice',
    chapterId: chapters[58].chapterId, grade: grades[2].gradeId, subject: subjects[4].subjectId,
    moduleContent: { text: 'Exam strategy; answering in full sentences; note-making and summary writing', videoUrl: 'https://learn.example.com/s2/eng/g11/unseen-practice' },
    extraTips: { tip1: 'Allocate 1 minute per mark as a rough time guide', tip2: 'Use your own words in summaries — direct lifting loses marks' },
    createdBy: teachers[9].teacherId },
 
  // ── English G11 | chapters[59] Creative and Argumentative Writing ─────────
  { moduleId: 'MOD25302A', moduleName: 'Narrative and Creative Writing',
    chapterId: chapters[59].chapterId, grade: grades[2].gradeId, subject: subjects[4].subjectId,
    moduleContent: { text: 'Engaging openings; showing vs telling; dialogue punctuation; suspense and climax', videoUrl: 'https://learn.example.com/s2/eng/g11/creative-writing' },
    extraTips: { tip1: 'Start in the middle of action (in medias res) to hook the reader', tip2: 'Vary sentence length — short sentences create tension' },
    createdBy: teachers[9].teacherId },
 
  { moduleId: 'MOD25302B', moduleName: 'Argumentative and Discursive Writing',
    chapterId: chapters[59].chapterId, grade: grades[2].gradeId, subject: subjects[4].subjectId,
    moduleContent: { text: 'Thesis statement; PEEL paragraph structure; rhetorical devices; persuasive conclusion', videoUrl: 'https://learn.example.com/s2/eng/g11/argumentative' },
    extraTips: { tip1: 'PEEL: Point, Evidence, Explanation, Link back to thesis', tip2: 'Acknowledge and refute the opposing view — it strengthens your argument' },
    createdBy: teachers[9].teacherId },
]);
// Total: 120 modules ✓ (60 chapters × 2 modules each)

    // ─────────────────────────────────────────
    // MCQ POOLS  (realistic 5-question pools per module)
    // ─────────────────────────────────────────
    const mcqPools = await MCQPool.insertMany([
      // Math GRD001
      {
        poolId: 'MCQ001', grade: grades[0]._id, mcqBatchId: 1,
        result: { averageScore: 7.8, totalAttempts: 45 },
        studentAssigned: [students[0]._id, students[1]._id, students[3]._id, students[5]._id],
        moduleMcq: [
          { q: 'Simplify: 3x + 5x', options: ['2x', '8x', '15x', '8x²'], correct: 1 },
          { q: 'Which of these is a variable?', options: ['5', 'π', 'x', '100'], correct: 2 },
          { q: 'Evaluate 2a + b when a=3, b=4', options: ['9', '10', '14', '7'], correct: 1 },
          { q: 'What is the coefficient of x in 7x + 3?', options: ['3', '7', '10', '1'], correct: 1 },
          { q: 'Which expression is equivalent to 2(x + 3)?', options: ['2x + 3', '2x + 5', '2x + 6', 'x + 6'], correct: 2 },
        ]
      },
      {
        poolId: 'MCQ002', grade: grades[0]._id, mcqBatchId: 1,
        result: { averageScore: 8.2, totalAttempts: 45 },
        studentAssigned: [students[0]._id, students[1]._id, students[3]._id],
        moduleMcq: [
          { q: 'Solve: x + 5 = 12', options: ['5', '6', '7', '8'], correct: 2 },
          { q: 'Solve: 3x = 18', options: ['3', '5', '6', '9'], correct: 2 },
          { q: 'Solve: 2x - 3 = 7', options: ['2', '5', '4', '6'], correct: 1 },
          { q: 'If x/4 = 5, what is x?', options: ['9', '20', '1.25', '16'], correct: 1 },
          { q: 'Which value satisfies 5x + 1 = 21?', options: ['3', '4', '5', '6'], correct: 1 },
        ]
      },
      // Physics GRD001
      {
        poolId: 'MCQ003', grade: grades[0]._id, mcqBatchId: 2,
        result: { averageScore: 6.9, totalAttempts: 40 },
        studentAssigned: [students[0]._id, students[1]._id, students[3]._id, students[5]._id],
        moduleMcq: [
          { q: "Newton's first law is also called the law of?", options: ['Gravitation', 'Inertia', 'Acceleration', 'Action-Reaction'], correct: 1 },
          { q: 'Force = mass × ?', options: ['Speed', 'Velocity', 'Acceleration', 'Distance'], correct: 2 },
          { q: 'A body at rest will remain at rest unless acted upon by:', options: ['Gravity only', 'An external force', 'Friction', 'Momentum'], correct: 1 },
          { q: 'Unit of force in SI system is:', options: ['Joule', 'Watt', 'Newton', 'Pascal'], correct: 2 },
          { q: 'Which of these is a vector quantity?', options: ['Mass', 'Speed', 'Time', 'Velocity'], correct: 3 },
        ]
      },
      // Chemistry GRD001
      {
        poolId: 'MCQ004', grade: grades[0]._id, mcqBatchId: 3,
        result: { averageScore: 7.1, totalAttempts: 38 },
        studentAssigned: [students[1]._id, students[3]._id, students[5]._id],
        moduleMcq: [
          { q: 'A + B → AB is an example of which type of reaction?', options: ['Decomposition', 'Displacement', 'Combination', 'Double displacement'], correct: 2 },
          { q: 'Which gas is released when zinc reacts with dilute HCl?', options: ['Oxygen', 'Hydrogen', 'Chlorine', 'Carbon dioxide'], correct: 1 },
          { q: 'In Fe + CuSO₄ → FeSO₄ + Cu, iron is:', options: ['Reduced', 'Oxidised', 'Both oxidised and reduced', 'Neither'], correct: 1 },
          { q: 'Respiration is an example of which type of reaction?', options: ['Exothermic', 'Endothermic', 'Combination', 'Decomposition'], correct: 0 },
          { q: 'pH of a neutral solution is:', options: ['0', '7', '14', '1'], correct: 1 },
        ]
      },
      // Math GRD002
      {
        poolId: 'MCQ005', grade: grades[1]._id, mcqBatchId: 4,
        result: { averageScore: 7.4, totalAttempts: 50 },
        studentAssigned: [students[6]._id, students[7]._id, students[12]._id, students[14]._id, students[15]._id],
        moduleMcq: [
          { q: 'The roots of x² - 5x + 6 = 0 are:', options: ['2 and 3', '1 and 6', '−2 and −3', '2 and −3'], correct: 0 },
          { q: 'Discriminant of ax² + bx + c = 0 is:', options: ['b²-4ac', 'b²+4ac', '4ac-b²', '√(b²-4ac)'], correct: 0 },
          { q: 'If discriminant < 0, the equation has:', options: ['Two real roots', 'One real root', 'No real roots', 'Infinite roots'], correct: 2 },
          { q: 'Product of roots of x² + 5x + 6 = 0 is:', options: ['5', '-5', '6', '-6'], correct: 2 },
          { q: 'Solve: x² - 4 = 0. Values of x are:', options: ['±1', '±2', '±4', '±√2'], correct: 1 },
        ]
      },
      // Biology GRD002
      {
        poolId: 'MCQ006', grade: grades[1]._id, mcqBatchId: 5,
        result: { averageScore: 8.0, totalAttempts: 30 },
        studentAssigned: [students[7]._id, students[8]._id, students[15]._id, students[16]._id, students[17]._id],
        moduleMcq: [
          { q: 'Which organelle is called the powerhouse of the cell?', options: ['Ribosome', 'Nucleus', 'Mitochondria', 'Golgi body'], correct: 2 },
          { q: 'Photosynthesis occurs in which organelle?', options: ['Mitochondria', 'Chloroplast', 'Vacuole', 'Nucleus'], correct: 1 },
          { q: 'End products of aerobic respiration are:', options: ['CO₂ and H₂O', 'Glucose and O₂', 'ATP only', 'Lactic acid'], correct: 0 },
          { q: 'Which enzyme begins digestion of starch in the mouth?', options: ['Pepsin', 'Lipase', 'Amylase', 'Trypsin'], correct: 2 },
          { q: 'Blood is pumped to the lungs by the:', options: ['Left ventricle', 'Right ventricle', 'Left atrium', 'Right atrium'], correct: 1 },
        ]
      },
      // Math GRD003
      {
        poolId: 'MCQ007', grade: grades[2]._id, mcqBatchId: 6,
        result: { averageScore: 6.5, totalAttempts: 40 },
        studentAssigned: [students[18]._id, students[19]._id],
        moduleMcq: [
          { q: 'If A = {1,2,3} and B = {3,4,5}, then A∩B is:', options: ['{1,2,3,4,5}', '{3}', '{1,2}', '{}'], correct: 1 },
          { q: 'A function f is one-one if:', options: ['f(a) = f(b) ⟹ a = b', 'f is onto', 'Range = Codomain', 'f(a) ≠ f(b) always'], correct: 0 },
          { q: 'Number of subsets of a set with 3 elements is:', options: ['3', '6', '8', '9'], correct: 2 },
          { q: 'A × B has 12 elements. If A has 3 elements, B has:', options: ['3', '4', '6', '9'], correct: 1 },
          { q: 'The identity function maps x to:', options: ['0', '1', 'x', 'x²'], correct: 2 },
        ]
      },
    ]);

    // ─────────────────────────────────────────
    // ASSESSMENTS  (spread across students, modules, subjects)
    // Date helpers for realistic spread over the academic term
    // ─────────────────────────────────────────
    const d = (daysAgo) => new Date(Date.now() - daysAgo * 86400000);

    const assessments = await Assessment.insertMany([
      // MOD001 — Intro to Algebra (Math, GRD001)
      { testNo: 'ASN001', studentName: students[0]._id,  subject: subjects[0]._id, module: modules[0]._id,  mcqPool: mcqPools[0]._id, correctAnswers: { q1:1, q2:2, q3:1, q4:1, q5:2 }, submittedAt: d(60), result: 80 },
      { testNo: 'ASN002', studentName: students[1]._id,  subject: subjects[0]._id, module: modules[0]._id,  mcqPool: mcqPools[0]._id, correctAnswers: { q1:1, q2:2, q3:1, q4:1, q5:2 }, submittedAt: d(60), result: 75 },
      { testNo: 'ASN003', studentName: students[3]._id,  subject: subjects[0]._id, module: modules[0]._id,  mcqPool: mcqPools[0]._id, correctAnswers: { q1:1, q2:2, q3:1, q4:1, q5:2 }, submittedAt: d(60), result: 90 },
      { testNo: 'ASN004', studentName: students[5]._id,  subject: subjects[0]._id, module: modules[0]._id,  mcqPool: mcqPools[0]._id, correctAnswers: { q1:1, q2:2, q3:0, q4:1, q5:2 }, submittedAt: d(60), result: 60 },

      // MOD003 — One-Variable Equations (Math, GRD001)
      { testNo: 'ASN005', studentName: students[0]._id,  subject: subjects[0]._id, module: modules[2]._id,  mcqPool: mcqPools[1]._id, correctAnswers: { q1:2, q2:2, q3:1, q4:1, q5:1 }, submittedAt: d(45), result: 85 },
      { testNo: 'ASN006', studentName: students[1]._id,  subject: subjects[0]._id, module: modules[2]._id,  mcqPool: mcqPools[1]._id, correctAnswers: { q1:2, q2:2, q3:1, q4:1, q5:1 }, submittedAt: d(45), result: 70 },
      { testNo: 'ASN007', studentName: students[3]._id,  subject: subjects[0]._id, module: modules[2]._id,  mcqPool: mcqPools[1]._id, correctAnswers: { q1:2, q2:2, q3:1, q4:1, q5:1 }, submittedAt: d(45), result: 95 },

      // MOD006 — Newton's Laws (Physics, GRD001)
      { testNo: 'ASN008', studentName: students[0]._id,  subject: subjects[1]._id, module: modules[5]._id,  mcqPool: mcqPools[2]._id, correctAnswers: { q1:1, q2:2, q3:1, q4:2, q5:3 }, submittedAt: d(40), result: 80 },
      { testNo: 'ASN009', studentName: students[1]._id,  subject: subjects[1]._id, module: modules[5]._id,  mcqPool: mcqPools[2]._id, correctAnswers: { q1:1, q2:2, q3:1, q4:2, q5:3 }, submittedAt: d(40), result: 65 },
      { testNo: 'ASN010', studentName: students[3]._id,  subject: subjects[1]._id, module: modules[5]._id,  mcqPool: mcqPools[2]._id, correctAnswers: { q1:1, q2:2, q3:1, q4:2, q5:3 }, submittedAt: d(40), result: 75 },
      { testNo: 'ASN011', studentName: students[5]._id,  subject: subjects[1]._id, module: modules[5]._id,  mcqPool: mcqPools[2]._id, correctAnswers: { q1:1, q2:2, q3:1, q4:2, q5:3 }, submittedAt: d(40), result: 55 },

      // MOD009 — Chemical Reactions (Chem, GRD001)
      { testNo: 'ASN012', studentName: students[1]._id,  subject: subjects[2]._id, module: modules[8]._id,  mcqPool: mcqPools[3]._id, correctAnswers: { q1:2, q2:1, q3:1, q4:0, q5:1 }, submittedAt: d(35), result: 80 },
      { testNo: 'ASN013', studentName: students[3]._id,  subject: subjects[2]._id, module: modules[8]._id,  mcqPool: mcqPools[3]._id, correctAnswers: { q1:2, q2:1, q3:1, q4:0, q5:1 }, submittedAt: d(35), result: 70 },
      { testNo: 'ASN014', studentName: students[5]._id,  subject: subjects[2]._id, module: modules[8]._id,  mcqPool: mcqPools[3]._id, correctAnswers: { q1:2, q2:1, q3:1, q4:0, q5:1 }, submittedAt: d(35), result: 90 },

      // MOD014 — Factorisation (Math, GRD002)
      { testNo: 'ASN015', studentName: students[6]._id,  subject: subjects[0]._id, module: modules[13]._id, mcqPool: mcqPools[4]._id, correctAnswers: { q1:0, q2:0, q3:2, q4:2, q5:1 }, submittedAt: d(30), result: 80 },
      { testNo: 'ASN016', studentName: students[7]._id,  subject: subjects[0]._id, module: modules[13]._id, mcqPool: mcqPools[4]._id, correctAnswers: { q1:0, q2:0, q3:2, q4:2, q5:1 }, submittedAt: d(30), result: 85 },
      { testNo: 'ASN017', studentName: students[12]._id, subject: subjects[0]._id, module: modules[13]._id, mcqPool: mcqPools[4]._id, correctAnswers: { q1:0, q2:0, q3:2, q4:2, q5:1 }, submittedAt: d(30), result: 60 },
      { testNo: 'ASN018', studentName: students[14]._id, subject: subjects[0]._id, module: modules[13]._id, mcqPool: mcqPools[4]._id, correctAnswers: { q1:0, q2:0, q3:2, q4:2, q5:1 }, submittedAt: d(30), result: 75 },

      // MOD021 — Nutrition (Biology, GRD002)
      { testNo: 'ASN019', studentName: students[7]._id,  subject: subjects[3]._id, module: modules[20]._id, mcqPool: mcqPools[5]._id, correctAnswers: { q1:2, q2:1, q3:0, q4:2, q5:1 }, submittedAt: d(25), result: 90 },
      { testNo: 'ASN020', studentName: students[8]._id,  subject: subjects[3]._id, module: modules[20]._id, mcqPool: mcqPools[5]._id, correctAnswers: { q1:2, q2:1, q3:0, q4:2, q5:1 }, submittedAt: d(25), result: 70 },
      { testNo: 'ASN021', studentName: students[15]._id, subject: subjects[3]._id, module: modules[20]._id, mcqPool: mcqPools[5]._id, correctAnswers: { q1:2, q2:1, q3:0, q4:2, q5:1 }, submittedAt: d(25), result: 85 },
      { testNo: 'ASN022', studentName: students[16]._id, subject: subjects[3]._id, module: modules[20]._id, mcqPool: mcqPools[5]._id, correctAnswers: { q1:2, q2:1, q3:0, q4:2, q5:1 }, submittedAt: d(25), result: 80 },

      // MOD016 — Trig Ratios (Math, GRD002)
      { testNo: 'ASN023', studentName: students[6]._id,  subject: subjects[0]._id, module: modules[15]._id, mcqPool: mcqPools[4]._id, correctAnswers: { q1:0, q2:0, q3:2, q4:2, q5:1 }, submittedAt: d(20), result: 75 },
      { testNo: 'ASN024', studentName: students[12]._id, subject: subjects[0]._id, module: modules[15]._id, mcqPool: mcqPools[4]._id, correctAnswers: { q1:0, q2:0, q3:2, q4:2, q5:1 }, submittedAt: d(20), result: 65 },

      // MOD024 — Sets (Math, GRD003)
      { testNo: 'ASN025', studentName: students[18]._id, subject: subjects[0]._id, module: modules[23]._id, mcqPool: mcqPools[6]._id, correctAnswers: { q1:1, q2:0, q3:2, q4:1, q5:2 }, submittedAt: d(15), result: 70 },
      { testNo: 'ASN026', studentName: students[19]._id, subject: subjects[0]._id, module: modules[23]._id, mcqPool: mcqPools[6]._id, correctAnswers: { q1:1, q2:0, q3:2, q4:1, q5:2 }, submittedAt: d(15), result: 80 },
    ]);

    // ─────────────────────────────────────────
    // MCQ BATCHES  (one batch per assessment module pairing)
    // ─────────────────────────────────────────
    const mcqBatches = await MCQBatch.insertMany([
      { batchId: 'BAT001', moduleId: modules[0]._id,  assessmentId: assessments[0]._id,  mcqQuestions: mcqPools[0].moduleMcq, mcqAnswers: [1,2,1,1,2] },
      { batchId: 'BAT002', moduleId: modules[2]._id,  assessmentId: assessments[4]._id,  mcqQuestions: mcqPools[1].moduleMcq, mcqAnswers: [2,2,1,1,1] },
      { batchId: 'BAT003', moduleId: modules[5]._id,  assessmentId: assessments[7]._id,  mcqQuestions: mcqPools[2].moduleMcq, mcqAnswers: [1,2,1,2,3] },
      { batchId: 'BAT004', moduleId: modules[8]._id,  assessmentId: assessments[11]._id, mcqQuestions: mcqPools[3].moduleMcq, mcqAnswers: [2,1,1,0,1] },
      { batchId: 'BAT005', moduleId: modules[13]._id, assessmentId: assessments[14]._id, mcqQuestions: mcqPools[4].moduleMcq, mcqAnswers: [0,0,2,2,1] },
      { batchId: 'BAT006', moduleId: modules[20]._id, assessmentId: assessments[18]._id, mcqQuestions: mcqPools[5].moduleMcq, mcqAnswers: [2,1,0,2,1] },
      { batchId: 'BAT007', moduleId: modules[23]._id, assessmentId: assessments[24]._id, mcqQuestions: mcqPools[6].moduleMcq, mcqAnswers: [1,0,2,1,2] },
    ]);

    // ─────────────────────────────────────────
    // HOMEWORK REPOS  (one per module)
    // ─────────────────────────────────────────
    const homeworkRepos = await HomeworkRepo.insertMany([
      { homeworkId: 'HW001', moduleName: 'Introduction to Algebra',          homeworkQuestions: { questions: ['Simplify: 4x + 2x - x', 'Expand: 3(2a + b)', 'Evaluate: 5m - 2n when m=4, n=3'] }, extraTips: { tips: ['Show every step', 'Write the variable last'] }, moduleExtraTips: 'Revise BODMAS before attempting', moduleId: modules[0]._id,  grade: grades[0]._id, subject: subjects[0]._id, createdBy: teachers[0]._id },
      { homeworkId: 'HW002', moduleName: 'Solving One-Variable Equations',   homeworkQuestions: { questions: ['Solve: 4x + 7 = 23', 'Solve: 3(x-2) = 12', 'If 2x/3 = 8, find x'] }, extraTips: { tips: ['Isolate the variable', 'Check by substituting your answer'] }, moduleExtraTips: 'Always verify your solution', moduleId: modules[2]._id,  grade: grades[0]._id, subject: subjects[0]._id, createdBy: teachers[0]._id },
      { homeworkId: 'HW003', moduleName: "Newton's Laws of Motion",          homeworkQuestions: { questions: ['State and explain Newton\'s Second Law', 'A 5 kg body accelerates at 3 m/s². Find the force', 'Differentiate between mass and weight'] }, extraTips: { tips: ['Use F = ma', 'Include units in all answers'] }, moduleExtraTips: 'Draw free-body diagrams wherever possible', moduleId: modules[5]._id,  grade: grades[0]._id, subject: subjects[1]._id, createdBy: teachers[1]._id },
      { homeworkId: 'HW004', moduleName: 'Types of Chemical Reactions',      homeworkQuestions: { questions: ['Classify: CaO + H₂O → Ca(OH)₂', 'Balance: Fe + O₂ → Fe₂O₃', 'Give two examples of exothermic reactions from daily life'] }, extraTips: { tips: ['Identify reactants and products first', 'Check atom count on both sides'] }, moduleExtraTips: 'Refer to the activity series in your textbook', moduleId: modules[8]._id,  grade: grades[0]._id, subject: subjects[2]._id, createdBy: teachers[1]._id },
      { homeworkId: 'HW005', moduleName: 'Factorisation Method',             homeworkQuestions: { questions: ['Factorise: x² + 7x + 12', 'Factorise: 2x² - 5x + 3', 'Find roots of x² - 9 = 0 by factorisation'] }, extraTips: { tips: ['Split the middle term', 'Sum and product method'] }, moduleExtraTips: 'Practice at least 10 problems for speed', moduleId: modules[13]._id, grade: grades[1]._id, subject: subjects[0]._id, createdBy: teachers[3]._id },
      { homeworkId: 'HW006', moduleName: 'Trigonometric Ratios',             homeworkQuestions: { questions: ['Find sin, cos and tan for a 3-4-5 triangle', 'If tan θ = 1, find θ', 'Prove: sin²θ + cos²θ = 1'] }, extraTips: { tips: ['Draw the right-angled triangle', 'Label opposite, adjacent, hypotenuse'] }, moduleExtraTips: 'Memorise the standard angle table (0°, 30°, 45°, 60°, 90°)', moduleId: modules[15]._id, grade: grades[1]._id, subject: subjects[0]._id, createdBy: teachers[3]._id },
      { homeworkId: 'HW007', moduleName: 'Nutrition in Plants and Animals',  homeworkQuestions: { questions: ['Explain the process of photosynthesis with the chemical equation', 'Describe the role of the small intestine in digestion', 'Differentiate between autotrophic and heterotrophic nutrition'] }, extraTips: { tips: ['Use diagrams wherever possible', 'State the location of each step'] }, moduleExtraTips: 'Draw and label the human digestive system', moduleId: modules[20]._id, grade: grades[1]._id, subject: subjects[3]._id, createdBy: teachers[6]._id },
      { homeworkId: 'HW008', moduleName: 'Introduction to Sets',             homeworkQuestions: { questions: ['List all subsets of {a, b, c}', 'Find (A∪B) and (A∩B) for A={1,2,3,4} and B={3,4,5,6}', 'Draw a Venn diagram for three intersecting sets A, B, C'] }, extraTips: { tips: ['Remember: empty set ∅ is a subset of every set', 'Use curly braces for set notation'] }, moduleExtraTips: 'Venn diagrams make problems visual — always draw one', moduleId: modules[23]._id, grade: grades[2]._id, subject: subjects[0]._id, createdBy: teachers[8]._id },
    ]);

    // ─────────────────────────────────────────
    // HOMEWORK REPORTS
    // ─────────────────────────────────────────
    const homeworkReports = await HomeworkReport.insertMany([
      { reportId: 'HWREP001', chapterId: chapters[0]._id,  moduleName: 'Introduction to Algebra',          homeworkQuestions: homeworkRepos[0].homeworkQuestions, moduleId: modules[0]._id,  studentId: [students[0]._id, students[1]._id, students[3]._id, students[5]._id], submittedCount: 38, pendingCount: 7,  grade: grades[0]._id, subject: subjects[0]._id, submittedBy: d(55) },
      { reportId: 'HWREP002', chapterId: chapters[1]._id,  moduleName: 'Solving One-Variable Equations',   homeworkQuestions: homeworkRepos[1].homeworkQuestions, moduleId: modules[2]._id,  studentId: [students[0]._id, students[1]._id, students[3]._id],                 submittedCount: 40, pendingCount: 5,  grade: grades[0]._id, subject: subjects[0]._id, submittedBy: d(42) },
      { reportId: 'HWREP003', chapterId: chapters[3]._id,  moduleName: "Newton's Laws of Motion",          homeworkQuestions: homeworkRepos[2].homeworkQuestions, moduleId: modules[5]._id,  studentId: [students[0]._id, students[1]._id, students[3]._id, students[5]._id], submittedCount: 35, pendingCount: 10, grade: grades[0]._id, subject: subjects[1]._id, submittedBy: d(37) },
      { reportId: 'HWREP004', chapterId: chapters[5]._id,  moduleName: 'Types of Chemical Reactions',      homeworkQuestions: homeworkRepos[3].homeworkQuestions, moduleId: modules[8]._id,  studentId: [students[1]._id, students[3]._id, students[5]._id],                 submittedCount: 30, pendingCount: 8,  grade: grades[0]._id, subject: subjects[2]._id, submittedBy: d(32) },
      { reportId: 'HWREP005', chapterId: chapters[9]._id,  moduleName: 'Factorisation Method',             homeworkQuestions: homeworkRepos[4].homeworkQuestions, moduleId: modules[13]._id, studentId: [students[6]._id, students[7]._id, students[12]._id, students[14]._id], submittedCount: 42, pendingCount: 8,  grade: grades[1]._id, subject: subjects[0]._id, submittedBy: d(27) },
      { reportId: 'HWREP006', chapterId: chapters[10]._id, moduleName: 'Trigonometric Ratios',             homeworkQuestions: homeworkRepos[5].homeworkQuestions, moduleId: modules[15]._id, studentId: [students[6]._id, students[12]._id],                               submittedCount: 45, pendingCount: 5,  grade: grades[1]._id, subject: subjects[0]._id, submittedBy: d(17) },
      { reportId: 'HWREP007', chapterId: chapters[15]._id, moduleName: 'Nutrition in Plants and Animals',  homeworkQuestions: homeworkRepos[6].homeworkQuestions, moduleId: modules[20]._id, studentId: [students[7]._id, students[8]._id, students[15]._id, students[16]._id, students[17]._id], submittedCount: 28, pendingCount: 2,  grade: grades[1]._id, subject: subjects[3]._id, submittedBy: d(22) },
      { reportId: 'HWREP008', chapterId: chapters[20]._id, moduleName: 'Introduction to Sets',             homeworkQuestions: homeworkRepos[7].homeworkQuestions, moduleId: modules[23]._id, studentId: [students[18]._id, students[19]._id],                             submittedCount: 36, pendingCount: 4,  grade: grades[2]._id, subject: subjects[0]._id, submittedBy: d(12) },
    ]);

    // ─────────────────────────────────────────
    // RESULT REPORTS
    // ─────────────────────────────────────────
    // ─────────────────────────────────────────────────────────────────────────────
// RESULT REPORTS — SCH002 (Sunrise International School, Delhi)
// Students: STU010–STU025  (indices students[9]–students[24])
//
// Per student: 4 subjects × 2 chapters × 2 modules = 16 reports
// Total: 15 students × 16 = 240 result reports
//
// SCH002 Chapter index map (chapters array, 0-based):
//   Math    G9  → chapters[30], chapters[31]
//   Math    G10 → chapters[32], chapters[33]
//   Math    G11 → chapters[34], chapters[35]
//   Physics G9  → chapters[36], chapters[37]
//   Physics G10 → chapters[38], chapters[39]
//   Physics G11 → chapters[40], chapters[41]
//   Chem    G9  → chapters[42], chapters[43]
//   Chem    G10 → chapters[44], chapters[45]
//   Chem    G11 → chapters[46], chapters[47]
//   Biology G9  → chapters[48], chapters[49]
//   Biology G10 → chapters[50], chapters[51]
//   Biology G11 → chapters[52], chapters[53]
//   English G9  → chapters[54], chapters[55]
//   English G10 → chapters[56], chapters[57]
//   English G11 → chapters[58], chapters[59]
//
// SCH002 Module ID convention: MOD2<sub><grade><chap><A|B>
//   e.g. MOD21101A = SCH2, Math(1), G9(1), Chapter1, Module A
//
// Subject indices: subjects[0]=Math, subjects[1]=Physics,
//                 subjects[2]=Chemistry, subjects[3]=Biology, subjects[4]=English
// Grade indices:   grades[0]=G9, grades[1]=G10, grades[2]=G11
// ─────────────────────────────────────────────────────────────────────────────

const resultReports = await ResultReport.insertMany([

  // ═══════════════════════════════════════════════════════════════════════════
  // STU010 — Vikram Nair | Grade 9 | subjects: Math, Physics, Chemistry, English
  // ═══════════════════════════════════════════════════════════════════════════
  // Mathematics
  { reportId: 'RPT2010001', studentId: students[9].studentId, studentName: 'Vikram Nair',     grade: grades[0].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[30].chapterId, moduleNo: 'MOD21101A', createdAt: d(58), result: 72 },
  { reportId: 'RPT2010002', studentId: students[9].studentId, studentName: 'Vikram Nair',     grade: grades[0].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[30].chapterId, moduleNo: 'MOD21101B', createdAt: d(55), result: 68 },
  { reportId: 'RPT2010003', studentId: students[9].studentId, studentName: 'Vikram Nair',     grade: grades[0].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[31].chapterId, moduleNo: 'MOD21102A', createdAt: d(45), result: 75 },
  { reportId: 'RPT2010004', studentId: students[9].studentId, studentName: 'Vikram Nair',     grade: grades[0].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[31].chapterId, moduleNo: 'MOD21102B', createdAt: d(42), result: 70 },
  // Physics
  { reportId: 'RPT2010005', studentId: students[9].studentId, studentName: 'Vikram Nair',     grade: grades[0].gradeId, subjectId: subjects[1].subjectId, chapterNo: chapters[36].chapterId, moduleNo: 'MOD22101A', createdAt: d(40), result: 65 },
  { reportId: 'RPT2010006', studentId: students[9].studentId, studentName: 'Vikram Nair',     grade: grades[0].gradeId, subjectId: subjects[1].subjectId, chapterNo: chapters[36].chapterId, moduleNo: 'MOD22101B', createdAt: d(37), result: 60 },
  { reportId: 'RPT2010007', studentId: students[9].studentId, studentName: 'Vikram Nair',     grade: grades[0].gradeId, subjectId: subjects[1].subjectId, chapterNo: chapters[37].chapterId, moduleNo: 'MOD22102A', createdAt: d(30), result: 70 },
  { reportId: 'RPT2010008', studentId: students[9].studentId, studentName: 'Vikram Nair',     grade: grades[0].gradeId, subjectId: subjects[1].subjectId, chapterNo: chapters[37].chapterId, moduleNo: 'MOD22102B', createdAt: d(27), result: 68 },
  // Chemistry
  { reportId: 'RPT2010009', studentId: students[9].studentId, studentName: 'Vikram Nair',     grade: grades[0].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[42].chapterId, moduleNo: 'MOD23101A', createdAt: d(25), result: 78 },
  { reportId: 'RPT2010010', studentId: students[9].studentId, studentName: 'Vikram Nair',     grade: grades[0].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[42].chapterId, moduleNo: 'MOD23101B', createdAt: d(22), result: 74 },
  { reportId: 'RPT2010011', studentId: students[9].studentId, studentName: 'Vikram Nair',     grade: grades[0].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[43].chapterId, moduleNo: 'MOD23102A', createdAt: d(18), result: 80 },
  { reportId: 'RPT2010012', studentId: students[9].studentId, studentName: 'Vikram Nair',     grade: grades[0].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[43].chapterId, moduleNo: 'MOD23102B', createdAt: d(15), result: 76 },
  // English
  { reportId: 'RPT2010013', studentId: students[9].studentId, studentName: 'Vikram Nair',     grade: grades[0].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[54].chapterId, moduleNo: 'MOD25101A', createdAt: d(13), result: 82 },
  { reportId: 'RPT2010014', studentId: students[9].studentId, studentName: 'Vikram Nair',     grade: grades[0].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[54].chapterId, moduleNo: 'MOD25101B', createdAt: d(11), result: 79 },
  { reportId: 'RPT2010015', studentId: students[9].studentId, studentName: 'Vikram Nair',     grade: grades[0].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[55].chapterId, moduleNo: 'MOD25102A', createdAt: d(8),  result: 85 },
  { reportId: 'RPT2010016', studentId: students[9].studentId, studentName: 'Vikram Nair',     grade: grades[0].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[55].chapterId, moduleNo: 'MOD25102B', createdAt: d(5),  result: 83 },

  // ═══════════════════════════════════════════════════════════════════════════
  // STU011 — Ananya Reddy | Grade 9 | subjects: Math, Physics, Chemistry, English
  // ═══════════════════════════════════════════════════════════════════════════
  // Mathematics
  { reportId: 'RPT2011001', studentId: students[10].studentId, studentName: 'Ananya Reddy',   grade: grades[0].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[30].chapterId, moduleNo: 'MOD21101A', createdAt: d(58), result: 88 },
  { reportId: 'RPT2011002', studentId: students[10].studentId, studentName: 'Ananya Reddy',   grade: grades[0].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[30].chapterId, moduleNo: 'MOD21101B', createdAt: d(55), result: 85 },
  { reportId: 'RPT2011003', studentId: students[10].studentId, studentName: 'Ananya Reddy',   grade: grades[0].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[31].chapterId, moduleNo: 'MOD21102A', createdAt: d(45), result: 90 },
  { reportId: 'RPT2011004', studentId: students[10].studentId, studentName: 'Ananya Reddy',   grade: grades[0].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[31].chapterId, moduleNo: 'MOD21102B', createdAt: d(42), result: 87 },
  // Physics
  { reportId: 'RPT2011005', studentId: students[10].studentId, studentName: 'Ananya Reddy',   grade: grades[0].gradeId, subjectId: subjects[1].subjectId, chapterNo: chapters[36].chapterId, moduleNo: 'MOD22101A', createdAt: d(40), result: 80 },
  { reportId: 'RPT2011006', studentId: students[10].studentId, studentName: 'Ananya Reddy',   grade: grades[0].gradeId, subjectId: subjects[1].subjectId, chapterNo: chapters[36].chapterId, moduleNo: 'MOD22101B', createdAt: d(37), result: 78 },
  { reportId: 'RPT2011007', studentId: students[10].studentId, studentName: 'Ananya Reddy',   grade: grades[0].gradeId, subjectId: subjects[1].subjectId, chapterNo: chapters[37].chapterId, moduleNo: 'MOD22102A', createdAt: d(30), result: 83 },
  { reportId: 'RPT2011008', studentId: students[10].studentId, studentName: 'Ananya Reddy',   grade: grades[0].gradeId, subjectId: subjects[1].subjectId, chapterNo: chapters[37].chapterId, moduleNo: 'MOD22102B', createdAt: d(27), result: 81 },
  // Chemistry
  { reportId: 'RPT2011009', studentId: students[10].studentId, studentName: 'Ananya Reddy',   grade: grades[0].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[42].chapterId, moduleNo: 'MOD23101A', createdAt: d(25), result: 86 },
  { reportId: 'RPT2011010', studentId: students[10].studentId, studentName: 'Ananya Reddy',   grade: grades[0].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[42].chapterId, moduleNo: 'MOD23101B', createdAt: d(22), result: 84 },
  { reportId: 'RPT2011011', studentId: students[10].studentId, studentName: 'Ananya Reddy',   grade: grades[0].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[43].chapterId, moduleNo: 'MOD23102A', createdAt: d(18), result: 89 },
  { reportId: 'RPT2011012', studentId: students[10].studentId, studentName: 'Ananya Reddy',   grade: grades[0].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[43].chapterId, moduleNo: 'MOD23102B', createdAt: d(15), result: 87 },
  // English
  { reportId: 'RPT2011013', studentId: students[10].studentId, studentName: 'Ananya Reddy',   grade: grades[0].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[54].chapterId, moduleNo: 'MOD25101A', createdAt: d(13), result: 91 },
  { reportId: 'RPT2011014', studentId: students[10].studentId, studentName: 'Ananya Reddy',   grade: grades[0].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[54].chapterId, moduleNo: 'MOD25101B', createdAt: d(11), result: 88 },
  { reportId: 'RPT2011015', studentId: students[10].studentId, studentName: 'Ananya Reddy',   grade: grades[0].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[55].chapterId, moduleNo: 'MOD25102A', createdAt: d(8),  result: 93 },
  { reportId: 'RPT2011016', studentId: students[10].studentId, studentName: 'Ananya Reddy',   grade: grades[0].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[55].chapterId, moduleNo: 'MOD25102B', createdAt: d(5),  result: 90 },

  // ═══════════════════════════════════════════════════════════════════════════
  // STU012 — Karan Joshi | Grade 9 | subjects: Math, Chemistry, Biology, English
  // ═══════════════════════════════════════════════════════════════════════════
  // Mathematics
  { reportId: 'RPT2012001', studentId: students[11].studentId, studentName: 'Karan Joshi',    grade: grades[0].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[30].chapterId, moduleNo: 'MOD21101A', createdAt: d(58), result: 55 },
  { reportId: 'RPT2012002', studentId: students[11].studentId, studentName: 'Karan Joshi',    grade: grades[0].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[30].chapterId, moduleNo: 'MOD21101B', createdAt: d(55), result: 52 },
  { reportId: 'RPT2012003', studentId: students[11].studentId, studentName: 'Karan Joshi',    grade: grades[0].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[31].chapterId, moduleNo: 'MOD21102A', createdAt: d(45), result: 58 },
  { reportId: 'RPT2012004', studentId: students[11].studentId, studentName: 'Karan Joshi',    grade: grades[0].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[31].chapterId, moduleNo: 'MOD21102B', createdAt: d(42), result: 60 },
  // Chemistry
  { reportId: 'RPT2012005', studentId: students[11].studentId, studentName: 'Karan Joshi',    grade: grades[0].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[42].chapterId, moduleNo: 'MOD23101A', createdAt: d(40), result: 70 },
  { reportId: 'RPT2012006', studentId: students[11].studentId, studentName: 'Karan Joshi',    grade: grades[0].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[42].chapterId, moduleNo: 'MOD23101B', createdAt: d(37), result: 67 },
  { reportId: 'RPT2012007', studentId: students[11].studentId, studentName: 'Karan Joshi',    grade: grades[0].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[43].chapterId, moduleNo: 'MOD23102A', createdAt: d(30), result: 73 },
  { reportId: 'RPT2012008', studentId: students[11].studentId, studentName: 'Karan Joshi',    grade: grades[0].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[43].chapterId, moduleNo: 'MOD23102B', createdAt: d(27), result: 71 },
  // Biology
  { reportId: 'RPT2012009', studentId: students[11].studentId, studentName: 'Karan Joshi',    grade: grades[0].gradeId, subjectId: subjects[3].subjectId, chapterNo: chapters[48].chapterId, moduleNo: 'MOD24101A', createdAt: d(25), result: 78 },
  { reportId: 'RPT2012010', studentId: students[11].studentId, studentName: 'Karan Joshi',    grade: grades[0].gradeId, subjectId: subjects[3].subjectId, chapterNo: chapters[48].chapterId, moduleNo: 'MOD24101B', createdAt: d(22), result: 75 },
  { reportId: 'RPT2012011', studentId: students[11].studentId, studentName: 'Karan Joshi',    grade: grades[0].gradeId, subjectId: subjects[3].subjectId, chapterNo: chapters[49].chapterId, moduleNo: 'MOD24102A', createdAt: d(18), result: 80 },
  { reportId: 'RPT2012012', studentId: students[11].studentId, studentName: 'Karan Joshi',    grade: grades[0].gradeId, subjectId: subjects[3].subjectId, chapterNo: chapters[49].chapterId, moduleNo: 'MOD24102B', createdAt: d(15), result: 77 },
  // English
  { reportId: 'RPT2012013', studentId: students[11].studentId, studentName: 'Karan Joshi',    grade: grades[0].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[54].chapterId, moduleNo: 'MOD25101A', createdAt: d(13), result: 83 },
  { reportId: 'RPT2012014', studentId: students[11].studentId, studentName: 'Karan Joshi',    grade: grades[0].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[54].chapterId, moduleNo: 'MOD25101B', createdAt: d(11), result: 80 },
  { reportId: 'RPT2012015', studentId: students[11].studentId, studentName: 'Karan Joshi',    grade: grades[0].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[55].chapterId, moduleNo: 'MOD25102A', createdAt: d(8),  result: 86 },
  { reportId: 'RPT2012016', studentId: students[11].studentId, studentName: 'Karan Joshi',    grade: grades[0].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[55].chapterId, moduleNo: 'MOD25102B', createdAt: d(5),  result: 84 },

  // ═══════════════════════════════════════════════════════════════════════════
  // STU013 — Pooja Malhotra | Grade 9 | subjects: Math, Physics, Chemistry, English
  // ═══════════════════════════════════════════════════════════════════════════
  // Mathematics
  { reportId: 'RPT2013001', studentId: students[12].studentId, studentName: 'Pooja Malhotra', grade: grades[0].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[30].chapterId, moduleNo: 'MOD21101A', createdAt: d(58), result: 92 },
  { reportId: 'RPT2013002', studentId: students[12].studentId, studentName: 'Pooja Malhotra', grade: grades[0].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[30].chapterId, moduleNo: 'MOD21101B', createdAt: d(55), result: 90 },
  { reportId: 'RPT2013003', studentId: students[12].studentId, studentName: 'Pooja Malhotra', grade: grades[0].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[31].chapterId, moduleNo: 'MOD21102A', createdAt: d(45), result: 94 },
  { reportId: 'RPT2013004', studentId: students[12].studentId, studentName: 'Pooja Malhotra', grade: grades[0].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[31].chapterId, moduleNo: 'MOD21102B', createdAt: d(42), result: 91 },
  // Physics
  { reportId: 'RPT2013005', studentId: students[12].studentId, studentName: 'Pooja Malhotra', grade: grades[0].gradeId, subjectId: subjects[1].subjectId, chapterNo: chapters[36].chapterId, moduleNo: 'MOD22101A', createdAt: d(40), result: 88 },
  { reportId: 'RPT2013006', studentId: students[12].studentId, studentName: 'Pooja Malhotra', grade: grades[0].gradeId, subjectId: subjects[1].subjectId, chapterNo: chapters[36].chapterId, moduleNo: 'MOD22101B', createdAt: d(37), result: 85 },
  { reportId: 'RPT2013007', studentId: students[12].studentId, studentName: 'Pooja Malhotra', grade: grades[0].gradeId, subjectId: subjects[1].subjectId, chapterNo: chapters[37].chapterId, moduleNo: 'MOD22102A', createdAt: d(30), result: 90 },
  { reportId: 'RPT2013008', studentId: students[12].studentId, studentName: 'Pooja Malhotra', grade: grades[0].gradeId, subjectId: subjects[1].subjectId, chapterNo: chapters[37].chapterId, moduleNo: 'MOD22102B', createdAt: d(27), result: 87 },
  // Chemistry
  { reportId: 'RPT2013009', studentId: students[12].studentId, studentName: 'Pooja Malhotra', grade: grades[0].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[42].chapterId, moduleNo: 'MOD23101A', createdAt: d(25), result: 93 },
  { reportId: 'RPT2013010', studentId: students[12].studentId, studentName: 'Pooja Malhotra', grade: grades[0].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[42].chapterId, moduleNo: 'MOD23101B', createdAt: d(22), result: 91 },
  { reportId: 'RPT2013011', studentId: students[12].studentId, studentName: 'Pooja Malhotra', grade: grades[0].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[43].chapterId, moduleNo: 'MOD23102A', createdAt: d(18), result: 95 },
  { reportId: 'RPT2013012', studentId: students[12].studentId, studentName: 'Pooja Malhotra', grade: grades[0].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[43].chapterId, moduleNo: 'MOD23102B', createdAt: d(15), result: 92 },
  // English
  { reportId: 'RPT2013013', studentId: students[12].studentId, studentName: 'Pooja Malhotra', grade: grades[0].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[54].chapterId, moduleNo: 'MOD25101A', createdAt: d(13), result: 90 },
  { reportId: 'RPT2013014', studentId: students[12].studentId, studentName: 'Pooja Malhotra', grade: grades[0].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[54].chapterId, moduleNo: 'MOD25101B', createdAt: d(11), result: 88 },
  { reportId: 'RPT2013015', studentId: students[12].studentId, studentName: 'Pooja Malhotra', grade: grades[0].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[55].chapterId, moduleNo: 'MOD25102A', createdAt: d(8),  result: 92 },
  { reportId: 'RPT2013016', studentId: students[12].studentId, studentName: 'Pooja Malhotra', grade: grades[0].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[55].chapterId, moduleNo: 'MOD25102B', createdAt: d(5),  result: 89 },

  // ═══════════════════════════════════════════════════════════════════════════
  // STU014 — Aditya Kumar | Grade 9 | subjects: Math, Chemistry, Biology, English
  // ═══════════════════════════════════════════════════════════════════════════
  // Mathematics
  { reportId: 'RPT2014001', studentId: students[13].studentId, studentName: 'Aditya Kumar',   grade: grades[0].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[30].chapterId, moduleNo: 'MOD21101A', createdAt: d(58), result: 63 },
  { reportId: 'RPT2014002', studentId: students[13].studentId, studentName: 'Aditya Kumar',   grade: grades[0].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[30].chapterId, moduleNo: 'MOD21101B', createdAt: d(55), result: 60 },
  { reportId: 'RPT2014003', studentId: students[13].studentId, studentName: 'Aditya Kumar',   grade: grades[0].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[31].chapterId, moduleNo: 'MOD21102A', createdAt: d(45), result: 65 },
  { reportId: 'RPT2014004', studentId: students[13].studentId, studentName: 'Aditya Kumar',   grade: grades[0].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[31].chapterId, moduleNo: 'MOD21102B', createdAt: d(42), result: 68 },
  // Chemistry
  { reportId: 'RPT2014005', studentId: students[13].studentId, studentName: 'Aditya Kumar',   grade: grades[0].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[42].chapterId, moduleNo: 'MOD23101A', createdAt: d(40), result: 72 },
  { reportId: 'RPT2014006', studentId: students[13].studentId, studentName: 'Aditya Kumar',   grade: grades[0].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[42].chapterId, moduleNo: 'MOD23101B', createdAt: d(37), result: 69 },
  { reportId: 'RPT2014007', studentId: students[13].studentId, studentName: 'Aditya Kumar',   grade: grades[0].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[43].chapterId, moduleNo: 'MOD23102A', createdAt: d(30), result: 74 },
  { reportId: 'RPT2014008', studentId: students[13].studentId, studentName: 'Aditya Kumar',   grade: grades[0].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[43].chapterId, moduleNo: 'MOD23102B', createdAt: d(27), result: 72 },
  // Biology
  { reportId: 'RPT2014009', studentId: students[13].studentId, studentName: 'Aditya Kumar',   grade: grades[0].gradeId, subjectId: subjects[3].subjectId, chapterNo: chapters[48].chapterId, moduleNo: 'MOD24101A', createdAt: d(25), result: 80 },
  { reportId: 'RPT2014010', studentId: students[13].studentId, studentName: 'Aditya Kumar',   grade: grades[0].gradeId, subjectId: subjects[3].subjectId, chapterNo: chapters[48].chapterId, moduleNo: 'MOD24101B', createdAt: d(22), result: 77 },
  { reportId: 'RPT2014011', studentId: students[13].studentId, studentName: 'Aditya Kumar',   grade: grades[0].gradeId, subjectId: subjects[3].subjectId, chapterNo: chapters[49].chapterId, moduleNo: 'MOD24102A', createdAt: d(18), result: 82 },
  { reportId: 'RPT2014012', studentId: students[13].studentId, studentName: 'Aditya Kumar',   grade: grades[0].gradeId, subjectId: subjects[3].subjectId, chapterNo: chapters[49].chapterId, moduleNo: 'MOD24102B', createdAt: d(15), result: 79 },
  // English
  { reportId: 'RPT2014013', studentId: students[13].studentId, studentName: 'Aditya Kumar',   grade: grades[0].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[54].chapterId, moduleNo: 'MOD25101A', createdAt: d(13), result: 75 },
  { reportId: 'RPT2014014', studentId: students[13].studentId, studentName: 'Aditya Kumar',   grade: grades[0].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[54].chapterId, moduleNo: 'MOD25101B', createdAt: d(11), result: 73 },
  { reportId: 'RPT2014015', studentId: students[13].studentId, studentName: 'Aditya Kumar',   grade: grades[0].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[55].chapterId, moduleNo: 'MOD25102A', createdAt: d(8),  result: 77 },
  { reportId: 'RPT2014016', studentId: students[13].studentId, studentName: 'Aditya Kumar',   grade: grades[0].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[55].chapterId, moduleNo: 'MOD25102B', createdAt: d(5),  result: 75 },

  // ═══════════════════════════════════════════════════════════════════════════
  // STU015 — Simran Kaur | Grade 9 | subjects: Math, Chemistry, Biology, English
  // ═══════════════════════════════════════════════════════════════════════════
  // Mathematics
  { reportId: 'RPT2015001', studentId: students[14].studentId, studentName: 'Simran Kaur',    grade: grades[0].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[30].chapterId, moduleNo: 'MOD21101A', createdAt: d(58), result: 78 },
  { reportId: 'RPT2015002', studentId: students[14].studentId, studentName: 'Simran Kaur',    grade: grades[0].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[30].chapterId, moduleNo: 'MOD21101B', createdAt: d(55), result: 75 },
  { reportId: 'RPT2015003', studentId: students[14].studentId, studentName: 'Simran Kaur',    grade: grades[0].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[31].chapterId, moduleNo: 'MOD21102A', createdAt: d(45), result: 80 },
  { reportId: 'RPT2015004', studentId: students[14].studentId, studentName: 'Simran Kaur',    grade: grades[0].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[31].chapterId, moduleNo: 'MOD21102B', createdAt: d(42), result: 77 },
  // Chemistry
  { reportId: 'RPT2015005', studentId: students[14].studentId, studentName: 'Simran Kaur',    grade: grades[0].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[42].chapterId, moduleNo: 'MOD23101A', createdAt: d(40), result: 82 },
  { reportId: 'RPT2015006', studentId: students[14].studentId, studentName: 'Simran Kaur',    grade: grades[0].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[42].chapterId, moduleNo: 'MOD23101B', createdAt: d(37), result: 79 },
  { reportId: 'RPT2015007', studentId: students[14].studentId, studentName: 'Simran Kaur',    grade: grades[0].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[43].chapterId, moduleNo: 'MOD23102A', createdAt: d(30), result: 85 },
  { reportId: 'RPT2015008', studentId: students[14].studentId, studentName: 'Simran Kaur',    grade: grades[0].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[43].chapterId, moduleNo: 'MOD23102B', createdAt: d(27), result: 83 },
  // Biology
  { reportId: 'RPT2015009', studentId: students[14].studentId, studentName: 'Simran Kaur',    grade: grades[0].gradeId, subjectId: subjects[3].subjectId, chapterNo: chapters[48].chapterId, moduleNo: 'MOD24101A', createdAt: d(25), result: 87 },
  { reportId: 'RPT2015010', studentId: students[14].studentId, studentName: 'Simran Kaur',    grade: grades[0].gradeId, subjectId: subjects[3].subjectId, chapterNo: chapters[48].chapterId, moduleNo: 'MOD24101B', createdAt: d(22), result: 85 },
  { reportId: 'RPT2015011', studentId: students[14].studentId, studentName: 'Simran Kaur',    grade: grades[0].gradeId, subjectId: subjects[3].subjectId, chapterNo: chapters[49].chapterId, moduleNo: 'MOD24102A', createdAt: d(18), result: 89 },
  { reportId: 'RPT2015012', studentId: students[14].studentId, studentName: 'Simran Kaur',    grade: grades[0].gradeId, subjectId: subjects[3].subjectId, chapterNo: chapters[49].chapterId, moduleNo: 'MOD24102B', createdAt: d(15), result: 86 },
  // English
  { reportId: 'RPT2015013', studentId: students[14].studentId, studentName: 'Simran Kaur',    grade: grades[0].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[54].chapterId, moduleNo: 'MOD25101A', createdAt: d(13), result: 88 },
  { reportId: 'RPT2015014', studentId: students[14].studentId, studentName: 'Simran Kaur',    grade: grades[0].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[54].chapterId, moduleNo: 'MOD25101B', createdAt: d(11), result: 85 },
  { reportId: 'RPT2015015', studentId: students[14].studentId, studentName: 'Simran Kaur',    grade: grades[0].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[55].chapterId, moduleNo: 'MOD25102A', createdAt: d(8),  result: 90 },
  { reportId: 'RPT2015016', studentId: students[14].studentId, studentName: 'Simran Kaur',    grade: grades[0].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[55].chapterId, moduleNo: 'MOD25102B', createdAt: d(5),  result: 88 },

  // ═══════════════════════════════════════════════════════════════════════════
  // STU016 — Meera Iyer | Grade 10 | subjects: Math, Physics, Chemistry, English
  // ═══════════════════════════════════════════════════════════════════════════
  // Mathematics
  { reportId: 'RPT2016001', studentId: students[15].studentId, studentName: 'Meera Iyer',     grade: grades[1].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[32].chapterId, moduleNo: 'MOD21201A', createdAt: d(58), result: 85 },
  { reportId: 'RPT2016002', studentId: students[15].studentId, studentName: 'Meera Iyer',     grade: grades[1].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[32].chapterId, moduleNo: 'MOD21201B', createdAt: d(55), result: 82 },
  { reportId: 'RPT2016003', studentId: students[15].studentId, studentName: 'Meera Iyer',     grade: grades[1].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[33].chapterId, moduleNo: 'MOD21202A', createdAt: d(45), result: 87 },
  { reportId: 'RPT2016004', studentId: students[15].studentId, studentName: 'Meera Iyer',     grade: grades[1].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[33].chapterId, moduleNo: 'MOD21202B', createdAt: d(42), result: 84 },
  // Physics
  { reportId: 'RPT2016005', studentId: students[15].studentId, studentName: 'Meera Iyer',     grade: grades[1].gradeId, subjectId: subjects[1].subjectId, chapterNo: chapters[38].chapterId, moduleNo: 'MOD22201A', createdAt: d(40), result: 79 },
  { reportId: 'RPT2016006', studentId: students[15].studentId, studentName: 'Meera Iyer',     grade: grades[1].gradeId, subjectId: subjects[1].subjectId, chapterNo: chapters[38].chapterId, moduleNo: 'MOD22201B', createdAt: d(37), result: 76 },
  { reportId: 'RPT2016007', studentId: students[15].studentId, studentName: 'Meera Iyer',     grade: grades[1].gradeId, subjectId: subjects[1].subjectId, chapterNo: chapters[39].chapterId, moduleNo: 'MOD22202A', createdAt: d(30), result: 81 },
  { reportId: 'RPT2016008', studentId: students[15].studentId, studentName: 'Meera Iyer',     grade: grades[1].gradeId, subjectId: subjects[1].subjectId, chapterNo: chapters[39].chapterId, moduleNo: 'MOD22202B', createdAt: d(27), result: 78 },
  // Chemistry
  { reportId: 'RPT2016009', studentId: students[15].studentId, studentName: 'Meera Iyer',     grade: grades[1].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[44].chapterId, moduleNo: 'MOD23201A', createdAt: d(25), result: 83 },
  { reportId: 'RPT2016010', studentId: students[15].studentId, studentName: 'Meera Iyer',     grade: grades[1].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[44].chapterId, moduleNo: 'MOD23201B', createdAt: d(22), result: 80 },
  { reportId: 'RPT2016011', studentId: students[15].studentId, studentName: 'Meera Iyer',     grade: grades[1].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[45].chapterId, moduleNo: 'MOD23202A', createdAt: d(18), result: 86 },
  { reportId: 'RPT2016012', studentId: students[15].studentId, studentName: 'Meera Iyer',     grade: grades[1].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[45].chapterId, moduleNo: 'MOD23202B', createdAt: d(15), result: 83 },
  // English
  { reportId: 'RPT2016013', studentId: students[15].studentId, studentName: 'Meera Iyer',     grade: grades[1].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[56].chapterId, moduleNo: 'MOD25201A', createdAt: d(13), result: 88 },
  { reportId: 'RPT2016014', studentId: students[15].studentId, studentName: 'Meera Iyer',     grade: grades[1].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[56].chapterId, moduleNo: 'MOD25201B', createdAt: d(11), result: 86 },
  { reportId: 'RPT2016015', studentId: students[15].studentId, studentName: 'Meera Iyer',     grade: grades[1].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[57].chapterId, moduleNo: 'MOD25202A', createdAt: d(8),  result: 90 },
  { reportId: 'RPT2016016', studentId: students[15].studentId, studentName: 'Meera Iyer',     grade: grades[1].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[57].chapterId, moduleNo: 'MOD25202B', createdAt: d(5),  result: 87 },

  // ═══════════════════════════════════════════════════════════════════════════
  // STU017 — Suresh Nambiar | Grade 10 | subjects: Math, Physics, Chemistry, English
  // ═══════════════════════════════════════════════════════════════════════════
  // Mathematics
  { reportId: 'RPT2017001', studentId: students[16].studentId, studentName: 'Suresh Nambiar', grade: grades[1].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[32].chapterId, moduleNo: 'MOD21201A', createdAt: d(58), result: 60 },
  { reportId: 'RPT2017002', studentId: students[16].studentId, studentName: 'Suresh Nambiar', grade: grades[1].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[32].chapterId, moduleNo: 'MOD21201B', createdAt: d(55), result: 57 },
  { reportId: 'RPT2017003', studentId: students[16].studentId, studentName: 'Suresh Nambiar', grade: grades[1].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[33].chapterId, moduleNo: 'MOD21202A', createdAt: d(45), result: 63 },
  { reportId: 'RPT2017004', studentId: students[16].studentId, studentName: 'Suresh Nambiar', grade: grades[1].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[33].chapterId, moduleNo: 'MOD21202B', createdAt: d(42), result: 65 },
  // Physics
  { reportId: 'RPT2017005', studentId: students[16].studentId, studentName: 'Suresh Nambiar', grade: grades[1].gradeId, subjectId: subjects[1].subjectId, chapterNo: chapters[38].chapterId, moduleNo: 'MOD22201A', createdAt: d(40), result: 55 },
  { reportId: 'RPT2017006', studentId: students[16].studentId, studentName: 'Suresh Nambiar', grade: grades[1].gradeId, subjectId: subjects[1].subjectId, chapterNo: chapters[38].chapterId, moduleNo: 'MOD22201B', createdAt: d(37), result: 52 },
  { reportId: 'RPT2017007', studentId: students[16].studentId, studentName: 'Suresh Nambiar', grade: grades[1].gradeId, subjectId: subjects[1].subjectId, chapterNo: chapters[39].chapterId, moduleNo: 'MOD22202A', createdAt: d(30), result: 58 },
  { reportId: 'RPT2017008', studentId: students[16].studentId, studentName: 'Suresh Nambiar', grade: grades[1].gradeId, subjectId: subjects[1].subjectId, chapterNo: chapters[39].chapterId, moduleNo: 'MOD22202B', createdAt: d(27), result: 60 },
  // Chemistry
  { reportId: 'RPT2017009', studentId: students[16].studentId, studentName: 'Suresh Nambiar', grade: grades[1].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[44].chapterId, moduleNo: 'MOD23201A', createdAt: d(25), result: 68 },
  { reportId: 'RPT2017010', studentId: students[16].studentId, studentName: 'Suresh Nambiar', grade: grades[1].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[44].chapterId, moduleNo: 'MOD23201B', createdAt: d(22), result: 65 },
  { reportId: 'RPT2017011', studentId: students[16].studentId, studentName: 'Suresh Nambiar', grade: grades[1].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[45].chapterId, moduleNo: 'MOD23202A', createdAt: d(18), result: 70 },
  { reportId: 'RPT2017012', studentId: students[16].studentId, studentName: 'Suresh Nambiar', grade: grades[1].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[45].chapterId, moduleNo: 'MOD23202B', createdAt: d(15), result: 68 },
  // English
  { reportId: 'RPT2017013', studentId: students[16].studentId, studentName: 'Suresh Nambiar', grade: grades[1].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[56].chapterId, moduleNo: 'MOD25201A', createdAt: d(13), result: 72 },
  { reportId: 'RPT2017014', studentId: students[16].studentId, studentName: 'Suresh Nambiar', grade: grades[1].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[56].chapterId, moduleNo: 'MOD25201B', createdAt: d(11), result: 70 },
  { reportId: 'RPT2017015', studentId: students[16].studentId, studentName: 'Suresh Nambiar', grade: grades[1].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[57].chapterId, moduleNo: 'MOD25202A', createdAt: d(8),  result: 74 },
  { reportId: 'RPT2017016', studentId: students[16].studentId, studentName: 'Suresh Nambiar', grade: grades[1].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[57].chapterId, moduleNo: 'MOD25202B', createdAt: d(5),  result: 72 },

  // ═══════════════════════════════════════════════════════════════════════════
  // STU018 — Divya Menon | Grade 10 | subjects: Math, Chemistry, Biology, English
  // ═══════════════════════════════════════════════════════════════════════════
  // Mathematics
  { reportId: 'RPT2018001', studentId: students[17].studentId, studentName: 'Divya Menon',    grade: grades[1].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[32].chapterId, moduleNo: 'MOD21201A', createdAt: d(58), result: 76 },
  { reportId: 'RPT2018002', studentId: students[17].studentId, studentName: 'Divya Menon',    grade: grades[1].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[32].chapterId, moduleNo: 'MOD21201B', createdAt: d(55), result: 73 },
  { reportId: 'RPT2018003', studentId: students[17].studentId, studentName: 'Divya Menon',    grade: grades[1].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[33].chapterId, moduleNo: 'MOD21202A', createdAt: d(45), result: 78 },
  { reportId: 'RPT2018004', studentId: students[17].studentId, studentName: 'Divya Menon',    grade: grades[1].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[33].chapterId, moduleNo: 'MOD21202B', createdAt: d(42), result: 75 },
  // Chemistry
  { reportId: 'RPT2018005', studentId: students[17].studentId, studentName: 'Divya Menon',    grade: grades[1].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[44].chapterId, moduleNo: 'MOD23201A', createdAt: d(40), result: 80 },
  { reportId: 'RPT2018006', studentId: students[17].studentId, studentName: 'Divya Menon',    grade: grades[1].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[44].chapterId, moduleNo: 'MOD23201B', createdAt: d(37), result: 78 },
  { reportId: 'RPT2018007', studentId: students[17].studentId, studentName: 'Divya Menon',    grade: grades[1].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[45].chapterId, moduleNo: 'MOD23202A', createdAt: d(30), result: 83 },
  { reportId: 'RPT2018008', studentId: students[17].studentId, studentName: 'Divya Menon',    grade: grades[1].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[45].chapterId, moduleNo: 'MOD23202B', createdAt: d(27), result: 81 },
  // Biology
  { reportId: 'RPT2018009', studentId: students[17].studentId, studentName: 'Divya Menon',    grade: grades[1].gradeId, subjectId: subjects[3].subjectId, chapterNo: chapters[50].chapterId, moduleNo: 'MOD24201A', createdAt: d(25), result: 85 },
  { reportId: 'RPT2018010', studentId: students[17].studentId, studentName: 'Divya Menon',    grade: grades[1].gradeId, subjectId: subjects[3].subjectId, chapterNo: chapters[50].chapterId, moduleNo: 'MOD24201B', createdAt: d(22), result: 82 },
  { reportId: 'RPT2018011', studentId: students[17].studentId, studentName: 'Divya Menon',    grade: grades[1].gradeId, subjectId: subjects[3].subjectId, chapterNo: chapters[51].chapterId, moduleNo: 'MOD24202A', createdAt: d(18), result: 87 },
  { reportId: 'RPT2018012', studentId: students[17].studentId, studentName: 'Divya Menon',    grade: grades[1].gradeId, subjectId: subjects[3].subjectId, chapterNo: chapters[51].chapterId, moduleNo: 'MOD24202B', createdAt: d(15), result: 84 },
  // English
  { reportId: 'RPT2018013', studentId: students[17].studentId, studentName: 'Divya Menon',    grade: grades[1].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[56].chapterId, moduleNo: 'MOD25201A', createdAt: d(13), result: 86 },
  { reportId: 'RPT2018014', studentId: students[17].studentId, studentName: 'Divya Menon',    grade: grades[1].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[56].chapterId, moduleNo: 'MOD25201B', createdAt: d(11), result: 84 },
  { reportId: 'RPT2018015', studentId: students[17].studentId, studentName: 'Divya Menon',    grade: grades[1].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[57].chapterId, moduleNo: 'MOD25202A', createdAt: d(8),  result: 88 },
  { reportId: 'RPT2018016', studentId: students[17].studentId, studentName: 'Divya Menon',    grade: grades[1].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[57].chapterId, moduleNo: 'MOD25202B', createdAt: d(5),  result: 86 },

  // ═══════════════════════════════════════════════════════════════════════════
  // STU019 — Arjun Krishnan | Grade 10 | subjects: Math, Physics, Chemistry, English
  // ═══════════════════════════════════════════════════════════════════════════
  // Mathematics
  { reportId: 'RPT2019001', studentId: students[18].studentId, studentName: 'Arjun Krishnan', grade: grades[1].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[32].chapterId, moduleNo: 'MOD21201A', createdAt: d(58), result: 90 },
  { reportId: 'RPT2019002', studentId: students[18].studentId, studentName: 'Arjun Krishnan', grade: grades[1].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[32].chapterId, moduleNo: 'MOD21201B', createdAt: d(55), result: 88 },
  { reportId: 'RPT2019003', studentId: students[18].studentId, studentName: 'Arjun Krishnan', grade: grades[1].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[33].chapterId, moduleNo: 'MOD21202A', createdAt: d(45), result: 92 },
  { reportId: 'RPT2019004', studentId: students[18].studentId, studentName: 'Arjun Krishnan', grade: grades[1].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[33].chapterId, moduleNo: 'MOD21202B', createdAt: d(42), result: 89 },
  // Physics
  { reportId: 'RPT2019005', studentId: students[18].studentId, studentName: 'Arjun Krishnan', grade: grades[1].gradeId, subjectId: subjects[1].subjectId, chapterNo: chapters[38].chapterId, moduleNo: 'MOD22201A', createdAt: d(40), result: 85 },
  { reportId: 'RPT2019006', studentId: students[18].studentId, studentName: 'Arjun Krishnan', grade: grades[1].gradeId, subjectId: subjects[1].subjectId, chapterNo: chapters[38].chapterId, moduleNo: 'MOD22201B', createdAt: d(37), result: 83 },
  { reportId: 'RPT2019007', studentId: students[18].studentId, studentName: 'Arjun Krishnan', grade: grades[1].gradeId, subjectId: subjects[1].subjectId, chapterNo: chapters[39].chapterId, moduleNo: 'MOD22202A', createdAt: d(30), result: 87 },
  { reportId: 'RPT2019008', studentId: students[18].studentId, studentName: 'Arjun Krishnan', grade: grades[1].gradeId, subjectId: subjects[1].subjectId, chapterNo: chapters[39].chapterId, moduleNo: 'MOD22202B', createdAt: d(27), result: 84 },
  // Chemistry
  { reportId: 'RPT2019009', studentId: students[18].studentId, studentName: 'Arjun Krishnan', grade: grades[1].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[44].chapterId, moduleNo: 'MOD23201A', createdAt: d(25), result: 88 },
  { reportId: 'RPT2019010', studentId: students[18].studentId, studentName: 'Arjun Krishnan', grade: grades[1].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[44].chapterId, moduleNo: 'MOD23201B', createdAt: d(22), result: 86 },
  { reportId: 'RPT2019011', studentId: students[18].studentId, studentName: 'Arjun Krishnan', grade: grades[1].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[45].chapterId, moduleNo: 'MOD23202A', createdAt: d(18), result: 91 },
  { reportId: 'RPT2019012', studentId: students[18].studentId, studentName: 'Arjun Krishnan', grade: grades[1].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[45].chapterId, moduleNo: 'MOD23202B', createdAt: d(15), result: 88 },
  // English
  { reportId: 'RPT2019013', studentId: students[18].studentId, studentName: 'Arjun Krishnan', grade: grades[1].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[56].chapterId, moduleNo: 'MOD25201A', createdAt: d(13), result: 84 },
  { reportId: 'RPT2019014', studentId: students[18].studentId, studentName: 'Arjun Krishnan', grade: grades[1].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[56].chapterId, moduleNo: 'MOD25201B', createdAt: d(11), result: 82 },
  { reportId: 'RPT2019015', studentId: students[18].studentId, studentName: 'Arjun Krishnan', grade: grades[1].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[57].chapterId, moduleNo: 'MOD25202A', createdAt: d(8),  result: 86 },
  { reportId: 'RPT2019016', studentId: students[18].studentId, studentName: 'Arjun Krishnan', grade: grades[1].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[57].chapterId, moduleNo: 'MOD25202B', createdAt: d(5),  result: 83 },

  // ═══════════════════════════════════════════════════════════════════════════
  // STU020 — Lakshmi Pillai | Grade 10 | subjects: Math, Physics, Chemistry, English
  // ═══════════════════════════════════════════════════════════════════════════
  // Mathematics
  { reportId: 'RPT2020001', studentId: students[19].studentId, studentName: 'Lakshmi Pillai', grade: grades[1].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[32].chapterId, moduleNo: 'MOD21201A', createdAt: d(58), result: 73 },
  { reportId: 'RPT2020002', studentId: students[19].studentId, studentName: 'Lakshmi Pillai', grade: grades[1].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[32].chapterId, moduleNo: 'MOD21201B', createdAt: d(55), result: 70 },
  { reportId: 'RPT2020003', studentId: students[19].studentId, studentName: 'Lakshmi Pillai', grade: grades[1].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[33].chapterId, moduleNo: 'MOD21202A', createdAt: d(45), result: 75 },
  { reportId: 'RPT2020004', studentId: students[19].studentId, studentName: 'Lakshmi Pillai', grade: grades[1].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[33].chapterId, moduleNo: 'MOD21202B', createdAt: d(42), result: 72 },
  // Physics
  { reportId: 'RPT2020005', studentId: students[19].studentId, studentName: 'Lakshmi Pillai', grade: grades[1].gradeId, subjectId: subjects[1].subjectId, chapterNo: chapters[38].chapterId, moduleNo: 'MOD22201A', createdAt: d(40), result: 68 },
  { reportId: 'RPT2020006', studentId: students[19].studentId, studentName: 'Lakshmi Pillai', grade: grades[1].gradeId, subjectId: subjects[1].subjectId, chapterNo: chapters[38].chapterId, moduleNo: 'MOD22201B', createdAt: d(37), result: 65 },
  { reportId: 'RPT2020007', studentId: students[19].studentId, studentName: 'Lakshmi Pillai', grade: grades[1].gradeId, subjectId: subjects[1].subjectId, chapterNo: chapters[39].chapterId, moduleNo: 'MOD22202A', createdAt: d(30), result: 70 },
  { reportId: 'RPT2020008', studentId: students[19].studentId, studentName: 'Lakshmi Pillai', grade: grades[1].gradeId, subjectId: subjects[1].subjectId, chapterNo: chapters[39].chapterId, moduleNo: 'MOD22202B', createdAt: d(27), result: 68 },
  // Chemistry
  { reportId: 'RPT2020009', studentId: students[19].studentId, studentName: 'Lakshmi Pillai', grade: grades[1].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[44].chapterId, moduleNo: 'MOD23201A', createdAt: d(25), result: 77 },
  { reportId: 'RPT2020010', studentId: students[19].studentId, studentName: 'Lakshmi Pillai', grade: grades[1].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[44].chapterId, moduleNo: 'MOD23201B', createdAt: d(22), result: 74 },
  { reportId: 'RPT2020011', studentId: students[19].studentId, studentName: 'Lakshmi Pillai', grade: grades[1].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[45].chapterId, moduleNo: 'MOD23202A', createdAt: d(18), result: 79 },
  { reportId: 'RPT2020012', studentId: students[19].studentId, studentName: 'Lakshmi Pillai', grade: grades[1].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[45].chapterId, moduleNo: 'MOD23202B', createdAt: d(15), result: 77 },
  // English
  { reportId: 'RPT2020013', studentId: students[19].studentId, studentName: 'Lakshmi Pillai', grade: grades[1].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[56].chapterId, moduleNo: 'MOD25201A', createdAt: d(13), result: 80 },
  { reportId: 'RPT2020014', studentId: students[19].studentId, studentName: 'Lakshmi Pillai', grade: grades[1].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[56].chapterId, moduleNo: 'MOD25201B', createdAt: d(11), result: 78 },
  { reportId: 'RPT2020015', studentId: students[19].studentId, studentName: 'Lakshmi Pillai', grade: grades[1].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[57].chapterId, moduleNo: 'MOD25202A', createdAt: d(8),  result: 82 },
  { reportId: 'RPT2020016', studentId: students[19].studentId, studentName: 'Lakshmi Pillai', grade: grades[1].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[57].chapterId, moduleNo: 'MOD25202B', createdAt: d(5),  result: 80 },

  // ═══════════════════════════════════════════════════════════════════════════
  // STU021 — Nikhil Sharma | Grade 11 | subjects: Math, Physics, Chemistry, English
  // ═══════════════════════════════════════════════════════════════════════════
  // Mathematics
  { reportId: 'RPT2021001', studentId: students[20].studentId, studentName: 'Nikhil Sharma',  grade: grades[2].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[34].chapterId, moduleNo: 'MOD21301A', createdAt: d(58), result: 82 },
  { reportId: 'RPT2021002', studentId: students[20].studentId, studentName: 'Nikhil Sharma',  grade: grades[2].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[34].chapterId, moduleNo: 'MOD21301B', createdAt: d(55), result: 79 },
  { reportId: 'RPT2021003', studentId: students[20].studentId, studentName: 'Nikhil Sharma',  grade: grades[2].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[35].chapterId, moduleNo: 'MOD21302A', createdAt: d(45), result: 85 },
  { reportId: 'RPT2021004', studentId: students[20].studentId, studentName: 'Nikhil Sharma',  grade: grades[2].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[35].chapterId, moduleNo: 'MOD21302B', createdAt: d(42), result: 82 },
  // Physics
  { reportId: 'RPT2021005', studentId: students[20].studentId, studentName: 'Nikhil Sharma',  grade: grades[2].gradeId, subjectId: subjects[1].subjectId, chapterNo: chapters[40].chapterId, moduleNo: 'MOD22301A', createdAt: d(40), result: 78 },
  { reportId: 'RPT2021006', studentId: students[20].studentId, studentName: 'Nikhil Sharma',  grade: grades[2].gradeId, subjectId: subjects[1].subjectId, chapterNo: chapters[40].chapterId, moduleNo: 'MOD22301B', createdAt: d(37), result: 75 },
  { reportId: 'RPT2021007', studentId: students[20].studentId, studentName: 'Nikhil Sharma',  grade: grades[2].gradeId, subjectId: subjects[1].subjectId, chapterNo: chapters[41].chapterId, moduleNo: 'MOD22302A', createdAt: d(30), result: 80 },
  { reportId: 'RPT2021008', studentId: students[20].studentId, studentName: 'Nikhil Sharma',  grade: grades[2].gradeId, subjectId: subjects[1].subjectId, chapterNo: chapters[41].chapterId, moduleNo: 'MOD22302B', createdAt: d(27), result: 77 },
  // Chemistry
  { reportId: 'RPT2021009', studentId: students[20].studentId, studentName: 'Nikhil Sharma',  grade: grades[2].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[46].chapterId, moduleNo: 'MOD23301A', createdAt: d(25), result: 83 },
  { reportId: 'RPT2021010', studentId: students[20].studentId, studentName: 'Nikhil Sharma',  grade: grades[2].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[46].chapterId, moduleNo: 'MOD23301B', createdAt: d(22), result: 80 },
  { reportId: 'RPT2021011', studentId: students[20].studentId, studentName: 'Nikhil Sharma',  grade: grades[2].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[47].chapterId, moduleNo: 'MOD23302A', createdAt: d(18), result: 85 },
  { reportId: 'RPT2021012', studentId: students[20].studentId, studentName: 'Nikhil Sharma',  grade: grades[2].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[47].chapterId, moduleNo: 'MOD23302B', createdAt: d(15), result: 82 },
  // English
  { reportId: 'RPT2021013', studentId: students[20].studentId, studentName: 'Nikhil Sharma',  grade: grades[2].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[58].chapterId, moduleNo: 'MOD25301A', createdAt: d(13), result: 80 },
  { reportId: 'RPT2021014', studentId: students[20].studentId, studentName: 'Nikhil Sharma',  grade: grades[2].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[58].chapterId, moduleNo: 'MOD25301B', createdAt: d(11), result: 78 },
  { reportId: 'RPT2021015', studentId: students[20].studentId, studentName: 'Nikhil Sharma',  grade: grades[2].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[59].chapterId, moduleNo: 'MOD25302A', createdAt: d(8),  result: 82 },
  { reportId: 'RPT2021016', studentId: students[20].studentId, studentName: 'Nikhil Sharma',  grade: grades[2].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[59].chapterId, moduleNo: 'MOD25302B', createdAt: d(5),  result: 80 },

  // ═══════════════════════════════════════════════════════════════════════════
  // STU022 — Riya Gupta | Grade 11 | subjects: Math, Physics, Chemistry, English
  // ═══════════════════════════════════════════════════════════════════════════
  // Mathematics
  { reportId: 'RPT2022001', studentId: students[21].studentId, studentName: 'Riya Gupta',     grade: grades[2].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[34].chapterId, moduleNo: 'MOD21301A', createdAt: d(58), result: 95 },
  { reportId: 'RPT2022002', studentId: students[21].studentId, studentName: 'Riya Gupta',     grade: grades[2].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[34].chapterId, moduleNo: 'MOD21301B', createdAt: d(55), result: 93 },
  { reportId: 'RPT2022003', studentId: students[21].studentId, studentName: 'Riya Gupta',     grade: grades[2].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[35].chapterId, moduleNo: 'MOD21302A', createdAt: d(45), result: 96 },
  { reportId: 'RPT2022004', studentId: students[21].studentId, studentName: 'Riya Gupta',     grade: grades[2].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[35].chapterId, moduleNo: 'MOD21302B', createdAt: d(42), result: 94 },
  // Physics
  { reportId: 'RPT2022005', studentId: students[21].studentId, studentName: 'Riya Gupta',     grade: grades[2].gradeId, subjectId: subjects[1].subjectId, chapterNo: chapters[40].chapterId, moduleNo: 'MOD22301A', createdAt: d(40), result: 90 },
  { reportId: 'RPT2022006', studentId: students[21].studentId, studentName: 'Riya Gupta',     grade: grades[2].gradeId, subjectId: subjects[1].subjectId, chapterNo: chapters[40].chapterId, moduleNo: 'MOD22301B', createdAt: d(37), result: 88 },
  { reportId: 'RPT2022007', studentId: students[21].studentId, studentName: 'Riya Gupta',     grade: grades[2].gradeId, subjectId: subjects[1].subjectId, chapterNo: chapters[41].chapterId, moduleNo: 'MOD22302A', createdAt: d(30), result: 92 },
  { reportId: 'RPT2022008', studentId: students[21].studentId, studentName: 'Riya Gupta',     grade: grades[2].gradeId, subjectId: subjects[1].subjectId, chapterNo: chapters[41].chapterId, moduleNo: 'MOD22302B', createdAt: d(27), result: 90 },
  // Chemistry
  { reportId: 'RPT2022009', studentId: students[21].studentId, studentName: 'Riya Gupta',     grade: grades[2].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[46].chapterId, moduleNo: 'MOD23301A', createdAt: d(25), result: 91 },
  { reportId: 'RPT2022010', studentId: students[21].studentId, studentName: 'Riya Gupta',     grade: grades[2].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[46].chapterId, moduleNo: 'MOD23301B', createdAt: d(22), result: 89 },
  { reportId: 'RPT2022011', studentId: students[21].studentId, studentName: 'Riya Gupta',     grade: grades[2].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[47].chapterId, moduleNo: 'MOD23302A', createdAt: d(18), result: 93 },
  { reportId: 'RPT2022012', studentId: students[21].studentId, studentName: 'Riya Gupta',     grade: grades[2].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[47].chapterId, moduleNo: 'MOD23302B', createdAt: d(15), result: 91 },
  // English
  { reportId: 'RPT2022013', studentId: students[21].studentId, studentName: 'Riya Gupta',     grade: grades[2].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[58].chapterId, moduleNo: 'MOD25301A', createdAt: d(13), result: 92 },
  { reportId: 'RPT2022014', studentId: students[21].studentId, studentName: 'Riya Gupta',     grade: grades[2].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[58].chapterId, moduleNo: 'MOD25301B', createdAt: d(11), result: 90 },
  { reportId: 'RPT2022015', studentId: students[21].studentId, studentName: 'Riya Gupta',     grade: grades[2].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[59].chapterId, moduleNo: 'MOD25302A', createdAt: d(8),  result: 94 },
  { reportId: 'RPT2022016', studentId: students[21].studentId, studentName: 'Riya Gupta',     grade: grades[2].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[59].chapterId, moduleNo: 'MOD25302B', createdAt: d(5),  result: 92 },

  // ═══════════════════════════════════════════════════════════════════════════
  // STU023 — Sourav Chatterjee | Grade 11 | subjects: Math, Chemistry, Biology, English
  // ═══════════════════════════════════════════════════════════════════════════
  // Mathematics
  { reportId: 'RPT2023001', studentId: students[22].studentId, studentName: 'Sourav Chatterjee', grade: grades[2].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[34].chapterId, moduleNo: 'MOD21301A', createdAt: d(58), result: 68 },
  { reportId: 'RPT2023002', studentId: students[22].studentId, studentName: 'Sourav Chatterjee', grade: grades[2].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[34].chapterId, moduleNo: 'MOD21301B', createdAt: d(55), result: 65 },
  { reportId: 'RPT2023003', studentId: students[22].studentId, studentName: 'Sourav Chatterjee', grade: grades[2].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[35].chapterId, moduleNo: 'MOD21302A', createdAt: d(45), result: 70 },
  { reportId: 'RPT2023004', studentId: students[22].studentId, studentName: 'Sourav Chatterjee', grade: grades[2].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[35].chapterId, moduleNo: 'MOD21302B', createdAt: d(42), result: 68 },
  // Chemistry
  { reportId: 'RPT2023005', studentId: students[22].studentId, studentName: 'Sourav Chatterjee', grade: grades[2].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[46].chapterId, moduleNo: 'MOD23301A', createdAt: d(40), result: 72 },
  { reportId: 'RPT2023006', studentId: students[22].studentId, studentName: 'Sourav Chatterjee', grade: grades[2].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[46].chapterId, moduleNo: 'MOD23301B', createdAt: d(37), result: 69 },
  { reportId: 'RPT2023007', studentId: students[22].studentId, studentName: 'Sourav Chatterjee', grade: grades[2].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[47].chapterId, moduleNo: 'MOD23302A', createdAt: d(30), result: 74 },
  { reportId: 'RPT2023008', studentId: students[22].studentId, studentName: 'Sourav Chatterjee', grade: grades[2].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[47].chapterId, moduleNo: 'MOD23302B', createdAt: d(27), result: 72 },
  // Biology
  { reportId: 'RPT2023009', studentId: students[22].studentId, studentName: 'Sourav Chatterjee', grade: grades[2].gradeId, subjectId: subjects[3].subjectId, chapterNo: chapters[52].chapterId, moduleNo: 'MOD24301A', createdAt: d(25), result: 78 },
  { reportId: 'RPT2023010', studentId: students[22].studentId, studentName: 'Sourav Chatterjee', grade: grades[2].gradeId, subjectId: subjects[3].subjectId, chapterNo: chapters[52].chapterId, moduleNo: 'MOD24301B', createdAt: d(22), result: 75 },
  { reportId: 'RPT2023011', studentId: students[22].studentId, studentName: 'Sourav Chatterjee', grade: grades[2].gradeId, subjectId: subjects[3].subjectId, chapterNo: chapters[53].chapterId, moduleNo: 'MOD24302A', createdAt: d(18), result: 80 },
  { reportId: 'RPT2023012', studentId: students[22].studentId, studentName: 'Sourav Chatterjee', grade: grades[2].gradeId, subjectId: subjects[3].subjectId, chapterNo: chapters[53].chapterId, moduleNo: 'MOD24302B', createdAt: d(15), result: 77 },
  // English
  { reportId: 'RPT2023013', studentId: students[22].studentId, studentName: 'Sourav Chatterjee', grade: grades[2].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[58].chapterId, moduleNo: 'MOD25301A', createdAt: d(13), result: 74 },
  { reportId: 'RPT2023014', studentId: students[22].studentId, studentName: 'Sourav Chatterjee', grade: grades[2].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[58].chapterId, moduleNo: 'MOD25301B', createdAt: d(11), result: 72 },
  { reportId: 'RPT2023015', studentId: students[22].studentId, studentName: 'Sourav Chatterjee', grade: grades[2].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[59].chapterId, moduleNo: 'MOD25302A', createdAt: d(8),  result: 76 },
  { reportId: 'RPT2023016', studentId: students[22].studentId, studentName: 'Sourav Chatterjee', grade: grades[2].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[59].chapterId, moduleNo: 'MOD25302B', createdAt: d(5),  result: 74 },

  // ═══════════════════════════════════════════════════════════════════════════
  // STU024 — Tanisha Bose | Grade 11 | subjects: Math, Chemistry, Biology, English
  // ═══════════════════════════════════════════════════════════════════════════
  // Mathematics
  { reportId: 'RPT2024001', studentId: students[23].studentId, studentName: 'Tanisha Bose',   grade: grades[2].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[34].chapterId, moduleNo: 'MOD21301A', createdAt: d(58), result: 84 },
  { reportId: 'RPT2024002', studentId: students[23].studentId, studentName: 'Tanisha Bose',   grade: grades[2].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[34].chapterId, moduleNo: 'MOD21301B', createdAt: d(55), result: 81 },
  { reportId: 'RPT2024003', studentId: students[23].studentId, studentName: 'Tanisha Bose',   grade: grades[2].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[35].chapterId, moduleNo: 'MOD21302A', createdAt: d(45), result: 86 },
  { reportId: 'RPT2024004', studentId: students[23].studentId, studentName: 'Tanisha Bose',   grade: grades[2].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[35].chapterId, moduleNo: 'MOD21302B', createdAt: d(42), result: 83 },
  // Chemistry
  { reportId: 'RPT2024005', studentId: students[23].studentId, studentName: 'Tanisha Bose',   grade: grades[2].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[46].chapterId, moduleNo: 'MOD23301A', createdAt: d(40), result: 87 },
  { reportId: 'RPT2024006', studentId: students[23].studentId, studentName: 'Tanisha Bose',   grade: grades[2].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[46].chapterId, moduleNo: 'MOD23301B', createdAt: d(37), result: 84 },
  { reportId: 'RPT2024007', studentId: students[23].studentId, studentName: 'Tanisha Bose',   grade: grades[2].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[47].chapterId, moduleNo: 'MOD23302A', createdAt: d(30), result: 89 },
  { reportId: 'RPT2024008', studentId: students[23].studentId, studentName: 'Tanisha Bose',   grade: grades[2].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[47].chapterId, moduleNo: 'MOD23302B', createdAt: d(27), result: 87 },
  // Biology
  { reportId: 'RPT2024009', studentId: students[23].studentId, studentName: 'Tanisha Bose',   grade: grades[2].gradeId, subjectId: subjects[3].subjectId, chapterNo: chapters[52].chapterId, moduleNo: 'MOD24301A', createdAt: d(25), result: 88 },
  { reportId: 'RPT2024010', studentId: students[23].studentId, studentName: 'Tanisha Bose',   grade: grades[2].gradeId, subjectId: subjects[3].subjectId, chapterNo: chapters[52].chapterId, moduleNo: 'MOD24301B', createdAt: d(22), result: 86 },
  { reportId: 'RPT2024011', studentId: students[23].studentId, studentName: 'Tanisha Bose',   grade: grades[2].gradeId, subjectId: subjects[3].subjectId, chapterNo: chapters[53].chapterId, moduleNo: 'MOD24302A', createdAt: d(18), result: 90 },
  { reportId: 'RPT2024012', studentId: students[23].studentId, studentName: 'Tanisha Bose',   grade: grades[2].gradeId, subjectId: subjects[3].subjectId, chapterNo: chapters[53].chapterId, moduleNo: 'MOD24302B', createdAt: d(15), result: 87 },
  // English
  { reportId: 'RPT2024013', studentId: students[23].studentId, studentName: 'Tanisha Bose',   grade: grades[2].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[58].chapterId, moduleNo: 'MOD25301A', createdAt: d(13), result: 85 },
  { reportId: 'RPT2024014', studentId: students[23].studentId, studentName: 'Tanisha Bose',   grade: grades[2].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[58].chapterId, moduleNo: 'MOD25301B', createdAt: d(11), result: 83 },
  { reportId: 'RPT2024015', studentId: students[23].studentId, studentName: 'Tanisha Bose',   grade: grades[2].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[59].chapterId, moduleNo: 'MOD25302A', createdAt: d(8),  result: 87 },
  { reportId: 'RPT2024016', studentId: students[23].studentId, studentName: 'Tanisha Bose',   grade: grades[2].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[59].chapterId, moduleNo: 'MOD25302B', createdAt: d(5),  result: 85 },

  // ═══════════════════════════════════════════════════════════════════════════
  // STU025 — Tanisha Khare | Grade 11 | subjects: Math, Chemistry, Biology, English
  // ═══════════════════════════════════════════════════════════════════════════
  // Mathematics
  { reportId: 'RPT2025001', studentId: students[24].studentId, studentName: 'Tanisha Khare',  grade: grades[2].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[34].chapterId, moduleNo: 'MOD21301A', createdAt: d(58), result: 58 },
  { reportId: 'RPT2025002', studentId: students[24].studentId, studentName: 'Tanisha Khare',  grade: grades[2].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[34].chapterId, moduleNo: 'MOD21301B', createdAt: d(55), result: 55 },
  { reportId: 'RPT2025003', studentId: students[24].studentId, studentName: 'Tanisha Khare',  grade: grades[2].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[35].chapterId, moduleNo: 'MOD21302A', createdAt: d(45), result: 61 },
  { reportId: 'RPT2025004', studentId: students[24].studentId, studentName: 'Tanisha Khare',  grade: grades[2].gradeId, subjectId: subjects[0].subjectId, chapterNo: chapters[35].chapterId, moduleNo: 'MOD21302B', createdAt: d(42), result: 59 },
  // Chemistry
  { reportId: 'RPT2025005', studentId: students[24].studentId, studentName: 'Tanisha Khare',  grade: grades[2].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[46].chapterId, moduleNo: 'MOD23301A', createdAt: d(40), result: 65 },
  { reportId: 'RPT2025006', studentId: students[24].studentId, studentName: 'Tanisha Khare',  grade: grades[2].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[46].chapterId, moduleNo: 'MOD23301B', createdAt: d(37), result: 62 },
  { reportId: 'RPT2025007', studentId: students[24].studentId, studentName: 'Tanisha Khare',  grade: grades[2].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[47].chapterId, moduleNo: 'MOD23302A', createdAt: d(30), result: 68 },
  { reportId: 'RPT2025008', studentId: students[24].studentId, studentName: 'Tanisha Khare',  grade: grades[2].gradeId, subjectId: subjects[2].subjectId, chapterNo: chapters[47].chapterId, moduleNo: 'MOD23302B', createdAt: d(27), result: 65 },
  // Biology
  { reportId: 'RPT2025009', studentId: students[24].studentId, studentName: 'Tanisha Khare',  grade: grades[2].gradeId, subjectId: subjects[3].subjectId, chapterNo: chapters[52].chapterId, moduleNo: 'MOD24301A', createdAt: d(25), result: 72 },
  { reportId: 'RPT2025010', studentId: students[24].studentId, studentName: 'Tanisha Khare',  grade: grades[2].gradeId, subjectId: subjects[3].subjectId, chapterNo: chapters[52].chapterId, moduleNo: 'MOD24301B', createdAt: d(22), result: 69 },
  { reportId: 'RPT2025011', studentId: students[24].studentId, studentName: 'Tanisha Khare',  grade: grades[2].gradeId, subjectId: subjects[3].subjectId, chapterNo: chapters[53].chapterId, moduleNo: 'MOD24302A', createdAt: d(18), result: 74 },
  { reportId: 'RPT2025012', studentId: students[24].studentId, studentName: 'Tanisha Khare',  grade: grades[2].gradeId, subjectId: subjects[3].subjectId, chapterNo: chapters[53].chapterId, moduleNo: 'MOD24302B', createdAt: d(15), result: 71 },
  // English
  { reportId: 'RPT2025013', studentId: students[24].studentId, studentName: 'Tanisha Khare',  grade: grades[2].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[58].chapterId, moduleNo: 'MOD25301A', createdAt: d(13), result: 70 },
  { reportId: 'RPT2025014', studentId: students[24].studentId, studentName: 'Tanisha Khare',  grade: grades[2].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[58].chapterId, moduleNo: 'MOD25301B', createdAt: d(11), result: 68 },
  { reportId: 'RPT2025015', studentId: students[24].studentId, studentName: 'Tanisha Khare',  grade: grades[2].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[59].chapterId, moduleNo: 'MOD25302A', createdAt: d(8),  result: 72 },
  { reportId: 'RPT2025016', studentId: students[24].studentId, studentName: 'Tanisha Khare',  grade: grades[2].gradeId, subjectId: subjects[4].subjectId, chapterNo: chapters[59].chapterId, moduleNo: 'MOD25302B', createdAt: d(5),  result: 70 },
]);
// Total: 240 result reports ✓ (16 per student × 15 students)



    // ─────────────────────────────────────────
    // PERFORMANCE HISTORIES
    // ─────────────────────────────────────────
    const performanceHistories = await PerformanceHistory.insertMany([
      { performanceId: 'PER001', studentId: students[0]._id,  subjectId: subjects[0]._id, moduleId: modules[0]._id,  assessmentId: assessments[0]._id,  reportId: resultReports[0]._id,  submittedBy: d(60), result: 80 },
      { performanceId: 'PER002', studentId: students[1]._id,  subjectId: subjects[0]._id, moduleId: modules[0]._id,  assessmentId: assessments[1]._id,  reportId: resultReports[1]._id,  submittedBy: d(60), result: 75 },
      { performanceId: 'PER003', studentId: students[3]._id,  subjectId: subjects[0]._id, moduleId: modules[0]._id,  assessmentId: assessments[2]._id,  reportId: resultReports[2]._id,  submittedBy: d(60), result: 90 },
      { performanceId: 'PER004', studentId: students[5]._id,  subjectId: subjects[0]._id, moduleId: modules[0]._id,  assessmentId: assessments[3]._id,  reportId: resultReports[3]._id,  submittedBy: d(60), result: 60 },
      { performanceId: 'PER005', studentId: students[0]._id,  subjectId: subjects[0]._id, moduleId: modules[2]._id,  assessmentId: assessments[4]._id,  reportId: resultReports[4]._id,  submittedBy: d(45), result: 85 },
      { performanceId: 'PER006', studentId: students[1]._id,  subjectId: subjects[0]._id, moduleId: modules[2]._id,  assessmentId: assessments[5]._id,  reportId: resultReports[5]._id,  submittedBy: d(45), result: 70 },
      { performanceId: 'PER007', studentId: students[3]._id,  subjectId: subjects[0]._id, moduleId: modules[2]._id,  assessmentId: assessments[6]._id,  reportId: resultReports[6]._id,  submittedBy: d(45), result: 95 },
      { performanceId: 'PER008', studentId: students[0]._id,  subjectId: subjects[1]._id, moduleId: modules[5]._id,  assessmentId: assessments[7]._id,  reportId: resultReports[7]._id,  submittedBy: d(40), result: 80 },
      { performanceId: 'PER009', studentId: students[1]._id,  subjectId: subjects[1]._id, moduleId: modules[5]._id,  assessmentId: assessments[8]._id,  reportId: resultReports[8]._id,  submittedBy: d(40), result: 65 },
      { performanceId: 'PER010', studentId: students[3]._id,  subjectId: subjects[1]._id, moduleId: modules[5]._id,  assessmentId: assessments[9]._id,  reportId: resultReports[9]._id,  submittedBy: d(40), result: 75 },
      { performanceId: 'PER011', studentId: students[5]._id,  subjectId: subjects[1]._id, moduleId: modules[5]._id,  assessmentId: assessments[10]._id, reportId: resultReports[10]._id, submittedBy: d(40), result: 55 },
      { performanceId: 'PER012', studentId: students[1]._id,  subjectId: subjects[2]._id, moduleId: modules[8]._id,  assessmentId: assessments[11]._id, reportId: resultReports[11]._id, submittedBy: d(35), result: 80 },
      { performanceId: 'PER013', studentId: students[3]._id,  subjectId: subjects[2]._id, moduleId: modules[8]._id,  assessmentId: assessments[12]._id, reportId: resultReports[12]._id, submittedBy: d(35), result: 70 },
      { performanceId: 'PER014', studentId: students[5]._id,  subjectId: subjects[2]._id, moduleId: modules[8]._id,  assessmentId: assessments[13]._id, reportId: resultReports[13]._id, submittedBy: d(35), result: 90 },
      { performanceId: 'PER015', studentId: students[6]._id,  subjectId: subjects[0]._id, moduleId: modules[13]._id, assessmentId: assessments[14]._id, reportId: resultReports[14]._id, submittedBy: d(30), result: 80 },
      { performanceId: 'PER016', studentId: students[7]._id,  subjectId: subjects[0]._id, moduleId: modules[13]._id, assessmentId: assessments[15]._id, reportId: resultReports[15]._id, submittedBy: d(30), result: 85 },
      { performanceId: 'PER017', studentId: students[12]._id, subjectId: subjects[0]._id, moduleId: modules[13]._id, assessmentId: assessments[16]._id, reportId: resultReports[16]._id, submittedBy: d(30), result: 60 },
      { performanceId: 'PER018', studentId: students[14]._id, subjectId: subjects[0]._id, moduleId: modules[13]._id, assessmentId: assessments[17]._id, reportId: resultReports[17]._id, submittedBy: d(30), result: 75 },
      { performanceId: 'PER019', studentId: students[7]._id,  subjectId: subjects[3]._id, moduleId: modules[20]._id, assessmentId: assessments[18]._id, reportId: resultReports[18]._id, submittedBy: d(25), result: 90 },
      { performanceId: 'PER020', studentId: students[8]._id,  subjectId: subjects[3]._id, moduleId: modules[20]._id, assessmentId: assessments[19]._id, reportId: resultReports[19]._id, submittedBy: d(25), result: 70 },
      { performanceId: 'PER021', studentId: students[15]._id, subjectId: subjects[3]._id, moduleId: modules[20]._id, assessmentId: assessments[20]._id, reportId: resultReports[20]._id, submittedBy: d(25), result: 85 },
      { performanceId: 'PER022', studentId: students[16]._id, subjectId: subjects[3]._id, moduleId: modules[20]._id, assessmentId: assessments[21]._id, reportId: resultReports[21]._id, submittedBy: d(25), result: 80 },
      { performanceId: 'PER023', studentId: students[6]._id,  subjectId: subjects[0]._id, moduleId: modules[15]._id, assessmentId: assessments[22]._id, reportId: resultReports[22]._id, submittedBy: d(20), result: 75 },
      { performanceId: 'PER024', studentId: students[12]._id, subjectId: subjects[0]._id, moduleId: modules[15]._id, assessmentId: assessments[23]._id, reportId: resultReports[23]._id, submittedBy: d(20), result: 65 },
      { performanceId: 'PER025', studentId: students[18]._id, subjectId: subjects[0]._id, moduleId: modules[23]._id, assessmentId: assessments[24]._id, reportId: resultReports[24]._id, submittedBy: d(15), result: 70 },
      { performanceId: 'PER026', studentId: students[19]._id, subjectId: subjects[0]._id, moduleId: modules[23]._id, assessmentId: assessments[25]._id, reportId: resultReports[25]._id, submittedBy: d(15), result: 80 },
    ]);

    // ─────────────────────────────────────────
    // PAST PERFORMANCE HISTORIES  (full-year archive — earlier term results)
    // ─────────────────────────────────────────
    const pastPerformanceHistories = await PastPerformanceHistory.insertMany([
      // Arjun Mehta — Math, GRD001, two modules
      { pastPerformanceId: 'PPER001', studentId: students[0]._id,  gradeId: grades[0]._id, subjectId: subjects[0]._id, chapterId: chapters[0]._id,  moduleId: modules[0]._id,  assessmentId: assessments[0]._id,  reportId: resultReports[0]._id,  performanceId: performanceHistories[0]._id,  result: 80 },
      { pastPerformanceId: 'PPER002', studentId: students[0]._id,  gradeId: grades[0]._id, subjectId: subjects[0]._id, chapterId: chapters[1]._id,  moduleId: modules[2]._id,  assessmentId: assessments[4]._id,  reportId: resultReports[4]._id,  performanceId: performanceHistories[4]._id,  result: 85 },
      { pastPerformanceId: 'PPER003', studentId: students[0]._id,  gradeId: grades[0]._id, subjectId: subjects[1]._id, chapterId: chapters[3]._id,  moduleId: modules[5]._id,  assessmentId: assessments[7]._id,  reportId: resultReports[7]._id,  performanceId: performanceHistories[7]._id,  result: 80 },

      // Priya Patel — Math & Chemistry, GRD001
      { pastPerformanceId: 'PPER004', studentId: students[1]._id,  gradeId: grades[0]._id, subjectId: subjects[0]._id, chapterId: chapters[0]._id,  moduleId: modules[0]._id,  assessmentId: assessments[1]._id,  reportId: resultReports[1]._id,  performanceId: performanceHistories[1]._id,  result: 75 },
      { pastPerformanceId: 'PPER005', studentId: students[1]._id,  gradeId: grades[0]._id, subjectId: subjects[0]._id, chapterId: chapters[1]._id,  moduleId: modules[2]._id,  assessmentId: assessments[5]._id,  reportId: resultReports[5]._id,  performanceId: performanceHistories[5]._id,  result: 70 },
      { pastPerformanceId: 'PPER006', studentId: students[1]._id,  gradeId: grades[0]._id, subjectId: subjects[2]._id, chapterId: chapters[5]._id,  moduleId: modules[8]._id,  assessmentId: assessments[11]._id, reportId: resultReports[11]._id, performanceId: performanceHistories[11]._id, result: 80 },

      // Sneha Gupta — Math, Physics, Chemistry, GRD001
      { pastPerformanceId: 'PPER007', studentId: students[3]._id,  gradeId: grades[0]._id, subjectId: subjects[0]._id, chapterId: chapters[0]._id,  moduleId: modules[0]._id,  assessmentId: assessments[2]._id,  reportId: resultReports[2]._id,  performanceId: performanceHistories[2]._id,  result: 90 },
      { pastPerformanceId: 'PPER008', studentId: students[3]._id,  gradeId: grades[0]._id, subjectId: subjects[1]._id, chapterId: chapters[3]._id,  moduleId: modules[5]._id,  assessmentId: assessments[9]._id,  reportId: resultReports[9]._id,  performanceId: performanceHistories[9]._id,  result: 75 },
      { pastPerformanceId: 'PPER009', studentId: students[3]._id,  gradeId: grades[0]._id, subjectId: subjects[2]._id, chapterId: chapters[5]._id,  moduleId: modules[8]._id,  assessmentId: assessments[12]._id, reportId: resultReports[12]._id, performanceId: performanceHistories[12]._id, result: 70 },

      // Ananya Nair — Math, GRD002, two modules
      { pastPerformanceId: 'PPER010', studentId: students[6]._id,  gradeId: grades[1]._id, subjectId: subjects[0]._id, chapterId: chapters[9]._id,  moduleId: modules[13]._id, assessmentId: assessments[14]._id, reportId: resultReports[14]._id, performanceId: performanceHistories[14]._id, result: 80 },
      { pastPerformanceId: 'PPER011', studentId: students[6]._id,  gradeId: grades[1]._id, subjectId: subjects[0]._id, chapterId: chapters[10]._id, moduleId: modules[15]._id, assessmentId: assessments[22]._id, reportId: resultReports[22]._id, performanceId: performanceHistories[22]._id, result: 75 },

      // Kunal Shah — Math & Biology, GRD002
      { pastPerformanceId: 'PPER012', studentId: students[7]._id,  gradeId: grades[1]._id, subjectId: subjects[0]._id, chapterId: chapters[9]._id,  moduleId: modules[13]._id, assessmentId: assessments[15]._id, reportId: resultReports[15]._id, performanceId: performanceHistories[15]._id, result: 85 },
      { pastPerformanceId: 'PPER013', studentId: students[7]._id,  gradeId: grades[1]._id, subjectId: subjects[3]._id, chapterId: chapters[15]._id, moduleId: modules[20]._id, assessmentId: assessments[18]._id, reportId: resultReports[18]._id, performanceId: performanceHistories[18]._id, result: 90 },

      // Arjun Krishnan — Math, GRD003
      { pastPerformanceId: 'PPER014', studentId: students[18]._id, gradeId: grades[2]._id, subjectId: subjects[0]._id, chapterId: chapters[20]._id, moduleId: modules[23]._id, assessmentId: assessments[24]._id, reportId: resultReports[24]._id, performanceId: performanceHistories[24]._id, result: 70 },
      { pastPerformanceId: 'PPER015', studentId: students[19]._id, gradeId: grades[2]._id, subjectId: subjects[0]._id, chapterId: chapters[20]._id, moduleId: modules[23]._id, assessmentId: assessments[25]._id, reportId: resultReports[25]._id, performanceId: performanceHistories[25]._id, result: 80 },
    ]);

    // ─────────────────────────────────────────
    // STUDENT ANALYTICS  (monthly trends, one record per student-subject)
    // ─────────────────────────────────────────
    const studentAnalyticsData = await StudentAnalytics.insertMany([
      // Arjun Mehta — Math
      { analyticsId: 'SAN001', studentId: students[0]._id,  gradeId: grades[0]._id, subjectId: subjects[0]._id, chaptersId: chapters[1]._id,  modulesId: modules[2]._id,  testNo: assessments[4]._id,  performanceId: performanceHistories[4]._id,  submittedAt: d(45), timePeriod: d(45), pastPerformances: { monthly: { aug: 80, sep: 83, oct: 85 }, trend: 'improving' } },
      // Arjun Mehta — Physics
      { analyticsId: 'SAN002', studentId: students[0]._id,  gradeId: grades[0]._id, subjectId: subjects[1]._id, chaptersId: chapters[3]._id,  modulesId: modules[5]._id,  testNo: assessments[7]._id,  performanceId: performanceHistories[7]._id,  submittedAt: d(40), timePeriod: d(40), pastPerformances: { monthly: { aug: 72, sep: 75, oct: 80 }, trend: 'improving' } },

      // Priya Patel — Math
      { analyticsId: 'SAN003', studentId: students[1]._id,  gradeId: grades[0]._id, subjectId: subjects[0]._id, chaptersId: chapters[1]._id,  modulesId: modules[2]._id,  testNo: assessments[5]._id,  performanceId: performanceHistories[5]._id,  submittedAt: d(45), timePeriod: d(45), pastPerformances: { monthly: { aug: 68, sep: 70, oct: 72 }, trend: 'stable' } },
      // Priya Patel — Chemistry
      { analyticsId: 'SAN004', studentId: students[1]._id,  gradeId: grades[0]._id, subjectId: subjects[2]._id, chaptersId: chapters[5]._id,  modulesId: modules[8]._id,  testNo: assessments[11]._id, performanceId: performanceHistories[11]._id, submittedAt: d(35), timePeriod: d(35), pastPerformances: { monthly: { aug: 78, sep: 80, oct: 80 }, trend: 'stable' } },

      // Sneha Gupta — Math
      { analyticsId: 'SAN005', studentId: students[3]._id,  gradeId: grades[0]._id, subjectId: subjects[0]._id, chaptersId: chapters[0]._id,  modulesId: modules[0]._id,  testNo: assessments[2]._id,  performanceId: performanceHistories[2]._id,  submittedAt: d(60), timePeriod: d(60), pastPerformances: { monthly: { aug: 88, sep: 90, oct: 92 }, trend: 'improving' } },

      // Isha Kapoor — Physics
      { analyticsId: 'SAN006', studentId: students[5]._id,  gradeId: grades[0]._id, subjectId: subjects[1]._id, chaptersId: chapters[3]._id,  modulesId: modules[5]._id,  testNo: assessments[10]._id, performanceId: performanceHistories[10]._id, submittedAt: d(40), timePeriod: d(40), pastPerformances: { monthly: { aug: 55, sep: 53, oct: 55 }, trend: 'needs_attention' } },

      // Ananya Nair — Math (GRD002)
      { analyticsId: 'SAN007', studentId: students[6]._id,  gradeId: grades[1]._id, subjectId: subjects[0]._id, chaptersId: chapters[10]._id, modulesId: modules[15]._id, testNo: assessments[22]._id, performanceId: performanceHistories[22]._id, submittedAt: d(20), timePeriod: d(20), pastPerformances: { monthly: { sep: 80, oct: 78, nov: 75 }, trend: 'declining' } },

      // Kunal Shah — Biology (GRD002)
      { analyticsId: 'SAN008', studentId: students[7]._id,  gradeId: grades[1]._id, subjectId: subjects[3]._id, chaptersId: chapters[15]._id, modulesId: modules[20]._id, testNo: assessments[18]._id, performanceId: performanceHistories[18]._id, submittedAt: d(25), timePeriod: d(25), pastPerformances: { monthly: { sep: 85, oct: 88, nov: 90 }, trend: 'improving' } },

      // Pooja Malhotra — Math (GRD002)
      { analyticsId: 'SAN009', studentId: students[12]._id, gradeId: grades[1]._id, subjectId: subjects[0]._id, chaptersId: chapters[10]._id, modulesId: modules[15]._id, testNo: assessments[23]._id, performanceId: performanceHistories[23]._id, submittedAt: d(20), timePeriod: d(20), pastPerformances: { monthly: { sep: 60, oct: 62, nov: 65 }, trend: 'improving' } },

      // Arjun Krishnan — Math (GRD003)
      { analyticsId: 'SAN010', studentId: students[18]._id, gradeId: grades[2]._id, subjectId: subjects[0]._id, chaptersId: chapters[20]._id, modulesId: modules[23]._id, testNo: assessments[24]._id, performanceId: performanceHistories[24]._id, submittedAt: d(15), timePeriod: d(15), pastPerformances: { monthly: { oct: 65, nov: 68, dec: 70 }, trend: 'improving' } },
      // Lakshmi Pillai — Math (GRD003)
      { analyticsId: 'SAN011', studentId: students[19]._id, gradeId: grades[2]._id, subjectId: subjects[0]._id, chaptersId: chapters[20]._id, modulesId: modules[23]._id, testNo: assessments[25]._id, performanceId: performanceHistories[25]._id, submittedAt: d(15), timePeriod: d(15), pastPerformances: { monthly: { oct: 78, nov: 79, dec: 80 }, trend: 'stable' } },
    ]);

    // ─────────────────────────────────────────
    // CLASS ANALYTICS  (per grade-subject-module aggregates)
    // ─────────────────────────────────────────
    const classAnalyticsData = await ClassAnalytics.insertMany([
      // GRD001 — Math — MOD001
      { classAnalyticsId: 'CAN001', gradeId: grades[0]._id, subjectId: subjects[0]._id, moduleId: modules[0]._id,  studentId: [students[0]._id, students[1]._id, students[3]._id, students[5]._id], assessmentId: assessments[0]._id,  performanceId: performanceHistories[0]._id,  timePeriod: d(60), reportId: resultReports[0]._id  },
      // GRD001 — Math — MOD003
      { classAnalyticsId: 'CAN002', gradeId: grades[0]._id, subjectId: subjects[0]._id, moduleId: modules[2]._id,  studentId: [students[0]._id, students[1]._id, students[3]._id],                 assessmentId: assessments[4]._id,  performanceId: performanceHistories[4]._id,  timePeriod: d(45), reportId: resultReports[4]._id  },
      // GRD001 — Physics — MOD006
      { classAnalyticsId: 'CAN003', gradeId: grades[0]._id, subjectId: subjects[1]._id, moduleId: modules[5]._id,  studentId: [students[0]._id, students[1]._id, students[3]._id, students[5]._id], assessmentId: assessments[7]._id,  performanceId: performanceHistories[7]._id,  timePeriod: d(40), reportId: resultReports[7]._id  },
      // GRD001 — Chemistry — MOD009
      { classAnalyticsId: 'CAN004', gradeId: grades[0]._id, subjectId: subjects[2]._id, moduleId: modules[8]._id,  studentId: [students[1]._id, students[3]._id, students[5]._id],                 assessmentId: assessments[11]._id, performanceId: performanceHistories[11]._id, timePeriod: d(35), reportId: resultReports[11]._id },
      // GRD002 — Math — MOD014
      { classAnalyticsId: 'CAN005', gradeId: grades[1]._id, subjectId: subjects[0]._id, moduleId: modules[13]._id, studentId: [students[6]._id, students[7]._id, students[12]._id, students[14]._id], assessmentId: assessments[14]._id, performanceId: performanceHistories[14]._id, timePeriod: d(30), reportId: resultReports[14]._id },
      // GRD002 — Math — MOD016
      { classAnalyticsId: 'CAN006', gradeId: grades[1]._id, subjectId: subjects[0]._id, moduleId: modules[15]._id, studentId: [students[6]._id, students[12]._id],                               assessmentId: assessments[22]._id, performanceId: performanceHistories[22]._id, timePeriod: d(20), reportId: resultReports[22]._id },
      // GRD002 — Biology — MOD021
      { classAnalyticsId: 'CAN007', gradeId: grades[1]._id, subjectId: subjects[3]._id, moduleId: modules[20]._id, studentId: [students[7]._id, students[8]._id, students[15]._id, students[16]._id], assessmentId: assessments[18]._id, performanceId: performanceHistories[18]._id, timePeriod: d(25), reportId: resultReports[18]._id },
      // GRD003 — Math — MOD024
      { classAnalyticsId: 'CAN008', gradeId: grades[2]._id, subjectId: subjects[0]._id, moduleId: modules[23]._id, studentId: [students[18]._id, students[19]._id],                             assessmentId: assessments[24]._id, performanceId: performanceHistories[24]._id, timePeriod: d(15), reportId: resultReports[24]._id },
    ]);

    // ─────────────────────────────────────────
    // Back-fill FK links on Module (mcqPool + homeworkModuleId)
    // ─────────────────────────────────────────
    const modulePoolMap = [
      { id: modules[0]._id,  pool: mcqPools[0]._id, hw: homeworkRepos[0]._id },
      { id: modules[2]._id,  pool: mcqPools[1]._id, hw: homeworkRepos[1]._id },
      { id: modules[5]._id,  pool: mcqPools[2]._id, hw: homeworkRepos[2]._id },
      { id: modules[8]._id,  pool: mcqPools[3]._id, hw: homeworkRepos[3]._id },
      { id: modules[13]._id, pool: mcqPools[4]._id, hw: homeworkRepos[4]._id },
      { id: modules[15]._id, pool: mcqPools[4]._id, hw: homeworkRepos[5]._id },
      { id: modules[20]._id, pool: mcqPools[5]._id, hw: homeworkRepos[6]._id },
      { id: modules[23]._id, pool: mcqPools[6]._id, hw: homeworkRepos[7]._id },
    ];
    for (const m of modulePoolMap) {
      await Module.updateOne({ _id: m.id }, { $set: { mcqPool: m.pool, homeworkModuleId: m.hw } });
    }

    // Back-fill mcqBatch on Assessments
    await Assessment.updateMany({ _id: { $in: [assessments[0]._id, assessments[1]._id, assessments[2]._id, assessments[3]._id] } }, { $set: { mcqBatch: mcqBatches[0]._id } });
    await Assessment.updateMany({ _id: { $in: [assessments[4]._id, assessments[5]._id, assessments[6]._id] } },                   { $set: { mcqBatch: mcqBatches[1]._id } });
    await Assessment.updateMany({ _id: { $in: [assessments[7]._id, assessments[8]._id, assessments[9]._id, assessments[10]._id] } }, { $set: { mcqBatch: mcqBatches[2]._id } });
    await Assessment.updateMany({ _id: { $in: [assessments[11]._id, assessments[12]._id, assessments[13]._id] } },                { $set: { mcqBatch: mcqBatches[3]._id } });
    await Assessment.updateMany({ _id: { $in: [assessments[14]._id, assessments[15]._id, assessments[16]._id, assessments[17]._id] } }, { $set: { mcqBatch: mcqBatches[4]._id } });
    await Assessment.updateMany({ _id: { $in: [assessments[18]._id, assessments[19]._id, assessments[20]._id, assessments[21]._id] } }, { $set: { mcqBatch: mcqBatches[5]._id } });
    await Assessment.updateMany({ _id: { $in: [assessments[24]._id, assessments[25]._id] } },                                    { $set: { mcqBatch: mcqBatches[6]._id } });

    // ─────────────────────────────────────────
    // SUMMARY
    // ─────────────────────────────────────────
    console.log('\n✅ Mock data seeded successfully!');
    console.log(`   Schools:                  ${schools.length}`);
    console.log(`   Grades:                   ${grades.length}`);
    console.log(`   Subjects:                 ${subjects.length}`);
    console.log(`   Teachers:                 ${teachers.length}`);
    console.log(`   Students:                 ${students.length}`);
    console.log(`   Chapters:                 ${chapters.length}`);
    console.log(`   Modules:                  ${modules.length}`);
    console.log(`   MCQ Pools:                ${mcqPools.length}`);
    console.log(`   MCQ Batches:              ${mcqBatches.length}`);
    console.log(`   Assessments:              ${assessments.length}`);
    console.log(`   Homework Repos:           ${homeworkRepos.length}`);
    console.log(`   Homework Reports:         ${homeworkReports.length}`);
    console.log(`   Result Reports:           ${resultReports.length}`);
    console.log(`   Performance Histories:    ${performanceHistories.length}`);
    console.log(`   Past Perf. Histories:     ${pastPerformanceHistories.length}`);
    console.log(`   Student Analytics:        ${studentAnalyticsData.length}`);
    console.log(`   Class Analytics:          ${classAnalyticsData.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();