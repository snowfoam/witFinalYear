var express = require('express');
var cryptoJs = require('crypto-js')
var jwt = require('jsonwebtoken')
var router = express.Router();
var mongoose = require('mongoose')
var { secretkey } = require('../shared/constant')
var { authStudent } = require('../middleware/user')
var { sampleSize } = require('lodash')

var Student = mongoose.model('Student')
var Course = mongoose.model('Course')
var Question = mongoose.model('Question')
var Exam = mongoose.model('Exam')

/**
 * /student/register
 * Register a new student
 */
router.post('/register', async (req, res) => {
  var { email, password, firstName, lastName } = req.body
  if (!(email && password)) {
    return res.status(400).json({ success: false, message: "No email or password!" })
  } else if (await Student.findOne({ email })) {
    return res.status(409).json({ success: false, message: "Student already exists!" })
  }

  var option = {
    email,
    password,
    name: {
      firstName,
      lastName,
    },
    courses: [],
    exams: []
  }

  var student = await new Student(option).save()

  if (student && student._id) {
    return res.status(201).json({ success: true, message: "Student registered" })
  }
  return res.status(400).json({ success: false, message: 'Register failed' });
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
      token: jwt.sign({ id: student._id, userType: 'student' }, secretkey, {
        expiresIn: 86400
      }),
      token_type: "Bearer",
      expires_in: 86400
    })
  }

  return res.status(401).json({ success: false, message: 'Wrong email or password' })
});

/**
 * /student/getInfo
 */
router.get('/getInfo', authStudent, async (req, res) => {
  var { _id } = req.body
  var student = await Student.findOne({ _id })

  if (student && student._id) {
    var { _id, email, name, courses, exams } = student
    return res.json({
      data: { _id, email, name, courses, exams }
    })
  }

  return res.status(401).json({ success: false, message: "get info error" })
});

/**
 * /student/exam/query
 * student query exams
 */
router.get('/exam/query', authStudent, async (req, res) => {
  var { _id } = req.body
  var student = await Student.findOne({ _id })
  var data = await Promise.all(student.exams.map(item => new Promise((resolve, reject) => {
    Exam.findOne({ _id: item }).then(exam => { resolve(exam) }).catch(e => reject(e.message))
  })))
  return res.status(200).json({ success: true, data, message: "" })
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
    student.exams.push(exam._id)
    await student.save()

    return res.status(201).json({ success: true, message: "Exam applied" })
  }

  return res.status(401).json({ success: false, message: 'Apply exam failed' })
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
    return res.status(200).json({ success: true, message: "Exam cancled" })
  }

  return res.status(500).json({ success: false, message: 'cancle exam failed' })
});

module.exports = router;
