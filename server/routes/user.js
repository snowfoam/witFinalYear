var express = require('express');
var cryptoJs = require('crypto-js')
var jwt = require('jsonwebtoken')
var router = express.Router();
var mongoose = require('mongoose')
var { secretkey } = require('../shared/constant')
var { checkUserType, checkTeacherAuth } = require('../middleware/user')

var Student = mongoose.model('Student')
var Teacher = mongoose.model('Teacher')

/**
 * /user/register(/:userType)
 * Register a new student or teacher account
 */
router.post('/register(/:userType)?', checkUserType, async (req, res) => {
  var userType = req.params.userType
  var { email, password, firstName, lastName } = req.body

  var User = userType ? Teacher : Student

  if (!(email && password)) {
    return res.status(400).json({ error: true, message: "No email or password!" })
  } else if (await User.findOne({ email })) {
    return res.status(409).json({ error: true, message: "User already exists!" })
  }

  var option = {
    email,
    password,
    name: {
      firstName,
      lastName,
    },
    courses: []
  }

  if (!userType) { // student
    option.exams = []
  }

  var user = await new User(option).save()

  if (user && user._id) {
    return res.status(201).json({ success: true, message: "User registered" })
  }
  return res.status(400).json({ error: true, message: 'Register failed' });
});


/**
 * /user/login(/:userType)?
 * Log in to existing account
 */
router.post('/login(/:userType)?', checkUserType, async (req, res) => {
  var userType = req.params.userType ? 'teacher' : 'student'
  var { email, password } = req.body

  var User = userType === 'teacher' ? Teacher : Student

  var user = await User.findOne({ email, password: cryptoJs.SHA1(password).toString() })

  if (user && user._id) {
    return res.json({
      token: jwt.sign({ id: user._id, userType }, secretkey, {
        expiresIn: 86400
      }),
      token_type: "Bearer",
      expires_in: 86400
    })
  }

  return res.status(401).json({ error: true, message: 'Wrong email or password' })
});

/**
 * /user/addCourse
 * add course by teacher
 */
router.post('/addCourse', checkTeacherAuth, async (req, res) => {
  var { courseId, _id } = req.body
  var teacher = await Teacher.findOne({ courses: { $all: [courseId] } })

  if (teacher && teacher._id.toString() !== _id) {
    return res.status(401).json({ error: true, message: 'Unavaliable.' })
  }

  var teacher = await Teacher.findOne({ _id })
  if (teacher && teacher.courses.includes(courseId)) {
    return res.status(401).json({ error: true, message: 'Already added.' })
  }

  teacher.courses.push(courseId)
  await teacher.save()

  return res.status(200).json({ success: true, message: "Course added." })
});

/**
 * /user/removeCourse
 * remove course by teacher
 */
router.post('/removeCourse', checkTeacherAuth, async (req, res) => {
  var { courseId, _id } = req.body
  var teacher = await Teacher.findOne({ _id })
  if (teacher && !teacher.courses.includes(courseId)) {
    return res.status(401).json({ error: true, message: 'Already removed.' })
  }

  var index = teacher.courses.indexOf(courseId)
  teacher.courses.splice(index, 1)
  await teacher.save()

  return res.status(200).json({ success: true, message: "Course removed." })
});

module.exports = router;
