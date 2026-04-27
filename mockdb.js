import mongoose from 'mongoose';

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
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
  rollNo: String,
  phone: Number,
  grade: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade' },
  subjects: [String]
}, { timestamps: true });

const teacherSchema = new mongoose.Schema({
  teacherId: { type: String, required: true, unique: true },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
  name: { type: String, required: true },
  email: String,
  phone: Number,
  subjects: [String],
  grades: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Grade' }]
}, { timestamps: true });

const gradeSchema = new mongoose.Schema({
  gradeId: { type: String, required: true, unique: true },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
  teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  studentCount: Number
}, { timestamps: true });

const subjectSchema = new mongoose.Schema({
  subjectId: { type: String, required: true, unique: true },
  subjectName: { type: String, required: true },
  grade: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade' },
  teacherAssigned: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  studentsAssigned: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  chapterCount: Number,
  modulesCreated: Number
}, { timestamps: true });

const chapterSchema = new mongoose.Schema({
  chapterId: { type: String, required: true, unique: true },
  chapterName: { type: String, required: true },
  moduleId: { type: String },
  gradeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade' },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  completedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }
}, { timestamps: true });

const moduleSchema = new mongoose.Schema({
  moduleId: { type: String, required: true, unique: true },
  moduleName: { type: String, required: true },
  chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' },
  moduleContent: mongoose.Schema.Types.Mixed,
  extraTips: mongoose.Schema.Types.Mixed,
  mcqPool: { type: mongoose.Schema.Types.ObjectId, ref: 'MCQPool' },
  homeworkModuleId: { type: mongoose.Schema.Types.ObjectId, ref: 'HomeworkRepo' },
  grade: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade' },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }
}, { timestamps: true });

const homeworkRepoSchema = new mongoose.Schema({
  homeworkId: { type: String, required: true, unique: true },
  moduleName: String,
  homeworkQuestions: mongoose.Schema.Types.Mixed,
  extraTips: mongoose.Schema.Types.Mixed,
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
  moduleExtraTips: String,
  grade: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade' },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }
}, { timestamps: true });

const homeworkReportSchema = new mongoose.Schema({
  reportId: { type: String, required: true, unique: true },
  chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' },
  moduleName: String,
  homeworkQuestions: mongoose.Schema.Types.Mixed,
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
  studentId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  submittedCount: Number,
  pendingCount: Number,
  grade: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade' },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  submittedBy: Date
}, { timestamps: true });

const mcqPoolSchema = new mongoose.Schema({
  poolId: { type: String, required: true, unique: true },
  moduleMcq: mongoose.Schema.Types.Mixed,
  studentAssigned: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  grade: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade' },
  mcqBatchId: Number,
  result: mongoose.Schema.Types.Mixed
}, { timestamps: true });

const mcqBatchSchema = new mongoose.Schema({
  batchId: { type: String, required: true, unique: true },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
  assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment' },
  mcqQuestions: mongoose.Schema.Types.Mixed,
  mcqAnswers: mongoose.Schema.Types.Mixed
}, { timestamps: true });

const assessmentSchema = new mongoose.Schema({
  testNo: { type: String, required: true, unique: true },
  studentName: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
  mcqBatch: { type: mongoose.Schema.Types.ObjectId, ref: 'MCQBatch' },
  mcqPool: mongoose.Schema.Types.Mixed,
  correctAnswers: mongoose.Schema.Types.Mixed,
  submittedAt: Date,
  result: Number
}, { timestamps: true });

const resultReportSchema = new mongoose.Schema({
  reportId: { type: String, required: true, unique: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  studentName: String,
  grade: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade' },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  chapterNo: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' },
  moduleNo: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
  assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment' },
  createdAt: Date,
  result: Number
}, { timestamps: true });

const performanceHistorySchema = new mongoose.Schema({
  performanceId: { type: String, required: true, unique: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
  assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment' },
  submittedBy: Date,
  reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'ResultReport' },
  result: Number
}, { timestamps: true });

const pastPerformanceHistorySchema = new mongoose.Schema({
  pastPerformanceId: { type: String, required: true, unique: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  gradeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade' },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
  assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment' },
  reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'ResultReport' },
  performanceId: { type: mongoose.Schema.Types.ObjectId, ref: 'PerformanceHistory' },
  result: Number
}, { timestamps: true });

const studentAnalyticsSchema = new mongoose.Schema({
  analyticsId: { type: String, required: true, unique: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  gradeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade' },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  chaptersId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' },
  modulesId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
  testNo: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment' },
  performanceId: { type: mongoose.Schema.Types.ObjectId, ref: 'PerformanceHistory' },
  submittedAt: Date,
  timePeriod: Date,
  pastPerformances: mongoose.Schema.Types.Mixed
}, { timestamps: true });

const classAnalyticsSchema = new mongoose.Schema({
  classAnalyticsId: { type: String, required: true, unique: true },
  gradeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade' },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
  studentId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment' },
  performanceId: { type: mongoose.Schema.Types.ObjectId, ref: 'PerformanceHistory' },
  timePeriod: Date,
  reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'ResultReport' }
}, { timestamps: true });

