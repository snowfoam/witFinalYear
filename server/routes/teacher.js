var express = require('express');
var cryptoJs = require('crypto-js')
var jwt = require('jsonwebtoken')
var router = express.Router();
var xlsx = require('node-xlsx').default;
var upload = require('multer')()
var mongoose = require('mongoose')
var { secretkey } = require('../shared/constant')
var { authTeacher } = require('../middleware/user')
var { intersection } = require('lodash')

var Course = mongoose.model('Course')
var Student = mongoose.model('Student')
var Teacher = mongoose.model('Teacher')
var Subject = mongoose.model('Subject')
var Question = mongoose.model('Question')
var Exam = mongoose.model('Exam')

/**
 * /teacher/register
 * Register a new teacher account
 */
router.post('/register', async (req, res) => {
  var { email, password, firstName, lastName } = req.body
  if (!(email && password)) {
    return res.json({ success: false, message: "No email or password!" })
  } else if (await Teacher.findOne({ email })) {
    return res.json({ success: false, message: "Teacher already exists!" })
  }

  var option = {
    email,
    password: cryptoJs.SHA1(password).toString(),
    name: {
      firstName,
      lastName,
    },
    courses: []
  }

  var teacher = await new Teacher(option).save()
  if (teacher && teacher._id) {
    return res.json({ success: true, message: "Teacher registered" })
  }
  return res.json({ success: false, message: 'Register failed' });
});


/**
 * /teacher/login
 * Log in to existing account
 */
router.post('/login', async (req, res) => {
  var { email, password } = req.body
  var teacher = await Teacher.findOne({ email, password: cryptoJs.SHA1(password).toString() })

  if (teacher && teacher._id) {
    return res.json({
      success: true,
      message: '',
      token: jwt.sign({ id: teacher._id, userType: 'teacher' }, secretkey, {
        expiresIn: 86400
      }),
      token_type: "Bearer",
      expires_in: 86400
    })
  }

  return res.json({ success: false, message: 'Wrong email or password' })
});

/**
 * /teacher/getInfo
 */
router.get('/getInfo', authTeacher, async (req, res) => {
  var { _id } = req.body
  var teacher = await Teacher.findOne({ _id })

  if (teacher && teacher._id) {
    var { _id, email, name, courses } = teacher
    return res.json({
      success: true,
      message: '',
      data: { _id, email, name, courses }
    })
  }

  return res.json({ success: false, message: "get info error" })
});

/**
 * /teacher/subject/create
 * Create a new subject
 */
router.post('/subject/create', authTeacher, async function (req, res) {
  var { subjectName, subjectCode } = req.body

  if (await Subject.findOne({ subjectName })) {
    return res.json({ success: false, message: "Subject already exists!" })
  }

  var subject = await new Subject({ subjectName, subjectCode }).save()

  if (subject && subject._id) {
    return res.json({ success: true, message: "Subject created" })
  }

  return res.json({ success: false, message: 'Create subject failed' });
});

/**
 * /teacher/subject/update
 * update a new subject
 */
router.post('/subject/update', authTeacher, async function (req, res) {
  var { subjectId, subjectName, subjectCode } = req.body

  var subject = await Subject.findOne({ _id: subjectId })
  if (!subject) {
    return res.json({ success: false, message: "Subject not found!" })
  }

  subject.subjectCode = subjectCode
  subject.subjectName = subjectName

  await subject.save()
  return res.json({ success: true, message: 'subject updated' });
});
/**
 * /teacher/subject/remove
 * remove a subject
 */
router.post('/subject/remove', authTeacher, async function (req, res) {
  var { subjectId } = req.body

  var subject = await Subject.findOne({ _id: subjectId })

  if (!subject) {
    return res.json({ success: false, message: "Subject not found!" })
  }

  var { deletedCount } = await Subject.deleteOne({ _id: subjectId })
  if (deletedCount === 1) {
    return res.json({ success: true, message: "Subject removed." })
  }

  return res.json({ success: false, message: 'Remove subject failed' })

});

/**
 * /teacher/course/close
 * close course
 */
router.post('/course/close', authTeacher, async function (req, res) {
  var { courseId } = req.body

  var course = await Course.findOne({ _id: courseId })
  course.status = 'closed'
  await course.save()
  var exams = await Exam.find({ courseId })
  Promise.all(exams.map(item => {
    item.status = 'course-closed'
    return item.save()
  }))

  return res.json({ success: true, message: 'closed.' })

})
/**
 * /teacher/course/create
 * create course by subjectCode
 * subject : course => 1 : n
 */
router.post('/course/create', authTeacher, async function (req, res) {
  var { courseName, _id, subjectId, description } = req.body
  var subject = await Subject.findOne({ _id: subjectId })
  if (await Course.findOne({ courseName })) {
    return res.json({ success: false, message: 'course name already exsited.' })
  }

  var teacher = await Teacher.findOne({ _id })
  var { name: { lastName, firstName } } = teacher
  var course = await new Course({
    subjectId,
    subjectName: subject.subjectName,
    courseName,
    teacherId: teacher._id,
    teacherName: `${firstName} ${lastName}`,
    description,
    status: 'open'
  }).save()

  if (course && course._id) {
    try {
      teacher.courses.push(course._id)
      await teacher.save()
      return res.json({ success: true, message: 'added.' })
    } catch (error) {
      return res.json({ success: false, message: 'Course created but assigning failed' });
    }
  }

  return res.json({ success: false, message: 'Create course failed' });
});


