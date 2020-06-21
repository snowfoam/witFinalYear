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
    return res.status(400).json({ error: true, message: "No email or password!" })
  } else if (await Student.findOne({ email })) {
    return res.status(409).json({ error: true, message: "Student already exists!" })
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
  return res.status(400).json({ error: true, message: 'Register failed' });
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

  return res.status(401).json({ error: true, message: 'Wrong email or password' })
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

  return res.status(401).json({ error: true, message: 'Apply exam failed' })
});

module.exports = router;