const seedDatabase = async () => {
  try {
    await mongoose.connect('mongodb+srv://rishi:Rishi121@cluster0.uaicufx.mongodb.net/mockDB?appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

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
    // SCHOOLS  (5 schools across 4 states)
    // ─────────────────────────────────────────
    const schools = await School.insertMany([
      { schoolId: 'SCH001', schoolName: 'Greenfield High School',        email: 'info@greenfield.edu',            address: '123 Education Lane',    district: 'Central',    city: 'Mumbai',     state: 'Maharashtra', pincode: 400001 },
      { schoolId: 'SCH002', schoolName: 'Sunrise International School',  email: 'admin@sunrise.edu',              address: '45 Academy Road',       district: 'North',      city: 'Delhi',      state: 'Delhi',       pincode: 110001 },
      { schoolId: 'SCH003', schoolName: 'Greenfield Academy',            email: 'contact@greenfieldacademy.edu',  address: '78 Learning Street',    district: 'South',      city: 'Bangalore',  state: 'Karnataka',   pincode: 560001 },
      { schoolId: 'SCH004', schoolName: 'Delhi Public School',           email: 'admin@dps.edu',                  address: '12 Mathura Road',       district: 'East',       city: 'Delhi',      state: 'Delhi',       pincode: 110065 },
      { schoolId: 'SCH005', schoolName: 'St. Xavier\'s High School',     email: 'office@stxaviers.edu',           address: '9 Park Street',         district: 'Central',    city: 'Kolkata',    state: 'West Bengal', pincode: 700016 },
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
      { subjectId: 'SUB006', subjectName: 'History',      chapterCount: 4,  modulesCreated: 8  },
      { subjectId: 'SUB007', subjectName: 'Geography',    chapterCount: 4,  modulesCreated: 7  },
    ]);

    // ─────────────────────────────────────────
    // TEACHERS  (2–3 per school, assigned to correct subjects only)
    // ─────────────────────────────────────────
    const teachers = await Teacher.insertMany([
      // SCH001 — Greenfield High School, Mumbai
      { teacherId: 'TCH001', name: 'Rajesh Kumar',    email: 'rajesh@greenfield.edu',          phone: 9876543210, subjects: ['Mathematics'],           schoolId: schools[0]._id, grades: [grades[0]._id, grades[1]._id] },
      { teacherId: 'TCH002', name: 'Priya Sharma',    email: 'priya@greenfield.edu',            phone: 9876543211, subjects: ['Physics', 'Chemistry'],   schoolId: schools[0]._id, grades: [grades[1]._id, grades[2]._id] },
      { teacherId: 'TCH003', name: 'Neha Joshi',      email: 'neha@greenfield.edu',             phone: 9876543219, subjects: ['English', 'History'],     schoolId: schools[0]._id, grades: [grades[0]._id, grades[1]._id, grades[2]._id] },

      // SCH002 — Sunrise International School, Delhi
      { teacherId: 'TCH004', name: 'Amit Verma',      email: 'amit@sunrise.edu',                phone: 9876543212, subjects: ['Mathematics'],           schoolId: schools[1]._id, grades: [grades[0]._id, grades[1]._id] },
      { teacherId: 'TCH005', name: 'Sneha Patel',     email: 'sneha@sunrise.edu',               phone: 9876543213, subjects: ['English', 'History'],     schoolId: schools[1]._id, grades: [grades[0]._id, grades[1]._id] },
      { teacherId: 'TCH006', name: 'Rohit Desai',     email: 'rohit@sunrise.edu',               phone: 9876543220, subjects: ['Physics', 'Chemistry'],   schoolId: schools[1]._id, grades: [grades[1]._id, grades[2]._id] },

      // SCH003 — Greenfield Academy, Bangalore
      { teacherId: 'TCH007', name: 'Vikram Singh',    email: 'vikram@greenfieldacademy.edu',    phone: 9876543214, subjects: ['Biology', 'Geography'],   schoolId: schools[2]._id, grades: [grades[1]._id, grades[2]._id] },
      { teacherId: 'TCH008', name: 'Anita Rao',       email: 'anita@greenfieldacademy.edu',     phone: 9876543221, subjects: ['Mathematics'],           schoolId: schools[2]._id, grades: [grades[0]._id, grades[1]._id] },

      // SCH004 — Delhi Public School, Delhi
      { teacherId: 'TCH009', name: 'Suresh Mehta',    email: 'suresh@dps.edu',                  phone: 9876543215, subjects: ['Mathematics', 'Physics'], schoolId: schools[3]._id, grades: [grades[0]._id, grades[1]._id, grades[2]._id] },
      { teacherId: 'TCH010', name: 'Kavita Bose',     email: 'kavita@dps.edu',                  phone: 9876543222, subjects: ['English', 'Geography'],   schoolId: schools[3]._id, grades: [grades[0]._id, grades[1]._id] },

      // SCH005 — St. Xavier's, Kolkata
      { teacherId: 'TCH011', name: 'Debasish Ghosh',  email: 'debasish@stxaviers.edu',          phone: 9876543216, subjects: ['Chemistry', 'Biology'],   schoolId: schools[4]._id, grades: [grades[1]._id, grades[2]._id] },
      { teacherId: 'TCH012', name: 'Shalini Banerjee', email: 'shalini@stxaviers.edu',          phone: 9876543217, subjects: ['History', 'Geography'],   schoolId: schools[4]._id, grades: [grades[0]._id, grades[1]._id] },
    ]);

    // ─────────────────────────────────────────
    // STUDENTS  (6 per school × 3 grades = realistic ~18 sample rows)
    // Humanities students: English, History, Geography, Biology only
    // Science students: Mathematics, Physics, Chemistry, Biology/English
    // ─────────────────────────────────────────
    const students = await Student.insertMany([
      // SCH001 Grade 9 (GRD001)
      { studentId: 'STU001', name: 'Arjun Mehta',      rollNo: '101', phone: 9876540001, subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],  schoolId: schools[0]._id, grade: grades[0]._id },
      { studentId: 'STU002', name: 'Priya Patel',      rollNo: '102', phone: 9876540002, subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],  schoolId: schools[0]._id, grade: grades[0]._id },
      { studentId: 'STU003', name: 'Rahul Singh',      rollNo: '103', phone: 9876540003, subjects: ['English', 'History', 'Geography', 'Biology'],      schoolId: schools[0]._id, grade: grades[0]._id },
      { studentId: 'STU004', name: 'Sneha Gupta',      rollNo: '104', phone: 9876540004, subjects: ['Mathematics', 'Physics', 'Biology', 'English'],    schoolId: schools[0]._id, grade: grades[0]._id },
      { studentId: 'STU005', name: 'Rohan Das',        rollNo: '105', phone: 9876540005, subjects: ['English', 'History', 'Geography', 'Biology'],      schoolId: schools[0]._id, grade: grades[0]._id },
      { studentId: 'STU006', name: 'Isha Kapoor',      rollNo: '106', phone: 9876540006, subjects: ['Mathematics', 'Chemistry', 'Biology', 'English'],  schoolId: schools[0]._id, grade: grades[0]._id },

      // SCH001 Grade 10 (GRD002)
      { studentId: 'STU007', name: 'Ananya Nair',      rollNo: '201', phone: 9876540007, subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],  schoolId: schools[0]._id, grade: grades[1]._id },
      { studentId: 'STU008', name: 'Kunal Shah',       rollNo: '202', phone: 9876540008, subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology'],  schoolId: schools[0]._id, grade: grades[1]._id },
      { studentId: 'STU009', name: 'Meera Reddy',      rollNo: '203', phone: 9876540009, subjects: ['English', 'History', 'Geography', 'Biology'],      schoolId: schools[0]._id, grade: grades[1]._id },

      // SCH002 Grade 9 (GRD001)
      { studentId: 'STU010', name: 'Vikram Nair',      rollNo: '101', phone: 9876540010, subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],  schoolId: schools[1]._id, grade: grades[0]._id },
      { studentId: 'STU011', name: 'Ananya Reddy',     rollNo: '102', phone: 9876540011, subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],  schoolId: schools[1]._id, grade: grades[0]._id },
      { studentId: 'STU012', name: 'Karan Joshi',      rollNo: '103', phone: 9876540012, subjects: ['English', 'History', 'Geography', 'Biology'],      schoolId: schools[1]._id, grade: grades[0]._id },

      // SCH002 Grade 10 (GRD002)
      { studentId: 'STU013', name: 'Pooja Malhotra',   rollNo: '201', phone: 9876540013, subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],  schoolId: schools[1]._id, grade: grades[1]._id },
      { studentId: 'STU014', name: 'Aditya Kumar',     rollNo: '202', phone: 9876540014, subjects: ['English', 'History', 'Geography', 'Biology'],      schoolId: schools[1]._id, grade: grades[1]._id },
      { studentId: 'STU015', name: 'Simran Kaur',      rollNo: '203', phone: 9876540015, subjects: ['Mathematics', 'Biology', 'Chemistry', 'English'],  schoolId: schools[1]._id, grade: grades[1]._id },

      // SCH003 Grade 10 (GRD002)
      { studentId: 'STU016', name: 'Meera Iyer',       rollNo: '201', phone: 9876540016, subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology'],  schoolId: schools[2]._id, grade: grades[1]._id },
      { studentId: 'STU017', name: 'Suresh Nambiar',   rollNo: '202', phone: 9876540017, subjects: ['Mathematics', 'Physics', 'Biology', 'English'],    schoolId: schools[2]._id, grade: grades[1]._id },
      { studentId: 'STU018', name: 'Divya Menon',      rollNo: '203', phone: 9876540018, subjects: ['English', 'History', 'Geography', 'Biology'],      schoolId: schools[2]._id, grade: grades[1]._id },

      // SCH003 Grade 11 (GRD003)
      { studentId: 'STU019', name: 'Arjun Krishnan',   rollNo: '301', phone: 9876540019, subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology'],  schoolId: schools[2]._id, grade: grades[2]._id },
      { studentId: 'STU020', name: 'Lakshmi Pillai',   rollNo: '302', phone: 9876540020, subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],  schoolId: schools[2]._id, grade: grades[2]._id },

      // SCH004 Grade 9 (GRD001)
      { studentId: 'STU021', name: 'Nikhil Sharma',    rollNo: '101', phone: 9876540021, subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],  schoolId: schools[3]._id, grade: grades[0]._id },
      { studentId: 'STU022', name: 'Riya Gupta',       rollNo: '102', phone: 9876540022, subjects: ['English', 'History', 'Geography', 'Biology'],      schoolId: schools[3]._id, grade: grades[0]._id },

      // SCH005 Grade 10 (GRD002)
      { studentId: 'STU023', name: 'Sourav Chatterjee', rollNo: '201', phone: 9876540023, subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology'],  schoolId: schools[4]._id, grade: grades[1]._id },
      { studentId: 'STU024', name: 'Tanisha Bose',     rollNo: '202', phone: 9876540024, subjects: ['English', 'History', 'Geography', 'Biology'],      schoolId: schools[4]._id, grade: grades[1]._id },
    ]);

    // ─────────────────────────────────────────
    // CHAPTERS  (realistic syllabus-style names, spread across grades & subjects)
    // ─────────────────────────────────────────
    const chapters = await Chapter.insertMany([
      // Mathematics — GRD001 (Grade 9)
      { chapterId: 'CHP001', chapterName: 'Algebra Fundamentals',        moduleId: 'MODGRP001', subjectId: subjects[0]._id, gradeId: grades[0]._id, completedBy: teachers[0]._id },
      { chapterId: 'CHP002', chapterName: 'Linear Equations',            moduleId: 'MODGRP002', subjectId: subjects[0]._id, gradeId: grades[0]._id, completedBy: teachers[0]._id },
      { chapterId: 'CHP003', chapterName: 'Coordinate Geometry',         moduleId: 'MODGRP003', subjectId: subjects[0]._id, gradeId: grades[0]._id, completedBy: teachers[0]._id },

      // Physics — GRD001 (Grade 9)
      { chapterId: 'CHP004', chapterName: 'Motion and Force',            moduleId: 'MODGRP004', subjectId: subjects[1]._id, gradeId: grades[0]._id, completedBy: teachers[1]._id },
      { chapterId: 'CHP005', chapterName: 'Laws of Motion',              moduleId: 'MODGRP005', subjectId: subjects[1]._id, gradeId: grades[0]._id, completedBy: teachers[1]._id },

      // Chemistry — GRD001 (Grade 9)
      { chapterId: 'CHP006', chapterName: 'Chemical Reactions',          moduleId: 'MODGRP006', subjectId: subjects[2]._id, gradeId: grades[0]._id, completedBy: teachers[1]._id },
      { chapterId: 'CHP007', chapterName: 'Acids, Bases and Salts',      moduleId: 'MODGRP007', subjectId: subjects[2]._id, gradeId: grades[0]._id, completedBy: teachers[1]._id },

      // English — GRD001 (Grade 9)
      { chapterId: 'CHP008', chapterName: 'Reading Comprehension',       moduleId: 'MODGRP008', subjectId: subjects[4]._id, gradeId: grades[0]._id, completedBy: teachers[2]._id },
      { chapterId: 'CHP009', chapterName: 'Grammar and Composition',     moduleId: 'MODGRP009', subjectId: subjects[4]._id, gradeId: grades[0]._id, completedBy: teachers[2]._id },

      // Mathematics — GRD002 (Grade 10)
      { chapterId: 'CHP010', chapterName: 'Quadratic Equations',         moduleId: 'MODGRP010', subjectId: subjects[0]._id, gradeId: grades[1]._id, completedBy: teachers[0]._id },
      { chapterId: 'CHP011', chapterName: 'Trigonometry Basics',         moduleId: 'MODGRP011', subjectId: subjects[0]._id, gradeId: grades[1]._id, completedBy: teachers[3]._id },
      { chapterId: 'CHP012', chapterName: 'Circles and Tangents',        moduleId: 'MODGRP012', subjectId: subjects[0]._id, gradeId: grades[1]._id, completedBy: teachers[7]._id },

      // Physics — GRD002 (Grade 10)
      { chapterId: 'CHP013', chapterName: 'Light — Reflection and Refraction', moduleId: 'MODGRP013', subjectId: subjects[1]._id, gradeId: grades[1]._id, completedBy: teachers[1]._id },
      { chapterId: 'CHP014', chapterName: 'Electricity',                 moduleId: 'MODGRP014', subjectId: subjects[1]._id, gradeId: grades[1]._id, completedBy: teachers[5]._id },

      // Chemistry — GRD002 (Grade 10)
      { chapterId: 'CHP015', chapterName: 'Periodic Classification of Elements', moduleId: 'MODGRP015', subjectId: subjects[2]._id, gradeId: grades[1]._id, completedBy: teachers[5]._id },

      // Biology — GRD002 (Grade 10)
      { chapterId: 'CHP016', chapterName: 'Life Processes',              moduleId: 'MODGRP016', subjectId: subjects[3]._id, gradeId: grades[1]._id, completedBy: teachers[6]._id },
      { chapterId: 'CHP017', chapterName: 'Control and Coordination',    moduleId: 'MODGRP017', subjectId: subjects[3]._id, gradeId: grades[1]._id, completedBy: teachers[6]._id },

      // History — GRD002 (Grade 10)
      { chapterId: 'CHP018', chapterName: 'Nationalism in Europe',       moduleId: 'MODGRP018', subjectId: subjects[5]._id, gradeId: grades[1]._id, completedBy: teachers[4]._id },
      { chapterId: 'CHP019', chapterName: 'Nationalism in India',        moduleId: 'MODGRP019', subjectId: subjects[5]._id, gradeId: grades[1]._id, completedBy: teachers[11]._id },

      // Geography — GRD002 (Grade 10)
      { chapterId: 'CHP020', chapterName: 'Resources and Development',   moduleId: 'MODGRP020', subjectId: subjects[6]._id, gradeId: grades[1]._id, completedBy: teachers[6]._id },

      // Mathematics — GRD003 (Grade 11)
      { chapterId: 'CHP021', chapterName: 'Sets and Functions',          moduleId: 'MODGRP021', subjectId: subjects[0]._id, gradeId: grades[2]._id, completedBy: teachers[8]._id },
      { chapterId: 'CHP022', chapterName: 'Permutations and Combinations', moduleId: 'MODGRP022', subjectId: subjects[0]._id, gradeId: grades[2]._id, completedBy: teachers[8]._id },

      // Physics — GRD003 (Grade 11)
      { chapterId: 'CHP023', chapterName: 'Units and Measurements',      moduleId: 'MODGRP023', subjectId: subjects[1]._id, gradeId: grades[2]._id, completedBy: teachers[8]._id },
      { chapterId: 'CHP024', chapterName: 'Kinematics',                  moduleId: 'MODGRP024', subjectId: subjects[1]._id, gradeId: grades[2]._id, completedBy: teachers[8]._id },
    ]);

    // ─────────────────────────────────────────
    // MODULES  (2 per chapter minimum; content JSON realistic)
    // ─────────────────────────────────────────
    const modules = await Module.insertMany([
      // CHP001 — Algebra Fundamentals (Math, GRD001)
      { moduleId: 'MOD001', moduleName: 'Introduction to Algebra',          chapterId: chapters[0]._id,  grade: grades[0]._id, subject: subjects[0]._id, moduleContent: { text: 'Constants, variables, and basic expressions', videoUrl: 'https://learn.example.com/mod/algebra-intro' }, extraTips: { tip1: 'Practice substituting values into expressions daily' }, createdBy: teachers[0]._id },
      { moduleId: 'MOD002', moduleName: 'Variables and Expressions',         chapterId: chapters[0]._id,  grade: grades[0]._id, subject: subjects[0]._id, moduleContent: { text: 'Building and simplifying algebraic expressions', exercises: ['Simplify 3x + 2x', 'Expand 2(x+3)'] }, extraTips: { tip1: 'Remember BODMAS order of operations' }, createdBy: teachers[0]._id },

      // CHP002 — Linear Equations (Math, GRD001)
      { moduleId: 'MOD003', moduleName: 'Solving One-Variable Equations',    chapterId: chapters[1]._id,  grade: grades[0]._id, subject: subjects[0]._id, moduleContent: { text: 'Step-by-step equation solving with one unknown', videoUrl: 'https://learn.example.com/mod/linear-eq1' }, extraTips: { tip1: 'Always check your solution by substituting back' }, createdBy: teachers[0]._id },
      { moduleId: 'MOD004', moduleName: 'Word Problems — Linear Equations',  chapterId: chapters[1]._id,  grade: grades[0]._id, subject: subjects[0]._id, moduleContent: { text: 'Translating real-world problems into equations' }, extraTips: { tip1: 'Identify what the variable represents before writing the equation' }, createdBy: teachers[0]._id },

      // CHP003 — Coordinate Geometry (Math, GRD001)
      { moduleId: 'MOD005', moduleName: 'The Cartesian Plane',               chapterId: chapters[2]._id,  grade: grades[0]._id, subject: subjects[0]._id, moduleContent: { text: 'Plotting points and understanding quadrants', videoUrl: 'https://learn.example.com/mod/cartesian' }, extraTips: { tip1: 'Remember: (x, y) — x is horizontal, y is vertical' }, createdBy: teachers[0]._id },

      // CHP004 — Motion and Force (Physics, GRD001)
      { moduleId: 'MOD006', moduleName: "Newton's Laws of Motion",           chapterId: chapters[3]._id,  grade: grades[0]._id, subject: subjects[1]._id, moduleContent: { text: "All three laws with real-life examples", videoUrl: 'https://learn.example.com/mod/newtons-laws' }, extraTips: { tip1: 'Visualize every problem with a free-body diagram' }, createdBy: teachers[1]._id },
      { moduleId: 'MOD007', moduleName: 'Speed, Velocity and Acceleration',  chapterId: chapters[3]._id,  grade: grades[0]._id, subject: subjects[1]._id, moduleContent: { text: 'Difference between scalar and vector motion quantities' }, extraTips: { tip1: 'Direction matters for velocity — always specify it' }, createdBy: teachers[1]._id },

      // CHP005 — Laws of Motion (Physics, GRD001)
      { moduleId: 'MOD008', moduleName: 'Friction and Its Types',            chapterId: chapters[4]._id,  grade: grades[0]._id, subject: subjects[1]._id, moduleContent: { text: 'Static, kinetic and rolling friction with applications' }, extraTips: { tip1: 'Friction always opposes relative motion' }, createdBy: teachers[1]._id },

      // CHP006 — Chemical Reactions (Chemistry, GRD001)
      { moduleId: 'MOD009', moduleName: 'Types of Chemical Reactions',       chapterId: chapters[5]._id,  grade: grades[0]._id, subject: subjects[2]._id, moduleContent: { text: 'Combination, decomposition, displacement reactions', videoUrl: 'https://learn.example.com/mod/chem-reactions' }, extraTips: { tip1: 'Memorise the activity series for displacement reactions' }, createdBy: teachers[1]._id },
      { moduleId: 'MOD010', moduleName: 'Balancing Chemical Equations',      chapterId: chapters[5]._id,  grade: grades[0]._id, subject: subjects[2]._id, moduleContent: { text: 'Conservation of mass and balancing techniques' }, extraTips: { tip1: 'Balance atoms on both sides — start with metals, end with hydrogen/oxygen' }, createdBy: teachers[1]._id },

      // CHP007 — Acids, Bases and Salts (Chemistry, GRD001)
      { moduleId: 'MOD011', moduleName: 'pH Scale and Indicators',           chapterId: chapters[6]._id,  grade: grades[0]._id, subject: subjects[2]._id, moduleContent: { text: 'Understanding pH, litmus, and universal indicators' }, extraTips: { tip1: 'pH < 7 = acidic, pH = 7 = neutral, pH > 7 = basic' }, createdBy: teachers[1]._id },

      // CHP008 — Reading Comprehension (English, GRD001)
      { moduleId: 'MOD012', moduleName: 'Identifying Main Idea and Details', chapterId: chapters[7]._id,  grade: grades[0]._id, subject: subjects[4]._id, moduleContent: { text: 'Techniques for locating topic sentences and supporting evidence' }, extraTips: { tip1: 'Read the passage twice before attempting questions' }, createdBy: teachers[2]._id },

      // CHP009 — Grammar and Composition (English, GRD001)
      { moduleId: 'MOD013', moduleName: 'Tenses and Voice',                  chapterId: chapters[8]._id,  grade: grades[0]._id, subject: subjects[4]._id, moduleContent: { text: 'Active/passive voice transformations and all tense forms', videoUrl: 'https://learn.example.com/mod/tenses' }, extraTips: { tip1: 'Practice converting 10 sentences a day between active and passive' }, createdBy: teachers[2]._id },

      // CHP010 — Quadratic Equations (Math, GRD002)
      { moduleId: 'MOD014', moduleName: 'Factorisation Method',              chapterId: chapters[9]._id,  grade: grades[1]._id, subject: subjects[0]._id, moduleContent: { text: 'Splitting the middle term and grouping to factorise quadratics', videoUrl: 'https://learn.example.com/mod/factorisation' }, extraTips: { tip1: 'Always verify roots by substituting back into the equation' }, createdBy: teachers[3]._id },
      { moduleId: 'MOD015', moduleName: 'Quadratic Formula and Discriminant', chapterId: chapters[9]._id, grade: grades[1]._id, subject: subjects[0]._id, moduleContent: { text: 'Using the quadratic formula and interpreting discriminant values' }, extraTips: { tip1: 'Discriminant > 0 means two real roots; < 0 means no real roots' }, createdBy: teachers[3]._id },

      // CHP011 — Trigonometry Basics (Math, GRD002)
      { moduleId: 'MOD016', moduleName: 'Trigonometric Ratios',              chapterId: chapters[10]._id, grade: grades[1]._id, subject: subjects[0]._id, moduleContent: { text: 'sin, cos, tan and their reciprocals with right-angle triangles', videoUrl: 'https://learn.example.com/mod/trig-ratios' }, extraTips: { tip1: 'Use SOH-CAH-TOA to remember the ratios' }, createdBy: teachers[3]._id },
      { moduleId: 'MOD017', moduleName: 'Trigonometric Identities',          chapterId: chapters[10]._id, grade: grades[1]._id, subject: subjects[0]._id, moduleContent: { text: 'Proving standard identities and applying them to simplify expressions' }, extraTips: { tip1: 'Start with the more complex side when proving identities' }, createdBy: teachers[0]._id },

      // CHP013 — Light (Physics, GRD002)
      { moduleId: 'MOD018', moduleName: 'Reflection of Light',               chapterId: chapters[12]._id, grade: grades[1]._id, subject: subjects[1]._id, moduleContent: { text: 'Laws of reflection, spherical mirrors and mirror formula', videoUrl: 'https://learn.example.com/mod/light-reflection' }, extraTips: { tip1: 'Use the sign convention consistently (New Cartesian)' }, createdBy: teachers[1]._id },
      { moduleId: 'MOD019', moduleName: 'Refraction and Lenses',             chapterId: chapters[12]._id, grade: grades[1]._id, subject: subjects[1]._id, moduleContent: { text: 'Snell\'s law, refractive index, convex and concave lenses' }, extraTips: { tip1: 'Power of a lens P = 1/f (in metres); note the sign of f' }, createdBy: teachers[5]._id },

      // CHP014 — Electricity (Physics, GRD002)
      { moduleId: 'MOD020', moduleName: "Ohm's Law and Resistance",          chapterId: chapters[13]._id, grade: grades[1]._id, subject: subjects[1]._id, moduleContent: { text: "Ohm's law, factors affecting resistance, resistivity" }, extraTips: { tip1: 'Draw the circuit diagram first, then apply formulas' }, createdBy: teachers[5]._id },

      // CHP016 — Life Processes (Biology, GRD002)
      { moduleId: 'MOD021', moduleName: 'Nutrition in Plants and Animals',   chapterId: chapters[15]._id, grade: grades[1]._id, subject: subjects[3]._id, moduleContent: { text: 'Autotrophic vs heterotrophic nutrition, photosynthesis, digestion', videoUrl: 'https://learn.example.com/mod/nutrition' }, extraTips: { tip1: 'Draw and label the digestive system from memory for practice' }, createdBy: teachers[6]._id },
      { moduleId: 'MOD022', moduleName: 'Respiration and Transportation',    chapterId: chapters[15]._id, grade: grades[1]._id, subject: subjects[3]._id, moduleContent: { text: 'Aerobic vs anaerobic respiration, circulatory system overview' }, extraTips: { tip1: 'Link respiration to the chemical equation: C₆H₁₂O₆ + O₂ → CO₂ + H₂O + energy' }, createdBy: teachers[6]._id },

      // CHP018 — Nationalism in Europe (History, GRD002)
      { moduleId: 'MOD023', moduleName: 'The Rise of Nationalism in Europe', chapterId: chapters[17]._id, grade: grades[1]._id, subject: subjects[5]._id, moduleContent: { text: 'French Revolution, nation-states, unification of Germany and Italy' }, extraTips: { tip1: 'Create a timeline of key European nationalist events 1789–1871' }, createdBy: teachers[4]._id },

      // CHP021 — Sets and Functions (Math, GRD003)
      { moduleId: 'MOD024', moduleName: 'Introduction to Sets',              chapterId: chapters[20]._id, grade: grades[2]._id, subject: subjects[0]._id, moduleContent: { text: 'Set notation, Venn diagrams, union, intersection, complement', videoUrl: 'https://learn.example.com/mod/sets-intro' }, extraTips: { tip1: 'Always draw a Venn diagram for three-set problems' }, createdBy: teachers[8]._id },
      { moduleId: 'MOD025', moduleName: 'Functions and Their Types',         chapterId: chapters[20]._id, grade: grades[2]._id, subject: subjects[0]._id, moduleContent: { text: 'Domain, range, one-one, onto and bijective functions' }, extraTips: { tip1: 'Horizontal line test identifies whether a function is one-one' }, createdBy: teachers[8]._id },
    ]);

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
    const resultReports = await ResultReport.insertMany([
      // Math GRD001 — MOD001
      { reportId: 'RPT001', studentId: students[0]._id,  studentName: 'Arjun Mehta',      grade: grades[0]._id, subjectId: subjects[0]._id, chapterNo: chapters[0]._id,  moduleNo: modules[0]._id,  assessmentId: assessments[0]._id,  createdAt: d(60), result: 80 },
      { reportId: 'RPT002', studentId: students[1]._id,  studentName: 'Priya Patel',      grade: grades[0]._id, subjectId: subjects[0]._id, chapterNo: chapters[0]._id,  moduleNo: modules[0]._id,  assessmentId: assessments[1]._id,  createdAt: d(60), result: 75 },
      { reportId: 'RPT003', studentId: students[3]._id,  studentName: 'Sneha Gupta',      grade: grades[0]._id, subjectId: subjects[0]._id, chapterNo: chapters[0]._id,  moduleNo: modules[0]._id,  assessmentId: assessments[2]._id,  createdAt: d(60), result: 90 },
      { reportId: 'RPT004', studentId: students[5]._id,  studentName: 'Isha Kapoor',      grade: grades[0]._id, subjectId: subjects[0]._id, chapterNo: chapters[0]._id,  moduleNo: modules[0]._id,  assessmentId: assessments[3]._id,  createdAt: d(60), result: 60 },

      // Math GRD001 — MOD003
      { reportId: 'RPT005', studentId: students[0]._id,  studentName: 'Arjun Mehta',      grade: grades[0]._id, subjectId: subjects[0]._id, chapterNo: chapters[1]._id,  moduleNo: modules[2]._id,  assessmentId: assessments[4]._id,  createdAt: d(45), result: 85 },
      { reportId: 'RPT006', studentId: students[1]._id,  studentName: 'Priya Patel',      grade: grades[0]._id, subjectId: subjects[0]._id, chapterNo: chapters[1]._id,  moduleNo: modules[2]._id,  assessmentId: assessments[5]._id,  createdAt: d(45), result: 70 },
      { reportId: 'RPT007', studentId: students[3]._id,  studentName: 'Sneha Gupta',      grade: grades[0]._id, subjectId: subjects[0]._id, chapterNo: chapters[1]._id,  moduleNo: modules[2]._id,  assessmentId: assessments[6]._id,  createdAt: d(45), result: 95 },

      // Physics GRD001 — MOD006
      { reportId: 'RPT008', studentId: students[0]._id,  studentName: 'Arjun Mehta',      grade: grades[0]._id, subjectId: subjects[1]._id, chapterNo: chapters[3]._id,  moduleNo: modules[5]._id,  assessmentId: assessments[7]._id,  createdAt: d(40), result: 80 },
      { reportId: 'RPT009', studentId: students[1]._id,  studentName: 'Priya Patel',      grade: grades[0]._id, subjectId: subjects[1]._id, chapterNo: chapters[3]._id,  moduleNo: modules[5]._id,  assessmentId: assessments[8]._id,  createdAt: d(40), result: 65 },
      { reportId: 'RPT010', studentId: students[3]._id,  studentName: 'Sneha Gupta',      grade: grades[0]._id, subjectId: subjects[1]._id, chapterNo: chapters[3]._id,  moduleNo: modules[5]._id,  assessmentId: assessments[9]._id,  createdAt: d(40), result: 75 },
      { reportId: 'RPT011', studentId: students[5]._id,  studentName: 'Isha Kapoor',      grade: grades[0]._id, subjectId: subjects[1]._id, chapterNo: chapters[3]._id,  moduleNo: modules[5]._id,  assessmentId: assessments[10]._id, createdAt: d(40), result: 55 },

      // Chemistry GRD001 — MOD009
      { reportId: 'RPT012', studentId: students[1]._id,  studentName: 'Priya Patel',      grade: grades[0]._id, subjectId: subjects[2]._id, chapterNo: chapters[5]._id,  moduleNo: modules[8]._id,  assessmentId: assessments[11]._id, createdAt: d(35), result: 80 },
      { reportId: 'RPT013', studentId: students[3]._id,  studentName: 'Sneha Gupta',      grade: grades[0]._id, subjectId: subjects[2]._id, chapterNo: chapters[5]._id,  moduleNo: modules[8]._id,  assessmentId: assessments[12]._id, createdAt: d(35), result: 70 },
      { reportId: 'RPT014', studentId: students[5]._id,  studentName: 'Isha Kapoor',      grade: grades[0]._id, subjectId: subjects[2]._id, chapterNo: chapters[5]._id,  moduleNo: modules[8]._id,  assessmentId: assessments[13]._id, createdAt: d(35), result: 90 },

      // Math GRD002 — MOD014
      { reportId: 'RPT015', studentId: students[6]._id,  studentName: 'Ananya Nair',      grade: grades[1]._id, subjectId: subjects[0]._id, chapterNo: chapters[9]._id,  moduleNo: modules[13]._id, assessmentId: assessments[14]._id, createdAt: d(30), result: 80 },
      { reportId: 'RPT016', studentId: students[7]._id,  studentName: 'Kunal Shah',       grade: grades[1]._id, subjectId: subjects[0]._id, chapterNo: chapters[9]._id,  moduleNo: modules[13]._id, assessmentId: assessments[15]._id, createdAt: d(30), result: 85 },
      { reportId: 'RPT017', studentId: students[12]._id, studentName: 'Pooja Malhotra',   grade: grades[1]._id, subjectId: subjects[0]._id, chapterNo: chapters[9]._id,  moduleNo: modules[13]._id, assessmentId: assessments[16]._id, createdAt: d(30), result: 60 },
      { reportId: 'RPT018', studentId: students[14]._id, studentName: 'Simran Kaur',      grade: grades[1]._id, subjectId: subjects[0]._id, chapterNo: chapters[9]._id,  moduleNo: modules[13]._id, assessmentId: assessments[17]._id, createdAt: d(30), result: 75 },

      // Biology GRD002 — MOD021
      { reportId: 'RPT019', studentId: students[7]._id,  studentName: 'Kunal Shah',       grade: grades[1]._id, subjectId: subjects[3]._id, chapterNo: chapters[15]._id, moduleNo: modules[20]._id, assessmentId: assessments[18]._id, createdAt: d(25), result: 90 },
      { reportId: 'RPT020', studentId: students[8]._id,  studentName: 'Meera Reddy',      grade: grades[1]._id, subjectId: subjects[3]._id, chapterNo: chapters[15]._id, moduleNo: modules[20]._id, assessmentId: assessments[19]._id, createdAt: d(25), result: 70 },
      { reportId: 'RPT021', studentId: students[15]._id, studentName: 'Meera Iyer',       grade: grades[1]._id, subjectId: subjects[3]._id, chapterNo: chapters[15]._id, moduleNo: modules[20]._id, assessmentId: assessments[20]._id, createdAt: d(25), result: 85 },
      { reportId: 'RPT022', studentId: students[16]._id, studentName: 'Suresh Nambiar',   grade: grades[1]._id, subjectId: subjects[3]._id, chapterNo: chapters[15]._id, moduleNo: modules[20]._id, assessmentId: assessments[21]._id, createdAt: d(25), result: 80 },

      // Math GRD002 — MOD016
      { reportId: 'RPT023', studentId: students[6]._id,  studentName: 'Ananya Nair',      grade: grades[1]._id, subjectId: subjects[0]._id, chapterNo: chapters[10]._id, moduleNo: modules[15]._id, assessmentId: assessments[22]._id, createdAt: d(20), result: 75 },
      { reportId: 'RPT024', studentId: students[12]._id, studentName: 'Pooja Malhotra',   grade: grades[1]._id, subjectId: subjects[0]._id, chapterNo: chapters[10]._id, moduleNo: modules[15]._id, assessmentId: assessments[23]._id, createdAt: d(20), result: 65 },

      // Math GRD003 — MOD024
      { reportId: 'RPT025', studentId: students[18]._id, studentName: 'Arjun Krishnan',   grade: grades[2]._id, subjectId: subjects[0]._id, chapterNo: chapters[20]._id, moduleNo: modules[23]._id, assessmentId: assessments[24]._id, createdAt: d(15), result: 70 },
      { reportId: 'RPT026', studentId: students[19]._id, studentName: 'Lakshmi Pillai',   grade: grades[2]._id, subjectId: subjects[0]._id, chapterNo: chapters[20]._id, moduleNo: modules[23]._id, assessmentId: assessments[25]._id, createdAt: d(15), result: 80 },
    ]);

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