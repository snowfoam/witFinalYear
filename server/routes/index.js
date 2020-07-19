var express = require('express');
var router = express.Router();
var { authUser } = require('../middleware/user')
var mongoose = require('mongoose')
var Subject = mongoose.model('Subject')
var Course = mongoose.model('Course')
var Teacher = mongoose.model('Teacher')
var Student = mongoose.model('Student')
var Question = mongoose.model('Question')
/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

/* /subjects */
router.get('/subjects', authUser, async (req, res) => {
  const data = await Subject.find()
  return res.json({ success: true, data, message: "" })
});

/* /courses */
router.get('/courses', authUser, async (req, res) => {
  const data = await Course.find()
  return res.json({ success: true, data, message: "" })
});

/* /questions */
router.get('/questions', authUser, async (req, res) => {
  var { type, subjectId } = req.query
  var params = {}
  if (type) params.type = type
  if (subjectId) params.subjectId = new mongoose.Types.ObjectId(subjectId)

  const data = await Question.find(params)
  return res.json({ success: true, data, message: "" })
});

/* /course */
router.get('/user/courses', authUser, async (req, res) => {
  var { _id, userType } = req.body
  var user
  if (userType === 'student') {
    user = await Student.findOne({ _id })
  } else if (userType === 'teacher') {
    user = await Teacher.findOne({ _id })
  } else {
    return res.json({ success: false, message: 'User not found' });
  }

  if (!user) {
    return res.json({ success: false, message: 'User not found' });
  }

  return res.json({ success: true, data: user.courses, message: "" })
});


/**
 * /course/add
 * add course by user
 */
router.post('/course/add', authUser, async (req, res) => {
  var { courseId, _id, userType } = req.body

  var User
  if (userType === 'student') {
    User = Student
  } else if (userType === 'teacher') {
    User = Teacher
  } else {
    return res.json({ success: false, message: 'User type error' });
  }

  var user = await User.findOne({ courses: { $all: [courseId] } })
  if (user && user._id.toString() !== _id) {
    return res.json({ success: false, message: 'Unavaliable.' })
  }

  var user = await User.findOne({ _id })
  if (user && user.courses.includes(courseId)) {
    return res.json({ success: false, message: 'Already added.' })
  }

  user.courses.push(courseId)
  await user.save()

  return res.json({ success: true, message: "Course added." })
});

/**
 * /course/cancle
 * cancle course by user
 */
router.post('/course/cancle', authUser, async (req, res) => {
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

  return res.json({ success: true, message: "Course cancled." })
});

/* /logout */
router.post('/logout', (req, res) => {
  res.clearCookie('token')
  return res.json({ success: true, message: 'logged out.' })
});

module.exports = router;