/**
 * /teacher/course/remove
 * remove course by teacher
 */
router.post('/course/remove', authTeacher, async (req, res) => {
  var { courseId: _id } = req.body
  var course = await Course.findOne({ _id })
  if (!course) {
    return res.json({ success: false, message: 'Not found.' })
  } else {
    var { deletedCount } = await Course.deleteOne({ _id })
    if (deletedCount === 1) {
      return res.json({ success: true, message: "removed." })
    }

    return res.json({ success: false, message: 'Remove failed' })
  }
});

/**
 * /teacher/question/create
 * Create a new question
 */
router.post('/question/create', authTeacher, async function (req, res) {
  var { type, article, options, answer, subjectId } = req.body
  var question = await new Question({ type, article, options, answer, subjectId }).save()

  if (question && question._id) {
    return res.json({ success: true, message: "Question created" })
  }

  return res.json({ success: false, message: 'Create question failed' });
});

/**
 * /teacher/question/createByUpload
 * Create questions by excel file
 */
router.post('/question/createByUpload', authTeacher, upload.single('excel'), async function (req, res) {
  try {
    var data = xlsx.parse(req.file.buffer) // list
    var subjectId = req.body.subjectId
    var first = data[0].data[0]
    var len = data[0].data.length
    var list = []

    for (let index = 1; index < len; index++) {
      var obj = { subjectId }
      first.forEach((item, i) => {
        obj[item] = data[0].data[index][i]
      })
      list.push(obj)
    }
    await Question.insertMany(list)
    return res.json({ success: true, data: list, message: "Question created" })
  } catch (error) {
    return res.json({ success: false, message: 'Create question failed' });
  }
});

/**
 * /teacher/question/update
 * Update a new question
 */
router.post('/question/update', authTeacher, async function (req, res) {
  var { questionId, type, article, options, answer, subjectId } = req.body

  var question = await Question.findOne({ _id: questionId })
  if (!question) {
    return res.json({ success: false, message: "Question not found!" })
  }

  Object.assign(question, { type, article, options, answer, subjectId })

  await question.save()
  return res.json({ success: true, message: 'question updated' });
});

/**
 * /teacher/question/remove
 * remove question by teacher
 */
router.post('/question/remove', authTeacher, async (req, res) => {
  var { questionId: _id } = req.body
  var question = await Question.findOne({ _id })
  if (!question) {
    return res.json({ success: false, message: 'Not found.' })
  } else {
    var { deletedCount } = await Question.deleteOne({ _id })
    if (deletedCount === 1) {
      return res.json({ success: true, message: "Question removed." })
    }

    return res.json({ success: false, message: 'Remove question failed' })
  }
});

/**
 * /teacher/exams
 * teacher's exams
 */
router.get('/exams', authTeacher, async (req, res) => {
  var { _id } = req.body
  var teacher = await Teacher.findOne({ _id })
  try {
    var exams = await Promise.all(teacher.courses.map(courseId =>
      new Promise((resolve, reject) => {
        Exam.find({ courseId })
          .then(data => resolve({ courseId, data }))
          .catch(err => reject(err))
      })))
    return res.json({ success: true, data: exams, message: '' })
  } catch (error) {
    return res.json({ success: false, data: null, message: error.message })
  }
});
/**
 * /teacher/students
 * query students who apply the teacher's courses
 */
router.get('/students', authTeacher, async (req, res) => {
  var { _id } = req.body
  var teacher = await Teacher.findOne({ _id })
  try {
    var { courses } = teacher

    var students = await Student.find()
    students = students.filter(item => {
      var l1 = item.courses.map(o => String(o))
      var l2 = courses.map(o => String(o))
      var l3 = intersection(l1, l2)
      return l3.length
    })

    var studentObject = {}
    students.forEach(item => {
      studentObject[item._id] = `${item.name.firstName} ${item.name.lastName}`
    })


    var examIds = []
    students.forEach(student => {
      examIds = examIds.concat(student.exams)
    })

    var result = await Promise.all(examIds.map(examId => {
      return new Promise((resolve) => {
        Exam.findOne({ _id: examId })
          .then(data => resolve(data))
      })
    }))

    var list =
      result.filter(item => courses.includes(item.courseId))
        .map(item => {
          item.studentName = studentObject[item.studentId]
          return item
        })

    return res.json({ success: true, data: { list, studentObject }, message: '' })
  } catch (error) {
    return res.json({ success: false, data: null, message: error.message })
  }
});

/**
 * /teacher/getExamDetailById
 * teacher's exams
 */
router.get('/getExamDetailById', authTeacher, async (req, res) => {
  var { examId } = req.query
  try {
    var exam = await Exam.findOne({ _id: examId })
    var { studentId, courseId } = exam
    var student = await Student.findOne({ _id: studentId })
    var course = await Course.findOne({ _id: courseId })
    var { name, email } = student
    var { studentId, courseId, createTime, beginTime, endTime, status, score, duration, questions } = exam
    var { teacherId, teacherName, subjectName, description, courseName, subjectId } = course

    var data = {
      studentName: `${name.firstName} ${name.lastName}`,
      studentId,
      studentEmail,
      courseName,
      courseId,
      teacherName,
      teacherId,
      subjectName,
      subjectId,
      createTime,
      beginTime,
      endTime,
      status,
      score,
      duration,
      description,
      questions,
    }

    return res.json({ success: true, data, message: '' })

  } catch (error) {
    return res.json({ success: false, data: null, message: error.message })
  }
});

module.exports = router;
