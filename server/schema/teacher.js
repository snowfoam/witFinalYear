var mongoose = require('mongoose')
var cryptoJs = require('crypto-js')
var { validatePassword } = require('../shared/util')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var TeacherSchema = new Schema({
    email: {
        unique: true,
        type: String
    },
    name: {
        firstName: String,
        lastName: String,
    },
    password: String,
    courses: [{
        type: ObjectId,
        ref: 'Course'
    }]
})

TeacherSchema.pre('save', function (next) {
    this.password = cryptoJs.SHA1(this.password).toString()
    next()
})

//  static methods
TeacherSchema.methods = {
    validatePassword,
}

mongoose.model('Teacher', TeacherSchema)
