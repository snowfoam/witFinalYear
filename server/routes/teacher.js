var express = require('express');
var cryptoJs = require('crypto-js')
var jwt = require('jsonwebtoken')
var router = express.Router();
var mongoose = require('mongoose')
var { secretkey } = require('../shared/constant')
var { authTeacher } = require('../middleware/user')
var { randomString } = require('../shared/util')

var Course = mongoose.model('Course')
var Teacher = mongoose.model('Teacher')
var Subject = mongoose.model('Subject')
var Question = mongoose.model('Question')

async function checkCourseName(subjectCode) {
  var courseName = subjectCode + '-' + randomString()

  if (await Course.findOne({ courseName })) {
    checkCourseName(subjectCode)
  }

  return courseName
}

/**
 * /teacher/register
 * Register a new teacher account
 */
router.post('/register', async (req, res) => {
  var { email, password, firstName, lastName } = req.body
  if (!(email && password)) {
    return res.status(400).json({ error: true, message: "No email or password!" })
  } else if (await Teacher.findOne({ email })) {
    return res.status(409).json({ error: true, message: "Teacher already exists!" })
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

  var teacher = await new Teacher(option).save()
  if (teacher && teacher._id) {
    return res.status(201).json({ success: true, message: "Teacher registered" })
  }
  return res.status(400).json({ error: true, message: 'Register failed' });
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
      token: jwt.sign({ id: teacher._id, userType: 'teacher' }, secretkey, {
        expiresIn: 86400
      }),
      token_type: "Bearer",
      expires_in: 86400
    })
  }

  return res.status(401).json({ error: true, message: 'Wrong email or password' })
});

/**
 * /teacher/subject/create
 * Create a new subject
 */
router.post('/subject/create', authTeacher, async function (req, res) {
  var { subjectName, subjectCode } = req.body

  if (await Subject.findOne({ subjectName })) {
    return res.status(409).json({ error: true, message: "Subject already exists!" })
  }

  var subject = await new Subject({ subjectName, subjectCode }).save()

  if (subject && subject._id) {
    return res.status(201).json({ success: true, message: "Subject created" })
  }

  return res.status(400).json({ error: true, message: 'Create subject failed' });
});

/**
 * /teacher/course/create
 * create course by subjectCode
 * subject : course => 1 : n
 */
router.post('/course/create', async function (req, res) {
  var { subjectCode, subjectId } = req.body
  var courseName = await checkCourseName(subjectCode)

  var course = await new Course({ subjectId, courseName }).save()
  if (course && course._id) {
    return res.status(201).json({ success: true, message: "Course created" })
  }

  return res.status(400).json({ error: true, message: 'Create course failed' });
});

/**
 * /teacher/course/add
 * add course by teacher
 */
router.post('/course/add', authTeacher, async (req, res) => {
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
 * /teacher/course/remove
 * remove course by teacher
 */
router.post('/course/remove', authTeacher, async (req, res) => {
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

/**
 * /teacher/question/create
 * Create a new question
 */
router.post('/question/create', authTeacher, async function (req, res) {
  var { type, article, options, answer, subjectId } = req.body
  var question = await new Question({ type, article, options, answer, subjectId }).save()

  if (question && question._id) {
    return res.status(201).json({ success: true, message: "Question created" })
  }

  return res.status(400).json({ error: true, message: 'Create question failed' });
});

/**
 * /teacher/question/remove
 * remove question by teacher
 */
router.post('/question/remove', authTeacher, async (req, res) => {
  var { questionId: _id } = req.body
  var question = await Question.findOne({ _id })
  if (!question) {
    return res.status(401).json({ error: true, message: 'Not found.' })
  } else {
    var { deletedCount } = await Question.deleteOne({ _id })
    if (deletedCount === 1) {
      return res.status(200).json({ success: true, message: "Question removed." })
    }

    return res.status(500).json({ error: true, message: 'Remove question failed' })
  }
});

module.exports = router;
