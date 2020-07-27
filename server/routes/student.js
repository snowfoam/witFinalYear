var express = require('express');
var cryptoJs = require('crypto-js')
var jwt = require('jsonwebtoken')
var router = express.Router();
var mongoose = require('mongoose')
var { secretkey } = require('../shared/constant')
var { authStudent } = require('../middleware/user')
var { sampleSize, intersection } = require('lodash')

var Student = mongoose.model('Student')
var Course = mongoose.model('Course')
var Question = mongoose.model('Question')
var Exam = mongoose.model('Exam')
var ObjectId = id => mongoose.Types.ObjectId(id).toString()
/**
 * /student/register
 * Register a new student
 */
router.post('/register', async (req, res) => {
  var { email, password, firstName, lastName } = req.body
  if (!(email && password)) {
    return res.json({ success: false, message: "No email or password!" })
  } else if (await Student.findOne({ email })) {
    return res.json({ success: false, message: "Student already exists!" })
  }

  var option = {
    email,
    password: cryptoJs.SHA1(password).toString(),
    name: {
      firstName,
      lastName,
    },
    courses: [],
    exams: []
  }

  var student = await new Student(option).save()

  if (student && student._id) {
    return res.json({ success: true, message: "Student registered" })
  }
  return res.json({ success: false, message: 'Register failed' });
});

/**
 * /student/login
 * Log in to existing account
 */
router.post('/login', async (req, res) => {
  var { email, password } = req.body
  var student = await Student.findOne({ email, password: cryptoJs.SHA1(password).toString() })

  if (student && student._id) {
    return res.json({
      success: true,
      message: '',
      token: jwt.sign({ id: student._id, userType: 'student' }, secretkey, {
        expiresIn: 86400
      }),
      token_type: "Bearer",
      expires_in: 86400
    })
  }

  return res.json({ success: false, message: 'Wrong email or password' })
});

/**
 * /student/getInfo
 */
router.get('/getInfo', authStudent, async (req, res) => {
  var { _id } = req.body
  var student = await Student.findOne({ _id })

  if (student && student._id) {
    var { _id, email, name, courses, exams, examCourses } = student
    return res.json({
      success: true,
      message: '',
      data: { _id, email, name, courses, exams, examCourses }
    })
  }

  return res.json({ success: false, message: "get info error" })
});

/**
 * /student/course/apply
 * add course by student
 */
router.post('/course/apply', authStudent, async (req, res) => {
  var { courseId, _id } = req.body

  var User = Student
  var user = await User.findOne({ _id })
  if (user && user.courses.includes(courseId)) {
    return res.json({ success: false, message: 'Already applied.' })
  }

  user.courses.push(courseId)
  await user.save()

  return res.json({ success: true, message: "Course applied." })
});

/**
 * /course/cancle
 * cancle course by user
 */
router.post('/course/cancle', authStudent, async (req, res) => {
  var { courseId, _id, userType } = req.body

  var User
  if (userType === 'student') {
    User = Student
  } else if (userType === 'teacher') {
    User = Teacher
  } else {
    return res.json({ success: false, message: 'User type error' });
  }

  var user = await User.findOne({ _id })
  if (user && !user.courses.includes(courseId)) {
    return res.json({ success: false, message: 'not found.' })
  }

  var index = user.courses.indexOf(courseId)
  user.courses.splice(index, 1)
  await user.save()

  var exams = await Exam.find({ courseId })
  Promise.all(exams.map(item => {
    item.status = 'course-closed'
    return item.save()
  }))

  return res.json({ success: true, message: "Course cancled." })
});

/**
 * /student/exam/query
 * student query exams
 */
router.get('/exam/query', authStudent, async (req, res) => {
  var { _id } = req.body
  var student = await Student.findOne({ _id })
  var data = await Promise.all((student.exams || []).map(item => new Promise((resolve, reject) => {
    Exam.findOne({ _id: item })
      .then(exam => {
        exam.questions = []
        resolve(exam)
      })
      .catch(e =>
        reject(e.message)
      )
  })))
  return res.json({ success: true, data, message: "" })
});

/**
 * /student/exam/queryById
 * student query exams
 */
router.get('/exam/queryById', authStudent, async (req, res) => {
  var { examId } = req.query
  var exam = await Exam.findOne({ _id: examId })

  if (exam && exam._id) {
    // set sended answer null
    exam.questions.forEach(question => {
      question.answer = null
    })
    var course = await Course.findOne({ _id: exam.courseId })
    exam.courseName = course.courseName
    return res.json({ success: true, data: exam, message: "" })
  }

  return res.json({ success: false, message: 'Not found' })
});

/**
 * /student/exam/apply
 * student apply an exam
 */
router.post('/exam/apply', authStudent, async (req, res) => {
  var { _id, courseId } = req.body

  var { subjectId } = await Course.findOne({ _id: courseId })
  var questions = await Question.find({ subjectId })

  var exam = await new Exam({
    studentId: _id,
    courseId,
    createTime: new Date().getTime(),
    beginTime: null,
    endTime: null,
    score: null,
    status: 'nostart',
    duration: 60,
    questions: sampleSize(questions, 10)
  }).save()

  if (exam && exam._id) {
    var student = await Student.findOne({ _id })
    student.examCourses.push(courseId)
    student.exams.push(exam._id)
    await student.save()

    return res.json({ success: true, message: "Exam applied" })
  }

  return res.json({ success: false, message: 'Apply exam failed' })
});

/**
 * /student/exam/start
 * student start an exam
 */
router.post('/exam/start', authStudent, async (req, res) => {
  var { examId } = req.body
  var exam = await Exam.findOne({ _id: examId })
  if (exam && exam._id) {
    exam.beginTime = new Date().getTime() + 30 * 1000
    exam.endTime = new Date().getTime() + 30 * 1000 + 60 * 60 * 1000
    exam.status = 'processing'
    await exam.save()

    // set sended answer null
    exam.questions.forEach(question => {
      question.answer = null
    })
    return res.json({ success: true, data: exam, message: "" })
  }

  return res.json({ success: false, message: 'start exam failed' })
});

/**
 * /student/exam/submit
 * student submit answers
 */
router.post('/exam/submit', authStudent, async (req, res) => {
  var { examId, answers } = req.body
  var exam = await Exam.findOne({ _id: examId })
  if (exam && exam._id) {
    var correct = 0
    var errorList = []

    exam.questions.forEach(item => {
      var obj = answers.find(o => o._id === ObjectId(item._id))
      if (item.type === 'multiple') {
        var list = intersection(item.answer, obj.answer)
        if (list.length === answers.length) {
          correct++
        } else {
          errorList.push(obj._id)
        }
      } else {
        if (obj.answer.toString() === item.answer.toString()) {
          correct++
        } else {
          errorList.push(obj._id)
        }
      }
    })

    exam.score = Math.ceil(correct * 100 / exam.questions.length)
    exam.status = 'ended'
    await exam.save()

    return res.json({
      success: true,
      data: {
        score: exam.score,
        errorList
      },
      message: ""
    })
  }

  return res.json({ success: false, message: 'submit exam failed' })
});

/**
 * /student/exam/cancle
 * student cancle an exam
 */
router.post('/exam/cancle', authStudent, async (req, res) => {
  var { _id, examId } = req.body
  var exam = await Exam.findOne({ _id: examId })
  if (exam && exam._id) {
    exam.status = 'cancled'
    await exam.save()
    return res.json({ success: true, message: "Exam cancled" })
  }

  return res.json({ success: false, message: 'cancle exam failed' })
});

module.exports = router;
