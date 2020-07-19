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
    return res.json({ success: false, message: "No email or password!" })
  } else if (await Teacher.findOne({ email })) {
    return res.json({ success: false, message: "Teacher already exists!" })
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
 * /teacher/course/create
 * create course by subjectCode
 * subject : course => 1 : n
 */
router.post('/course/create', async function (req, res) {
  var { subjectCode, subjectId } = req.body
  var courseName = await checkCourseName(subjectCode)

  var course = await new Course({ subjectId, courseName }).save()
  if (course && course._id) {
    return res.json({ success: true, message: "Course created" })
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

module.exports = router;
