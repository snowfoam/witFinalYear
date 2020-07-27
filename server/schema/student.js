var mongoose = require('mongoose')
var cryptoJs = require('crypto-js')
var { validatePassword } = require('../shared/util')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var StudentSchema = new Schema({
    email: {
        unique: true,
        type: String
    },
    name: {
        firstName: String,
        lastName: String,
    },
    password: String,
    exams: [{
        type: ObjectId,
        ref: 'Exam'
    }],
    examCourses: [{
        type: ObjectId,
        ref: 'Course'
    }],
    courses: [{
        type: ObjectId,
        ref: 'Course'
    }]
})

//  static methods
StudentSchema.methods = {
    validatePassword,
}

mongoose.model('Student', StudentSchema)
