var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var ExamSchema = new Schema({
    studentId: String,
    courseId: String,
    createTime: Date,
    beginTime: Date,
    endTime: Date,
    status: String, // nostart | processing | ended
    score: Number,
    duration: {
        type: Number,
        default: 60 // minutes
    },
    details: [{
        questionId: {
            type: ObjectId,
            ref: 'Question'
        },
        anwser: {
            type: String | Number | Boolean
        }
    }]
})

mongoose.model('Exam', ExamSchema)
