var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var { randomString } = require('../shared/util')

var Subject = mongoose.model('Subject')
var Course = mongoose.model('Course')

async function checkCourseName(subjectCode) {
  var courseName = subjectCode + '-' + randomString()

  if (await Course.findOne({ courseName })) {
    checkCourseName(subjectCode)
  }

  return courseName
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/subject', async function (req, res) {
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

// create course by subjectCode
// subject : course => 1 : n
router.post('/course', async function (req, res) {
  var { subjectCode, subjectId } = req.body
  var courseName = await checkCourseName(subjectCode)

  var course = await new Course({ subjectId, courseName }).save()

  if (course && course._id) {
    return res.status(201).json({ success: true, message: "Course created" })
  }

  return res.status(400).json({ error: true, message: 'Create course failed' });
});


module.exports = router;
