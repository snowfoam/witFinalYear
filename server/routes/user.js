var express = require('express');
var cryptoJs = require('crypto-js')
var jwt = require('jsonwebtoken')
var router = express.Router();
var mongoose = require('mongoose')

var Student = mongoose.model('Student')
var Teacher = mongoose.model('Teacher')

/**
 * /user/register(/:userType)
 * Register a new student or teacher account
 */
router.post('/register(/:userType)?', async (req, res) => {
  var userType = req.params.userType
  var User

  if (userType === 'teacher') {
    User = Teacher
  } else if (userType === undefined) {
    User = Student
  } else {
    return res.status(400).json({ error: true, message: "Wrong request!" })
  }

  var { email, password, passwordAgain, firstName, lastName } = req.body

  if (!(email && password)) {
    return res.status(400).json({ error: true, message: "No email or password!" })
  } else if (password !== passwordAgain) {
    return res.status(400).json({ error: true, message: "Passwords not same!" })
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

  if (!userType) {
    option.exams = []
  }

  var user = await new User(option).save()

  if (user._id) {
    return res.status(201).json({ success: true, message: "User registered" })
  }
  return res.status(400).json({ error: true, message: 'Register failed' });
});

module.exports = router;
