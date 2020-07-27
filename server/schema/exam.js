var mongoose = require('mongoose')
var Schema = mongoose.Schema
var Question = require('./question')
var ExamSchema = new Schema({
    studentId: String,
    courseId: String,
    createTime: Date,
    beginTime: Date,
    endTime: Date,
    status: String, // nostart | processing | ended | cancled | course-closed
    score: Number,
    duration: {
        type: Number,
        default: 60 // minutes
    },
    questions: { type: [Question] }
})

mongoose.model('Exam', ExamSchema)
