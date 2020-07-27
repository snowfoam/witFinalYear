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
  if (userType === 'student') {
    var { courses, examCourses } = await Student.findOne({ _id })
    return res.json({ success: true, data: courses, examCourses, message: "" })
  } else if (userType === 'teacher') {
    var user = await Teacher.findOne({ _id })
    return res.json({ success: true, data: user.courses, message: "" })
  } else {
    return res.json({ success: false, message: 'User not found' });
  }
});

/* /logout */
router.post('/logout', (req, res) => {
  res.clearCookie('token')
  return res.json({ success: true, message: 'logged out.' })
});

module.exports = router;
